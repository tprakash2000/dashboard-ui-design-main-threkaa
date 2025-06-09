const STORAGE_KEY = 'saved_filters';

// Get all saved filters
export const getSavedFilters = () => {
    const storedFilters = localStorage.getItem(STORAGE_KEY);
    return storedFilters ? JSON.parse(storedFilters) : [];
};

// Save a new filter
export const saveFilter = (filter) => {
    const filters = getSavedFilters();
    filters.push(filter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    return filter;
};

// Delete a filter
export const deleteFilter = (filterId) => {
    const filters = getSavedFilters();
    const updatedFilters = filters.filter(filter => filter.id !== filterId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFilters));
}; 