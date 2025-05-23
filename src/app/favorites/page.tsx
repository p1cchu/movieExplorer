
"use client";

import { FavoritesList } from "@/components/FavoritesList";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function FavoritesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-grow h-full">
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold flex items-center text-primary">
                <Star className="mr-3 h-8 w-8 text-accent" />
                My Favorite Movies
            </h2>
        </div>
        <Separator />
      </div>
      <div className="flex-grow overflow-hidden">
        <FavoritesList />
      </div>
    </div>
  );
}
