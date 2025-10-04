'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface JuiceCardProps {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  color: string;
}

export function JuiceCard({
  name,
  description,
  price,
  imageUrl,
  color,
}: JuiceCardProps) {
  return (
    <div
      className="flex items-center p-4 rounded-3xl gap-4"
      style={{ backgroundColor: color }}
    >
      <div className="relative w-20 h-24 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          width={80}
          height={96}
          className="object-contain drop-shadow-lg"
          data-ai-hint="juice can"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold text-lg">{price}</p>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full bg-white">
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold">1</span>
            <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full bg-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
