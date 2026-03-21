import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent } from 'motion/react';
import { Globe, Menu, X, ChevronRight, Zap, Leaf, BarChart3, Shield, Cpu, Cloud, Settings, Activity, MapPin, Mail, Building2, Github, Send, MessageSquareText, FileText, ArrowUpRight } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// --- Constants & Data ---
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NAV_LINKS = [
  { name: '首页', href: '#home' },
  { name: '产品矩阵', href: '#products' },
  { name: '案例中心', href: '#cases' },
  { name: '关于我们', href: '#about' },
  { name: 'AI 交互枢纽', href: '#ai-hub' },
];

const LANGUAGES = ['中', 'EN', 'TH', 'VI', 'DE'];

const PLATFORMS = [
  { name: '边缘控制', icon: Cpu, desc: '毫秒级响应，本地自治' },
  { name: '能源管理', icon: Zap, desc: '全局寻优，削峰填谷' },
  { name: '资产运营', icon: Activity, desc: '全生命周期健康管理' },
  { name: '碳排追踪', icon: Leaf, desc: '区块链存证，精准核算' },
  { name: '智能交易', icon: BarChart3, desc: 'AI预测，现货与绿电交易' },
];

const DIMENSIONS = ['算碳', '减碳', '脱碳', '控碳', '降碳', '抵消'];

const BRANDS = [
  { name: '臻电™', desc: '电能质量治理与柔性控制', color: 'from-blue-500 to-cyan-400' },
  { name: '驭能™', desc: '能源微网自动驾驶系统', color: 'from-cyan-400 to-emerald-400' },
  { name: '绿擎™', desc: '一站式ESG合规与碳资产管理', color: 'from-emerald-400 to-green-300' },
];

const CASES = [
  {
    id: 1,
    title: '德国光储充一体化项目',
    category: '海外微网',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop',
    stats: { power: '50MW', reduction: '12,000吨/年' },
    desc: '在慕尼黑郊区部署的AethraVolt微网系统，实现园区95%绿电自给率，并参与欧洲日前电力市场交易。'
  },
  {
    id: 2,
    title: '长三角零碳超级工厂',
    category: '工业脱碳',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    stats: { power: '120MW', reduction: '45,000吨/年' },
    desc: '深度整合生产排产系统与能源调度，通过AI预测实现用能成本降低18%，获评国家级绿色工厂。'
  },
  {
    id: 3,
    title: '绿电+水蓄冷智控中心',
    category: '柔性负荷',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1974&auto=format&fit=crop',
    stats: { power: '30MW', reduction: '8,500吨/年' },
    desc: '利用谷电与绿电进行水蓄冷，在用电高峰期释放冷量，完美匹配电网需求响应，年节省电费超千万。'
  }
];

const MARKERS = [
  { name: "Shenzhen", coordinates: [114.0579, 22.5431] },
  { name: "California", coordinates: [-119.4179, 36.7783] },
  { name: "Thailand", coordinates: [100.9925, 15.8700] },
  { name: "Germany", coordinates: [10.4515, 51.1657] },
  { name: "Vietnam", coordinates: [108.2772, 14.0583] },
  { name: "Australia", coordinates: [133.7751, -25.2744] }
];

// --- Helper Components ---

const AnimatedCounter = ({ value, suffix = "", duration = 2 }: { value: number, suffix?: string, duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * value));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Main Sections ---

