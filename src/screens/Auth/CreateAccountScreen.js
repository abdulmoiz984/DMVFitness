import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { AuthScreen, AuthBrandLogo, AuthBackButton, AuthCard, DmvButton, DmvInput } from '../../components';
import { showToast, selectTranslate } from '../../redux/slices/appSlice';
import { useCustomMutation } from '../../query';
import { register } from '../../api';
import { createAccountRules, firstError } from '../../validations';

/** Screen 07 · Create Account */
const CreateAccountScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslate);
  const [firstName, setFirstName] = useState('Alicia');
  const [email, setEmail] = useState('alicia.nguyen@gmail.com');
  const [password, setPassword] = useState('FitnessPro2026!');
  const [agreed, setAgreed] = useState(true);

  const { mutate, isPending } = useCustomMutation({
    mutationFn: register,
    onSuccess: () => navigation.navigate('VerifyEmailScreen'),
    onError: () => dispatch(showToast("We couldn't create that account. Try again.")),
  });

  const handleCreate = () => {
    if (!agreed) {
      dispatch(showToast('Please accept the terms to continue'));
      return;
    }
    const invalid = firstError(createAccountRules, { name: firstName, email, password });
    if (invalid) {
      dispatch(showToast(invalid));
      return;
    }
    mutate({ name: firstName, email, password });
  };

  return (
    <AuthScreen
      footer={
        <View style={styles.footerRow}>
          <Typography size={12.5} color={COLORS.muted}>
            Already have an account?{' '}
          </Typography>
          <Pressable onPress={() => navigation.navigate('SignInScreen')} hitSlop={8}>
            <Typography size={12.5} fFamily="bodySemiBold600" color={COLORS.primary}>
              Sign in
            </Typography>
          </Pressable>
        </View>
      }
    >
      <View style={styles.head}>
        <AuthBackButton onPress={() => navigation.navigate('SignInScreen')} />
        <AuthBrandLogo style={styles.logo} />
      </View>

      <AuthCard>
        <Typography size={26} fFamily="displayBold700" textTransform="uppercase" letterSpacing={0.78} lineHeight={27}>
          {t('START YOUR ACCOUNT')}
        </Typography>
        <Typography size={12.5} color={COLORS.muted} lineHeight={19} mT={4} mB={16}>
          Two minutes now, then we build your targets together.
        </Typography>

        <View style={styles.form}>
          <DmvInput label="FIRST NAME" value={firstName} onChangeText={setFirstName} placeholder="Your first name" />
          <DmvInput
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <DmvInput
            label="PASSWORD"
            value={password}
            onChangeText={setPassword}
            placeholder="Create password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
          />

          {/* Strength meter — the mock hard-codes 3 of 4 segments filled. */}
          <View style={styles.strength}>
            <View style={styles.bars}>
              <View style={[styles.bar, styles.barOn]} />
              <View style={[styles.bar, styles.barOn]} />
              <View style={[styles.bar, styles.barOn]} />
              <View style={[styles.bar, styles.barOff]} />
            </View>
            <Typography size={11} color={COLORS.muted}>
              Strong. At least 10 characters with a number.
            </Typography>
          </View>

          <Pressable style={styles.consent} onPress={() => setAgreed(a => !a)}>
            <View style={[styles.box, agreed ? styles.boxOn : styles.boxOff]}>
              {agreed ? <Icon name="check" size={Sizer.fS(12)} color={COLORS.white} /> : null}
            </View>
            <Typography size={11.5} color={COLORS.muted} lineHeight={18} flex={1}>
              I agree to the <Typography size={11.5} color={COLORS.primary} style={styles.link}>Terms</Typography> and{' '}
              <Typography size={11.5} color={COLORS.primary} style={styles.link}>Privacy Policy</Typography>. I am 18 or
              older.
            </Typography>
          </Pressable>

          <View style={styles.submit}>
            <DmvButton title="Create account" variant="primary" loading={isPending} onPress={handleCreate} />
          </View>
        </View>
      </AuthCard>
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  head: { position: 'relative', width: '100%', alignItems: 'center', justifyContent: 'center' },
  logo: { marginBottom: Sizer.vSize(8) },
  form: { gap: Sizer.vSize(12) },
  strength: { gap: Sizer.vSize(6), marginTop: Sizer.vSize(2) },
  bars: { flexDirection: 'row', alignItems: 'center', gap: 3, width: '100%' },
  bar: { flex: 1, height: 3.5, borderRadius: 2 },
  barOn: { backgroundColor: COLORS.success },
  barOff: { backgroundColor: COLORS.surface2 },
  consent: { flexDirection: 'row', alignItems: 'flex-start', gap: Sizer.hSize(10), marginTop: Sizer.vSize(8) },
  box: {
    width: 17,
    height: 17,
    borderRadius: 5,
    marginTop: 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  boxOn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  boxOff: { backgroundColor: COLORS.surface2, borderColor: COLORS.faint },
  link: { textDecorationLine: 'underline' },
  submit: { marginTop: Sizer.vSize(8) },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

export default CreateAccountScreen;
