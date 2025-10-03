import { redirect } from 'next/navigation';

export default function LogMealPage() {
  // Redirect to the default meal tab
  redirect('/log-meal/morningSnack');
}
