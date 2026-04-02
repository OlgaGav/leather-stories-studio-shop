import { useState } from "react";
import { Mail, ChevronRight } from "lucide-react";

const CONTACT_EMAIL = "order@leather-stories-studio.com";

const GALLERY = [
  {
    src: "/images/organizations/org_example_1.jpg",
    caption: "Custom logo embossing",
  },
  {
    src: "/images/organizations/org_example_2.jpg",
    caption: "Corporate branding sample",
  },
  {
    src: "/images/organizations/org_example_3.jpg",
    caption: "Team gift order",
  },
  {
    src: "/images/organizations/org_example_4.jpg",
    caption: "Personalized business order",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Email us with your idea",
    description:
      "Tell us about your project — company name, the type of leather goods you have in mind, and any branding or logo requirements.",
  },
  {
    number: "02",
    title: "Share the details",
    description:
      "Include quantity, preferred timeline, and any customization needs such as logo placement, color preferences, or personalization.",
  },
  {
    number: "03",
    title: "Receive pricing and next steps",
    description:
      "We will reply with availability, pricing for your order size, and a clear path forward to get your pieces made.",
  },
];

export default function CorporateOrders() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="w-full bg-background text-foreground">
      {/* Hero */}
      <section className="relative bg-espresso overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-accent via-transparent to-transparent" />
        <div className="relative container mx-auto max-w-6xl px-6 py-24 md:py-32 md:flex md:items-center md:gap-16">
          <div className="md:flex-1">
            <p className="text-gold-accent tracking-[0.3em] uppercase text-xs font-body mb-4">
              For Organizations &amp; Businesses
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight">
              Corporate Orders
            </h1>
            <p className="mt-5 text-lg md:text-xl text-primary-foreground/70 font-body leading-relaxed max-w-xl">
              Thoughtful leather goods for teams, clients, events, and branded
              gifting — crafted by hand, made to last.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded font-body font-medium tracking-wide hover:opacity-90 transition-opacity"
            >
              <Mail size={18} />
              Email Us About Corporate Orders
            </a>
          </div>

          {/* Featured image */}
          <div className="hidden md:block md:flex-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="/images/organizations/org_example_1.jpg"
                alt="Corporate leather order example"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Intro / value proposition */}
      <section className="container mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="text-gold-accent tracking-[0.3em] uppercase text-xs font-body mb-4">
            Why Corporate Orders
          </p>
          <h2 className="font-display text-2xl md:text-3xl">
            Custom leather goods for your organization
          </h2>
          <div className="mt-6 space-y-4 font-body text-muted-foreground leading-relaxed text-base md:text-lg">
            <p>
              We offer corporate and organization orders at special pricing for
              qualifying quantities. Whether you are looking for branded leather
              goods, team accessories, client gifts, or event pieces featuring
              your company logo — we would be happy to discuss your project.
            </p>
            <p>
              Every piece is handcrafted in California using full-grain leather.
              Logo and text customization may be available depending on the
              design — just let us know what you have in mind.
            </p>
            <p>
              To keep all order details organized and ensure nothing gets lost,
              email is our preferred way to communicate for corporate requests.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-card/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="text-gold-accent tracking-[0.3em] uppercase text-xs font-body mb-4">
            Our Work
          </p>
          <h2 className="font-display text-2xl md:text-3xl mb-10">
            Examples of Custom Corporate Work
          </h2>
          <p className="text-muted-foreground font-body mb-10 -mt-6">
            Below are examples from previous custom and branded orders.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {GALLERY.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightbox(i)}
                className="group relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent"
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="absolute bottom-0 left-0 right-0 px-5 py-4 font-body text-sm text-primary-foreground tracking-wide translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {item.caption}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="text-gold-accent tracking-[0.3em] uppercase text-xs font-body mb-4">
          The Process
        </p>
        <h2 className="font-display text-2xl md:text-3xl mb-12">
          How It Works
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-border bg-card/40 p-7 flex flex-col gap-4"
            >
              <span className="font-display text-4xl text-gold-accent/40 leading-none">
                {step.number}
              </span>
              <h3 className="font-display text-lg">{step.title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-espresso">
        <div className="container mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-gold-accent tracking-[0.3em] uppercase text-xs font-body mb-4">
              Get In Touch
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-primary-foreground">
              Start Your Corporate Order
            </h2>
            <p className="mt-5 font-body text-primary-foreground/70 leading-relaxed">
              For corporate requests, please reach out by email. To keep all
              information in one place, email is preferred over phone calls.
            </p>

            <div className="mt-8 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-7 flex flex-col items-center gap-5">
              <Mail size={28} className="text-gold-accent" />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-body text-lg text-gold-accent hover:text-gold-accent/80 transition-colors tracking-wide break-all"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="font-body text-sm text-primary-foreground/50 text-center">
                Please include your company name, quantity needed, preferred
                timeline, and any logo or customization details.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded font-body font-medium tracking-wide hover:opacity-90 transition-opacity"
              >
                <Mail size={16} />
                Send Us an Email
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-espresso/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-5 right-6 text-primary-foreground/60 hover:text-primary-foreground text-3xl font-light leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY[lightbox].src}
              alt={GALLERY[lightbox].caption}
              className="w-full rounded-xl object-contain max-h-[80vh]"
            />
            <p className="mt-4 text-center font-body text-primary-foreground/70 text-sm tracking-wide">
              {GALLERY[lightbox].caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
