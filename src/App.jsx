import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const chapters = [
  { button: "Enna nu paaru" },
  { button: "Innum konjam..." },
  { button: "Aduthu..." },
  { button: "Last-ah onnu..." },
  { button: "Avlodhaan di." },
];
const revealWords = (text) =>
  text.split(" ").map((word, index) => (
    <span className="word-mask" key={`${word}-${index}`}>
      <motion.span
        className={word === "di..." ? "accent" : ""}
        variants={{
          hidden: { y: "110%", opacity: 0 },
          show: { y: 0, opacity: 1 },
        }}
      >
        {word}&nbsp;
      </motion.span>
    </span>
  ));

function Progress({ current, onGo }) {
  return (
    <header className="topbar">
      {current > 0 ? (
        <button
          className="icon-button"
          onClick={() => onGo(current - 1)}
          aria-label="Previous chapter"
        >
          ←
        </button>
      ) : (
        <span className="topbar-spacer" />
      )}
      <nav className="progress" aria-label="Chapter progress">
        {chapters.map((_, i) => (
          <button
            aria-label={`Chapter ${i + 1}`}
            aria-current={i === current ? "step" : undefined}
            className={i <= current ? "complete" : ""}
            key={i}
            onClick={() => onGo(i)}
          />
        ))}
      </nav>
      <span className="counter">
        {String(current + 1).padStart(2, "0")} / 05
      </span>
    </header>
  );
}

function Gate({ onOpen }) {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const check = (event) => {
    event.preventDefault();
    if (pin.replace(/\D/g, "") === "06032006") return onOpen();
    const next = attempts + 1;
    setAttempts(next);
    setError(
      next === 1
        ? "Konjam yosichu paaru..."
        : next === 2
          ? "Hint: it is a day meant only for you."
          : "Hint: your birthday — DD / MM / YYYY.",
    );
  };
  return (
    <motion.main
      className="gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="gate-orb"
        animate={{
          x: ["-6%", "6%", "-6%"],
          y: ["-4%", "5%", "-4%"],
          scale: [1, 1.12, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <section className="pin-panel" aria-labelledby="pin-heading">
        <span className="eyebrow">A small thing, just for you</span>
        <div className="lock-mark" aria-hidden="true">
          ⌁
        </div>
        <h1 id="pin-heading">
          Before we start,
          <br />
          <span>oru chinna clue.</span>
        </h1>
        <p>Indha memories-kulla poganum na, un special day-a enter pannu.</p>
        <form onSubmit={check}>
          <label htmlFor="pin">DD / MM / YYYY</label>
          <input
            id="pin"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            autoComplete="off"
            inputMode="numeric"
            maxLength="10"
            placeholder="DD / MM / YYYY"
            aria-describedby="pin-hint"
          />
          <button className="primary-button" type="submit">
            Open the memories <span>→</span>
          </button>
        </form>
        <p
          id="pin-hint"
          className={`hint ${error ? "visible" : ""}`}
          aria-live="polite"
        >
          {error || "A date you will always remember."}
        </p>
      </section>
    </motion.main>
  );
}

function Intro() {
  return (
    <main className="scene intro-scene">
      <div className="atmosphere orb-one" />
      <div className="atmosphere orb-two" />
      <section className="intro-copy">
        <span className="eyebrow">Chapter 01</span>
        <motion.h1
          className="display"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          {revealWords("Unkita konjam pesanum di...")}
        </motion.h1>
        <motion.div
          className="body-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82 }}
        >
          <p>Nerla solla varumbodhu enna ennavo pesiduren.</p>
          <p className="bright">
            Adhaan ipdi oru website panni sollalam nu nenachen.
          </p>
        </motion.div>
      </section>
      <div className="orbit-art" aria-hidden="true">
        <i />
        <i />
        <b />
      </div>
    </main>
  );
}

function Situation() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.9, 0.15]);
  return (
    <main className="scene reading-scene" ref={ref}>
      <section className="visual clock-visual">
        <motion.div className="notification one" style={{ opacity }}>
          work calls
        </motion.div>
        <motion.div className="notification two" style={{ opacity }}>
          targets
        </motion.div>
        <div className="clock">
          <motion.i style={{ rotate }} />
          <b />
        </div>
      </section>
      <section className="narrative">
        <span className="eyebrow">Chapter 02</span>
        <h1>Unoda situation enakku puriyudhu.</h1>
        <p>
          Unoda <em>work</em>, target, <em>stress</em>, tiredness... ellame
          enakku konjam puriyudhu di.
        </p>
        <p>Sila neram naan un situation-ah purinjikama pesirpen.</p>
        <p className="bright">Sorry di.</p>
        <p>Unakku space venumna, naan understand pannipen.</p>
      </section>
    </main>
  );
}

