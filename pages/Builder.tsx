import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, Sparkles, Trash2, Upload } from 'lucide-react';
import {
  BusinessDetails,
  BusinessType,
  DietaryTag,
  DomainPreference,
  HeroFocus,
  ImageType,
  MenuItem,
  OrderingProvider,
  PrimaryCta,
  ReservationProvider,
  RestaurantTone,
  WebsiteStyle,
} from '../types';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const styleOptions: WebsiteStyle[] = [WebsiteStyle.Modern, WebsiteStyle.Luxury, WebsiteStyle.Clean, WebsiteStyle.Casual];
const toneOptions: RestaurantTone[] = [
  RestaurantTone.FamilyFriendly,
  RestaurantTone.Casual,
  RestaurantTone.Trendy,
  RestaurantTone.Upscale,
  RestaurantTone.Traditional,
];
const heroFocusOptions: HeroFocus[] = ['Food', 'Interior', 'Chef', 'Story', 'Events'];
const dietaryOptions: DietaryTag[] = ['vegetarian', 'vegan', 'gluten-free', 'halal', 'spicy'];

const orderingProviders: { value: OrderingProvider; label: string }[] = [
  { value: 'none', label: 'No platform yet' },
  { value: 'doordash', label: 'DoorDash' },
  { value: 'ubereats', label: 'Uber Eats' },
  { value: 'toast', label: 'Toast' },
  { value: 'square', label: 'Square' },
  { value: 'phone', label: 'Phone only' },
  { value: 'custom', label: 'Custom link' },
];

const reservationProviders: { value: ReservationProvider; label: string }[] = [
  { value: 'none', label: 'No platform yet' },
  { value: 'opentable', label: 'OpenTable' },
  { value: 'resy', label: 'Resy' },
  { value: 'yelp', label: 'Yelp' },
  { value: 'phone', label: 'Phone only' },
  { value: 'custom', label: 'Custom link' },
];

const stepConfig = [
  { id: 'about', title: 'Tell us about your restaurant', helper: 'Start with the basics.', optional: false },
  { id: 'services', title: 'What services do you offer?', helper: 'Pick what customers can actually do.', optional: true },
  { id: 'style', title: 'Choose the look and tone', helper: 'Keep this quick and intuitive.', optional: true },
  { id: 'menu', title: 'Add a few menu highlights', helper: 'Only include items you want on the site.', optional: false },
  { id: 'operations', title: 'How should customers book or order?', helper: 'Set the actions that matter most.', optional: true },
  { id: 'location', title: 'How should customers contact you?', helper: 'Add the details people need before they visit.', optional: false },
  { id: 'assets', title: 'Add photos and assets', helper: 'Upload visuals or use stock images.', optional: true },
  { id: 'review', title: 'Review and generate', helper: 'One last check before we build the site.', optional: false },
] as const;

const createEmptyHours = () =>
  daysOfWeek.reduce<Record<string, string>>((acc, day) => {
    acc[day] = '';
    return acc;
  }, {});

const createEmptyMenuItem = (): MenuItem => ({
  name: '',
  description: '',
  price: '',
  category: '',
  dietary: [],
});

const createInitialDetails = (): BusinessDetails => ({
  type: BusinessType.Restaurant,
  name: '',
  cuisineType: '',
  priceRange: '$$',
  style: WebsiteStyle.Modern,
  tone: RestaurantTone.FamilyFriendly,
  brand: {
    summary: '',
    story: '',
    heroPhrase: '',
    atmosphere: '',
    audience: '',
    keywords: [],
    heroFocus: 'Food',
  },
  services: {
    dineIn: true,
    takeout: false,
    delivery: false,
    catering: false,
    privateDining: false,
  },
  primaryCta: 'reservations',
  menu: [createEmptyMenuItem(), createEmptyMenuItem(), createEmptyMenuItem()],
  menuSourceText: '',
  menuSourceImages: [],
  signatureDishes: [],
  ordering: {
    enabled: false,
    provider: 'none',
    url: '',
  },
  reservations: {
    enabled: true,
    provider: 'opentable',
    url: '',
  },
  location: {
    city: '',
    address: '',
    phone: '',
    email: '',
    googleMapsLink: '',
    hours: createEmptyHours(),
  },
  socialLinks: {
    instagram: '',
    tiktok: '',
    googleReviews: '',
    yelp: '',
    facebook: '',
  },
  images: [],
  useStockImages: true,
  domainPreference: 'undecided',
  advanced: {
    founderName: '',
    yearFounded: undefined,
    neighborhood: '',
    parking: '',
    weeklySpecials: '',
    awards: [],
    dietaryAccommodations: [],
    cateringEmail: '',
    privateEventCapacity: undefined,
  },
});

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const normalizeHandle = (value: string, platform: 'instagram' | 'tiktok') => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const withoutUrl = trimmed
    .replace(new RegExp(`^https?:\\/\\/(www\\.)?${platform}\\.com\\/?`, 'i'), '')
    .replace(/^@/, '')
    .replace(/\/$/, '');
  return withoutUrl.split('/')[0];
};

