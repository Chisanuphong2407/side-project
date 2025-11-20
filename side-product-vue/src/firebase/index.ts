// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth' // ⭐️ Import Auth Service
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDONCxCRc0UQa0w9UEdXfTDmdd1UGV9Dkc',
  authDomain: 'authentication-80fd0.firebaseapp.com',
  projectId: 'authentication-80fd0',
  storageBucket: 'authentication-80fd0.firebasestorage.app',
  messagingSenderId: '792954839882',
  appId: '1:792954839882:web:10f1b3faa06f4cb49fd7b3',
  measurementId: 'G-CCG881CTMF',
}

//initialize firebase
const app = initializeApp(firebaseConfig)

//export firebase auth app
export const auth = getAuth(app)
//export firebase database app
export const db = getFirestore(app)
