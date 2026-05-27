interface SearchProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  loadingStatus: boolean;
  isHero: boolean;
}

/**
 * Search component - provides search input.
 * Search is triggered automatically when the search term changes.
 */
function Search({ searchTerm, onSearchTermChange, isHero }: SearchProps) {
  return (
    <div
      className={`${isHero ? 'pb-2 md:pb-4 max-w-4xl mx-auto text-center' : 'mb-8 max-w-4xl mx-auto'}`}
    >
      {isHero && (
        <div className="mb-8">
          <h1 className="text-4xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Explore the Falklands' Scientific Publications
          </h1>
          <p className="text-lg text-gray-600">
            Search our comprehensive database of documents, reports, and
            historic records.
          </p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1">
          <input
            id="searchInput"
            type="text"
            className="w-full px-6 py-4 border border-gray-300 rounded-xl shadow-sm text-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder="Enter a keyword, title, author, or year..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Search;
