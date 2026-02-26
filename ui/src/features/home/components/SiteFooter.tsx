import { FooterData } from "../../../types/home";

interface SiteFooterProps {
  data: FooterData;
}

const socialIconClassName = "h-5 w-5 text-white/90";

const renderSocialIcon = (icon: string) => {
  if (icon === "facebook") {
    return (
      <svg className={socialIconClassName} fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.4 21v-8h2.7l.4-3.1h-3V8.1c0-.9.3-1.5 1.6-1.5h1.5V3.8c-.3 0-1.1-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9V10H8v3h2.5v8h2.9Z" />
      </svg>
    );
  }

  if (icon === "twitter") {
    return (
      <svg className={socialIconClassName} fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 6.1c-.7.3-1.4.5-2.2.7a3.7 3.7 0 0 0 1.6-2c-.7.4-1.6.8-2.5 1A3.7 3.7 0 0 0 11.5 9c0 .3 0 .6.1.9A10.6 10.6 0 0 1 4 5.9a3.7 3.7 0 0 0 1.2 4.9 3.6 3.6 0 0 1-1.7-.5v.1c0 1.8 1.3 3.3 3 3.6-.3.1-.7.2-1 .2-.2 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.5 2.6A7.4 7.4 0 0 1 3 18.3 10.5 10.5 0 0 0 8.7 20c6.8 0 10.6-5.7 10.6-10.6v-.5A7.8 7.8 0 0 0 21 6.1Z" />
      </svg>
    );
  }

  return (
    <svg className={socialIconClassName} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 0 0-3.9 19.2c-.1-.9-.2-2.3 0-3.3.2-.8 1.2-5.2 1.2-5.2s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6 1 0 1.5.7 1.5 1.6 0 1-.6 2.5-.9 3.8-.3 1.1.6 2 1.8 2 2.2 0 3.7-2.8 3.7-6.1 0-2.5-1.7-4.3-4.8-4.3-3.5 0-5.7 2.6-5.7 5.5 0 1 .3 1.8.8 2.4.2.2.2.3.1.6l-.3 1.1c-.1.3-.3.4-.6.3-1.7-.7-2.5-2.7-2.5-4.9 0-3.7 3.1-8.1 9.2-8.1 4.9 0 8.1 3.6 8.1 7.5 0 5.1-2.8 8.9-6.9 8.9-1.4 0-2.7-.7-3.1-1.6l-.8 3.1a11 11 0 0 1-1.2 2.8A10 10 0 1 0 12 2Z" />
    </svg>
  );
};

const SiteFooter = ({ data }: SiteFooterProps) => (
  <footer className="bg-gradient-to-b from-[#213b7c] to-[#142653] px-6 py-6 text-white md:px-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <nav className="flex flex-wrap items-center gap-6">
        {data.links.map((link) => (
          <a
            className="text-sm text-white/90 transition-colors hover:text-white"
            href={link.href}
            key={link.label}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        {data.socialLinks.map((item) => (
          <a
            aria-label={item.label}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            href={item.href}
            key={item.id}
          >
            {renderSocialIcon(item.icon)}
          </a>
        ))}
      </div>
    </div>
    <p className="mt-6 border-t border-white/20 pt-4 text-xs text-white/60">
      {data.copyrightText}
    </p>
  </footer>
);

export default SiteFooter;
