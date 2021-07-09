import React, { useState, useEffect, useContext, createContext } from "react";
import queryString from "query-string";
import fakeAuth from "fake-auth";
import {
  UserPool,
  getUserByUsername,
  authenticateUser,
  getCurrentUser,
  forgotPassword,
  changePassword,
} from "../services/cognitoAuth";
import { updateUser } from "./db";
import router from "next/router";
import PageLoader from "./../components/PageLoader";
import analytics from "./analytics";

// Whether to merge extra user data from database into auth.user
const MERGE_DB_USER = true;

// Whether to connect analytics session to user.uid
const ANALYTICS_IDENTIFY = true;

const authContext = createContext();

// Context Provider component that wraps your app and makes auth object
// available to any child component that calls the useAuth() hook.
export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook that enables any component to subscribe to auth state
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useAuthProvider() {
  // Store auth user object
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Format final user object and merge extra data from database
  const finalUser = getCurrentUser();
  // Connect analytics session to user
  useIdentifyUser(finalUser);

  // Handle response from authentication functions
  const handleAuth = async (user, jwtToken) => {
    setUser(user);
    setToken(jwtToken);
    return user;
  };

  const signup = (email, password) => {
    return new Promise((resolve, reject) => {
      UserPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const cognitoUser = result.user;
          resolve(cognitoUser);
        }
      });
    });
  };

  const signin = (email, password) => {
    return authenticateUser(email, password).then((user, jwtToken) => {
      handleAuth(user, jwtToken);
    });
  };

  const confirm = (username, confirmationCode) => {
    return new Promise((resolve, reject) => {
      getUserByUsername(username).confirmRegistration(
        confirmationCode,
        true,
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  };

  const signinWithProvider = (name) => {
    return fakeAuth
      .signinWithProvider(name)
      .then((response) => handleAuth(response.user));
  };

  const signout = () => {
    return new Promise((resolve, reject) => {
      getCurrentUser().signOut();
      resolve();
    });
  };

  const sendPasswordResetEmail = (email) => {
    return forgotPassword(email);
  };

  const confirmPasswordReset = (password, code) => {
    const username = getFromQueryString("user_name");
    const resetCode = code || getFromQueryString("confirmation_code");
    return changePassword(username, password, resetCode);
  };

  const updateEmail = (email) => {
    return fakeAuth.updateEmail(email).then((rawUser) => {
      setUser(rawUser);
    });
  };

  const updatePassword = (password) => {
    return fakeAuth.updatePassword(password);
  };

  // Update auth user and persist to database (including any custom values in data)
  // Forms can call this function instead of multiple auth/db update functions
  const updateProfile = async (data) => {
    const { email, name, picture } = data;

    // Update auth email
    if (email) {
      await fakeAuth.updateEmail(email);
    }

    // Update auth profile fields
    if (name || picture) {
      let fields = {};
      if (name) fields.name = name;
      if (picture) fields.picture = picture;
      await fakeAuth.updateProfile(fields);
    }

    // Persist all data to the database
    await updateUser(user.username, data);

    // Update user in state
    const currentUser = await fakeAuth.getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    // Subscribe to user on mount
    const unsubscribe = fakeAuth.onChange(async (response) => {
      if (response.user) {
        setUser(response.user);
      } else {
        setUser(false);
      }
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, []);

  return {
    user: finalUser,
    signup,
    confirm,
    signin,
    signinWithProvider,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    updateEmail,
    updatePassword,
    updateProfile,
    getCurrentUser,
  };
}

// A Higher Order Component for requiring authentication
export const requireAuth = (Component) => {
  return (props) => {
    // Get authenticated user
    const auth = useAuth();

    useEffect(() => {
      // Redirect if not signed in
      if (auth.user === false || auth.user == null) {
        router.replace("/auth/signin");
      }
    }, [auth]);
    return <Component {...props} />;
  };
};

// Connect analytics session to current user.uid
function useIdentifyUser(user) {
  useEffect(() => {
    if (ANALYTICS_IDENTIFY && user) {
      analytics.identify(user.username);
    }
  }, [user]);
}

const getFromQueryString = (key) => {
  return queryString.parse(window.location.search)[key];
};
