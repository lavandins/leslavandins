importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.0/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);

    // ==================================================================
    // 1. STRATÉGIE POUR LES PAGES HTML (Documents)
    // ==================================================================
    // Utilise NetworkFirst : on essaie d'avoir la version la plus récente du réseau.
    // Si hors ligne ou réseau lent, on sert la version en cache.
    // Idéal pour le contenu qui change souvent (articles, mises à jour prix/dispo).
    workbox.routing.registerRoute(
        ({ request }) => request.mode === 'navigate',
        new workbox.strategies.NetworkFirst({
            cacheName: 'pages-cache',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 50,             // Ne garde que les 50 dernières pages visitées
                    maxAgeSeconds: 30 * 24 * 60 * 60, // Expire après 30 jours
                }),
            ],
        })
    );

    // ==================================================================
    // 2. STRATÉGIE POUR LES RESSOURCES STATIQUES (JS, CSS, Images, Fonts)
    // ==================================================================
    // Utilise CacheFirst : on sert le cache immédiatement pour la vitesse.
    // On ne va sur le réseau que si le fichier n'est pas en cache.
    // Idéal pour les fichiers qui changent rarement (assets versionnés ou immuables).
    workbox.routing.registerRoute(
        ({ request }) => ['style', 'script', 'worker', 'image', 'font'].includes(request.destination),
        new workbox.strategies.CacheFirst({
            cacheName: 'assets-cache',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 60,             // Limite à 60 fichiers
                    maxAgeSeconds: 30 * 24 * 60 * 60, // Expire après 30 jours
                }),
            ],
        })
    );

} else {
    console.log(`Boo! Workbox didn't load 😬`);
}
