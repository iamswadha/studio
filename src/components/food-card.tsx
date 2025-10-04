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
      {/* Background Card */}
      <div className="relative h-full w-full rounded-[40px] bg-card shadow-2xl p-6 flex flex-col justify-end items-center text-center" style={{backgroundColor: '#e6f0ff'}}>
        
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-48 h-48">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain drop-shadow-2xl"
            data-ai-hint={imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="absolute top-6 right-6">
            <Button size="icon" className="rounded-full bg-primary/20 h-10 w-10">
                <Heart className="w-5 h-5 text-primary" />
            </Button>
        </div>

        <div className="space-y-2 mt-20">
             <h3 className="font-serif text-2xl font-bold text-foreground">
                <span className="text-primary">•</span> {name}
            </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
