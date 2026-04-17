import TimelineStep from "./TimelineStep";
import { TimelineStepModel } from "../types/orderTrackingTypes";

interface OrderTimelineProps {
  steps: TimelineStepModel[];
}

const OrderTimeline = ({ steps }: OrderTimelineProps) => (
  <section className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm">
    <h2 className="text-xl font-semibold text-[#2b3869]">Order Timeline</h2>
    <div className="mt-4">
      {steps.map((step, index) => (
        <TimelineStep isLast={index === steps.length - 1} key={step.key} step={step} />
      ))}
    </div>
  </section>
);

export default OrderTimeline;
