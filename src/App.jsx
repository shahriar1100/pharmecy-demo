import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, ChevronDown, Heart, MapPin, Menu, MessageCircle, Minus, PackageCheck, Phone, Plus, Search, ShoppingBag, Sparkles, Trash2, UserRound, X } from 'lucide-react'
import { CartProvider, useCart } from './context/CartContext'
import { categories, categoryLabel, products } from './data/products'
import { store } from './config/store'

const bnMoney = (value) => `৳${new Intl.NumberFormat('bn-BD').format(value)}`
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function useDialogFocus(open, onClose, initialRef) {
  const previous = useRef(null)
  useEffect(() => {
    if (!open) return
    previous.current = document.activeElement
    const timer = setTimeout(() => initialRef.current?.focus(), 30)
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const root = initialRef.current?.closest('[role="dialog"]')
      const focusable = [...(root?.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous.current?.focus?.()
    }
  }, [open, onClose, initialRef])
}

function Header({ onCart }) {
  const { count } = useCart()
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12)
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  const nav = [['হোম', 'home'], ['পণ্যসমূহ', 'products'], ['আমাদের সম্পর্কে', 'about'], ['সাধারণ প্রশ্ন', 'faq'], ['যোগাযোগ', 'contact']]
  const go = (id) => { setMenu(false); scrollTo(id) }
  return <>
    <div className="info-bar">আপনার দৈনন্দিন যত্নের প্রয়োজনীয় পণ্য</div>
    <header className={`nav-shell ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <button className="brand" onClick={() => go('home')} aria-label="হোমে যান"><span className="brand-mark"><Heart size={19} /></span><span>{store.name}</span></button>
        <nav className="desktop-nav" aria-label="প্রধান নেভিগেশন">{nav.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</nav>
        <div className="nav-actions">
          <button className="icon-btn search-shortcut" onClick={() => { scrollTo('products'); setTimeout(() => document.getElementById('product-search')?.focus(), 500) }} aria-label="পণ্য খুঁজুন"><Search size={20} /></button>
          <button className="icon-btn cart-button" onClick={onCart} aria-label={`কার্টে ${count}টি পণ্য`}><ShoppingBag size={20} />{count > 0 && <span>{count}</span>}</button>
          <button className="icon-btn mobile-menu" onClick={() => setMenu((x) => !x)} aria-expanded={menu} aria-label="মেনু"><Menu size={22} /></button>
        </div>
      </div>
      <AnimatePresence>{menu && <motion.nav className="mobile-nav" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>{nav.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}<ArrowRight size={17} /></button>)}</motion.nav>}</AnimatePresence>
    </header>
  </>
}

function Hero() {
  const reduced = useReducedMotion()
  const item = reduced ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } }
  return <section id="home" className="hero section-anchor">
    <div className="container hero-grid">
      <motion.div className="hero-copy" initial="initial" animate="animate" transition={{ staggerChildren: .1 }}>
        <motion.div {...item} className="eyebrow"><Sparkles size={15} /> PERSONAL CARE • BABY CARE • EVERYDAY ESSENTIALS</motion.div>
        <motion.h1 {...item}>নিজের ও পরিবারের যত্নে,<br /><span>প্রয়োজনীয় পণ্য এক জায়গায়</span></motion.h1>
        <motion.p {...item}>ব্যক্তিগত পরিচর্যা, বেবি কেয়ার ও দৈনন্দিন প্রয়োজনের পণ্য দেখুন। বিস্তারিত জেনে সহজেই যোগাযোগ করুন।</motion.p>
        <motion.div {...item} className="hero-actions"><button className="btn btn-primary" onClick={() => scrollTo('products')}>পণ্য দেখুন <ArrowRight size={18} /></button><button className="btn btn-secondary" onClick={() => scrollTo('contact')}>যোগাযোগ করুন</button></motion.div>
        <motion.div {...item} className="hero-note"><span><Check size={15} /> যাচাইকৃত প্যাক তথ্য</span><span><Check size={15} /> স্বচ্ছ যোগাযোগ</span></motion.div>
      </motion.div>
      <motion.div className="hero-visual" initial={reduced ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55, delay: .15 }} aria-label="নির্বাচিত ব্যক্তিগত ও বেবি কেয়ার পণ্য">
        <div className="hero-orb" />
        <motion.button className="hero-card hero-main" onClick={() => scrollTo('products')} animate={reduced ? {} : { y: [0, -7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}><img src="/images/twinkle-m.jpeg" alt="Savlon Twinkle Baby Pant Diaper, M, ৫ পিস" fetchPriority="high" /><span>বেবি কেয়ার</span></motion.button>
        <button className="hero-card hero-small hero-one" onClick={() => scrollTo('products')}><img src="/images/freedom-panty.jpeg" alt="Freedom Cotton Soft Panty System, ১০ প্যাড" /><span>প্রতিদিনের যত্ন</span></button>
        <button className="hero-card hero-small hero-two" onClick={() => scrollTo('products')}><img src="/images/freedom-belt.jpeg" alt="Freedom Cotton Soft Belt System, ১০ প্যাড" /><span>প্যাক তথ্য দেখুন</span></button>
      </motion.div>
    </div>
  </section>
}

const Reveal = ({ children, className = '' }) => <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .45 }}>{children}</motion.div>

function ProductCard({ product, onOpen, onInquiry, onCart }) {
  const price = product.price == null ? 'দাম জানতে যোগাযোগ করুন' : bnMoney(product.price)
  const eligible = product.purchaseMode === 'cart' && product.price != null
  return <motion.article className="product-card" layout whileHover={{ y: -5 }} transition={{ duration: .22 }}>
    <button className={`product-image ${product.id === 'freezy' ? 'poster' : ''}`} onClick={() => onOpen(product)} aria-label={`${product.name} বিস্তারিত দেখুন`}><img src={product.image} alt={product.name} loading="lazy" /></button>
    <div className="product-content">
      <span className="category-chip">{categoryLabel(product.category)}</span>
      <button className="product-title" onClick={() => onOpen(product)}>{product.name}</button>
      <p className="pack-size">{product.packSize || 'প্যাক তথ্য জানতে যোগাযোগ করুন'}</p>
      <p className="price">{price}</p>
      <div className="card-actions">
        <button className="details-link" onClick={() => onOpen(product)}>বিস্তারিত দেখুন <ArrowRight size={15} /></button>
        <button className="mini-action" onClick={() => eligible ? onCart(product) : onInquiry(product)}>{eligible ? <ShoppingBag size={17} /> : <MessageCircle size={17} />}<span>{eligible ? 'কার্টে' : product.purchaseMode === 'inquiry' ? 'জিজ্ঞাসা' : 'যোগাযোগ'}</span></button>
      </div>
    </div>
  </motion.article>
}

function ProductCollection({ onOpen, onInquiry, onCart }) {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => products.filter((p) => (category === 'all' || p.category === category) && `${p.name} ${p.packSize || ''} ${p.shortDescription}`.toLowerCase().includes(query.trim().toLowerCase())), [category, query])
  const choose = (id) => { setCategory(id); if (id !== 'all') setTimeout(() => scrollTo('products'), 50) }
  useEffect(() => {
    const handler = (event) => choose(event.detail)
    window.addEventListener('filter-products', handler)
    return () => window.removeEventListener('filter-products', handler)
  }, [])
  return <section id="products" className="product-section section-anchor">
    <div className="container">
      <Reveal className="section-heading"><div><span className="section-kicker">পণ্যের সংগ্রহ</span><h2>প্রয়োজনীয় পণ্য বেছে নিন</h2><p>ছবিতে দেখা প্যাক তথ্যের ভিত্তিতে সাজানো সংগ্রহ। মূল্য ও প্রাপ্যতা যোগাযোগ করে নিশ্চিত করুন।</p></div><div className="search-box"><Search size={19} /><input id="product-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="পণ্যের নাম খুঁজুন" aria-label="পণ্যের নাম খুঁজুন" />{query && <button onClick={() => setQuery('')} aria-label="সার্চ মুছুন"><X size={17} /></button>}</div></Reveal>
      <div className="filter-row" aria-label="পণ্যের ক্যাটাগরি">{categories.map((item) => <button key={item.id} className={category === item.id ? 'active' : ''} onClick={() => choose(item.id)}>{item.label}</button>)}</div>
      <div className="results-meta"><span>{new Intl.NumberFormat('bn-BD').format(filtered.length)}টি পণ্য পাওয়া গেছে</span>{(query || category !== 'all') && <button onClick={() => { setQuery(''); setCategory('all') }}>সব দেখুন</button>}</div>
      {filtered.length ? <motion.div className="product-grid" layout>{filtered.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpen} onInquiry={onInquiry} onCart={onCart} />)}</motion.div> : <div className="empty-state"><Search size={30} /><h3>কোনো পণ্য পাওয়া যায়নি</h3><p>অন্য শব্দ লিখে দেখুন অথবা সব ফিল্টার মুছে দিন।</p><button className="btn btn-primary" onClick={() => { setQuery(''); setCategory('all') }}>সব পণ্য দেখুন</button></div>}
    </div>
  </section>
}

function ProductModal({ product, onClose, onInquiry, onAdd }) {
  const closeRef = useRef(null)
  const [quantity, setQuantity] = useState(1)
  useDialogFocus(Boolean(product), onClose, closeRef)
  if (!product) return null
  const eligible = product.purchaseMode === 'cart' && product.price != null
  return <motion.div className="dialog-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" initial={{ opacity: 0, scale: .97, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98, y: 25 }} transition={{ duration: .22 }}>
      <button ref={closeRef} className="dialog-close" onClick={onClose} aria-label="ডায়ালগ বন্ধ করুন"><X size={22} /></button>
      <div className={`dialog-image ${product.id === 'freezy' ? 'poster' : ''}`}><img src={product.image} alt={product.name} /></div>
      <div className="dialog-info">
        <span className="category-chip">{categoryLabel(product.category)}</span>
        <h2 id="product-dialog-title">{product.name}</h2>
        <p className="dialog-lead">{product.description}</p>
        <div className="verified-box"><strong><PackageCheck size={19} /> ছবিতে যাচাই করা তথ্য</strong><ul>{product.verifiedDetails.map((detail) => <li key={detail}><Check size={15} />{detail}</li>)}</ul></div>
        <div className="availability"><span>মূল্য</span><strong>{product.price == null ? 'দাম জানতে যোগাযোগ করুন' : bnMoney(product.price)}</strong><small>বর্তমান প্রাপ্যতা নিশ্চিত করা হয়নি</small></div>
        {product.purchaseMode === 'inquiry' && <div className="professional-note">ওষুধ বা স্বাস্থ্যসেবা পণ্যের ক্ষেত্রে চিকিৎসক বা ফার্মাসিস্টের পেশাদার পরামর্শ নিন।</div>}
      </div>
      <div className="dialog-actionbar">
        {eligible && <div className="quantity"><button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="পরিমাণ কমান"><Minus size={17} /></button><span>{quantity}</span><button onClick={() => setQuantity((q) => Math.min(99, q + 1))} aria-label="পরিমাণ বাড়ান"><Plus size={17} /></button></div>}
        <button className="btn btn-primary dialog-main-action" onClick={() => eligible ? onAdd(product, quantity) : onInquiry(product)}>{eligible ? <><ShoppingBag size={18} /> কার্টে যোগ করুন</> : <><MessageCircle size={18} /> {product.purchaseMode === 'inquiry' ? 'ফার্মাসিস্টের সঙ্গে যোগাযোগ করুন' : 'দাম জানতে যোগাযোগ করুন'}</>}</button>
      </div>
    </motion.div>
  </motion.div>
}

function CartDrawer({ open, onClose }) {
  const { items, count, subtotal, update, remove } = useCart()
  const closeRef = useRef(null)
  useDialogFocus(open, onClose, closeRef)
  if (!open) return null
  return <motion.div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 340, damping: 34 }}>
      <div className="drawer-head"><div><span>আপনার নির্বাচন</span><h2 id="cart-title">কার্ট <small>({count})</small></h2></div><button ref={closeRef} className="icon-btn" onClick={onClose} aria-label="কার্ট বন্ধ করুন"><X size={22} /></button></div>
      {items.length ? <><div className="cart-items">{items.map(({ product, quantity }) => <div className="cart-item" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{bnMoney(product.price)}</span><div className="quantity compact"><button onClick={() => update(product.id, quantity - 1)}><Minus size={14} /></button><span>{quantity}</span><button onClick={() => update(product.id, quantity + 1)}><Plus size={14} /></button></div></div><button className="remove" onClick={() => remove(product.id)} aria-label={`${product.name} সরান`}><Trash2 size={17} /></button></div>)}</div><div className="cart-summary"><div><span>সাবটোটাল</span><strong>{bnMoney(subtotal)}</strong></div><p>ডেলিভারি চার্জ ও চূড়ান্ত প্রাপ্যতা স্টোরের সঙ্গে নিশ্চিত করতে হবে।</p><button className="btn btn-primary" disabled={!store.whatsapp}><MessageCircle size={18} />{store.whatsapp ? 'WhatsApp-এ যোগাযোগ' : 'WhatsApp নম্বর দেওয়া হয়নি'}</button></div></> : <div className="cart-empty"><div><ShoppingBag size={30} /></div><h3>কার্ট এখনো খালি</h3><p>মূল্য কনফিগার করা সাধারণ পণ্য এখানে যোগ করা যাবে।</p><button className="btn btn-secondary" onClick={() => { onClose(); scrollTo('products') }}>পণ্য দেখুন</button></div>}
    </motion.aside>
  </motion.div>
}

function CareSection() {
  const filter = (id) => { window.dispatchEvent(new CustomEvent('filter-products', { detail: id })); setTimeout(() => scrollTo('products'), 80) }
  return <section id="about" className="care-section section-anchor"><div className="container"><Reveal className="care-panel"><div className="care-copy"><span className="section-kicker">আপনার ও পরিবারের জন্য</span><h2>প্রতিদিনের যত্ন, একটু সহজ করে</h2><p>ব্যক্তিগত পরিচর্যা ও বেবি কেয়ার পণ্যের প্যাক, সাইজ এবং দৃশ্যমান তথ্য একসঙ্গে দেখে নিন। পছন্দের পণ্য সম্পর্কে জানতে সরাসরি যোগাযোগ করুন।</p><div><button className="btn btn-primary" onClick={() => filter('personal')}>ব্যক্তিগত পরিচর্যা</button><button className="btn btn-ghost" onClick={() => filter('baby')}>বেবি কেয়ার <ArrowRight size={17} /></button></div></div><div className="care-images"><div><img src="/images/freedom-belt.jpeg" alt="Freedom Cotton Soft Belt System" loading="lazy" /></div><div><img src="/images/twinkle-m.jpeg" alt="Savlon Twinkle Baby Pant Diaper" loading="lazy" /></div></div></Reveal></div></section>
}

function HowItWorks() {
  const cards = [
    { icon: Search, n: '০১', title: 'পণ্য বেছে নিন', text: 'ক্যাটাগরি বা সার্চ ব্যবহার করে প্রয়োজনীয় পণ্য খুঁজুন।' },
    { icon: PackageCheck, n: '০২', title: 'বিস্তারিত ও মূল্য জেনে নিন', text: 'প্যাকের যাচাইকৃত তথ্য দেখুন; বর্তমান মূল্য যোগাযোগ করে নিশ্চিত করুন।' },
    { icon: MessageCircle, n: '০৩', title: 'অর্ডার বা যোগাযোগ করুন', text: 'সাধারণ পণ্যের অর্ডার বা ওষুধ বিষয়ে পেশাদার পরামর্শের জন্য কথা বলুন।' },
  ]
  return <section className="how-section"><div className="container"><Reveal className="center-heading"><span className="section-kicker">সহজ তিন ধাপে</span><h2>যেভাবে প্রয়োজনীয় তথ্য পাবেন</h2></Reveal><div className="how-grid">{cards.map(({ icon: Icon, n, title, text }, i) => <Reveal key={title} className="how-card"><span className="step-no">{n}</span><div className={`how-icon tone-${i}`}><Icon size={24} /></div><h3>{title}</h3><p>{text}</p></Reveal>)}</div></div></section>
}

function FAQ() {
  const [open, setOpen] = useState(0)
  const items = [
    ['কীভাবে পণ্যের দাম জানব?', 'যেসব পণ্যের দাম দেওয়া নেই, সেগুলোর বিস্তারিত খুলে যোগাযোগের অপশন ব্যবহার করুন। স্টোরের যোগাযোগ তথ্য যোগ হলে সেখান থেকেই বর্তমান মূল্য নিশ্চিত করা যাবে।'],
    ['কীভাবে অর্ডারের বিষয়ে যোগাযোগ করব?', 'ফোন বা WhatsApp নম্বর কনফিগার করা হলে যোগাযোগ বাটন সক্রিয় হবে। বর্তমানে কোনো নম্বর না থাকলে সাইট ভুয়া লিংক দেখাবে না।'],
    ['ডেলিভারি চার্জ কীভাবে জানব?', 'ডেলিভারি চার্জ বা সময় এখনো সরবরাহ করা হয়নি। অর্ডারের আগে স্টোরের সঙ্গে এলাকা, চার্জ ও সম্ভাব্য সময় নিশ্চিত করুন।'],
    ['ওষুধের বিষয়ে পরামর্শ কোথায় পাব?', 'ওষুধের পণ্যগুলো inquiry-only রাখা হয়েছে। চিকিৎসক বা ফার্মাসিস্টের পেশাদার পরামর্শ নিন; এই সাইট ডোজ বা চিকিৎসা নির্দেশনা দেয় না।'],
    ['পেমেন্টের তথ্য কীভাবে নিশ্চিত করব?', 'স্টোর মালিক merchant তথ্য নিশ্চিত না করা পর্যন্ত QR প্রদর্শন বন্ধ। পেমেন্টের আগে প্রাপকের পরিচয় ও পরিমাণ সরাসরি নিশ্চিত করুন।'],
  ]
  return <section id="faq" className="faq-section section-anchor"><div className="container faq-layout"><Reveal className="faq-intro"><span className="section-kicker">সাধারণ প্রশ্ন</span><h2>জানার আগে<br />প্রশ্ন থাকতেই পারে</h2><p>মূল্য, ডেলিভারি, অর্ডার ও ওষুধ-সংক্রান্ত গুরুত্বপূর্ণ বিষয়গুলো স্বচ্ছভাবে জেনে নিন।</p></Reveal><div className="accordion">{items.map(([q, a], index) => <div className={`faq-item ${open === index ? 'open' : ''}`} key={q}><button aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}><span>{q}</span><ChevronDown size={20} /></button><AnimatePresence initial={false}>{open === index && <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>{a}</p></motion.div>}</AnimatePresence></div>)}</div></div></section>
}

function ContactSection() {
  const phoneHref = (number) => `tel:${number.replace(/[^\d+]/g, '')}`
  return <section id="contact" className="contact-section section-anchor"><div className="container"><Reveal className="contact-panel"><div><span className="section-kicker light">যোগাযোগ</span><h2>কোনো পণ্য সম্পর্কে<br />জানতে চান?</h2><p>পণ্যের বর্তমান মূল্য, প্রাপ্যতা ও ডেলিভারি সম্পর্কে সরাসরি {store.name}-এর সঙ্গে নিশ্চিত করুন।</p><div className="owner-line"><UserRound size={18} /><span>{store.ownerName}</span></div><div className="service-list">{store.services.map((service) => <span key={service}><Check size={14} />{service}</span>)}</div></div><div className="contact-actions"><a className="contact-card" href={phoneHref(store.phone)}><Phone size={22} /><span><small>প্রধান ফোন</small><strong>{store.phone}</strong></span></a><a className="contact-card" href={phoneHref(store.phoneSecondary)}><Phone size={22} /><span><small>বিকল্প ফোন</small><strong>{store.phoneSecondary}</strong></span></a><div className="contact-card address-card"><MapPin size={22} /><span><small>ঠিকানা</small><strong>{store.address}</strong></span></div></div></Reveal></div></section>
}

function Footer() {
  return <footer><div className="container footer-grid"><div><div className="brand footer-brand"><span className="brand-mark"><Heart size={19} /></span><span>{store.name}</span></div><p>{store.businessInfo}</p><span className="footer-owner">{store.ownerName}</span></div><div><strong>দ্রুত লিংক</strong><button onClick={() => scrollTo('products')}>পণ্যসমূহ</button><button onClick={() => scrollTo('about')}>আমাদের সম্পর্কে</button><button onClick={() => scrollTo('faq')}>সাধারণ প্রশ্ন</button></div><div><strong>যোগাযোগ</strong><a href={`tel:${store.phone.replace(/[^\d+]/g, '')}`}>{store.phone}</a><a href={`tel:${store.phoneSecondary.replace(/[^\d+]/g, '')}`}>{store.phoneSecondary}</a><span>{store.address}</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {store.name}</span><span>ওষুধের বিষয়ে চিকিৎসক বা ফার্মাসিস্টের পরামর্শ নিন।</span></div></footer>
}

function Storefront() {
  const { add } = useCart()
  const [selected, setSelected] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const showNotice = (text) => { setNotice(text); setTimeout(() => setNotice(''), 3200) }
  const inquiry = (product) => {
    if (store.whatsapp) window.open(`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`${product.name} সম্পর্কে জানতে চাই।`)}`, '_blank', 'noopener,noreferrer')
    else showNotice('যোগাযোগের নম্বর এখনো কনফিগার করা হয়নি।')
  }
  const addItem = (product, quantity = 1) => { add(product.id, quantity); setSelected(null); showNotice('পণ্যটি কার্টে যোগ হয়েছে।') }
  return <>
    <Header onCart={() => { setSelected(null); setCartOpen(true) }} />
    <main><Hero /><ProductCollection onOpen={(p) => { setCartOpen(false); setSelected(p) }} onInquiry={inquiry} onCart={addItem} /><CareSection /><HowItWorks /><FAQ /><ContactSection /></main>
    <Footer />
    <AnimatePresence>{selected && <ProductModal product={selected} onClose={() => setSelected(null)} onInquiry={inquiry} onAdd={addItem} />}</AnimatePresence>
    <AnimatePresence>{cartOpen && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />}</AnimatePresence>
    <AnimatePresence>{notice && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><Check size={18} />{notice}</motion.div>}</AnimatePresence>
  </>
}

export default function App() { return <CartProvider><Storefront /></CartProvider> }
