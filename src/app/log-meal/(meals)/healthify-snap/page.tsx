import { HealthifySnap } from '@/components/healthify-snap';

export default function HealthifySnapPage() {
  const handleLogMeal = (meal: any) => {
    // In a real app, this would be handled by a state management library
    console.log('Meal logged:', meal);
  };
  return <HealthifySnap onLogMeal={handleLogMeal} />;
}
