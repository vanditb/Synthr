import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessDetails, BusinessType, WebsiteStyle, RestaurantTone, MenuItem } from '../types.ts';
import { Upload, Check, Loader2, Plus, Trash2, ChevronDown, Link2 } from 'lucide-react';

export const Builder: React.FC<{ setDetails: (d: BusinessDetails) => void }> = ({ setDetails }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>('basic');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [formData, setFormData] = useState<BusinessDetails>({
    name: 'La Bella Pizza',
    type: BusinessType.Restaurant,
    style: WebsiteStyle.Modern,
    tone: RestaurantTone.FamilyFriendly,
    cuisineType: 'Italian',
    priceRange: '$$',
    city: 'San Francisco',
    address: '123 Main St',
    phone: '(555) 123-4567',
    email: 'hello@labellapizza.com',
    hours: {
      Monday: '11:00 AM - 10:00 PM',
      Tuesday: '11:00 AM - 10:00 PM',
      Wednesday: '11:00 AM - 10:00 PM',
      Thursday: '11:00 AM - 10:00 PM',
      Friday: '11:00 AM - 11:00 PM',
      Saturday: '12:00 PM - 11:00 PM',
      Sunday: '12:00 PM - 9:00 PM'
    },
    dineIn: true,
    takeout: true,
    delivery: true,
    tagline: 'Authentic Neapolitan Pizza',
    shortDescription: 'Handcrafted pizzas made with imported ingredients and traditional techniques.',
    fullStory: 'Founded in 2015, La Bella Pizza brings authentic Italian pizza-making traditions to San Francisco.',
    yearFounded: 2015,
    founderName: 'Marco Rossi',
    menu: [
      { name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, basil', price: 14, category: 'Pizzas', dietary: ['vegetarian'] },
      { name: 'Carbonara', description: 'Guanciale, egg, pecorino', price: 16, category: 'Pizzas' }
    ],
    onlineOrdering: {
      acceptOrders: true,
      platforms: ['doordash', 'ubereats'],
      customURL: 'https://www.labellapizza.com/order'
    },
    reservations: {
      acceptReservations: true,
      platforms: ['opentable'],
      url: 'https://www.opentable.com'
    },
    googleMapsLink: 'https://maps.google.com',
    parking: 'Street parking available',
    neighborhood: 'Hayes Valley',
    socialLinks: {
      instagram: '@labellapizza',
      yelp: 'labellapizza',
      googleReviews: 'maps.google.com'
    },
    hostEvents: true,
    eventTypes: ['happyHour'],
    weeklySpecials: 'Tuesday: $5 wine night. Friday: Live jazz music 7-10pm',
    cateringAvailable: true,
    cateringEmail: 'catering@labellapizza.com',
    privateEventCapacity: 60,
    pages: ['Home', 'Menu', 'Location', 'Contact'],
    description: 'Authentic Italian restaurant',
    images: [],
    useStockImages: true
  });

  const handleAddMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      menu: [...prev.menu, { name: '', description: '', price: 0, category: '', dietary: [] }]
    }));
  };

  const handleRemoveMenuItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      menu: prev.menu.filter((_, i) => i !== index)
    }));
  };

  const handleMenuItemChange = (index: number, field: keyof MenuItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      menu: prev.menu.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleHoursChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hours: { ...prev.hours, [day]: value }
    }));
  };

  const compressImage = (file: File, imageType: 'interior' | 'food' | 'logo'): Promise<string> => {
    const maxDimension = imageType === 'logo' ? 600 : 1600;
    const quality = imageType === 'logo' ? 0.9 : 0.75;
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'interior' | 'food' | 'logo') => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      try {
        const data = await compressImage(file, imageType);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { type: imageType, data }]
        }));
      } catch (err) {
        console.error('Image compression failed, using original file', err);
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = event.target?.result as string;
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, { type: imageType, data }]
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.cuisineType || !formData.phone) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setDetails(formData);
      navigate('/preview');
    }, 1000);
  };

  const SectionHeader = ({ id, title, icon }: { id: string; title: string; icon: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => setExpandedSection(expandedSection === id ? '' : id)}
      className="w-full flex items-center justify-between px-6 py-4 bg-slate-100 hover:bg-slate-200 border-b border-slate-200 transition"
    >
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <ChevronDown size={20} className={`transition transform ${expandedSection === id ? 'rotate-180' : ''}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-orange-600 to-amber-600">
          <h2 className="text-3xl font-bold text-white font-serif">Create Your Restaurant Website</h2>
          <p className="text-orange-100 mt-1">Complete form with your restaurant details, menu, and social links</p>
        </div>

        <form onSubmit={handleSubmit} className="divide-y divide-slate-200">

          {/* BASIC INFO */}
          {expandedSection === 'basic' && (
            <div className="p-8 space-y-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Restaurant Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="e.g. La Bella Pizza"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Cuisine Type *</label>
                  <input
                    type="text"
                    value={formData.cuisineType}
                    onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="e.g. Italian, Indian, Mexican"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Authentic Neapolitan Pizza"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price Range</label>
                  <select
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value as '$' | '$$' | '$$$' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="$">$ (Budget-friendly)</option>
                    <option value="$$">$$ (Moderate)</option>
                    <option value="$$$">$$$ (Upscale)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="contact@restaurant.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. San Francisco" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="123 Main St" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Services Offered</label>
                <div className="space-y-2">
                  {[
                    { key: 'dineIn', label: 'Dine-in' },
                    { key: 'takeout', label: 'Takeout' },
                    { key: 'delivery', label: 'Delivery' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData as any)[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-orange-600"
                      />
                      <span className="text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          <SectionHeader id="basic" title="📋 Basic Info" icon={<span>🏷️</span>} />

          {/* ABOUT THE RESTAURANT */}
          {expandedSection === 'about' && (
            <div className="p-8 space-y-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Year Founded</label>
                  <input type="number" value={formData.yearFounded || ''} onChange={(e) => setFormData({ ...formData, yearFounded: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="2015" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Founder / Chef Name</label>
                  <input type="text" value={formData.founderName || ''} onChange={(e) => setFormData({ ...formData, founderName: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. Marco Rossi" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
                <input type="text" value={formData.shortDescription || ''} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="1-2 sentence description" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Story</label>
                <textarea value={formData.fullStory || ''} onChange={(e) => setFormData({ ...formData, fullStory: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none" placeholder="Tell your restaurant's story..." />
              </div>
            </div>
          )}
          <SectionHeader id="about" title="📖 About Your Restaurant" icon={<span>🎭</span>} />

          {/* ONLINE ORDERING & RESERVATIONS */}
          {expandedSection === 'ordering' && (
            <div className="p-8 space-y-8 bg-slate-50">
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><span>🛒</span> Online Ordering</h4>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={formData.onlineOrdering.acceptOrders}
                    onChange={(e) => setFormData({ ...formData, onlineOrdering: { ...formData.onlineOrdering, acceptOrders: e.target.checked } })}
                    className="w-4 h-4 rounded border-slate-300 text-orange-600"
                  />
                  <span className="text-slate-700 font-medium">Accept online orders</span>
                </label>
                
                {formData.onlineOrdering.acceptOrders && (
                  <div className="space-y-3 pl-7">
                    <p className="text-sm text-slate-600">Which platforms?</p>
                    {['DoorDash', 'Uber Eats', 'Toast', 'Square', 'Custom URL'].map((platform, idx) => (
                      <label key={platform} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.onlineOrdering.platforms.includes(platform.toLowerCase().replace(' ', '') as any)}
                          onChange={(e) => {
                            const plat = platform.toLowerCase().replace(' ', '') as any;
                            setFormData({
                              ...formData,
                              onlineOrdering: {
                                ...formData.onlineOrdering,
                                platforms: e.target.checked
                                  ? [...formData.onlineOrdering.platforms, plat]
                                  : formData.onlineOrdering.platforms.filter(p => p !== plat)
                              }
                            });
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-orange-600"
                        />
                        <span className="text-slate-700 text-sm">{platform}</span>
                      </label>
                    ))}
                    {formData.onlineOrdering.platforms.includes('custom') && (
                      <input
                        type="url"
                        value={formData.onlineOrdering.customURL || ''}
                        onChange={(e) => setFormData({ ...formData, onlineOrdering: { ...formData.onlineOrdering, customURL: e.target.value } })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                        placeholder="https://yourrestaurant.com/order"
                      />
                    )}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><span>📅</span> Reservations</h4>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={formData.reservations.acceptReservations}
                    onChange={(e) => setFormData({ ...formData, reservations: { ...formData.reservations, acceptReservations: e.target.checked } })}
                    className="w-4 h-4 rounded border-slate-300 text-orange-600"
                  />
                  <span className="text-slate-700 font-medium">Accept reservations</span>
                </label>
                
                {formData.reservations.acceptReservations && (
                  <div className="space-y-3 pl-7">
                    <p className="text-sm text-slate-600">Which system?</p>
                    {['OpenTable', 'Resy', 'Yelp', 'Phone'].map((platform) => (
                      <label key={platform} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.reservations.platforms.includes(platform.toLowerCase() as any)}
                          onChange={(e) => {
                            const plat = platform.toLowerCase() as any;
                            setFormData({
                              ...formData,
                              reservations: {
                                ...formData.reservations,
                                platforms: e.target.checked
                                  ? [...formData.reservations.platforms, plat]
                                  : formData.reservations.platforms.filter(p => p !== plat)
                              }
                            });
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-orange-600"
                        />
                        <span className="text-slate-700 text-sm">{platform}</span>
                      </label>
                    ))}
                    {(formData.reservations.platforms.includes('opentable') || formData.reservations.platforms.includes('resy')) && (
                      <input
                        type="url"
                        value={formData.reservations.url || ''}
                        onChange={(e) => setFormData({ ...formData, reservations: { ...formData.reservations, url: e.target.value } })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                        placeholder="https://www.opentable.com/..."
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <SectionHeader id="ordering" title="🛒 Ordering & Reservations" icon={<span>📱</span>} />

          {/* LOCATION & MAPS */}
          {expandedSection === 'location' && (
            <div className="p-8 space-y-6 bg-slate-50">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Google Maps Link</label>
                <input type="url" value={formData.googleMapsLink || ''} onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="https://maps.google.com/..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Neighborhood (Optional)</label>
                <input type="text" value={formData.neighborhood || ''} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. Hayes Valley" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Parking Info</label>
                <input type="text" value={formData.parking || ''} onChange={(e) => setFormData({ ...formData, parking: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. Street parking available, Valet available" />
              </div>
            </div>
          )}
          <SectionHeader id="location" title="🗺️ Location & Maps" icon={<span>📍</span>} />

          {/* SOCIAL LINKS */}
          {expandedSection === 'social' && (
            <div className="p-8 space-y-4 bg-slate-50">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram Handle</label>
                <input type="text" value={formData.socialLinks.instagram || ''} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="@yourrestaurant" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">TikTok Handle</label>
                <input type="text" value={formData.socialLinks.tiktok || ''} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, tiktok: e.target.value } })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="@yourrestaurant" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Google Reviews Link</label>
                <input type="url" value={formData.socialLinks.googleReviews || ''} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, googleReviews: e.target.value } })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Google Maps/Reviews URL" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Yelp URL</label>
                <input type="url" value={formData.socialLinks.yelp || ''} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, yelp: e.target.value } })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="https://www.yelp.com/..." />
              </div>
            </div>
          )}
          <SectionHeader id="social" title="📱 Social Links" icon={<span>🔗</span>} />

          {/* HOURS */}
          {expandedSection === 'hours' && (
            <div className="p-8 space-y-4 bg-slate-50">
              {daysOfWeek.map(day => (
                <div key={day}>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">{day}</label>
                  <input
                    type="text"
                    value={formData.hours[day]}
                    onChange={(e) => handleHoursChange(day, e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="e.g. 11:00 AM - 10:00 PM"
                  />
                </div>
              ))}
            </div>
          )}
          <SectionHeader id="hours" title="🕐 Opening Hours" icon={<span>⏰</span>} />

          {/* MENU */}
          {expandedSection === 'menu' && (
            <div className="p-8 space-y-6 bg-slate-50">
              <div className="space-y-4">
                {formData.menu.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-slate-900">Item {idx + 1}</h4>
                      <button type="button" onClick={() => handleRemoveMenuItem(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleMenuItemChange(idx, 'name', e.target.value)}
                        placeholder="Item name"
                        className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => handleMenuItemChange(idx, 'category', e.target.value)}
                        placeholder="Category (e.g. Appetizers)"
                        className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleMenuItemChange(idx, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleMenuItemChange(idx, 'price', parseFloat(e.target.value))}
                      placeholder="Price"
                      className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddMenuItem}
                className="w-full py-2 border border-dashed border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add Menu Item
              </button>
            </div>
          )}
          <SectionHeader id="menu" title="🍽️ Menu Items" icon={<span>📋</span>} />

          {/* EVENTS & CATERING */}
          {expandedSection === 'events' && (
            <div className="p-8 space-y-8 bg-slate-50">
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">🎵 Events & Specials</h4>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={formData.hostEvents}
                    onChange={(e) => setFormData({ ...formData, hostEvents: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-orange-600"
                  />
                  <span className="text-slate-700 font-medium">We host events</span>
                </label>
                {formData.hostEvents && (
                  <textarea value={formData.weeklySpecials || ''} onChange={(e) => setFormData({ ...formData, weeklySpecials: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-20" placeholder="e.g. Tuesday: $5 wine night. Friday: Live jazz music 7-10pm" />
                )}
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-4">🎂 Catering & Private Events</h4>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={formData.cateringAvailable}
                    onChange={(e) => setFormData({ ...formData, cateringAvailable: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-orange-600"
                  />
                  <span className="text-slate-700 font-medium">We offer catering</span>
                </label>
                {formData.cateringAvailable && (
                  <div className="space-y-3 pl-7">
                    <input
                      type="email"
                      value={formData.cateringEmail || ''}
                      onChange={(e) => setFormData({ ...formData, cateringEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="catering@restaurant.com"
                    />
                    <input
                      type="number"
                      value={formData.privateEventCapacity || ''}
                      onChange={(e) => setFormData({ ...formData, privateEventCapacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Private event capacity (e.g. 60 guests)"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <SectionHeader id="events" title="🎉 Events & Catering" icon={<span>🎭</span>} />

          {/* STYLE & TONE */}
          {expandedSection === 'style' && (
            <div className="p-8 space-y-6 bg-slate-50">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Website Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[WebsiteStyle.Clean, WebsiteStyle.Modern, WebsiteStyle.Luxury, WebsiteStyle.Casual].map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setFormData({ ...formData, style })}
                      className={`p-3 rounded-lg border-2 font-semibold transition ${
                        formData.style === style
                          ? 'border-orange-600 bg-orange-50 text-orange-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Restaurant Vibe</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.values(RestaurantTone).map(tone => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setFormData({ ...formData, tone })}
                      className={`p-2 rounded-lg border-2 font-semibold text-sm transition ${
                        formData.tone === tone
                          ? 'border-orange-600 bg-orange-50 text-orange-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <SectionHeader id="style" title="🎨 Style & Vibe" icon={<span>✨</span>} />

          {/* IMAGES */}
          {expandedSection === 'images' && (
            <div className="p-8 space-y-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['interior', 'food', 'logo'] as const).map(type => (
                  <div key={type} className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, type)}
                      className="hidden"
                      id={`upload-${type}`}
                    />
                    <label htmlFor={`upload-${type}`} className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <span className="text-sm font-semibold text-slate-700 block capitalize">{type} Photo</span>
                      <span className="text-xs text-slate-500">Click to upload</span>
                    </label>
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.useStockImages}
                  onChange={(e) => setFormData({ ...formData, useStockImages: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-orange-600"
                />
                <span className="text-slate-700 font-semibold">Use AI-selected stock photos for missing images</span>
              </label>
            </div>
          )}
          <SectionHeader id="images" title="🖼️ Images (Optional)" icon={<span>📸</span>} />

          {/* SUBMIT */}
          <div className="p-8 bg-white flex justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Generate Website
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
