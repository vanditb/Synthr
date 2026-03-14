"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const groq_sdk_1 = __importDefault(require("groq-sdk"));
dotenv_1.default.config();
console.log("⚡ Starting server");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize Groq AI
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
if (!process.env.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY is missing. Check your .env file.");
}
app.get("/", (_req, res) => {
    console.log("GET / called"); // logs when endpoint is hit
    res.send("✅ Server is alive");
});
// API endpoint for generating HTML
app.post("/api/generate", async (req, res) => {
    try {
        console.log('📨 Received /api/generate request');
        const { 
        // Basic Info
        name, type, style, tone, cuisineType, priceRange, city, address, phone, email, tagline, hours, pages, description, 
        // Services
        dineIn, takeout, delivery, 
        // About
        shortDescription, fullStory, yearFounded, founderName, 
        // Menu
        menu, 
        // Ordering & Reservations
        onlineOrdering, reservations, 
        // Location
        googleMapsLink, parking, neighborhood, 
        // Social
        socialLinks, 
        // Events & Catering
        hostEvents, eventTypes, weeklySpecials, cateringAvailable, cateringEmail, privateEventCapacity, 
        // Settings
        useStockImages, customInstruction } = req.body;
        // Build menu section HTML
        const menuByCategory = {};
        menu?.forEach((item) => {
            if (!menuByCategory[item.category]) {
                menuByCategory[item.category] = [];
            }
            menuByCategory[item.category].push(item);
        });
        const menuHTML = Object.entries(menuByCategory)
            .map(([category, items]) => `
      <div class="mb-12">
        <h3 class="text-2xl font-serif font-bold text-slate-900 mb-6">${category}</h3>
        <div class="space-y-4">
          ${items
            .map((item) => `
            <div class="flex justify-between items-start pb-4 border-b border-slate-200">
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-slate-900">${item.name}</h4>
                <p class="text-slate-600 text-sm mt-1">${item.description}</p>
              </div>
              <span class="text-lg font-semibold text-slate-900 ml-4">$${item.price.toFixed(2)}</span>
            </div>
          `)
            .join("")}
        </div>
      </div>
    `)
            .join("");
        // Build hours section
        const hoursHTML = Object.entries(hours || {})
            .map(([day, time]) => `
      <div class="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0">
        <span class="font-medium text-slate-700">${day}</span>
        <span class="text-slate-600">${time}</span>
      </div>
    `)
            .join("");
        // Build online ordering buttons
        let orderingSection = '';
        if (onlineOrdering?.acceptOrders) {
            const platformNames = onlineOrdering.platforms.map((p) => {
                if (p === 'doordash')
                    return 'DoorDash';
                if (p === 'ubereats')
                    return 'Uber Eats';
                return p.charAt(0).toUpperCase() + p.slice(1);
            }).join(', ');
            orderingSection = `
      <div class="py-8 border-t border-orange-100">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Order Online</h3>
        <p class="text-slate-600 mb-6">Available on: ${platformNames}</p>
        <a href="${onlineOrdering.customURL || '#'}" class="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700">Order Now</a>
      </div>
      `;
        }
        // Build reservations section
        let reservationsSection = '';
        if (reservations?.acceptReservations) {
            const platformNames = reservations.platforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
            reservationsSection = `
      <div class="py-8 border-t border-orange-100">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Make a Reservation</h3>
        <p class="text-slate-600 mb-6">Book your table on: ${platformNames}</p>
        <a href="${reservations.url || 'tel:' + phone}" class="inline-block px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700">Reserve Now</a>
      </div>
      `;
        }
        // Build about section
        const aboutSection = fullStory ? `
      <section class="py-16 bg-orange-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <p class="text-slate-700 text-lg leading-relaxed mb-4">${fullStory}</p>
          ${founderName ? `<p class="text-slate-600">Founded by ${founderName}${yearFounded ? ` in ${yearFounded}` : ''}</p>` : ''}
        </div>
      </section>
    ` : '';
        // Build catering section
        const cateringSection = cateringAvailable ? `
      <section class="py-16 bg-slate-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">🎂 Catering & Private Events</h2>
          <p class="text-slate-700 text-lg mb-6">Host your special event at ${name}. We offer catering for ${privateEventCapacity || '60'} guests.</p>
          <a href="mailto:${cateringEmail || email}" class="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700">Inquire About Catering</a>
        </div>
      </section>
    ` : '';
        // Build events section
        const eventsSection = hostEvents && weeklySpecials ? `
      <section class="py-16 bg-amber-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">🎵 Events & Specials</h2>
          <p class="text-slate-700 text-lg whitespace-pre-line">${weeklySpecials}</p>
        </div>
      </section>
    ` : '';
        // Build social links HTML
        const socialHTML = socialLinks && Object.values(socialLinks).some(v => v) ? `
      <div class="flex gap-4 justify-center mt-6">
        ${socialLinks.instagram ? `<a href="https://instagram.com/${socialLinks.instagram}" class="text-orange-600 hover:text-orange-700 font-semibold">Instagram</a>` : ''}
        ${socialLinks.tiktok ? `<a href="https://tiktok.com/@${socialLinks.tiktok}" class="text-orange-600 hover:text-orange-700 font-semibold">TikTok</a>` : ''}
        ${socialLinks.yelp ? `<a href="${socialLinks.yelp}" class="text-orange-600 hover:text-orange-700 font-semibold">Yelp</a>` : ''}
      </div>
    ` : '';
        const prompt = `Create a high-converting, professional restaurant website with the following details:

🏪 RESTAURANT INFO:
Name: ${name}
Cuisine: ${cuisineType}
Price Range: ${priceRange}
Tagline: ${tagline || 'Delicious cuisine, unforgettable experience'}
Address: ${address}, ${city}
Phone: ${phone}
Email: ${email}
${neighborhood ? 'Neighborhood: ' + neighborhood : ''}
${parking ? 'Parking: ' + parking : ''}

📋 ABOUT:
${shortDescription || description}
${fullStory && founderName ? `
Founded by ${founderName}${yearFounded ? ` in ${yearFounded}` : ''}.
${fullStory}` : ''}

🍽️ MENU:
${menu?.map((item) => `- ${item.name}: ${item.description} ($${item.price.toFixed(2)})`).join('\n')}

⏰ HOURS:
${Object.entries(hours || {}).map(([day, time]) => `${day}: ${time}`).join('\n')}

🛒 SERVICES:
${[dineIn && '✓ Dine-in', takeout && '✓ Takeout', delivery && '✓ Delivery'].filter(Boolean).join(', ')}

📱 ONLINE ORDERING:
${onlineOrdering?.acceptOrders ? `Available on: ${onlineOrdering.platforms.join(', ')} - URL: ${onlineOrdering.customURL}` : 'Not available'}

📅 RESERVATIONS:
${reservations?.acceptReservations ? `Available on: ${reservations.platforms.join(', ')} - URL: ${reservations.url}` : 'Not available'}

🎂 CATERING:
${cateringAvailable ? `Available - Capacity: ${privateEventCapacity} guests - Email: ${cateringEmail}` : 'Not available'}

🎵 EVENTS:
${hostEvents && weeklySpecials ? weeklySpecials : 'No regular events'}

📱 SOCIAL:
${socialLinks?.instagram ? 'Instagram: ' + socialLinks.instagram + ' ' : ''}${socialLinks?.tiktok ? 'TikTok: ' + socialLinks.tiktok : ''}

Design Style: ${style} 
Tone: ${tone}

${customInstruction ? `⭐ SPECIAL REQUEST: "${customInstruction}"` : ''}

REQUIREMENTS:
- Create a complete, valid HTML document (no markdown)
- Use Tailwind CSS via CDN
- Use high-quality images from unsplash.com
- Mobile-responsive design
- Include: Hero, Navigation, About Us, Full Menu (organized by category), Hours, Location/Map, Reservation/Order CTAs, Social Links, Footer
- ${style === "Luxury" ? 'Elegant, upscale, fine dining aesthetic with premium typography' : style === "Modern" ? 'Clean, contemporary, minimalist design' : style === "Casual" ? 'Friendly, inviting, approachable design' : 'Professional and polished'}
- ${tone === "Traditional" ? 'Classic, timeless language' : tone === "Trendy" ? 'Modern, fashionable voice' : tone === "Upscale" ? 'Premium, sophisticated tone' : 'Warm, welcoming, family-friendly'}
- Prominent "Order Now" and "Reserve" buttons
- Fast-loading, optimal performance
- Professional footer with all contact information

Return ONLY raw HTML - no markdown code blocks, no explanations.`;
        console.log('🤖 Calling Groq API...');
        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: groqModel,
            temperature: 1,
            max_tokens: 4096,
        });
        console.log('✅ Groq response received');
        const html = response.choices[0]?.message?.content || "<html><body>Error generating preview.</body></html>";
        console.log('📝 Raw HTML length:', html.length);
        // Better HTML cleaning - handle various markdown wrapping formats
        let cleanHtml = html;
        if (cleanHtml.includes('```html')) {
            cleanHtml = cleanHtml.replace(/```html\n?/g, '').replace(/```\n?/g, '');
        }
        if (cleanHtml.includes('```')) {
            cleanHtml = cleanHtml.replace(/```[a-z]*\n?/g, '').replace(/```\n?/g, '');
        }
        cleanHtml = cleanHtml.trim();
        console.log('🧹 Cleaned HTML length:', cleanHtml.length);
        // Validate that we have actual HTML
        if (!cleanHtml.includes('<html') && !cleanHtml.includes('<HTML')) {
            console.warn('⚠️ Response does not contain HTML tags. Raw response:', html.substring(0, 200));
        }
        res.json({ html: cleanHtml });
        console.log('✅ Response sent successfully');
    }
    catch (error) {
        console.error("❌ Generation error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: "Failed to generate website", details: errorMessage });
    }
});
app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});
