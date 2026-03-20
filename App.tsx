import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { Pricing } from './pages/Pricing';
import { Builder } from './pages/Builder';
import { Preview } from './pages/Preview';
import { BusinessDetails } from './types';

const defaultHours = () => ({
  Monday: '',
  Tuesday: '',
  Wednesday: '',
  Thursday: '',
  Friday: '',
  Saturday: '',
  Sunday: '',
});

const migrateStoredDetails = (raw: any): BusinessDetails | null => {
  if (!raw || typeof raw !== 'object') return null;

  if (raw.brand && raw.location && raw.services) {
    return raw as BusinessDetails;
  }

  const legacyHours = raw.hours && typeof raw.hours === 'object' ? raw.hours : {};

  return {
    type: raw.type || 'Restaurant',
    name: raw.name || '',
    cuisineType: raw.cuisineType || '',
    priceRange: raw.priceRange || '$$',
    style: raw.style || 'Modern',
    tone: raw.tone || 'Family-friendly',
    brand: {
      summary: raw.shortDescription || raw.description || '',
      story: raw.fullStory || '',
      heroPhrase: raw.tagline || '',
      atmosphere: '',
      audience: '',
      keywords: [],
      heroFocus: 'Food',
    },
    services: {
      dineIn: Boolean(raw.dineIn),
      takeout: Boolean(raw.takeout),
      delivery: Boolean(raw.delivery),
      catering: Boolean(raw.cateringAvailable),
      privateDining: Boolean(raw.privateEventCapacity),
    },
    primaryCta: raw.reservations?.acceptReservations
      ? 'reservations'
      : raw.onlineOrdering?.acceptOrders
        ? 'online-orders'
        : 'calls',
    menu: Array.isArray(raw.menu)
      ? raw.menu.map((item: any) => ({
          name: item?.name || '',
          description: item?.description || '',
          price: String(item?.price ?? ''),
          category: item?.category || 'Featured',
          dietary: Array.isArray(item?.dietary) ? item.dietary : [],
        }))
      : [],
    signatureDishes: Array.isArray(raw.menu) ? raw.menu.slice(0, 3).map((item: any) => item?.name).filter(Boolean) : [],
    ordering: {
      enabled: Boolean(raw.onlineOrdering?.acceptOrders),
      provider: raw.onlineOrdering?.platforms?.[0] || 'none',
      url: raw.onlineOrdering?.customURL || '',
    },
    reservations: {
      enabled: Boolean(raw.reservations?.acceptReservations),
      provider: raw.reservations?.platforms?.[0] || 'none',
      url: raw.reservations?.url || '',
    },
    location: {
      city: raw.city || '',
      address: raw.address || '',
      phone: raw.phone || '',
      email: raw.email || '',
      googleMapsLink: raw.googleMapsLink || '',
      hours: { ...defaultHours(), ...legacyHours },
    },
    socialLinks: raw.socialLinks || {},
    images: Array.isArray(raw.images) ? raw.images : [],
    useStockImages: raw.useStockImages !== false,
    domainPreference: 'undecided',
    advanced: {
      founderName: raw.founderName || '',
      yearFounded: raw.yearFounded,
      neighborhood: raw.neighborhood || '',
      parking: raw.parking || '',
      weeklySpecials: raw.weeklySpecials || '',
      awards: Array.isArray(raw.awards) ? raw.awards : [],
      dietaryAccommodations: [],
      cateringEmail: raw.cateringEmail || '',
      privateEventCapacity: raw.privateEventCapacity,
    },
  };
};

function App() {
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(() => {
    try {
      const stored = localStorage.getItem('synthr:businessDetails');
      return stored ? migrateStoredDetails(JSON.parse(stored)) : null;
    } catch (_err) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (businessDetails) {
        localStorage.setItem('synthr:businessDetails', JSON.stringify(businessDetails));
      }
    } catch (_err) {
      // Ignore storage errors (private mode, etc.)
    }
  }, [businessDetails]);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/create" element={<Builder setDetails={setBusinessDetails} />} />
          <Route path="/preview" element={<Preview details={businessDetails} />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
