import React from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import Icon from '../helpers/Icon';
import { Typography } from '../atomComponents';
import { EMOJI_IMAGES } from '../assets/images';
import { SHELL_MAX_WIDTH } from '../constants';

const ACTIONS = [
  { id: 'log-food', label: 'Log food', sub: 'Search database or custom', emoji: '🥗' },
  { id: 'scan-barcode', label: 'Scan barcode', sub: 'Instant packaged nutrition', emoji: '📷' },
  { id: 'start-workout', label: 'Start workout', sub: 'Push Day A ready', emoji: '🏋️' },
  { id: 'new-checkin', label: 'New check-in', sub: 'Photos & measurements (private)', emoji: '📸' },
  { id: 'log-weight', label: 'Log weight', sub: 'Track morning weigh-in', emoji: '⚖️' },
];

/** Ported from DmvActionSheet — the FAB's quick-actions sheet. */
export const DmvActionSheet = ({ visible, onClose, onAction }) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + Sizer.vSize(24) }]}
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.head}>
            <Typography
              size={14}
              fFamily="displaySemiBold600"
              color={COLORS.muted}
              textTransform="uppercase"
              letterSpacing={1}
            >
              Quick actions
            </Typography>
            <Pressable onPress={onClose} hitSlop={8} style={styles.close}>
              <Icon name="x" size={Sizer.fS(16)} color={COLORS.muted} />
            </Pressable>
          </View>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {ACTIONS.map(act => (
              <Pressable
                key={act.id}
                onPress={() => {
                  onClose?.();
                  onAction?.(act.id);
                }}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <View style={styles.rowLeft}>
                  <View style={styles.iconBox}>
                    <Image source={EMOJI_IMAGES[act.emoji]} style={styles.emoji} />
                  </View>
                  <View>
                    <Typography size={14} fFamily="bodySemiBold600">
                      {act.label}
                    </Typography>
                    <Typography size={11.5} color={COLORS.muted}>
                      {act.sub}
                    </Typography>
                  </View>
                </View>
                <Icon name="chevron-right" size={Sizer.fS(16)} color={COLORS.faint} />
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: {
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(232,232,236,0.14)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Sizer.hSize(16),
    gap: Sizer.vSize(12),
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Sizer.vSize(4),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232,232,236,0.08)',
  },
  close: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { flexGrow: 0 },
  listContent: { gap: Sizer.vSize(8) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizer.hSize(12),
    borderRadius: 12,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: 'rgba(232,232,236,0.06)',
  },
  rowPressed: { backgroundColor: COLORS.raised },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12) },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(141,34,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { width: Sizer.fS(18), height: Sizer.fS(18) },
});

export default DmvActionSheet;
