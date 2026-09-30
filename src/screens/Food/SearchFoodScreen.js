import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { Emoji } from '../../components';
import { SHELL_MAX_WIDTH, TABBAR_CLEARANCE } from '../../constants';
import { searchFoodDatabase } from '../../lib/food-data';
import { addFoodToMeal, showToast } from '../../redux/slices/appSlice';

const MEAL_TYPES = [
  { type: 'breakfast', label: 'Breakfast', icon: 'coffee', target: 550 },
  { type: 'lunch', label: 'Lunch', icon: 'sun', target: 750 },
  { type: 'dinner', label: 'Dinner', icon: 'moon', target: 650 },
  { type: 'snack', label: 'Snack', icon: 'cookie', target: 250 },
];

const CATEGORIES = [
  { id: 'All', emoji: '🔥', label: 'All Foods' },
  { id: 'Protein', emoji: '🥩', label: 'High Protein' },
  { id: 'Meals', emoji: '🍲', label: 'Meal Preps' },
  { id: 'Carbs', emoji: '🍚', label: 'Clean Carbs' },
];

const POPULAR = ['Chicken Breast', 'Greek Yogurt', 'Salmon', 'Jasmine Rice', 'Eggs', 'Oats'];

const MacroCell = ({ label, value, tint }) => (
  <View style={styles.macroCell}>
    <Typography size={10} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase">
      {label}
    </Typography>
    <Typography size={12.5} fFamily="monoBold700" color={tint}>
      {`${value}g`}
    </Typography>
  </View>
);