const Navbar = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState('中');

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Dynamic Logo */}
        <div className="flex items-center font-display font-light tracking-widest text-white overflow-hidden h-8">
          <AnimatePresence mode="wait">
            {isScrolled ? (
              <motion.div
                key="full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center space-x-2 text-xl"
              >
                <span>AethraVolt</span>
                <span className="text-white/30">|</span>
                <span className="text-sm tracking-widest text-white/80">合擎源动</span>
              </motion.div>
            ) : (
              <motion.div
                key="short"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-3xl font-medium text-gradient"
              >
                AE
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-light text-white/70 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          {/* Language Switcher */}
          <div className="flex items-center space-x-2 pl-6 border-l border-white/10">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`text-xs font-light transition-colors ${
                  activeLang === lang ? 'text-[#00E5FF]' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-light text-white/80 hover:text-[#00E5FF]"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex space-x-4 pt-4 border-t border-white/10">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setActiveLang(lang); setMobileMenuOpen(false); }}
                    className={`text-xs font-light ${activeLang === lang ? 'text-[#00E5FF]' : 'text-white/50'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          {/* Placeholder for a high-quality industrial/wind energy video */}
          <source src="https://cdn.pixabay.com/video/2020/05/14/38894-421043385_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-thin tracking-tighter leading-tight mb-6">
            AI+能源驱动的<br />
            <span className="text-gradient font-light">‘零碳新质生产力’</span><br />
            运营商
          </h1>
          <p className="text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto mb-12 tracking-wide">
            以数据重塑能源世界，重新定义能源资产的运营方式。
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden group px-8 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-breathe"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0066FF] to-[#00E5FF] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <span className="relative flex items-center space-x-2 text-sm font-medium tracking-widest uppercase">
              <span>探索 AethraCore</span>
              <ArrowUpRight className="w-4 h-4 text-[#00E5FF]" />
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
      </motion.div>
    </section>
  );
};

const ProductCenter = () => {
  return (
    <section id="products" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-sm font-display tracking-[0.3em] text-[#00E5FF] uppercase mb-4">Product Matrix</h2>
          <h3 className="text-4xl md:text-5xl font-light mb-16">1+5 核心矩阵</h3>
        </FadeIn>

        {/* 1+5 Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Core */}
          <FadeIn delay={0.1} className="lg:col-span-3 glass-panel rounded-2xl p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-[#00E5FF]/20 transition-colors duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Cpu className="w-8 h-8 text-[#00E5FF]" />
                  <h4 className="text-3xl font-light">AethraCore AI 大模型</h4>
                </div>
                <p className="text-white/60 font-light max-w-xl">
                  基于海量能源运行数据训练的垂直领域大模型，提供从预测、决策到控制的端到端智能闭环，是整个能源矩阵的“数字大脑”。
                </p>
              </div>
              <div className="mt-8 md:mt-0">
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center relative">
                  <div className="absolute inset-0 border border-[#00E5FF]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-2 border border-[#0066FF]/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                  <Zap className="w-8 h-8 text-white/80" />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* 5 Platforms */}
          {PLATFORMS.map((platform, idx) => (
            <FadeIn key={platform.name} delay={0.2 + idx * 0.1} className="glass-panel glass-panel-hover rounded-2xl p-8 transition-all duration-300">
              <platform.icon className="w-6 h-6 text-[#00E5FF] mb-6" />
              <h5 className="text-xl font-light mb-2">{platform.name}</h5>
              <p className="text-sm text-white/50 font-light">{platform.desc}</p>
            </FadeIn>
          ))}
          
          {/* Empty slot filled with a decorative element to complete the 3x2 grid below the core */}
          <FadeIn delay={0.7} className="glass-panel rounded-2xl p-8 flex items-center justify-center opacity-50">
             <div className="flex space-x-2">
               {[1,2,3].map(i => (
                 <motion.div key={i} animate={{ height: [10, 30, 10] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="w-1 bg-[#00E5FF]/50 rounded-full"></motion.div>
               ))}
             </div>
          </FadeIn>
        </div>

        {/* 6 Dimensions */}
        <FadeIn delay={0.3} className="mb-24">
          <h4 className="text-sm font-display tracking-widest text-white/40 mb-8 uppercase text-center">六维建设体系</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {DIMENSIONS.map((dim, idx) => (
              <motion.div
                key={dim}
                whileHover={{ y: -5, borderColor: 'rgba(0,229,255,0.5)' }}
                className="px-8 py-3 rounded-full border border-white/10 bg-white/5 text-sm font-light tracking-widest backdrop-blur-sm cursor-default transition-colors"
              >
                {dim}
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* 3 Brands */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BRANDS.map((brand, idx) => (
            <FadeIn key={brand.name} delay={0.4 + idx * 0.1} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 blur-xl`}></div>
              <div className="glass-panel rounded-2xl p-10 h-full border-t border-white/20 relative z-10">
                <h5 className="text-2xl font-light mb-4">{brand.name}</h5>
                <p className="text-white/60 font-light text-sm leading-relaxed">{brand.desc}</p>
                <div className="mt-8 flex items-center text-xs tracking-widest text-[#00E5FF] uppercase opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const CaseCenter = () => {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  return (
    <section id="cases" className="py-32 bg-[#050505] relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <h2 className="text-sm font-display tracking-[0.3em] text-[#00E5FF] uppercase mb-4">Global Cases</h2>
            <h3 className="text-4xl md:text-5xl font-light">全球标杆案例</h3>
          </div>
          <p className="text-white/50 font-light max-w-md mt-6 md:mt-0 text-sm">
            从欧洲的微网到亚洲的零碳工厂，AethraVolt 正在全球范围内重塑能源基础设施。
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASES.map((item, idx) => (
            <FadeIn key={item.id} delay={idx * 0.2}>
              <motion.div
                className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedCase(item.id)}
                whileHover="hover"
              >
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  variants={{ hover: { scale: 1.05 } }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-xs font-display tracking-widest text-[#00E5FF] uppercase mb-3 block">
                    {item.category}
                  </span>
                  <h4 className="text-2xl font-light mb-2">{item.title}</h4>
                  
                  <motion.div
                    variants={{ hover: { opacity: 1, y: 0, height: 'auto' }, initial: { opacity: 0, y: 20, height: 0 } }}
                    initial="initial"
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-white/70 font-light mt-4 line-clamp-2">{item.desc}</p>
                    <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-white/10">
                      <div>
                        <div className="text-xs text-white/40 mb-1">装机容量</div>
                        <div className="text-lg font-light text-white">{item.stats.power}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/40 mb-1">年减碳量</div>
                        <div className="text-lg font-light text-[#00E5FF]">{item.stats.reduction}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Modal for Case Details (Simplified) */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0A0A0A]/90 backdrop-blur-xl"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-2xl w-full relative overflow-hidden"
            >
              <button onClick={() => setSelectedCase(null)} className="absolute top-6 right-6 text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              {/* Content based on selectedCase would go here. Using static for demo. */}
              <h3 className="text-2xl font-light mb-4">案例数据面板加载中...</h3>
              <div className="h-40 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const AboutUs = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Stats */}
          <div>
            <FadeIn>
              <h2 className="text-sm font-display tracking-[0.3em] text-[#00E5FF] uppercase mb-4">About Us</h2>
              <h3 className="text-4xl md:text-5xl font-light mb-8">全球化运营网络</h3>
              <p className="text-white/60 font-light mb-12 leading-relaxed">
                AethraVolt 致力于构建无国界的绿色能源网络。通过先进的 AI 算法与边缘计算节点，我们正在全球范围内实时调度、优化和交易清洁能源。
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <FadeIn delay={0.2} className="border-l border-white/10 pl-6">
                <div className="text-4xl font-light text-white mb-2">
                  <AnimatedCounter value={1} suffix="GW+" />
                </div>
                <div className="text-xs text-white/40 tracking-widest uppercase">管理资产规模</div>
              </FadeIn>
              <FadeIn delay={0.3} className="border-l border-white/10 pl-6">
                <div className="text-4xl font-light text-white mb-2">
                  <AnimatedCounter value={5} suffix="亿度" />
                </div>
                <div className="text-xs text-white/40 tracking-widest uppercase">累计节约电量</div>
              </FadeIn>
              <FadeIn delay={0.4} className="border-l border-[#00E5FF]/30 pl-6">
                <div className="text-4xl font-light text-[#00E5FF] mb-2">
                  <AnimatedCounter value={30} suffix="万吨" />
                </div>
                <div className="text-xs text-[#00E5FF]/60 tracking-widest uppercase">累计减少碳排</div>
              </FadeIn>
            </div>
          </div>

          {/* Map */}
          <FadeIn delay={0.5} className="relative h-[400px] w-full glass-panel rounded-3xl overflow-hidden flex items-center justify-center p-4">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 100, center: [0, 20] }}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1a1a1a"
                      stroke="#333333"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#222", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {MARKERS.map(({ name, coordinates }) => (
                <Marker key={name} coordinates={coordinates as [number, number]}>
                  <circle r={4} fill="#00E5FF" />
                  <circle r={12} fill="#00E5FF" opacity={0.3} className="animate-ping" style={{ transformOrigin: 'center' }} />
                </Marker>
              ))}
            </ComposableMap>
            <div className="absolute bottom-6 left-6 flex items-center space-x-2 text-xs text-white/40">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
              <span>全球运营节点实时在线</span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const AIHub = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: '您好，我是 AethraCore 智能助手。请描述您的能源痛点，或询问关于 CBAM 碳关税的合规建议。' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      let aiResponse = "基于您的描述，AethraVolt 建议部署「臻电™」边缘控制节点，结合水蓄冷系统进行削峰填谷，预计可降低 15% 的用电成本。";
      if (userMsg.toLowerCase().includes('cbam') || userMsg.includes('关税') || userMsg.includes('碳')) {
        aiResponse = "针对 CBAM（碳边境调节机制），「绿擎™」平台可为您提供从碳盘查、产品碳足迹核算到自动生成符合欧盟标准的申报报告的一站式服务，确保您的产品顺利出海。";
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section id="ai-hub" className="py-32 bg-[#050505] border-t border-white/5 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[#0066FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] text-xs font-display tracking-widest uppercase mb-6">
            <SparklesIcon className="w-3 h-3" />
            <span>Powered by Gemini</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-light mb-6">AI 交互枢纽</h3>
          <p className="text-white/50 font-light max-w-2xl mx-auto">
            与我们的能源大模型直接对话。获取定制化脱碳方案，或进行即时的国际碳税合规咨询。
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 flex flex-col h-[500px]">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00E5FF] p-[1px]">
                  <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-[#00E5FF]" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">AethraCore Assistant</div>
                  <div className="text-xs text-[#00E5FF] flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-white/40 hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm font-light leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-white/10 text-white rounded-tr-sm' 
                      : 'bg-gradient-to-br from-[#0066FF]/10 to-[#00E5FF]/10 border border-[#00E5FF]/20 text-white/90 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4 flex space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入您的能源痛点或合规问题..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-6 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00E5FF]/50 transition-colors font-light"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 w-8 h-8 rounded-full bg-[#00E5FF] text-[#0A0A0A] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
              <div className="flex justify-center space-x-4 mt-3">
                <button onClick={() => setInput("工厂电费太高怎么办？")} className="text-[10px] text-white/40 hover:text-[#00E5FF] transition-colors border border-white/10 rounded-full px-3 py-1"># 降本增效</button>
                <button onClick={() => setInput("产品出口欧洲，CBAM怎么申报？")} className="text-[10px] text-white/40 hover:text-[#00E5FF] transition-colors border border-white/10 rounded-full px-3 py-1"># CBAM 合规</button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

// Helper icon for AI Hub
const SparklesIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#020202] border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6 font-display font-light text-2xl tracking-widest">
              <span>AethraVolt</span>
            </div>
            <p className="text-white/50 font-light max-w-md mb-8 leading-relaxed text-sm">
              AI+能源驱动的“零碳新质生产力”运营商。<br/>
              以数据重塑能源世界，重新定义能源资产的运营方式。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#00E5FF] hover:border-[#00E5FF]/50 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://github.com/aethravolt" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#00E5FF] hover:border-[#00E5FF]/50 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 text-sm tracking-widest uppercase">快速链接</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/50 hover:text-[#00E5FF] transition-colors text-sm font-light">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 text-sm tracking-widest uppercase">联系我们</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm font-light text-white/50">
                <MapPin className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>全球总部：深圳市南山区科技园<br/>AethraVolt 零碳大厦</span>
              </li>
              <li className="flex items-center space-x-3 text-sm font-light text-white/50">
                <Mail className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <a href="mailto:info@aethravolt.com" className="hover:text-white transition-colors">info@aethravolt.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-white/30 font-light">
          <p>© 2026 AethraVolt. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
            <a href="#" className="hover:text-white transition-colors">服务条款</a>
            <a href="#" className="hover:text-white transition-colors">Cookie 政策</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- App Component ---

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#00E5FF]/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <ProductCenter />
        <CaseCenter />
        <AboutUs />
        <AIHub />
      </main>
      <Footer />
    </div>
  );
}

export default App;
