import { ContactSocialLink } from "../types/contactTypes";

interface SocialLinksProps {
  links: ContactSocialLink[];
}

const SocialLinks = ({ links }: SocialLinksProps) => (
  <div className="flex flex-wrap gap-2">
    {links.map((item) => (
      <a
        className="rounded-lg border border-[#d8def7] bg-white px-3 py-2 text-sm font-semibold text-[#405087] hover:bg-[#f3f6ff]"
        href={item.href}
        key={item.id}
        rel="noreferrer"
        target="_blank"
      >
        {item.label}
      </a>
    ))}
  </div>
);

export default SocialLinks;
