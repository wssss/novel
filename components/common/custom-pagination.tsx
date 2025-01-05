import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  pageSize: number;
  current: number;
  onChange: (page: number) => void;
}

export function CustomPagination({
  total,
  pageSize,
  current,
  onChange,
}: PaginationProps): React.ReactElement {
  const totalPages = Math.ceil(total / pageSize);
  
  const renderPageNumbers = () => {
    const pages: React.ReactElement[] = [];
    const showPages = 5; // 显示几个页码按钮
    
    let start = Math.max(1, current - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          variant={current === i ? "default" : "outline"}
          onClick={() => onChange(i)}
          className="w-8 h-8 p-0"
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  if (total <= 0) return <></>;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="w-8 h-8 p-0"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {renderPageNumbers()}
      
      <Button
        variant="outline"
        className="w-8 h-8 p-0"
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}