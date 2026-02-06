// State
const state = {
    artworks: [],
    posts: [],
    products: [],
    testimonials: [],
    filter: 'all',
    currentImageIndex: 0,
    filteredArtworks: [] // For modal navigation within filtered context
};

// DOM Elements
const sections = document.querySelectorAll('.page-section');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenuBtn = document.querySelector('.close-menu');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupNavigation();
    setupTheme();
    setupMobileMenu();
    setupBackToTop();
    setupImageLazyLoading();
    setupScrollProgress();
    setupStatsCounter();
    setupViewToggle();
    setupFavorites();
    setupNewsletter();
    setupKonamiCode();
    setupChatbot();
    setupSearch();
    setupKeyboardShortcuts();
});

// Back to Top Button
function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced Image Lazy Loading
function setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
        
        // Observer will be applied to dynamically loaded images
        state.imageObserver = imageObserver;
    }
}

// Data Loading
async function loadData() {
    const spinner = document.getElementById('loading-spinner');
    
    try {
        const [artRes, postRes, prodRes, testRes] = await Promise.all([
            fetch('./data/artworks.json'),
            fetch('./data/posts.json'),
            fetch('./data/products.json'),
            fetch('./data/testimonials.json')
        ]);

        if (!artRes.ok || !postRes.ok || !prodRes.ok) {
            throw new Error('Failed to fetch data');
        }

        state.artworks = await artRes.json();
        state.posts = await postRes.json();
        state.products = await prodRes.json();
        state.testimonials = testRes.ok ? await testRes.json() : [];

        // Initial Renders
        renderLatestWorks();
        renderGallery();
        renderDevlog();
        renderStore();
        renderTestimonials();
        
        // Handle initial hash
        handleHashChange();
        
        // Hide loading spinner
        setTimeout(() => {
            spinner.style.opacity = '0';
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 300);
        }, 500);

    } catch (error) {
        console.error('Error loading data:', error);
        spinner.innerHTML = '<div class="error-message" style="color: white; font-family: var(--font-heading); font-size: 2rem;">⚠️ ERROR LOADING DATA<br><small style="font-size: 1rem;">Please refresh the page</small></div>';
    }
}

// Navigation & Routing
function setupNavigation() {
    window.addEventListener('hashchange', handleHashChange);
}

function handleHashChange() {
    const hash = window.location.hash || '#home';
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === hash);
    });

    // Show section
    sections.forEach(section => {
        if (`#${section.id}` === hash) {
            section.classList.add('active');
            window.scrollTo(0, 0); // Scroll top on nav
        } else {
            section.classList.remove('active');
        }
    });

    // Close mobile menu if open
    mobileMenu.classList.remove('open');
}

// Home Section
function renderLatestWorks() {
    const container = document.getElementById('latest-grid');
    // Get last 3
    const latest = state.artworks.slice(0, 3);
    
    container.innerHTML = latest.map(art => `
        <div class="artwork-item" onclick="openModal('${art.id}')">
            <img src="${art.image}" alt="${art.title}" loading="lazy">
            <div class="artwork-overlay">
                <h3>${art.title}</h3>
            </div>
        </div>
    `).join('');
}

// Gallery Section
function renderGallery() {
    const container = document.getElementById('gallery-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Filter Logic (including favorites)
    if (state.filter === 'favorites') {
        const favorites = JSON.parse(localStorage.getItem('artworkFavorites') || '[]');
        state.filteredArtworks = state.artworks.filter(art => favorites.includes(art.id));
    } else {
        state.filteredArtworks = state.filter === 'all' 
            ? state.artworks 
            : state.artworks.filter(art => art.categories.includes(state.filter));
    }

    container.innerHTML = state.filteredArtworks.map(art => `
        <div class="artwork-item" onclick="openModal('${art.id}')">
            <button class="favorite-btn ${window.isFavorited && window.isFavorited(art.id) ? 'favorited' : ''}" 
                    onclick="toggleFavorite('${art.id}', event)" 
                    aria-label="Toggle favorite">
                ${window.isFavorited && window.isFavorited(art.id) ? '❤️' : '🤍'}
            </button>
            <img src="${art.image}" alt="${art.title}" loading="lazy">
            <div class="artwork-overlay">
                <h3>${art.title}</h3>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">${art.description ? art.description.substring(0, 60) + '...' : ''}</p>
            </div>
        </div>
    `).join('');

    // Setup filter listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update filter
            state.filter = e.target.dataset.filter;
            renderGallery();
        });
    });
}

