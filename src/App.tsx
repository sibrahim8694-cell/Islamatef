import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookOpen, BookText, GraduationCap, Baby, Home, Search, Heart } from 'lucide-react';
import HomePage from './pages/HomePage';
import QuranPage from './pages/QuranPage';
import EnglishPage from './pages/EnglishPage';
import StudentsPage from './pages/StudentsPage';
import KidsPage from './pages/KidsPage';
import AzkarPage from './pages/AzkarPage';

import { Toaster } from 'sonner';

function NavLinks() {
  const location = useLocation();
  const links = [
    { path: '/', label: 'الرئيسية', icon: <Home size={20} /> },
    { path: '/quran', label: 'القرآن الكريم', icon: <BookOpen size={20} /> },
    { path: '/azkar', label: 'الأذكار', icon: <Search size={20} /> },
    { path: '/english', label: 'تعلم الإنجليزية', icon: <BookText size={20} /> },
    { path: '/students', label: 'قسم الطلاب', icon: <GraduationCap size={20} /> },
    { path: '/kids', label: 'ركن الأطفال', icon: <Baby size={20} /> }
  ];

  return (
    <nav className="flex-1 px-4 space-y-1 mt-4">
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center space-x-reverse space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className={`w-6 flex justify-center ${isActive ? '' : 'ml-1'}`}>
              {isActive && <div className="w-2 h-2 rounded-full bg-primary-500 absolute ml-8" />}
              {link.icon}
            </div>
            <span className={`font-medium ${isActive ? 'mr-2' : 'mr-3'}`}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function NavLinksMobile() {
  const location = useLocation();
  const links = [
    { path: '/', label: 'الرئيسية', icon: <Home size={20} /> },
    { path: '/quran', label: 'القرآن', icon: <BookOpen size={20} /> },
    { path: '/azkar', label: 'الأذكار', icon: <Search size={20} /> },
    { path: '/english', label: 'إنجليزي', icon: <BookText size={20} /> },
    { path: '/students', label: 'للطلاب', icon: <GraduationCap size={20} /> },
    { path: '/kids', label: 'للأطفال', icon: <Baby size={20} /> }
  ];

  return (
    <>
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-primary-700 bg-primary-50' : 'text-slate-500 hover:bg-slate-50'} transition-colors flex-1`}
          >
            {link.icon}
            <span className="text-[10px] mt-1 font-bold">{link.label}</span>
          </Link>
        );
      })}
    </>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Sidebar / Navigation */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-l border-slate-200/60 flex-col hidden lg:flex shrink-0 z-10">
        <div className="p-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20">
            <BookOpen size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-slate-800 to-slate-600 tracking-tight">بوابة إسلام</h1>
        </div>
        
        <NavLinks />

        <div className="p-8 mt-auto">
          <div className="bg-gradient-to-t from-slate-900 to-slate-800 p-6 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-xs text-slate-400 mb-2 italic">صدقة جارية</p>
            <p className="font-bold text-base tracking-wide">أخي إسلام عاطف حسن</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
        {/* Top Banner */}
        <header className="h-20 bg-white/60 backdrop-blur-md border-b border-slate-200/60 flex items-center px-4 md:px-8 justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center w-full md:w-auto">
            <span className="text-slate-400 ml-4 hidden md:block">
              <Search className="w-5 h-5" />
            </span>
            <input type="text" placeholder="بحث في الدروس أو القراء..." className="bg-transparent border-none focus:ring-0 text-sm md:w-64 w-full outline-none hidden md:block" />
            <div className="lg:hidden flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="font-bold text-slate-800 text-lg">بوابة إسلام</span>
            </div>
          </div>
          <div className="text-primary-700 font-bold bg-primary-50 px-4 md:px-6 py-2 rounded-full border border-primary-100 text-xs md:text-sm whitespace-nowrap hidden md:block">
            نرجوا منكم الدعاء بالرحمة والمغفرة
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="p-4 md:p-8 flex-1 flex flex-col gap-6 overflow-y-auto pb-24 lg:pb-8">
          <div className="flex-1">
             {children}
          </div>

          {/* Footer Quote Area */}
          <div className="mt-12 bg-white/80 backdrop-blur border border-slate-200/60 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-transparent pointer-events-none" />
            <div className="flex items-center gap-5 text-center sm:text-right relative z-10">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shrink-0 mx-auto sm:mx-0 shadow-inner">
                <Heart size={20} className="fill-primary-100" />
              </div>
              <div>
                <p className="text-base text-slate-700 font-semibold mb-1">
                  "اللهم اغفر له وارحمه وعافه واعف عنه وأكرم نزله"
                </p>
                <p className="text-xs text-slate-500">من عمل صالحاً فلنفسه</p>
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-end text-xs text-slate-400 relative z-10">
              <span className="font-bold text-slate-600 mb-1">بوابة إسلام للعلم والإيمان</span>
              <span>جميع الحقوق محفوظة - ٢٠٢٦</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe-bottom">
        <NavLinksMobile />
      </div>
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
