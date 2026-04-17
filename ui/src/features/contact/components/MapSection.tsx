interface MapSectionProps {
  mapEmbedUrl: string;
}

const MapSection = ({ mapEmbedUrl }: MapSectionProps) => (
  <section className="overflow-hidden rounded-2xl border border-[#dfe5fb] bg-white shadow-sm">
    <iframe
      allowFullScreen
      className="h-72 w-full"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={mapEmbedUrl}
      title="Company location"
    />
  </section>
);

export default MapSection;