// Devlog Section
function renderDevlog() {
    const container = document.getElementById('posts-list');
    container.innerHTML = state.posts.map(post => `
        <article class="post-card">
            <div class="post-date">${post.date}</div>
            <h3>${post.title}</h3>
            <div class="post-content">
                ${markedLikeParser(post.content)}
            </div>
        </article>
    `).join('');
}

// Simple Markdown Parser (for bold, newlines, lists)
function markedLikeParser(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n\n/g, '<br><br>') // Paragraphs
        .replace(/\n/g, '<br>'); // Line breaks
}

// Store Section
function renderStore() {
    const container = document.getElementById('products-grid');
    container.innerHTML = state.products.map(prod => `
        <div class="product-card">
            <img src="${prod.image}" alt="${prod.name}" loading="lazy">
            <div class="product-info">
                <h3>${prod.name}</h3>
                <span class="price">${prod.price}</span>
                <a href="${prod.link}" class="btn" style="margin-top:10px; display:block; text-align:center">Buy Now</a>
            </div>
        </div>
    `).join('');
}

// Modal Logic
const modal = document.getElementById('artwork-modal');
const modalDetails = {
    img: document.getElementById('modal-image'),
    title: document.getElementById('modal-title'),
    date: document.getElementById('modal-date'),
    tools: document.getElementById('modal-tools'),
    desc: document.getElementById('modal-desc'),
    tags: document.getElementById('modal-tags')
};

window.openModal = function(id) {
    // Find artwork in current filtered context if possible, or global
    // Using filtered list allows navigation to respect current view
    let index = state.filteredArtworks.findIndex(a => a.id === id);
    if (index === -1) {
        // Fallback to searching globally (e.g. from home page)
        index = state.artworks.findIndex(a => a.id === id);
        // If opened from home, we might want to navigate through all artworks
        // or just accept we're viewing one. 
        // For simplicity, if not in current filter, we switch context temporarily to global for nav
        if (!state.filteredArtworks.find(a => a.id === id)) {
             // If opened from Home, we can decide to navigate through ALL or just Last 3.
             // Let's navigate through ALL for better UX.
             state.filteredArtworks = state.artworks; 
             index = state.artworks.findIndex(a => a.id === id);
        }
    }

    state.currentImageIndex = index;
    updateModalContent();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent scrolling bg
}

function updateModalContent() {
    const art = state.filteredArtworks[state.currentImageIndex];
    if (!art) return;

    modalDetails.img.src = art.image;
    modalDetails.img.alt = art.title;
    modalDetails.title.textContent = art.title;
    modalDetails.date.textContent = art.date;
    modalDetails.tools.textContent = art.tools ? art.tools.join(', ') : '';
    modalDetails.desc.textContent = art.description;
    
    // Manga-style tags with varied colors
    const tagColors = ['#ff1744', '#00e5ff', '#ffd600', '#7c4dff', '#00e676'];
    modalDetails.tags.innerHTML = art.categories.map((cat, i) => 
        `<span style="background:${tagColors[i % tagColors.length]}; color:white; padding:4px 12px; border:2px solid black; font-size:0.8rem; margin-right:5px; font-weight:700; text-transform:uppercase; display:inline-block; margin-bottom:5px;">#${cat}</span>`
    ).join('');
    
    // Share button
    const shareBtn = document.getElementById('share-artwork');
    shareBtn.onclick = () => shareArtwork(art);
}

function shareArtwork(art) {
    if (navigator.share) {
        navigator.share({
            title: art.title,
            text: art.description,
            url: window.location.href + '#artwork-' + art.id
        }).catch(() => {});
    } else {
        // Fallback: copy to clipboard
        const url = window.location.href.split('#')[0] + '#artwork-' + art.id;
        navigator.clipboard.writeText(url).then(() => {
            alert('🔗 Link copied to clipboard!');
        });
    }
}

