export type PlanCategory = "women" | "men" | "kids";

export interface KimonoPlan {
  id: string;
  category: PlanCategory;
  slug: string;
  image: string;
  priceJPY: number;
  translationKey: string;
  subCategory?: string;
}

export const kimonoPlans: KimonoPlan[] = [
  {
    id: "women-basic",
    category: "women",
    slug: "kimono-nu-co-ban",
    image: "/images/kimono-women-basic.jpg",
    priceJPY: 500000,
    translationKey: "womenBasic",
    subCategory: "women-basic",
  },
  {
    id: "women-lace",
    category: "women",
    slug: "kimono-nu-ren",
    image: "/images/kimono-women-lace.jpg",
    priceJPY: 700000,
    translationKey: "womenLace",
    subCategory: "women-lace",
  },
  {
    id: "houmongi",
    category: "women",
    slug: "kimono-houmongi",
    image: "/images/kimono-houmongi.jpg",
    priceJPY: 900000,
    translationKey: "houmongi",
    subCategory: "houmongi",
  },
  {
    id: "furisode",
    category: "women",
    slug: "kimono-furisode",
    image: "/images/kimono-furisode.jpg",
    priceJPY: 1200000,
    translationKey: "furisode",
    subCategory: "furisode",
  },
  {
    id: "men-basic",
    category: "men",
    slug: "kimono-nam-co-ban",
    image: "/images/kimono-men-basic.jpg",
    priceJPY: 500000,
    translationKey: "menBasic",
    subCategory: "men-basic",
  },
  {
    id: "men-hakama",
    category: "men",
    slug: "kimono-nam-hakama",
    image: "/images/kimono-men-hakama.jpg",
    priceJPY: 800000,
    translationKey: "menHakama",
    subCategory: "men-hakama",
  },
  {
    id: "kids-35",
    category: "kids",
    slug: "kimono-tre-em-3-5",
    image: "/images/kimono-kids-small.jpg",
    priceJPY: 350000,
    translationKey: "kids35",
    subCategory: "kids-35",
  },
  {
    id: "kids-7",
    category: "kids",
    slug: "kimono-tre-em-7",
    image: "/images/kimono-kids-7.jpg",
    priceJPY: 400000,
    translationKey: "kids7",
    subCategory: "kids-7",
  },
];

export const pricingData = [
  {
    planKey: "womenBasic",
    halfDay: 500000,
    fullDay: 750000,
  },
  {
    planKey: "womenLace",
    halfDay: 700000,
    fullDay: 1000000,
  },
  {
    planKey: "houmongi",
    halfDay: 900000,
    fullDay: 1300000,
  },
  {
    planKey: "furisode",
    halfDay: 1200000,
    fullDay: 1700000,
  },
  {
    planKey: "menBasic",
    halfDay: 500000,
    fullDay: 750000,
  },
  {
    planKey: "menHakama",
    halfDay: 800000,
    fullDay: 1200000,
  },
  {
    planKey: "kids35",
    halfDay: 350000,
    fullDay: 500000,
  },
  {
    planKey: "kids7",
    halfDay: 400000,
    fullDay: 600000,
  },
];

export const extrasData = [
  { key: "hairStyling", price: 100000 },
  { key: "hairStylingPro", price: 200000 },
  { key: "photoPackage", price: 500000 },
  { key: "extraHour", price: 100000 },
];

export const testimonials = [
  {
    name: "Nguyễn Thị Mai",
    text: "Trải nghiệm tuyệt vời! Kimono rất đẹp và nhân viên rất nhiệt tình hỗ trợ. Chắc chắn sẽ quay lại!",
    rating: 5,
    avatar: "NM",
  },
  {
    name: "Sarah Johnson",
    text: "Amazing experience! The kimonos are gorgeous and the staff was so helpful with styling. Highly recommend!",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "田中美咲",
    text: "ベトナムで本格的な着物体験ができて感動しました。スタッフも親切でした。",
    rating: 5,
    avatar: "TM",
  },
  {
    name: "Trần Văn Hùng",
    text: "Mặc kimono cùng gia đình rất vui. Các bé rất thích, chụp ảnh cực đẹp!",
    rating: 5,
    avatar: "TH",
  },
  {
    name: "Park Soo-jin",
    text: "기모노 품질이 정말 좋고 직원들이 친절해요. 호치민에서 특별한 경험!",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Lê Hoàng Anh",
    text: "Giá rất hợp lý cho chất lượng kimono tuyệt vời. Dịch vụ làm tóc cũng rất chuyên nghiệp.",
    rating: 5,
    avatar: "LA",
  },
];

export const galleryImages = [
  { src: "/images/gallery-1.jpg", alt: "Nhóm bạn mặc kimono tại Sài Gòn" },
  { src: "/images/gallery-2.jpg", alt: "Cặp đôi mặc kimono trước đền" },
  { src: "/images/gallery-3.jpg", alt: "Cô gái mặc kimono trắng cầm ô" },
  { src: "/images/gallery-4.jpg", alt: "Hai cô gái mặc kimono trên hiên" },
  { src: "/images/gallery-5.jpg", alt: "Gia đình mặc kimono trong công viên" },
  { src: "/images/gallery-6.jpg", alt: "Cô gái mặc kimono trên phố cổ" },
  { src: "/images/hero-1.jpg", alt: "Kimono đỏ trong vườn hoa anh đào" },
  { src: "/images/hero-2.jpg", alt: "Nhóm bạn mặc kimono đi dạo" },
  { src: "/images/hero-3.jpg", alt: "Cặp đôi mặc kimono trên cầu" },
];

export const hairstyleImages = [
  { src: "/images/hairstyle-1.jpg", alt: "Kiểu tóc shimada truyền thống" },
  { src: "/images/hairstyle-2.jpg", alt: "Kiểu tóc hiện đại với hoa anh đào" },
  { src: "/images/hairstyle-3.jpg", alt: "Kiểu búi tóc truyền thống Nhật Bản" },
  { src: "/images/hairstyle-4.jpg", alt: "Kiểu tóc nửa buộc nửa xõa với ruy băng" },
  { src: "/images/hairstyle-5.jpg", alt: "Kiểu tóc tết với trâm vàng" },
  { src: "/images/hairstyle-6.jpg", alt: "Kiểu búi thấp với hoa vải" },
];

export function formatJPY(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(amount);
}
