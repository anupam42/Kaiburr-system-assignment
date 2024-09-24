import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Search Products"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="search-field"
    />
  );
};

export default SearchBar;
