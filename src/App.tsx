import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, BookText, GraduationCap, Baby, Home, 
  Search, Heart, Smartphone, MoreHorizontal, X, 
  ChevronLeft, Share2, Sparkles, SunMedium
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

import HomePage from './pages/HomePage';
import QuranPage from './pages/QuranPage';
import EnglishPage from './pages/EnglishPage';
import StudentsPage from './pages/StudentsPage';
import KidsPage from './pages/KidsPage';
import AzkarPage from './pages/AzkarPage';

const APK_DOWNLOAD_URL = 'https://median.co/share/mbeybbz#apk';

function DesktopSidebar() {
  const location = useLocation();
  const links = [
    { path: '/', label: 'الرئيسية', icon: <Home size={20} /> },
    { path: '/quran', label: 'القرآن الكريم', icon: <BookOpen size={20} /> },
    { path: '/azkar', label: 'الأذكار اليومية', icon: <SunMedium size={20} /> },
    { path: '/english', label: 'تعلم الإنجليزية', icon: <BookText size={20} /> },
    { path: '/students', label: 'قسم الطلاب', icon: <GraduationCap size={20} /> },
    { path: '/kids', label: 'ركن الأطفال', icon: <Baby size={20} /> },
  ];

  return (
    <aside className="w-72 bg-white/95 backdrop-blur-xl border-l border-slate-200/80 flex-col hidden lg:flex shrink-0 z-30 select-none">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">بوابة إسلام</h1>
            <p className="text-xs text-emerald-700 font-bold">للعلم والإيمان</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 px-3 pb-2 uppercase tracking-wider">الأقسام الرئيسية</div>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-rose-50 text-[#800020] font-black shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#800020] font-medium'
              }`}
            >
              <div className={`${isActive ? 'text-[#800020]' : 'text-slate-400 group-hover:text-[#800020]'}`}>
                {link.icon}
              </div>
              <span className="text-sm">{link.label}</span>
              {isActive && <div className="mr-auto w-1.5 h-4 rounded-full bg-[#800020]" />}
            </Link>
          );
        })}

        <div className="pt-4 text-[11px] font-bold text-slate-400 px-3 pb-2 uppercase tracking-wider">تطبيق الجوال</div>
        <a
          href={APK_DOWNLOAD_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-[#800020] bg-rose-50 hover:bg-rose-100/70 font-bold transition-all border border-rose-200/60"
        >
          <Smartphone size={20} className="text-[#800020] shrink-0" />
          <div className="flex flex-col text-right">
            <span className="text-sm">حمل تطبيق أندرويد</span>
            <span className="text-[10px] text-[#800020]/80">ملف APK مجاني ومباشر</span>
          </div>
        </a>
      </nav>

      {/* Memorial Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 p-4 rounded-2xl text-white text-right shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -ml-6 -mt-6"></div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 mb-2">
            صدقة جارية
          </span>
          <p className="font-bold text-sm tracking-wide text-white">إسلام عاطف حسن</p>
          <p className="text-[11px] text-slate-300 mt-1">اللهم اغفر له وارحمه واجعله في عليين</p>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader({ onOpenMore }: { onOpenMore: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitles: Record<string, string> = {
    '/': 'بوابة إسلام',
    '/quran': 'القرآن الكريم',
    '/azkar': 'أذكار الصباح والمساء',
    '/english': 'تعلم الإنجليزية',
    '/students': 'قسم الطلاب',
    '/kids': 'ركن الأطفال'
  };

  const isHome = location.pathname === '/';
  const currentTitle = pageTitles[location.pathname] || 'بوابة إسلام';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'بوابة إسلام للعلم والإيمان - صدقة جارية',
          text: 'منصة إسلامية وتعليمية شاملة (قرآن كريم، أذكار، تعليم إنجليزي، قسم الطلاب والأطفال) صدقة جارية على روح أخي إسلام عاطف حسن.',
          url: window.location.origin
        });
      } catch {
        // Ignored dismissal
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast.success('تم نسخ الرابط لمشاركته مع أحبابك كصدقة جارية');
    }
  };

  return (
    <header className="h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center px-4 justify-between shrink-0 sticky top-0 z-30 pt-safe">
      <div className="flex items-center gap-2.5">
        {!isHome && (
          <button 
            onClick={() => navigate(-1)}
            aria-label="الرجوع للصفحة السابقة"
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 active:bg-slate-200 transition"
          >
            <ChevronLeft size={18} className="rotate-180" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center shadow-xs text-white shrink-0">
            <BookOpen size={17} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-800 text-sm leading-tight truncate">
              {isHome ? 'بوابة إسلام' : currentTitle}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold leading-none">صدقة جارية</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleShare}
          aria-label="مشاركة التطبيق"
          className="w-8 h-8 rounded-full bg-rose-50 text-[#800020] flex items-center justify-center active:bg-rose-100 transition"
          title="مشاركة الأجر"
        >
          <Share2 size={16} />
        </button>
        <a
          href={APK_DOWNLOAD_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#800020] text-white text-xs font-bold active:bg-[#5a0016] shadow-xs"
        >
          <Smartphone size={13} />
          <span>تطبيق</span>
        </a>
      </div>
    </header>
  );
}

function MobileBottomNav({ onOpenEducation, onOpenMore }: { onOpenEducation: () => void; onOpenMore?: () => void }) {
  const location = useLocation();
  const isEducationActive = ['/english', '/students', '/kids'].includes(location.pathname);

  return (
    <nav 
      aria-label="شريط التنقل السفلي للتطبيق"
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-rose-100/80 z-40 pb-safe shadow-[0_-4px_20px_rgba(128,0,32,0.06)]"
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-md mx-auto px-1">
        {/* Tab 1: Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center h-full min-h-[44px] rounded-lg transition-colors touch-press ${
            location.pathname === '/' 
              ? 'text-[#800020] font-black' 
              : 'text-[#800020]/60 hover:text-[#800020]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Home size={20} strokeWidth={location.pathname === '/' ? 2.4 : 1.8} />
            {location.pathname === '/' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#800020] rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1">الرئيسية</span>
        </Link>

        {/* Tab 2: Quran */}
        <Link
          to="/quran"
          className={`flex flex-col items-center justify-center h-full min-h-[44px] rounded-lg transition-colors touch-press ${
            location.pathname === '/quran' 
              ? 'text-[#800020] font-black' 
              : 'text-[#800020]/60 hover:text-[#800020]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <BookOpen size={20} strokeWidth={location.pathname === '/quran' ? 2.4 : 1.8} />
            {location.pathname === '/quran' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#800020] rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1">القرآن</span>
        </Link>

        {/* Tab 3: Azkar */}
        <Link
          to="/azkar"
          className={`flex flex-col items-center justify-center h-full min-h-[44px] rounded-lg transition-colors touch-press ${
            location.pathname === '/azkar' 
              ? 'text-[#800020] font-black' 
              : 'text-[#800020]/60 hover:text-[#800020]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <SunMedium size={20} strokeWidth={location.pathname === '/azkar' ? 2.4 : 1.8} />
            {location.pathname === '/azkar' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#800020] rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1">الأذكار</span>
        </Link>

        {/* Tab 4: Education Hub */}
        <button
          onClick={onOpenEducation}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] rounded-lg transition-colors touch-press ${
            isEducationActive 
              ? 'text-[#800020] font-black' 
              : 'text-[#800020]/60 hover:text-[#800020]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <GraduationCap size={20} strokeWidth={isEducationActive ? 2.4 : 1.8} />
            {isEducationActive && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#800020] rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1">التعليم</span>
        </button>

        {/* Tab 5: Download App - Matched with other tabs in size and stroke */}
        <a
          href={APK_DOWNLOAD_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            toast.success('جاري فتح رابط تحميل تطبيق الأندرويد (APK)...');
          }}
          className="flex flex-col items-center justify-center h-full min-h-[44px] rounded-lg text-[#800020]/75 hover:text-[#800020] active:text-[#800020] transition-colors touch-press"
          aria-label="تحميل تطبيق أندرويد"
        >
          <div className="relative flex items-center justify-center">
            <Smartphone size={20} strokeWidth={1.8} />
          </div>
          <span className="text-[10px] sm:text-[11px] mt-1 font-bold whitespace-nowrap">تحميل التطبيق</span>
        </a>
      </div>
    </nav>
  );
}

function EducationDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  if (!isOpen) return null;

  const eduLinks = [
    {
      path: '/english',
      title: 'تعلم اللغة الإنجليزية',
      desc: 'مسار تعليمي متدرج من الحروف وحتى المحادثة والذكاء الاصطناعي',
      icon: <BookText size={22} className="text-indigo-600" />,
      badge: 'محادثة وتأسيس'
    },
    {
      path: '/students',
      title: 'قسم الطلاب والذكاء الاصطناعي',
      desc: 'تلخيص الدروس، إجابات علمية وشرح المناهج الدراسية',
      icon: <GraduationCap size={22} className="text-emerald-600" />,
      badge: 'مساعد دراسي'
    },
    {
      path: '/kids',
      title: 'ركن الأطفال',
      desc: 'قصص تفاعلية، ألعاب حساب وحروف ورسم مبسط للصغار',
      icon: <Baby size={22} className="text-rose-500" />,
      badge: 'تأسيس ممتع'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose} 
      />
      <div className="relative bg-white rounded-t-3xl p-6 z-10 max-w-lg mx-auto w-full shadow-2xl pb-safe">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-800">الأقسام التعليمية</h3>
            <p className="text-xs text-slate-500">اختر القسم الذي تود دراسته أو استكشافه</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2.5 my-2">
          {eduLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${
                  isActive 
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-xs' 
                    : 'border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/80'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-xs shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 text-right min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 text-sm truncate">{item.title}</span>
                    <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MoreDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose} 
      />
      <div className="relative bg-white rounded-t-3xl p-6 z-10 max-w-lg mx-auto w-full shadow-2xl pb-safe">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-800">بوابة إسلام - وضع التطبيق</h3>
            <p className="text-xs text-slate-500">صدقة جارية على روح إسلام عاطف حسن</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* APK Promo Banner */}
        <a
          href={APK_DOWNLOAD_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md mb-4 active:opacity-95"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Smartphone size={24} />
            </div>
            <div className="text-right">
              <p className="font-black text-sm">تحميل تطبيق أندرويد (APK)</p>
              <p className="text-xs text-emerald-100">تثبيت مباشر وتجربة تطبيق كاملة</p>
            </div>
          </div>
          <ChevronLeft size={20} className="rotate-180 text-emerald-200 shrink-0" />
        </a>

        {/* Memorial Dua */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4 text-center">
          <p className="text-xs text-slate-500 mb-1 font-bold">دعاء لأخينا المرحوم</p>
          <p className="text-sm font-bold text-slate-800 leading-relaxed">
            "اللهم اغفر له وارحمه وعافه واعف عنه، وأكرم نزله ووسّع مدخله، واجعل قبره روضة من رياض الجنة"
          </p>
          <p className="text-xs text-emerald-700 font-bold mt-2">إسلام عاطف حسن</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'بوابة إسلام للعلم والإيمان',
                  text: 'منصة إسلامية وتعليمية شاملة صدقة جارية',
                  url: window.location.origin
                });
              } else {
                navigator.clipboard.writeText(window.location.origin);
                toast.success('تم نسخ الرابط');
              }
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold active:bg-slate-200"
          >
            <Share2 size={16} />
            <span>مشاركة الرابط</span>
          </button>

          <button
            onClick={() => {
              toast.info('بوابة إسلام تعمل في وضع تطبيق الويب التقدمي (PWA)');
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold active:bg-slate-200"
          >
            <Sparkles size={16} />
            <span>عن المنصة</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [eduDrawerOpen, setEduDrawerOpen] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex overflow-hidden relative" dir="rtl">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>
      
      {/* Sidebar for Desktop */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-white/70 backdrop-blur-md border-b border-slate-200/70 items-center px-8 justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <span className="text-xs text-slate-400 font-medium">
              بوابة إسلام للعلم والإيمان - صدقة جارية
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-bold hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
            >
              <Smartphone size={14} className="text-emerald-600" />
              <span>تحميل تطبيق الهاتف (APK)</span>
            </a>
            <div className="text-emerald-800 font-bold bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 text-xs">
              نسألكم الدعاء بالرحمة والمغفرة
            </div>
          </div>
        </header>

        {/* Mobile Header (Native App Bar) */}
        <div className="lg:hidden">
          <MobileHeader onOpenMore={() => setMoreDrawerOpen(true)} />
        </div>

        {/* Scrollable Content Container */}
        <div className="p-3.5 sm:p-6 md:p-8 flex-1 flex flex-col gap-6 overflow-y-auto pb-24 lg:pb-8 hide-scrollbar">
          <div className="flex-1 max-w-7xl mx-auto w-full">
            {children}
          </div>

          {/* Footer Area */}
          <footer className="mt-8 bg-white/80 backdrop-blur border border-slate-200/70 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-xs max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3.5 text-center sm:text-right">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 mx-auto sm:mx-0 shadow-inner">
                <Heart size={18} className="fill-emerald-100" />
              </div>
              <div>
                <p className="text-sm text-slate-700 font-bold">
                  "اللهم اغفر له وارحمه وعافه واعف عنه وأكرم نزله"
                </p>
                <p className="text-xs text-slate-400">صدقة جارية على روح إسلام عاطف حسن</p>
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-end text-xs text-slate-400">
              <span className="font-bold text-slate-600">بوابة إسلام للعلم والإيمان</span>
              <span>جميع الحقوق محفوظة لكل مسلم ينتفع بها</span>
            </div>
          </footer>
        </div>
      </main>
      
      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav 
        onOpenEducation={() => setEduDrawerOpen(true)}
        onOpenMore={() => setMoreDrawerOpen(true)}
      />

      {/* Drawers */}
      <EducationDrawer 
        isOpen={eduDrawerOpen} 
        onClose={() => setEduDrawerOpen(false)} 
      />
      <MoreDrawer 
        isOpen={moreDrawerOpen} 
        onClose={() => setMoreDrawerOpen(false)} 
      />

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quran" element={<QuranPage />} />
          <Route path="/azkar" element={<AzkarPage />} />
          <Route path="/english" element={<EnglishPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/kids" element={<KidsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
