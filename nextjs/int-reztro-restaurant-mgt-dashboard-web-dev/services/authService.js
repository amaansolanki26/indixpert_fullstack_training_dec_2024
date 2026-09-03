import "@/helper/cognito";
import {
  signUp,
  confirmSignUp,
  resendSignUpCode,
  signIn,
  signOut,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";

export const AuthService = {
  // 1. Signup/Register User
  async register(data) {
    return await signUp({
      username: data.email,
      password: data.password,
      options: {
        userAttributes: {
          email: data.email,
          name: data.fullName,
        },
      },
    });
  },

  // 2. Verify Signup OTP
  async verifySignup(email, code) {
    return await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
  },

  // 3. Resend OTP for Signup
  async resendSignupOTP(email) {
    return await resendSignUpCode({
      username: email,
    });
  },

  // 4. Login User (Saves and Returns Tokens)
  async login(email, password) {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    });

    if (!isSignedIn && nextStep?.signInStep !== "DONE") {
      throw new Error(nextStep?.signInStep || "Login failed");
    }

    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();
    const idToken = session.tokens?.idToken?.toString();

    if (!accessToken || !idToken) {
      throw new Error("Token not found from AWS Cognito Session");
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("idToken", idToken);

    return { accessToken, idToken };
  },

  // 5. Logout User
  async logout() {
    await signOut();

    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.clear();

    document.cookie =
      "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  },

  // 6. Forgot Password (Triggers OTP)
  async forgotPassword(email) {
    return await resetPassword({
      username: email,
    });
  },

  // 7. Reset Password (Submits OTP & New Password together)
  async resetPassword(email, code, password) {
    return await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword: password,
    });
  },

  // 8. Get Current Auth User
  async currentUser() {
    return await getCurrentUser();
  },

  // 9. Helper to get active ID token string
  async token() {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();
  },
};