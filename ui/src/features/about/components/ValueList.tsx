interface ValueListProps {
  values: string[];
}

const ValueList = ({ values }: ValueListProps) => (
  <section className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm">
    <h2 className="text-xl font-semibold text-[#2b3869]">Our Values</h2>
    <ul className="mt-4 space-y-2">
      {values.map((value) => (
        <li className="flex items-start gap-3 text-sm text-[#5f6a96]" key={value}>
          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#4f69cd]" />
          <span>{value}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default ValueList;
