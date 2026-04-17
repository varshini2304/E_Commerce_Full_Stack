import { OrderStatus } from "../types/orderTrackingTypes";

interface StatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CLASS_MAP: Record<OrderStatus, string> = {
  pending: "bg-[#fff4d8] text-[#9f6a00]",
  processing: "bg-[#fff4d8] text-[#9f6a00]",
  shipped: "bg-[#e4eeff] text-[#2d5ea5]",
  out_for_delivery: "bg-[#e4eeff] text-[#2d5ea5]",
  delivered: "bg-[#dff4e4] text-[#2c7a44]",
  cancelled: "bg-[#fce0e0] text-[#a53d3d]",
};

const STATUS_LABEL_MAP: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`rounded-full px-4 py-1 text-sm font-semibold ${STATUS_CLASS_MAP[status]}`}>
    {STATUS_LABEL_MAP[status]}
  </span>
);

export default StatusBadge;
