//unsued data in the new version..

import { ProductStatus } from "./fabrics";
export interface GarmentType {
  id: number;
  url: string;
  url2: string;
  name: string;
  price: string;
  status: ProductStatus;
  sale: boolean;
  collection: string;
  designer: string;
  category: string;
  color: string;
  size: string;
  brand: string;
  material?: string;
}

export const Garments: GarmentType[] = [
  {
    id: 1,

    sale: true,
    url: "/ig-images/1.webp",
    url2: "/ig-images/1-hover.webp",
    name: "Classic Silk Saree",
    price: "₹4999",
    collection: "Summer Collection",
    designer: "Aruna Kumar",
    category: "Luxury Saree",
    status: ProductStatus.Unlisted,
    color: "Red",
    size: "M",
    brand: "Brand A",
  },
  {
    id: 2,
    sale: true,
    url: "/ig-images/2.webp",
    url2: "/uploads/OIP.jpeg",
    name: "Vibrant Chiffon Saree",
    price: "₹2896",
    collection: "Spring Blossoms",
    status: ProductStatus.Unlisted,
    designer: "Rekha Sharma",
    category: "Casual Saree",
    color: "Blue",
    size: "S",
    brand: "Brand B",
  },
  {
    id: 3,

    sale: false,
    url: "/ig-images/3.webp",
    url2: "/ig-images/3-hover.webp",
    name: "Embroidered Georgette Saree",
    price: "₹8000",
    collection: "Festive Elegance",
    designer: "Rajesh Singh",
    category: "Occasional Saree",
    status: ProductStatus.Unlisted,
    color: "Green",
    size: "L",
    brand: "Brand C",
  },
  {
    id: 4,

    sale: false,
    url: "/ig-images/4.webp",
    url2: "/ig-images/4-hover.webp",
    name: "Elegant Jacquard Saree",
    price: "₹4000",
    collection: "Winter Wonders",
    designer: "Meera Rao",
    category: "Luxury Saree",
    status: ProductStatus.Unlisted,
    color: "Purple",
    size: "M",
    brand: "Brand D",
  },
  {
    id: 5,

    sale: false,
    url: "/ig-images/5.webp",
    url2: "/ig-images/5-hover.webp",
    name: "Printed Crepe Saree",
    price: "₹3140",
    collection: "Monsoon Magic",
    designer: "Nandini Sethi",
    category: "Casual Saree",
    status: ProductStatus.Unlisted,
    color: "Yellow",
    size: "S",
    brand: "Brand A",
  },
  {
    id: 6,
    sale: false,
    url: "/ig-images/6.webp",
    url2: "/ig-images/6-hover.webp",
    name: "Woven Linen Saree",
    price: "₹2398",
    collection: "Earthy Elegance",
    designer: "Devika Nair",
    category: "Casual Saree",
    status: ProductStatus.Unlisted,
    color: "Beige",
    size: "L",
    brand: "Brand B",
  },
  {
    id: 7,
    sale: false,
    url: "/ig-images/7.webp",
    url2: "/ig-images/7-hover.webp",
    name: "Sequined Satin Saree",
    price: "₹6000",
    collection: "Glamour Nights",
    designer: "Rohit Verma",
    category: "Occasional Saree",
    status: ProductStatus.Unlisted,
    color: "Gold",
    size: "M",
    brand: "Brand C",
  },
  {
    id: 8,
    sale: true,
    url: "/ig-images/8.webp",
    url2: "/ig-images/8-hover.webp",
    name: "Textured Tussar Silk Saree",
    price: "₹3809",
    collection: "Silk Dreams",
    designer: "Shilpa Reddy",
    category: "Luxury Saree",
    status: ProductStatus.Unlisted,
    color: "Brown",
    size: "XL",
    brand: "Brand D",
  },
  {
    id: 9,

    sale: false,
    url: "/ig-images/9.webp",
    url2: "/ig-images/9-hover.webp",
    name: "Embroidered Organza Saree",
    price: "₹4141",
    collection: "Royal Heritage",
    designer: "Arun Balaji",
    category: "Occasional Saree",
    status: ProductStatus.Unlisted,
    color: "Pink",
    size: "S",
    brand: "Brand A",
  },
  {
    id: 10,

    sale: false,
    url: "/ig-images/10.webp",
    url2: "/ig-images/10-hover.webp",
    name: "Printed Cotton Saree",
    price: "₹2896",
    collection: "Casual Comfort",
    designer: "Sneha Patel",
    category: "Casual Saree",
    status: ProductStatus.Unlisted,
    color: "Blue",
    size: "M",
    brand: "Brand B",
  },
  {
    id: 11,
    sale: false,
    url: "/ig-images/11.webp",
    url2: "/ig-images/11-hover.webp",
    name: "Embroidered Silk Saree",
    price: "₹6500",
    collection: "Luxury Silk",
    designer: "Vikram Rao",
    category: "Luxury Saree",
    status: ProductStatus.Unlisted,
    color: "Red",
    size: "L",
    brand: "Brand C",
  },
  {
    id: 12,
    sale: false,
    url: "/ig-images/12.webp",
    url2: "/ig-images/12-hover.webp",
    name: "Woven Banarasi Saree",
    price: "₹3560",
    collection: "Heritage Weaves",
    designer: "Kiran Desai",
    category: "Occasional Saree",
    status: ProductStatus.Unlisted,
    color: "Green",
    size: "M",
    brand: "Brand D",
  },
  {
    id: 13,
    sale: false,
    url: "/ig-images/13.webp",
    url2: "/ig-images/13-hover.webp",
    name: "Printed Chanderi Saree",
    price: "₹3145",
    collection: "Ethereal Chanderi",
    designer: "Aarti Chawla",
    category: "Casual Saree",
    status: ProductStatus.Unlisted,
    color: "Yellow",
    size: "S",
    brand: "Brand A",
  },
  {
    id: 14,

    sale: false,
    url: "/ig-images/14.webp",
    url2: "/ig-images/14-hover.webp",
    name: "Embroidered Kanjeevaram Saree",
    price: "₹2398",
    collection: "Kanjeevaram Classics",
    designer: "Lakshmi Reddy",
    category: "Luxury Saree",
    status: ProductStatus.Unlisted,
    color: "Purple",
    size: "XL",
    brand: "Brand B",
  },
  {
    id: 15,

    sale: false,
    url: "/ig-images/15.webp",
    url2: "/ig-images/15-hover.webp",
    name: "Printed Linen Saree",
    price: "₹45567",
    collection: "Linen Luxe",
    designer: "Neha Agarwal",
    category: "Casual Saree",
    status: ProductStatus.Unlisted,
    color: "Beige",
    size: "M",
    brand: "Brand C",
  },
  {
    id: 16,
    sale: false,
    url: "/ig-images/16.webp",
    url2: "/ig-images/16-hover.webp",
    name: "Sequined Chiffon Saree",
    price: "₹3809",
    collection: "Chiffon Chic",
    designer: "Tarun Chauhan",
    category: "Occasional Saree",
    status: ProductStatus.Unlisted,
    color: "Pink",
    size: "S",
    brand: "Brand D",
  },
  {
    id: 17,
    sale: false,
    url: "/ig-images/17.webp",
    url2: "/ig-images/17-hover.webp",
    name: "Woven Ikat Saree",
    price: "₹4150",
    collection: "Ikat Inspirations",
    designer: "Poonam Mehta",
    category: "Luxury Saree",
    status: ProductStatus.Unlisted,
    color: "Red",
    size: "L",
    brand: "Brand A",
  },
  {
    id: 18,
    sale: false,
    url: "/ig-images/18.webp",
    url2: "/ig-images/18-hover.webp",
    name: "Embroidered Net Saree",
    price: "₹2896",
    collection: "Net Delicacy",
    designer: "Ritu Bhasin",
    category: "Occasional Saree",
    status: ProductStatus.Unlisted,
    color: "Blue",
    size: "M",
    brand: "Brand B",
  },
  {
    id: 19,
    sale: false,
    url: "/ig-images/19.webp",
    url2: "/ig-images/19-hover.webp",
    name: "Printed Muslin Saree",
    price: "₹9500",
    collection: "Muslin Marvels",
    designer: "Sunita Rao",
    category: "Luxury Saree",
    status: ProductStatus.Unlisted,
    color: "Green",
    size: "L",
    brand: "Brand C",
  },
  {
    id: 20,
    sale: false,
    url: "/ig-images/20.webp",
    url2: "/ig-images/20-hover.webp",
    name: "Woven Zari Saree",
    price: "₹3560",
    collection: "Zari Zest",
    designer: "Priya Sinha",
    category: "Occasional Saree",
    status: ProductStatus.Unlisted,
    color: "Gold",
    size: "M",
    brand: "Brand D",
  },
  {
    id: 21,

    sale: false,
    url: "/ig-images/21.webp",
    url2: "/ig-images/21-hover.webp",
    name: "Embroidered Velvet Saree",
    price: "₹3145",
    collection: "Velvet Dreams",
    designer: "Sarita Verma",
    category: "Luxury Saree",
    status: ProductStatus.Unlisted,
    color: "Brown",
    size: "S",
    brand: "Brand A",
  },
];
