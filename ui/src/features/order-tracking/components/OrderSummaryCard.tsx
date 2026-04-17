interface OrderSummaryCardProps {
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const OrderSummaryCard = ({ totalAmount, paymentMethod, paymentStatus }: OrderSummaryCardProps) => (
  <section className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm">
    <h2 className="text-xl font-semibold text-[#2b3869]">Order Summary</h2>
    <div className="mt-4 space-y-3 text-sm text-[#5d678f]">
      <p className="flex items-center justify-between">
        <span>Total Amount</span>
        <span className="text-base font-semibold text-[#2b3869]">{formatPrice(totalAmount)}</span>
      </p>
      <p className="flex items-center justify-between">
        <span>Payment Method</span>
        <span className="font-medium text-[#2b3869]">{paymentMethod}</span>
      </p>
      <p className="flex items-center justify-between">
        <span>Payment Status</span>
        <span className="font-medium capitalize text-[#2b3869]">{paymentStatus}</span>
      </p>
    </div>
  </section>
);

export default OrderSummaryCard;