const memories = [
  ["/memories/walk.jpeg", "01", "Namma random walk"],
  ["/memories/time.jpeg", "02", "Oru normal Friday"],
  ["/memories/vintage-portrait.jpeg", "03", "A little retro moment"],
  ["/memories/tree.jpeg", "04", "Namma usual selves"],
  ["/memories/cinema.jpeg", "05", "Old-school us"],
];
function Memories() {
  return (
    <main className="scene memories-scene">
      <section className="memories-heading">
        <span className="eyebrow">Chapter 03</span>
        <h1>
          Naan edhellam
          <br />
          <span>miss panren.</span>
        </h1>
        <p>Indha chinna chinna moments dhaan.</p>
      </section>
      <section className="memory-grid">
        {memories.map(([src, no, caption], i) => (
          <motion.figure
            key={src}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: i * 0.06 }}
          >
            <img src={src} alt={caption} />
            <figcaption>
              <span>{no}</span>
              {caption}
            </figcaption>
          </motion.figure>
        ))}
      </section>
    </main>
  );
}

function Friendship() {
  const [replay, setReplay] = useState(0);
  return (
    <main className="scene reading-scene friendship">
      <section className="visual lines-visual">
        <div className="line-card">
          <div>
            <span className="eyebrow">Parallel</span>
            <button onClick={() => setReplay((x) => x + 1)}>
              Replay motion
            </button>
          </div>
          <svg
            viewBox="0 0 320 140"
            role="img"
            aria-label="Two lines settling into parallel harmony"
          >
            <motion.path
              key={`a${replay}`}
              initial={{ d: "M 16 32 C 90 120, 210 10, 304 96" }}
              animate={{ d: "M 16 56 C 96 56, 224 56, 304 56" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              stroke="#8BAAFF"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <motion.path
              key={`b${replay}`}
              initial={{ d: "M 16 108 C 90 16, 210 124, 304 42" }}
              animate={{ d: "M 16 84 C 96 84, 224 84, 304 84" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              stroke="#939DB5"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </section>
      <section className="narrative">
        <span className="eyebrow">Chapter 04</span>
        <h1>Sanda podalam... aana?</h1>
        <p>
          Namakkulla evlo problems vandhalum, misunderstandings vandhalum, pesi
          seri pannalam di.
        </p>
        <p>Kovam irundha konjam time eduthukalam.</p>
        <p className="bright">
          Aana oru sanda nala namma friendship-ah lose panna enakku viruppam
          illa.
        </p>
        <p className="accent">
          Naanum en side-la mistakes-ah seri panna try panren.
        </p>
      </section>
    </main>
  );
}

function Closing({ done, onDone, reset }) {
  return (
    <main className="scene closing-scene">
      {!done ? (
        <motion.section
          initial={{ scale: 1.04, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4 }}
        >
          <span className="eyebrow">Chapter 05</span>
          <h1>Always enakku unna pudikkum di.</h1>
          <div className="body-copy">
            <p>Evlo sanda pottalum, kovapattalum, nee enakku special dhaan.</p>
            <p>Nee dhaan enoda best friend.</p>
            <p>Un friendship enakku romba important.</p>
            <p>Idha sollanum nu dhaan indha website eh panninen.</p>
            <p>Ippo reply pannanum nu avasiyam illa.</p>
            <p className="bright">Take care di.</p>
          </div>
          <motion.p
            className="final-line"
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: { delayChildren: 0.2, staggerChildren: 0.14 },
              },
            }}
          >
            {revealWords("Always, my best friend.")}
          </motion.p>
        </motion.section>
      ) : (
        <section className="quiet-ending">
          <p className="final-line">Always, my best friend.</p>
          <p>Take care di.</p>
          <button className="text-button" onClick={reset}>
            ↻ Start from Chapter 01
          </button>
        </section>
      )}
      {!done && (
        <footer className="chapter-footer">
          <button className="primary-button" onClick={onDone}>
            Avlodhaan di.
          </button>
        </footer>
      )}
    </main>
  );
}

function Story() {
  const [chapter, setChapter] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapter]);
  const reset = () => {
    setChapter(0);
    setDone(false);
  };
  const screens = [
    <Intro key="intro" />,
    <Situation key="situation" />,
    <Memories key="memories" />,
    <Friendship key="friendship" />,
    <Closing
      key="closing"
      done={done}
      onDone={() => setDone(true)}
      reset={reset}
    />,
  ];
  return (
    <>
      <Progress current={chapter} onGo={setChapter} />
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter}
          className="story-wrap"
          initial={{ clipPath: "circle(0% at 50% 85%)", opacity: 0.4 }}
          animate={{ clipPath: "circle(150% at 50% 85%)", opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {screens[chapter]}
        </motion.div>
      </AnimatePresence>
      {chapter < 4 && (
        <footer className="chapter-footer">
          <button
            className="primary-button"
            onClick={() => setChapter((x) => x + 1)}
          >
            {chapters[chapter].button} <span>→</span>
          </button>
          <span>Tap to continue</span>
        </footer>
      )}
    </>
  );
}
export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {open ? (
          <Story key="story" />
        ) : (
          <Gate key="gate" onOpen={() => setOpen(true)} />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
