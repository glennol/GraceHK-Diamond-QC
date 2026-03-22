import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  { icon: '🔬', title: 'Proportion Analysis', desc: 'Evaluate table %, depth %, and L/W ratios against shape-specific grading rules.' },
  { icon: '📐', title: 'Symmetry Workspace', desc: 'Interactive guides and axis alignment tools powered by react-konva.' },
  { icon: '🔍', title: 'Clarity Annotation', desc: 'Mark inclusions with typed tags (feather, crystal, cloud…) on microscope images.' },
  { icon: '📄', title: 'Certificate OCR', desc: 'Extract and verify grading report fields using Tesseract.js OCR.' },
  { icon: '📊', title: 'QC Reports', desc: 'Generate pass/review/fail recommendations with exportable PDF reports.' },
  { icon: '💾', title: '100% Local', desc: 'All data stored in IndexedDB — no server, no uploads, fully private.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gem-900 to-slate-900 text-white">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gem-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L3 8v8l9 6 9-6V8L12 2z" />
            </svg>
          </div>
          <span className="font-bold text-lg">Lab Diamond Checker</span>
        </div>
        <Link to="/dashboard" className="px-4 py-2 bg-gem-500 hover:bg-gem-600 rounded-lg text-sm font-medium transition-colors">
          Open App →
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 bg-gem-500/20 text-gem-300 text-xs font-medium rounded-full mb-6 border border-gem-500/30">
            Production-ready · 100% Client-side
          </span>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Professional Diamond
            <span className="text-gem-400"> Quality Control</span>
            <br />in Your Browser
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Inspect lab-grown diamonds with precision tools — proportion analysis, symmetry overlays,
            clarity annotation, certificate OCR verification, and detailed PDF reports.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 bg-gem-500 hover:bg-gem-600 rounded-xl font-semibold transition-colors text-base"
            >
              Start Inspection
            </Link>
            <a
              href="https://github.com/GraceHK-Diamond-QC/GraceHK-Diamond-QC"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-colors text-base"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        Lab Diamond Checker · Static PWA · Data stays in your browser
      </footer>
    </div>
  )
}
