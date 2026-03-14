import { BusinessDetails } from '../types';

/**
 * Calls the backend API to generate HTML for a website.
 */
export const generateWebsiteHtml = async (details: BusinessDetails, customInstruction?: string): Promise<string> => {
  try {
    console.log('🚀 Starting website generation...');
    let response: Response;
    try {
      response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Basic Info
          name: details.name,
          type: details.type,
          style: details.style,
          tone: details.tone,
          cuisineType: details.cuisineType,
          priceRange: details.priceRange,
          city: details.city,
          address: details.address,
          phone: details.phone,
          email: details.email,
          tagline: details.tagline,
          hours: details.hours,
          pages: details.pages,
          description: details.description,
          
          // Services
          dineIn: details.dineIn,
          takeout: details.takeout,
          delivery: details.delivery,
          
          // About
          shortDescription: details.shortDescription,
          fullStory: details.fullStory,
          yearFounded: details.yearFounded,
          founderName: details.founderName,
          
          // Menu
          menu: details.menu,
          
          // Ordering & Reservations
          onlineOrdering: details.onlineOrdering,
          reservations: details.reservations,
          
          // Location
          googleMapsLink: details.googleMapsLink,
          parking: details.parking,
          neighborhood: details.neighborhood,
          
          // Social
          socialLinks: details.socialLinks,
          
          // Events & Catering
          hostEvents: details.hostEvents,
          eventTypes: details.eventTypes,
          weeklySpecials: details.weeklySpecials,
          cateringAvailable: details.cateringAvailable,
          cateringEmail: details.cateringEmail,
          privateEventCapacity: details.privateEventCapacity,
          
          // Images & Settings
          images: details.images,
          useStockImages: details.useStockImages,
          customInstruction: customInstruction
        })
      });
    } catch (err) {
      const message =
        'Network error calling /api/generate. This usually means the backend is not running, ' +
        'or the app was started without the Vite proxy (use `npm run dev`, not `npm run client` or `npm run preview`).';
      console.error('❌ Network error during fetch:', err);
      throw new Error(message);
    }

    console.log('📩 API Response status:', response.status);
    
    const rawText = await response.text();
    let data: any = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (_err) {
      const hint = rawText?.slice(0, 120) || '';
      throw new Error(`API returned non-JSON (status ${response.status}). This usually means the backend isn't running or the dev server proxy wasn't used. First bytes: ${hint}`);
    }

    if (!response.ok) {
      console.error('❌ API Error:', data || rawText);
      const statusInfo = `${response.status} ${response.statusText || ''}`.trim();
      const details = data?.details || (rawText ? rawText.slice(0, 200) : '');
      throw new Error(`API error (${statusInfo}): ${data?.error || 'Unknown error'}${details ? ` - ${details}` : ''}`);
    }

    console.log('✅ HTML received, length:', data.html?.length || 0);
    
    if (!data.html) {
      console.error('❌ No HTML in response:', data);
      throw new Error('No HTML returned from API');
    }
    
    return data.html;
  } catch (error) {
    console.error("❌ Generation error:", error);
    throw error;
  }
};
