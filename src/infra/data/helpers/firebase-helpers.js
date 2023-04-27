import firebase from 'firebase/compat/app'

import 'firebase/compat/database'

import { env } from '../../../main/config/env'

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  databaseURL: env.FIREBASE_DATABASE_URL,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
}
let database = null
if (process.env.NODE_ENV === 'testing') {
  import(
    '../../../tests/helpers/firebase-test-helpers'
  ).then(({default: firebaseTestHelpers}) => {
    firebaseTestHelpers.connect().then(data => {
      database = data.authenticatedContext('testing_user').database()
    })
  })

  
} else {
  firebase.initializeApp(firebaseConfig)
  database = firebase.database()
}

export { database, firebase }
