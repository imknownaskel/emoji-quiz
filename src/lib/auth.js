import { auth, db } from './firebase.js';
import { authGuard } from './authGuard.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { getDefaultLanguage } from './translate.js';

const googleProvider = new GoogleAuthProvider();

function getTodayKey() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function mapAuthError(error) {
  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'No account found for that email and password. New here? Switch to Sign Up.';
    case 'auth/email-already-in-use':
      return 'An account with that email already exists. Try logging in instead.';
    case 'auth/weak-password':
      return 'Password is too weak — use at least 6 characters.';
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/too-many-requests':
      return 'Too many attempts — wait a moment and try again.';
    default:
      return error.message;
  }
}

export async function signUp(email, password, username, language = getDefaultLanguage()) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await updateAuthProfile(user, { displayName: username });
    await sendEmailVerification(user);

    const resolvedLanguage = language || getDefaultLanguage();

    await setDoc(doc(db, 'profiles', user.uid), {
      username,
      xp:                     0,
      level:                  1,
      highest_unlocked_level: 1,
      completed_levels:       [],
      high_score:             0,
      language:               resolvedLanguage,
      last_daily_reset_date:  getTodayKey(),
    });

    return { user, error: null };
  } catch (error) {
    return { user: null, error: mapAuthError(error) };
  }
}

export async function signIn(email, password) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: mapAuthError(error) };
  }
}

export async function signInWithGoogle(isSignupMode) {
  authGuard.suppressed = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;

    const profileRef = doc(db, 'profiles', user.uid);
    const existing = await getDoc(profileRef);
    const accountExists = existing.exists();

    if (!isSignupMode && !accountExists) {
      await user.delete();
      return { user: null, error: 'No account found for that Google account. Switch to Sign Up first.' };
    }

    if (isSignupMode && accountExists) {
      await firebaseSignOut(auth);
      return { user: null, error: 'That Google account is already registered. Switch to Login instead.' };
    }

    if (!accountExists) {
      await setDoc(profileRef, {
        username:                user.displayName || user.email.split('@')[0],
        xp:                      0,
        level:                   1,
        highest_unlocked_level: 1,
        completed_levels:        [],
        high_score:              0,
        language:                getDefaultLanguage(),
        last_daily_reset_date:   getTodayKey(),
      });
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: mapAuthError(error) };
  } finally {
    authGuard.suppressed = false;
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: mapAuthError(error) };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export function getSession() {
  return auth.currentUser;
}

export async function getProfile(userId, fallbackUser) {
  try {
    const profileRef = doc(db, 'profiles', userId);
    const snapshot    = await getDoc(profileRef);

    if (snapshot.exists()) {
      return { profile: { id: userId, ...snapshot.data() }, error: null };
    }

    if (fallbackUser) {
      const username = fallbackUser.displayName || fallbackUser.email.split('@')[0];
      const newProfile = {
        username,
        xp:                      0,
        level:                   1,
        highest_unlocked_level: 1,
        completed_levels:        [],
        high_score:              0,
        language:                getDefaultLanguage(),
        last_daily_reset_date:   getTodayKey(),
      };

      await setDoc(profileRef, newProfile);
      return { profile: { id: userId, ...newProfile }, error: null };
    }

    return { profile: null, error: 'Profile not found.' };
  } catch (error) {
    return { profile: null, error: error.message };
  }
}

export async function updateProfile(userId, fields) {
  try {
    await updateDoc(doc(db, 'profiles', userId), fields);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function resetAccountData(userId, username) {
  try {
    await updateDoc(doc(db, 'profiles', userId), {
      username,
      xp: 0,
      level: 1,
      high_score: 0,
      highest_unlocked_level: 1,
      completed_levels: [],
      language: getDefaultLanguage(),
      last_daily_reset_date: getTodayKey(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteAccount(userId) {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser || currentUser.uid !== userId) {
      return { error: 'You must be signed in to delete this account.' };
    }

    await currentUser.delete();

    try {
      await deleteDoc(doc(db, 'profiles', userId));
    } catch (profileError) {
      console.warn('Profile document cleanup failed after account deletion:', profileError);
    }

    return { error: null };
  } catch (error) {
    if (error && error.code === 'auth/requires-recent-login') {
      return {
        error: 'Please sign in again and then try deleting your account.',
      };
    }

    return { error: error?.message || 'Unable to delete account right now.' };
  }
}

export async function getLeaderboard() {
  try {
    const q = query(
      collection(db, 'profiles'),
      orderBy('high_score', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const board = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { board, error: null };
  } catch (error) {
    return { board: [], error: error.message };
  }
}