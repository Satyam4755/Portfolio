import { useEffect, useState } from 'react';
import { getPublicPortfolio } from '../services';

function usePortfolio() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getPublicPortfolio().then(setData).catch(() => setData(null));
  }, []);

  return data;
}

function applyTilt(event, intensity = 10) {
  const node = event.currentTarget;
  const rect = node.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width;
  const py = (event.clientY - rect.top) / rect.height;
  const rx = (0.5 - py) * intensity;
  const ry = (px - 0.5) * intensity;
  node.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
  node.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
  node.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
  node.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);
}

function resetTilt(event) {
  const node = event.currentTarget;
  node.style.setProperty('--rx', '0deg');
  node.style.setProperty('--ry', '0deg');
  node.style.setProperty('--mx', '50%');
  node.style.setProperty('--my', '50%');
}

export function HomePage() {
  const data = usePortfolio();
  const profile = data?.profile || {};
  const settings = data?.settings || {};
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const socialLinks = data?.socialLinks || [];

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.15 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [skills.length, projects.length, education.length, socialLinks.length]);

  return (
    <div className="stack">
      <section
        id="home"
        className="hero card tilt-surface reveal"
        onMouseMove={(event) => applyTilt(event, 7)}
        onMouseLeave={resetTilt}
      >
        <div className="hero-copy">
          <p className="kicker">{settings.brandName || 'Portfolio'}</p>
          <h1>{profile.fullName || 'Your Name'}</h1>
          <p className="lead">{profile.headline || settings.tagline || 'Creative developer & problem solver'}</p>
          <p>{profile.bio || ''}</p>
          <div className="actions">
            {profile.resumeUrl ? (
              <a className="btn" href={profile.resumeUrl} target="_blank" rel="noreferrer">
                View Resume
              </a>
            ) : null}
            {profile.location ? <span className="pill">{profile.location}</span> : null}
          </div>
        </div>
        <div className="hero-media">
          <div className="avatar-shell tilt-surface" onMouseMove={applyTilt} onMouseLeave={resetTilt}>
            {profile.avatarUrl ? (
              <img className="avatar" src={profile.avatarUrl} alt={`${profile.fullName || 'Profile'} avatar`} />
            ) : (
              <div className="avatar avatar-placeholder">Add avatar from admin</div>
            )}
          </div>
        </div>
      </section>

      <section id="skills" className="card reveal">
        <h2>Skills</h2>
        <div className="grid">
          {skills.map((s, i) => (
            <article key={`${s.name}-${i}`} className="tile lift-3d reveal">
              <h3>{s.name}</h3>
              <p>{s.category}</p>
              <p className="skill-meter">{s.level}%</p>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="card reveal">
        <h2>Projects</h2>
        <div className="grid">
          {projects.map((p, i) => (
            <article
              key={`${p.title}-${i}`}
              className="tile tilt-surface reveal"
              onMouseMove={(event) => applyTilt(event, 9)}
              onMouseLeave={resetTilt}
            >
              {p.imageUrl ? (
                p.imageUrl.includes('/video/upload/') || /\.(mp4|webm|mov)$/i.test(p.imageUrl) ? (
                  <video className="project-media" src={p.imageUrl} controls />
                ) : (
                  <img className="project-media" src={p.imageUrl} alt={p.title || 'Project media'} />
                )
              ) : null}
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <div className="actions">
                {p.liveUrl ? (
                  <a className="btn" href={p.liveUrl} target="_blank" rel="noreferrer">
                    Live
                  </a>
                ) : null}
                {p.repoUrl ? (
                  <a className="btn ghost" href={p.repoUrl} target="_blank" rel="noreferrer">
                    Code
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="card reveal">
        <h2>Education</h2>
        <div className="grid">
          {education.map((e, i) => (
            <article key={`${e.institution}-${i}`} className="tile lift-3d reveal">
              <h3>{e.institution}</h3>
              <p>{e.degree}</p>
              <p>{e.year}</p>
              <p>{e.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="card reveal">
        <h2>Contact</h2>
        <div className="grid">
          {socialLinks.map((link, i) => (
            <a
              key={`${link.platform}-${i}`}
              className="tile lift-3d reveal"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              <h3>{link.platform}</h3>
              <p>{link.url}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export const AboutPage = HomePage;
export const SkillsPage = HomePage;
export const ProjectsPage = HomePage;
export const EducationPage = HomePage;
export const ContactPage = HomePage;
