"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, AppContextType, PaginationState } from '@/types';
import { productsData } from '@/provider/data';
import { menuItems } from '@/provider/headerData';
import { useRouter } from 'next/navigation';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // UI states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter states
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState<string | null>(null);
  const [currentSeries, setCurrentSeries] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<string | null>(null);

  // Pagination state
  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: 1,
    productsPerPage: 16,
    totalPages: 1,
    filteredProducts: [],
    currentProducts: []
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('apple-pakistan-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('apple-pakistan-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Filter products based on current filters
  const filterProducts = useCallback(() => {
    let filtered = productsData;

    // Category filter
    if (currentCategory) {
      filtered = filtered.filter(product => product.category === currentCategory);
    }

    // Search query filter
    if (currentSearch) {
      const query = currentSearch.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Series filter
    if (currentSeries) {
      filtered = filtered.filter(product =>
        product.tags && (
          product.tags.includes(currentSeries) ||
          product.tags.includes(`series-${currentSeries}`)
        )
      );
    }

    // Type filter
    if (currentType) {
      filtered = filtered.filter(product => 
        product.tags && product.tags.includes(currentType)
      );
    }

    return filtered;
  }, [currentCategory, currentSearch, currentSeries, currentType]);

  // Update filters from URL
  const updateFiltersFromParams = useCallback((params: {
    category?: string | null;
    search?: string | null;
    series?: string | null;
    type?: string | null;
  }) => {
    setCurrentCategory(params.category || null);
    setCurrentSearch(params.search || null);
    setCurrentSeries(params.series || null);
    setCurrentType(params.type || null);
  }, []);

  // Update pagination when filters change
  useEffect(() => {
    const filteredProducts = filterProducts();
    const totalPages = Math.ceil(filteredProducts.length / paginationState.productsPerPage);
    
    const currentPage = 1; // Reset to page 1 when filters change
    
    const startIndex = (currentPage - 1) * paginationState.productsPerPage;
    const endIndex = startIndex + paginationState.productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    setPaginationState(prev => ({
      ...prev,
      currentPage,
      totalPages,
      filteredProducts,
      currentProducts
    }));
  }, [filterProducts, paginationState.productsPerPage]);

  // Pagination functions
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > paginationState.totalPages) return;

    const startIndex = (page - 1) * paginationState.productsPerPage;
    const endIndex = startIndex + paginationState.productsPerPage;
    const currentProducts = paginationState.filteredProducts.slice(startIndex, endIndex);

    setPaginationState(prev => ({
      ...prev,
      currentPage: page,
      currentProducts
    }));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [paginationState]);

  const nextPage = useCallback(() => {
    if (paginationState.currentPage < paginationState.totalPages) {
      goToPage(paginationState.currentPage + 1);
    }
  }, [paginationState, goToPage]);

  const prevPage = useCallback(() => {
    if (paginationState.currentPage > 1) {
      goToPage(paginationState.currentPage - 1);
    }
  }, [paginationState, goToPage]);

  const getPageNumbers = useCallback(() => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, paginationState.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(paginationState.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  }, [paginationState]);

  // Cart functions
  const addToCart = useCallback((product: Product) => {
    if (!product.inStock) return;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { 
          productId: product.id, 
          quantity: 1, 
          price: product.price, 
          name: product.name, 
          image: product.image 
        }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Search function
  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  }, [router]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsSearchOpen(false);
  }, []);

  const value: AppContextType = {
    // Cart
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    
    // Search
    searchQuery,
    setSearchQuery,
    handleSearch,
    
    // UI states
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeDropdown,
    setActiveDropdown,
    isSearchOpen,
    setIsSearchOpen,
    
    // Pagination
    paginationState,
    goToPage,
    nextPage,
    prevPage,
    getPageNumbers,
    
    // Filters
    currentCategory,
    currentSearch,
    currentSeries,
    currentType,
    updateFiltersFromParams,
    
    // Data
    productsData,
    menuItems,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}