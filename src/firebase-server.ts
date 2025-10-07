'use server';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';

config();

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
let serviceAccount: object | undefined;

if (serviceAccountString) {
  try {
    serviceAccount = JSON.parse(serviceAccountString);
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string.", error);
    serviceAccount = undefined;
  }
}


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export async function getFirebase() {
  if (!serviceAccount) {
    throw new Error('Firebase Admin SDK service account is not configured. Please set the FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
  }

  if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount),
    });
  }
  return {
    auth: getAuth(getApp()),
    firestore: getFirestore(getApp()),
  };
}