const parseCommaList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const imageLabelByType: Record<ImageType, string> = {
  food: 'Food photos',
  interior: 'Interior photos',
  logo: 'Logo',
};

const buildExampleRestaurant = (variant: 'italian' | 'cafe' | 'indian'): BusinessDetails => {
  const base = createInitialDetails();

  if (variant === 'italian') {
    return {
      ...base,
      name: 'Luna Rosa',
      cuisineType: 'Italian',
      priceRange: '$$',
      style: WebsiteStyle.Modern,
      tone: RestaurantTone.Upscale,
      brand: {
        ...base.brand,
        summary: 'Warm neighborhood Italian spot serving handmade pasta, wood-fired pizza, and easy weeknight dinners.',
        heroPhrase: 'Italian dinner, done right',
        atmosphere: 'Warm, lively, and date-night friendly',
        audience: 'Couples, local families, and weeknight regulars',
        keywords: ['handmade pasta', 'wood-fired', 'local favorite'],
        heroFocus: 'Food',
      },
      services: {
        dineIn: true,
        takeout: true,
        delivery: false,
        catering: true,
        privateDining: false,
      },
      primaryCta: 'reservations',
      menu: [
        { name: 'Rigatoni Vodka', description: 'Tomato cream sauce with basil and parmesan', price: '$21', category: 'Pasta', dietary: ['vegetarian'] },
        { name: 'Margherita Pizza', description: 'Fresh mozzarella, basil, olive oil', price: '$18', category: 'Pizza', dietary: ['vegetarian'] },
        { name: 'Chicken Milanese', description: 'Crispy cutlet with arugula and lemon', price: '$24', category: 'Entrees', dietary: [] },
      ],
      signatureDishes: ['Rigatoni Vodka', 'Margherita Pizza'],
      reservations: { enabled: true, provider: 'opentable', url: 'https://opentable.com' },
      ordering: { enabled: true, provider: 'toast', url: 'https://order.toasttab.com' },
      location: {
        city: 'Chicago',
        address: '214 West Fulton Street',
        phone: '(312) 555-1842',
        email: 'hello@lunarosa.com',
        googleMapsLink: 'https://maps.google.com',
        hours: {
          Monday: '4:00 PM - 9:00 PM',
          Tuesday: '4:00 PM - 9:00 PM',
          Wednesday: '4:00 PM - 9:30 PM',
          Thursday: '4:00 PM - 9:30 PM',
          Friday: '4:00 PM - 10:30 PM',
          Saturday: '12:00 PM - 10:30 PM',
          Sunday: '12:00 PM - 8:30 PM',
        },
      },
      socialLinks: {
        instagram: 'lunarosachi',
        googleReviews: 'https://maps.google.com',
      },
    };
  }

  if (variant === 'cafe') {
    return {
      ...base,
      name: 'Northline Cafe',
      cuisineType: 'Cafe',
      priceRange: '$',
      style: WebsiteStyle.Clean,
      tone: RestaurantTone.Casual,
      brand: {
        ...base.brand,
        summary: 'All-day cafe with specialty coffee, breakfast plates, and a bright space for regulars and remote workers.',
        heroPhrase: 'Coffee, breakfast, and slow mornings',
        atmosphere: 'Bright, calm, and easygoing',
        audience: 'Morning regulars, students, and remote workers',
        keywords: ['specialty coffee', 'breakfast', 'all-day cafe'],
        heroFocus: 'Interior',
      },
      services: {
        dineIn: true,
        takeout: true,
        delivery: false,
        catering: false,
        privateDining: false,
      },
      primaryCta: 'visits',
      menu: [
        { name: 'Honey Oat Latte', description: 'Espresso, oat milk, and wildflower honey', price: '$6', category: 'Coffee', dietary: ['vegetarian'] },
        { name: 'Avocado Toast', description: 'Sourdough, chili flakes, lemon, herbs', price: '$12', category: 'Breakfast', dietary: ['vegetarian'] },
        { name: 'Breakfast Burrito', description: 'Eggs, potatoes, cheddar, salsa verde', price: '$13', category: 'Breakfast', dietary: [] },
      ],
      signatureDishes: ['Honey Oat Latte', 'Avocado Toast'],
      reservations: { enabled: false, provider: 'none', url: '' },
      ordering: { enabled: true, provider: 'square', url: 'https://squareup.com' },
      location: {
        city: 'Austin',
        address: '88 South Lamar Blvd',
        phone: '(512) 555-9081',
        email: 'hi@northlinecafe.com',
        googleMapsLink: 'https://maps.google.com',
        hours: {
          Monday: '7:00 AM - 4:00 PM',
          Tuesday: '7:00 AM - 4:00 PM',
          Wednesday: '7:00 AM - 4:00 PM',
          Thursday: '7:00 AM - 4:00 PM',
          Friday: '7:00 AM - 5:00 PM',
          Saturday: '8:00 AM - 5:00 PM',
          Sunday: '8:00 AM - 3:00 PM',
        },
      },
      socialLinks: {
        instagram: 'northlinecafe',
      },
    };
  }

  return {
    ...base,
    name: 'Saffron Table',
    cuisineType: 'Indian',
    priceRange: '$$',
    style: WebsiteStyle.Luxury,
    tone: RestaurantTone.Traditional,
    brand: {
      ...base.brand,
      summary: 'Modern Indian restaurant serving regional curries, tandoor dishes, and weekend family dinners.',
      heroPhrase: 'Indian cooking with depth and warmth',
      atmosphere: 'Warm, polished, and celebratory',
      audience: 'Families, date nights, and special dinners',
      keywords: ['tandoor', 'regional dishes', 'family dinners'],
      heroFocus: 'Food',
    },
    services: {
      dineIn: true,
      takeout: true,
      delivery: true,
      catering: true,
      privateDining: true,
    },
    primaryCta: 'online-orders',
    menu: [
      { name: 'Butter Chicken', description: 'Tandoor chicken in a rich tomato butter sauce', price: '$20', category: 'Mains', dietary: [] },
      { name: 'Paneer Tikka', description: 'Charred paneer with peppers and chutney', price: '$15', category: 'Starters', dietary: ['vegetarian'] },
      { name: 'Garlic Naan', description: 'Tandoor bread with garlic and cilantro', price: '$5', category: 'Bread', dietary: ['vegetarian'] },
    ],
    signatureDishes: ['Butter Chicken', 'Paneer Tikka'],
    reservations: { enabled: true, provider: 'resy', url: 'https://resy.com' },
    ordering: { enabled: true, provider: 'ubereats', url: 'https://ubereats.com' },
    location: {
      city: 'New York',
      address: '41 East 12th Street',
      phone: '(646) 555-7610',
      email: 'hello@saffrontable.com',
      googleMapsLink: 'https://maps.google.com',
      hours: {
        Monday: '12:00 PM - 9:30 PM',
        Tuesday: '12:00 PM - 9:30 PM',
        Wednesday: '12:00 PM - 9:30 PM',
        Thursday: '12:00 PM - 10:00 PM',
        Friday: '12:00 PM - 10:30 PM',
        Saturday: '12:00 PM - 10:30 PM',
        Sunday: '12:00 PM - 9:00 PM',
      },
    },
    socialLinks: {
      instagram: 'saffrontable',
      googleReviews: 'https://maps.google.com',
    },
    advanced: {
      ...base.advanced,
      privateEventCapacity: 48,
      cateringEmail: 'events@saffrontable.com',
    },
  };
};

