import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  CheckCircle2,
  XCircle,
  BarChart2,
} from 'lucide-react'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import {
  getResultsSummary,
  getRulePerformance,
} from '../api/results'

const fallbackSummary = {
  passed: '29,682',
  failed: '18',
  passRate: '99.94%',
}

const fallbackPerformance = [
  {
    rule: 'Equity Trades / price > 0',
    passed: '12,480',
    failed: 4,
    passRate: 99.97,
  },
  {
    rule: 'Equity Trades / quantity > 0',
    passed: '12,482',
    failed: 2,
    passRate: 99.98,
  },
  {
    rule: 'Bond Trades / face_value > 0',
    passed: '3,200',
    failed: 0,
    passRate: 100,
  },
  {
    rule: 'Commodity Trades / price > 0',
    passed: '1,520',
    failed: 12,
    passRate: 99.21,
  },
]

const Results = () => {
  const { openSidebar } = useOutletContext()

  const [summary, setSummary] = useState(fallbackSummary)
  const [performance, setPerformance] = useState(fallbackPerformance)

  useEffect(() => {
    getResultsSummary().then(setSummary).catch(() => {})
    getRulePerformance().then(setPerformance).catch(() => {})
  }, [])

  return (
    <div>
      <Topbar
        title="Results"
        subtitle="Pass and fail metrics for the latest runs"
        onMenuClick={openSidebar}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          icon={CheckCircle2}
          iconBg="#dcfce7"
          iconColor="#16a34a"
          label="Records Passed"
          value={summary.passed}
          sublabel="Last 24 hours"
        />

        <StatCard
          icon={XCircle}
          iconBg="#fee2e2"
          iconColor="#dc2626"
          label="Records Failed"
          value={summary.failed}
          sublabel="Last 24 hours"
        />

        <StatCard
          icon={BarChart2}
          iconBg="#ede9fe"
          iconColor="#7c3aed"
          label="Overall Pass Rate"
          value={summary.passRate}
          sublabel="All rules"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">
          Rule Performance
        </h2>

        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100">
                <th className="py-2 px-5 sm:px-2 font-medium">Rule</th>
                <th className="py-2 px-2 font-medium">Passed</th>
                <th className="py-2 px-2 font-medium">Failed</th>
                <th className="py-2 px-5 sm:px-2 font-medium">
                  Pass Rate
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {performance.map((row) => (
                <tr key={row.rule}>
                  <td className="py-3 px-5 sm:px-2 text-slate-700">
                    {row.rule}
                  </td>

                  <td className="py-3 px-2 text-green-600">
                    {row.passed}
                  </td>

                  <td className="py-3 px-2 text-red-500">
                    {row.failed}
                  </td>

                  <td className="py-3 px-5 sm:px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-24 sm:w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${row.passRate}%` }}
                        />
                      </div>

                      <span className="text-gray-600 shrink-0">
                        {row.passRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Results