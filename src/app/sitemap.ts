import { getAllTags, locations } from "@/data/restaurants";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const allTags = await getAllTags();

    const searchLandingPages: MetadataRoute.Sitemap = allTags.map(tag => 
        locations.map(location => ({
            url: `${baseUrl}/${location}/${tag}`,
            lastModidified: new Date(),
            changFrequency: "weekly",
            priority: 1,
        }))
    ).flat();
    
    return [
        // Insert your other pages:
        {
            url: `${baseUrl}/about`,
            lastModified: "2025-12-31",
            changeFrequency: "yearly",
            priority: 0.5

        },
        // Our programtic SEO pages
        ...searchLandingPages,

    ]
}