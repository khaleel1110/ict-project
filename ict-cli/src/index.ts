
import 'dotenv/config';

import * as admin from 'firebase-admin';
import * as readline from 'node:readline';
import { CreateUsers } from './user-management/create-users';

// ============================================================
// CONFIGURATION
// ============================================================

const PROJECT_ID = 'unique-phones';
const USE_EMULATOR = process.env.USE_EMULATOR === 'false';

// Emulator addresses
const FIRESTORE_EMULATOR_HOST =
  process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';

const FIREBASE_AUTH_EMULATOR_HOST =
  process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';

const FIREBASE_STORAGE_EMULATOR_HOST =
  process.env.FIREBASE_STORAGE_EMULATOR_HOST || '127.0.0.1:9199';

// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

export let ad: admin.app.App;

if (USE_EMULATOR) {
  // ==========================================================
  // FIREBASE EMULATORS
  // ==========================================================

  // These MUST be set before Firebase Admin is initialized.
  process.env.FIRESTORE_EMULATOR_HOST = FIRESTORE_EMULATOR_HOST;
  process.env.FIREBASE_AUTH_EMULATOR_HOST =
    FIREBASE_AUTH_EMULATOR_HOST;
  process.env.FIREBASE_STORAGE_EMULATOR_HOST =
    FIREBASE_STORAGE_EMULATOR_HOST;

  // Make the project ID explicit.
  process.env.GCLOUD_PROJECT = PROJECT_ID;

  ad = admin.initializeApp({
    projectId: PROJECT_ID,
    storageBucket: `${PROJECT_ID}.appspot.com`,
  });

  console.log('\n========================================');
  console.log('🔥 Firebase Emulator Mode');
  console.log('========================================');
  console.log(`Project:   ${PROJECT_ID}`);
  console.log(`Firestore: ${FIRESTORE_EMULATOR_HOST}`);
  console.log(`Auth:      ${FIREBASE_AUTH_EMULATOR_HOST}`);
  console.log(`Storage:   ${FIREBASE_STORAGE_EMULATOR_HOST}`);
  console.log('========================================\n');

} else {
  // ==========================================================
  // PRODUCTION FIREBASE
  // ==========================================================

  const serviceAccountPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!serviceAccountPath) {
    throw new Error(
      'GOOGLE_APPLICATION_CREDENTIALS is not set.\n\n' +
      'Example PowerShell:\n' +
      '$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\Users\\kabir\\Node\\firebase-credentials\\serviceAccountKey.json"'
    );
  }

  const serviceAccount = require(serviceAccountPath);

  ad = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: PROJECT_ID,
    storageBucket: `${PROJECT_ID}.appspot.com`,
  });

  console.log('\n========================================');
  console.log('☁️ Production Firebase Mode');
  console.log('========================================');
  console.log(`Project: ${PROJECT_ID}`);
  console.log('========================================\n');
}

// ============================================================
// ENVIRONMENT INFORMATION
// ============================================================

console.log('PORT:', process.env.PORT ?? '[NOT SET]');

console.log(
  'PAYSTACK_SECRET_KEY:',
  process.env.PAYSTACK_SECRET_KEY
    ? '[SET]'
    : '[NOT SET]'
);

// ============================================================
// CLI MENU
// ============================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('\nSelect one of the following options:\n');

console.log('1. Seed students, staff, exams and auth users');
console.log('2. Seed financial exams');
console.log('3. Upload photos');

rl.question('\nChoose an option: ', async (answer: string) => {
  try {
    const option = parseInt(answer, 10);

    switch (option) {
      case 1:
        await CreateUsers();

        console.log(
          USE_EMULATOR
            ? '\n✅ Data seeded into Firebase EMULATORS!'
            : '\n✅ Data seeded into PRODUCTION Firebase!'
        );
        break;

      case 2:
        console.log('\n⚠️ Option 2 is not implemented yet.');
        break;

      case 3:
        console.log('\n⚠️ Option 3 is not implemented yet.');
        break;

      default:
        console.log(
          '\n❌ Invalid selection. Please choose between 1 and 3.'
        );
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    rl.close();
  }
});
