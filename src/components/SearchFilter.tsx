import { Search } from 'lucide-react';
import type { FilterType } from '@/types/mosque';

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'iftaar', label: 'Free Iftaar' },
  { id: 'biriyani', label: 'Biriyani' },
  { id: 'verified', label: 'Verified' },
  { id: 'nearby', label: 'Nearby' },
];

const SearchFilter = ({ search, onSearchChange, filter, onFilterChange }: SearchFilterProps) => {
  return (
    <div className="px-4 py-3 space-y-2 bg-background border-b">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search mosque or area..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-card border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onFilterChange(id)}
            className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              filter === id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-card'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
