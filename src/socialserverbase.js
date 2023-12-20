// Import the functions you need from the SDKs you need
import auth from "serverbase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const onSocialClick = async (event) => {
  const {
      target: { name },
  } = event;
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider)
  .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
  }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
  });
}

export default onSocialClick;