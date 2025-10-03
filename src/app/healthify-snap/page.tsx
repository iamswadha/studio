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
import { getMealAnalysis, getSingleItemNutrition } from '@/lib/actions';
import {
  Camera,
  Flame,
  Loader2,
  Salad,
  Beef,
  Wheat,
  Drumstick,
  Trash2,
  PlusCircle,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';

type FoodItem = {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

export default function HealthifySnapPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [totalNutrition, setTotalNutrition] = useState({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addingValue, setAddingValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const totals = foodItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbohydrates: acc.carbohydrates + item.carbohydrates,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    );
    setTotalNutrition(totals);
  }, [foodItems]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFoodItems([]);
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
    setFoodItems([]);

    try {
      const response = await getMealAnalysis({ photoDataUri: preview });

      if (response.success && response.data) {
        const itemsWithNutrition = await Promise.all(
          response.data.foodItems.map(async (itemName) => {
            const nutrition = await getSingleItemNutrition({
              foodItemName: itemName,
            });
            if (nutrition.success && nutrition.data) {
              return { name: itemName, ...nutrition.data };
            }
            // Return a default object if nutrition fetch fails for one item
            return {
              name: itemName,
              calories: 0,
              protein: 0,
              carbohydrates: 0,
              fat: 0,
            };
          })
        );
        setFoodItems(itemsWithNutrition);
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
    if (foodItems.length === 0) return;
    toast({
      title: 'Meal Logged!',
      description: `Successfully logged ${Math.round(
        totalNutrition.calories
      )} kcal.`,
    });
    setPreview(null);
    setFoodItems([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const handleEditItem = (index: number, value: string) => {
    setIsEditing(index);
    setEditingValue(value);
  };

  const handleUpdateItem = async (index: number) => {
    if (editingValue.trim() === '') return;
    setIsLoading(true);
    const nutrition = await getSingleItemNutrition({
      foodItemName: editingValue,
    });
    if (nutrition.success && nutrition.data) {
      const newItems = [...foodItems];
      newItems[index] = { name: editingValue, ...nutrition.data };
      setFoodItems(newItems);
    } else {
      toast({
        variant: 'destructive',
        title: 'Could not fetch nutrition data',
      });
    }
    setIsEditing(null);
    setEditingValue('');
    setIsLoading(false);
  };

  const handleAddItem = async () => {
    if (addingValue.trim() === '') return;
    setIsLoading(true);
    const nutrition = await getSingleItemNutrition({
      foodItemName: addingValue,
    });
    if (nutrition.success && nutrition.data) {
      setFoodItems([...foodItems, { name: addingValue, ...nutrition.data }]);
    } else {
      toast({
        variant: 'destructive',
        title: 'Could not fetch nutrition data',
      });
    }
    setIsAdding(false);
    setAddingValue('');
    setIsLoading(false);
  };

  const AnalysisResults = () => (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2 text-center">
          <Flame className="h-8 w-8 text-primary" />
          <div>
            <p className="text-4xl font-bold">
              {Math.round(totalNutrition.calories)}
            </p>
            <p className="text-sm text-muted-foreground">Estimated Calories</p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Drumstick className="mx-auto h-6 w-6 text-accent" />
            <p className="font-bold text-lg">
              {Math.round(totalNutrition.protein)}g
            </p>
            <p className="text-xs text-muted-foreground">Protein</p>
          </div>
          <div>
            <Wheat className="mx-auto h-6 w-6 text-accent" />
            <p className="font-bold text-lg">
              {Math.round(totalNutrition.carbohydrates)}g
            </p>
            <p className="text-xs text-muted-foreground">Carbs</p>
          </div>
          <div>
            <Salad className="mx-auto h-6 w-6 text-accent" />
            <p className="font-bold text-lg">
              {Math.round(totalNutrition.fat)}g
            </p>
            <p className="text-xs text-muted-foreground">Fat</p>
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Beef /> Identified Items
          </h3>
          <ul className="space-y-2">
            {foodItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm"
              >
                {isEditing === index ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleUpdateItem(index)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setIsEditing(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1">{item.name}</span>
                    <span className="text-xs text-muted-foreground mr-2">
                      {Math.round(item.calories)} kcal
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleEditItem(index, item.name)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-destructive"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </li>
            ))}
            {isAdding && (
              <li className="flex gap-2">
                <Input
                  value={addingValue}
                  onChange={(e) => setAddingValue(e.target.value)}
                  placeholder="New item name"
                  className="h-8"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleAddItem}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setIsAdding(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            )}
          </ul>
          <Button
            variant="ghost"
            className="w-full mt-2"
            onClick={() => setIsAdding(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add item
          </Button>
        </div>
      </div>
    </>
  );

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
                  {isLoading && foodItems.length === 0 ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="mr-2 h-4 w-4" />
                  )}
                  {isLoading && foodItems.length === 0
                    ? 'Analyzing...'
                    : 'Analyze Meal'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Here's what our AI found in your meal. You can edit items before
                logging.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && foodItems.length === 0 && (
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
              {!isLoading &&
                foodItems.length === 0 &&
                !error && (
                  <div className="text-center p-8 text-muted-foreground">
                    <p>Upload a photo to see the nutritional analysis.</p>
                  </div>
                )}
              {foodItems.length > 0 && <AnalysisResults />}
            </CardContent>
            {foodItems.length > 0 && (
              <CardFooter>
                <Button
                  onClick={handleLogMeal}
                  className="w-full"
                  variant="secondary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Log This Meal'
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
