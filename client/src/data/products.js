export const products = [
  {
    id: "cardholder-model-1",
    name: "Cardholder Model 1 Name",
    price: 50,
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
          "/images/cardholder/wallet_1.jpg",
        ],
      },
      {
        colorId: "dark-brown",
        leatherId: "pebbled",
        images: [
          "/images/cardholder/wallet_1_2.jpg",
        ],
      },
      {
        colorId: "tan",
        leatherId: "smooth",
        images: [
          "/images/cardholder/wallet_1_2.jpg",
        ],
      },
       {
        colorId: "tan",
        leatherId: "pebbled",
        images: [
          "/images/cardholder/wallet_1.jpg",
        ],
      },
      {
        colorId: "black",
        leatherId: "smooth",
        images: ["/images/cardholder/wallet_4.jpg"],
      },
      {
        colorId: "black",
        leatherId: "pebbled",
        images: ["/images/cardholder/wallet_5.jpg"],
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
    id: "cardholder-model-2",
    name: "Cardholder Model 2 Name",
    price: 50,
    currency: "USD",
    description: "Compact card holder designed for everyday carry.",

    colors: [
      { id: "tan", name: "Tan", hex: "#b37a3c" },
      { id: "black", name: "Black", hex: "#111111" },
    ],
    leathers: [
      { id: "smooth", name: "Smooth" },
      { id: "pebbled", name: "Pebbled" },
    ],
    defaultImages: ["/images/cardholder/wallet_2.jpg"],

    variants: [
      {
        colorId: "black",
        leatherId: "smooth",
        images: [
          "/images/cardholder/wallet_3.jpg",
          "/images/cardholder/wallet_3_1.jpg",
        ],
      },
      {
        colorId: "black",
        leatherId: "pebbled",
        images: [
          "/images/cardholder/wallet_3_1.jpg",
        ],
      },
      {
        colorId: "tan",
        leatherId: "smooth",
        images: [
          "/images/cardholder/wallet_4.jpg",
        ],
      },
      {
        colorId: "tan",
        leatherId: "pebbled",
        images: [
          "/images/cardholder/wallet_5.jpg"
        ],
      },
    ],
  },
];
