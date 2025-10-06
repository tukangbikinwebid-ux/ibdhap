export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  distance: number;
  priceRange: string;
  category: string;
  halalCertified: boolean;
  openingHours: string;
  phone: string;
  isFavorite?: boolean;
  features: string[];
  city: string;
  menu: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isHalal?: boolean;
  ingredients: string[];
  allergens: string[];
  isFavorite?: boolean;
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Warung Nasi Gudeg Bu Sari",
    description:
      "Gudeg legendaris Yogyakarta dengan cita rasa autentik dan suasana tradisional yang hangat",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 1247,
    address: "Jl. Wijilan No. 31, Yogyakarta",
    distance: 0.8,
    priceRange: "Rp",
    category: "Warung",
    halalCertified: true,
    openingHours: "06:00 - 14:00",
    phone: "+62 274 123456",
    features: ["WiFi", "Parkir", "Take Away", "Delivery"],
    city: "yogyakarta",
    menu: [
      {
        id: "1-1",
        name: "Gudeg Kering",
        description: "Gudeg dengan kuah kental dan daging sapi empuk",
        price: 25000,
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop",
        category: "Makanan Utama",
        rating: 4.9,
        reviewCount: 89,
        isPopular: true,
        isHalal: true,
        ingredients: ["Nangka muda", "Daging sapi", "Santan", "Bumbu rempah"],
        allergens: ["Santan"],
      },
      {
        id: "1-2",
        name: "Gudeg Basah",
        description: "Gudeg dengan kuah santan yang gurih",
        price: 20000,
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop",
        category: "Makanan Utama",
        rating: 4.7,
        reviewCount: 156,
        isHalal: true,
        ingredients: ["Nangka muda", "Santan", "Bumbu rempah"],
        allergens: ["Santan"],
      },
    ],
  },
  {
    id: "2",
    name: "Restoran Sederhana",
    description:
      "Masakan Padang autentik dengan berbagai pilihan lauk dan sayuran segar",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 892,
    address: "Jl. Thamrin No. 15, Jakarta Pusat",
    distance: 1.2,
    priceRange: "Rp Rp",
    category: "Restoran",
    halalCertified: true,
    openingHours: "10:00 - 22:00",
    phone: "+62 21 1234567",
    features: ["WiFi", "Parkir", "AC", "Take Away", "Delivery"],
    city: "jakarta",
    menu: [
      {
        id: "2-1",
        name: "Rendang Daging",
        description: "Daging sapi empuk dengan bumbu rendang yang khas",
        price: 35000,
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop",
        category: "Makanan Utama",
        rating: 4.8,
        reviewCount: 234,
        isPopular: true,
        isSpicy: true,
        isHalal: true,
        ingredients: ["Daging sapi", "Santan", "Bumbu rendang", "Daun jeruk"],
        allergens: ["Santan"],
      },
      {
        id: "2-2",
        name: "Ayam Pop",
        description: "Ayam kampung dengan bumbu khas Padang",
        price: 28000,
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop",
        category: "Makanan Utama",
        rating: 4.6,
        reviewCount: 178,
        isHalal: true,
        ingredients: ["Ayam kampung", "Bumbu kuning", "Daun salam"],
        allergens: [],
      },
    ],
  },
  {
    id: "3",
    name: "Kafe Muslimah",
    description:
      "Kafe cozy dengan menu halal dan suasana yang nyaman untuk keluarga",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 567,
    address: "Jl. Diponegoro No. 45, Bandung",
    distance: 2.1,
    priceRange: "Rp Rp",
    category: "Kafe",
    halalCertified: true,
    openingHours: "07:00 - 23:00",
    phone: "+62 22 1234567",
    features: ["WiFi", "Parkir", "AC", "Playground", "Prayer Room"],
    city: "bandung",
    menu: [
      {
        id: "3-1",
        name: "Cappuccino Halal",
        description: "Kopi dengan susu halal dan foam yang lembut",
        price: 18000,
        image:
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=150&fit=crop",
        category: "Minuman",
        rating: 4.4,
        reviewCount: 123,
        isHalal: true,
        ingredients: ["Kopi arabika", "Susu halal", "Gula"],
        allergens: ["Susu"],
      },
      {
        id: "3-2",
        name: "Croissant Keju",
        description: "Croissant dengan keju halal yang melimpah",
        price: 22000,
        image:
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=150&fit=crop",
        category: "Pastry",
        rating: 4.3,
        reviewCount: 89,
        isHalal: true,
        ingredients: ["Tepung terigu", "Keju halal", "Mentega halal"],
        allergens: ["Gluten", "Susu"],
      },
    ],
  },
  {
    id: "4",
    name: "Bakso Malang Cak Kar",
    description:
      "Bakso Malang autentik dengan kuah kaldu yang gurih dan bakso kenyal",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=500&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 743,
    address: "Jl. Semeru No. 12, Malang",
    distance: 0.5,
    priceRange: "Rp",
    category: "Warung",
    halalCertified: true,
    openingHours: "08:00 - 20:00",
    phone: "+62 341 123456",
    features: ["Parkir", "Take Away", "Delivery"],
    city: "surabaya",
    menu: [
      {
        id: "4-1",
        name: "Bakso Malang Spesial",
        description: "Bakso dengan mie, tahu, siomay, dan pangsit",
        price: 15000,
        image:
          "https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=200&h=150&fit=crop",
        category: "Makanan Utama",
        rating: 4.8,
        reviewCount: 267,
        isPopular: true,
        isHalal: true,
        ingredients: ["Bakso sapi", "Mie kuning", "Tahu", "Siomay", "Pangsit"],
        allergens: ["Gluten"],
      },
    ],
  },
  {
    id: "5",
    name: "Pizza Halal Corner",
    description: "Pizza dengan topping halal dan crust yang renyah",
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 445,
    address: "Jl. Sudirman No. 88, Medan",
    distance: 1.8,
    priceRange: "Rp Rp Rp",
    category: "Fast Food",
    halalCertified: true,
    openingHours: "11:00 - 23:00",
    phone: "+62 61 1234567",
    features: ["WiFi", "Parkir", "AC", "Delivery"],
    city: "medan",
    menu: [
      {
        id: "5-1",
        name: "Pizza Margherita Halal",
        description: "Pizza dengan keju mozzarella halal dan tomat segar",
        price: 45000,
        image:
          "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200&h=150&fit=crop",
        category: "Makanan Utama",
        rating: 4.5,
        reviewCount: 156,
        isPopular: true,
        isVegetarian: true,
        isHalal: true,
        ingredients: ["Dough", "Keju mozzarella halal", "Tomat", "Basil"],
        allergens: ["Gluten", "Susu"],
      },
    ],
  },
  {
    id: "6",
    name: "Sate Madura Pak Haji",
    description:
      "Sate Madura dengan bumbu kacang yang khas dan daging yang empuk",
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 1123,
    address: "Jl. Pahlawan No. 67, Surabaya",
    distance: 0.3,
    priceRange: "Rp Rp",
    category: "Street Food",
    halalCertified: true,
    openingHours: "17:00 - 24:00",
    phone: "+62 31 1234567",
    features: ["Parkir", "Take Away"],
    city: "surabaya",
    menu: [
      {
        id: "6-1",
        name: "Sate Ayam Madura",
        description: "Sate ayam dengan bumbu kacang khas Madura",
        price: 25000,
        image:
          "https://images.unsplash.com/photo-1559847844-5315695dadae?w=200&h=150&fit=crop",
        category: "Makanan Utama",
        rating: 4.9,
        reviewCount: 445,
        isPopular: true,
        isHalal: true,
        ingredients: ["Daging ayam", "Kacang tanah", "Bumbu rempah"],
        allergens: ["Kacang"],
      },
    ],
  },
  {
    id: "7",
    name: "Nasi Uduk Betawi Bu Ani",
    description:
      "Nasi uduk Betawi dengan lauk pauk yang lengkap dan sambal yang pedas",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=500&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 678,
    address: "Jl. Kebon Jeruk No. 23, Jakarta Barat",
    distance: 1.5,
    priceRange: "Rp",
    category: "Warung",
    halalCertified: true,
    openingHours: "06:00 - 15:00",
    phone: "+62 21 2345678",
    features: ["Parkir", "Take Away"],
    city: "jakarta",
    menu: [
      {
        id: "7-1",
        name: "Nasi Uduk Komplit",
        description: "Nasi uduk dengan ayam goreng, tempe, tahu, dan sambal",
        price: 20000,
        image:
          "https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=200&h=150&fit=crop",
        category: "Makanan Utama",
        rating: 4.7,
        reviewCount: 234,
        isPopular: true,
        isHalal: true,
        ingredients: ["Nasi uduk", "Ayam goreng", "Tempe", "Tahu", "Sambal"],
        allergens: [],
      },
    ],
  },
  {
    id: "8",
    name: "Dessert House Halal",
    description:
      "Berbagai dessert halal dengan rasa yang lezat dan tampilan yang menarik",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=300&fit=crop",
    rating: 4.3,
    reviewCount: 334,
    address: "Jl. Malioboro No. 78, Yogyakarta",
    distance: 1.1,
    priceRange: "Rp Rp",
    category: "Dessert",
    halalCertified: true,
    openingHours: "10:00 - 22:00",
    phone: "+62 274 234567",
    features: ["WiFi", "AC", "Take Away"],
    city: "yogyakarta",
    menu: [
      {
        id: "8-1",
        name: "Tiramisu Halal",
        description: "Tiramisu dengan mascarpone halal dan kopi arabika",
        price: 28000,
        image:
          "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop",
        category: "Dessert",
        rating: 4.4,
        reviewCount: 89,
        isPopular: true,
        isHalal: true,
        ingredients: ["Mascarpone halal", "Kopi arabika", "Biskuit", "Kakao"],
        allergens: ["Susu", "Gluten"],
      },
    ],
  },
];

export const getRestaurantsByCity = (cityId: string): Restaurant[] => {
  return restaurants.filter((restaurant) => restaurant.city === cityId);
};

export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find((restaurant) => restaurant.id === id);
};

export const searchRestaurants = (
  query: string,
  cityId?: string
): Restaurant[] => {
  let filteredRestaurants = restaurants;

  if (cityId) {
    filteredRestaurants = filteredRestaurants.filter(
      (restaurant) => restaurant.city === cityId
    );
  }

  if (query) {
    const lowercaseQuery = query.toLowerCase();
    filteredRestaurants = filteredRestaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(lowercaseQuery) ||
        restaurant.description.toLowerCase().includes(lowercaseQuery) ||
        restaurant.category.toLowerCase().includes(lowercaseQuery) ||
        restaurant.address.toLowerCase().includes(lowercaseQuery)
    );
  }

  return filteredRestaurants;
};
