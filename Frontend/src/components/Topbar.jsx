import { Menu, Bell } from "lucide-react";

const Topbar = ({ title, subtitle, onMenuClick }) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
      <div className="flex items-start gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden mt-1 text-gray-600 shrink-0"
        >
          <Menu size={24} />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2 border border-gray-200 rounded-full pl-1 pr-4 py-1">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <span className="text-sm font-medium text-slate-800">Admin User</span>
        </div>
      </div>
    </div>
  );
}

export default Topbar