import { redirect } from 'next/navigation';

export default function Home() {
  // The main entry point redirects to the signup page for new users.
  // In a real app, this would check for an active session.
  redirect('/signup');
}
