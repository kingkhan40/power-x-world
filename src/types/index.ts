import { IconType } from "react-icons";

// Base Product Interface - Add this at the top
export interface BaseProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  colors: string[];
  chip: string;
  series: string;
}

// Core Product Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  currency: string;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  discount?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

// Navigation & Menu Types
export interface MenuLink {
  text: string;
  href: string;
  external?: boolean;
  category?: string;
}

export interface MenuSection {
  title: string;
  links: MenuLink[];
}

export interface MenuItem {
  id: string;
  title: string;
  href: string;
  sections?: MenuSection[];
}

export interface LinkItem {
  name: string;
  href: string;
}

export interface DropdownLinkItem extends LinkItem {
  subLinks?: LinkItem[];
}

export interface BreadcrumbItem {
  href: string;
  label: string;
  isActive?: boolean;
}

// Component Props Types
export interface DropdownLinkProps {
  link: DropdownLinkItem;
}

export interface SimpleLinkProps {
  link: LinkItem;
}

export interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Page Specific Product Types
export interface ProductSpecs {
  display: string;
  chip: string;
  battery: string;
  storage?: string;
  camera?: string;
  ports?: string;
  weight?: string;
}

// For navigation products (with icon and href)
export interface NavigationProduct {
  name: string;
  href: string;
  icon: string;
}

// For detailed product display (with colors, specs, etc.)
export interface DetailedProduct {
  name: string;
  chip: string;
  price: string;
  image: string;
  colors: string[];
  specs: ProductSpecs;
}

// Mac specific product extends DetailedProduct
export interface MacProduct extends DetailedProduct {}

// iPad specific product extends DetailedProduct
export interface iPadProduct extends DetailedProduct {}

export interface Feature {
  title: string;
  description: string;
  image: string;
  theme: "light" | "dark";
}

export interface WhyAppleCard {
  icon: string;
  title: string;
  description: string;
}

export interface AccordionItem {
  title: string;
  content: string;
  image: string;
}

// Component Props Types for Pages
export interface ProductCardProps {
  product: DetailedProduct;
  productType: string;
}

export interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export interface WhyAppleCardProps {
  card: WhyAppleCard;
  index: number;
}

export interface AccordionProps {
  item: AccordionItem;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

// State Types
export type ActiveTab =
  | "laptops"
  | "desktops"
  | "all"
  | "ipad pro"
  | "ipad air"
  | "ipad mini";

export interface PaginationState {
  currentPage: number;
  productsPerPage: number;
  totalPages: number;
  filteredProducts: Product[];
  currentProducts: Product[];
}

// App Context Types
export interface AppContextType {
  // Cart functionality
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;

  // Search functionality
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string) => void;

  // UI states
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeDropdown: string | null;
  setActiveDropdown: (dropdown: string | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Filters
  currentCategory: string | null;
  currentSearch: string | null;
  currentSeries: string | null;
  currentType: string | null;
  updateFiltersFromParams: (params: {
    category?: string | null;
    search?: string | null;
    series?: string | null;
    type?: string | null;
  }) => void;

  // Pagination
  paginationState: PaginationState;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  getPageNumbers: () => number[];

  // Data
  productsData: Product[];
  menuItems: MenuItem[];
}

// Footer & Contact Types
export interface ContactItem {
  icon: IconType;
  text: string;
  href?: string;
  color: string;
}

export interface RecognizedByItem {
  name: string;
  href: string;
  logoText: string;
}

export interface SocialLinkItem {
  icon: IconType;
  href: string;
  bgColor: string;
  label: string;
}

// Section Types
export interface ProductSection {
  title: string;
  description: string[];
  imageUrl: string;
  category: string;
  bgColor: "white" | "gray";
  imagePosition: "left" | "right";
}

export interface CtaSection {
  title: string;
  description: string;
  buttons: {
    text: string;
    href: string;
    variant: "primary" | "secondary";
  }[];
}

// Checkout & Order Types
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: "card" | "paypal" | "apple-pay";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  nameOnCard?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
}

