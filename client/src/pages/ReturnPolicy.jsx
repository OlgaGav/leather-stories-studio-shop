const CONTACT_EMAIL = "order@leather-stories-studio.com";

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-xl md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-2 font-body text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="list-disc list-inside space-y-1 mt-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function ReturnPolicy() {
  return (
    <div className="w-full bg-background text-foreground">
      <div className="container mx-auto max-w-3xl px-6 py-24">
        <p className="text-[11px] tracking-[0.22em] uppercase text-gold-accent">
          Customer care
        </p>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Return &amp; Exchange Policy
        </h1>
        <p className="mt-4 font-body text-muted-foreground leading-relaxed">
          At Leather Stories Studio, each item is handcrafted from natural
          vegetable-tanned leather. Due to the nature of handmade production,
          slight variations in color, texture, and stitching are normal and part
          of the character of the product.
        </p>

        <div className="mt-12 space-y-10">
          <Section title="Returns (Non-Personalized Items)">
            <p>
              We accept returns of non-personalized items within{" "}
              <span className="text-foreground font-medium">
                7 days of delivery
              </span>
              .
            </p>
            <p>To be eligible for a return:</p>
            <BulletList
              items={[
                "The item must be unused and in original condition",
                "The item must be returned in its original packaging",
              ]}
            />
            <p className="mt-2">
              Customers are responsible for return shipping costs. Original
              shipping fees are non-refundable.
            </p>
          </Section>

          <Section title="Personalized Items">
            <p>
              All personalized or custom-made items (including initials, names,
              or logos) are{" "}
              <span className="text-foreground font-medium">
                non-refundable and cannot be exchanged
              </span>
              .
            </p>
            <p>
              Exception: if there is an error or defect caused by us.
            </p>
          </Section>

          <Section title="Defective or Incorrect Items">
            <p>
              If you receive a defective or incorrect item, please contact us
              within{" "}
              <span className="text-foreground font-medium">
                5 days of delivery
              </span>
              .
            </p>
            <p>We will:</p>
            <BulletList items={["Replace the item, or", "Offer a full refund"]} />
            <p className="mt-2">In such cases, we cover all shipping costs.</p>
          </Section>

          <Section title="Exchanges">
            <p>
              We may offer exchanges for non-personalized items (subject to
              availability). Customers are responsible for return shipping.
            </p>
          </Section>

          <Section title="Natural Material Disclaimer">
            <p>
              Vegetable-tanned leather develops a patina over time and may show
              natural marks, grain variation, or tonal differences. These are{" "}
              <span className="text-foreground font-medium">
                not considered defects
              </span>
              .
            </p>
          </Section>

          <Section title="Lifetime Stitching Warranty">
            <p>
              We provide a lifetime warranty on stitching. If the stitching
              fails due to a manufacturing defect, we will repair your item free
              of charge.
            </p>
            <p className="mt-2 text-foreground font-medium">
              This warranty covers:
            </p>
            <BulletList items={["Stitching failure under normal use"]} />
            <p className="mt-2 text-foreground font-medium">
              This warranty does not cover:
            </p>
            <BulletList
              items={[
                "Damage caused by misuse, excessive wear, or accidental damage",
                "Cosmetic changes to leather (scratches, patina, discoloration)",
              ]}
            />
            <p className="mt-2">
              Customers may be responsible for shipping costs related to
              warranty repairs.
            </p>
          </Section>

          <Section title="Repair Policy">
            <p>
              We stand behind the quality of our work. If your item develops a
              structural issue, please contact us — we will evaluate repair
              options on a case-by-case basis.
            </p>
          </Section>

          <Section title="How to Request a Return or Report an Issue">
            <p>Please contact us at:</p>
            <p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-gold-accent hover:text-gold-accent/80 transition-colors underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="mt-2">Include:</p>
            <BulletList
              items={[
                "Your order number",
                "A brief description of the issue",
                "Photos (if applicable)",
              ]}
            />
            <p className="mt-4 text-foreground">
              Thank you for supporting handcrafted work.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
