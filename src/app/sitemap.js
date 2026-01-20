import { locations } from '../lib/locations';

export default function sitemap() {
    const baseUrl = 'https://kuryebu.com';

    // Static pages
    const routes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
    ];

    // Generate District URLs
    locations.forEach((loc) => {
        routes.push({
            url: `${baseUrl}/istanbul/${loc.district}-kurye`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        });

        // Generate Neighborhood URLs
        loc.neighborhoods.forEach((n) => {
            routes.push({
                url: `${baseUrl}/istanbul/${loc.district}-${n}-kurye`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        });
    });

    return routes;
}
