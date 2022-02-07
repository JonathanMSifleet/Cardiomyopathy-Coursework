import firebase from 'firebase/app';
import firebaseDetails from '../constants/firebaseDetails';

module.exports = firebase
  .initializeApp(firebaseDetails)
  .firestore();
