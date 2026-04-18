import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

/* ─── Shared animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function FadeInSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Floating orb background ───────────────────────────────────────── */
function Orbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        }}
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
    </div>
  );
}

/* ─── Grid dot pattern ──────────────────────────────────────────────── */
function GridPattern() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage:
          'radial-gradient(circle, #10b981 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
      aria-hidden
    />
  );
}

/* ─── Navbar ────────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/wattsgood-logo.webp" alt="WattsGood" className="h-9 w-9 object-contain" />
          <span className="text-white font-bold text-lg tracking-tight">WattsGood</span>
        </div>
        <Link
          to="/apply"
          className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
        >
          Check my eligibility
        </Link>
      </div>
    </motion.nav>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────── */
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
      <Orbs />
      <GridPattern />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl scale-150" />
            <img
              src="/wattsgood-logo.webp"
              alt="WattsGood"
              className="relative h-24 w-24 object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Free NYC Energy Assistance Navigator
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
        >
          Find the energy money{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            NYC owes your family.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          1.5 million New York families qualify for energy assistance they've never applied for.
          WattsGood finds every program you're eligible for — and shows you how one application can unlock three more.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/apply"
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold text-lg transition-all duration-200 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:-translate-y-1 flex items-center gap-2"
          >
            Check my eligibility
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-4 rounded-full border border-slate-700 text-slate-300 font-semibold text-lg hover:border-slate-500 hover:text-white transition-all duration-200"
          >
            How it works
          </a>
        </motion.div>

        {/* Hero stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: '20+', label: 'Programs checked' },
            { value: '2 min', label: 'To complete' },
            { value: '$18k', label: 'Max annual savings' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold text-emerald-400">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Problem section ───────────────────────────────────────────────── */
function Problem() {
  const problems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Hidden across 20 different sites',
      body: 'City, state, and utility programs each live on separate websites that never talk to each other. Most families find one and miss four others.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Buried in bureaucracy',
      body: 'Complex paperwork, unclear deadlines, and separate income verifications for each program — most families give up before finishing.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Cascade benefits go unnoticed',
      body: "Enrolling in SNAP automatically unlocks Con Edison discounts, which unlocks Solar for All priority. Nobody tells you this — until now.",
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <FadeInSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">
            The problem
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            The money exists.
            <br />
            <span className="text-slate-500">Finding it is the problem.</span>
          </motion.h2>
        </FadeInSection>

        <FadeInSection className="grid md:grid-cols-3 gap-6">
          {problems.map(({ icon, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl border border-slate-800 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800 transition-colors duration-200 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-700 group-hover:bg-emerald-500/20 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors duration-200 mb-4">
                {icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </FadeInSection>
      </div>
    </section>
  );
}

/* ─── How it works ──────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      color: 'emerald',
      title: 'Answer a few questions',
      body: 'Tell us your household size, income, borough, and what benefits you already have. Takes about 2 minutes.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      num: '02',
      color: 'cyan',
      title: 'We check every program',
      body: 'Claude AI evaluates 20 city, state, and utility programs simultaneously — including ones most caseworkers don\'t know about.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      num: '03',
      color: 'emerald',
      title: 'Unlock your cascade',
      body: 'See exactly which programs unlock others, what paperwork to bring, and how to apply — in English or Spanish.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const colorMap = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400',
      num: 'text-emerald-500/30',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      icon: 'text-cyan-400',
      num: 'text-cyan-500/30',
    },
  };

  return (
    <section id="how-it-works" className="relative py-24 px-6 bg-slate-950">
      <GridPattern />
      <div className="relative max-w-5xl mx-auto">
        <FadeInSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">
            How it works
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white">
            Three steps to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              every dollar you deserve.
            </span>
          </motion.h2>
        </FadeInSection>

        <FadeInSection className="grid md:grid-cols-3 gap-6">
          {steps.map(({ num, color, title, body, icon }) => {
            const c = colorMap[color];
            return (
              <motion.div
                key={num}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative p-7 rounded-2xl border ${c.border} ${c.bg} backdrop-blur-sm overflow-hidden group cursor-default`}
              >
                <span className={`absolute -top-4 -right-2 text-8xl font-black ${c.num} select-none`}>
                  {num}
                </span>
                <div className={`relative w-13 h-13 w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center ${c.icon} mb-5`}>
                  {icon}
                </div>
                <h3 className="relative text-white font-bold text-xl mb-3">{title}</h3>
                <p className="relative text-slate-400 text-sm leading-relaxed">{body}</p>
              </motion.div>
            );
          })}
        </FadeInSection>
      </div>
    </section>
  );
}

/* ─── Impact numbers ────────────────────────────────────────────────── */
function Impact() {
  const stats = [
    { value: '1.5M', label: 'NYC families eligible for help they\'ve never received', accent: 'emerald' },
    { value: '20+', label: 'City, state & utility programs checked in seconds', accent: 'cyan' },
    { value: '$18k', label: 'Maximum estimated annual savings per household', accent: 'emerald' },
    { value: '4×', label: 'More programs found on average vs. self-research', accent: 'cyan' },
  ];

  const accentMap = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-5xl mx-auto">
        <FadeInSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">
            The impact
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white">
            Numbers that matter.
          </motion.h2>
        </FadeInSection>

        <FadeInSection className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label, accent }) => (
            <motion.div
              key={value}
              variants={fadeUp}
              whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-800/40 text-center group cursor-default"
            >
              <p className={`text-5xl font-extrabold ${accentMap[accent]} mb-3 tabular-nums`}>
                {value}
              </p>
              <p className="text-slate-400 text-sm leading-snug">{label}</p>
            </motion.div>
          ))}
        </FadeInSection>
      </div>
    </section>
  );
}

/* ─── Cascade visual ────────────────────────────────────────────────── */
function CascadeVisual() {
  const nodes = [
    { id: 'snap', label: 'SNAP Enrollment', sub: 'Already enrolled', color: 'emerald', delay: 0 },
    { id: 'heap', label: 'HEAP Benefit', sub: 'Auto-qualifies', color: 'cyan', delay: 0.2 },
    { id: 'eal', label: 'Con Edison EAL', sub: '+$840/yr discount', color: 'emerald', delay: 0.4 },
    { id: 'solar', label: 'Solar for All', sub: 'Priority enrollment', color: 'cyan', delay: 0.6 },
  ];

  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-400', dot: 'bg-cyan-500' },
  };

  return (
    <section className="py-24 px-6 bg-slate-950 relative overflow-hidden">
      <Orbs />
      <div className="relative max-w-4xl mx-auto">
        <FadeInSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">
            The cascade effect
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            One enrollment.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Four programs.
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-xl mx-auto">
            Most people apply for one program and stop. WattsGood traces the full chain — showing how each enrollment automatically unlocks the next.
          </motion.p>
        </FadeInSection>

        {/* Chain diagram */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
          {nodes.map((node, i) => {
            const c = colorMap[node.color];
            return (
              <div key={node.id} className="flex flex-col sm:flex-row items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: node.delay }}
                  whileHover={{ scale: 1.05 }}
                  className={`p-5 rounded-2xl border ${c.border} ${c.bg} text-center w-40 cursor-default`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${c.dot} mx-auto mb-3`} />
                  <p className={`text-sm font-bold ${c.text} mb-1`}>{node.label}</p>
                  <p className="text-xs text-slate-500">{node.sub}</p>
                </motion.div>

                {i < nodes.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: node.delay + 0.15 }}
                    className="flex items-center justify-center my-3 sm:my-0 sm:mx-1"
                  >
                    {/* Vertical arrow on mobile, horizontal on sm+ */}
                    <div className="sm:hidden flex flex-col items-center gap-1 text-emerald-500/60">
                      <div className="w-px h-5 bg-gradient-to-b from-emerald-500/60 to-cyan-500/60" />
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-emerald-500/60">
                      <div className="h-px w-5 bg-gradient-to-r from-emerald-500/60 to-cyan-500/60" />
                      <svg className="w-4 h-4 rotate-[-90deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-slate-500 text-sm mt-8"
        >
          This is just one of 10+ cascade chains WattsGood traces automatically.
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Climate justice callout ───────────────────────────────────────── */
function ClimateCallout() {
  return (
    <section className="py-20 px-6 bg-slate-900">
      <FadeInSection className="max-w-4xl mx-auto">
        <motion.div
          variants={fadeUp}
          className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 to-slate-900 p-10 sm:p-14 text-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <motion.div variants={fadeUp} className="relative">
            <p className="text-4xl mb-4">🌡️</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Climate justice starts with cooling.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
              In the Bronx, heat-related illness rates are <strong className="text-white">3× the city average</strong>. HEAP Cooling Assistance provides free air conditioners to eligible families — but only during a narrow summer window. WattsGood flags this benefit and tells you exactly when and how to apply.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
            >
              Check cooling eligibility
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </FadeInSection>
    </section>
  );
}

/* ─── CTA banner ────────────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-28 px-6 bg-slate-950 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)',
        }}
        aria-hidden
      />
      <FadeInSection className="relative max-w-3xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6"
        >
          The money is already there.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            WattsGood connects you to it.
          </span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
          Free, confidential, takes 2 minutes. Available in English and Spanish.
          No account needed.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link
            to="/apply"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold text-xl transition-all duration-200 hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1"
          >
            Find my programs — it's free
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
        <motion.p variants={fadeUp} className="text-slate-600 text-sm mt-6">
          In NYC, only 23% of eligible households enroll in HEAP. This is how we change that.
        </motion.p>
      </FadeInSection>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3 max-w-xs text-center md:text-left">
            <div className="flex items-center gap-3">
              <img src="/wattsgood-logo.webp" alt="WattsGood" className="h-8 w-8 object-contain" />
              <span className="text-white font-bold text-lg">WattsGood</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              NYC's free energy assistance navigator. Built for the Sustainable Communities Challenge.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm">
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 font-semibold text-xs tracking-widest uppercase">Resources</p>
              <a href="https://access.nyc.gov/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-emerald-400 transition-colors">ACCESS HRA</a>
              <a href="https://www.nyserda.ny.gov/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-emerald-400 transition-colors">NYSERDA</a>
              <a href="https://otda.ny.gov/programs/heap/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-emerald-400 transition-colors">HEAP Program</a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 font-semibold text-xs tracking-widest uppercase">App</p>
              <Link to="/apply" className="text-slate-500 hover:text-emerald-400 transition-colors">Check eligibility</Link>
              <Link to="/" className="text-slate-500 hover:text-emerald-400 transition-colors">Home</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2025 WattsGood. Built for the Sustainable Communities Hackathon.</p>
          <p className="text-center sm:text-right max-w-sm">
            Program information is provided for guidance only. Verify current eligibility and deadlines directly with each agency.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Impact />
      <CascadeVisual />
      <ClimateCallout />
      <CTABanner />
      <Footer />
    </div>
  );
}
