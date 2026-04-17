import { DeliveryDetailsModel } from "../types/orderTrackingTypes";

interface DeliveryDetailsProps {
  details: DeliveryDetailsModel;
}

const DeliveryDetails = ({ details }: DeliveryDetailsProps) => (
  <section className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm">
    <h2 className="text-xl font-semibold text-[#2b3869]">Delivery Details</h2>
    <div className="mt-4 space-y-3 text-sm text-[#5d678f]">
      <p>
        <span className="font-medium text-[#2b3869]">Customer: </span>
        {details.customerName}
      </p>
      <p>
        <span className="font-medium text-[#2b3869]">Address: </span>
        {details.address}
      </p>
      <p>
        <span className="font-medium text-[#2b3869]">Phone: </span>
        {details.phoneNumber}
      </p>
      <p>
        <span className="font-medium text-[#2b3869]">Estimated Delivery: </span>
        {details.estimatedDelivery
          ? new Date(details.estimatedDelivery).toLocaleDateString()
          : "Not available"}
      </p>
    </div>
  </section>
);

export default DeliveryDetails;
