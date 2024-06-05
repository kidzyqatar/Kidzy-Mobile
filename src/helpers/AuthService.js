import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  scopes: [], // [Android] what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '654704406128-duju15e9trfc9i3fcnk59lkco919633a.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId:
    '654704406128-ovcl7ba1l11fgqo0mk93drp4i4ul6amb.apps.googleusercontent.com',

  // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const isSignedInGoogle = async userData => {
  const isGoogleSignedIn = await GoogleSignin.isSignedIn();
  if (isGoogleSignedIn) {
    const userInfo = await GoogleSignin.getCurrentUser();
    userData['email'] = userInfo.user.email;
    userData['name'] = userInfo.user.name;

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.idToken,
    );
    // // Sign-in the user with the credential
    const authData = await auth().signInWithCredential(googleCredential);
    userData['provider_token'] = authData.user.uid;
    return userData;
  }
};

export const googleSigninPressed = async userData => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const processedUserData = await isSignedInGoogle(userData);
    return processedUserData;
  } catch (error) {
    console.log(error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.warn('SIGN_IN_CANCELLED');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.warn('IN_PROGRESS');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.warn('PLAY_SERVICES_NOT_AVAILABLE');
    } else {
      console.log(error.toString());
    }
  }
};
