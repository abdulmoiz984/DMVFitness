import React, { useState } from 'react';
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
  DmvButton,
  DmvInput,
  RichText,
} from '../../components';
import { showToast, selectTranslate } from '../../redux/slices/appSlice';
import { useCustomMutation } from '../../query';
import { forgotPassword } from '../../api';
import { firstError, forgotPasswordRules } from '../../validations';

/** Screen 06b · Forgot Password */
const ForgotPasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslate);
  const [email, setEmail] = useState('alicia.nguyen@gmail.com');

  const { mutate, isPending } = useCustomMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      dispatch(showToast('Password reset link sent to your email!'));
      navigation.navigate('ResetPasswordScreen');
    },
    onError: () => dispatch(showToast("We couldn't send that code. Try again.")),
  });

  const handleSend = () => {
    const invalid = firstError(forgotPasswordRules, { email });
    if (invalid) {
      dispatch(showToast(invalid));
      return;
    }
    mutate({ email });
  };

  return (
    <AuthScreen
      footer={
        <Pressable onPress={() => navigation.navigate('SignInScreen')} hitSlop={8}>
          <RichText size={13} fFamily="bodySemiBold600" color={COLORS.primarySoft}>
            ← Back to Sign in
          </RichText>
        </Pressable>
      }
    >
      <View style={styles.head}>
        <AuthBackButton onPress={() => navigation.navigate('SignInScreen')} />
        <AuthBrandLogo style={styles.logo} />
      </View>

      <AuthCard centered style={styles.card}>
        <AuthIconTile icon="key-round" />

        <Typography
          size={26}
          fFamily="displayBold700"
          textAlign="center"
          textTransform="uppercase"
          letterSpacing={0.78}
          lineHeight={27}
        >
          {t('FORGOT PASSWORD')}
        </Typography>

        <Typography size={12.5} color={COLORS.muted} textAlign="center" lineHeight={19} mT={6} mB={20} style={styles.body}>
          Enter your registered email address and we'll send you a recovery code to reset your password.
        </Typography>

        <View style={styles.form}>
          <DmvInput
            label="EMAIL ADDRESS"
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <DmvButton title="Send recovery code" variant="primary" loading={isPending} onPress={handleSend} />
        </View>
      </AuthCard>
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  head: { position: 'relative', width: '100%', alignItems: 'center', justifyContent: 'center' },
  logo: { marginBottom: Sizer.vSize(8) },
  card: { padding: Sizer.hSize(20) },
  body: { maxWidth: Sizer.hSize(300) },
  form: { width: '100%', gap: Sizer.vSize(14) },
});

export default ForgotPasswordScreen;
