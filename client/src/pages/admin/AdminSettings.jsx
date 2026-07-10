import { useState, useEffect } from 'react';
import { FiSettings, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { settingsService } from '../../services/apiServices';
import Button from '../../components/common/Button';
import { Spinner } from '../../components/common/Loading';

const AdminSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({});

  useEffect(() => {
    settingsService.adminGetAll().then((res) => {
      const data = res.data.data || [];
      setSettings(data);
      const vals = {};
      data.forEach((s) => { vals[s.key] = s.value; });
      setValues(vals);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.update(values);
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const grouped = settings.reduce((acc, s) => {
    const group = s.group || 'general';
    if (!acc[group]) acc[group] = [];
    acc[group].push(s);
    return acc;
  }, {});

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
            <FiSettings className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
        <Button onClick={handleSave} loading={saving} icon={<FiSave />}>
          Save Changes
        </Button>
      </div>

      {Object.entries(grouped).map(([group, items]) => (
        <div key={group} className="card p-6">
          <h3 className="font-semibold text-gray-900 capitalize mb-5 pb-3 border-b border-gray-100">
            {group.replace(/_/g, ' ')} Settings
          </h3>
          <div className="space-y-4">
            {items.map((setting) => (
              <div key={setting.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {setting.label}
                  {setting.isPublic && <span className="ml-2 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Public</span>}
                </label>
                {setting.type === 'number' ? (
                  <input
                    type="number"
                    value={values[setting.key] || ''}
                    onChange={(e) => setValues({ ...values, [setting.key]: Number(e.target.value) })}
                    className="input-field"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[setting.key] || ''}
                    onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                    className="input-field"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSettings;
