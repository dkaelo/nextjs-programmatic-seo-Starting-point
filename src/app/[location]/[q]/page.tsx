import Header from "@/components/Header";
import RestaurantItem from "@/components/RestaurantItem";
import { getAllTags, locations, searchRestaurants } from "@/data/restaurants";
import { Metadata } from "next";
import { cache } from "react";

interface PageProps {
    params: Promise<{ location: string, q: string}>
}


export const revalidate = 86400; // Revalidate every 24 hours

export async function generateStaticParams() {
    const allTags = await getAllTags(
        { 
            //If there are more pages, you can limit the render to a subset at compile-time. The rest will rendered and cached at first access.
            // limit: 10
        }
    );
    
    return allTags.map(tag => locations.map(location => ({
        location, q:tag
    }))).flat();
}

const getRestaurants = cache(searchRestaurants);

export async function generateMetadata( {params} : PageProps ): Promise<Metadata> {
    const qDecoded = decodeURIComponent((await params).q);
    const locationDecoded = decodeURIComponent((await params).location);

    const results = await getRestaurants(qDecoded, locationDecoded);

    return {
        title: `Top ${results.length} ${qDecoded} near ${locationDecoded} - Updated ${new Date().getFullYear()}`,
        description: `Find the Best ${qDecoded} restaurants near ${locationDecoded}. Discover top-rated places to eat, drink, and enjoy local cuisine.`,
    };
}

export default async function Page({params}: PageProps){
    const{q, location} = await params;
    
    const qDecoded = decodeURIComponent(q);
    const locationDecoded = decodeURIComponent(location);

    const results = await getRestaurants(qDecoded, locationDecoded);

    return <div>
        <Header q={qDecoded} location={locationDecoded} />
        
        <main className="container mx-auto space-y 9 px-4 py-8">
            <h1 className="container mx-auto text-3xl font-bold">
                Top {results.length} {qDecoded} near {locationDecoded}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map(restaurant => (
                        <RestaurantItem key={restaurant.id} restaurant={restaurant} />
                    ))}
                </div>
        </main>
    </div>
}