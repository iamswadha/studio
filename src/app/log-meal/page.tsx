import { redirect } from 'next/navigation';

export default function LogMealPage() {
    // Redirect to a default meal tab
    redirect('/log-meal/breakfast');
}
