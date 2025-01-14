import auth from "@react-native-firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";


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
