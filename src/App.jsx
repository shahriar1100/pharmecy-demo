import { motion, useReducedMotion } from 'motion/react'

/*
 * TEMPORARY COMING-SOON MODE
 * --------------------------------------------------------------------------
 * The complete pharmacy storefront is intentionally disabled while this
 * component is active. Its last working source remains preserved in Git at
 * commit 2387cdb, so it can be restored without keeping hundreds of lines of
 * dead/commented JSX in the production bundle.
 *
 * Restore later with:
 *   git show 2387cdb:src/App.jsx
 *   git show 2387cdb:src/index.css
 * --------------------------------------------------------------------------
 */
import {
  Activity,
  Clock3,
  Droplets,
  Gauge,
  HeartPulse,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react'
import { store } from './config/store'

const phoneHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`

function App() {
  const reducedMotion = useReducedMotion()
  const reveal = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }

  const services = [
    { icon: Activity, label: store.services[0] },
    { icon: Gauge, label: store.services[1] },
    { icon: Droplets, label: store.services[2] },
  ]

  return (
    <main className="coming-soon">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label={`${store.name} হোম`}>
          <span className="brand-mark"><HeartPulse size={22} /></span>
          <span>{store.name}</span>
        </a>
        <a className="top-call" href={phoneHref(store.phone)}>
          <Phone size={17} />
          <span>{store.phone}</span>
        </a>
      </header>

      <section id="top" className="hero">
        <motion.div
          className="hero-copy"
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div className="status-pill" {...reveal}>
            <span className="status-dot" aria-hidden="true" />
            <span>ওয়েবসাইট প্রস্তুত হচ্ছে</span>
          </motion.div>

          <motion.div className="icon-orbit" {...reveal} aria-hidden="true">
            <HeartPulse size={42} />
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
          </motion.div>

          <motion.p className="eyebrow" {...reveal}>
            <Sparkles size={15} /> শিগগিরই নতুনভাবে
          </motion.p>
          <motion.h1 {...reveal}>
            আসছে আমাদের<br />
            <span>নতুন ওয়েবসাইট</span>
          </motion.h1>
          <motion.p className="intro" {...reveal}>
            আরও সহজে প্রয়োজনীয় ওষুধ ও স্বাস্থ্যসেবা পণ্যের তথ্য পেতে আমাদের সঙ্গে থাকুন।
            এর মধ্যেও ফার্মেসির নিয়মিত সেবা চালু আছে।
          </motion.p>

          <motion.div className="actions" {...reveal}>
            <a className="button button-primary" href={phoneHref(store.phone)}>
              <Phone size={19} /> এখনই কল করুন
            </a>
            <a className="button button-secondary" href={phoneHref(store.phoneSecondary)}>
              বিকল্প নম্বর: {store.phoneSecondary}
            </a>
          </motion.div>
        </motion.div>

        <motion.aside
          className="info-card"
          initial={reducedMotion ? false : { opacity: 0, x: 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="card-heading">
            <span><Clock3 size={20} /></span>
            <div>
              <small>আমরা আছি আপনার পাশে</small>
              <h2>দোকানের সেবা চালু আছে</h2>
            </div>
          </div>

          <div className="services" aria-label="আমাদের স্বাস্থ্যসেবা">
            {services.map(({ icon: Icon, label }) => (
              <div className="service" key={label}>
                <span><Icon size={19} /></span>
                <p>{label}</p>
              </div>
            ))}
          </div>

          <div className="address">
            <MapPin size={20} />
            <div>
              <small>আমাদের ঠিকানা</small>
              <p>{store.address}</p>
            </div>
          </div>
        </motion.aside>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} {store.name}</p>
        <p>আপনার সুস্থতাই আমাদের অগ্রাধিকার</p>
      </footer>
    </main>
  )
}

export default App
