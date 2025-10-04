'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Star } from 'lucide-react';

interface FoodCardProps {
  name: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  imageHint: string;
}

export function FoodCard({
  name,
  description,
  price,
  rating,
  image,
  imageHint,
}: FoodCardProps) {
  return (
    <Card className="relative rounded-3xl pt-24 text-center border-none shadow-xl">
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain drop-shadow-2xl"
          data-ai-hint={imageHint}
        />
      </div>
      <CardContent className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground/80">${price}</p>
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-bold text-foreground">{rating}</span>
        </div>
        <Button size="icon" className="rounded-full mt-4 bg-primary/20 hover:bg-primary/30 text-primary">
          <Plus className="w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