function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Modal Event Listeners
document.querySelector('.close-modal').addEventListener('click', closeModal);
document.querySelector('.prev-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.currentImageIndex > 0) {
        state.currentImageIndex--;
        updateModalContent();
    }
});
document.querySelector('.next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.currentImageIndex < state.filteredArtworks.length - 1) {
        state.currentImageIndex++;
        updateModalContent();
    }
});
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && state.currentImageIndex > 0) {
        state.currentImageIndex--;
        updateModalContent();
    }
    if (e.key === 'ArrowRight' && state.currentImageIndex < state.filteredArtworks.length - 1) {
        state.currentImageIndex++;
        updateModalContent();
    }
});

// Theme Toggle
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });
}

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Mobile Menu
function setupMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
    });
    
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('open');
        }
    });
}

// Scroll Progress Bar
function setupScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Animated Stats Counter
function setupStatsCounter() {
    const stats = document.querySelectorAll('.stat-card');
    if (stats.length === 0) return;
    let animated = false;
    
    const animateStats = () => {
        if (animated) return;
        
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;
        const rect = statsSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight * 0.8) {
            animated = true;
            
            stats.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                const numberEl = stat.querySelector('.stat-number');
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateNumber = () => {
                    current += increment;
                    if (current < target) {
                        numberEl.textContent = Math.floor(current);
                        requestAnimationFrame(updateNumber);
                    } else {
                        numberEl.textContent = target + '+';
                    }
                };
                
                updateNumber();
            });
        }
    };
    
    window.addEventListener('scroll', animateStats);
    animateStats();
}

// View Toggle (Grid/List)
function setupViewToggle() {
    const toggleBtns = document.querySelectorAll('.view-toggle[data-view]');
    const gallery = document.getElementById('gallery-grid');
    if (!gallery) return;
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (view === 'list') {
                gallery.classList.add('list-view');
                gallery.style.columns = '1';
            } else {
                gallery.classList.remove('list-view');
                gallery.style.columns = '';
            }
        });
    });
}

// Favorites System
function setupFavorites() {
    let favorites = JSON.parse(localStorage.getItem('artworkFavorites') || '[]');
    
    const updateFavCount = () => {
        const countEl = document.querySelector('.fav-count');
        if (countEl) countEl.textContent = favorites.length;
    };
    
    window.toggleFavorite = function(id, event) {
        event.stopPropagation();
        
        if (favorites.includes(id)) {
            favorites = favorites.filter(fav => fav !== id);
        } else {
            favorites.push(id);
        }
        
        localStorage.setItem('artworkFavorites', JSON.stringify(favorites));
        updateFavCount();
        renderGallery();
    };
    
    window.isFavorited = function(id) {
        return favorites.includes(id);
    };
    
    const favBtn = document.getElementById('show-favorites');
    if (favBtn) {
        favBtn.addEventListener('click', () => {
            state.filter = 'favorites';
            renderGallery();
        });
    }
    
    updateFavCount();
}

// Newsletter
function setupNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input').value;
        alert(`✨ Thanks for subscribing!\\n\\nEmail: ${email}\\n\\nNote: Demo only. In production, integrate with Mailchimp/ConvertKit.`);
        form.reset();
    });
}

// Konami Code
function setupKonamiCode() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let position = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === code[position]) {
            position++;
            if (position === code.length) {
                activateEasterEgg();
                position = 0;
            }
        } else {
            position = 0;
        }
    });
}

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s infinite';
    const style = document.createElement('style');
    style.textContent = '@keyframes rainbow { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }';
    document.head.appendChild(style);
    setTimeout(() => { document.body.style.animation = ''; style.remove(); }, 5000);
    alert('🎮 KONAMI CODE! 🌈\\n\\nYou found the secret!');
}
// Chatbot Assistant
let chatbotData = null;