/** Screen 20 · Search Food */
const SearchFoodScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('chicken');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedMealType, setSelectedMealType] = useState('lunch');
  const [expandedFoodId, setExpandedFoodId] = useState('f1');
  const [servingMultipliers, setServingMultipliers] = useState({ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1, f6: 1 });
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredFoods = searchFoodDatabase.filter(f => {
    const q = query.toLowerCase();
    const matchesQuery =
      query === '' || f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const handleLogFood = (food, multiplier) => {
    const calories = Math.round(food.calories * multiplier);
    dispatch(
      addFoodToMeal({
        name: food.name,
        serving: multiplier === 1 ? food.baseServing : `${multiplier}x (${food.baseServing})`,
        source: food.source,
        verified: food.verified,
        calories,
        protein: Math.round(food.protein * multiplier),
        carbs: Math.round(food.carbs * multiplier),
        fat: Math.round(food.fat * multiplier),
        mealType: selectedMealType,
      }),
    );
    dispatch(showToast(`Logged ${food.name} (${calories} kcal) to ${selectedMealType}! 🔥`));
    navigation.navigate('MainTabs', { screen: 'DiaryTab' });
  };

  const activeTarget = MEAL_TYPES.find(m => m.type === selectedMealType)?.target;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Sizer.vSize(12), paddingBottom: TABBAR_CLEARANCE + insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 1 · Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headBtn}>
            <Icon name="chevron-left" size={Sizer.fS(20)} color={COLORS.white} />
          </Pressable>
          <Typography
            size={15.5}
            fFamily="displayBold700"
            color={COLORS.white}
            textTransform="uppercase"
            letterSpacing={2.17}
            textAlign="center"
          >
            Add Food
          </Typography>
          <Pressable onPress={() => navigation.navigate('BarcodeScanScreen')} style={styles.headBtn}>
            <Icon name="qr-code" size={Sizer.fS(18)} color="#C084FC" />
          </Pressable>
        </View>

        {/* 2 · Meal selector */}
        <View style={styles.mealSelector}>
          <View style={styles.rowBetween}>
            <Typography size={11} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase" letterSpacing={0.28}>
              LOGGING INTO
            </Typography>
            <Typography size={11.5} fFamily="monoBold700" color="#C084FC">
              {`Target: ${activeTarget} kcal`}
            </Typography>
          </View>

          <View style={styles.mealRow}>
            {MEAL_TYPES.map(opt => {
              const on = selectedMealType === opt.type;
              return (
                <Pressable
                  key={opt.type}
                  onPress={() => setSelectedMealType(opt.type)}
                  style={[styles.mealTab, on ? styles.mealTabOn : styles.mealTabOff]}
                >
                  {on ? (
                    <LinearGradient
                      colors={['#8D22FF', '#A84DF0']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.absFill}
                    />
                  ) : null}
                  <Icon name={opt.icon} size={Sizer.fS(14)} color={on ? COLORS.white : '#A1A1AA'} />
                  <Typography size={11.5} fFamily="bodyBold700" color={on ? COLORS.white : '#A1A1AA'} numberOfLines={1}>
                    {opt.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 3 · Search bar */}
        <View style={[styles.searchBar, searchFocused && styles.searchFocused]}>
          <Icon name="search" size={Sizer.fS(18)} color="#C084FC" style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search foods, brands, USDA entries..."
            placeholderTextColor="#71717A"
            selectionColor={COLORS.primary}
            allowFontScaling={false}
            style={styles.searchInput}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8} style={styles.searchClear}>
              <Icon name="x" size={Sizer.fS(16)} color="#A1A1AA" />
            </Pressable>
          ) : (
            <Typography size={11} fFamily="monoRegular400" color="#71717A">
              {`${filteredFoods.length} items`}
            </Typography>
          )}
        </View>

        {/* 4 · Quick action tiles */}
        <View style={styles.tiles}>
          <Pressable onPress={() => navigation.navigate('BarcodeScanScreen')} style={[styles.tile, styles.tileScan]}>
            <LinearGradient
              colors={['#1E1430', '#141417']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.absFill}
            />
            <View style={styles.tileDiscViolet}>
              <Icon name="camera" size={Sizer.fS(20)} color="#C084FC" />
            </View>
            <View style={styles.tileText}>
              <Typography size={13} fFamily="bodyExtraBold800" color={COLORS.white} lineHeight={16}>
                Scan Barcode
              </Typography>
              <Typography size={10} color="#A1A1AA" numberOfLines={1} mT={2}>
                Instant camera scan
              </Typography>
            </View>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('AddFoodManualScreen')} style={[styles.tile, styles.tilePlain]}>
            <View style={styles.tileDiscPlain}>
              <Icon name="plus" size={Sizer.fS(20)} color={COLORS.white} />
            </View>
            <View style={styles.tileText}>
              <Typography size={13} fFamily="bodyExtraBold800" color={COLORS.white} lineHeight={16}>
                Add Custom
              </Typography>
              <Typography size={10} color="#A1A1AA" numberOfLines={1} mT={2}>
                Manual entry
              </Typography>
            </View>
          </Pressable>
        </View>

        {/* 5 · Category pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
          style={styles.pillScroll}
        >
          {CATEGORIES.map(tab => {
            const on = activeCategory === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveCategory(tab.id)}
                style={[styles.pill, on ? styles.pillOn : styles.pillOff]}
              >
                {on ? (
                  <LinearGradient
                    colors={['#8D22FF', '#A84DF0']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.absFill}
                  />
                ) : null}
                <Emoji char={tab.emoji} size={12} />
                <Typography size={12} fFamily="bodyBold700" color={on ? COLORS.white : '#A1A1AA'}>
                  {tab.label}
                </Typography>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Popular shortcuts */}
        {!query ? (
          <View style={styles.popular}>
            <Typography
              size={11}
              fFamily="bodyBold700"
              color="#71717A"
              textTransform="uppercase"
              letterSpacing={0.28}
              style={styles.popularLabel}
            >
              POPULAR FOODS
            </Typography>
            <View style={styles.popularRow}>
              {POPULAR.map(sc => (
                <Pressable key={sc} onPress={() => setQuery(sc)} style={styles.popularChip}>
                  <Typography size={11} fFamily="bodySemiBold600" color="#A1A1AA">
                    {`+ ${sc}`}
                  </Typography>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {/* 6 · Results */}
        <View style={styles.results}>
          {filteredFoods.map(f => {
            const expanded = expandedFoodId === f.id;
            const mult = servingMultipliers[f.id] || 1;
            const dyn = key => Math.round(f[key] * mult);

            return (
              <Pressable
                key={f.id}
                onPress={() => setExpandedFoodId(expanded ? null : f.id)}
                style={[styles.result, expanded ? styles.resultOpen : styles.resultIdle]}
              >
                {expanded ? (
                  <LinearGradient
                    colors={['#181424', '#141417']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.absFill}
                  />
                ) : null}

                <View style={styles.resultTop}>
                  <View style={styles.resultText}>
                    <View style={styles.resultTitleRow}>
                      <Typography size={15} fFamily="bodyBold700" color={COLORS.white} numberOfLines={1} flex={1}>
                        {f.name}
                      </Typography>
                      {f.verified ? (
                        <View style={styles.verified}>
                          <Icon name="check" size={Sizer.fS(9)} color={COLORS.success} />
                          <Typography size={9.5} fFamily="bodyBold700" color={COLORS.success}>
                            Verified
                          </Typography>
                        </View>
                      ) : null}
                    </View>
                    <Typography size={11.5} color="#A1A1AA" mT={2}>
                      {`${f.source} · `}
                      <Typography size={11.5} fFamily="bodySemiBold600" color="#C084FC">
                        {f.badge}
                      </Typography>
                    </Typography>
                  </View>

                  <View style={styles.resultRight}>
                    <View style={styles.kcalBlock}>
                      <Typography size={16} fFamily="monoBold700" color={COLORS.white} lineHeight={16}>
                        {String(dyn('calories'))}
                      </Typography>
                      <Typography
                        size={9.5}
                        fFamily="bodyBold700"
                        color="#A1A1AA"
                        textTransform="uppercase"
                        mT={2}
                      >
                        KCAL
                      </Typography>
                    </View>

                    <Pressable onPress={() => handleLogFood(f, mult)} style={styles.logBtn}>
                      <LinearGradient
                        colors={['#8D22FF', '#A84DF0']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.absFill}
                      />
                      <Icon name="plus" size={Sizer.fS(18)} color={COLORS.white} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.macroStrip}>
                  <MacroCell label="Protein" value={dyn('protein')} tint="#C084FC" />
                  <MacroCell label="Carbs" value={dyn('carbs')} tint="#38BDF8" />
                  <MacroCell label="Fat" value={dyn('fat')} tint="#F59E0B" />
                </View>

                {expanded ? (
                  <View style={styles.drawer}>
                    <View style={styles.rowBetween}>
                      <View style={styles.drawerLabel}>
                        <Icon name="sliders-horizontal" size={Sizer.fS(14)} color="#C084FC" />
                        <Typography size={11.5} fFamily="bodyBold700" color={COLORS.white}>
                          Adjust Portion Size:
                        </Typography>
                      </View>
                      <Typography size={12} fFamily="monoBold700" color="#C084FC">
                        {`${mult}x (${f.baseServing})`}
                      </Typography>
                    </View>

                    <View style={styles.multRow}>
                      {[0.5, 1.0, 1.5, 2.0].map(m => {
                        const on = mult === m;
                        return (
                          <Pressable
                            key={m}
                            onPress={() => setServingMultipliers(prev => ({ ...prev, [f.id]: m }))}
                            style={[styles.multBtn, on ? styles.multOn : styles.multOff]}
                          >
                            <Typography size={12} fFamily="monoBold700" color={on ? COLORS.white : '#A1A1AA'}>
                              {`${m}x`}
                            </Typography>
                          </Pressable>
                        );
                      })}
                    </View>

                    <Pressable onPress={() => handleLogFood(f, mult)} style={styles.drawerCta}>
                      <LinearGradient
                        colors={['#8D22FF', '#A84DF0']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.absFill}
                      />
                      <Typography size={13.5} fFamily="bodyBold700" color={COLORS.white} numberOfLines={1}>
                        {`Log to ${selectedMealType.toUpperCase()} (${dyn('calories')} kcal)`}
                      </Typography>
                      <Icon name="arrow-right" size={Sizer.fS(16)} color={COLORS.white} />
                    </Pressable>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0B0D' },
  scroll: { paddingHorizontal: Sizer.hSize(16), width: '100%', maxWidth: SHELL_MAX_WIDTH, alignSelf: 'center' },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    marginBottom: Sizer.vSize(14),
  },
  headBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  mealSelector: {
    borderRadius: 20,
    padding: Sizer.hSize(14),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    gap: Sizer.vSize(10),
    marginBottom: Sizer.vSize(14),
  },
  mealRow: { flexDirection: 'row', gap: Sizer.hSize(6) },
  mealTab: {
    flex: 1,
    paddingVertical: Sizer.vSize(8),
    paddingHorizontal: Sizer.hSize(6),
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(6),
    overflow: 'hidden',
  },
  mealTabOn: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  mealTabOff: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(12),
    marginBottom: Sizer.vSize(12),
  },
  searchFocused: { borderColor: COLORS.primary },
  searchIcon: { marginRight: Sizer.hSize(10) },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontFamily: 'Inter-Medium',
    fontSize: Sizer.fS(14.5),
    padding: 0,
  },
  searchClear: { padding: 4, marginLeft: Sizer.hSize(8) },

  tiles: { flexDirection: 'row', gap: Sizer.hSize(10), marginBottom: Sizer.vSize(14) },
  tile: {
    flex: 1,
    borderRadius: 18,
    padding: Sizer.hSize(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    overflow: 'hidden',
  },
  tileScan: { borderWidth: 1, borderColor: 'rgba(141,34,255,0.4)' },
  tilePlain: { backgroundColor: '#141417', borderWidth: 1, borderColor: COLORS.hairline },
  tileDiscViolet: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(141,34,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tileDiscPlain: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tileText: { flex: 1, minWidth: 0 },

  pillScroll: { marginBottom: Sizer.vSize(14) },
  pillRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6), paddingBottom: 2 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(5),
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(6),
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  pillOn: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pillOff: { backgroundColor: '#141417', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },

  popular: { gap: Sizer.vSize(6), marginBottom: Sizer.vSize(14) },
  popularLabel: { paddingHorizontal: 4 },
  popularRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Sizer.hSize(6) },
  popularChip: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  results: { gap: Sizer.vSize(12) },
  result: { borderRadius: 22, padding: Sizer.hSize(16), borderWidth: 1, overflow: 'hidden' },
  resultIdle: { backgroundColor: '#141417', borderColor: COLORS.hairline },
  resultOpen: {
    backgroundColor: '#141417',
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  resultTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Sizer.hSize(8) },
  resultText: { flex: 1, minWidth: 0, paddingRight: Sizer.hSize(8) },
  resultTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6) },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Sizer.hSize(6),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(46,212,122,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46,212,122,0.3)',
    flexShrink: 0,
  },
  resultRight: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10), flexShrink: 0 },
  kcalBlock: { alignItems: 'flex-end' },
  logBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },

  macroStrip: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
    marginTop: Sizer.vSize(12),
    paddingTop: Sizer.vSize(10),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  macroCell: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(6),
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  drawer: {
    marginTop: Sizer.vSize(14),
    paddingTop: Sizer.vSize(12),
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
    gap: Sizer.vSize(10),
  },
  drawerLabel: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6) },
  multRow: { flexDirection: 'row', gap: Sizer.hSize(6) },
  multBtn: { flex: 1, paddingVertical: Sizer.vSize(6), borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  multOn: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  multOff: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  drawerCta: {
    width: '100%',
    height: Sizer.vSize(44),
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
    marginTop: 4,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});

export default SearchFoodScreen;
