const Loader = () => (
  <div className="flex min-h-[320px] items-center justify-center">
    <div className="flex items-center gap-3 rounded-xl border border-[#dfe4fb] bg-white px-5 py-3 text-[#344277] shadow-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#4f69cd] border-t-transparent" />
      <span className="text-sm font-semibold">Loading order details...</span>
    </div>
  </div>
);

export default Loader;
