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
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Separator } from '@/components/ui/separator';

type FoodItem = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

export default function HealthifySnapPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addingValue, setAddingValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let nextId = useRef(0);

  const totalNutrition = useMemo(() => {
    return foodItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbohydrates: acc.carbohydrates + item.carbohydrates,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    );
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
            const id = nextId.current++;
            if (nutrition.success && nutrition.data) {
              return { id, name: itemName, ...nutrition.data };
            }
            return {
              id,
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

  const handleRemoveItem = (id: number) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  const handleEditItem = (id: number, value: string) => {
    setIsEditing(id);
    setEditingValue(value);
  };

  const handleUpdateItem = useCallback(async (id: number) => {
    if (editingValue.trim() === '') return;

    // Optimistically update the UI
    const originalItems = foodItems;
    const newItems = foodItems.map((item) =>
      item.id === id ? { ...item, name: editingValue } : item
    );
    setFoodItems(newItems);
    setIsEditing(null);
    setEditingValue('');

    // Fetch new nutrition data
    const nutrition = await getSingleItemNutrition({
      foodItemName: editingValue,
    });

    if (nutrition.success && nutrition.data) {
      setFoodItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id
            ? { ...item, name: editingValue, ...nutrition.data }
            : item
        )
      );
    } else {
      // Revert if API call fails
      setFoodItems(originalItems);
      toast({
        variant: 'destructive',
        title: 'Could not fetch nutrition data',
      });
    }
  }, [editingValue, foodItems]);


  const handleAddItem = async () => {
    if (addingValue.trim() === '') return;
    
    const newItemName = addingValue;
    setIsAdding(false);
    setAddingValue('');

    const nutrition = await getSingleItemNutrition({
      foodItemName: newItemName,
    });
    if (nutrition.success && nutrition.data) {
      const newId = nextId.current++;
      setFoodItems([...foodItems, { id: newId, name: newItemName, ...nutrition.data }]);
    } else {
      toast({
        variant: 'destructive',
        title: 'Could not fetch nutrition data',
      });
    }
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
            {foodItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                {isEditing === item.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateItem(item.id)}
                      className="h-8"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleUpdateItem(item.id)}
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
                      onClick={() => handleEditItem(item.id, item.name)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
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
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  placeholder="New item name"
                  className="h-8"
                  autoFocus
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
           {!isAdding && (
            <Button
              variant="ghost"
              className="w-full mt-2"
              onClick={() => setIsAdding(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add item
            </Button>
          )}
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
                  {isLoading && foodItems.some(item => item.calories === 0) ? (
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
