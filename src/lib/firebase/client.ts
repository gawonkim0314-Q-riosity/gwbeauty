import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { assertFirebaseConfig, firebaseConfig } from "./config";

const APP_KEY = "__gwbeauty_firebase_app__";
const AUTH_KEY = "__gwbeauty_firebase_auth__";

type FirebaseWindow = Window & {
  [APP_KEY]?: FirebaseApp;
  [AUTH_KEY]?: Auth;
};

function getFirebaseWindow(): FirebaseWindow {
  return window as FirebaseWindow;
}

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase client is only available in the browser");
  }

  const w = getFirebaseWindow();
  if (w[APP_KEY]) return w[APP_KEY]!;

  assertFirebaseConfig();
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  w[APP_KEY] = app;
  return app;
}

export function getFirebaseAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error("Firebase client is only available in the browser");
  }

  const w = getFirebaseWindow();
  if (w[AUTH_KEY]) return w[AUTH_KEY]!;

  const auth = getAuth(getFirebaseApp());
  w[AUTH_KEY] = auth;
  return auth;
}
