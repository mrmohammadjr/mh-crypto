export default function CurrencySkeleton() {
  return (
    <div className="space-y-3 px-6 md:px-10 py-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-12 w-full rounded-lg bg-muted relative overflow-hidden"
        >
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ))}
    </div>
  );
}
