import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { Typography } from '../../atomComponents';
import {
  AuthScreen,
  AuthBrandLogo,
  AuthBackButton,
  AuthCard,
  AuthIconTile,
  CodeBoxes,
  DmvButton,
} from '../../components';
import { showToast, signIn, selectTranslate } from '../../redux/slices/appSlice';
import { useCustomMutation } from '../../query';
import { verifyEmail } from '../../api';

/** Screen 08 · Verify Email */
const VerifyEmailScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslate);
  const [code, setCode] = useState(['8', '4', '1', '0', '', '']);
  const [countdown, setCountdown] = useState(42);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const { mutate, isPending } = useCustomMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      dispatch(signIn());
      dispatch(showToast('Email verified successfully'));
      navigation.navigate('GoalScreen');
    },
    onError: () => dispatch(showToast("That code didn't match. Try again.")),
  });

  const handleVerify = () => mutate({ code: code.join('') });

  // The mock verifies as soon as the last box is filled.
  const handleCodeChange = (next, index) => {
    setCode(next);
    if (index === next.length - 1 && next[index]) handleVerify();
  };

  return (
    <AuthScreen
      footer={
        <View style={styles.footerBtn}>
          <DmvButton title="Verify" variant="primary" loading={isPending} onPress={handleVerify} />
        </View>
      }
    >
      <View style={styles.head}>
        <AuthBackButton onPress={() => navigation.navigate('CreateAccountScreen')} />
        <AuthBrandLogo style={styles.logo} />
      </View>

      <AuthCard centered style={styles.card}>
        <AuthIconTile icon="mail" />

        <Typography
          size={26}
          fFamily="displayBold700"
          textAlign="center"
          textTransform="uppercase"
          letterSpacing={0.78}
          lineHeight={27}
        >
          {t('CHECK YOUR INBOX')}
        </Typography>

        <Typography size={13} color={COLORS.muted} textAlign="center" lineHeight={20} mT={6}>
          We sent a six-digit code to
        </Typography>
        <Typography size={13} fFamily="bodySemiBold600" textAlign="center" mT={2} mB={20}>
          alicia.nguyen@gmail.com
        </Typography>

        <View style={styles.codes}>
          <CodeBoxes value={code} onChange={handleCodeChange} boxWidth={42} boxHeight={50} fontSize={20} gap={7} />
        </View>

        <View style={styles.helper}>
          <Typography size={12.5} color={COLORS.muted}>
            Didn't get it?{' '}
          </Typography>
          <Pressable
            disabled={countdown > 0}
            hitSlop={8}
            onPress={() => {
              setCountdown(45);
              dispatch(showToast('Code resent to your inbox'));
            }}
          >
            <Typography
              size={12.5}
              fFamily="bodySemiBold600"
              color={COLORS.primarySoft}
              style={countdown > 0 && styles.disabled}
            >
              Send again
            </Typography>
          </Pressable>
          <Typography size={12.5} color={COLORS.faint}>
            {` in 0:${String(countdown).padStart(2, '0')}`}
          </Typography>
        </View>
      </AuthCard>
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  head: { position: 'relative', width: '100%', alignItems: 'center', justifyContent: 'center' },
  logo: { marginBottom: Sizer.vSize(8) },
  card: { padding: Sizer.hSize(20) },
  codes: { width: '100%', marginBottom: Sizer.vSize(20) },
  helper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
  disabled: { opacity: 0.6 },
  footerBtn: { width: '100%' },
});

export default VerifyEmailScreen;
