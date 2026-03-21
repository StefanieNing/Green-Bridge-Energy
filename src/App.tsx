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
    image: 'https://picsum.photos/seed/green-factory-complex/600/600.jpg',
    stats: { power: '50MW', reduction: '12,000吨/年' },
    desc: '在慕尼黑郊区部署的AethraVolt微网系统，实现园区95%绿电自给率，并参与欧洲日前电力市场交易。'
  },
  {
    id: 2,
    title: '长三角零碳超级工厂',
    category: '工业脱碳',
    image: 'https://picsum.photos/seed/sustainable-campus/600/600.jpg',
    stats: { power: '120MW', reduction: '45,000吨/年' },
    desc: '深度整合生产排产系统与能源调度，通过AI预测实现用能成本降低18%，获评国家级绿色工厂。'
  },
  {
    id: 3,
    title: '绿电+水蓄冷智控中心',
    category: '柔性负荷',
    image: 'https://picsum.photos/seed/electric-fleet-charging/600/600.jpg',
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

const CinematicBackground = ({ src, type = 'image', poster }: { src: string, type?: 'image' | 'video', poster?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Smooth Parallax: 0.3x scroll speed effect
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
      >
        {/* Ken Burns Effect */}
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1.0 }}
          transition={{ duration: 10, ease: "easeOut" }}
          viewport={{ once: false }}
          className="w-full h-full"
        >
          {type === 'video' ? (
            <video
              autoPlay loop muted playsInline
              poster={poster}
              className="w-full h-full object-cover brightness-75 contrast-125 saturate-50"
              src={src}
            />
          ) : (
            <img
              src={src}
              alt="Cinematic Background"
              className="w-full h-full object-cover brightness-75 contrast-125 saturate-50"
              referrerPolicy="no-referrer"
            />
          )}
        </motion.div>
      </motion.div>
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
      {/* Additional dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
};

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
        <div className="flex items-center font-display font-extralight tracking-[0.2em] text-white overflow-hidden h-8 uppercase">
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
                <span className="text-sm tracking-[0.2em] text-white/80">合擎源动</span>
              </motion.div>
            ) : (
              <motion.div
                key="short"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-3xl font-extralight text-gradient tracking-[0.2em]"
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
              className="text-sm font-extralight tracking-[0.2em] text-white/70 hover:text-white transition-colors uppercase"
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
                className={`text-xs font-extralight tracking-[0.2em] transition-colors uppercase ${
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
                  className="text-sm font-extralight tracking-[0.2em] text-white/80 hover:text-[#00E5FF] uppercase"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex space-x-4 pt-4 border-t border-white/10">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setActiveLang(lang); setMobileMenuOpen(false); }}
                    className={`text-xs font-extralight tracking-[0.2em] uppercase ${activeLang === lang ? 'text-[#00E5FF]' : 'text-white/50'}`}
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
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <CinematicBackground src="https://cdn.pixabay.com/video/2020/05/14/38894-421043385_large.mp4" type="video" poster="https://picsum.photos/seed/wind-turbine-sunset/1920/1080.jpg" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] leading-tight mb-8 uppercase">
            AI+能源驱动的<br />
            <span className="text-gradient font-extralight">‘零碳新质生产力’</span><br />
            运营商
          </h1>
          <p className="text-lg md:text-xl text-white/60 font-extralight tracking-[0.2em] max-w-3xl mx-auto mb-16 uppercase">
            以数据重塑能源世界，重新定义能源资产的运营方式。
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden group px-10 py-5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-breathe"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0066FF] to-[#00E5FF] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <span className="relative flex items-center space-x-3 text-sm font-extralight tracking-[0.2em] uppercase">
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 z-10"
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
      </motion.div>
    </section>
  );
};

const ProductCenter = () => {
  return (
    <section id="products" className="py-32 relative overflow-hidden">
      <CinematicBackground src="https://picsum.photos/seed/ai-data-core/1920/1080.jpg" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <h2 className="text-sm font-display tracking-[0.3em] text-[#00E5FF] uppercase mb-6">Product Matrix</h2>
          <h3 className="text-4xl md:text-5xl font-extralight tracking-[0.2em] mb-20 uppercase">1+5 核心矩阵</h3>
        </FadeIn>

        {/* 1+5 Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {/* Core */}
          <FadeIn delay={0.1} className="lg:col-span-3 glass-panel rounded-2xl p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-[#00E5FF]/20 transition-colors duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <Cpu className="w-10 h-10 text-[#00E5FF]" />
                  <h4 className="text-3xl font-extralight tracking-[0.2em] uppercase">AethraCore AI 大模型</h4>
                </div>
                <p className="text-white/60 font-extralight tracking-[0.1em] max-w-2xl leading-relaxed">
                  基于海量能源运行数据训练的垂直领域大模型，提供从预测、决策到控制的端到端智能闭环，是整个能源矩阵的“数字大脑”。
                </p>
              </div>
              <div className="mt-10 md:mt-0">
                <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center relative">
                  <div className="absolute inset-0 border border-[#00E5FF]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-2 border border-[#0066FF]/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                  <Zap className="w-10 h-10 text-white/80" />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* 5 Platforms */}
          {PLATFORMS.map((platform, idx) => (
            <FadeIn key={platform.name} delay={0.2 + idx * 0.1} className="glass-panel glass-panel-hover rounded-2xl p-10 transition-all duration-300">
              <platform.icon className="w-8 h-8 text-[#00E5FF] mb-8" />
              <h5 className="text-xl font-extralight tracking-[0.2em] mb-4 uppercase">{platform.name}</h5>
              <p className="text-sm text-white/50 font-extralight tracking-[0.1em] leading-relaxed">{platform.desc}</p>
            </FadeIn>
          ))}
          
          {/* Empty slot filled with a decorative element to complete the 3x2 grid below the core */}
          <FadeIn delay={0.7} className="glass-panel rounded-2xl p-10 flex items-center justify-center opacity-50">
             <div className="flex space-x-3">
               {[1,2,3].map(i => (
                 <motion.div key={i} animate={{ height: [10, 40, 10] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} className="w-1 bg-[#00E5FF]/50 rounded-full"></motion.div>
               ))}
             </div>
          </FadeIn>
        </div>

        {/* 6 Dimensions */}
        <FadeIn delay={0.3} className="mb-24">
          <h4 className="text-sm font-display tracking-[0.3em] text-white/40 mb-10 uppercase text-center">六维建设体系</h4>
          <div className="flex flex-wrap justify-center gap-6">
            {DIMENSIONS.map((dim, idx) => (
              <motion.div
                key={dim}
                whileHover={{ y: -5, borderColor: 'rgba(0,229,255,0.5)' }}
                className="px-10 py-4 rounded-full border border-white/10 bg-white/5 text-sm font-extralight tracking-[0.2em] backdrop-blur-sm cursor-default transition-colors uppercase"
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
              <div className="glass-panel rounded-2xl p-12 h-full border-t border-white/20 relative z-10">
                <h5 className="text-2xl font-extralight tracking-[0.2em] mb-6 uppercase">{brand.name}</h5>
                <p className="text-white/60 font-extralight tracking-[0.1em] text-sm leading-relaxed">{brand.desc}</p>
                <div className="mt-10 flex items-center text-xs tracking-[0.2em] text-[#00E5FF] uppercase opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-500">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
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
    <section id="cases" className="py-32 relative overflow-hidden border-y border-white/5">
      <CinematicBackground src="https://picsum.photos/seed/green-factory-complex/1920/1080.jpg" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div>
            <h2 className="text-sm font-display tracking-[0.3em] text-[#00E5FF] uppercase mb-6">Global Cases</h2>
            <h3 className="text-4xl md:text-5xl font-extralight tracking-[0.2em] uppercase">全球标杆案例</h3>
          </div>
          <p className="text-white/50 font-extralight tracking-[0.1em] max-w-md mt-8 md:mt-0 text-sm leading-relaxed uppercase">
            从欧洲的微网到亚洲的零碳工厂，AethraVolt 正在全球范围内重塑能源基础设施。
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CASES.map((item, idx) => (
            <FadeIn key={item.id} delay={idx * 0.2}>
              <motion.div
                className="group relative h-[450px] rounded-2xl overflow-hidden cursor-pointer glass-panel"
                onClick={() => setSelectedCase(item.id)}
                whileHover="hover"
              >
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-75 contrast-125 saturate-50"
                  variants={{ hover: { scale: 1.05 } }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <span className="text-xs font-display tracking-[0.2em] text-[#00E5FF] uppercase mb-4 block">
                    {item.category}
                  </span>
                  <h4 className="text-2xl font-extralight tracking-[0.1em] mb-4 uppercase">{item.title}</h4>
                  
                  <motion.div
                    variants={{ hover: { opacity: 1, y: 0, height: 'auto' }, initial: { opacity: 0, y: 20, height: 0 } }}
                    initial="initial"
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-white/70 font-extralight tracking-[0.1em] mt-4 line-clamp-2 leading-relaxed">{item.desc}</p>
                    <div className="flex items-center space-x-8 mt-8 pt-8 border-t border-white/10">
                      <div>
                        <div className="text-xs text-white/40 mb-2 tracking-[0.2em] uppercase">装机容量</div>
                        <div className="text-xl font-extralight tracking-[0.1em] text-white">{item.stats.power}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/40 mb-2 tracking-[0.2em] uppercase">年减碳量</div>
                        <div className="text-xl font-extralight tracking-[0.1em] text-[#00E5FF]">{item.stats.reduction}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Modal for Case Details */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0A0A0A]/95 backdrop-blur-2xl"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel border border-white/10 rounded-2xl p-12 max-w-2xl w-full relative overflow-hidden"
            >
              <button onClick={() => setSelectedCase(null)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-extralight tracking-[0.2em] mb-8 uppercase">案例数据面板加载中...</h3>
              <div className="h-48 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
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
      <CinematicBackground src="https://picsum.photos/seed/global-business-connection/1920/1080.jpg" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Stats */}
          <div>
            <FadeIn>
              <h2 className="text-sm font-display tracking-[0.3em] text-[#00E5FF] uppercase mb-6">About Us</h2>
              <h3 className="text-4xl md:text-5xl font-extralight tracking-[0.2em] mb-10 uppercase">全球化运营网络</h3>
              <p className="text-white/60 font-extralight tracking-[0.1em] mb-16 leading-relaxed uppercase">
                AethraVolt 致力于构建无国界的绿色能源网络。通过先进的 AI 算法与边缘计算节点，我们正在全球范围内实时调度、优化和交易清洁能源。
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              <FadeIn delay={0.2} className="border-l border-white/10 pl-8">
                <div className="text-5xl font-extralight tracking-[0.1em] text-white mb-4">
                  <AnimatedCounter value={1} suffix="GW+" />
                </div>
                <div className="text-xs text-white/40 tracking-[0.2em] uppercase">管理资产规模</div>
              </FadeIn>
              <FadeIn delay={0.3} className="border-l border-white/10 pl-8">
                <div className="text-5xl font-extralight tracking-[0.1em] text-white mb-4">
                  <AnimatedCounter value={5} suffix="亿度" />
                </div>
                <div className="text-xs text-white/40 tracking-[0.2em] uppercase">累计节约电量</div>
              </FadeIn>
              <FadeIn delay={0.4} className="border-l border-[#00E5FF]/30 pl-8">
                <div className="text-5xl font-extralight tracking-[0.1em] text-[#00E5FF] mb-4">
                  <AnimatedCounter value={30} suffix="万吨" />
                </div>
                <div className="text-xs text-[#00E5FF]/60 tracking-[0.2em] uppercase">累计减少碳排</div>
              </FadeIn>
            </div>
          </div>

          {/* Map */}
          <FadeIn delay={0.5} className="relative h-[500px] w-full glass-panel rounded-3xl overflow-hidden flex items-center justify-center p-6 border border-white/5">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 120, center: [0, 20] }}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#111111"
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
                  <circle r={16} fill="#00E5FF" opacity={0.2} className="animate-ping" style={{ transformOrigin: 'center', animationDuration: '3s' }} />
                </Marker>
              ))}
            </ComposableMap>
            <div className="absolute bottom-8 left-8 flex items-center space-x-3 text-xs text-white/40 tracking-[0.2em] uppercase">
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
    { role: 'ai', text: '您好，我是 AETHRACORE 智能助手。请描述您的能源痛点，或询问关于 CBAM 碳关税的合规建议。' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "基于您的描述，AETHRAVOLT 建议部署「臻电™」边缘控制节点，结合水蓄冷系统进行削峰填谷，预计可降低 15% 的用电成本。";
      if (userMsg.toLowerCase().includes('cbam') || userMsg.includes('关税') || userMsg.includes('碳')) {
        aiResponse = "针对 CBAM（碳边境调节机制），「绿擎™」平台可为您提供从碳盘查、产品碳足迹核算到自动生成符合欧盟标准的申报报告的一站式服务，确保您的产品顺利出海。";
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <section id="ai-hub" className="py-32 relative overflow-hidden border-t border-white/5">
      <CinematicBackground src="https://picsum.photos/seed/smart-grid-network/1920/1080.jpg" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-[#0066FF]/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <FadeIn className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] text-xs font-display tracking-[0.3em] uppercase mb-8">
            <SparklesIcon className="w-4 h-4" />
            <span>Powered by Gemini</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-extralight tracking-[0.2em] mb-8 uppercase">AI 交互枢纽</h3>
          <p className="text-white/50 font-extralight tracking-[0.1em] max-w-3xl mx-auto leading-relaxed uppercase">
            与我们的能源大模型直接对话。获取定制化脱碳方案，或进行即时的国际碳税合规咨询。
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00E5FF] p-[1px]">
                  <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-extralight tracking-[0.2em] text-white uppercase">AethraCore Assistant</div>
                  <div className="text-xs text-[#00E5FF] flex items-center space-x-2 mt-1 tracking-[0.2em] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 text-white/40 hover:text-white transition-colors"><Settings className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-6 py-4 text-sm font-extralight tracking-[0.1em] leading-relaxed uppercase ${
                    msg.role === 'user' 
                      ? 'bg-white/10 text-white rounded-tr-sm border border-white/5' 
                      : 'bg-gradient-to-br from-[#0066FF]/10 to-[#00E5FF]/10 border border-[#00E5FF]/20 text-white/90 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-6 py-5 flex space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white/[0.01] border-t border-white/5">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入您的能源痛点或合规问题..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-8 pr-16 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00E5FF]/50 transition-colors font-extralight tracking-[0.1em] uppercase"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-3 w-10 h-10 rounded-full bg-[#00E5FF] text-[#0A0A0A] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
              <div className="flex justify-center space-x-6 mt-6">
                <button onClick={() => setInput("工厂电费太高怎么办？")} className="text-[10px] font-extralight tracking-[0.2em] text-white/40 hover:text-[#00E5FF] transition-colors border border-white/10 rounded-full px-4 py-2 uppercase"># 降本增效</button>
                <button onClick={() => setInput("产品出口欧洲，CBAM怎么申报？")} className="text-[10px] font-extralight tracking-[0.2em] text-white/40 hover:text-[#00E5FF] transition-colors border border-white/10 rounded-full px-4 py-2 uppercase"># CBAM 合规</button>
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 pt-24 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center mb-8 font-display font-extralight text-3xl tracking-[0.3em] uppercase">
              <span>AethraVolt</span>
            </div>
            <p className="text-white/40 font-extralight tracking-[0.2em] max-w-md mb-10 leading-relaxed text-sm uppercase">
              AI+能源驱动的“零碳新质生产力”运营商。<br/>
              以数据重塑能源世界，重新定义能源资产的运营方式。
            </p>
            <div className="flex space-x-6">
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00E5FF] hover:border-[#00E5FF]/50 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="https://github.com/aethravolt" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00E5FF] hover:border-[#00E5FF]/50 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-extralight mb-8 text-sm tracking-[0.3em] uppercase">快速链接</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/40 hover:text-[#00E5FF] transition-colors text-sm font-extralight tracking-[0.2em] uppercase">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extralight mb-8 text-sm tracking-[0.3em] uppercase">联系我们</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 text-sm font-extralight tracking-[0.1em] text-white/40 uppercase">
                <MapPin className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
                <span className="leading-relaxed">全球总部：深圳市南山区科技园<br/>AethraVolt 零碳大厦</span>
              </li>
              <li className="flex items-center space-x-4 text-sm font-extralight tracking-[0.1em] text-white/40 uppercase">
                <Mail className="w-5 h-5 text-[#00E5FF] shrink-0" />
                <a href="mailto:info@aethravolt.com" className="hover:text-white transition-colors">info@aethravolt.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-white/30 font-extralight tracking-[0.2em] uppercase">
          <p className="text-center md:text-left">© 2026 AethraVolt. All rights reserved.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
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
