// --- 1. Gestion du Menu Mobile (Hamburger) ---
const btn = document.getElementById('mobile-menu-button');
const menu = document.getElementById('mobile-menu');
const links = menu.querySelectorAll('a');

if (btn && menu) {
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    links.forEach(l => {
        l.addEventListener('click', () => menu.classList.add('hidden'));
    });
}

// --- 2. Défilement Doux (Smooth Scroll) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// --- 3. Lightbox (Zoom Photos) ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const triggers = document.querySelectorAll('.lightbox-trigger img'); // On cible les images qui ont cette classe parente

if (lightbox && lightboxImg && lightboxClose) {
    // Ouvrir la lightbox au clic sur une image
    triggers.forEach(img => {
        img.parentElement.addEventListener('click', () => {
            // On récupère l'URL haute qualité (data-full) ou à défaut la source normale
            const fullSizeSrc = img.getAttribute('data-full') || img.src;
            lightboxImg.src = fullSizeSrc;
            lightbox.classList.remove('hidden');
        });
    });

    // Fermer la lightbox
    const closeLightbox = () => {
        lightbox.classList.add('hidden');
        lightboxImg.src = ''; // Nettoyer la source
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Fermer en cliquant en dehors de l'image (sur le fond noir)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Fermer avec la touche Echap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
}
