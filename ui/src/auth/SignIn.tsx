import {
  signInWithPopup,
  signOut,
  getAuth,
  GoogleAuthProvider,
} from 'firebase/auth';
import { SignInPage } from '@toolpad/core/SignInPage';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Typography } from '@mui/material';
import { initializeApp } from 'firebase/app';

import firebaseConfig from '../config/firebase';
import axiosInstance from '../axios/axiosInstance';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const providers = [{ id: 'google', name: 'Google' }];

export const handleSignOut = async () => {
  try {
    await axiosInstance.post('/signout');
    await signOut(auth);
    window.location.reload();
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};

const SignIn = () => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();
      const claims = await result.user.getIdTokenResult();
      const existingUser = claims.claims.existingUser;


      const user = {
        idToken,
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        image_url: result.user.photoURL,
        phoneNumber: '',
        loginProvider: 'google',
        verified: result.user.emailVerified,
        existingUser: existingUser,
      };

      if (!existingUser) {
        fetch(`${import.meta.env.VITE_SERVER_URL}/create-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })
          .then(() => {
            setCookie(idToken);
          })
          .catch(error => {
            console.error('Error during create-user:', error);
          });
      } else {
        setCookie(idToken);
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  async function setCookie(idToken: string) {
    const result = await axiosInstance.post('/set-cookie', { idToken });
    if (result.status !== 200) return;
    window.location.reload();
  }

  // TODO: Monitor auth state change
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, currentUser => {
  //     setUser(currentUser);
  //   });

  //   return () => unsubscribe(); // Clean up subscription on unmount
  // }, []);

  return (
    <AppProvider>
      <SignInPage
        signIn={() => {
          signInWithGoogle();
        }}
        providers={providers}
        slots={{
          subtitle: () => (
            <Typography variant="body2">
              Welcome! Sign in to access your Cloud IDE.
            </Typography>
          ),
        }}
      />
    </AppProvider>
  );
};

export default SignIn;
