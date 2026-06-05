// --- Persistent Database Setup ---
const STORAGE_KEY = 'sagura_market_data';

const getInitialData = () => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    superAdmin: {
      username: 'super_admin',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // simple hash of admin_password
    },
    paymentSettings: {
      monthlyFeeTZS: 15000,
      monthlyFeeUSD: 5.70,
      gateways: [
        { id: 'mpesa', name: 'M-Pesa (Lipa Namba)', detail: 'Lipa Namba: 544322 (SAGURA MARKET)' },
        { id: 'tigopesa', name: 'Tigo Pesa (Lipa)', detail: 'Lipa Namba: 889911' },
        { id: 'card', name: 'Credit Card / Visa', detail: 'USD Gateway Secure' }
      ]
    },
    businesses: {
      '803b343739904d42b34226901e482d1e': {
        id: '803b343739904d42b34226901e482d1e',
        username: 'global_manager',
        passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // simple hash of 'password'
        shopName: 'Global Logistics Corp',
        description: 'Leading international B2B cargo distribution, bulk transport, and commercial warehouse storage. Providing custom logistics solutions for high-capacity manufacturers worldwide.',
        primaryColor: '#3b82f6',
        themeStyle: 'glass',
        whatsapp: '+255712345678',
        email: 'info@globallogistics.co.tz',
        locationName: 'Plot 120, Nelson Mandela Road, Dar es Salaam, Tanzania',
        coordinates: { lat: -6.8200, lng: 39.2600 },
        adPaid: true,
        adExpiry: thirtyDaysFromNow.toISOString(),
        products: [
          {
            id: 'gl1',
            name: 'Bulk Ocean Freight Container (FCL)',
            price: '2,500,000 TZS',
            description: 'Full Container Load (FCL) cargo shipping services internationally. Includes comprehensive customs clearance support, marine insurance handling, and port terminal distribution.',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
            url: 'https://example.com/purchase/ocean-freight'
          },
          {
            id: 'gl2',
            name: 'Heavy Road Transport (Flatbed / haul)',
            price: '15,000 TZS per Km',
            description: 'Interstate bulk cargo transport using high-capacity flatbeds and heavy cargo haulers. Specialized team for route clearance and pilot vehicle escorts.',
            image: 'https://images.unsplash.com/photo-1592838064821-7ec1552047f1?auto=format&fit=crop&q=80&w=400',
            url: 'https://example.com/purchase/heavy-transport'
          },
          {
            id: 'gl3',
            name: 'Secure Bonded Warehouse Storage',
            price: '25,000 TZS / Sqm',
            description: 'Temperature-controlled depot with 24/7 armed security patrols, active CCTV surveillance, and automated WMS barcode stock-tracking systems.',
            image: '', 
            url: 'https://example.com/purchase/warehouse'
          }
        ]
      },
      'kili_agro': {
        id: 'kili_agro',
        username: 'kili_manager',
        passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // 'password'
        shopName: 'Kilimanjaro Agro Wholesalers',
        description: 'Bulk exporters of grade-AA organic Arabica coffee and premium raw cashew nuts harvested directly from smallholder farms on the slopes of Mt. Kilimanjaro.',
        primaryColor: '#10b981',
        themeStyle: 'modern',
        whatsapp: '+255754987654',
        email: 'sales@kiliagro.co.tz',
        locationName: 'Moshi Urban, Kilimanjaro Region, Tanzania',
        coordinates: { lat: -3.3400, lng: 37.3400 },
        adPaid: false, // Expired to showcase payment block
        adExpiry: yesterday.toISOString(),
        products: [
          {
            id: 'ka1',
            name: 'Green Arabica Coffee Beans (Grade AA)',
            price: '12,000,000 TZS per Ton',
            description: 'Unroasted, certified organic Arabica coffee beans. Carefully sorted, moisture-locked at 11.5% and packaged in robust 60kg sisal bags.',
            image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=400',
            url: 'https://example.com/purchase/coffee'
          },
          {
            id: 'ka2',
            name: 'Processed Cashew Nuts W240 (Raw bulk)',
            price: '1,800,000 TZS per 100Kg',
            description: 'Export-grade white whole kernels cashew nuts. Size count W240 (jumbo nuts), vacuum-sealed for global shipping compliance.',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400',
            url: 'https://example.com/purchase/cashews'
          }
        ]
      }
    }
  };
};

let db = loadData();

function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const defaultData = getInitialData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function checkSubscriptionStatus(business) {
  if (!business.adExpiry) return false;
  const expiryDate = new Date(business.adExpiry);
  const now = new Date();
  return expiryDate > now;
}

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// --- Security Sanitization ---
function sanitizeHTML(dirtyString) {
  if (!dirtyString || typeof dirtyString !== 'string') return '';
  let clean = dirtyString.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
  clean = clean.replace(/\s+on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '');
  clean = clean.replace(/href\s*=\s*(["']\s*javascript:[^"']*["']|javascript:[^\s>]+)/gi, '');
  clean = clean.replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, '');
  return clean;
}

function validateLinkURL(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.toLowerCase().startsWith('javascript:')) {
    return '#';
  }
  return trimmed;
}

// --- Session States ---
let currentSession = null; // { role: 'manager' | 'super', businessId?: string }
let shopViewMode = 'grid'; // client default product display layout mode
let activeManagerTab = 'profile'; // 'profile', 'products', 'billing'
let editingProductId = null; // null for add, string id for edit

