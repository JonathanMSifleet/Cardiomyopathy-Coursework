const process = import.meta.env;

// details can be found here: https://support.google.com/firebase/answer/7015592#web
export default {
  apiKey: process.VITE_API_KEY,
  authDomain: process.VITE_AUTH_DOMAIN,
  projectId: process.VITE_PROJECT_ID,
  storageBucket: process.VITE_STORAGE_BUCKET,
  messagingSenderId: process.VITE_MESSAGING_SENDER_ID,
  appId: process.VITE_APP_ID
};
