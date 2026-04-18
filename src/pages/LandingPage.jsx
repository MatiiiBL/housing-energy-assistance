import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

/* ─── Animation variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function FadeInSection({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Light emerald orbs for hero ───────────────────────────────────── */
function HeroOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute -top-32 -left-32 w-[560px] h-[560px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%)' }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)' }}
        animate={{ x: [0, -18, 0], y: [0, 18, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.06) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/wattsgood-logo.png"
            alt="WattsGood"
            className="h-20 w-20 object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(476%) hue-rotate(107deg) brightness(92%) contrast(88%)' }}
          />
          <span className="text-slate-900 font-bold text-lg tracking-tight">WattsGood</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#how-it-works" className="hidden sm:block text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors">
            How it works
          </a>
          <Link
            to="/apply"
            className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5"
          >
            Check eligibility
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────── */
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 60]);
  const opacity = useTransform(scrollY, [0, 280], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 bg-white overflow-hidden">
      <HeroOrbs />

<motion.div style={{ y, opacity }} className="relative z-10 max-w-4xl mx-auto mt-16">

        {/* Eyebrow */}
        

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.07] tracking-tight mb-6"
        >
          Find the energy money{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
            NYC owes your family.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          1.5 million New York families qualify for energy assistance they've never applied for.
          WattsGood finds every program you're eligible for — and shows you how one application can unlock three more.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/apply"
            className="group px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition-all duration-200 hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:-translate-y-1 flex items-center gap-2"
          >
            Check my eligibility
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-4 rounded-full border-2 border-slate-200 text-slate-700 font-semibold text-lg hover:border-emerald-300 hover:text-emerald-700 transition-all duration-200"
          >
            How it works
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto border-t border-slate-100 pt-10"
        >
          {[
            { value: '20+', label: 'Programs checked' },
            { value: '2 min', label: 'To complete' },
            { value: '$18k', label: 'Max annual savings' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold text-emerald-600">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      
    </section>
  );
}

/* ─── Problem ────────────────────────────────────────────────────────── */
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
      body: "Enrolling in SNAP automatically unlocks Con Edison discounts, which unlocks Solar for All. Nobody tells you this — until now.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-emerald-50">
      <div className="max-w-5xl mx-auto">
        <FadeInSection className="text-center mb-14">
          <motion.p variants={fadeUp} className="text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3">
            The problem
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            The money exists.{' '}
            <span className="text-slate-400">Finding it is the problem.</span>
          </motion.h2>
        </FadeInSection>

        <FadeInSection className="grid md:grid-cols-3 gap-5">
          {problems.map(({ icon, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -5, transition: { duration: 0.18 } }}
              className="group p-7 rounded-2xl border border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors duration-200 mb-5">
                {icon}
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </FadeInSection>
      </div>
    </section>
  );
}

/* ─── How it works ───────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Answer a few questions',
      body: "Tell us your household size, income, borough, and what benefits you already have. Takes about 2 minutes.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'We check every program',
      body: "Claude AI evaluates 20 city, state, and utility programs simultaneously — including ones most caseworkers don't know about.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Unlock your cascade',
      body: "See exactly which programs unlock others, what paperwork to bring, and how to apply — in English or Spanish.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <FadeInSection className="text-center mb-14">
          <motion.p variants={fadeUp} className="text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3">
            How it works
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-slate-900">
            Three steps to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              every dollar you deserve.
            </span>
          </motion.h2>
        </FadeInSection>

        <FadeInSection className="grid md:grid-cols-3 gap-5">
          {steps.map(({ num, title, body, icon }) => (
            <motion.div
              key={num}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.18 } }}
              className="relative p-7 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 bg-white hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)] overflow-hidden group cursor-default transition-all duration-200"
            >
              <span className="absolute -top-3 -right-1 text-8xl font-black text-emerald-50 select-none group-hover:text-emerald-100 transition-colors">
                {num}
              </span>
              <div className="relative w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 mb-5 transition-colors duration-200">
                {icon}
              </div>
              <h3 className="relative text-slate-900 font-bold text-xl mb-3">{title}</h3>
              <p className="relative text-slate-600 text-sm leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </FadeInSection>
      </div>
    </section>
  );
}

/* ─── Impact (bold emerald section) ─────────────────────────────────── */
function Impact() {
  const stats = [
    { value: '1.5M', label: "NYC families eligible for help they've never received" },
    { value: '20+', label: 'City, state & utility programs checked in seconds' },
    { value: '$18k', label: 'Maximum estimated annual savings per household' },
    { value: '4×', label: 'More programs found on average vs. self-research' },
  ];

  return (
    <section className="py-24 px-6 bg-emerald-600 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />
      <div className="relative max-w-5xl mx-auto">
        <FadeInSection className="text-center mb-14">
          <motion.p variants={fadeUp} className="text-emerald-200 text-sm font-semibold tracking-widest uppercase mb-3">
            The impact
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white">
            Numbers that matter.
          </motion.h2>
        </FadeInSection>

        <FadeInSection className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(({ value, label }) => (
            <motion.div
              key={value}
              variants={fadeUp}
              whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
              className="p-6 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 text-center cursor-default transition-all duration-200"
            >
              <p className="text-5xl font-extrabold text-white mb-3 tabular-nums">{value}</p>
              <p className="text-emerald-100 text-sm leading-snug">{label}</p>
            </motion.div>
          ))}
        </FadeInSection>
      </div>
    </section>
  );
}

/* ─── Cascade visual ─────────────────────────────────────────────────── */
function CascadeVisual() {
  const nodes = [
    { id: 'snap', label: 'SNAP Enrollment', sub: 'Already enrolled', filled: true, delay: 0 },
    { id: 'heap', label: 'HEAP Benefit', sub: 'Auto-qualifies', filled: false, delay: 0.2 },
    { id: 'eal', label: 'Con Edison EAL', sub: '+$840/yr discount', filled: true, delay: 0.4 },
    { id: 'solar', label: 'Solar for All', sub: 'Priority enrollment', filled: false, delay: 0.6 },
  ];

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <FadeInSection className="text-center mb-14">
          <motion.p variants={fadeUp} className="text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3">
            The cascade effect
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            One enrollment.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              Four programs.
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 max-w-xl mx-auto">
            Most people apply for one program and stop. WattsGood traces the full chain — showing how each enrollment automatically unlocks the next.
          </motion.p>
        </FadeInSection>

        {/* Chain */}
        <div className="flex flex-col sm:flex-row items-center justify-center">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex flex-col sm:flex-row items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: node.delay }}
                whileHover={{ scale: 1.05 }}
                className={`p-5 rounded-2xl border-2 text-center w-40 cursor-default transition-colors duration-150 ${
                  node.filled
                    ? 'border-emerald-500 bg-emerald-600 shadow-[0_4px_20px_rgba(16,185,129,0.25)]'
                    : 'border-emerald-200 bg-white hover:border-emerald-400'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-3 ${node.filled ? 'bg-white' : 'bg-emerald-400'}`} />
                <p className={`text-sm font-bold mb-1 ${node.filled ? 'text-white' : 'text-slate-900'}`}>
                  {node.label}
                </p>
                <p className={`text-xs ${node.filled ? 'text-emerald-100' : 'text-slate-500'}`}>{node.sub}</p>
              </motion.div>

              {i < nodes.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: node.delay + 0.2 }}
                  className="flex items-center justify-center my-3 sm:my-0 sm:mx-2"
                >
                  <div className="sm:hidden flex flex-col items-center gap-1 text-emerald-400">
                    <div className="w-px h-5 bg-emerald-300" />
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-emerald-400">
                    <div className="h-px w-6 bg-emerald-300" />
                    <svg className="w-4 h-4 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="text-center text-slate-500 text-sm mt-8"
        >
          This is just one of 10+ cascade chains WattsGood traces automatically.
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Climate callout ────────────────────────────────────────────────── */
function ClimateCallout() {
  return (
    <section className="py-20 px-6 bg-white">
      <FadeInSection className="max-w-4xl mx-auto">
        <motion.div
          variants={fadeUp}
          className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-10 sm:p-14 text-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.4]"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 70%)',
            }}
          />
          <motion.div variants={fadeUp} className="relative">
            <p className="text-4xl mb-4">🌡️</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Climate justice starts with cooling.
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
              In the Bronx, heat-related illness rates are{' '}
              <strong className="text-emerald-700">3× the city average</strong>. HEAP Cooling
              Assistance provides free air conditioners to eligible families — but only during
              a narrow summer window. WattsGood flags this benefit and tells you exactly when
              and how to apply.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all hover:shadow-[0_6px_24px_rgba(16,185,129,0.35)] hover:-translate-y-0.5"
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

