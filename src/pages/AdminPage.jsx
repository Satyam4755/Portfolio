import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { getAdminPortfolio, saveAdminPortfolio, uploadAdminMedia } from '../services';

function ListEditor({ title, items, setItems, shape, onUploadField }) {
  function update(index, key, value) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    setItems(next);
  }

  function addItem() {
    setItems([...items, { ...shape }]);
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="stack">
        {items.map((item, index) => (
          <article key={`${title}-${index}`} className="tile">
            {Object.keys(shape).map((key) => (
              <label key={key}>
                <span>{key}</span>
                <input value={item[key] || ''} onChange={(e) => update(index, key, e.target.value)} />
                {onUploadField && key === 'imageUrl' ? (
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      onUploadField(index, key, file);
                      e.target.value = '';
                    }}
                  />
                ) : null}
              </label>
            ))}
            <button className="btn danger" type="button" onClick={() => removeItem(index)}>
              Remove
            </button>
          </article>
        ))}
        <button className="btn ghost" type="button" onClick={addItem}>
          Add {title.slice(0, -1)}
        </button>
      </div>
    </section>
  );
}

export default function AdminPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [status, setStatus] = useState('');
  const [uploadStatus, setUploadStatus] = useState({});
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getAdminPortfolio().then(setPortfolio).catch((e) => setStatus(e.message));
  }, []);

  if (!portfolio) {
    return <section className="center-card">Loading admin data...</section>;
  }

  async function uploadToCloudinary(file, onSuccess, key, options = {}) {
    setUploadStatus((prev) => ({ ...prev, [key]: true }));
    setStatus(`Uploading ${file.name}...`);
    try {
      const result = await uploadAdminMedia(file, options);
      onSuccess(result.url);
      setStatus('Upload complete. Click "Save All Changes" to persist.');
    } catch (err) {
      setStatus(err.message || 'Upload failed');
    } finally {
      setUploadStatus((prev) => ({ ...prev, [key]: false }));
    }
  }

  async function saveAll() {
    setStatus('Saving...');
    try {
      const normalized = {
        ...portfolio,
        skills: (portfolio.skills || []).map((item) => ({
          ...item,
          level: Number(item.level || 0)
        })),
        projects: (portfolio.projects || []).map((item) => ({
          ...item,
          techStack: Array.isArray(item.techStack)
            ? item.techStack
            : String(item.techStack || '')
                .split(',')
                .map((v) => v.trim())
                .filter(Boolean)
        }))
      };
      await saveAdminPortfolio(normalized);
      setStatus('Saved successfully.');
    } catch (err) {
      setStatus(err.message || 'Save failed');
    }
  }

  return (
    <div className="site stack">
      <section className="card actions between">
        <h1>Admin Panel</h1>
        <div className="actions">
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </button>
          <button className="btn" type="button" onClick={saveAll}>
            Save All Changes
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Profile</h2>
        <div className="grid2">
          <label>
            <span>Full Name</span>
            <input
              value={portfolio.profile?.fullName || ''}
              onChange={(e) =>
                setPortfolio((p) => ({ ...p, profile: { ...p.profile, fullName: e.target.value } }))
              }
            />
          </label>
          <label>
            <span>Headline</span>
            <input
              value={portfolio.profile?.headline || ''}
              onChange={(e) =>
                setPortfolio((p) => ({ ...p, profile: { ...p.profile, headline: e.target.value } }))
              }
            />
          </label>
          <label className="full">
            <span>Bio</span>
            <textarea
              rows="4"
              value={portfolio.profile?.bio || ''}
              onChange={(e) => setPortfolio((p) => ({ ...p, profile: { ...p.profile, bio: e.target.value } }))}
            />
          </label>
          <label>
            <span>Location</span>
            <input
              value={portfolio.profile?.location || ''}
              onChange={(e) =>
                setPortfolio((p) => ({ ...p, profile: { ...p.profile, location: e.target.value } }))
              }
            />
          </label>
          <label>
            <span>Avatar URL</span>
            <input
              value={portfolio.profile?.avatarUrl || ''}
              onChange={(e) =>
                setPortfolio((p) => ({ ...p, profile: { ...p.profile, avatarUrl: e.target.value } }))
              }
            />
            <input
              type="file"
              accept="image/*"
              disabled={Boolean(uploadStatus.avatar)}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                uploadToCloudinary(
                  file,
                  (url) => setPortfolio((p) => ({ ...p, profile: { ...p.profile, avatarUrl: url } })),
                  'avatar',
                  { resourceType: 'image' }
                );
                e.target.value = '';
              }}
            />
          </label>
          <label>
            <span>Resume URL</span>
            <input
              value={portfolio.profile?.resumeUrl || ''}
              onChange={(e) =>
                setPortfolio((p) => ({ ...p, profile: { ...p.profile, resumeUrl: e.target.value } }))
              }
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf"
              disabled={Boolean(uploadStatus.resume)}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                uploadToCloudinary(
                  file,
                  (url) => setPortfolio((p) => ({ ...p, profile: { ...p.profile, resumeUrl: url } })),
                  'resume',
                  { resourceType: 'raw' }
                );
                e.target.value = '';
              }}
            />
          </label>
          <label>
            <span>Brand Name</span>
            <input
              value={portfolio.settings?.brandName || ''}
              onChange={(e) =>
                setPortfolio((p) => ({ ...p, settings: { ...p.settings, brandName: e.target.value } }))
              }
            />
          </label>
          <label className="full">
            <span>Tagline</span>
            <input
              value={portfolio.settings?.tagline || ''}
              onChange={(e) =>
                setPortfolio((p) => ({ ...p, settings: { ...p.settings, tagline: e.target.value } }))
              }
            />
          </label>
        </div>
      </section>

      <ListEditor
        title="Skills"
        items={portfolio.skills || []}
        setItems={(value) => setPortfolio((p) => ({ ...p, skills: value }))}
        shape={{ name: '', category: '', level: '80' }}
      />

      <ListEditor
        title="Projects"
        items={portfolio.projects || []}
        setItems={(value) => setPortfolio((p) => ({ ...p, projects: value }))}
        shape={{ title: '', summary: '', liveUrl: '', repoUrl: '', imageUrl: '', techStack: '' }}
        onUploadField={(index, key, file) => {
          uploadToCloudinary(
            file,
            (url) =>
              setPortfolio((p) => {
                const projects = [...(p.projects || [])];
                projects[index] = { ...projects[index], [key]: url };
                return { ...p, projects };
              }),
            `project-${index}-${key}`
          );
        }}
      />

      <ListEditor
        title="Education"
        items={portfolio.education || []}
        setItems={(value) => setPortfolio((p) => ({ ...p, education: value }))}
        shape={{ institution: '', degree: '', year: '', description: '' }}
      />

      <ListEditor
        title="SocialLinks"
        items={portfolio.socialLinks || []}
        setItems={(value) => setPortfolio((p) => ({ ...p, socialLinks: value }))}
        shape={{ platform: '', url: '' }}
      />

      {status ? <p className="status">{status}</p> : null}
    </div>
  );
}
