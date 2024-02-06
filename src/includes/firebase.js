import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBuatmJmNTGiqOiVLg2wTVvsfZVlIrmYqQ',
  authDomain: 'music-ed0d8.firebaseapp.com',
  projectId: 'music-ed0d8',
  storageBucket: 'music-ed0d8.appspot.com',
  appId: '1:167190151142:web:89bb5a949e5d86f2562027'
};

export default firebase.initializeApp(firebaseConfig);

const auth = firebase.auth(); // call auth from firebase
const db = firebase.firestore(); // call firestore from firebase
const storage = firebase.storage(); // call storage from firebase

db.enablePersistence().catch((error) => {
  console.log(`Firebase persistence error' ${error.code}`);
});

const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');
export { auth, db, usersCollection, songsCollection, storage, commentsCollection };
