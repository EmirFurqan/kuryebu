import HomeTemplate from '../../../components/HomeTemplate';
import { locations, getNeighborhoodName } from '../../../lib/locations';

// Generate static params for all possible location combinations
export async function generateStaticParams() {
    const params = [];

    locations.forEach((loc) => {
        // District Only: /istanbul/fatih-kurye
        params.push({ slug: `${loc.district}-kurye` });

        // Neighborhoods: /istanbul/fatih-aksaray-kurye
        loc.neighborhoods.forEach((n) => {
            params.push({ slug: `${loc.district}-${n}-kurye` });
        });
    });

    return params;
}

export async function generateMetadata({ params }) {
    const { slug } = await params;

    // Format slug to readable title
    // e.g. "fatih-aksaray-kurye" -> "Fatih Aksaray Kurye"
    const words = slug.split('-');

    // Try to find if it matches a district or neighborhood logic
    let title = words
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    // Optimize title for "Fatih Aksaray Kurye" style
    // We want it to be exactly what the user asked: "Fatih Aksaray Kurye | Kurye Bu"
    // The slug extraction above does exactly that: "Fatih" "Aksaray" "Kurye"

    return {
        title: `${title} | Kurye Bul`,
        description: `${title} hizmeti için en hızlı çözüm. 30 dakikada kapınızda!`,
        alternates: {
            canonical: `https://kuryebu.com/istanbul/${slug}`
        }
    };
}

export default function LocationPage() {
    return <HomeTemplate />;
}
