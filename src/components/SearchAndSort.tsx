import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search, X } from "lucide-react";
import { Input } from "./ui/Input";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";

interface SearchAndSortProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: 'asc' | 'desc';
  toggleSortOrder: () => void;
}

export default function SearchAndSort({ searchQuery, setSearchQuery, sortOrder, toggleSortOrder }: SearchAndSortProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex gap-3 items-center mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          id="search-input"
          type="text"
          placeholder={t("searchSummaries")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full pl-10 pr-10 py-2 border border-input bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sort Button */}
      <Button
        title={sortOrder === 'desc' ? t("sortNewestFirst") : t("sortOldestFirst")}
        variant="ghost" 
        size="sm" 
        onClick={toggleSortOrder}
        className="hover:bg-transparent hover:text-black"
      >
        {sortOrder === 'asc' ? <ArrowUpWideNarrow className="w-5 h-5" /> : <ArrowDownWideNarrow className="w-5 h-5" />}
      </Button>
    </div>
  )
}