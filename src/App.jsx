import { useMemo, useRef, useState } from "react";
import "./App.css";
import heartImg from "./assets/heart1.png";
import heart2 from "./assets/heart2.png";
import heart3 from "./assets/heart3.png";

function normalize(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function pairKey(a, b) {
  const x = normalize(a);
  const y = normalize(b);
  return [x, y].sort().join("|");
}

// Rigged pairs (case/spacing insensitive because of normalize + pairKey)
// Add your own names below: pairKey("name one", "name two")
// Example: pairKey("alex", "sam")
const riggedPairs = new Set([
  pairKey("name one", "name two"),
  pairKey("another name", "another name"),
]);

function lovePercent(nameA, nameB) {
  if (!nameA.trim() || !nameB.trim()) return 0;
  if (riggedPairs.has(pairKey(nameA, nameB))) return 100;

  const s = `${normalize(nameA)}♥${normalize(nameB)}`;
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return hash % 101;
}

export default function App() {
  const [yourName, setYourName] = useState("");
  const [theirName, setTheirName] = useState("");
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [floatHearts, setFloatHearts] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [glowLevel, setGlowLevel] = useState(0);

  const rafId = useRef(null);
  const glowTimer = useRef(null);

  const canTest = useMemo(() => {
    return yourName.trim().length > 0 && theirName.trim().length > 0;
  }, [yourName, theirName]);

  const rand = (min, max) => Math.random() * (max - min) + min;

  function triggerGlow(forScore) {
    let level = 0;
    if (forScore >= 100) level = 3;
    else if (forScore >= 95) level = 2;
    else if (forScore >= 85) level = 1;
    if (level === 0) return;

    setGlowLevel(level);
    window.clearTimeout(glowTimer.current);
    glowTimer.current = window.setTimeout(() => setGlowLevel(0), 2200);
  }

  function spawnHeartsBurst() {
    const now = Date.now();
    const count = Math.floor(rand(20, 34));
    const imgs = [heart2, heart3];

    const newOnes = Array.from({ length: count }).map((_, i) => {
      const id = `${now}-${i}-${Math.random().toString(16).slice(2)}`;
      const r = Math.random();
      const size = r < 0.22 ? "lg" : r < 0.7 ? "md" : "sm";
      const img = imgs[Math.floor(rand(0, imgs.length))];

      return {
        id,
        img,
        size,
        left: rand(10, 90),
        drift: rand(-120, 120),
        duration: rand(2.6, 4.6),
        delay: rand(0, 0.12),
        opacity: rand(0.85, 1),
      };
    });

    setFloatHearts((prev) => [...prev, ...newOnes]);

    window.setTimeout(() => {
      setFloatHearts((prev) => prev.filter((h) => !newOnes.some((n) => n.id === h.id)));
    }, 5200);
  }

  function spawnSparklesBurst() {
    const now = Date.now();
    const count = 30;

    const newOnes = Array.from({ length: count }).map((_, i) => {
      const id = `${now}-s-${i}-${Math.random().toString(16).slice(2)}`;
      return {
        id,
        left: Math.random() * 90 + 5,
        top: Math.random() * 70 + 10,
        size: Math.random() * 14 + 12,
        delay: Math.random() * 0.35,
        dur: Math.random() * 1.2 + 1.6,
        rot: Math.random() * 220 - 110,
        opacity: Math.random() * 0.35 + 0.65,
      };
    });

    setSparkles((prev) => [...prev, ...newOnes]);

    window.setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newOnes.some((n) => n.id === s.id)));
    }, 4200);
  }

  function onClear() {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setYourName("");
    setTheirName("");
    setScore(0);
    setIsLoading(false);
    setFloatHearts([]);
    setSparkles([]);
    setGlowLevel(0);
  }

  function onTest(e) {
    e.preventDefault();
    if (!canTest || isLoading) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    const finalScore = lovePercent(yourName, theirName);

    setIsLoading(true);
    setScore(0);

    const duration = 3000;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);

      const noise = t < 0.75 ? (Math.random() * 10 - 5) : 0;
      const candidate = Math.round(eased * finalScore + noise);
      const clamped = Math.max(0, Math.min(100, candidate));
      setScore(clamped);

      if (t < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setScore(finalScore);
        setIsLoading(false);

        if (finalScore >= 85) {
          triggerGlow(finalScore);
          spawnHeartsBurst();
        }
        if (finalScore === 100) {
          spawnSparklesBurst();
        }
      }
    }

    rafId.current = requestAnimationFrame(tick);
  }

  return (
    <main className="page">
      {/* Side hearts (decor) */}
      <div className="sideHearts" aria-hidden="true">
        <div className="sideHeart left h1" />
        <div className="sideHeart left h2" />
        <div className="sideHeart right h1" />
        <div className="sideHeart right h2" />
      </div>

      {/* Floating reward hearts */}
      <div className="floatLayer" aria-hidden="true">
        {floatHearts.map((h) => (
          <img
            key={h.id}
            className={`floatHeart ${h.size}`}
            src={h.img}
            alt=""
            style={{
              left: `${h.left}vw`,
              "--drift": `${h.drift}px`,
              "--dur": `${h.duration}s`,
              "--delay": `${h.delay}s`,
              opacity: h.opacity,
            }}
          />
        ))}
      </div>

      {/* Sparkles at 100% */}
      <div className="sparkleLayer" aria-hidden="true">
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="sparkle"
            style={{
              left: `${s.left}vw`,
              top: `${s.top}vh`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
              transform: `rotate(${s.rot}deg)`,
            }}
          />
        ))}
      </div>

      <section className="card" aria-label="Love Calculator">
        <button
          className="resetBtn"
          type="button"
          onClick={onClear}
          disabled={isLoading}
          aria-label="Clear and reset"
          title="Clear"
        >
          ⟲
        </button>

        <h1 className="title">Love Calculator</h1>

        <div className="heartWrap" aria-label="Result">
          <div className={`heartGlow level-${glowLevel}`} aria-hidden="true" />

          <div className={`heartAnim ${isLoading ? "loading" : ""}`}>
            <img className="heart" src={heartImg} alt="Pixel heart" />
          </div>

          <div className="percent" aria-live="polite">
            {score}%
          </div>
        </div>

        <form className="controls" onSubmit={onTest}>
          <div className="field">
            <input
              className="input"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder=" "
              autoComplete="off"
            />
            <div className="hint">enter your name</div>
          </div>

          <button className="btn" type="submit" disabled={!canTest || isLoading}>
            {isLoading ? "testing..." : "test!"}
          </button>

          <div className="field">
            <input
              className="input"
              value={theirName}
              onChange={(e) => setTheirName(e.target.value)}
              placeholder=" "
              autoComplete="off"
            />
            <div className="hint">enter their name</div>
          </div>
        </form>
      </section>
    </main>
  );
}