export const Builder: React.FC<{ setDetails: (d: BusinessDetails) => void }> = ({ setDetails }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessDetails>(createInitialDetails);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState('');
  const [menuBulkPaste, setMenuBulkPaste] = useState('');
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showMoreContact, setShowMoreContact] = useState(false);
  const [skippedSteps, setSkippedSteps] = useState<number[]>([]);

  const current = stepConfig[currentStep];

  const validMenuItems = useMemo(
    () =>
      formData.menu.filter(
        (item) => item.name.trim() && item.description.trim() && item.price.trim() && item.category.trim()
      ),
    [formData.menu]
  );

  const reviewWarnings = useMemo(() => {
    const warnings: string[] = [];

    if (!formData.brand.summary.trim()) warnings.push('Add a short brand summary.');
    if (validMenuItems.length < 3) warnings.push('Add at least 3 menu items for a stronger first draft.');
    if (!formData.location.phone.trim()) warnings.push('Add a phone number.');
    if (!formData.location.address.trim() || !formData.location.city.trim()) warnings.push('Add your address and city.');
    if (formData.primaryCta === 'reservations' && !formData.reservations.enabled) {
      warnings.push('Reservations is your main CTA, but reservations are not enabled.');
    }
    if (formData.primaryCta === 'online-orders' && !formData.ordering.enabled) {
      warnings.push('Online orders is your main CTA, but ordering is not enabled.');
    }

    return warnings;
  }, [formData, validMenuItems.length]);

  const updateBrand = <K extends keyof BusinessDetails['brand']>(key: K, value: BusinessDetails['brand'][K]) => {
    setFormData((prev) => ({ ...prev, brand: { ...prev.brand, [key]: value } }));
  };

  const updateLocation = <K extends keyof BusinessDetails['location']>(
    key: K,
    value: BusinessDetails['location'][K]
  ) => {
    setFormData((prev) => ({ ...prev, location: { ...prev.location, [key]: value } }));
  };

  const updateService = (key: keyof BusinessDetails['services'], value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: value,
      },
    }));
  };

  const updateAdvanced = (key: keyof NonNullable<BusinessDetails['advanced']>, value: any) => {
    setFormData((prev) => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [key]: value,
      },
    }));
  };

  const handleMenuItemChange = (index: number, field: keyof MenuItem, value: string | DietaryTag[]) => {
    setFormData((prev) => ({
      ...prev,
      menu: prev.menu.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleAddMenuItem = () => {
    setFormData((prev) => ({ ...prev, menu: [...prev.menu, createEmptyMenuItem()] }));
  };

  const handleRemoveMenuItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      menu: prev.menu.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleHoursChange = (day: string, value: string) => {
    updateLocation('hours', {
      ...formData.location.hours,
      [day]: value,
    });
  };

  const compressImage = (file: File, imageType: ImageType): Promise<string> => {
    const maxDimension = imageType === 'logo' ? 800 : 1600;
    const quality = imageType === 'logo' ? 0.9 : 0.78;
    const outputType = imageType === 'logo' && file.type === 'image/png' ? 'image/png' : 'image/jpeg';

    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Canvas not supported'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(outputType, quality);
        URL.revokeObjectURL(objectUrl);
        resolve(dataUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Image load failed'));
      };

      img.src = objectUrl;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageType: ImageType) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const uploaded = await Promise.all(
      files.map(async (file) => {
        try {
          const data = await compressImage(file, imageType);
          return { type: imageType, data };
        } catch (_err) {
          return await new Promise<{ type: ImageType; data: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                resolve({ type: imageType, data: reader.result });
              } else {
                reject(new Error('File read failed'));
              }
            };
            reader.onerror = () => reject(new Error('File read failed'));
            reader.readAsDataURL(file);
          });
        }
      })
    );

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
    }));

    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const handleMenuImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const uploaded = await Promise.all(
      files.map(async (file) => {
        try {
          return await compressImage(file, 'food');
        } catch (_err) {
          return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                resolve(reader.result);
              } else {
                reject(new Error('File read failed'));
              }
            };
            reader.onerror = () => reject(new Error('File read failed'));
            reader.readAsDataURL(file);
          });
        }
      })
    );

    setFormData((prev) => ({
      ...prev,
      menuSourceImages: [...(prev.menuSourceImages || []), ...uploaded],
    }));

    event.target.value = '';
  };

  const handleRemoveMenuImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      menuSourceImages: (prev.menuSourceImages || []).filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const parseMenuSourceText = () => {
    const source = (formData.menuSourceText || '').trim();
    if (!source) return;

    const lines = source
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const parsed: MenuItem[] = [];
    let currentCategory = 'Featured';

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const nextLine = lines[index + 1] || '';

      if (!/\d/.test(line) && (/[:]{1}$/.test(line) || line === line.toUpperCase() || line.length < 24)) {
        currentCategory = line.replace(/:$/, '');
        continue;
      }

      const priceMatch = line.match(/(\$?\d+(?:\.\d{1,2})?)/);
      if (!priceMatch) continue;

      const price = priceMatch[1].startsWith('$') ? priceMatch[1] : `$${priceMatch[1]}`;
      const name = line.replace(priceMatch[0], '').replace(/[-–—|]+/g, ' ').trim();
      const description =
        nextLine && !/(\$?\d+(?:\.\d{1,2})?)/.test(nextLine) && nextLine.length > 4 ? nextLine : '';

      if (name) {
        parsed.push({
          name,
          description,
          price,
          category: currentCategory,
          dietary: [],
        });
      }
    }

    if (!parsed.length) return;

    setFormData((prev) => ({
      ...prev,
      menu: [...prev.menu.filter((item) => item.name.trim()), ...parsed],
    }));
  };

  const importMenuFromBulkPaste = () => {
    const parsed = menuBulkPaste
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, description, price, category] = line.split('|').map((item) => item.trim());
        return {
          name: name || '',
          description: description || '',
          price: price || '',
          category: category || 'Featured',
          dietary: [],
        } as MenuItem;
      })
      .filter((item) => item.name && item.description);

    if (!parsed.length) return;

    setFormData((prev) => ({
      ...prev,
      menu: [...prev.menu.filter((item) => item.name.trim()), ...parsed],
    }));
    setMenuBulkPaste('');
    setShowBulkPaste(false);
  };

  const normalizeDetailsForSave = (details: BusinessDetails): BusinessDetails => ({
    ...details,
    name: details.name.trim(),
    cuisineType: details.cuisineType.trim(),
    brand: {
      ...details.brand,
      summary: details.brand.summary.trim(),
      story: details.brand.story?.trim() || '',
      heroPhrase: details.brand.heroPhrase?.trim() || '',
      atmosphere: details.brand.atmosphere?.trim() || '',
      audience: details.brand.audience?.trim() || '',
      keywords: details.brand.keywords,
    },
    menu: details.menu
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        description: item.description.trim(),
        price: item.price.trim(),
        category: item.category.trim(),
      }))
      .filter((item) => item.name && item.description && item.price && item.category),
    menuSourceText: details.menuSourceText?.trim() || '',
    menuSourceImages: details.menuSourceImages || [],
    signatureDishes: details.signatureDishes,
    location: {
      ...details.location,
      city: details.location.city.trim(),
      address: details.location.address.trim(),
      phone: details.location.phone.trim(),
      email: details.location.email.trim(),
      googleMapsLink: normalizeUrl(details.location.googleMapsLink || ''),
      hours: details.location.hours,
    },
    socialLinks: {
      ...details.socialLinks,
      instagram: normalizeHandle(details.socialLinks.instagram || '', 'instagram'),
      tiktok: normalizeHandle(details.socialLinks.tiktok || '', 'tiktok'),
      googleReviews: normalizeUrl(details.socialLinks.googleReviews || ''),
      yelp: normalizeUrl(details.socialLinks.yelp || ''),
      facebook: normalizeUrl(details.socialLinks.facebook || ''),
    },
    ordering: {
      ...details.ordering,
      url: normalizeUrl(details.ordering.url || ''),
    },
    reservations: {
      ...details.reservations,
      url: normalizeUrl(details.reservations.url || ''),
    },
    advanced: {
      ...details.advanced,
      founderName: details.advanced?.founderName?.trim() || '',
      neighborhood: details.advanced?.neighborhood?.trim() || '',
      parking: details.advanced?.parking?.trim() || '',
      weeklySpecials: details.advanced?.weeklySpecials?.trim() || '',
      cateringEmail: details.advanced?.cateringEmail?.trim() || '',
      awards: details.advanced?.awards || [],
      dietaryAccommodations: details.advanced?.dietaryAccommodations || [],
    },
  });

  const validateStep = (stepId: (typeof stepConfig)[number]['id']) => {
    if (stepId === 'about') {
      if (!formData.name.trim() || !formData.cuisineType.trim() || !formData.brand.summary.trim()) {
        return 'Add your name, cuisine, and short summary.';
      }
    }

    if (stepId === 'menu') {
      if (validMenuItems.length < 1) {
        return 'Add at least one complete menu item.';
      }
    }

    if (stepId === 'location') {
      if (!formData.location.address.trim() || !formData.location.city.trim() || !formData.location.phone.trim()) {
        return 'Add your address, city, and phone number.';
      }
    }

    return '';
  };

  const handleNext = () => {
    const message = validateStep(current.id);
    if (message) {
      setStepError(message);
      return;
    }

    setStepError('');
    setSkippedSteps((prev) => prev.filter((step) => step !== currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, stepConfig.length - 1));
  };

  const handleSkip = () => {
    setStepError('');
    setSkippedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
    setCurrentStep((prev) => Math.min(prev + 1, stepConfig.length - 1));
  };

  const goToStep = (index: number) => {
    setStepError('');
    setCurrentStep(index);
  };

  const handleBack = () => {
    setStepError('');
    if (currentStep === 0) {
      navigate('/');
      return;
    }
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const blockingStep = stepConfig.find((step) => !step.optional && validateStep(step.id));
    if (blockingStep) {
      setCurrentStep(stepConfig.findIndex((step) => step.id === blockingStep.id));
      setStepError(validateStep(blockingStep.id));
      return;
    }

    setIsSubmitting(true);
    setStepError('');

    const cleanDetails = normalizeDetailsForSave(formData);

    window.setTimeout(() => {
      setDetails(cleanDetails);
      navigate('/preview');
    }, 350);
  };

  const fillRandomExample = () => {
    const variants: Array<'italian' | 'cafe' | 'indian'> = ['italian', 'cafe', 'indian'];
    const variant = variants[Math.floor(Math.random() * variants.length)];
    setFormData(buildExampleRestaurant(variant));
    setCurrentStep(0);
    setSkippedSteps([]);
    setStepError('');
    setShowBulkPaste(false);
    setShowMoreDetails(false);
    setShowMoreContact(false);
  };

  const getStepState = (index: number) => {
    if (index === currentStep) return 'current';
    if (skippedSteps.includes(index)) return 'skipped';
    if (index < currentStep) return 'visited';
    return 'upcoming';
  };

  const inputClassName =
    'w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/22 focus:border-orange-300/60 focus:bg-white/[0.05]';

  const renderStep = () => {
    if (current.id === 'about') {
      return (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              className={inputClassName}
              placeholder="Restaurant name"
            />
            <input
              value={formData.cuisineType}
              onChange={(event) => setFormData((prev) => ({ ...prev, cuisineType: event.target.value }))}
              className={inputClassName}
              placeholder="Cuisine type"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={formData.priceRange}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, priceRange: event.target.value as BusinessDetails['priceRange'] }))
              }
              className={inputClassName}
            >
              <option value="$">$</option>
              <option value="$$">$$</option>
              <option value="$$$">$$$</option>
            </select>
            <input
              value={formData.brand.heroPhrase || ''}
              onChange={(event) => updateBrand('heroPhrase', event.target.value)}
              className={inputClassName}
              placeholder="Optional homepage line"
            />
          </div>
          <textarea
            value={formData.brand.summary}
            onChange={(event) => updateBrand('summary', event.target.value)}
            className={`${inputClassName} min-h-[132px] resize-none`}
            placeholder="Short brand summary"
          />
        </div>
      );
    }

    if (current.id === 'services') {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['dineIn', 'Dine-in'],
            ['takeout', 'Takeout'],
            ['delivery', 'Delivery'],
            ['catering', 'Catering'],
            ['privateDining', 'Private dining'],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <span className="text-sm text-white/78">{label}</span>
              <input
                type="checkbox"
                checked={formData.services[key as keyof BusinessDetails['services']]}
                onChange={(event) => updateService(key as keyof BusinessDetails['services'], event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent text-orange-400"
              />
            </label>
          ))}
        </div>
      );
    }

    if (current.id === 'style') {
      return (
        <div className="space-y-6">
          <div>
            <div className="mb-3 text-sm text-white/58">Website style</div>
            <div className="flex flex-wrap gap-3">
              {styleOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, style: option }))}
                  className={`rounded-full border px-4 py-2.5 text-sm transition ${
                    formData.style === option
                      ? 'border-orange-300/70 bg-orange-400/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-white/65 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm text-white/58">Tone</div>
            <div className="flex flex-wrap gap-3">
              {toneOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, tone: option }))}
                  className={`rounded-full border px-4 py-2.5 text-sm transition ${
                    formData.tone === option
                      ? 'border-orange-300/70 bg-orange-400/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-white/65 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm text-white/58">Homepage focus</div>
            <div className="flex flex-wrap gap-3">
              {heroFocusOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateBrand('heroFocus', option)}
                  className={`rounded-full border px-4 py-2.5 text-sm transition ${
                    formData.brand.heroFocus === option
                      ? 'border-orange-300/70 bg-orange-400/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-white/65 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={formData.brand.atmosphere || ''}
              onChange={(event) => updateBrand('atmosphere', event.target.value)}
              className={inputClassName}
              placeholder="Atmosphere (optional)"
            />
            <input
              value={formData.brand.keywords.join(', ')}
              onChange={(event) => updateBrand('keywords', parseCommaList(event.target.value))}
              className={inputClassName}
              placeholder="Brand keywords (optional)"
            />
          </div>
        </div>
      );
    }

    if (current.id === 'menu') {
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            {formData.menu.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                  <input
                    value={item.category}
                    onChange={(event) => handleMenuItemChange(index, 'category', event.target.value)}
                    className={inputClassName}
                    placeholder="Category"
                  />
                  <input
                    value={item.price}
                    onChange={(event) => handleMenuItemChange(index, 'price', event.target.value)}
                    className={inputClassName}
                    placeholder="Price"
                  />
                </div>
                <input
                  value={item.name}
                  onChange={(event) => handleMenuItemChange(index, 'name', event.target.value)}
                  className={inputClassName}
                  placeholder="Item name"
                />
                <textarea
                  value={item.description}
                  onChange={(event) => handleMenuItemChange(index, 'description', event.target.value)}
                  className={`${inputClassName} min-h-[88px] resize-none`}
                  placeholder="Short description"
                />
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((option) => {
                    const selected = item.dietary?.includes(option) || false;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          handleMenuItemChange(
                            index,
                            'dietary',
                            selected
                              ? (item.dietary || []).filter((tag) => tag !== option)
                              : [...(item.dietary || []), option]
                          )
                        }
                        className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.16em] transition ${
                          selected
                            ? 'border-orange-300/70 bg-orange-400/10 text-white'
                            : 'border-white/10 bg-white/[0.03] text-white/45 hover:text-white/70'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMenuItem(index)}
                    className="inline-flex items-center gap-2 text-sm text-white/46 transition hover:text-white/75"
                  >
                    <Trash2 size={14} />
                    Remove item
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddMenuItem}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Plus size={16} />
              Add item
            </button>
            <button
              type="button"
              onClick={() => setShowBulkPaste((prev) => !prev)}
              className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/[0.05] hover:text-white"
            >
              {showBulkPaste ? 'Hide bulk paste' : 'Bulk paste'}
            </button>
          </div>

          {showBulkPaste ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-3 text-sm text-white/58">Paste menu text and we’ll turn it into item rows.</p>
              <textarea
                value={formData.menuSourceText || menuBulkPaste}
                onChange={(event) => {
                  setMenuBulkPaste(event.target.value);
                  setFormData((prev) => ({ ...prev, menuSourceText: event.target.value }));
                }}
                className={`${inputClassName} min-h-[150px] resize-none`}
                placeholder={'Margherita Pizza | Tomato, mozzarella, basil | $18 | Pizza\nRigatoni Vodka | Tomato cream sauce | $21 | Pasta'}
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={importMenuFromBulkPaste}
                  className="rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2.5 text-sm text-white transition hover:bg-orange-400/16"
                >
                  Import lines
                </button>
                <button
                  type="button"
                  onClick={parseMenuSourceText}
                  className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/78 transition hover:bg-white/[0.05]"
                >
                  Parse pasted menu
                </button>
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 text-sm text-white/58">Upload a menu image</div>
            <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/14 px-4 py-8 text-sm text-white/72 transition hover:border-white/22 hover:bg-white/[0.04]">
              <input type="file" accept="image/*" multiple onChange={handleMenuImageUpload} className="hidden" />
              <span>Upload menu photo</span>
            </label>

            {(formData.menuSourceImages || []).length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(formData.menuSourceImages || []).map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-2xl border border-white/10 bg-black/10">
                    <div className="relative aspect-[4/3]">
                      <img src={image} alt={`Menu upload ${index + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveMenuImage(index)}
                        className="absolute right-3 top-3 rounded-full border border-black/10 bg-black/45 p-2 text-white transition hover:bg-black/60"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    if (current.id === 'operations') {
      return (
        <div className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-white/78">Accept reservations</span>
              <input
                type="checkbox"
                checked={formData.reservations.enabled}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    reservations: { ...prev.reservations, enabled: event.target.checked },
                  }))
                }
                className="h-4 w-4 rounded border-white/20 bg-transparent text-orange-400"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={formData.reservations.provider}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    reservations: { ...prev.reservations, provider: event.target.value as ReservationProvider },
                  }))
                }
                className={inputClassName}
              >
                {reservationProviders.map((provider) => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
              <input
                value={formData.reservations.url || ''}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    reservations: { ...prev.reservations, url: event.target.value },
                  }))
                }
                className={inputClassName}
                placeholder="Reservation URL"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-white/78">Accept online orders</span>
              <input
                type="checkbox"
                checked={formData.ordering.enabled}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    ordering: { ...prev.ordering, enabled: event.target.checked },
                  }))
                }
                className="h-4 w-4 rounded border-white/20 bg-transparent text-orange-400"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={formData.ordering.provider}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    ordering: { ...prev.ordering, provider: event.target.value as OrderingProvider },
                  }))
                }
                className={inputClassName}
              >
                {orderingProviders.map((provider) => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
              <input
                value={formData.ordering.url || ''}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    ordering: { ...prev.ordering, url: event.target.value },
                  }))
                }
                className={inputClassName}
                placeholder="Ordering URL"
              />
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm text-white/58">Primary CTA</div>
            <div className="flex flex-wrap gap-3">
              {[
                ['reservations', 'Reservations'],
                ['online-orders', 'Online orders'],
                ['calls', 'Calls'],
                ['visits', 'Visits'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, primaryCta: value as PrimaryCta }))}
                  className={`rounded-full border px-4 py-2.5 text-sm transition ${
                    formData.primaryCta === value
                      ? 'border-orange-300/70 bg-orange-400/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-white/65 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (current.id === 'location') {
      return (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={formData.location.address}
              onChange={(event) => updateLocation('address', event.target.value)}
              className={inputClassName}
              placeholder="Address"
            />
            <input
              value={formData.location.city}
              onChange={(event) => updateLocation('city', event.target.value)}
              className={inputClassName}
              placeholder="City"
            />
            <input
              value={formData.location.phone}
              onChange={(event) => updateLocation('phone', event.target.value)}
              className={inputClassName}
              placeholder="Phone"
            />
            <input
              value={formData.location.email}
              onChange={(event) => updateLocation('email', event.target.value)}
              className={inputClassName}
              placeholder="Email"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => setShowMoreContact((prev) => !prev)}
              className="text-sm font-medium text-white/72 transition hover:text-white"
            >
              {showMoreContact ? 'Hide extra contact details' : 'Add more contact details'}
            </button>
          </div>
          {showMoreContact ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={formData.location.googleMapsLink || ''}
                onChange={(event) => updateLocation('googleMapsLink', event.target.value)}
                className={inputClassName}
                placeholder="Google Maps link"
              />
              <input
                value={formData.socialLinks.instagram || ''}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, instagram: event.target.value },
                  }))
                }
                className={inputClassName}
                placeholder="Instagram (optional)"
              />
              <input
                value={formData.socialLinks.googleReviews || ''}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, googleReviews: event.target.value },
                  }))
                }
                className={inputClassName}
                placeholder="Google reviews link (optional)"
              />
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            {daysOfWeek.map((day) => (
              <input
                key={day}
                value={formData.location.hours[day]}
                onChange={(event) => handleHoursChange(day, event.target.value)}
                className={inputClassName}
                placeholder={`${day}: 11:00 AM - 9:00 PM`}
              />
            ))}
          </div>
        </div>
      );
    }

    if (current.id === 'assets') {
      return (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {(['food', 'interior', 'logo'] as ImageType[]).map((type) => (
              <label
                key={type}
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/14 bg-white/[0.03] px-4 py-8 text-center transition hover:border-white/22 hover:bg-white/[0.05]"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple={type !== 'logo'}
                  onChange={(event) => handleFileUpload(event, type)}
                  className="hidden"
                />
                <Upload size={18} className="text-white/60" />
                <div className="text-sm text-white/78">{imageLabelByType[type]}</div>
              </label>
            ))}
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="text-sm text-white/78">Use stock image fallback</span>
            <input
              type="checkbox"
              checked={formData.useStockImages}
              onChange={(event) => setFormData((prev) => ({ ...prev, useStockImages: event.target.checked }))}
              className="h-4 w-4 rounded border-white/20 bg-transparent text-orange-400"
            />
          </label>

          {formData.images.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {formData.images.map((image, index) => (
                <div key={`${image.type}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <div className="relative aspect-[4/3]">
                    <img src={image.data} alt={image.type} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-3 top-3 rounded-full border border-black/10 bg-black/45 p-2 text-white transition hover:bg-black/60"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="px-4 py-3 text-sm text-white/65">{imageLabelByType[image.type]}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="space-y-3 text-sm text-white/72">
            <div className="flex justify-between gap-4 border-b border-white/8 pb-3">
              <span className="text-white/45">Restaurant</span>
              <span>{formData.name || 'Not added'}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/8 pb-3">
              <span className="text-white/45">Cuisine</span>
              <span>{formData.cuisineType || 'Not added'}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/8 pb-3">
              <span className="text-white/45">Menu items</span>
              <span>{validMenuItems.length}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/8 pb-3">
              <span className="text-white/45">Main CTA</span>
              <span>{formData.primaryCta}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/45">Images</span>
              <span>{formData.images.length || 0}</span>
            </div>
          </div>
        </div>

        {reviewWarnings.length ? (
          <div className="space-y-3">
            {reviewWarnings.map((warning) => (
              <div key={warning} className="rounded-2xl border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm text-orange-100/88">
                {warning}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100/90">
            Looks good. You have enough detail for a strong first draft.
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <button
            type="button"
            onClick={() => setShowMoreDetails((prev) => !prev)}
            className="text-sm font-medium text-white/78 transition hover:text-white"
          >
            {showMoreDetails ? 'Hide extra details' : 'Add more details'}
          </button>

          {showMoreDetails ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                value={formData.brand.story || ''}
                onChange={(event) => updateBrand('story', event.target.value)}
                className={`${inputClassName} sm:col-span-2`}
                placeholder="Optional story"
              />
              <input
                value={formData.advanced?.founderName || ''}
                onChange={(event) => updateAdvanced('founderName', event.target.value)}
                className={inputClassName}
                placeholder="Founder or chef name"
              />
              <input
                type="number"
                value={formData.advanced?.yearFounded ?? ''}
                onChange={(event) => updateAdvanced('yearFounded', event.target.value ? Number(event.target.value) : undefined)}
                className={inputClassName}
                placeholder="Year founded"
              />
              <input
                value={formData.advanced?.neighborhood || ''}
                onChange={(event) => updateAdvanced('neighborhood', event.target.value)}
                className={inputClassName}
                placeholder="Neighborhood"
              />
              <input
                value={formData.advanced?.parking || ''}
                onChange={(event) => updateAdvanced('parking', event.target.value)}
                className={inputClassName}
                placeholder="Parking"
              />
              <textarea
                value={formData.advanced?.weeklySpecials || ''}
                onChange={(event) => updateAdvanced('weeklySpecials', event.target.value)}
                className={`${inputClassName} min-h-[96px] resize-none sm:col-span-2`}
                placeholder="Weekly specials or events"
              />
              <input
                value={formData.advanced?.cateringEmail || ''}
                onChange={(event) => updateAdvanced('cateringEmail', event.target.value)}
                className={inputClassName}
                placeholder="Catering email"
              />
              <input
                type="number"
                value={formData.advanced?.privateEventCapacity ?? ''}
                onChange={(event) =>
                  updateAdvanced('privateEventCapacity', event.target.value ? Number(event.target.value) : undefined)
                }
                className={inputClassName}
                placeholder="Private event capacity"
              />
              <textarea
                value={(formData.advanced?.awards || []).join(', ')}
                onChange={(event) => updateAdvanced('awards', parseCommaList(event.target.value))}
                className={`${inputClassName} min-h-[96px] resize-none sm:col-span-2`}
                placeholder="Awards or press"
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const progress = ((currentStep + 1) / stepConfig.length) * 100;

  return (
    <div className="min-h-screen bg-[#09090d] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between text-sm text-white/52">
            <span>
              Step {currentStep + 1} of {stepConfig.length}
            </span>
            <span>{current.optional && current.id !== 'review' ? 'Optional' : 'Required'}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {stepConfig.map((step, index) => {
              const state = getStepState(index);
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(index)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    state === 'current'
                      ? 'border-orange-300/70 bg-orange-400/12 text-white'
                      : state === 'skipped'
                        ? 'border-white/12 bg-white/[0.02] text-white/55'
                        : state === 'visited'
                          ? 'border-white/14 bg-white/[0.04] text-white/72'
                          : 'border-white/8 bg-transparent text-white/35 hover:text-white/60'
                  }`}
                >
                  {index + 1}. {step.title.replace('Tell us about your restaurant', 'About').replace('What services do you offer?', 'Services').replace('Choose the look and tone', 'Style').replace('Add a few menu highlights', 'Menu').replace('How should customers book or order?', 'Booking').replace('How should customers contact you?', 'Contact').replace('Add photos and assets', 'Photos').replace('Review and generate', 'Review')}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/10 bg-[#111116] p-6 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.9)] sm:p-8">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white">{current.title}</h1>
            <p className="text-sm text-white/52">{current.helper}</p>
          </div>

          {currentStep === 0 ? (
            <div className="mb-6">
              <button
                type="button"
                onClick={fillRandomExample}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/78 transition hover:bg-white/[0.06] hover:text-white"
              >
                Fill with a random example
              </button>
            </div>
          ) : null}

          {renderStep()}

          {stepError ? (
            <div className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm text-orange-100/88">
              {stepError}
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/72 transition hover:bg-white/[0.05] hover:text-white"
            >
              <ArrowLeft size={16} />
              {currentStep === 0 ? 'Back home' : 'Back'}
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              {current.id !== 'review' ? (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/72 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Skip for now
                </button>
              ) : null}

              {current.id === 'review' ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating website
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Website
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:brightness-105"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
