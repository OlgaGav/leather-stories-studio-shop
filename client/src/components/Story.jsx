import { useEffect } from "react";
import { initFlowbite } from "flowbite";

export default function Story() {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <section id="story" className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-10 items-center md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h2 className="text-gold-accent tracking-[0.3em] uppercase text-sm md:text-lg mb-4">
            Our Story
          </h2>

          <p className="mt-3 text-xl text-muted-foreground font-semibold leading-relaxed">
            I create leather goods that get better with time, not worse.
          </p>
          <p className="mt-3 text-lg text-muted-foreground">
            That idea started years ago with a simple object passed down in my
            family — from my grandfather to my father, and eventually to me. It
            was a leather passport cover. Over time, it darkened, developed a
            rich patina, and wore in along the edges — and that’s exactly what
            made it valuable. That’s when I realized: well-made things don’t
            wear out — they tell a story.
          </p>
          <p className="mt-3 text-lg text-muted-foreground">
            Today, I make small leather goods for everyday use — cardholders and
            accessories that people handle every day.
          </p>
          <p className="mt-3 text-lg text-muted-foreground">
            <span className="font-bold">My goal is simple</span>: to create
            pieces that last and look better with each passing year. I use
            vegetable-tanned leather that ages beautifully, durable waxed
            thread, and traditional saddle stitching.
          </p>
          <p className="quote-text mt-3 text-lg text-muted-foreground">
            Each piece is carefully finished, including edge burnishing and
            protective treatment. This is not mass production. These are pieces
            that gradually become part of your daily life.
          </p>
        </div>

        <div
          id="default-carousel"
          className="relative w-full order-1 md:order-2"
          data-carousel="slide"
        >
          <div className="relative overflow-hidden rounded-base aspect-[4/5] md:aspect-[4/5]">
            <div
              className="hidden duration-700 ease-in-out"
              data-carousel-item="active"
            >
              <img
                src="/images/carousel/01.jpg"
                className="absolute inset-0 block h-full w-full object-cover"
                alt="wallets start with a single piece of leather"
              />
            </div>
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/images/carousel/02.jpg"
                className="absolute inset-0 block h-full w-full object-cover"
                alt="leather is cut and shaped"
              />
            </div>
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/images/carousel/03.jpg"
                className="absolute inset-0 block h-full w-full object-cover"
                alt="leather is stitched together"
              />
            </div>
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/images/carousel/04.jpg"
                className="absolute inset-0 block h-full w-full object-cover"
                alt="leather is finished and treated"
              />
            </div>
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/images/carousel/05.jpg"
                className="absolute inset-0 block h-full w-full object-cover"
                alt="final product"
              />
            </div>
          </div>
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              className="w-3 h-3 rounded-base bg-white/50 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
              aria-current="true"
              aria-label="Slide 1"
              data-carousel-slide-to="0"
            ></button>
            <button
              type="button"
              className="w-3 h-3 rounded-base bg-white/50 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70 "
              aria-current="false"
              aria-label="Slide 2"
              data-carousel-slide-to="1"
            ></button>
            <button
              type="button"
              className="w-3 h-3 rounded-base bg-white/50 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
              aria-current="false"
              aria-label="Slide 3"
              data-carousel-slide-to="2"
            ></button>
            <button
              type="button"
              className="w-3 h-3 rounded-base bg-white/50 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70   "
              aria-current="false"
              aria-label="Slide 4"
              data-carousel-slide-to="3"
            ></button>
            <button
              type="button"
              className="w-3 h-3 rounded-base"
              aria-current="false"
              aria-label="Slide 5"
              data-carousel-slide-to="4"
            ></button>
          </div>
          <button
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-5 h-5 text-white rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m15 19-7-7 7-7"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-5 h-5 text-white rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 5 7 7-7 7"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
