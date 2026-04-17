import { PolicySection } from "../types/privacyPolicyTypes";

interface TableOfContentsProps {
  sections: PolicySection[];
  activeSectionId: string;
  onSelect: (sectionId: string) => void;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const TableOfContents = ({ sections, activeSectionId, onSelect }: TableOfContentsProps) => (
  <aside className="rounded-2xl border border-[#dfe5fb] bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:h-fit">
    <h2 className="text-base font-semibold text-[#2b3869]">Contents</h2>
    <nav className="mt-3 space-y-1">
      {sections.map((section) => {
        const sectionId = slugify(section.title);
        const isActive = activeSectionId === sectionId;

        return (
          <button
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
              isActive
                ? "bg-[#e8edff] font-semibold text-[#2f4da9]"
                : "text-[#5f6a96] hover:bg-[#f4f6ff]"
            }`}
            key={sectionId}
            onClick={() => onSelect(sectionId)}
            type="button"
          >
            {section.title}
          </button>
        );
      })}
    </nav>
  </aside>
);

export default TableOfContents;
