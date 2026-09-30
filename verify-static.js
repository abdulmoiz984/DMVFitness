/**
 * Static check over the whole app: every file must parse, every relative
 * import must resolve, and every named import must actually be exported.
 * Also flags Lucide icon names that aren't in the bundled glyphmap.
 */
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const parser = require('@babel/parser');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.js')) files.push(p);
  }
})(SRC);
files.push(path.join(ROOT, 'App.js'), path.join(ROOT, 'index.js'));

const rel = f => path.relative(ROOT, f);
const PARSE_OPTS = { sourceType: 'module', plugins: ['jsx', 'classProperties', 'objectRestSpread'] };

let compileFails = 0;
const exportsOf = new Map();
const astOf = new Map();

for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, PARSE_OPTS);
  } catch (e) {
    console.log('PARSE FAIL', rel(f), e.message.split('\n')[0]);
    compileFails++;
    continue;
  }
  try {
    babel.transformSync(code, { cwd: ROOT, filename: f, code: false });
  } catch (e) {
    console.log('BABEL FAIL', rel(f), e.message.split('\n')[0]);
    compileFails++;
  }
  astOf.set(f, ast);

  const names = new Set();
  for (const node of ast.program.body) {
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration) {
        if (node.declaration.declarations) {
          // handles both `export const x = ...` and `export const { a, b } = ...`
          for (const d of node.declaration.declarations) {
            if (d.id.type === 'Identifier') names.add(d.id.name);
            else if (d.id.type === 'ObjectPattern') {
              for (const prop of d.id.properties) {
                if (prop.type === 'ObjectProperty' && prop.value.type === 'Identifier') names.add(prop.value.name);
                else if (prop.type === 'RestElement' && prop.argument.name) names.add(prop.argument.name);
              }
            }
          }
        }
        else if (node.declaration.id) names.add(node.declaration.id.name);
      }
      (node.specifiers || []).forEach(s => names.add(s.exported.name));
    } else if (node.type === 'ExportDefaultDeclaration') names.add('default');
    else if (node.type === 'ExportAllDeclaration') names.add('*');
  }
  exportsOf.set(f, names);
}
console.log(`parsed ${files.length} files — ${compileFails} failures`);

const resolve = (from, spec) => {
  const base = path.resolve(path.dirname(from), spec);
  for (const cand of [base + '.js', path.join(base, 'index.js'), base]) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand;
  }
  return null;
};

// `export * from` re-exports have to be followed to know a barrel's names.
const namesFor = (file, seen = new Set()) => {
  if (seen.has(file)) return new Set();
  seen.add(file);
  const own = new Set(exportsOf.get(file) || []);
  if (!own.has('*')) return own;
  own.delete('*');
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/export\s+\*\s+from\s+['"](\.[^'"]+)['"]/g)) {
    const target = resolve(file, m[1]);
    if (target) for (const n of namesFor(target, seen)) if (n !== 'default') own.add(n);
  }
  return own;
};

let missing = 0;
let unresolved = 0;
for (const f of files) {
  const ast = astOf.get(f);
  if (!ast) continue;
  for (const node of ast.program.body) {
    if (node.type !== 'ImportDeclaration') continue;
    const spec = node.source.value;
    if (!spec.startsWith('.')) continue;
    if (spec.endsWith('.json')) continue; // JSON modules have no ESM export list
    const target = resolve(f, spec);
    if (!target) {
      console.log('UNRESOLVED', rel(f), '->', spec);
      unresolved++;
      continue;
    }
    const exp = namesFor(target);
    for (const s of node.specifiers) {
      if (s.type === 'ImportDefaultSpecifier') {
        if (!exp.has('default')) { console.log('NO DEFAULT EXPORT', spec, 'imported by', rel(f)); missing++; }
      } else if (s.type === 'ImportSpecifier') {
        const n = s.imported.name;
        if (!exp.has(n)) { console.log('MISSING EXPORT', n, 'in', spec, 'imported by', rel(f)); missing++; }
      }
    }
  }
}
console.log(`unresolved imports: ${unresolved} · missing named exports: ${missing}`);

// Icon names must exist in the bundled Lucide glyphmap.
const glyphs = require('@react-native-vector-icons/lucide/glyphmaps/Lucide.json');
let badIcons = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/<Icon\s+name="([a-z0-9-]+)"/g)) {
    if (!(m[1] in glyphs)) { console.log('UNKNOWN ICON', m[1], 'in', rel(f)); badIcons++; }
  }
}
console.log(`unknown Lucide icons: ${badIcons}`);

// Fonts referenced in styles must be bundled.
const fontDir = path.join(SRC, 'assets/fonts');
const fonts = new Set(fs.readdirSync(fontDir).filter(n => n.endsWith('.ttf')).map(n => n.replace('.ttf', '')));
let badFonts = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/fontFamily:\s*'([^']+)'/g)) {
    if (!fonts.has(m[1])) { console.log('UNKNOWN FONT', m[1], 'in', rel(f)); badFonts++; }
  }
}
console.log(`unknown fonts: ${badFonts}`);

// RN 0.87 silently drops spread absoluteFillObject.
let spreads = 0;
for (const f of files) {
  if (/\.\.\.StyleSheet\.absoluteFillObject/.test(fs.readFileSync(f, 'utf8'))) {
    console.log('ABSOLUTE FILL SPREAD', rel(f));
    spreads++;
  }
}
console.log(`absoluteFillObject spreads: ${spreads}`);

// Every navigate() target must be a registered route.
const stack = fs.readFileSync(path.join(SRC, 'navigation/StackNavigator.js'), 'utf8');
const tabs = fs.readFileSync(path.join(SRC, 'navigation/MainTabs.js'), 'utf8');
const routes = new Set([
  ...[...stack.matchAll(/<Stack\.Screen\s+name="(\w+)"/g)].map(m => m[1]),
  ...[...tabs.matchAll(/<Tab\.Screen\s+name="(\w+)"/g)].map(m => m[1]),
]);
let badRoutes = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/navigation\.(?:navigate|replace|push)\(\s*'(\w+)'/g)) {
    if (!routes.has(m[1])) { console.log('UNKNOWN ROUTE', m[1], 'in', rel(f)); badRoutes++; }
  }
  for (const m of src.matchAll(/screen:\s*'(\w+)'/g)) {
    if (!routes.has(m[1])) { console.log('UNKNOWN TAB ROUTE', m[1], 'in', rel(f)); badRoutes++; }
  }
}
console.log(`unknown navigation targets: ${badRoutes} (of ${routes.size} routes)`);
