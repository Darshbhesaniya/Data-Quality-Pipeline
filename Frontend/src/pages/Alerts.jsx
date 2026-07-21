import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import Topbar from '../components/Topbar'
import Badge from '../components/Badge'
import { getAlerts } from '../api/alerts'

const fallbackAlerts = [
  {
    id: 1,
    message: 'Commodity Trades / quantity rule is currently inactive',
    severity: 'Warning',
    time: '2 days ago',
  },
  {
    id: 2,
    message: 'Execution EX-1040 failed with 2 validation errors',
    severity: 'Critical',
    time: 'yesterday',
  },
]

const severityTone = {
  Warning: 'yellow',
  Critical: 'red',
  Info: 'blue',
}

const Alerts = () => {
  const { openSidebar } = useOutletContext()

  const [alerts, setAlerts] = useState(fallbackAlerts)

  useEffect(() => {
    getAlerts().then(setAlerts).catch(() => {})
  }, [])

  return (
    <div>
      <Topbar
        title="Alerts"
        subtitle="Notifications about your validation pipeline"
        onMenuClick={openSidebar}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        {alerts.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No alerts right now.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between gap-4 py-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <AlertTriangle
                    size={18}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />

                  <div className="min-w-0">
                    <p className="text-sm text-slate-800">
                      {alert.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {alert.time}
                    </p>
                  </div>
                </div>

                <Badge tone={severityTone[alert.severity] || 'gray'}>
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Alerts