// Add these iPhone specific types to your existing types/index.ts file

// iPhone Specific Types
export interface iPhoneSpecs extends ProductSpecs {
  storage: string;
  camera: string;
  cellular: string;
  faceId: string;
  waterResistance: string;
}

export interface iPhoneModel extends DetailedProduct {
  specs: iPhoneSpecs;
  series: string;
  isPro: boolean;
  isLatest: boolean;
  isNew?: boolean;
  tag?: string;
}

export interface iPhoneFeature {
  title: string;
  description: string;
  image: string;
  theme: "light" | "dark";
  icon?: string;
  gradient?: string;
}

export interface CameraFeature {
  title: string;
  description: string;
  megapixels: string;
  type: string;
  image: string;
  features: string[];
  badge?: string;
}

export interface iPhoneSeries {
  name: string;
  tag: string;
  description: string;
  models: iPhoneModel[];
  year: number;
  gradient: string;
}

export interface ColorOption {
  name: string;
  value: string;
  color: string;
}

// Update ActiveTab to include iPhone series
export type ActiveTabIPhone =
  | "laptops"
  | "desktops"
  | "all"
  | "ipad pro"
  | "ipad air"
  | "ipad mini"
  | "iphone-all"
  | "iphone-17"
  | "iphone-16"
  | "iphone-15"
  | "iphone-14"
  | "iphone-13"
  | "pro-max"
  | "pro"
  | "standard"
  | "latest";

// iPhone specific props
export interface iPhoneProductCardProps {
  product: iPhoneModel;
  series: string;
}

export interface CameraShowcaseProps {
  features: CameraFeature[];
}

export interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

// AirPods Specific Types
export interface AirPodsFeature {
  title: string;
  description: string;
  image: string;
  theme: "light" | "dark";
  icon?: string;
}

export interface AirPodsSpecs {
  battery: string;
  connectivity: string;
  chip: string;
  features: string[];
  weight: string;
  charging: string;
  waterResistance: string;
  display?: string;
  storage?: string;
  camera?: string;
  cellular?: string;
  faceId?: string;
  ports?: string;
}

export interface AirPodsModel extends BaseProduct {
  specs: AirPodsSpecs;
  type: 'max' | 'pro' | 'standard' | 'special';
  isLatest: boolean;
  isNew?: boolean;
  noiseCancellation?: boolean;
  spatialAudio?: boolean;
}

export interface AirPodsSeries {
  name: string;
  tag: string;
  description: string;
  models: AirPodsModel[];
  year: number;
  gradient: string;
}

export type ActiveTabAirPods =
  | "airpods-all"
  | "airpods-max"
  | "airpods-pro"
  | "airpods-standard"
  | "airpods-special";

// Apple Watch Specific Types
export interface AppleWatchSpecs {
  display: string;
  chip: string;
  battery: string;
  storage: string;
  cellular: string;
  gps: string;
  waterResistance: string;
  heartRate: string;
  ecg: string;
  bloodOxygen: string;
  temperature: string;
  features: string[];
  weight: string;
  connectivity: string;
  charging: string;
}

export interface AppleWatchModel extends BaseProduct {
  specs: AppleWatchSpecs;
  type: 'ultra' | 'series' | 'se' | 'special';
  isLatest: boolean;
  isNew?: boolean;
  alwaysOnDisplay?: boolean;
  cellular?: boolean;
}

export interface AppleWatchFeature {
  title: string;
  description: string;
  image: string;
  theme: "light" | "dark";
  icon?: string;
}

export interface AppleWatchSeries {
  name: string;
  tag: string;
  description: string;
  models: AppleWatchModel[];
  year: number;
  gradient: string;
}

export type ActiveTabAppleWatch =
  | "applewatch-all"
  | "applewatch-ultra"
  | "applewatch-series"
  | "applewatch-se"
  | "applewatch-special";

