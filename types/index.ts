export enum BusinessType {
  SmallBusiness = 'Small Business',
  Airbnb = 'Airbnb / Rental',
  Restaurant = 'Restaurant'
}

export enum WebsiteStyle {
  Clean = 'Clean',
  Modern = 'Modern',
  Luxury = 'Luxury',
  Casual = 'Casual'
}

export enum RestaurantTone {
  FamilyFriendly = 'Family-friendly',
  Upscale = 'Upscale',
  Casual = 'Casual',
  Trendy = 'Trendy',
  Traditional = 'Traditional'
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  dietary?: ('vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'spicy')[];
}

export interface OnlineOrdering {
  acceptOrders: boolean;
  platforms: ('doordash' | 'ubereats' | 'toast' | 'square' | 'custom')[];
  customURL?: string;
}

export interface ReservationSystem {
  acceptReservations: boolean;
  platforms: ('opentable' | 'resy' | 'yelp' | 'phone')[];
  url?: string;
}

export interface SocialLinks {
  googleReviews?: string;
  yelp?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
}

export interface RestaurantDetails {
  name: string;
  cuisineType: string;
  priceRange: '$' | '$$' | '$$$';
  city: string;
  address: string;
  phone: string;
  email: string;
  hours: Record<string, string>;
  dineIn: boolean;
  takeout: boolean;
  delivery: boolean;
  tagline?: string;
  
  // About/Story
  shortDescription?: string;
  fullStory?: string;
  yearFounded?: number;
  founderName?: string;
  
  // Menu
  menu: MenuItem[];
  menuPDFURL?: string;
  menuImageURLs?: string[];
  
  // Ordering & Reservations
  onlineOrdering: OnlineOrdering;
  reservations: ReservationSystem;
  
  // Location
  googleMapsLink?: string;
  parking?: string;
  neighborhood?: string;
  
  // Social & Trust
  socialLinks: SocialLinks;
  awards?: string[];
  
  // Events (optional)
  hostEvents: boolean;
  eventTypes?: ('liveMusic' | 'happyHour' | 'brunch' | 'catering')[];
  weeklySpecials?: string;
  
  // Catering
  cateringAvailable: boolean;
  cateringEmail?: string;
  privateEventCapacity?: number;
  
  // Style
  style: WebsiteStyle;
  tone: RestaurantTone;
  images: { type: 'interior' | 'food' | 'logo'; data: string }[];
  useStockImages: boolean;
}

export interface BusinessDetails extends RestaurantDetails {
  type: BusinessType;
  pages: string[];
  description: string;
}

export interface GeneratedWebsite {
  html: string;
  lastUpdated: number;
}