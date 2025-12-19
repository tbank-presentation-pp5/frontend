"use client";

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface SlideMenuProps {
  slideIndex: number;
  totalSlides: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export const SlideMenu: React.FC<SlideMenuProps> = ({
  slideIndex,
  totalSlides,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="close">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={onMoveUp}
          disabled={slideIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowUp className="h-4 w-4" />
          Переместить вверх
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onMoveDown}
          disabled={slideIndex === totalSlides - 1}
          className="flex items-center gap-2"
        >
          <ArrowDown className="h-4 w-4" />
          Переместить вниз
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="flex items-center gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Удалить слайд
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};