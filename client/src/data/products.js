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
    subtitle: "Nomad Premium — Elevated Craft",
    price: 60,
    currency: "USD",
    description:
      "The Nomad Premium cardholder is a refined expression of the original design, created for those who appreciate distinctive materials and evolving character. It maintains a minimalist form while introducing a leather that transforms with use.",
    badgeLine:
      "Italian Ghost Leather • Hand-Stitched • One-of-a-Kind Patina • Built to Last",
    colors: [{ id: "natural", name: "Natural", hex: "#d8c3a5" }],
    leathers: [{ id: "belfagor", name: "Badalassi Carlo - Belfagor" }],
    defaultColorId: "natural",
    defaultImages: ["/images/cardholder/nomad-premium-natural-1.jpg"],
    variants: [
      {
        colorId: "natural",
        leatherId: "walpier-ghost-leather",
        images: [
          "/images/cardholder/nomad-premium-natural-1.jpg",
          "/images/cardholder/nomad-premium-natural-2.jpg",
        ],
        video: "/videos/nomad-premium.mp4",
      },
    ],
    details: {
      intro:
        "The Nomad Premium cardholder is a refined expression of the original design, created for those who appreciate distinctive materials and evolving character. It maintains a minimalist form while introducing a leather that transforms with use.",
      features: [
        {
          title: "Walpier Ghost Leather",
          text: "Crafted from “Burro” ghost leather by the Walpier tannery (Italy) — a vegetable-tanned leather finished with a layer of white wax. Beneath this surface lies the natural color of the leather. As the wax gradually wears and can be gently rubbed away, deeper tones begin to emerge, creating a dynamic, evolving surface. Each piece develops its own pattern over time — no two cardholders will age the same.",
        },
        {
          title: "A Living Material",
          text: "This leather is designed to change. With every use, it reveals more of its depth and character. The result is a cardholder that becomes increasingly personal — a piece that reflects how it is used and carried.",
        },
        {
          title: "The Superior Stitch",
          text: "Each Nomad Premium is hand-stitched using the traditional saddle stitch method with durable Ritza Tiger waxed thread. This construction ensures long-term durability, keeping the seams secure through years of everyday use.",
        },
        {
          title: "Minimalist Form, Elevated Feel",
          text: "Designed to hold 3–5 cards while maintaining a clean, slim silhouette. The unique surface of ghost leather adds a tactile and visual depth that sets this piece apart from standard leather goods.",
        },
      ],
      specs: {
        material: "Walpier “Burro” ghost leather (Italy), vegetable-tanned",
        stitching: "Hand-punched saddle stitch. Ritza Tiger waxed thread.",
        dimensions: '4.0" × 2.7"',
        capacity: "3–5 cards",
      },
      giftReady:
        "Each Nomad Premium cardholder arrives in gift-ready packaging.",
    },
  },
];