// --- Application Router ---
function router() {
  const hash = window.location.hash || '#/';
  const viewport = document.getElementById('app-viewport');
  const navbar = document.getElementById('platform-navbar');
  
  // Clean custom shop theme changes on global pages
  document.documentElement.style.removeProperty('--shop-primary');
  document.documentElement.style.removeProperty('--shop-primary-glow');

  // Handle active states on navbar links
  document.getElementById('nav-find-shops').classList.remove('active');
  
  if (hash === '#/') {
    navbar.style.display = 'flex';
    document.getElementById('nav-find-shops').classList.add('active');
    renderHome(viewport);
  } else if (hash.startsWith('#/shop/')) {
    navbar.style.display = 'none'; // hide navigation for full custom sub-website simulation
    const shopId = hash.split('#/shop/')[1];
    renderShopfront(viewport, shopId);
  } else if (hash === '#/super-admin') {
    navbar.style.display = 'flex';
    renderSuperAdmin(viewport);
  } else if (hash === '#/dashboard') {
    navbar.style.display = 'flex';
    renderManager(viewport);
  } else {
    viewport.innerHTML = `<div style="text-align:center; padding:5rem 2rem;"><h2>Page Not Found</h2><a href="#/" class="btn btn-primary" style="margin-top:1rem;">Back to Directory</a></div>`;
  }
  
  // Redraw icons loaded dynamically
  lucide.createIcons();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// --- Page Renderers ---

// 1. Landing Page
function renderHome(container) {
  const searchQuery = container.dataset.searchQuery || '';
  const filterType = container.dataset.filterType || 'all'; // 'all' or 'featured'
  const allBusinesses = Object.values(db.businesses);
  
  const filtered = allBusinesses.filter(biz => {
    const isSubActive = checkSubscriptionStatus(biz);
    const matchesSearch = biz.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || (filterType === 'featured' && isSubActive);
    return matchesSearch && matchesFilter;
  });

  container.innerHTML = `
    <div style="padding: 2.5rem 1.5rem; maxWidth: 1200px; margin: 0 auto;" class="animate-fade">
      <header style="text-align: center; margin-bottom: 3.5rem; margin-top: 1rem;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(135deg, #ffffff, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Direct B2B Wholesaler Showrooms
        </h1>
        <p style="color: var(--text-muted); font-size: 1.2rem; max-width: 700px; margin: 0 auto; line-height: 1.7;">
          Browse premium products, view active pricing lists, map company shop locations, and connect directly with market managers via WhatsApp or Email.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 4rem;">
        <div class="glass-panel" style="padding: 1.5rem;">
          <i data-lucide="award" style="width: 36px; height: 36px; color: var(--color-secondary); margin-bottom: 0.75rem;"></i>
          <h3>Verified Showrooms</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
            Large businesses customize their sub-websites with individual brand layouts, custom color themes, and verified product specifications.
          </p>
        </div>
        <div class="glass-panel" style="padding: 1.5rem;">
          <i data-lucide="message-square" style="width: 36px; height: 36px; color: var(--color-primary); margin-bottom: 0.75rem;"></i>
          <h3>Direct Connections</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
            No middleman fees. Connect with wholesalers directly via preloaded WhatsApp numbers and official business emails.
          </p>
        </div>
        <div class="glass-panel" style="padding: 1.5rem;">
          <i data-lucide="download" style="width: 36px; height: 36px; color: var(--color-accent); margin-bottom: 0.75rem;"></i>
          <h3>Installable PWA App</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
            Add SAGURAmarket to your mobile home screen or desktop dashboard. Works offline to display cached product items and shop locations.
          </p>
        </div>
      </div>

      <!-- Search and Filters Bar -->
      <div class="glass-panel animate-slide" style="padding: 1.5rem; margin-bottom: 3rem; display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="display: flex; gap: 1rem; width: 100%; position: relative;">
          <div style="position: absolute; left: 16px; top: 15px; color: var(--text-muted);">
            <i data-lucide="search" style="width: 20px; height: 20px;"></i>
          </div>
          <input
            id="search-input"
            type="text"
            placeholder="Search wholesalers by name, products, description, or location..."
            value="${searchQuery}"
            class="input-field"
            style="padding-left: 3rem; font-size: 1.05rem; height: 52px;"
          />
        </div>
        
        <div style="display: flex; justify-content: space-between; alignItems: center; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; gap: 0.5rem;">
            <button id="btn-filter-all" class="btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
              All Showrooms (${allBusinesses.length})
            </button>
            <button id="btn-filter-featured" class="btn ${filterType === 'featured' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
              Premium Advertisers
            </button>
          </div>
          <span style="font-size: 0.9rem; color: var(--text-muted);">
            Showing ${filtered.length} wholesaler shops
          </span>
        </div>
      </div>

      <!-- Grid list -->
      <h2 style="font-size: 1.75rem; margin-bottom: 1.5rem; font-family: var(--font-heading);">Wholesaler Showrooms Directory</h2>
      
      ${filtered.length === 0 ? `
        <div class="glass-panel" style="padding: 3rem; text-align: center; color: var(--text-muted);">
          <i data-lucide="alert-triangle" style="width: 48px; height: 48px; color: var(--color-accent); margin: 0 auto 1rem auto;"></i>
          <h3>No wholesalers match your criteria.</h3>
          <p style="margin-top: 0.5rem;">Try clearing search or filters.</p>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 2rem;">
          ${filtered.map(biz => {
            const isSubActive = checkSubscriptionStatus(biz);
            return `
              <div class="glass-panel animate-fade" style="padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; border-top: ${isSubActive ? `4px solid ${biz.primaryColor}` : '1px solid var(--border-light)'}; position: relative;">
                
                ${isSubActive ? `
                  <span style="position: absolute; top: 12px; right: 12px; background: rgba(16, 185, 129, 0.15); color: var(--color-secondary); padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.25rem;">
                    <i data-lucide="check-circle" style="width: 12px; height: 12px;"></i> Sponsored
                  </span>
                ` : `
                  <span style="position: absolute; top: 12px; right: 12px; background: rgba(239, 68, 68, 0.12); color: var(--color-danger); padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.25rem;">
                    <i data-lucide="shield-alert" style="width: 12px; height: 12px;"></i> Ads Blocked / Unpaid
                  </span>
                `}

                <div>
                  <h3 style="font-size: 1.4rem; margin-bottom: 0.75rem;">${biz.shopName}</h3>
                  <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; height: 4.5em;">
                    ${biz.description}
                  </p>
                  
                  <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
                      <i data-lucide="map-pin" style="width: 16px; height: 16px;"></i>
                      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${biz.locationName}</span>
                    </div>
                  </div>
                </div>

                <a href="#/shop/${biz.id}" class="btn" style="width: 100%; justify-content: center; background: ${biz.primaryColor}; color: white; box-shadow: 0 4px 12px ${biz.primaryColor}3d;">
                  Visit Sub-Website
                </a>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;

  // Bind Search events
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    container.dataset.searchQuery = e.target.value;
    renderHome(container);
    lucide.createIcons();
  });

  // Bind filter toggles
  document.getElementById('btn-filter-all').addEventListener('click', () => {
    container.dataset.filterType = 'all';
    renderHome(container);
    lucide.createIcons();
  });
  document.getElementById('btn-filter-featured').addEventListener('click', () => {
    container.dataset.filterType = 'featured';
    renderHome(container);
    lucide.createIcons();
  });
}

// 2. Client Storefront (Sub-website)
function renderShopfront(container, shopId) {
  const shop = db.businesses[shopId];
  if (!shop) {
    container.innerHTML = `<div style="text-align:center; padding:5rem 2rem;"><h2>Showroom Not Found</h2><a href="#/" class="btn btn-secondary" style="margin-top:1.5rem;"><i data-lucide="arrow-left"></i> Return to Directory</a></div>`;
    return;
  }

  const isSubActive = checkSubscriptionStatus(shop);

  // Apply colors dynamically to viewport CSS variables
  document.documentElement.style.setProperty('--shop-primary', shop.primaryColor || '#3b82f6');
  document.documentElement.style.setProperty('--shop-primary-glow', `${shop.primaryColor || '#3b82f6'}2c`);

  container.innerHTML = `
    <div class="shop-wrapper shop-theme-${shop.themeStyle || 'glass'} animate-fade">
      <!-- Shopfront Header -->
      <header class="shop-header">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <a href="#/" style="display: inline-flex; align-items: center; gap: 0.4rem; color: var(--text-muted); text-decoration: none; font-size: 0.85rem; margin-bottom: 1rem;">
              <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> SAGURAmarket Platform
            </a>
            <h1 class="shop-title">${shop.shopName}</h1>
            <p style="color: var(--text-muted); max-width: 750px; font-size: 1rem; line-height: 1.6;">
              ${shop.description}
            </p>
          </div>

          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem;">
            ${isSubActive ? `
              <span class="shop-badge active" style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.25rem;">
                <i data-lucide="globe" style="width:14px; height:14px;"></i> Showcase Online
              </span>
            ` : `
              <span class="shop-badge blocked" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.25rem;">
                <i data-lucide="shield-alert" style="width:14px; height:14px;"></i> Ad Subscription Blocked
              </span>
            `}

            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
              ${shop.whatsapp ? `
                <a href="https://wa.me/${shop.whatsapp.replace(/\+/g, '')}?text=Hello%20${encodeURIComponent(shop.shopName)},%20I%20saw%20your%20products%20on%20SAGURAmarket." target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
                  <i data-lucide="message-square" style="width:16px; height:16px; color:#25d366;"></i> WhatsApp
                </a>
              ` : ''}
              ${shop.email ? `
                <a href="mailto:${shop.email}?subject=Product%20Inquiry%20from%20SAGURAmarket" class="btn btn-secondary" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
                  <i data-lucide="mail" style="width:16px; height:16px; color:#ea4335;"></i> Email Us
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </header>

      <!-- Main Container -->
      <main style="max-width: 1200px; margin: 3rem auto 0 auto; padding: 0 1.5rem;">
        ${!isSubActive ? `
          <!-- Catalog Blocked Overlay -->
          <div class="glass-panel" style="padding: 3.5rem 2rem; text-align: center; margin-bottom: 3rem; border-left: 4px solid var(--color-danger);">
            <i data-lucide="lock" style="width: 64px; height: 64px; color: var(--color-danger); margin: 0 auto 1.5rem auto;"></i>
            <h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">Showroom Catalog Hidden</h2>
            <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto 1.5rem auto; line-height: 1.6;">
              The advertisement and showroom subscription for <strong>${shop.shopName}</strong> has expired. 
              Sub-websites are automatically blocked once the monthly payment (15,000 TZS / $5.70 USD) ends.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
              <a href="#/dashboard" class="btn btn-primary">Wholesaler Dashboard Login</a>
              <a href="#/" class="btn btn-secondary">Back to Market Directory</a>
            </div>
          </div>
        ` : `
          <!-- Active Products Grid -->
          <div style="display: grid; grid-template-columns: 1fr 320px; gap: 2.5rem; align-items: start;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 style="font-size: 1.5rem; font-family: var(--font-heading);">Product Inventory</h2>
                
                <div style="display: flex; gap: 0.4rem; background: rgba(255,255,255,0.03); padding: 0.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                  <button id="toggle-grid-mode" class="theme-button-toggle ${shopViewMode === 'grid' ? 'active' : ''}" title="Visual Grid View">
                    <i data-lucide="grid" style="width: 16px; height: 16px;"></i>
                  </button>
                  <button id="toggle-list-mode" class="theme-button-toggle ${shopViewMode === 'list' ? 'active' : ''}" title="Price List View">
                    <i data-lucide="list" style="width: 16px; height: 16px;"></i>
                  </button>
                </div>
              </div>

              <div id="shopfront-products-view">
                ${renderProductsByMode(shop)}
              </div>
            </div>

            <!-- Sidebar Info -->
            <aside style="display: flex; flex-direction: column; gap: 2rem;">
              <div class="glass-panel" style="padding: 1.5rem;">
                <h3 style="font-size: 1.15rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                  <i data-lucide="map-pin" style="color: var(--shop-primary); width:18px; height:18px;"></i> Shop Location
                </h3>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.4;">
                  ${shop.locationName}
                </p>

                <!-- Mock Interactive Map -->
                <div class="map-canvas">
                  <div class="map-radar"></div>
                  <div style="position: relative; z-index: 2; background: var(--shop-primary); color: white; padding: 0.5rem; border-radius: 50%; box-shadow: 0 0 15px var(--shop-primary);">
                    <i data-lucide="map-pin" style="width: 20px; height: 20px;"></i>
                  </div>
                  
                  <div style="position: absolute; top: 0; bottom: 0; left: 25%; width: 1px; background: rgba(255,255,255,0.03);"></div>
                  <div style="position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: rgba(255,255,255,0.03);"></div>
                  <div style="position: absolute; top: 0; bottom: 0; left: 75%; width: 1px; background: rgba(255,255,255,0.03);"></div>
                  <div style="position: absolute; left: 0; right: 0; top: 33%; height: 1px; background: rgba(255,255,255,0.03);"></div>
                  <div style="position: absolute; left: 0; right: 0; top: 66%; height: 1px; background: rgba(255,255,255,0.03);"></div>

                  <span style="position: absolute; bottom: 8px; font-size: 0.7rem; color: rgba(255,255,255,0.4); font-family: monospace;">
                    Coords: ${shop.coordinates?.lat?.toFixed(4)}, ${shop.coordinates?.lng?.toFixed(4)}
                  </span>
                </div>

                <a href="https://www.openstreetmap.org/?mlat=${shop.coordinates?.lat}&mlon=${shop.coordinates?.lng}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%; justify-content: center; margin-top: 1rem; font-size: 0.85rem;">
                  View Large Map
                </a>
              </div>

              <div class="glass-panel" style="padding: 1.25rem; border-left: 3px solid var(--color-secondary);">
                <h4 style="font-size: 0.95rem; color: #10b981; display: flex; align-items: center; gap: 0.4rem;">
                  <i data-lucide="shield-check" style="width:16px; height:16px;"></i> Secure Connection
                </h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem; line-height: 1.4;">
                  All pricing listings and contact pathways are sanitized and verified. User transactions are secured via direct merchant routing.
                </p>
              </div>
            </aside>
          </div>
        `}
      </main>
    </div>
  `;

  // Bind view toggles (only if active)
  if (isSubActive) {
    const btnGrid = document.getElementById('toggle-grid-mode');
    const btnList = document.getElementById('toggle-list-mode');
    const productsView = document.getElementById('shopfront-products-view');

    btnGrid.addEventListener('click', () => {
      shopViewMode = 'grid';
      btnGrid.classList.add('active');
      btnList.classList.remove('active');
      productsView.innerHTML = renderProductsByMode(shop);
      lucide.createIcons();
    });

    btnList.addEventListener('click', () => {
      shopViewMode = 'list';
      btnList.classList.add('active');
      btnGrid.classList.remove('active');
      productsView.innerHTML = renderProductsByMode(shop);
      lucide.createIcons();
    });
  }
}

function renderProductsByMode(shop) {
  if (shop.products.length === 0) {
    return `<div class="shop-card" style="text-align: center; padding: 3rem;"><p style="color: var(--text-muted);">No products uploaded yet.</p></div>`;
  }

  if (shopViewMode === 'grid') {
    return `
      <div class="visual-grid">
        ${shop.products.map(prod => `
          <div class="shop-card animate-fade">
            ${prod.image ? `
              <div class="product-image-container">
                <img src="${prod.image}" alt="${prod.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            ` : `
              <div class="product-image-container">
                <div class="product-fallback-icon"><i data-lucide="list" style="width:40px; height:40px;"></i></div>
                <span style="position: absolute; bottom: 8px; right: 8px; font-size: 0.7rem; color: rgba(255,255,255,0.3);">No image</span>
              </div>
            `}
            <h3 style="font-size: 1.2rem; margin-top: 1.25rem; margin-bottom: 0.5rem;">${prod.name}</h3>
            <div class="price-badge" style="margin-bottom: 0.75rem;">${prod.price}</div>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem; line-height: 1.5; height: 4.5em; overflow: hidden;">
              ${prod.description}
            </p>
            ${prod.url ? `
              <a href="${validateLinkURL(prod.url)}" target="_blank" rel="noopener noreferrer" class="btn" style="width:100%; justify-content:center; background:rgba(255,255,255,0.05); color:white; border:1px solid rgba(255,255,255,0.08); font-size:0.85rem;">
                Purchase Website <i data-lucide="external-link" style="width:14px; height:14px; margin-left:0.25rem;"></i>
              </a>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  } else {
    return `
      <div class="text-list">
        ${shop.products.map(prod => `
          <div class="shop-card animate-fade" style="display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; flex-wrap: wrap; padding: 1.25rem 2rem;">
            <div style="flex: 1; min-width: 250px;">
              <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">${prod.name}</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.4;">${prod.description}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 1.5rem;">
              <div class="price-badge">${prod.price}</div>
              ${prod.url ? `
                <a href="${validateLinkURL(prod.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                  Order Site <i data-lucide="external-link" style="width:12px; height:12px;"></i>
                </a>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// 3. Super Admin Panel
function renderSuperAdmin(container) {
  if (!currentSession || currentSession.role !== 'super') {
    renderSuperAdminLogin(container);
    return;
  }

  const shops = Object.values(db.businesses);
  const activeSponsorsCount = shops.filter(s => checkSubscriptionStatus(s)).length;
  const blockedCount = shops.length - activeSponsorsCount;

  container.innerHTML = `
    <div style="padding: 2.5rem 1.5rem; maxWidth: 1200px; margin: 0 auto;" class="animate-fade">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;">
        <div>
          <h1 style="font-size: 2rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="shield-check" style="width:28px; height:28px; color:var(--color-primary);"></i> Super Admin Controller
          </h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Global directory management & advertising settings</p>
        </div>
        <button id="admin-logout-btn" class="btn btn-secondary"><i data-lucide="log-out"></i> Logout Admin</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        <div class="glass-panel" style="padding: 1.5rem; display: flex; align-items: center; gap: 1rem;">
          <div style="background: rgba(99,102,241,0.15); padding: 0.75rem; border-radius: 12px;"><i data-lucide="users"></i></div>
          <div><span>Registered Wholesalers</span><h3>${shops.length}</h3></div>
        </div>
        <div class="glass-panel" style="padding: 1.5rem; display: flex; align-items: center; gap: 1rem;">
          <div style="background: rgba(16,185,129,0.15); padding: 0.75rem; border-radius: 12px;"><i data-lucide="dollar-sign" style="color:var(--color-secondary);"></i></div>
          <div><span>Active Advertisers</span><h3 style="color:var(--color-secondary);">${activeSponsorsCount}</h3></div>
        </div>
        <div class="glass-panel" style="padding: 1.5rem; display: flex; align-items: center; gap: 1rem;">
          <div style="background: rgba(239,68,68,0.15); padding: 0.75rem; border-radius: 12px;"><i data-lucide="ban" style="color:var(--color-danger);"></i></div>
          <div><span>Ads Blocked</span><h3 style="color:var(--color-danger);">${blockedCount}</h3></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 360px; gap: 2.5rem; align-items: start;">
        <div class="glass-panel" style="padding: 2rem;">
          <h2 style="font-size: 1.3rem; margin-bottom: 1.5rem;">Wholesaler Sub-Websites</h2>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 550px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <th style="padding: 0.75rem; color: var(--text-muted); font-size: 0.85rem;">Shop Name</th>
                  <th style="padding: 0.75rem; color: var(--text-muted); font-size: 0.85rem;">Ad Expiration</th>
                  <th style="padding: 0.75rem; color: var(--text-muted); font-size: 0.85rem;">Status</th>
                  <th style="padding: 0.75rem; color: var(--text-muted); font-size: 0.85rem; text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${shops.map(shop => {
                  const isActive = checkSubscriptionStatus(shop);
                  return `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                      <td style="padding: 1rem 0.75rem;">
                        <div style="font-weight:600;">${shop.shopName}</div>
                      </td>
                      <td style="padding: 1rem 0.75rem; font-size: 0.9rem;">
                        ${new Date(shop.adExpiry).toLocaleDateString()}
                      </td>
                      <td style="padding: 1rem 0.75rem;">
                        ${isActive ? `
                          <span style="color: var(--color-secondary); font-size: 0.85rem; background: rgba(16,185,129,0.12); padding: 0.2rem 0.5rem; border-radius: 4px;">Sponsored</span>
                        ` : `
                          <span style="color: var(--color-danger); font-size: 0.85rem; background: rgba(239, 68, 68, 0.12); padding: 0.2rem 0.5rem; border-radius: 4px;">Ads Blocked</span>
                        `}
                      </td>
                      <td style="padding: 1rem 0.75rem; text-align: right;">
                        <button class="btn btn-toggle-block ${isActive ? 'btn-danger' : 'btn-primary'}" data-id="${shop.id}" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;">
                          ${isActive ? 'Block Ads' : 'Unblock / Pay'}
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="glass-panel" style="padding: 2rem;">
          <h3 style="font-size: 1.2rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="settings"></i> Global Billing Options
          </h3>
          <form id="admin-settings-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Monthly Fee (TZS)</label>
              <input id="admin-tzs-input" type="number" value="${db.paymentSettings.monthlyFeeTZS}" class="input-field" required />
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Monthly Fee (USD)</label>
              <input id="admin-usd-input" type="number" step="0.01" value="${db.paymentSettings.monthlyFeeUSD}" class="input-field" required />
            </div>
            <button type="submit" class="btn btn-primary" style="justify-content: center;">Save Configurations</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Bind logout
  document.getElementById('admin-logout-btn').addEventListener('click', () => {
    currentSession = null;
    router();
  });

  // Bind toggle action
  document.querySelectorAll('.btn-toggle-block').forEach(btn => {
    btn.addEventListener('click', () => {
      const shopId = btn.dataset.id;
      const shop = db.businesses[shopId];
      if (checkSubscriptionStatus(shop)) {
        shop.adPaid = false;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        shop.adExpiry = yesterday.toISOString();
      } else {
        shop.adPaid = true;
        const thirtyDays = new Date();
        thirtyDays.setDate(thirtyDays.getDate() + 30);
        shop.adExpiry = thirtyDays.toISOString();
      }
      saveData();
      renderSuperAdmin(container);
      lucide.createIcons();
    });
  });

  // Bind settings form
  document.getElementById('admin-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    db.paymentSettings.monthlyFeeTZS = Number(document.getElementById('admin-tzs-input').value);
    db.paymentSettings.monthlyFeeUSD = Number(document.getElementById('admin-usd-input').value);
    saveData();
    alert('Global payment configurations saved!');
  });
}

function renderSuperAdminLogin(container) {
  container.innerHTML = `
    <div style="max-width: 400px; margin: 6rem auto; padding: 0 1.5rem;" class="animate-slide">
      <div class="glass-panel" style="padding: 2.5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <i data-lucide="lock" style="width: 48px; height: 48px; color: var(--color-primary); margin-bottom: 0.5rem;"></i>
          <h2>Platform Super Admin</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Access control parameters & billing config</p>
        </div>
        <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Admin Username</label>
            <input id="admin-user" type="text" class="input-field" required />
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Password</label>
            <input id="admin-pass" type="password" class="input-field" required />
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.4rem;">
              Credentials: super_admin / admin_password
            </span>
          </div>
          <div id="login-error-msg" style="color: var(--color-danger); font-size: 0.85rem; text-align: center; display:none;"></div>
          <button type="submit" class="btn btn-primary" style="justify-content: center; margin-top: 0.5rem;">Authenticate System</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('admin-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('admin-user').value;
    const p = document.getElementById('admin-pass').value;
    const hash = hashPassword(p);
    
    if (u === db.superAdmin.username && hash === '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918') {
      currentSession = { role: 'super' };
      router();
    } else {
      const errMsg = document.getElementById('login-error-msg');
      errMsg.innerText = 'Invalid administrator credentials.';
      errMsg.style.display = 'block';
    }
  });
}

// 4. Wholesaler Manager Dashboard
function renderManager(container) {
  if (!currentSession || currentSession.role !== 'manager') {
    renderManagerLogin(container);
    return;
  }

  const shop = db.businesses[currentSession.businessId];
  const isSubActive = checkSubscriptionStatus(shop);

  container.innerHTML = `
    <div style="padding: 2.5rem 1.5rem; max-width: 1200px; margin: 0 auto;" class="animate-fade">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 2rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="globe" style="color: ${shop.primaryColor || 'var(--color-primary)'}; width:28px; height:28px;"></i> 
            ${shop.shopName} Dashboard
          </h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Configure colors, manage products list, and verify payments status</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <a href="#/shop/${shop.id}" class="btn btn-secondary" target="_blank"><i data-lucide="eye"></i> View Storefront</a>
          <button id="manager-logout-btn" class="btn btn-secondary" style="color: var(--color-danger);"><i data-lucide="log-out"></i> Logout</button>
        </div>
      </div>

      <!-- Tab Switchers -->
      <div style="display: flex; gap: 1rem; border-bottom: 1px solid var(--border-light); margin-bottom: 2.5rem; padding-bottom: 0.5rem;">
        <button id="tab-profile-btn" class="btn ${activeManagerTab === 'profile' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.5rem 1.25rem; font-size: 0.9rem;">
          Branding & Customization
        </button>
        <button id="tab-products-btn" class="btn ${activeManagerTab === 'products' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.5rem 1.25rem; font-size: 0.9rem;">
          Products Catalog (${shop.products.length})
        </button>
        <button id="tab-billing-btn" class="btn ${activeManagerTab === 'billing' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.5rem 1.25rem; font-size: 0.9rem; border: ${!isSubActive ? '1px solid var(--color-danger)' : '1px solid var(--border-light)'};">
          ${!isSubActive ? '<span style="width: 8px; height: 8px; background: var(--color-danger); border-radius: 50%; display: inline-block; margin-right: 0.4rem;"></span>' : ''}
          Monthly Billing Status
        </button>
      </div>

      <div id="manager-tab-content">
        ${renderManagerTabContent(shop, isSubActive)}
      </div>
    </div>
  `;

  // Bind tab buttons
  document.getElementById('tab-profile-btn').addEventListener('click', () => { activeManagerTab = 'profile'; renderManager(container); });
  document.getElementById('tab-products-btn').addEventListener('click', () => { activeManagerTab = 'products'; renderManager(container); });
  document.getElementById('tab-billing-btn').addEventListener('click', () => { activeManagerTab = 'billing'; renderManager(container); });
  
  document.getElementById('manager-logout-btn').addEventListener('click', () => {
    currentSession = null;
    router();
  });

  // Bind inner Tab interactions
  bindManagerTabActions(container, shop);
}

function renderManagerTabContent(shop, isSubActive) {
  if (activeManagerTab === 'profile') {
    return `
      <div class="glass-panel animate-fade" style="padding: 2rem;">
        <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Branding Parameters & Styles</h2>
        <form id="profile-edit-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Company/Showroom Name</label>
              <input id="profile-name" type="text" value="${shop.shopName}" class="input-field" required />
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Showroom Description</label>
              <textarea id="profile-desc" class="input-field" style="height: 120px; resize: vertical;" required>${shop.description}</textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Primary Theme Color</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input id="profile-color-picker" type="color" value="${shop.primaryColor}" style="border: none; background: none; width: 42px; height: 42px; cursor: pointer;" />
                  <input id="profile-color-text" type="text" value="${shop.primaryColor}" class="input-field" style="flex: 1;" />
                </div>
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Showroom CSS Theme</label>
                <select id="profile-theme" class="input-field" style="height: 42px; background: #0b0f19; color: white;">
                  <option value="glass" ${shop.themeStyle === 'glass' ? 'selected' : ''}>Glassmorphic (Sleek)</option>
                  <option value="modern" ${shop.themeStyle === 'modern' ? 'selected' : ''}>Modern Flat</option>
                  <option value="classic" ${shop.themeStyle === 'classic' ? 'selected' : ''}>Classic Bordered</option>
                </select>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Company Location / Address</label>
              <input id="profile-address" type="text" value="${shop.locationName}" class="input-field" required />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Latitude Coords</label>
                <input id="profile-lat" type="number" step="0.000001" value="${shop.coordinates?.lat}" class="input-field" required />
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Longitude Coords</label>
                <input id="profile-lng" type="number" step="0.000001" value="${shop.coordinates?.lng}" class="input-field" required />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">WhatsApp Business Number</label>
                <input id="profile-wa" type="text" placeholder="+255..." value="${shop.whatsapp || ''}" class="input-field" />
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Contact Email</label>
                <input id="profile-email" type="email" value="${shop.email || ''}" class="input-field" />
              </div>
            </div>
            <button type="submit" class="btn btn-primary" style="justify-content: center; margin-top: auto; height: 48px;">
              Update Storefront Theme & Profile
            </button>
          </div>
        </form>
      </div>
    `;
  } else if (activeManagerTab === 'products') {
    return `
      <div style="display: grid; grid-template-columns: 1fr 400px; gap: 2.5rem; align-items: start;">
        <!-- Products Table -->
        <div class="glass-panel" style="padding: 2rem;">
          <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Current Showroom Products</h2>
          ${shop.products.length === 0 ? `
            <p style="color: var(--text-muted); text-align: center; padding: 2rem;">Your inventory is empty. Add products using the panel.</p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${shop.products.map(p => `
                <div class="glass-card" style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; padding: 1rem;">
                  <div style="display: flex; gap: 1rem; align-items: center;">
                    ${p.image ? `<img src="${p.image}" alt="" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px;" />` : `<div style="width:48px; height:48px; background:#111827; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#4b5563; font-size:0.7rem;">No Img</div>`}
                    <div>
                      <h4 style="font-size: 0.95rem;">${p.name}</h4>
                      <span style="font-size: 0.8rem; color: ${shop.primaryColor || 'var(--color-primary)'}; font-weight:700;">${p.price}</span>
                    </div>
                  </div>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-secondary manager-edit-prod-btn" data-id="${p.id}" style="padding: 0.4rem; border-radius:4px;"><i data-lucide="edit" style="width:14px; height:14px;"></i></button>
                    <button class="btn btn-secondary manager-delete-prod-btn" data-id="${p.id}" style="padding: 0.4rem; border-radius:4px; color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px; height:14px;"></i></button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Add/Edit form -->
        <div class="glass-panel" style="padding: 2rem;">
          <h3 style="font-size: 1.15rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="${editingProductId ? 'edit' : 'plus'}"></i> ${editingProductId ? 'Modify Product Details' : 'Upload New Product'}
          </h3>
          <form id="product-crud-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Product Name</label>
              <input id="prod-name" type="text" class="input-field" required />
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Pricing (e.g. 15,000 TZS)</label>
              <input id="prod-price" type="text" class="input-field" required />
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Detailed Specifications / Description</label>
              <textarea id="prod-desc" class="input-field" style="height: 90px; resize: vertical;" required></textarea>
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Product Image URL (Optional)</label>
              <input id="prod-image" type="url" placeholder="https://..." class="input-field" />
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">External Purchase Link (Optional)</label>
              <input id="prod-url" type="url" placeholder="https://..." class="input-field" />
            </div>

            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
              ${editingProductId ? `<button type="button" id="btn-cancel-edit-prod" class="btn btn-secondary" style="flex:1; justify-content:center;">Cancel</button>` : ''}
              <button type="submit" class="btn btn-primary" style="flex:2; justify-content:center;">${editingProductId ? 'Apply Modifications' : 'Publish Product'}</button>
            </div>
          </form>
        </div>
      </div>
    `;
  } else {
    // Billing Tab
    return `
      <div style="display: grid; grid-template-columns: 1fr 400px; gap: 2.5rem; align-items: start;">
        <div class="glass-panel" style="padding: 2rem;">
          <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Current Showroom Ad Account</h2>
          <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 2rem; background: rgba(255,255,255,0.01); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-light);">
            <i data-lucide="calendar" style="width:48px; height:48px; color: ${isSubActive ? 'var(--color-secondary)' : 'var(--color-danger)'};"></i>
            <div>
              <h3 style="font-size: 1.15rem;">Status: ${isSubActive ? 'Showroom Active' : 'Showroom Blocked / Unpaid'}</h3>
              <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
                Showroom ads visible until: <strong>${new Date(shop.adExpiry).toLocaleString()}</strong>
              </p>
            </div>
          </div>

          ${!isSubActive ? `
            <div class="glass-card" style="border-left: 3px solid var(--color-danger); margin-bottom: 1.5rem; background: rgba(239,68,68,0.05);">
              <h4 style="color: var(--color-danger); font-size: 0.95rem;">Subscription Expired</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; line-height: 1.4;">
                To comply with platform regulations, sub-websites must pay the monthly sponsorship charge of <strong>${db.paymentSettings.monthlyFeeTZS.toLocaleString()} TZS</strong> (or <strong>$${db.paymentSettings.monthlyFeeUSD} USD</strong>). Showcase lists and detail views will remain locked for customers until payment is completed.
              </p>
            </div>
          ` : ''}
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
            SAGURAmarket billing cycles are month-to-month. You can renew your subscription at any time to add 30 additional days of premium showroom visibility. Payments are processed securely via local mobile networks or card checkout.
          </p>
        </div>

        <div class="glass-panel" style="padding: 2rem;">
          <h3 style="font-size: 1.15rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="landmark"></i> Checkout Portal (1 Month)
          </h3>
          <form id="manager-payment-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Select Payment Method</label>
              <select id="checkout-gateway-select" class="input-field" style="background: #0b0f19; color: white; height: 42px;">
                ${db.paymentSettings.gateways.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
              </select>
            </div>

            <div class="glass-card" style="background: rgba(255,255,255,0.02);">
              <h4 style="font-size: 0.85rem; margin-bottom: 0.25rem;">Payment Instructions:</h4>
              <p id="gateway-detail-instruction" style="font-size: 0.95rem; font-weight: 600; color: var(--color-accent);">
                ${db.paymentSettings.gateways[0].detail}
              </p>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.5rem; line-height: 1.4;">
                Fee amount due: <strong>${db.paymentSettings.monthlyFeeTZS.toLocaleString()} TZS</strong> (or <strong>$${db.paymentSettings.monthlyFeeUSD} USD</strong>)
              </span>
            </div>

            <button type="submit" id="btn-complete-checkout" class="btn btn-primary" style="justify-content: center; height: 48px;">
              Complete Payment (${db.paymentSettings.monthlyFeeTZS.toLocaleString()} TZS)
            </button>
          </form>
        </div>
      </div>
    `;
  }
}

function bindManagerTabActions(container, shop) {
  if (activeManagerTab === 'profile') {
    // Sync picker and input hex text
    const colorPicker = document.getElementById('profile-color-picker');
    const colorText = document.getElementById('profile-color-text');
    colorPicker.addEventListener('input', (e) => { colorText.value = e.target.value; });
    colorText.addEventListener('input', (e) => { colorPicker.value = e.target.value; });

    // Profile form submit
    document.getElementById('profile-edit-form').addEventListener('submit', (e) => {
      e.preventDefault();
      shop.shopName = sanitizeHTML(document.getElementById('profile-name').value);
      shop.description = sanitizeHTML(document.getElementById('profile-desc').value);
      shop.primaryColor = colorText.value;
      shop.themeStyle = document.getElementById('profile-theme').value;
      shop.locationName = sanitizeHTML(document.getElementById('profile-address').value);
      shop.coordinates = {
        lat: Number(document.getElementById('profile-lat').value),
        lng: Number(document.getElementById('profile-lng').value)
      };
      shop.whatsapp = document.getElementById('profile-wa').value;
      shop.email = document.getElementById('profile-email').value;

      saveData();
      alert('Showroom branding updated!');
      renderManager(container);
    });
  } else if (activeManagerTab === 'products') {
    const nameInput = document.getElementById('prod-name');
    const priceInput = document.getElementById('prod-price');
    const descInput = document.getElementById('prod-desc');
    const imgInput = document.getElementById('prod-image');
    const urlInput = document.getElementById('prod-url');

    // Pre-fill form if editing
    if (editingProductId) {
      const prod = shop.products.find(p => p.id === editingProductId);
      if (prod) {
        nameInput.value = prod.name;
        priceInput.value = prod.price;
        descInput.value = prod.description;
        imgInput.value = prod.image || '';
        urlInput.value = prod.url || '';
      }
    }

    // Submit product form
    document.getElementById('product-crud-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (editingProductId) {
        shop.products = shop.products.map(p => 
          p.id === editingProductId 
            ? { 
                ...p, 
                name: sanitizeHTML(nameInput.value), 
                price: sanitizeHTML(priceInput.value), 
                description: sanitizeHTML(descInput.value), 
                image: imgInput.value, 
                url: urlInput.value 
              }
            : p
        );
        editingProductId = null;
      } else {
        const newProd = {
          id: `p_${Date.now()}`,
          name: sanitizeHTML(nameInput.value),
          price: sanitizeHTML(priceInput.value),
          description: sanitizeHTML(descInput.value),
          image: imgInput.value,
          url: urlInput.value
        };
        shop.products.push(newProd);
      }
      saveData();
      renderManager(container);
    });

    // Delete handlers
    document.querySelectorAll('.manager-delete-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Delete this product from your directory?')) return;
        const id = btn.dataset.id;
        shop.products = shop.products.filter(p => p.id !== id);
        saveData();
        renderManager(container);
      });
    });

    // Edit handlers
    document.querySelectorAll('.manager-edit-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        editingProductId = btn.dataset.id;
        renderManager(container);
      });
    });

    // Cancel edit
    const cancelBtn = document.getElementById('btn-cancel-edit-prod');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        editingProductId = null;
        renderManager(container);
      });
    }
  } else if (activeManagerTab === 'billing') {
    const gatewaySelect = document.getElementById('checkout-gateway-select');
    const gatewayInstruction = document.getElementById('gateway-detail-instruction');
    
    // Gateway selection dynamic label update
    gatewaySelect.addEventListener('change', (e) => {
      const selected = db.paymentSettings.gateways.find(g => g.id === e.target.value);
      if (selected) {
        gatewayInstruction.innerText = selected.detail;
      }
    });

    // Simulation checkout
    document.getElementById('manager-payment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const checkoutBtn = document.getElementById('btn-complete-checkout');
      checkoutBtn.disabled = true;
      checkoutBtn.innerText = 'Authorizing payment transaction...';

      setTimeout(() => {
        const currentExpiry = new Date(shop.adExpiry);
        const today = new Date();
        const baseDate = currentExpiry > today ? currentExpiry : today;
        baseDate.setDate(baseDate.getDate() + 30);

        shop.adExpiry = baseDate.toISOString();
        shop.adPaid = true;
        
        saveData();
        alert('Payment confirmed! Showroom visibility extended by 30 days.');
        renderManager(container);
      }, 2000);
    });
  }
}

function renderManagerLogin(container) {
  container.innerHTML = `
    <div style="max-width: 400px; margin: 6rem auto; padding: 0 1.5rem;" class="animate-slide">
      <div class="glass-panel" style="padding: 2.5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <i data-lucide="settings" style="width: 48px; height: 48px; color: var(--color-secondary); margin-bottom: 0.5rem;"></i>
          <h2>Market Manager Login</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Customize your business sub-website & items</p>
        </div>
        <form id="manager-login-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Wholesaler Username</label>
            <input id="manager-user" type="text" class="input-field" required />
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;">Password</label>
            <input id="manager-pass" type="password" class="input-field" required />
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.4rem;">
              Credentials: global_manager / password <br />Or: kili_manager / password (demo expired)
            </span>
          </div>
          <div id="manager-login-error" style="color: var(--color-danger); font-size: 0.85rem; text-align: center; display:none;"></div>
          <button type="submit" class="btn btn-primary" style="justify-content: center; margin-top: 0.5rem;">Access Dashboard</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('manager-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('manager-user').value;
    const p = document.getElementById('manager-pass').value;
    const hash = hashPassword(p);
    
    const targetShop = Object.values(db.businesses).find(
      (b) => b.username === u && b.passwordHash === hash
    );

    if (targetShop) {
      currentSession = { role: 'manager', businessId: targetShop.id };
      activeManagerTab = 'profile'; // Reset tab
      editingProductId = null; // Clear edit pointer
      router();
    } else {
      const errMsg = document.getElementById('manager-login-error');
      errMsg.innerText = 'Invalid business manager credentials.';
      errMsg.style.display = 'block';
    }
  });
}
