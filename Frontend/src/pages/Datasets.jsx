import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { TrendingUp, Landmark, Package } from 'lucide-react'
import Topbar from '../components/Topbar'
import { getDatasets } from '../api/datasets'

const fallbackDatasets = [
  {
    name: 'Equity Trades',
    icon: 'equity',
    rules: 4,
    active: 4,
    progress: 100,
    rows: '12,486',
  },
  {
    name: 'Bond Trades',
    icon: 'bond',
    rules: 2,
    active: 2,
    progress: 100,
    rows: '3,200',
  },
  {
    name: 'Commodity Trades',
    icon: 'commodity',
    rules: 3,
    active: 2,
    progress: 67,
    rows: '1,532',
  },
]

const icons = {
  equity: TrendingUp,
  bond: Landmark,
  commodity: Package,
}

const Datasets = () => {
  const { openSidebar } = useOutletContext()

  const [datasets, setDatasets] = useState(fallbackDatasets)

  useEffect(() => {
    getDatasets().then(setDatasets).catch(() => {})
  }, [])

  return (
    <div>
      <Topbar
        title="Datasets"
        subtitle="All datasets connected to your pipeline"
        onMenuClick={openSidebar}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {datasets.map((ds) => {
          const Icon = icons[ds.icon] || TrendingUp

          return (
            <div
              key={ds.name}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-brand" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {ds.name}
                  </p>

                  <p className="text-xs text-gray-500">{ds.rows} rows</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                {ds.rules} Rules &middot;{' '}
                <span className="text-green-600">{ds.active} Active</span>
              </p>

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
  )
}

export default Datasets