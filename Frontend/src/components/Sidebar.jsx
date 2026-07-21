import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ClipboardList,
  Database,
  PlayCircle,
  BarChart2,
  Bell,
  Settings,
  X,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/validation-rules", label: "Validation Rules", icon: ClipboardList },
  { to: "/datasets", label: "Datasets", icon: Database },
  { to: "/executions", label: "Executions", icon: PlayCircle },
  { to: "/results", label: "Results", icon: BarChart2 },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-sidebar text-gray-300 flex flex-col z-40
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:shrink-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold leading-tight">Data Quality</p>
              <p className="text-xs text-gray-500">Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400">
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer / user */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-brand/80 flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar
