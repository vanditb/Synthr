"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWebsiteHtml = void 0;
/**
 * Calls the backend API to generate HTML for a website.
 */
const generateWebsiteHtml = async (details, customInstruction) => {
    try {
        console.log('🚀 Starting website generation...');
        const response = await fetch('/api/generate', {
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
                useStockImages: details.useStockImages,
                customInstruction: customInstruction
            })
        });
        console.log('📩 API Response status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ API Error:', errorData);
            throw new Error(`API error: ${errorData.error || 'Unknown error'} - ${errorData.details || ''}`);
        }
        const data = await response.json();
        console.log('✅ HTML received, length:', data.html?.length || 0);
        if (!data.html) {
            console.error('❌ No HTML in response:', data);
            throw new Error('No HTML returned from API');
        }
        return data.html;
    }
    catch (error) {
        console.error("❌ Generation error:", error);
        throw error;
    }
};
exports.generateWebsiteHtml = generateWebsiteHtml;
