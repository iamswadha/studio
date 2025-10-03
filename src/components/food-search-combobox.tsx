'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getFoodSuggestions } from '@/lib/actions';
import { useDebounce } from '@/hooks/use-debounce';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Suggestion = {
  name: string;
  imageUrl: string;
};

interface FoodSearchComboboxProps {
  onSelect: (suggestion: Suggestion) => void;
  defaultValue?: string;
}

export function FoodSearchCombobox({
  onSelect,
  defaultValue,
}: FoodSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || '');
  const [search, setSearch] = React.useState(defaultValue || '');
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const fallbackImage = PlaceHolderImages.find(
    (img) => img.id === 'food-suggestion-fallback'
  )?.imageUrl || 'https://picsum.photos/seed/food-fallback/100/100';


  React.useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 2) {
      setIsLoading(true);
      getFoodSuggestions({ query: debouncedSearch }).then((response) => {
        if (response.success && response.data) {
          setSuggestions(response.data.suggestions);
        } else {
          setSuggestions([]);
        }
        setIsLoading(false);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);

  const handleSelect = (suggestion: Suggestion) => {
    setValue(suggestion.name);
    setSearch(suggestion.name); // Also update search input to reflect selection
    onSelect(suggestion);
    setOpen(false);
  };
  
  const handleAddNewItem = (itemName: string) => {
    const newItem: Suggestion = {
      name: itemName,
      imageUrl: fallbackImage,
    };
    setValue(newItem.name);
    setSearch(newItem.name);
    onSelect(newItem);
    setOpen(false);
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{value ? value : 'Select food...'}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search for Indian food..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {!isLoading && debouncedSearch.length > 2 && (
              <CommandEmpty>
                <div className="py-4 text-center text-sm">
                  <p>No food found.</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => handleAddNewItem(debouncedSearch)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add "{debouncedSearch}" as new item
                  </Button>
                </div>
              </CommandEmpty>
            )}
            <CommandGroup>
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.name}
                  value={suggestion.name}
                  onSelect={() => handleSelect(suggestion)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === suggestion.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <Image
                      src={suggestion.imageUrl || fallbackImage}
                      alt={suggestion.name}
                      width={24}
                      height={24}
                      className="rounded-sm object-cover"
                    />
                    <span>{suggestion.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
