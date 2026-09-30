import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { gridItemWidthScaled } from '../../helpers/grid';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { Emoji, SoftBlob } from '../../components';
import { SHELL_MAX_WIDTH, TABBAR_CLEARANCE } from '../../constants';
import { weeklyHistoricalData } from '../../lib/daily-data';
import { deleteMeal, selectMeals, showToast } from '../../redux/slices/appSlice';
import { formatNumber } from '../../utils';

const WEEK_DATES = [25, 26, 27, 28, 29, 30, 31];
const ARC_LENGTH = 330;
// 6 glasses per row inside the card: 16pt page gutter + 18pt card padding each side.
const GLASS_WIDTH = gridItemWidthScaled(6, 8, (16 + 18) * 2);
const ARC_PATH = 'M 35 135 A 105 105 0 0 1 245 135';

const MEAL_SECTIONS = [
  { type: 'breakfast', label: 'Breakfast', icon: 'coffee', tint: '#F59E0B', targetCals: 550, time: '7:15 AM' },
  { type: 'lunch', label: 'Lunch', icon: 'sun', tint: '#2ED47A', targetCals: 750, time: '12:45 PM' },
  { type: 'dinner', label: 'Dinner', icon: 'moon', tint: '#8D22FF', targetCals: 650, time: '7:30 PM' },
  { type: 'snack', label: 'Snacks', icon: 'cookie', tint: '#38BDF8', targetCals: 250, time: '4:00 PM' },
];

const MacroPillar = ({ label, dot, value, target, colors }) => (
  <View style={styles.pillar}>
    <View style={styles.pillarHead}>
      <View style={[styles.pillarDot, { backgroundColor: dot }]} />
      <Typography size={10} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase" letterSpacing={0.25}>
        {label}
      </Typography>
    </View>
    <Typography size={18} fFamily="monoBold700" color={COLORS.white}>
      {`${value}g`}
    </Typography>
    <Typography size={10} color="#71717A" mT={2}>
      {`/ ${target}g`}
    </Typography>
    <View style={styles.pillarTrack}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.pillarFill, { width: `${Math.min(100, (value / target) * 100)}%` }]}
      />
    </View>
  </View>
);

const SpeedDial = ({ icon, label, disabled, onPress }) => (
  <Pressable onPress={onPress} style={[styles.dial, disabled && styles.dialOff]}>
    <View style={styles.dialDisc}>
      <Icon name={icon} size={Sizer.fS(16)} color="#C084FC" />
    </View>
    <Typography size={11} fFamily="bodyBold700" color={COLORS.white}>
      {label}
    </Typography>
  </Pressable>
);

