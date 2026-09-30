import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import {
  AuthScreen,
  AuthBrandLogo,
  AuthBackButton,
  AuthCard,
  CodeBoxes,
  DmvButton,
  DmvInput,
} from '../../components';
import { showToast, selectTranslate } from '../../redux/slices/appSlice';
import { useCustomMutation } from '../../query';
import { resetPassword } from '../../api';
import { firstError, resetPasswordRules } from '../../validations';

/** Screen 06c · Reset Password */
const ResetPasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslate);
  const [code, setCode] = useState(['4', '8', '1', '9', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useCustomMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      dispatch(showToast('Password reset successfully! Please sign in.'));
      navigation.navigate('SignInScreen');
    },
    onError: () => dispatch(showToast("That code didn't work. Try again.")),
  });

  const handleReset = () => {
    const invalid = firstError(resetPasswordRules, {
      code: code.join(''),
      password: newPassword,
      confirm: confirmPassword,
    });
    if (invalid) {
      dispatch(showToast(invalid));
      return;
    }
    mutate({ code: code.join(''), password: newPassword });
  };

  return (
    <AuthScreen
      footer={
        <Pressable onPress={() => navigation.navigate('SignInScreen')} hitSlop={8}>
          <Typography size={13} fFamily="bodySemiBold600" color={COLORS.primarySoft}>
            Cancel and return to Sign in
          </Typography>
        </Pressable>
      }
    >
      <View style={styles.head}>
        <AuthBackButton onPress={() => navigation.navigate('ForgotPasswordScreen')} />
        <AuthBrandLogo style={styles.logo} />
      </View>

      <AuthCard>
        <View style={styles.titleRow}>
          <View style={styles.lockTile}>
            <Icon name="lock" size={Sizer.fS(20)} color={COLORS.primarySoft} />
          </View>
          <View style={styles.titleText}>
            <Typography
              size={24}
              fFamily="displayBold700"
              textTransform="uppercase"
              letterSpacing={0.72}
              lineHeight={25}
            >
              {t('CREATE NEW PASSWORD')}
            </Typography>
            <Typography size={11.5} color={COLORS.muted}>
              Enter code and choose your new password.
            </Typography>
          </View>
        </View>

        <View style={styles.codeBlock}>
          <Typography
            size={10}
            fFamily="displaySemiBold600"
            color={COLORS.muted}
            textTransform="uppercase"
            letterSpacing={1.4}
            mB={6}
          >
            6-DIGIT RECOVERY CODE
          </Typography>
          <CodeBoxes value={code} onChange={setCode} boxWidth={40} boxHeight={46} fontSize={18} gap={6} radius={11} />
        </View>

        <View style={styles.form}>
          <DmvInput
            label="NEW PASSWORD"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="At least 8 characters"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
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
          <DmvInput
            label="CONFIRM NEW PASSWORD"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter new password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
          />
          <View style={styles.submit}>
            <DmvButton title="Save new password" variant="primary" loading={isPending} onPress={handleReset} />
          </View>
        </View>
      </AuthCard>
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  head: { position: 'relative', width: '100%', alignItems: 'center', justifyContent: 'center' },
  logo: { marginBottom: Sizer.vSize(8) },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), marginBottom: Sizer.vSize(12) },
  lockTile: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: 12,
    backgroundColor: 'rgba(141,34,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  titleText: { flex: 1, minWidth: 0 },
  codeBlock: { marginBottom: Sizer.vSize(14) },
  form: { gap: Sizer.vSize(12) },
  eye: { padding: 4 },
  submit: { marginTop: Sizer.vSize(4) },
});

export default ResetPasswordScreen;
