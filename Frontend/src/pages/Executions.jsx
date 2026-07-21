import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Topbar from '../components/Topbar'
import Badge from '../components/Badge'
import { getExecutions } from '../api/executions'

const fallbackExecutions = [
  {
    id: 'EX-1042',
    dataset: 'Equity Trades',
    started: 'Today, 09:12',
    duration: '38s',
    rules: 12,
    failed: 0,
    status: 'Success',
  },
  {
    id: 'EX-1041',
    dataset: 'Bond Trades',
    started: 'Today, 08:45',
    duration: '22s',
    rules: 7,
    failed: 0,
    status: 'Success',
  },
  {
    id: 'EX-1040',
    dataset: 'Commodity Trades',
    started: 'Yesterday, 22:10',
    duration: '17s',
    rules: 5,
    failed: 2,
    status: 'Failed',
  },
  {
    id: 'EX-1039',
    dataset: 'Equity Trades',
    started: 'Yesterday, 12:00',
    duration: '41s',
    rules: 12,
    failed: 0,
    status: 'Success',
  },
  {
    id: 'EX-1038',
    dataset: 'Bond Trades',
    started: 'Yesterday, 09:00',
    duration: '24s',
    rules: 7,
    failed: 0,
    status: 'Running',
  },
]

const statusTone = {
  Success: 'green',
  Failed: 'red',
  Running: 'yellow',
}

const Executions = () => {
  const { openSidebar } = useOutletContext()

  const [executions, setExecutions] = useState(fallbackExecutions)

  useEffect(() => {
    getExecutions().then(setExecutions).catch(() => {})
  }, [])

  return (
    <div>
      <Topbar
        title="Executions"
        subtitle="Recent validation runs across all datasets"
        onMenuClick={openSidebar}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100">
                <th className="py-2 px-5 sm:px-2 font-medium">Run ID</th>
                <th className="py-2 px-2 font-medium">Dataset</th>
                <th className="py-2 px-2 font-medium">Started</th>
                <th className="py-2 px-2 font-medium">Duration</th>
                <th className="py-2 px-2 font-medium">Rules</th>
                <th className="py-2 px-2 font-medium">Failed</th>
                <th className="py-2 px-5 sm:px-2 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {executions.map((run) => (
                <tr key={run.id}>
                  <td className="py-3 px-5 sm:px-2 font-semibold text-slate-900">
                    {run.id}
                  </td>

                  <td className="py-3 px-2 text-slate-700">
                    {run.dataset}
                  </td>

                  <td className="py-3 px-2 text-gray-500">
                    {run.started}
                  </td>

                  <td className="py-3 px-2 text-slate-700">
                    {run.duration}
                  </td>

                  <td className="py-3 px-2 text-slate-700">
                    {run.rules}
                  </td>

                  <td className="py-3 px-2 text-slate-700">
                    {run.failed}
                  </td>

                  <td className="py-3 px-5 sm:px-2">
                    <Badge tone={statusTone[run.status] || 'gray'}>
                      {run.status}
                    </Badge>
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

export default Executions