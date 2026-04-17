import { TimelineStepModel } from "../types/orderTrackingTypes";

interface TimelineStepProps {
  step: TimelineStepModel;
  isLast: boolean;
}

const ICON_MAP: Record<TimelineStepModel["icon"], string> = {
  placed: "PP",
  processing: "PR",
  shipped: "SH",
  delivery: "OD",
  delivered: "DL",
};

const getDotClasses = (state: TimelineStepModel["state"]) => {
  if (state === "completed") {
    return "bg-[#3557c1] text-white border-[#3557c1]";
  }

  if (state === "current") {
    return "bg-white text-[#3557c1] border-[#3557c1]";
  }

  return "bg-[#f3f5fe] text-[#97a1c5] border-[#d9e0fa]";
};

const TimelineStep = ({ step, isLast }: TimelineStepProps) => (
  <div className="grid grid-cols-[40px_1fr] gap-3">
    <div className="flex flex-col items-center">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-semibold ${getDotClasses(step.state)}`}
      >
        {ICON_MAP[step.icon]}
      </div>
      {!isLast ? <div className="mt-2 h-full w-px bg-[#dbe2fa]" /> : null}
    </div>
    <div className="pb-6">
      <p
        className={`text-sm font-semibold ${
          step.state === "upcoming" ? "text-[#8b95b8]" : "text-[#2f3d70]"
        }`}
      >
        {step.title}
      </p>
      <p className="mt-1 text-xs text-[#7a84ad]">
        {step.dateTime ? new Date(step.dateTime).toLocaleString() : "Waiting for update"}
      </p>
    </div>
  </div>
);

export default TimelineStep;
