import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Topbar from '../components/Topbar'
import { saveSettings } from '../api/settings'

const Settings = () => {
  const { openSidebar } = useOutletContext()

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    try {
      await saveSettings({ profile, notifications })
      setSaved(true)
    } catch {
      // Swap this for a proper toast/error UI once your API is connected.
      alert('Could not save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Topbar
        title="Settings"
        subtitle="Manage your account and pipeline preferences"
        onMenuClick={openSidebar}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            Profile
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Name
              </label>

              <input
                className="input"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>

              <input
                className="input"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    email: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            Notifications
          </h2>

          <div className="space-y-3">
            <ToggleRow
              label="Email alerts"
              checked={notifications.email}
              onChange={(v) =>
                setNotifications((n) => ({
                  ...n,
                  email: v,
                }))
              }
            />

            <ToggleRow
              label="Slack alerts"
              checked={notifications.slack}
              onChange={(v) =>
                setNotifications((n) => ({
                  ...n,
                  slack: v,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        {saved && (
          <span className="text-sm text-green-600">
            Saved!
          </span>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand text-white rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

const ToggleRow = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 cursor-pointer">
      <span className="text-sm text-slate-700">
        {label}
      </span>

      <input
        type="checkbox"
        className="w-4 h-4 rounded accent-brand"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}

export default Settings