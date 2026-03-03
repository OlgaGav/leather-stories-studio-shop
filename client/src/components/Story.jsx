export default function Story() {
  return (
    <section id="story" className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Crafted for daily use.
          </h2>
          <p className="mt-3 text-neutral-600">
            Clean lines, durable stitching, and a finish that gets better over
            time. Each wallet is made in small batches with attention to detail.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-neutral-700">
            <li>• Full-grain leather</li>
            <li>• Minimal, premium design</li>
            <li>• Optional personalization</li>
            <li>• Made in small batches</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square rounded-xl bg-neutral-200" />
          <div className="aspect-square rounded-xl bg-neutral-200" />
          <div className="aspect-square rounded-xl bg-neutral-200" />
          <div className="aspect-square rounded-xl bg-neutral-200" />
        </div>
      </div>
    </section>
  );
}