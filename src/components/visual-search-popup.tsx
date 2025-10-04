'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { getMealAnalysis } from '@/lib/actions';
import { Camera, Loader2, Search } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, ReactNode } from 'react';

interface VisualSearchPopupProps {
  children: ReactNode;
  onSearch: (searchTerm: string) => void;
}

export function VisualSearchPopup({ children, onSearch }: VisualSearchPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedMeal, setRecognizedMeal] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setRecognizedMeal(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        handleImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImageUpload = async (imageString: string) => {
    setIsLoading(true);
    try {
      const response = await getMealAnalysis({ photoDataUri: imageString });
      if (response.success && response.data?.foodItems.length) {
        setRecognizedMeal(response.data.foodItems[0]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Could not recognize meal',
          description: response.error || 'Please try another image.',
        });
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = () => {
    if (recognizedMeal) {
      onSearch(recognizedMeal);
      setIsOpen(false);
      resetState();
    }
  };
  
  const resetState = () => {
    setPreview(null);
    setRecognizedMeal(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }
  
  const handleOpenChange = (open: boolean) => {
    if(!open) {
        resetState();
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search by Image</DialogTitle>
          <DialogDescription>
            Upload a photo of a meal to find similar recipes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            id="meal-photo"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Camera className="mr-2 h-4 w-4" />
            {preview ? 'Change Image' : 'Upload Image'}
          </Button>

          {preview && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image src={preview} alt="Meal preview" fill className="object-cover" />
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Recognizing meal...</span>
            </div>
          )}
          
          {recognizedMeal && (
            <div className="text-center p-4 bg-secondary rounded-md">
                <p className="text-sm text-muted-foreground">Recognized Meal</p>
                <p className="font-bold text-lg">{recognizedMeal}</p>
            </div>
          )}

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSearch} disabled={!recognizedMeal || isLoading}>
            <Search className="mr-2 h-4 w-4" />
            Search Recipes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
