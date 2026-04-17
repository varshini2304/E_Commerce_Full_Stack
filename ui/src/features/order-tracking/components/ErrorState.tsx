interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = "Unable to load order",
  description = "Please check your connection and try again.",
  onRetry,
}: ErrorStateProps) => (
  <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
    <h1 className="text-lg font-semibold text-red-900">{title}</h1>
    <p className="mt-2 text-sm text-red-700">{description}</p>
    {onRetry ? (
      <button
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        onClick={onRetry}
        type="button"
      >
        Retry
      </button>
    ) : null}
  </section>
);

export default ErrorState;
