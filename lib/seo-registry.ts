/**
 * SEO_OVERRIDES
 * Clear code structure for manual SEO optimization in English (EN) and Vietnamese (VI).
 * 
 * If a slug or ID exists here, the website will use these values for <title> and <meta description>
 * instead of the automated translations from the database.
 */

export const SEO_OVERRIDES: Record<string, any> = {
    // Example for a specific product/plan slug
    "kimono-premium-01": {
        vi: {
            title: "Thuê Kimono Cao Cấp Kyoto - Mẫu Đẹp 2024",
            description: "Dịch vụ cho thuê Kimono cao cấp nhất Kyoto. Nhiều mẫu mã đa dạng, hỗ trợ chụp ảnh chuyên nghiệp."
        },
        en: {
            title: "Rent Premium Kimono in Kyoto | Top Styles 2024",
            description: "Experience authentic Japanese Kimono in the heart of Gion, Kyoto. Wide range of authentic styles and professional photography."
        }
    },

    // Example for a specific category
    "wedding-kimono": {
        vi: {
            title: "Thuê Kimono Cưới Truyền Thống | Kyo Kimono Rental",
            description: "Bộ sưu tập Kimono cưới lộng lẫy và trang trọng nhất."
        },
        en: {
            title: "Traditional Wedding Kimono Rental | Kyo Kimono Rental",
            description: "The most elegant and formal collection of wedding Kimonos for your special day."
        }
    }
};

/**
 * Helper function to get SEO data with fallback
 * @param key Slug or ID
 * @param locale Current language
 * @param fallback Content from API
 */
export function getSeoContent(key: string, locale: string, fallback: { title?: string, description?: string }) {
    const override = SEO_OVERRIDES[key]?.[locale];

    return {
        title: override?.title || fallback.title || "Kyo Kimono Rental",
        description: override?.description || fallback.description || "Dịch vụ cho thuê Kimono chuyên nghiệp tại Kyoto"
    };
}
