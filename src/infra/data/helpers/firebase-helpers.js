import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import { env } from '../../../main/config/env'
import firebaseTestHelpers from '../../../../tests/firebase-test-helpers'

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  databaseURL: env.FIREBASE_DATABASE_URL,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
}
/**
 * @type {firebase.database.Database}
 */
let database = null
if (process.env.NODE_ENV === 'testing') {
  const rules = await firebaseTestHelpers.connect()
  database = rules.authenticatedContext('testing_user').database()
} else {
  firebase.initializeApp(firebaseConfig)
  database = firebase.database()
}

export { database, firebase }