/* ─── CTA banner ─────────────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-28 px-6 bg-slate-900 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(16,185,129,0.12) 0%, transparent 70%)',
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
            WattsGood connects you to it.
          </span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
          Free, confidential, takes 2 minutes. Available in English and Spanish. No account needed.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link
            to="/apply"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xl transition-all duration-200 hover:shadow-[0_8px_40px_rgba(16,185,129,0.5)] hover:-translate-y-1"
          >
            Find my programs — it's free
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
        <motion.p variants={fadeUp} className="text-slate-500 text-sm mt-6">
          In NYC, only 23% of eligible households enroll in HEAP. This is how we change that.
        </motion.p>
      </FadeInSection>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-3 max-w-xs text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <img
                src="/wattsgood-logo.png"
                alt="WattsGood"
                className="h-8 w-8 object-contain"
                style={{ filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(476%) hue-rotate(107deg) brightness(92%) contrast(88%)' }}
              />
              <span className="text-white font-bold text-lg">WattsGood</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              NYC's free energy assistance navigator. Built for the Sustainable Communities Challenge.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm">
            <div className="flex flex-col gap-3">
              <p className="text-slate-300 font-semibold text-xs tracking-widest uppercase">Resources</p>
              <a href="https://access.nyc.gov/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors">ACCESS HRA</a>
              <a href="https://www.nyserda.ny.gov/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors">NYSERDA</a>
              <a href="https://otda.ny.gov/programs/heap/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors">HEAP Program</a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-slate-300 font-semibold text-xs tracking-widest uppercase">App</p>
              <Link to="/apply" className="text-slate-400 hover:text-emerald-400 transition-colors">Check eligibility</Link>
              <Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors">Home</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 WattsGood. Built for the Sustainable Communities Hackathon.</p>
          <p className="text-center sm:text-right max-w-sm">
            Program information is provided for guidance only. Verify current eligibility and deadlines directly with each agency.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900">
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
