import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ClipboardList, CheckCircle2, PauseCircle, Database, TrendingUp, Landmark, Package, Activity } from "lucide-react";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { getDashboardSummary, getRecentActivity } from "../api/dashboard";

// Fallback data shown until the API responds (or if the request fails).
// Replace/remove once your backend is wired up.
const fallbackSummary = {
  totalRules: 9,
  activeRules: 8,
  inactiveRules: 1,
  datasets: [
    { name: "Equity Trades", icon: "equity", rules: 4, active: 4, progress: 100 },
    { name: "Bond Trades", icon: "bond", rules: 2, active: 2, progress: 100 },
    { name: "Commodity Trades", icon: "commodity", rules: 3, active: 2, progress: 67 },
  ],
};

const fallbackActivity = [
  { text: "Rule updated: Equity Trades / price", time: "2 hours ago" },
  { text: "New rule created: Bond Trades / coupon_rate", time: "yesterday" },
  { text: "Execution completed: 24 rules ran, 2 failures", time: "2 days ago" },
];

const datasetIcons = { equity: TrendingUp, bond: Landmark, commodity: Package };

const Dashboard = () => {
  const { openSidebar } = useOutletContext()

  const [summary, setSummary] = useState(fallbackSummary)
  const [activity, setActivity] = useState(fallbackActivity)

  useEffect(() => {
    getDashboardSummary().then(setSummary).catch(() => {})
    getRecentActivity().then(setActivity).catch(() => {})
  }, [])

  return (
    <div>
      <Topbar
        title="Dashboard"
        subtitle="Overview of your data quality pipeline"
        onMenuClick={openSidebar}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          icon={ClipboardList}
          iconBg="#ede9fe"
          iconColor="#7c3aed"
          label="Total Rules"
          value={summary.totalRules}
          sublabel="All datasets"
        />

        <StatCard
          icon={CheckCircle2}
          iconBg="#dcfce7"
          iconColor="#16a34a"
          label="Active Rules"
          value={summary.activeRules}
          sublabel="Enabled rules"
        />

        <StatCard
          icon={PauseCircle}
          iconBg="#fef3c7"
          iconColor="#d97706"
          label="Inactive Rules"
          value={summary.inactiveRules}
          sublabel="Disabled rules"
        />

        <StatCard
          icon={Database}
          iconBg="#dbeafe"
          iconColor="#2563eb"
          label="Datasets"
          value={summary.datasets.length}
          sublabel="Equity, Bond, Commodity"
        />
      </div>

      {/* Datasets overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Datasets Overview
          </h2>

          <a
            href="/validation-rules"
            className="text-sm font-medium text-brand hover:underline"
          >
            Manage rules &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary.datasets.map((ds) => {
            const Icon = datasetIcons[ds.icon] || Database

            return (
              <div
                key={ds.name}
                className="border border-gray-100 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-light flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-brand" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {ds.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {ds.rules} Rules{' '}
                      <span className="text-green-600">
                        {ds.active} Active
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${ds.progress}%` }}
                    />
                  </div>

                  <span className="text-xs text-gray-500 shrink-0">
                    {ds.progress}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
          Recent Activity
        </h2>

        <div className="divide-y divide-gray-100">
          {activity.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Activity
                  size={16}
                  className="text-gray-400 shrink-0"
                />

                <p className="text-sm text-slate-700 truncate">
                  {item.text}
                </p>
              </div>

              <span className="text-xs text-gray-400 shrink-0">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
