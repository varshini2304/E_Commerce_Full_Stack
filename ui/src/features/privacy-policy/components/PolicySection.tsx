import { PolicySection as PolicySectionType } from "../types/privacyPolicyTypes";

interface PolicySectionProps {
  id: string;
  section: PolicySectionType;
}

const PolicySection = ({ id, section }: PolicySectionProps) => (
  <section className="scroll-mt-24" id={id}>
    <h2 className="text-2xl font-semibold text-[#2b3869]">{section.title}</h2>
    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#5f6a96]">{section.content}</p>
  </section>
);

export default PolicySection;