async function setupChatbot() {
    // Load chatbot knowledge base
    try {
        const response = await fetch('./data/chatbot.json');
        chatbotData = await response.json();
    } catch (error) {
        console.error('Failed to load chatbot data:', error);
        return;
    }

    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const chatClose = document.querySelector('.chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle chat
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.toggle('open');
        if (chatWidget.classList.contains('open')) {
            chatInput.focus();
            chatToggle.style.display = 'none';
        }
    });

    chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('open');
        chatToggle.style.display = 'block';
    });

    // Handle messages
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        showTyping();

        // Get bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            removeTyping();
            addMessage(response, 'bot');
        }, 800 + Math.random() * 700); // Random delay for realism
    });
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-indicator-msg';
    typingDiv.innerHTML = `
        <div class="message-bubble typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.querySelector('.typing-indicator-msg');
    if (typing) typing.remove();
}

function getBotResponse(message) {
    if (!chatbotData) return "Sorry, I'm having trouble right now. Try again later!";
    
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (chatbotData.greetings.some(greeting => lowerMessage.includes(greeting))) {
        return "👋 Hello! How can I help you today? Ask me about commissions, my tools, or anything else!";
    }
    
    // Check for thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "😊 You're welcome! Let me know if you have any other questions!";
    }
    
    // Search for matching response
    for (const response of chatbotData.responses) {
        if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
            return response.answer;
        }
    }
    
    // Fallback responses
    const randomFallback = chatbotData.fallback[Math.floor(Math.random() * chatbotData.fallback.length)];
    return randomFallback;
}

// Testimonials
function renderTestimonials() {
    const container = document.getElementById('testimonials-grid');
    if (!container || !state.testimonials.length) return;
    
    container.innerHTML = state.testimonials.map(testimonial => `
        <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
                <div class="testimonial-info">
                    <h4>${testimonial.name}</h4>
                    <p class="testimonial-role">${testimonial.role}</p>
                </div>
            </div>
            <div class="testimonial-rating">${'⭐'.repeat(testimonial.rating)}</div>
            <p class="testimonial-comment">"${testimonial.comment}"</p>
            <span class="testimonial-project">${testimonial.project}</span>
        </div>
    `).join('');
}

// Real-time Search
function setupSearch() {
    const searchInput = document.getElementById('gallery-search');
    const searchCount = document.getElementById('search-count');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            state.filter = 'all';
            renderGallery();
            if (searchCount) searchCount.textContent = '';
            return;
        }
        
        state.filteredArtworks = state.artworks.filter(art => 
            art.title.toLowerCase().includes(query) ||
            art.description.toLowerCase().includes(query) ||
            art.categories.some(cat => cat.toLowerCase().includes(query))
        );
        
        const container = document.getElementById('gallery-grid');
        container.innerHTML = state.filteredArtworks.map(art => `
            <div class="artwork-item" onclick="openModal('${art.id}')">
                <button class="favorite-btn ${window.isFavorited && window.isFavorited(art.id) ? 'favorited' : ''}" 
                        onclick="toggleFavorite('${art.id}', event)" 
                        aria-label="Toggle favorite">
                    ${window.isFavorited && window.isFavorited(art.id) ? '❤️' : '🤍'}
                </button>
                <img src="${art.image}" alt="${art.title}" loading="lazy">
                <div class="artwork-overlay">
                    <h3>${art.title}</h3>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">${art.description ? art.description.substring(0, 60) + '...' : ''}</p>
                </div>
            </div>
        `).join('');
        
        if (searchCount) searchCount.textContent = `${state.filteredArtworks.length} found`;
    });
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    const shortcutsToggle = document.getElementById('shortcuts-toggle');
    const shortcutsModal = document.getElementById('shortcuts-modal');
    const closeShortcuts = document.querySelector('.close-shortcuts');
    
    if (!shortcutsToggle) return;
    
    shortcutsToggle.addEventListener('click', () => {
        shortcutsModal.classList.add('open');
    });
    
    closeShortcuts.addEventListener('click', () => {
        shortcutsModal.classList.remove('open');
    });
    
    shortcutsModal.addEventListener('click', (e) => {
        if (e.target === shortcutsModal) {
            shortcutsModal.classList.remove('open');
        }
    });
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            if (e.key === 'Escape') {
                e.target.blur();
            }
            return;
        }
        
        switch(e.key.toLowerCase()) {
            case 'h':
                window.location.hash = '#home';
                break;
            case 'g':
                window.location.hash = '#gallery';
                break;
            case 'a':
                window.location.hash = '#about';
                break;
            case 's':
                window.location.hash = '#store';
                break;
            case 'd':
                document.getElementById('theme-toggle').click();
                break;
            case '/':
                e.preventDefault();
                document.getElementById('gallery-search')?.focus();
                break;
            case '?':
                shortcutsModal.classList.toggle('open');
                break;
            case 'escape':
                shortcutsModal.classList.remove('open');
                break;
        }
    });
}
