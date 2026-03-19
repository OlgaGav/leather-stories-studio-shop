export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="Leather crafting process"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/80 via-espresso/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">

        <p className="text-gold-accent tracking-[0.3em] uppercase text-sm mb-6">
          Handmade in California
        </p>

        <h1 className="font-script text-4xl md:text-6xl lg:text-7xl leading-tight text-primary-foreground mb-6">
          Leather Stories
          <br />
          <span className="font-script text-gold-accent ">Studio</span>
        </h1>

        <p className="text-primary-foreground/80 text-base md:text-lg max-w-md mx-auto mb-10">
          Every wallet tells a story. Yours starts here — hand-cut, hand-stitched, personalized.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#products"
            className="bg-accent text-accent-foreground px-8 py-3 rounded font-medium text-sm tracking-wide hover:opacity-90 transition"
          >
            Shop Now
          </a>

          <a
            href="#story"
            className="bg-espresso/60 text-primary-foreground px-8 py-3 rounded text-sm hover:bg-accent hover:text-accent-foreground transition"
          >
            Our Story
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-12 bg-gradient-to-b from-gold-accent/60 to-transparent" />
      </div>
    </section>
  );
}