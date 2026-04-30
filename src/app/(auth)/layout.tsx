export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#F4F4F5]">
      <div className="w-full max-w-7xl">
        {children}
      </div>
    </main>
  );
}
