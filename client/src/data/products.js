export const products = [
  {
    id: "cardholder-model-1",
    slug: "nomad",
    name: "Nomad",
    subtitle: "The Minimalist Standard",
    price: 50,
    currency: "USD",
    description:
      "Minimalist hand-stitched cardholder in Italian Pueblo leather, built for 3–5 cards and everyday carry.",
    badgeLine:
      "Italian Pueblo Leather • Hand-Stitched • Develops a Rich Patina",
    colors: [
      {
        id: "olive-grey-embossed",
        name: "Olive Grey Embossed",
        hex: "#6b6f5b",
      },
      { id: "red", name: "Red", hex: "#8b2f2f" },
      {
        id: "red-embossed",
        name: "Red Embossed",
        hex: "#b13a46",
      },
      { id: "black", name: "Black", hex: "#111111" },
    ],
    leathers: [{ id: "pueblo", name: "Pueblo Leather" }],
    defaultColorId: "olive-grey-embossed",
    defaultImages: ["/images/cardholder/nomad-olive-1.jpg"],
    variants: [
      {
        colorId: "black",
        leatherId: "pueblo",
        images: [
          "/images/cardholder/nomad-black-1.jpg",
          "/images/cardholder/nomad-black-2.jpg",
        ],
        video: "/videos/nomad-black.mp4",
      },
      {
        colorId: "olive-grey-embossed",
        leatherId: "pueblo",
        images: [
          "/images/cardholder/nomad-olive-1.jpg",
          "/images/cardholder/nomad-olive-2.jpg",
        ],
        video: "/videos/nomad-olive-embossed.mp4",
      },
      {
        colorId: "red",
        leatherId: "pueblo",
        images: [
          "/images/cardholder/nomad-red-1.jpg",
          "/images/cardholder/nomad-red-2.jpg",
        ],
        video: "/videos/nomad-red.mp4",
      },
      {
        colorId: "red-embossed",
        leatherId: "pueblo",
        images: [
          "/images/cardholder/nomad-red-embossed-1.jpg",
          "/images/cardholder/nomad-red-embossed-2.jpg",
        ],
        video: "/videos/nomad-red-embossed.mp4",
      },
    ],
    details: {
      intro:
        "The Nomad cardholder is designed for those who value craftsmanship and longevity. Compact, resilient, and understated, it is built to be a constant companion.",
      features: [
        {
          title: "Artisan Italian Leather",
          text: "Hand-cut from Pueblo vegetable-tanned leather by the Badalassi Carlo tannery in Tuscany.",
        },
        {
          title: "A Personal History",
          text: "Over time, the leather develops a deep natural patina, making each piece uniquely yours.",
        },
        {
          title: "The Superior Stitch",
          text: "Hand-stitched using the traditional saddle stitch method with Ritza Tiger waxed thread.",
        },
        {
          title: "Refined Profile",
          text: "Designed to hold 3–5 cards while maintaining a clean, slim silhouette with space for folded cash when needed.",
        },
      ],
      specs: {
        material: "Full-grain Pueblo vegetable-tanned leather (Italy)",
        stitching: "Hand-punched saddle stitch, Ritza Tiger waxed thread",
        dimensions: '4.0" × 2.7"',
        capacity: "3–5 cards",
      },
      giftReady: "Each Nomad cardholder arrives in gift-ready packaging.",
    },
  },

  {
    id: "cardholder-model-2",
    slug: "ranger",
    name: "Ranger",
    subtitle: "The Horizontal Essential",
    price: 50,
    currency: "USD",
    description:
      "Horizontal cardholder in Italian Pueblo leather with angled card access, hand-stitched durability, and room for 3–5 cards plus folded cash.",
    badgeLine:
      "Italian Pueblo Leather • Hand-Stitched • Develops a Rich Patina",
    colors: [
      { id: "olive-grey", name: "Olive Grey", hex: "#6b6f5b" },
      { id: "red", name: "Red", hex: "#8b2f2f" },
    ],
    leathers: [{ id: "pueblo", name: "Pueblo Leather" }],
    defaultColorId: "olive-grey",
    defaultImages: ["/images/cardholder/ranger-olive-1.jpg"],
    variants: [
      {
        colorId: "olive-grey",
        leatherId: "pueblo",
        images: [
          "/images/cardholder/ranger-olive-1.jpg",
          "/images/cardholder/ranger-olive-2.jpg",
        ],
        video: "/videos/ranger-olive.mp4",
      },
      {
        colorId: "red",
        leatherId: "pueblo",
        images: [
          "/images/cardholder/ranger-red-1.jpg",
          "/images/cardholder/ranger-red-2.jpg",
        ],
        video: "/videos/ranger-red.mp4",
      },
    ],
    details: {
      intro:
        "The Ranger cardholder is designed for those who prefer a clean horizontal layout and effortless access to their essentials.",
      features: [
        {
          title: "Artisan Italian Leather",
          text: "Hand-cut from Pueblo vegetable-tanned leather by the Badalassi Carlo tannery in Tuscany.",
        },
        {
          title: "A Personal History",
          text: "Pueblo leather develops a rich natural patina over time, reflecting daily use.",
        },
        {
          title: "The Superior Stitch",
          text: "Hand-stitched using the traditional saddle stitch method with Ritza Tiger waxed thread.",
        },
        {
          title: "Angled Access Design",
          text: "The diagonal pocket creates natural access for cards while keeping the silhouette clean and minimal.",
        },
      ],
      specs: {
        material: "Full-grain Pueblo vegetable-tanned leather (Italy)",
        stitching: "Hand-punched saddle stitch, Ritza Tiger waxed thread",
        dimensions: '4.0" × 2.7"',
        capacity: "3–5 cards + folded cash",
      },
      giftReady: "Each Ranger cardholder arrives in gift-ready packaging.",
    },
  },

  {
    id: "cardholder-model-3",
    slug: "nomad-premium",
    name: "Nomad Premium",
    subtitle: "The Elevated Minimalist",
    price: 60,
    currency: "USD",
    description:
      "Premium minimalist cardholder crafted from Badalassi Carlo Belfagor leather in a natural tone, with hand-stitched construction and timeless character.",
    badgeLine: "Badalassi Carlo Belfagor • Hand-Stitched • Natural Finish",
    colors: [{ id: "natural", name: "Natural", hex: "#d8c3a5" }],
    leathers: [{ id: "belfagor", name: "Badalassi Carlo - Belfagor" }],
    defaultColorId: "natural",
    defaultImages: ["/images/cardholder/nomad-premium-natural-1.jpg"],
    variants: [
      {
        colorId: "natural",
        leatherId: "belfagor",
        images: [
          "/images/cardholder/nomad-premium-natural-1.jpg",
          "/images/cardholder/nomad-premium-natural-2.jpg",
        ],
        video: "/videos/nomad-premium.mp4",
      },
    ],
    details: {
      intro:
        "Nomad Premium takes the minimalist Nomad silhouette and pairs it with Badalassi Carlo Belfagor leather for an even more elevated feel, rich character, and refined aging.",
      features: [
        {
          title: "Premium Italian Leather",
          text: "Crafted from Badalassi Carlo Belfagor leather in a natural tone, selected for its rich texture, depth, and distinctive character.",
        },
        {
          title: "Natural Character",
          text: "The natural finish highlights the beauty of the leather and allows it to deepen and evolve beautifully with wear.",
        },
        {
          title: "Hand-Stitched Durability",
          text: "Each piece is assembled and hand-stitched for strength, precision, and a more artisanal finish.",
        },
        {
          title: "Minimalist Carry",
          text: "Built for everyday use with a slim silhouette that keeps essentials close without unnecessary bulk.",
        },
      ],
      specs: {
        material: "Badalassi Carlo Belfagor leather (Italy)",
        stitching: "Hand-stitched construction",
        dimensions: '4.0" × 2.7"',
        capacity: "3–5 cards",
      },
      giftReady:
        "Each Nomad Premium cardholder arrives in gift-ready packaging.",
    },
  },
];
