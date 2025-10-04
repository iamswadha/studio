'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface FoodCardProps {
  name: string;
  description: string;
  image: string;
  imageHint: string;
}

export function FoodCard({
  name,
  description,
  image,
  imageHint,
}: FoodCardProps) {
  return (
    <div className="relative aspect-[3/4] w-full max-w-sm mx-auto pt-12">
      <Button
        size="icon"
        className="absolute top-0 left-8 z-20 rounded-full h-12 w-12 bg-primary shadow-lg"
      >
        <Heart className="w-6 h-6 text-primary-foreground" />
      </Button>

      <div className="relative h-full w-full rounded-[40px] bg-card p-6 flex flex-col justify-end items-start text-left">
        <div className="absolute -top-4 right-0 w-48 h-48 drop-shadow-2xl">
          <Image
            src={image}
            alt={name}
            width={200}
            height={200}
            className="object-contain"
            data-ai-hint={imageHint}
          />
        </div>

        <div className="space-y-2 mt-20 z-10">
          <h3 className="font-serif text-2xl">
            <span className="text-primary">•</span> Blue{' '}
            <span className="font-bold">Salad</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
