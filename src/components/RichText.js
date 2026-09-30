import React from 'react';
import { Image } from 'react-native';
import { COLORS, FONTS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import Icon from '../helpers/Icon';
import { Typography } from '../atomComponents';
import { EMOJI_IMAGES } from '../assets/images';

/**
 * Glyphs the bundled fonts do not carry and Apple Color Emoji has no picture
 * for. Lucide ships all of them, so they are drawn as inline icons at the
 * surrounding text's size and colour.
 */
const GLYPH_ICONS = {
  '✓': 'check',
  '✔': 'check',
  '→': 'arrow-right',
  '➔': 'arrow-right',
  '←': 'arrow-left',
};

/** Emoji sequences (including ZWJ and variation selectors) and the glyphs above. */
const TOKEN =
  /(\p{Extended_Pictographic}️?(?:‍\p{Extended_Pictographic}️?)*|[✓✔→➔←])/gu;

/**
 * Renders a sentence that mixes words with emoji or symbol glyphs.
 *
 * Plain <Text> cannot show either: the simulator draws no emoji at all, and
 * none of the bundled fonts carry ✓ or →. Each glyph is swapped for the PNG
 * or icon that matches it, and the words around it stay selectable text.
 */
export const RichText = ({ children, size = 14, color = COLORS.foreground, fFamily, ...rest }) => {
  const glyphSize = Sizer.fS(size);

  // Only strings are tokenized; nested elements — a bold handle before a
  // caption, say — pass through untouched so they keep flowing inline.
  const render = (node, path) => {
    if (node == null || typeof node === 'boolean') return null;
    if (Array.isArray(node)) return node.map((child, i) => render(child, `${path}.${i}`));
    if (typeof node !== 'string' && typeof node !== 'number') return node;

    return String(node)
      .split(TOKEN)
      .filter(part => part !== '' && part !== undefined)
      .map((part, i) => {
        const key = `${path}.${i}`;
        const source = EMOJI_IMAGES[part] ?? EMOJI_IMAGES[part.replace(/️/g, '')];
        if (source) {
          return (
            <Image
              key={key}
              source={source}
              resizeMode="contain"
              style={{ width: glyphSize, height: glyphSize }}
            />
          );
        }
        const icon = GLYPH_ICONS[part];
        if (icon) return <Icon key={key} name={icon} size={glyphSize} color={color} />;
        return part;
      });
  };

  return (
    <Typography size={size} color={color} fFamily={fFamily} {...rest}>
      {render(children, 'r')}
    </Typography>
  );
};

export const richTextFonts = FONTS;

export default RichText;
