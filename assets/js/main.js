// --- 1. Gestion du Menu Mobile (Hamburger) ---
const btn = document.getElementById('mobile-menu-button');
const menu = document.getElementById('mobile-menu');
const links = menu ? menu.querySelectorAll('a') : [];

if (btn && menu) {
    btn.addEventListener('click', () => {
        // Optimisation : on décale l'écriture DOM au prochain paint
        requestAnimationFrame(() => {
            menu.classList.toggle('hidden');
        });
    });

    links.forEach(l => {
        l.addEventListener('click', () => {
            requestAnimationFrame(() => {
                menu.classList.add('hidden');
            });
        });
    });
}

// --- 2. Défilement Doux (Smooth Scroll) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            // Le scroll force un calcul de layout, on le place dans rAF
            requestAnimationFrame(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
});

// --- 3. Lightbox (Zoom Photos & Carousel) ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const triggers = document.querySelectorAll('.lightbox-trigger img');

let currentIndex = 0;
const imagesArray = Array.from(triggers);

if (lightbox && lightboxImg && lightboxClose) {
    const updateLightboxImage = (index) => {
        if (index < 0) index = imagesArray.length - 1;
        if (index >= imagesArray.length) index = 0;
        currentIndex = index;
        const img = imagesArray[currentIndex];
        const fullSizeSrc = img.getAttribute('data-full') || img.src;
        
        requestAnimationFrame(() => {
            lightboxImg.src = fullSizeSrc;
        });
    };

    // Ouvrir la lightbox
    imagesArray.forEach((img, index) => {
        img.parentElement.addEventListener('click', () => {
            currentIndex = index;
            const fullSizeSrc = img.getAttribute('data-full') || img.src;

            // Écriture (Write) dans rAF
            requestAnimationFrame(() => {
                lightboxImg.src = fullSizeSrc;
                lightbox.classList.remove('hidden');
            });
        });
    });

    // Fermer la lightbox
    const closeLightbox = () => {
        requestAnimationFrame(() => {
            lightbox.classList.add('hidden');
            // Petit délai pour nettoyer la source après la fermeture visuelle si besoin
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        });
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    if (lightboxPrev && lightboxNext) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            updateLightboxImage(currentIndex - 1);
        });
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            updateLightboxImage(currentIndex + 1);
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                updateLightboxImage(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                updateLightboxImage(currentIndex + 1);
            }
        }
    });
}
