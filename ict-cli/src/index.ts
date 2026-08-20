import * as admin from 'firebase-admin';
import * as readline from 'node:readline';
import { CreateUsers } from './user-management/create-users';

// Toggle with:
// USE_EMULATOR=true npm run start-cli
const USE_EMULATOR = process.env.USE_EMULATOR === 'true';

export let ad: admin.app.App;

if (USE_EMULATOR) {
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';

  ad = admin.initializeApp({
    projectId: 'unique-phones',
    storageBucket: 'gs://unique-phones.appspot.com',
  });
} else {
  const serviceAccountPath =
      process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!serviceAccountPath) {
    throw new Error(
        'GOOGLE_APPLICATION_CREDENTIALS is not set.\n' +
        'Example:\n' +
        '$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\Users\\kabir\\Node\\firebase-credentials\\serviceAccountKey.json"'
    );
  }

  const serviceAccount = require(serviceAccountPath);

  ad = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'unique-phones',
    storageBucket: 'gs://unique-phones.appspot.com',
  });
}

console.log(
    `Running against: ${
        USE_EMULATOR
            ? 'EMULATOR'
            : 'PRODUCTION (unique-phones)'
    }`
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('PORT:', process.env.PORT);

// DON'T print your Paystack secret to the console.
console.log(
    'PAYSTACK_SECRET_KEY:',
    process.env.PAYSTACK_SECRET_KEY ? '[SET]' : '[NOT SET]'
);

console.log('Select one of the following Options:');
console.log('Option 1: Seed students, staff, exams and auth-users to db');
console.log('Option 2: Seed savest financial exams');
console.log('Option 3: Upload Photos');

rl.question('Choose an option: ', async (answer: string) => {
  switch (parseInt(answer)) {
    case 1:
      try {
        await CreateUsers();
        console.log('All data seeded successfully!');
      } catch (error) {
        console.error('Error seeding data:', error);
      }
      break;

    default:
      console.log('Invalid selection, please choose between 1 and 3.');
  }

  rl.close();
});