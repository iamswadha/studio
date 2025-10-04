import { redirect } from 'next/navigation';

export default function Home() {
  // The main entry point redirects to the dashboard for logged-in users.
  // In a real app, this would check for an active session.
  redirect('/dashboard');
}
