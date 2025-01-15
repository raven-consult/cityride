import auth from "@react-native-firebase/auth";
import { utils } from "@react-native-firebase/app";
import {GoogleSignin} from "@react-native-google-signin/google-signin";


// all good and valid \o/
export const hasPlayServices = () => {
  const { isAvailable } = utils().playServicesAvailability;
  return isAvailable;
}


export async function signAsAnonymous() {
  try {
    const userCredential = await auth().signInAnonymously();
    return userCredential;
  } catch (error) {
    console.error("Error during anonymous sign-in:", error);
    throw error;
  }
}

export async function signInWithGoogle() {
  try {
    // Check Google Play Services availability
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    // Sign in the user
    const signInResult = await GoogleSignin.signIn();

    // Extract the ID token
    const idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error("Google Sign-In failed: No ID token found");
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Authenticate the user with Firebase
    const userCredential = await auth().signInWithCredential(googleCredential);

    return userCredential;
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    throw error;
  }
}
