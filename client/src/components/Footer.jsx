import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

const instagramUrl = "https://www.instagram.com/leather.stories.studio";
const contactEmail = "order@leather-stories-studio.com";
const licenseNumber = "XXXXXXXX";

const Footer = () => {
  return (
    <footer className="bg-espresso py-14">
      <div className="container px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
          {/* Brand column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <img
                src="/images/logo-light.png"
                alt="Leather Stories Studio Logo"
                className="h-12 w-12 md:h-10 md:w-10 object-contain"
              />

              <h3 className="font-display text-2xl text-primary-foreground leading-none">
                Leather Stories <span className="italic">Studio</span>
              </h3>
            </div>

            <p className="text-primary-foreground/60 font-body text-sm max-w-sm">
              Handcrafted genuine leather goods. Each piece is made to order
              with care and attention to detail.
            </p>
          </div>

          {/* Contact column */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4">
            <h4 className="font-display text-lg text-primary-foreground">
              Get in Touch
            </h4>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Leather Stories Studio Instagram"
              className="flex items-center gap-2 text-gold-accent hover:text-gold-accent/80 transition-colors font-body text-sm"
            >
              <Instagram size={18} />
              <span>leather.stories.studio</span>
            </a>

            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground/80 transition-colors font-body text-sm"
            >
              <Mail size={18} />
              <span>{contactEmail}</span>
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/40 font-body text-xs text-center md:text-left">
            © {new Date().getFullYear()} Leather Stories Studio. All rights
            reserved.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center md:text-right">
            <Link
              to="/return-policy"
              className="text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors font-body text-sm"
            >
              Return Policy
            </Link>

            <span className="hidden sm:inline text-primary-foreground/30">|</span>

            <p className="text-primary-foreground/50 font-body text-sm">
              License # {licenseNumber}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;