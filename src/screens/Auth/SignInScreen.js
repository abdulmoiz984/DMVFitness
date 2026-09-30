import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { AuthScreen, AuthBrandLogo, AuthCard, DmvButton, DmvInput } from '../../components';
import { completeSetup, showToast, signIn, selectTranslate } from '../../redux/slices/appSlice';
import { useCustomMutation } from '../../query';
import { login } from '../../api';
import { firstError, signInRules } from '../../validations';

/** Apple wordmark glyph — the mock uses the  character, which Android lacks. */
const AppleMark = () => (
  <Svg width={Sizer.fS(16)} height={Sizer.fS(18)} viewBox="0 0 16 18">
    <Path
      fill={COLORS.foreground}
      d="M13.1 9.5c0-2 1.6-3 1.7-3.1-0.9-1.4-2.4-1.5-2.9-1.6-1.2-0.1-2.4 0.7-3 0.7s-1.6-0.7-2.6-0.7c-1.3 0-2.6 0.8-3.3 2C1.6 9.4 2.7 13 4.1 15c0.7 1 1.5 2.1 2.6 2s1.4-0.6 2.7-0.6 1.6 0.6 2.7 0.6 1.8-1 2.5-2c0.8-1.1 1.1-2.2 1.1-2.3s-2.1-0.8-2.1-3.2zM11.2 3.5c0.6-0.7 1-1.7 0.9-2.7-0.9 0-1.9 0.6-2.5 1.3-0.5 0.6-1 1.6-0.9 2.6 1 0.1 2-0.5 2.5-1.2z"
    />
  </Svg>
);

/** Screen 06 · Sign In */
const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslate);
  const [email, setEmail] = useState('alicia.nguyen@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const enter = message => {
    // An existing account has already been through setup.
    dispatch(signIn());
    dispatch(completeSetup());
    dispatch(showToast(message));
    navigation.replace('MainTabs', { screen: 'TodayTab' });
  };

  const { mutate, isPending } = useCustomMutation({
    mutationFn: login,
    onSuccess: () => enter('Signed in as Alicia Nguyen'),
    onError: () => setErrorMsg("That email and password don't match."),
  });

  const handleSignIn = () => {
    const invalid = firstError(signInRules, { email, password });
    if (invalid) {
      setErrorMsg(invalid);
      return;
    }
    mutate({ email, password });
  };

  return (
    <AuthScreen
      footer={
        <View style={styles.footerRow}>
          <Typography size={12.5} color={COLORS.muted}>
            New here?{' '}
          </Typography>
          <Pressable onPress={() => navigation.navigate('CreateAccountScreen')} hitSlop={8}>
            <Typography size={12.5} fFamily="bodySemiBold600" color={COLORS.primary}>
              Create an account
            </Typography>
          </Pressable>
        </View>
      }
    >
      <AuthBrandLogo />

      <AuthCard>
        <Typography size={26} fFamily="displayBold700" textTransform="uppercase" letterSpacing={0.78} lineHeight={27}>
          {t('WELCOME BACK')}
        </Typography>
        <Typography size={12.5} color={COLORS.muted} lineHeight={19} mT={4} mB={16}>
          Your workouts, meals and photos are waiting.
        </Typography>

        <View style={styles.form}>
          <DmvInput
            label="EMAIL"
            value={email}
            onChangeText={v => {
              setEmail(v);
              setErrorMsg('');
            }}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />

          <DmvInput
            label="PASSWORD"
            value={password}
            onChangeText={v => {
              setPassword(v);
              setErrorMsg('');
            }}
            placeholder="••••••••••"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            error={errorMsg}
            rightElement={
              <Pressable
                onPress={() => setShowPassword(s => !s)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                style={styles.eye}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={Sizer.fS(16)} color={COLORS.muted} />
              </Pressable>
            }
          />

          <View style={styles.forgotRow}>
            <Pressable onPress={() => navigation.navigate('ForgotPasswordScreen')} hitSlop={8}>
              <Typography size={12} fFamily="bodyMedium500" color={COLORS.primarySoft}>
                Forgot password?
              </Typography>
            </Pressable>
          </View>

          <View style={styles.submit}>
            <DmvButton title="Sign in" variant="primary" loading={isPending} onPress={handleSignIn} />
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.rule} />
          <Typography size={11} color={COLORS.faint} textTransform="uppercase" letterSpacing={0.55}>
            or
          </Typography>
          <View style={styles.rule} />
        </View>

        <View style={styles.socials}>
          <DmvButton
            variant="ghost"
            title="Continue with Apple"
            icon={<AppleMark />}
            onPress={() => enter('Connected with Apple')}
          />
          <DmvButton
            variant="ghost"
            title="Continue with Google"
            icon={
              <Typography size={14} fFamily="bodyBold700" color={COLORS.foreground}>
                G
              </Typography>
            }
            onPress={() => enter('Connected with Google')}
          />
        </View>
      </AuthCard>
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  form: { gap: Sizer.vSize(12) },
  eye: { padding: 4 },
  forgotRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: -Sizer.vSize(4) },
  submit: { marginTop: Sizer.vSize(4) },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    marginVertical: Sizer.vSize(16),
  },
  rule: { flex: 1, height: 1, backgroundColor: COLORS.fgA10 },
  socials: { gap: Sizer.vSize(8) },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

export default SignInScreen;
