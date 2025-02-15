import CanvasConfigurations from "../CanvasConfigurations";

export default function PrimaryLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-gray-800 shadow-sm z-50 px-6 flex items-center">
        <h1 className="text-xl font-semibold text-white">Drawvinci</h1>
      </header>

      {/* Main Content with Three Columns */}
      <div className="pt-[60px] h-[calc(100vh-0px)]"> {/* Offset for fixed header and full height */}
        <div className="container mx-auto h-full w-full">
          <div className="flex gap-6 py-6 h-full">
            {/* Left Column */}
            <div className="w-[30%] bg-gray-800 rounded-lg shadow-sm p-4 h-full overflow-y-auto">
              <CanvasConfigurations />
            </div>

            {/* Middle Column */}
            <div className="w-[50%] bg-gray-800 rounded-lg shadow-sm p-4 h-full overflow-y-auto">
              <main className="text-white h-full">{children}</main>
            </div>

            {/* Right Column */}
            {/* <div className="w-[20%] bg-gray-800 rounded-lg shadow-sm p-4 h-full">
              <p className="text-white">Right Column</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
