import data from './.env';
exports.details = {
  apiKey: data.apiKey,
  appId: data.appId,
  authDomain: data.authDomain,
  messagingSenderId: data.messagingSenderId,
  projectId: data.projectId,
  storageBucket: data.storageBucket
};
