const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, sublabel }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
      {sublabel && <p className="text-xs sm:text-sm text-gray-400 mt-1">{sublabel}</p>}
    </div>
  );
}

export default StatCard