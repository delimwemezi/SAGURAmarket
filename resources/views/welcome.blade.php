<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('logo.svg') }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>SAGURAmarket | Wholesaler Platform & B2B Showroom</title>
    <meta name="description" content="Discover large wholesalers, custom business sub-websites, product image showrooms, and live pricing. Install the SAGURAmarket app directly to your device." />
    <meta name="theme-color" content="#0f172a" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <!-- App Styles -->
    <link rel="stylesheet" href="{{ asset('styles/index.css') }}" />

    <!-- PWA Manifest -->
    <link rel="manifest" href="{{ asset('manifest.json') }}" />
</head>
<body>
    <div class="app-container">
        <!-- Navbar -->
        <nav class="navbar" id="platform-navbar">
            <a href="#/" class="logo-container">
                <i data-lucide="store" class="logo-highlight" style="width: 32px; height: 32px;"></i>
                <span class="logo-text">SAGURA<span class="logo-highlight">market</span></span>
            </a>
            <div class="nav-links">
                <a href="#/" class="nav-link active" id="nav-find-shops">Find Shops</a>
                <a href="#/dashboard" class="btn btn-secondary" id="nav-manager">
                    <i data-lucide="layers" style="width: 16px; height: 16px;"></i> Manager Panel
                </a>
                <a href="#/super-admin" class="btn btn-secondary" id="nav-admin">
                    <i data-lucide="shield-alert" style="width: 16px; height: 16px;"></i> Super Admin
                </a>
            </div>
        </nav>

        <!-- Dynamic Content -->
        <main class="main-content" id="app-viewport"></main>

        <!-- Install Banner -->
        <div id="install-banner" class="install-banner glass-panel animate-slide" style="display: block;">
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem;">
                <i data-lucide="download" style="width: 32px; height: 32px; color: var(--color-primary);"></i>
                <div>
                    <h4 style="font-size: 1.05rem;">Download SAGURAmarket App</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                        Access wholesale products and manage showrooms offline with faster performance.
                    </p>
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button id="btn-install-later" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                    Later
                </button>
                <button id="btn-install-now" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                    Install App
                </button>
            </div>
        </div>
    </div>

    <!-- App Logic -->
    <script src="{{ asset('app.js') }}"></script>

    <!-- Service Worker -->
    <script>
        if ('serviceWorker' in navigator && location.protocol !== 'file:') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('{{ asset('sw.js') }}')
                    .then(reg => console.log('Service worker registered successfully', reg.scope))
                    .catch(err => console.error('Service worker registration failed', err));
            });
        }
    </script>
</body>
</html>
