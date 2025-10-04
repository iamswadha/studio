'use server';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export async function getFirebase() {
  if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount!),
    });
  }
  return {
    auth: getAuth(getApp()),
    firestore: getFirestore(getApp()),
  };
}
