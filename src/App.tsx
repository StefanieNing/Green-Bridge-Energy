import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'motion/react';
import { Globe, Menu, X, ChevronDown, ArrowRight, Zap, Leaf, BarChart3, Shield, Cpu, Cloud, Settings, Activity, MapPin, Mail, Building2 } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// --- Constants ---
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NAV_LINKS = [
  { name: '首页', href: '#home' },
  { name: '产品中心', href: '#products' },
  { name: '案例中心', href: '#cases' },
  { name: '关于我们', href: '#about' },
  { name: '联系我们', href: '#contact' },
];

const LANGUAGES = ['中文', 'English', 'ภาษาไทย', 'Tiếng Việt', 'Deutsch'];

const MARKERS = [
  { name: "深圳 (总部)", coordinates: [114.0579, 22.5431] },
  { name: "加州 (美国)", coordinates: [-119.4179, 36.7783] },
  { name: "泰国", coordinates: [100.9925, 15.8700] },
  { name: "德国", coordinates: [10.4515, 51.1657] },
  { name: "越南", coordinates: [108.2772, 14.0583] },
  { name: "澳大利亚", coordinates: [133.7751, -25.2744] },
];

// --- Components ---

const AnimatedCounter = ({ value, suffix, text, label }: { value: number, suffix: string, text: string, label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300"
    >
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00E5FF] to-[#0066FF] bg-clip-text text-transparent mb-2">
        {count}{suffix}
      </div>
      <div className="text-lg font-semibold text-white mb-1">{label}</div>
      <div className="text-sm text-gray-400 text-center">{text}</div>
    </motion.div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#050505]/80 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center group">
          <div className="relative h-8 flex items-center overflow-hidden w-48">
            <AnimatePresence mode="wait">
              {!isScrolled ? (
                <motion.div
                  key="short-logo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute text-2xl font-bold tracking-wider text-white"
                >
                  AE
                </motion.div>
              ) : (
                <motion.div
                  key="full-logo"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="absolute flex items-center whitespace-nowrap"
                >
                  <span className="text-xl font-bold text-white tracking-wide">Aethra</span>
                  <span className="text-xl font-bold text-[#00E5FF]">V</span>
                  <span className="text-xl font-bold text-white tracking-wide mr-2">olt</span>
                  <span className="text-sm text-gray-400 border-l border-gray-600 pl-2">合擎源动</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-[#00E5FF] transition-colors">
              {link.name}
            </a>
          ))}
          
          {/* Language Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-[#00E5FF] transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-32 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setCurrentLang(lang); setLangDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#00E5FF] transition-colors"
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-300 hover:text-[#00E5FF] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setCurrentLang(lang); setMobileMenuOpen(false); }}
                    className={`px-3 py-1 text-sm rounded-full border ${currentLang === lang ? 'border-[#00E5FF] text-[#00E5FF]' : 'border-white/10 text-gray-400'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Video Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Placeholder video URL for wind turbine/sunset vibe */}
          <source src="https://cdn.pixabay.com/video/2020/05/25/40143-424838637_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
            <span className="text-sm text-gray-300 tracking-wide">AethraVolt 智启能源 · 绿擎未来</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight mb-6"
          >
            AI+能源驱动的 <br/>
            <span className="bg-gradient-to-r from-[#00E5FF] to-[#0066FF] bg-clip-text text-transparent">
              “零碳新质生产力”
            </span> <br/>
            运营商
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl"
          >
            以数据为关键要素，用AI重构区域能源体系，打造绿色的零碳新质生产力。
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#products" className="group relative px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#0066FF] rounded-full text-white font-semibold overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] flex items-center">
              <span className="relative z-10">探索解决方案</span>
              <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </a>
            <a href="#about" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 backdrop-blur-md transition-colors flex items-center">
              了解我们
            </a>
          </motion.div>
        </div>

        {/* Data Counters */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCounter value={1} suffix="GW+" label="累计运营资产" text="聚合管理绿色能源与分布式负荷" />
          <AnimatedCounter value={5} suffix="亿度" label="累计节约电能" text="为企业创造过亿美元能源成本节约" />
          <AnimatedCounter value={30} suffix="万吨" label="累计减少碳排" text="等效减少近百万吨 CO₂ 排放" />
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 mt-8 text-sm tracking-wide"
        >
          “我们不仅提供能源解决方案，更构建可持续发展的底层能源能力。”
        </motion.p>
      </div>
    </section>
  );
};

const CollapsibleSection = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductsSection = () => {
  const [activeFilter, setActiveFilter] = useState('全部');
  const filters = ['全部', '智能设备', '软件系统', '解决方案'];

  const products = [
    { name: 'AethraEdge边缘能量控制器', category: '智能设备', desc: '一体化智能硬件架构，内置AI控制模块，实现负荷预测与动态功率优化。', icon: <Cpu className="w-6 h-6 text-[#00E5FF]" /> },
    { name: 'AethraPilot AI智能控制', category: '软件系统', desc: 'AI学习产线节拍，自动调整设备运行参数，实现“人休机停、按需供能”。', icon: <Activity className="w-6 h-6 text-[#00E5FF]" /> },
    { name: 'AethraGrid能源管理云平台', category: '软件系统', desc: '能源管理AI中枢，EMS+MES联动，产线级能耗监控与预警。', icon: <Cloud className="w-6 h-6 text-[#00E5FF]" /> },
    { name: '零碳工厂整体解决方案', category: '解决方案', desc: '对标《零碳工厂评价规范》，提供端到端的一站式综合能源服务。', icon: <Building2 className="w-6 h-6 text-[#00E5FF]" /> },
  ];

  const filteredProducts = activeFilter === '全部' ? products : products.filter(p => p.category === activeFilter);

  return (
    <section id="products" className="py-24 bg-[#050505] relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00E5FF]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">产品中心</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">以 AethraCore AI 模型为核心，构建“1+5”多维产品矩阵，赋能零碳转型。</p>
        </div>

        <CollapsibleSection title="1+5 多维产品矩阵" defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div className="md:col-span-5 bg-gradient-to-r from-[#00E5FF]/20 to-[#0066FF]/20 p-6 rounded-xl border border-[#00E5FF]/30 text-center mb-4">
              <h4 className="text-xl font-bold text-white mb-2">擎苍 AethraCore 能源中枢大模型</h4>
              <p className="text-sm text-gray-300">端-边-云架构的核心大脑，驱动全场景能源智能调度</p>
            </div>
            {[
              { title: '擎元', desc: '设备管理和能效优化平台' },
              { title: '擎碳', desc: '智慧能碳管理平台' },
              { title: '擎穹', desc: '智慧能源管理平台' },
              { title: '擎维', desc: '智能运维和运维平台' },
              { title: '擎能', desc: '电能质量监测和优化平台' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 text-center hover:bg-white/10 transition-colors">
                <h5 className="text-lg font-bold text-[#00E5FF] mb-1">{item.title}</h5>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="六维建设体系 (对标零碳工厂评价规范)">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {[
              { title: '科学算碳', desc: '建立 ISO14064 核算体系' },
              { title: '源头减碳', desc: '分布式光储 + 绿电直连' },
              { title: '过程脱碳', desc: 'AI 设备级智控，能耗降15%' },
              { title: '智能控碳', desc: '数字化能碳中心实时监管' },
              { title: '协同降碳', desc: '产品全生命周期 LCA 建模' },
              { title: '抵消披露', desc: '对接国际认证机构协助认证' },
            ].map((item, i) => (
              <div key={i} className="group relative p-6 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <h5 className="text-white font-semibold mb-2 relative z-10">{item.title}</h5>
                <p className="text-sm text-gray-400 relative z-10 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300">{item.desc}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/0 to-[#0066FF]/0 group-hover:from-[#00E5FF]/10 group-hover:to-[#0066FF]/10 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Product Filter */}
        <div className="mt-16 mb-8 flex flex-wrap justify-center gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === filter ? 'bg-[#00E5FF] text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#00E5FF]/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {product.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{product.name}</h4>
                <p className="text-sm text-gray-400">{product.desc}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Three Brand Services */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-white mb-2">三大品牌服务</h3>
          <p className="text-gray-400">AethraVolt SERVICES</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Aethra·臻电™', desc: '主动式电能治理', features: ['三相不平衡治理', '谐波抑制', '无功补偿', 'AI主动防御'], icon: <Zap className="w-8 h-8" /> },
            { name: 'Aethra·驭能™', desc: 'AI驱动的能源自动驾驶', features: ['AI削峰填谷', '智能水蓄冷', 'VPP收益', '绿电最大化'], icon: <Settings className="w-8 h-8" /> },
            { name: 'Aethra·绿擎™', desc: '碳管理与ESG合规', features: ['AethraGrid平台', 'EMS+MES联动', '碳足迹追踪', 'ESG合规服务'], icon: <Leaf className="w-8 h-8" /> },
          ].map((brand, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="relative p-[1px] rounded-3xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent group-hover:from-[#00E5FF] group-hover:to-[#0066FF] transition-colors duration-500"></div>
              <div className="relative h-full bg-[#0a0a0a] p-8 rounded-[23px] flex flex-col">
                <div className="text-[#00E5FF] mb-6">{brand.icon}</div>
                <h4 className="text-2xl font-bold text-white mb-2">{brand.name}</h4>
                <p className="text-gray-400 mb-6 pb-6 border-b border-white/10">{brand.desc}</p>
                <ul className="space-y-3 mt-auto">
                  {brand.features.map((feat, j) => (
                    <li key={j} className="flex items-center text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mr-3"></div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CasesSection = () => {
  const cases = [
    { title: '零碳工厂：光储一体化项目', img: 'https://picsum.photos/seed/factory1/800/600', tag: '零碳工厂' },
    { title: '零碳工厂：绿电+水蓄冷项目', img: 'https://picsum.photos/seed/factory2/800/600', tag: '零碳工厂' },
    { title: '零碳园区：光伏+污水处理项目', img: 'https://picsum.photos/seed/park1/800/600', tag: '零碳园区' },
    { title: '零碳园区：德国光储充一体化项目', img: 'https://picsum.photos/seed/park2/800/600', tag: '国际项目' },
  ];

  return (
    <section id="cases" className="py-24 bg-[#020202] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">案例中心</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">标杆项目展示，见证零碳新质生产力的落地与价值创造。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
            >
              <img 
                src={item.img} 
                alt={item.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-3 py-1 bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-semibold rounded-full mb-3 backdrop-blur-md border border-[#00E5FF]/30">
                  {item.tag}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0066FF]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">关于我们</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            成立于2017年加州，2025年设立深圳总部。<br/>
            致力于成为全球领先的零碳新质生产力运营商。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { title: '核心愿景', desc: '以优质负荷为核心，以AI为引擎，成为全球领先的零碳新质生产力运营商', icon: <Globe className="w-6 h-6" /> },
            { title: '核心定位', desc: 'AI+数据驱动的“零碳新质生产力”能源运营商', icon: <Shield className="w-6 h-6" /> },
            { title: '聚焦领域', desc: '低碳绿色能源、能源精益运营、ESG价值创造', icon: <Leaf className="w-6 h-6" /> },
            { title: '客户价值', desc: '省成本、创收益、高效率、ESG标杆', icon: <BarChart3 className="w-6 h-6" /> },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#0066FF]/20 flex items-center justify-center text-[#00E5FF] mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Global Map */}
        <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/10 overflow-hidden relative">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">全球化布局</h3>
          <div className="w-full max-w-4xl mx-auto aspect-[2/1] relative">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1a1a1a"
                      stroke="#333"
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
                  <g transform="translate(-12, -24)">
                    <motion.circle
                      cx="12"
                      cy="24"
                      r="6"
                      fill="#00E5FF"
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: [0.8, 2, 0.8], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <circle cx="12" cy="24" r="4" fill="#00E5FF" />
                  </g>
                  <text
                    textAnchor="middle"
                    y={-10}
                    style={{ fontFamily: "system-ui", fill: "#fff", fontSize: "10px", fontWeight: "bold" }}
                  >
                    {name}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#020202] border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-white tracking-wide">Aethra</span>
              <span className="text-2xl font-bold text-[#00E5FF]">V</span>
              <span className="text-2xl font-bold text-white tracking-wide">olt</span>
            </div>
            <p className="text-gray-400 max-w-md mb-8">
              AI+能源驱动的“零碳新质生产力”运营商。<br/>
              以数据重塑能源世界，重新定义能源资产的运营方式。
            </p>
            <div className="flex space-x-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#00E5FF] hover:bg-white/10 transition-colors cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">快速链接</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-[#00E5FF] transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">联系我们</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <Mail className="w-5 h-5 text-[#00E5FF] shrink-0" />
                <span>info@aethravolt.com</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-[#00E5FF] shrink-0" />
                <div>
                  <strong className="block text-gray-300 mb-1">深圳总部</strong>
                  深圳南山区清华信息港科研楼
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-[#00E5FF] shrink-0" />
                <div>
                  <strong className="block text-gray-300 mb-1">美国总部</strong>
                  加利福尼亚州圣地亚哥
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AethraVolt 合擎源动. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">隐私政策</a>
            <a href="#" className="hover:text-gray-300">服务条款</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00E5FF]/30">
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <CasesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
