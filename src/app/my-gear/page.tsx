export default function MyGearPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Gear</h1>
      <p className="text-muted-foreground text-lg">Assets currently assigned to you.</p>
      <div className="rounded-xl border border-dashed p-20 text-center text-muted-foreground">
        [Your Assigned Assets Loading...]
      </div>
    </div>
  );
}
