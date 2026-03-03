export const products = [
  {
    id: "cardholder-model-1",
    name: "Cardholder Model 1",
    price: 79,
    currency: "USD",
    description:
      "Handcrafted full-grain leather. Minimal profile, everyday carry.",
    colors: [
      { id: "dark-brown", name: "Dark Brown", hex: "#5a3a1b" },
      { id: "tan", name: "Tan", hex: "#b37a3c" },
      { id: "black", name: "Black", hex: "#111111" },
    ],
    leathers: [
      { id: "smooth", name: "Smooth" },
      { id: "pebbled", name: "Pebbled" },
    ],
    defaultImages: [
      "/images/cardholder/wallet_1.jpg",
      "/images/cardholder/wallet_1_2.jpg",
    ],

    variants: [
      {
        colorId: "dark-brown",
        leatherId: "smooth",
        images: [
          "/images/cardholder/db-smooth-1.jpg",
          "/images/cardholder/db-smooth-2.jpg",
        ],
      },
      {
        colorId: "dark-brown",
        leatherId: "pebbled",
        images: [
          "/images/cardholder/db-pebbled-1.jpg",
          "/images/cardholder/db-pebbled-2.jpg",
        ],
      },
      {
        colorId: "black",
        leatherId: "smooth",
        images: ["/images/cardholder/black-smooth-1.jpg"],
      },
    ],
    fonts: [
      { id: "serif", name: "Serif" },
      { id: "sans", name: "Sans" },
      { id: "script", name: "Script" },
    ],
    maxPersonalizationLength: 20,

  },
  {
    id: "slim-card-holder",
    name: "Slim Card Holder",
    price: 59,
    currency: "USD",
    description: "Compact card holder designed for everyday carry.",

    colors: [
      { id: "dark-brown", name: "Dark Brown", hex: "#5a3a1b" },
      { id: "tan", name: "Tan", hex: "#b37a3c" },
      { id: "black", name: "Black", hex: "#111111" },
    ],

    defaultImages: ["/images/cardholder/wallet_2.jpg"],

    variants: [
      {
        color: "Black",
        images: [
          "/images/cardholder/wallet_3.jpg",
          "/images/cardholder/wallet_3_1.jpg",
        ],
      },
      {
        color: "Brown",
        images: [
          "/images/cardholder/wallet_3.jpg",
          "/images/cardholder/wallet_3_1.jpg",
        ],
      },
    ],
  },
  {
    id: "slim-card-holder-2",
    name: "Slim Card Holder Model 2",
    price: 59,
    currency: "USD",
    description: "Compact card holder designed for everyday carry.",

    colors: [
      { id: "green", name: "Green", hex: "#2e8b57" },
      { id: "brown", name: "Brown", hex: "#8b4513" },
    ],

    defaultImages: ["/images/cardholder/wallet_4.jpg"],

    variants: [
      {
        colorId: "green",
        images: ["/images/cardholder/wallet_4.jpg"],
      },
      {
        colorId: "brown",
        images: ["/images/cardholder/wallet_5.jpg"],
      },
    ],
  },
];
