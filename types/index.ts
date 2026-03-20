export enum BusinessType {
  SmallBusiness = 'Small Business',
  Airbnb = 'Airbnb / Rental',
  Restaurant = 'Restaurant',
}

export enum WebsiteStyle {
  Clean = 'Clean',
  Modern = 'Modern',
  Luxury = 'Luxury',
  Casual = 'Casual',
}

export enum RestaurantTone {
  FamilyFriendly = 'Family-friendly',
  Upscale = 'Upscale',
  Casual = 'Casual',
  Trendy = 'Trendy',
  Traditional = 'Traditional',
}

export type PriceRange = '$' | '$$' | '$$$';
export type HeroFocus = 'Food' | 'Interior' | 'Chef' | 'Story' | 'Events';
export type PrimaryCta = 'reservations' | 'online-orders' | 'calls' | 'visits';
export type DomainPreference = 'undecided' | 'synthr-subdomain' | 'custom-domain';
export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'spicy';
export type OrderingProvider = 'none' | 'doordash' | 'ubereats' | 'toast' | 'square' | 'phone' | 'custom';
export type ReservationProvider = 'none' | 'opentable' | 'resy' | 'yelp' | 'phone' | 'custom';
export type ImageType = 'interior' | 'food' | 'logo';

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
  dietary?: DietaryTag[];
}

export interface SocialLinks {
  googleReviews?: string;
  yelp?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
}

export interface BrandProfile {
  summary: string;
  story?: string;
  heroPhrase?: string;
  atmosphere?: string;
  audience?: string;
  keywords: string[];
  heroFocus: HeroFocus;
}

export interface ServiceOptions {
  dineIn: boolean;
  takeout: boolean;
  delivery: boolean;
  catering: boolean;
  privateDining: boolean;
}

export interface OrderingSetup {
  enabled: boolean;
  provider: OrderingProvider;
  url?: string;
}

export interface ReservationSetup {
  enabled: boolean;
  provider: ReservationProvider;
  url?: string;
}

export interface LocationDetails {
  city: string;
  address: string;
  phone: string;
  email: string;
  googleMapsLink?: string;
  hours: Record<string, string>;
}

export interface UploadedImage {
  type: ImageType;
  data: string;
}

export interface AdvancedDetails {
  founderName?: string;
  yearFounded?: number;
  neighborhood?: string;
  parking?: string;
  weeklySpecials?: string;
  awards?: string[];
  dietaryAccommodations?: string[];
  cateringEmail?: string;
  privateEventCapacity?: number;
}

export interface BusinessDetails {
  type: BusinessType;
  name: string;
  cuisineType: string;
  priceRange: PriceRange;
  style: WebsiteStyle;
  tone: RestaurantTone;
  brand: BrandProfile;
  services: ServiceOptions;
  primaryCta: PrimaryCta;
  menu: MenuItem[];
  signatureDishes: string[];
  ordering: OrderingSetup;
  reservations: ReservationSetup;
  location: LocationDetails;
  socialLinks: SocialLinks;
  images: UploadedImage[];
  useStockImages: boolean;
  domainPreference: DomainPreference;
  advanced?: AdvancedDetails;
}

export interface GeneratedWebsite {
  html: string;
  lastUpdated: number;
}
