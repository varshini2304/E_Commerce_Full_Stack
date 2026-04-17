import { TermsSection as TermsSectionType } from "../types/termsTypes";

interface TermsSectionProps {
  id: string;
  section: TermsSectionType;
}

const TermsSection = ({ id, section }: TermsSectionProps) => (
  <section className="scroll-mt-24" id={id}>
    <h2 className="text-2xl font-semibold text-[#2b3869]">{section.title}</h2>
    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#5f6a96]">{section.content}</p>
  </section>
);

export default TermsSection;
