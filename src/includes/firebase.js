import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyBuatmJmNTGiqOiVLg2wTVvsfZVlIrmYqQ',
  authDomain: 'music-ed0d8.firebaseapp.com',
  projectId: 'music-ed0d8',
  storageBucket: 'music-ed0d8.appspot.com',
  appId: '1:167190151142:web:89bb5a949e5d86f2562027'
}

export default firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()

const usersCollection = db.collection('users')
export { auth, db, usersCollection }
