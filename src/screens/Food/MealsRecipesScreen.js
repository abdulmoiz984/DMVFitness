import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, DmvButton, DmvChip, StackTabBar } from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { selectMyRecipes } from '../../redux/slices/appSlice';

const STATE_VARIANT = { Shared: 'violet', 'In review': 'warning' };

/** Screen 24 · Meals and Recipes */
const MealsRecipesScreen = ({ navigation }) => {
  const myRecipes = useSelector(selectMyRecipes);
  const [activeTab, setActiveTab] = useState('Mine');

  return (
    <View style={styles.root}>
      <DmvScreen bgColor="#0B0B0D" topPad={12} bottomPad={TABBAR_CLEARANCE}>
        <View style={styles.nav}>
          <Typography
            size={18}
            fFamily="displayBold700"
            color={COLORS.white}
            textTransform="uppercase"
            letterSpacing={2.52}
          >
            MY MEALS & RECIPES
          </Typography>
          <Pressable
            onPress={() => navigation.navigate('AddFoodManualScreen')}
            style={styles.addBtn}
          >
            <Icon name="plus" size={Sizer.fS(16)} color={COLORS.white} />
          </Pressable>
        </View>

        <View style={styles.tabs}>
          {['Mine', 'Coach'].map(tab => {
            const on = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, on ? styles.tabOn : styles.tabOff]}
              >
                {on ? (
                  <LinearGradient
                    colors={['#8D22FF', '#A84DF0']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.absFill}
                  />
                ) : null}
                <Typography
                  size={12.5}
                  fFamily="bodyBold700"
                  color={on ? COLORS.white : '#A1A1AA'}
                >
                  {tab === 'Mine' ? 'My Saved Recipes' : 'Coach Prescribed'}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.note}>
          <Icon
            name="layers"
            size={Sizer.fS(16)}
            color={COLORS.primarySoft}
            style={styles.noteIcon}
          />
          <Typography size={11.5} color={COLORS.muted} lineHeight={18} flex={1}>
            Editing a saved meal creates a new version. Anything you already
            logged keeps its old numbers.
          </Typography>
        </View>

        <View style={styles.list}>
          {myRecipes.map(r => (
            <View key={r.id} style={styles.recipe}>
              <View style={styles.recipeText}>
                <View style={styles.recipeTitleRow}>
                  <Typography
                    size={14}
                    fFamily="bodyBold700"
                    color={COLORS.white}
                    numberOfLines={1}
                    flex={1}
                  >
                    {r.name}
                  </Typography>
                  <View style={styles.versionTag}>
                    <Typography
                      size={11}
                      fFamily="monoSemiBold600"
                      color={COLORS.primarySoft}
                    >
                      {r.version}
                    </Typography>
                  </View>
                </View>
                <Typography size={11.5} color={COLORS.muted} mT={4}>
                  {`${r.calories} kcal · ${r.protein}g P`}
                </Typography>
              </View>

              <DmvChip
                variant={STATE_VARIANT[r.state] ?? 'neutral'}
                label={r.state}
              />
            </View>
          ))}
        </View>

        {/* The mock keeps this button in the content flow under the list. */}
        <View style={styles.cta}>
          <DmvButton
            title="Build a Meal"
            variant="primary"
            onPress={() => navigation.navigate('AddFoodManualScreen')}
          />
        </View>
      </DmvScreen>
      <StackTabBar activeTab="diary" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  cta: { marginTop: Sizer.vSize(16) },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(12),
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
    marginBottom: Sizer.vSize(12),
  },
  tab: {
    flex: 1,
    paddingVertical: Sizer.vSize(10),
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabOn: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  tabOff: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(10),
    borderRadius: 16,
    padding: Sizer.hSize(12),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: Sizer.vSize(12),
  },
  noteIcon: { marginTop: 2 },
  list: { gap: Sizer.vSize(8) },
  recipe: {
    borderRadius: 16,
    padding: Sizer.hSize(14),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizer.hSize(8),
  },
  recipeText: { flex: 1, minWidth: 0, paddingRight: Sizer.hSize(8) },
  recipeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
  },
  versionTag: {
    paddingHorizontal: Sizer.hSize(6),
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.raised,
  },
});

export default MealsRecipesScreen;
