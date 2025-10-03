'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { getMealAnalysis } from '@/lib/actions';
import type { LogMealsWithHealthifySnapOutput } from '@/ai/flows/log-meals-with-healthify-snap';
import {
  Camera,
  Flame,
  Loader2,
  Salad,
  Beef,
  Wheat,
  Drumstick,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { Separator } from '@/components/ui/separator';

export default function HealthifySnapPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] =
    useState<LogMealsWithHealthifySnapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preview) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please select an image of your meal to analyze.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getMealAnalysis({ photoDataUri: preview });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || 'An unknown error occurred.');
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description:
            response.error || 'An unknown error occurred. Please try again.',
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogMeal = () => {
    if (!result) return;
    toast({
      title: 'Meal Logged!',
      description: `Successfully logged ${result.calories} kcal.`,
    });
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="HealthifySnap"
          description="Snap a photo of your meal and let our AI do the rest. Effortless calorie and nutrient tracking is here."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card>
            <form onSubmit={handleFormSubmit}>
              <CardHeader>
                <CardTitle>Upload Your Meal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meal-photo">Meal Photo</Label>
                  <Input
                    id="meal-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="file:text-primary file:font-semibold"
                  />
                </div>
                {preview && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                      src={preview}
                      alt="Meal preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={!preview || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Analyzing...' : 'Analyze Meal'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Here's what our AI found in your meal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="font-semibold">Analyzing your meal...</p>
                  <p className="text-sm text-muted-foreground">
                    This might take a moment. Our AI is hard at work!
                  </p>
                </div>
              )}
              {error && !isLoading && (
                <div className="text-destructive text-center p-8">
                  <p className="font-bold">Oops! Something went wrong.</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              {!result && !isLoading && !error && (
                <div className="text-center p-8 text-muted-foreground">
                  <p>Upload a photo to see the nutritional analysis.</p>
                </div>
              )}
              {result && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2 text-center">
                    <Flame className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-4xl font-bold">
                        {Math.round(result.calories)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Estimated Calories
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Drumstick className="mx-auto h-6 w-6 text-accent" />
                      <p className="font-bold text-lg">
                        {Math.round(result.nutrients.protein)}g
                      </p>
                      <p className="text-xs text-muted-foreground">Protein</p>
                    </div>
                    <div>
                      <Wheat className="mx-auto h-6 w-6 text-accent" />
                      <p className="font-bold text-lg">
                        {Math.round(result.nutrients.carbohydrates)}g
                      </p>
                      <p className="text-xs text-muted-foreground">Carbs</p>
                    </div>
                    <div>
                      <Salad className="mx-auto h-6 w-6 text-accent" />
                      <p className="font-bold text-lg">
                        {Math.round(result.nutrients.fat)}g
                      </p>
                      <p className="text-xs text-muted-foreground">Fat</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Beef /> Identified Items
                    </h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {result.foodItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
            {result && (
              <CardFooter>
                <Button
                  onClick={handleLogMeal}
                  className="w-full"
                  variant="secondary"
                >
                  Log This Meal
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
