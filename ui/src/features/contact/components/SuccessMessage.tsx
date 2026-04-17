interface SuccessMessageProps {
  message: string;
}

const SuccessMessage = ({ message }: SuccessMessageProps) => (
  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
    {message}
  </div>
);

export default SuccessMessage;
