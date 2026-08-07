"use client";

const options = [
  { label: "1D", value: 1 },
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
];

export default function TimeframeSwitch({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={`px-3 py-1 rounded-md text-sm ${
            value === item.value
              ? "bg-primary text-white"
              : "bg-muted"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}