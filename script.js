// Gallery and artwork management
let artworkData = [];
let currentFilter = 'all';
let currentLightboxIndex = 0;

// Load artwork data from JSON
async function loadArtwork() {
    try {
        const response = await fetch('artwork.json');
        if (!response.ok) {
            throw new Error('Failed to load artwork data');
        }
        artworkData = await response.json();
        displayGallery(artworkData);
    } catch (error) {
        console.error('Error loading artwork:', error);
        displayErrorMessage();
    }
}

// Display error message if artwork fails to load
function displayErrorMessage() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <p style="color: #718096; font-size: 1.1rem;">
                Unable to load artwork. Please make sure artwork.json exists.
            </p>
        </div>
    `;
}

// Display gallery items
function displayGallery(artwork) {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';

    if (artwork.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p style="color: #718096; font-size: 1.1rem;">No artwork found.</p>
            </div>
        `;
        return;
    }

    artwork.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.category = item.category;
        galleryItem.dataset.index = index;

        galleryItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="gallery-item-info">
                <h3 class="gallery-item-title">${item.title}</h3>
                <span class="gallery-item-category">${item.category}</span>
            </div>
        `;

        galleryItem.addEventListener('click', () => openLightbox(index));
        galleryGrid.appendChild(galleryItem);
    });
}

// Filter gallery by category
function filterGallery(category) {
    currentFilter = category;
    const items = document.querySelectorAll('.gallery-item');

    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter gallery
            const filter = button.dataset.filter;
            filterGallery(filter);
        });
    });
}

// Lightbox functionality
function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const artwork = artworkData[index];

    document.getElementById('lightboxImage').src = artwork.image;
    document.getElementById('lightboxImage').alt = artwork.title;
    document.getElementById('lightboxTitle').textContent = artwork.title;
    document.getElementById('lightboxDescription').textContent = artwork.description;
    document.getElementById('lightboxDate').textContent = artwork.date;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function navigateLightbox(direction) {
    // Filter visible items based on current filter
    const visibleItems = artworkData.filter(item => 
        currentFilter === 'all' || item.category === currentFilter
    );
    
    if (visibleItems.length === 0) return;

    // Find current item in visible items
    const currentVisibleIndex = visibleItems.findIndex(item => 
        item === artworkData[currentLightboxIndex]
    );

    let newVisibleIndex = currentVisibleIndex + direction;

    // Wrap around
    if (newVisibleIndex < 0) {
        newVisibleIndex = visibleItems.length - 1;
    } else if (newVisibleIndex >= visibleItems.length) {
        newVisibleIndex = 0;
    }

    // Find the actual index in artworkData
    const newItem = visibleItems[newVisibleIndex];
    const newIndex = artworkData.findIndex(item => item === newItem);

    openLightbox(newIndex);
}

// Setup lightbox controls
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });
}

// Smooth scroll for navigation links
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadArtwork();
    setupFilters();
    setupLightbox();
    setupSmoothScroll();
});
