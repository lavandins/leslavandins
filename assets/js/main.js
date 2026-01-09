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

// --- 3. Lightbox (Zoom Photos) ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const triggers = document.querySelectorAll('.lightbox-trigger img');

if (lightbox && lightboxImg && lightboxClose) {
    // Ouvrir la lightbox
    triggers.forEach(img => {
        img.parentElement.addEventListener('click', () => {
            // Lecture (Read)
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

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
}
