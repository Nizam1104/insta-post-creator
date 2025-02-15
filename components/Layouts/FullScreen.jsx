export default function FullScreenLayout({ children }) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {children}
    </div>
  );
}
