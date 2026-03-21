import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-espresso py-14">
      <div className="container px-6">
        <div className="flex flex-col items-center text-center gap-6">
          <h3 className="font-display text-2xl text-primary-foreground">
            Leather Stories <span className="italic">Studio</span>
          </h3>
          <p className="text-primary-foreground/60 font-body text-sm max-w-sm">
            Handcrafted genuine leather goods. Each piece is made to order with care and attention to detail.
          </p>
          <a
            href="https://www.instagram.com/leather.stories.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gold-accent hover:text-gold-accent/80 transition-colors font-body text-sm"
          >
            {/* <Instagram size={18} color="currentColor" weight="fill" /> */}
            @leather.stories.studio
          </a>
          <Link
            to="/return-policy"
            className="text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors font-body text-sm"
          >
            Return Policy
          </Link>
          <div className="border-t border-primary-foreground/10 w-full pt-6 mt-2">
            <p className="text-primary-foreground/40 font-body text-xs">
              © {new Date().getFullYear()} Leather Stories Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;