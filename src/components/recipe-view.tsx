'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Recipe } from '@/ai/flows/get-indian-food-suggestions';
import Image from 'next/image';
import { useState } from 'react';
import { Loader2, Plus, Zap } from 'lucide-react';

interface RecipeViewProps {
  recipe: Recipe;
  onPlan: (recipe: Recipe) => Promise<void>;
}

export function RecipeView({ recipe, onPlan }: RecipeViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);

  const handlePlanClick = async () => {
    setIsPlanning(true);
    await onPlan(recipe);
    setIsPlanning(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">View Recipe</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-2xl p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="relative -mx-6 -mt-6 mb-6">
              <Image
                src={recipe.imageUrl}
                alt={recipe.name}
                width={600}
                height={400}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end rounded-b-lg">
                <DialogTitle className="text-white text-3xl font-headline">
                  {recipe.name}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  {recipe.description}
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                 <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Zap className="text-primary h-5 w-5" />
                        Nutrition
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Calories</span>
                            <span className="font-medium">{recipe.nutrition.calories} kcal</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Protein</span>
                            <span className="font-medium">{recipe.nutrition.protein} g</span>
                        </div>
                         <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Fat</span>
                            <span className="font-medium">{recipe.nutrition.fat} g</span>
                        </div>
                         <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Carbs</span>
                            <span className="font-medium">{recipe.nutrition.carbs} g</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold text-lg mb-4">Recipe</h3>
              <div className="space-y-4">
                {recipe.recipe.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <p className="flex-1 text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 bg-secondary/50 border-t">
          <Button
            className="w-full"
            onClick={handlePlanClick}
            disabled={isPlanning}
          >
            {isPlanning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add to Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
