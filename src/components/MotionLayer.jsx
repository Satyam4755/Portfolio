import { useEffect, useMemo, useRef, useState } from 'react';

export default function MotionLayer() {
  const monkeyRef = useRef(null);
  const isPinnedToButtonRef = useRef(false);
  const rafRef = useRef(0);
  const modelSources = useMemo(
    () => [
      '/models/monkey.glb',
      'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@main/2.0/Suzanne/glTF-Binary/Suzanne.glb',
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Suzanne/glTF-Binary/Suzanne.glb',
      'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
    ],
    []
  );
  const [modelIndex, setModelIndex] = useState(0);

  useEffect(() => {
    function placeMonkey(x, y) {
      const monkey = monkeyRef.current;
      if (!monkey) return;
      monkey.style.setProperty('--monkey-x', `${x}px`);
      monkey.style.setProperty('--monkey-y', `${y}px`);
    }

    function updateFromScroll() {
      const doc = document.documentElement;
      const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      doc.style.setProperty('--scroll-progress', String(progress));

      if (!isPinnedToButtonRef.current) {
        const x = 24 + progress * (window.innerWidth - 112);
        const y = window.innerHeight - 114 + Math.sin(window.scrollY / 120) * 8;
        placeMonkey(x, y);
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateFromScroll);
    }

    function onButtonHover(event) {
      const button = event.target.closest('.btn');
      if (!button || !monkeyRef.current) return;

      const rect = button.getBoundingClientRect();
      isPinnedToButtonRef.current = true;
      monkeyRef.current.classList.add('monkey-jump');
      placeMonkey(rect.left + rect.width / 2 - 32, rect.top - 64);
    }

    function onPointerOut(event) {
      const to = event.relatedTarget;
      if (to && to.closest && to.closest('.btn')) return;
      if (!monkeyRef.current) return;
      isPinnedToButtonRef.current = false;
      monkeyRef.current.classList.remove('monkey-jump');
      updateFromScroll();
    }

    updateFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
    document.addEventListener('pointerover', onButtonHover);
    document.addEventListener('pointerout', onPointerOut);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateFromScroll);
      document.removeEventListener('pointerover', onButtonHover);
      document.removeEventListener('pointerout', onPointerOut);
    };
  }, []);

  return (
    <>
      <div className="parallax-orb orb-a" aria-hidden="true"></div>
      <div className="parallax-orb orb-b" aria-hidden="true"></div>
      <div ref={monkeyRef} className="ui-monkey" aria-hidden="true">
        <model-viewer
          class="ui-monkey-model"
          src={modelSources[modelIndex]}
          auto-rotate
          camera-controls
          disable-pan
          shadow-intensity="1"
          exposure="1"
          interaction-prompt="none"
          onError={() => {
            setModelIndex((idx) => (idx < modelSources.length - 1 ? idx + 1 : idx));
          }}
        ></model-viewer>
      </div>
    </>
  );
}