/** Screen 19 · Food Diary */
const FoodDiaryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const liveMeals = useSelector(selectMeals);

  const [selectedDay, setSelectedDay] = useState(28);
  const [waterGlassesState, setWaterGlassesState] = useState({ 25: 11, 26: 12, 27: 10, 28: 6, 29: 0, 30: 0, 31: 0 });

  const day = weeklyHistoricalData[selectedDay] || weeklyHistoricalData[28];
  const { isFuture, isToday, targets } = day;

  const activeMeals = isToday && liveMeals && liveMeals.length > 0 ? liveMeals : day.meals;
  const glasses = waterGlassesState[selectedDay] ?? (isFuture ? 0 : 6);

  const currentCals = isFuture ? 0 : day.consumed.calories;
  const calsRemaining = Math.max(0, targets.calories - currentCals);
  const calsPercent = Math.min(100, Math.round((currentCals / targets.calories) * 100));

  const setGlasses = next => setWaterGlassesState(prev => ({ ...prev, [selectedDay]: next }));

  // Empty glasses dim further on a future date, as in the mock.
  const glassTint = filled => (filled ? COLORS.white : isFuture ? '#404047' : '#71717A');

  const guard = message => {
    if (!isFuture) return false;
    dispatch(showToast(message));
    return true;
  };

  const arcWidth = Math.min(Sizer.hSize(270), 270);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Sizer.vSize(12), paddingBottom: TABBAR_CLEARANCE + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1 · Header */}
        <View style={styles.header}>
          <View>
            <Typography size={12} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase" letterSpacing={0.3}>
              NUTRITION CENTER
            </Typography>
            {/* <h1> — the mock's base rule makes headings Barlow Condensed uppercase */}
            <Typography
              size={26}
              fFamily="displayBold700"
              color={COLORS.white}
              textTransform="uppercase"
              lineHeight={31}
              letterSpacing={-0.65}
            >
              Food Diary
            </Typography>
          </View>

          <View style={styles.headActions}>
            <Pressable
              onPress={() => !guard('Barcode scanning is disabled for future dates.') && navigation.navigate('BarcodeScanScreen')}
              style={[styles.headBtn, isFuture ? styles.headBtnOff : styles.headBtnOn]}
            >
              <Icon name="qr-code" size={Sizer.fS(18)} color={isFuture ? '#52525B' : '#C084FC'} />
            </Pressable>

            <Pressable
              onPress={() => !guard('Food logging is locked for future dates.') && navigation.navigate('SearchFoodScreen')}
              style={[styles.headBtn, isFuture && styles.headBtnOff]}
            >
              {isFuture ? (
                <Icon name="lock" size={Sizer.fS(16)} color="#52525B" />
              ) : (
                <>
                  <LinearGradient
                    colors={['#8D22FF', '#A84DF0']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.headBtnFill}
                  />
                  <Icon name="plus" size={Sizer.fS(20)} color={COLORS.white} />
                </>
              )}
            </Pressable>
          </View>
        </View>

        {/* 2 · Week strip */}
        <View style={styles.weekStrip}>
          {WEEK_DATES.map(dateNum => {
            const d = weeklyHistoricalData[dateNum];
            const on = selectedDay === dateNum;
            const dotColor = d.pct >= 90 ? (on ? COLORS.white : COLORS.success) : d.pct > 0 ? (on ? 'rgba(255,255,255,0.7)' : COLORS.primary) : 'transparent';
            return (
              <Pressable
                key={dateNum}
                onPress={() => {
                  setSelectedDay(dateNum);
                  dispatch(
                    showToast(
                      d.isFuture
                        ? `Selected ${d.name}, Aug ${d.date} (Future Date - No Logs)`
                        : `Viewing Food Diary for ${d.fullDate}`,
                    ),
                  );
                }}
                style={[styles.dayCell, on ? styles.dayOn : d.isToday ? styles.dayToday : null]}
              >
                {on ? (
                  <LinearGradient
                    colors={['#8D22FF', '#7116D9']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.dayFill}
                  />
                ) : null}
                <Typography size={10} fFamily="bodyBold700" textTransform="uppercase" color={on ? COLORS.white : '#71717A'}>
                  {d.name}
                </Typography>
                <Typography
                  size={15}
                  fFamily="monoBold700"
                  lineHeight={15}
                  color={on ? COLORS.white : d.isToday ? '#C084FC' : d.isFuture ? '#52525B' : COLORS.white}
                >
                  {String(d.date)}
                </Typography>
                {d.isFuture ? (
                  <Emoji char="🔒" size={8} />
                ) : (
                  <View style={[styles.dayDot, { backgroundColor: dotColor }]} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Future banner */}
        {isFuture ? (
          <View style={styles.futureBanner}>
            <LinearGradient
              colors={['#2A1D3A', '#141417']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.absFill}
            />
            <Icon name="calendar-clock" size={Sizer.fS(20)} color="#C084FC" style={styles.bannerIcon} />
            <View style={styles.flex}>
              <Typography size={13} fFamily="bodyExtraBold800" color={COLORS.white}>
                {`Future Date (${day.fullDate})`}
              </Typography>
              <Typography size={11.5} color="#A1A1AA" lineHeight={17} mT={2}>
                {`No food records logged yet. Food logging is locked for future dates. Your planned caloric target for ${day.name} is ${targets.calories} kcal.`}
              </Typography>
            </View>
          </View>
        ) : null}

        {/* 3 · Hero gauge */}
        <View style={styles.hero}>
          <LinearGradient colors={['#181524', '#141417']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.absFill} />
          <SoftBlob size={160} opacity={0.2} style={styles.heroGlow} />

          <View style={styles.heroHead}>
            <View style={styles.heroHeadLeft}>
              <Icon name="flame" size={Sizer.fS(20)} color={COLORS.primary} />
              <Typography size={16} fFamily="bodyBold700" color={COLORS.white}>
                {isFuture ? 'Planned Caloric Target' : 'Daily Caloric Target'}
              </Typography>
            </View>
            <View style={styles.heroPill}>
              <Typography size={11} fFamily="monoBold700" color="#C084FC">
                {isFuture ? `${targets.calories} KCAL BUDGET` : `${calsRemaining} KCAL LEFT`}
              </Typography>
            </View>
          </View>

          <View style={styles.arcWrap}>
            <Svg width={arcWidth} height={Sizer.vSize(140)} viewBox="0 0 280 145">
              <Defs>
                <SvgGradient id="diaryArc" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#8D22FF" />
                  <Stop offset="0.7" stopColor="#C084FC" />
                  <Stop offset="1" stopColor="#38BDF8" />
                </SvgGradient>
              </Defs>
              <Path d={ARC_PATH} fill="none" stroke="#27272A" strokeWidth="14" strokeLinecap="round" />
              <Path
                d={ARC_PATH}
                fill="none"
                stroke="url(#diaryArc)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={ARC_LENGTH}
                strokeDashoffset={isFuture ? ARC_LENGTH : ARC_LENGTH - (ARC_LENGTH * calsPercent) / 100}
              />
            </Svg>

            <View style={styles.arcLabel} pointerEvents="none">
              <Typography size={38} fFamily="monoBold700" color={COLORS.white} lineHeight={38} letterSpacing={-0.5}>
                {String(currentCals)}
              </Typography>
              <Typography
                size={11}
                fFamily="bodyBold700"
                color="#A1A1AA"
                textTransform="uppercase"
                letterSpacing={1.1}
                mT={4}
              >
                {'OF '}
                <Typography size={11} fFamily="monoBold700" color={COLORS.white}>
                  {String(targets.calories)}
                </Typography>
                {' KCAL'}
              </Typography>
              <View style={styles.arcChip}>
                <Icon name="sparkles" size={Sizer.fS(12)} color="#C084FC" />
                <Typography size={11} fFamily="bodyBold700" color="#C084FC">
                  {isFuture ? '0% Logged (Upcoming)' : `${calsPercent}% Consumed`}
                </Typography>
              </View>
            </View>
          </View>

          <View style={styles.pillars}>
            <MacroPillar
              label="PROTEIN"
              dot="#8D22FF"
              value={isFuture ? 0 : day.consumed.protein}
              target={targets.protein}
              colors={['#8D22FF', '#C084FC']}
            />
            <MacroPillar
              label="CARBS"
              dot="#38BDF8"
              value={isFuture ? 0 : day.consumed.carbs}
              target={targets.carbs}
              colors={['#0284C7', '#38BDF8']}
            />
            <MacroPillar
              label="FAT"
              dot="#F59E0B"
              value={isFuture ? 0 : day.consumed.fat}
              target={targets.fat}
              colors={['#D97706', '#F59E0B']}
            />
          </View>
        </View>

        {/* 4 · Speed dial */}
        <View style={styles.dials}>
          <SpeedDial
            icon="search"
            label="Search"
            disabled={isFuture}
            onPress={() => !guard('Logging is disabled for future dates.') && navigation.navigate('SearchFoodScreen')}
          />
          <SpeedDial
            icon="qr-code"
            label="Scan"
            disabled={isFuture}
            onPress={() => !guard('Barcode scanning is disabled for future dates.') && navigation.navigate('BarcodeScanScreen')}
          />
          <SpeedDial icon="book-open" label="Recipes" onPress={() => navigation.navigate('MealsRecipesScreen')} />
          <SpeedDial
            icon="plus"
            label="Manual"
            disabled={isFuture}
            onPress={() => !guard('Manual entry is disabled for future dates.') && navigation.navigate('AddFoodManualScreen')}
          />
        </View>

        {/* 5 · Hydration */}
        <View style={styles.card}>
          <View style={styles.hydrateHead}>
            <View style={styles.hydrateLeft}>
              <View style={styles.dropDisc}>
                <Icon name="droplets" size={Sizer.fS(16)} color="#38BDF8" />
              </View>
              <View style={styles.flex}>
                <Typography size={15} fFamily="bodyBold700" color={COLORS.white} lineHeight={18}>
                  Hydration Station
                </Typography>
                <Typography size={11} color="#A1A1AA">
                  Goal: 3.0 Liters (12 Glasses)
                </Typography>
              </View>
            </View>
            <View style={styles.hydratePill}>
              <Typography size={14} fFamily="monoBold700" color="#38BDF8">
                {`${(glasses * 0.25).toFixed(1)}L / 3.0L`}
              </Typography>
            </View>
          </View>

          <View style={styles.glassGrid}>
            {Array.from({ length: 12 }, (_, idx) => {
              const filled = idx < glasses;
              return (
                <Pressable
                  key={idx}
                  onPress={() => {
                    if (guard(`Hydration tracker opens on ${day.name}`)) return;
                    setGlasses(idx + 1);
                    dispatch(showToast(`Logged ${((idx + 1) * 0.25).toFixed(2)}L water 💧`));
                  }}
                  style={[styles.glass, !filled && styles.glassEmpty]}
                >
                  {filled ? (
                    <LinearGradient
                      colors={['#38BDF8', '#0284C7']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={styles.absFill}
                    />
                  ) : null}
                  <Icon name="droplets" size={Sizer.fS(14)} color={glassTint(filled)} />
                  <Typography size={9} fFamily="monoBold700" color={glassTint(filled)} mT={2}>
                    {String(idx + 1)}
                  </Typography>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.hydrateActions}>
            <Pressable
              onPress={() => {
                if (guard('Cannot log water intake for future dates!')) return;
                if (glasses < 12) {
                  const next = glasses + 1;
                  setGlasses(next);
                  dispatch(showToast(`Logged +250ml water (Total: ${(next * 0.25).toFixed(1)}L) 💧`));
                }
              }}
              style={[styles.addGlass, isFuture ? styles.addGlassOff : styles.addGlassOn]}
            >
              <Icon name={isFuture ? 'lock' : 'plus'} size={Sizer.fS(14)} color={isFuture ? '#52525B' : '#38BDF8'} />
              <Typography size={12} fFamily="bodyBold700" color={isFuture ? '#52525B' : '#38BDF8'}>
                {isFuture ? 'Locked for Future' : '+ 1 Glass (250ml)'}
              </Typography>
            </Pressable>

            {!isFuture ? (
              <Pressable
                onPress={() => {
                  setGlasses(0);
                  dispatch(showToast('Reset water tracker for this day'));
                }}
                style={styles.resetWater}
              >
                <Typography size={11} fFamily="bodyMedium500" color="#71717A">
                  Reset
                </Typography>
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* 6 · Meal sections */}
        <View style={styles.mealsHead}>
          <Typography size={13} fFamily="bodyExtraBold800" color={COLORS.white} textTransform="uppercase" letterSpacing={0.33}>
            {isFuture ? 'PLANNED MEALS' : isToday ? "TODAY'S LOGGED MEALS" : `${day.name}'S LOGGED MEALS`}
          </Typography>
          <Typography size={11.5} fFamily="bodyBold700" color="#C084FC">
            {`${activeMeals.length} ${activeMeals.length === 1 ? 'item' : 'items'} logged`}
          </Typography>
        </View>

        <View style={styles.mealList}>
          {MEAL_SECTIONS.map(section => {
            const items = activeMeals.filter(m => m.mealType === section.type);
            const sum = key => items.reduce((s, it) => s + (it[key] || 0), 0);
            const totalCals = sum('calories');

            return (
              <View key={section.type} style={[styles.mealCard, { borderColor: `${section.tint}4D` }]}>
                <View style={styles.mealHead}>
                  <View style={styles.mealHeadLeft}>
                    <View style={styles.mealDisc}>
                      <Icon name={section.icon} size={Sizer.fS(16)} color={section.tint} />
                    </View>
                    <View style={styles.flex}>
                      <Typography size={16} fFamily="bodyExtraBold800" color={COLORS.white} lineHeight={19}>
                        {section.label}
                      </Typography>
                      <Typography size={11} color="#A1A1AA">
                        {`Target: ${section.targetCals} kcal · ${section.time}`}
                      </Typography>
                    </View>
                  </View>

                  <View style={styles.mealHeadRight}>
                    <View style={styles.kcalPill}>
                      <Typography size={14} fFamily="monoBold700" color={COLORS.white}>
                        {String(totalCals)}
                        <Typography size={10} fFamily="monoBold700" color="#A1A1AA">
                          {' kcal'}
                        </Typography>
                      </Typography>
                    </View>
                    {!isFuture ? (
                      <Pressable onPress={() => navigation.navigate('SearchFoodScreen')} style={styles.mealAdd}>
                        <LinearGradient
                          colors={['#8D22FF', '#A84DF0']}
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                          style={styles.absFill}
                        />
                        <Icon name="plus" size={Sizer.fS(16)} color={COLORS.white} />
                      </Pressable>
                    ) : null}
                  </View>
                </View>

                {items.length > 0 ? (
                  <View style={styles.macroStrip}>
                    <Typography size={10.5} fFamily="monoBold700" color="#C084FC">
                      {`P: ${sum('protein')}g`}
                    </Typography>
                    <Typography size={10.5} fFamily="monoBold700" color="#71717A">
                      ·
                    </Typography>
                    <Typography size={10.5} fFamily="monoBold700" color="#38BDF8">
                      {`C: ${sum('carbs')}g`}
                    </Typography>
                    <Typography size={10.5} fFamily="monoBold700" color="#71717A">
                      ·
                    </Typography>
                    <Typography size={10.5} fFamily="monoBold700" color="#F59E0B">
                      {`F: ${sum('fat')}g`}
                    </Typography>
                  </View>
                ) : null}

                <View style={styles.items}>
                  {items.length > 0 ? (
                    items.map(item => (
                      <View key={item.id} style={styles.item}>
                        <View style={styles.itemText}>
                          <View style={styles.itemTitleRow}>
                            <Typography size={14} fFamily="bodyBold700" color={COLORS.white} numberOfLines={1} flex={1}>
                              {item.name}
                            </Typography>
                            {item.verified ? (
                              <View style={styles.verified}>
                                <Icon name="check" size={Sizer.fS(9)} color={COLORS.success} />
                              </View>
                            ) : null}
                          </View>
                          <Typography size={11.5} color="#A1A1AA" mT={2}>
                            {`${item.serving} · `}
                            <Typography size={11.5} fFamily="monoRegular400" color="#C084FC">
                              {`P: ${item.protein}g`}
                            </Typography>
                          </Typography>
                        </View>

                        <View style={styles.itemRight}>
                          <Typography size={14} fFamily="monoBold700" color={COLORS.white}>
                            {String(item.calories)}
                            <Typography size={10} fFamily="monoBold700" color="#A1A1AA">
                              {' kcal'}
                            </Typography>
                          </Typography>
                          {isToday ? (
                            <Pressable
                              onPress={() => {
                                dispatch(deleteMeal(item.id));
                                dispatch(showToast(`Removed "${item.name}"`));
                              }}
                              hitSlop={6}
                              style={styles.itemDelete}
                            >
                              <Icon name="trash-2" size={Sizer.fS(14)} color="#71717A" />
                            </Pressable>
                          ) : null}
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyMeal}>
                      <Typography size={12} color="#A1A1AA" textAlign="center" mB={8}>
                        {isFuture
                          ? `Planned allotment: ${section.targetCals} kcal. Logging unlocks on ${day.name}.`
                          : `No foods logged for ${section.label.toLowerCase()} yet.`}
                      </Typography>
                      {!isFuture ? (
                        <Pressable onPress={() => navigation.navigate('SearchFoodScreen')} style={styles.emptyCta}>
                          <Icon name="plus" size={Sizer.fS(12)} color="#C084FC" />
                          <Typography size={11.5} fFamily="bodyBold700" color="#C084FC">
                            {`Log ${section.label}`}
                          </Typography>
                        </Pressable>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* 7 · Quality score */}
        <View style={[styles.card, styles.scoreCard]}>
          <View style={styles.scoreHead}>
            <View style={styles.scoreHeadLeft}>
              <Emoji char="🏆" size={16} />
              <Typography size={15} fFamily="bodyBold700" color={COLORS.white}>
                Nutritional Quality Score
              </Typography>
            </View>
            <View style={[styles.scorePill, isFuture ? styles.scorePillOff : styles.scorePillOn]}>
              <Typography size={12} fFamily="monoBold700" color={isFuture ? '#71717A' : COLORS.success}>
                {isFuture ? '-- / 100' : '94 / 100'}
              </Typography>
            </View>
          </View>

          <View style={styles.scoreGrid}>
            {[
              ['Fiber', isFuture ? '0g / 35g' : '32g / 35g', isFuture ? COLORS.white : COLORS.success],
              ['Sugar', isFuture ? '0g < 45g' : '24g < 45g', COLORS.white],
              ['Sodium', isFuture ? '0mg' : `${formatNumber(1820)}mg`, COLORS.white],
            ].map(([label, value, tint]) => (
              <View key={label} style={styles.scoreCell}>
                <Typography
                  size={9.5}
                  fFamily="bodyBold700"
                  color="#A1A1AA"
                  textTransform="uppercase"
                  textAlign="center"
                >
                  {label}
                </Typography>
                <Typography size={13.5} fFamily="monoBold700" color={tint} textAlign="center">
                  {value}
                </Typography>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0B0D' },
  scroll: { paddingHorizontal: Sizer.hSize(16), width: '100%', maxWidth: SHELL_MAX_WIDTH, alignSelf: 'center' },
  flex: { flex: 1, minWidth: 0 },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },

  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Sizer.vSize(12) },
  headActions: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  headBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headBtnOn: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.hairline },
  headBtnOff: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  headBtnFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },

  weekStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizer.hSize(8),
    borderRadius: 20,
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: Sizer.vSize(16),
  },
  dayCell: {
    width: Sizer.hSize(44),
    height: Sizer.vSize(64),
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizer.vSize(8),
    paddingHorizontal: Sizer.hSize(6),
    overflow: 'hidden',
  },
  dayFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  dayOn: {
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.5)',
    transform: [{ scale: 1.05 }],
    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  dayToday: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(141,34,255,0.3)' },
  dayDot: { width: 6, height: 6, borderRadius: RADIUS.full },

  futureBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
    borderRadius: 18,
    padding: Sizer.hSize(14),
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.4)',
    marginBottom: Sizer.vSize(16),
    overflow: 'hidden',
  },
  bannerIcon: { marginTop: 2 },

  hero: {
    borderRadius: 24,
    padding: Sizer.hSize(20),
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.3)',
    marginBottom: Sizer.vSize(16),
    overflow: 'hidden',
  },
  heroGlow: { position: 'absolute', top: -48, right: -48 },
  heroHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(4) },
  heroHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), flexShrink: 1 },
  heroPill: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(141,34,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.4)',
  },

  arcWrap: { alignItems: 'center', justifyContent: 'center', marginVertical: Sizer.vSize(12) },
  arcLabel: { position: 'absolute', top: Sizer.vSize(48), left: 0, right: 0, alignItems: 'center' },
  arcChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(6),
    marginTop: Sizer.vSize(8),
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(20,20,23,0.8)',
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },

  pillars: { flexDirection: 'row', gap: Sizer.hSize(10), marginTop: Sizer.vSize(8) },
  pillar: {
    flex: 1,
    borderRadius: 18,
    padding: Sizer.hSize(12),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  pillarHead: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  pillarDot: { width: 8, height: 8, borderRadius: RADIUS.full },
  pillarTrack: {
    width: '100%',
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.raised,
    overflow: 'hidden',
    marginTop: Sizer.vSize(8),
  },
  pillarFill: { height: '100%', borderRadius: RADIUS.full },

  dials: { flexDirection: 'row', gap: Sizer.hSize(8), marginBottom: Sizer.vSize(16) },
  dial: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizer.hSize(12),
    borderRadius: 16,
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  dialOff: { opacity: 0.6, borderColor: 'rgba(255,255,255,0.05)' },
  dialDisc: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(141,34,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(6),
  },

  card: {
    borderRadius: 22,
    padding: Sizer.hSize(18),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: Sizer.vSize(16),
  },
  hydrateHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(12) },
  hydrateLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), flex: 1, minWidth: 0 },
  dropDisc: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(56,189,248,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hydratePill: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(56,189,248,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
  },
  glassGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Sizer.hSize(8), marginBottom: Sizer.vSize(12) },
  glass: {
    width: GLASS_WIDTH,
    height: Sizer.vSize(44),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glassEmpty: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  hydrateActions: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  addGlass: {
    flex: 1,
    paddingVertical: Sizer.vSize(8),
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(6),
    borderWidth: 1,
  },
  addGlassOn: { backgroundColor: 'rgba(56,189,248,0.15)', borderColor: 'rgba(56,189,248,0.3)' },
  addGlassOff: { backgroundColor: COLORS.surface, borderColor: 'rgba(255,255,255,0.05)' },
  resetWater: {
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(8),
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },

  mealsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(12),
    paddingHorizontal: 4,
  },
  mealList: { gap: Sizer.vSize(14) },
  mealCard: { borderRadius: 22, padding: Sizer.hSize(16), backgroundColor: '#141417', borderWidth: 1 },
  mealHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Sizer.vSize(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  mealHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10), flex: 1, minWidth: 0 },
  mealDisc: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealHeadRight: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  kcalPill: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  mealAdd: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  macroStrip: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), paddingTop: Sizer.vSize(10) },
  items: { gap: Sizer.vSize(8), paddingTop: Sizer.vSize(12) },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizer.hSize(12),
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  itemText: { flex: 1, minWidth: 0, paddingRight: Sizer.hSize(8) },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6) },
  verified: {
    paddingHorizontal: Sizer.hSize(5),
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(46,212,122,0.15)',
  },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flexShrink: 0 },
  itemDelete: { width: 28, height: 28, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  emptyMeal: {
    paddingVertical: Sizer.vSize(16),
    paddingHorizontal: Sizer.hSize(12),
    borderRadius: 16,
    backgroundColor: 'rgba(24,24,27,0.5)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.hairline,
    alignItems: 'center',
  },
  emptyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(6),
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(141,34,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.3)',
  },

  scoreCard: { marginTop: Sizer.vSize(16), marginBottom: 0 },
  scoreHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(12) },
  scoreHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), flexShrink: 1 },
  scorePill: { paddingHorizontal: Sizer.hSize(10), paddingVertical: 4, borderRadius: RADIUS.full, borderWidth: 1 },
  scorePillOn: { backgroundColor: 'rgba(46,212,122,0.15)', borderColor: 'rgba(46,212,122,0.3)' },
  scorePillOff: { backgroundColor: COLORS.raised, borderColor: 'rgba(255,255,255,0.05)' },
  scoreGrid: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
    paddingTop: Sizer.vSize(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  scoreCell: { flex: 1, backgroundColor: COLORS.surface, padding: Sizer.hSize(10), borderRadius: 14 },
});

export default FoodDiaryScreen;
