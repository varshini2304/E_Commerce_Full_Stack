import { ContactInfo } from "../types/contactTypes";
import SocialLinks from "./SocialLinks";

interface ContactInfoCardProps {
  info: ContactInfo;
}

const ContactInfoCard = ({ info }: ContactInfoCardProps) => (
  <section className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm">
    <h2 className="text-xl font-semibold text-[#2b3869]">Company Info</h2>
    <div className="mt-4 space-y-3 text-sm text-[#5f6a96]">
      <p>
        <span className="font-semibold text-[#2b3869]">Address: </span>
        {info.address}
      </p>
      <p>
        <span className="font-semibold text-[#2b3869]">Phone: </span>
        {info.phone}
      </p>
      <p>
        <span className="font-semibold text-[#2b3869]">Email: </span>
        {info.email}
      </p>
    </div>
    <div className="mt-4">
      <SocialLinks links={info.socialLinks} />
    </div>
  </section>
);

export default ContactInfoCard;
