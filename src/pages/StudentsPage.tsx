import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, ExternalLink, Library, Lightbulb, 
  BookOpen, Copy, Sparkles, BrainCircuit, 
  ChevronRight, GraduationCap, Zap, 
  HelpCircle, Download, Send, User, Loader2,
  FileText, Book, Globe, Microscope, Calculator,
  Palette, Presentation, Search, MessageSquare, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

type StudyLevel = 'ابتدائي' | 'إعدادي' | 'ثانوي' | 'جامعي';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function StudentsPage() {
  const [level, setLevel] = useState<StudyLevel>('ثانوي');
  const [subject, setSubject] = useState("");
  const [goal, setGoal] = useState("تبسيط المفاهيم");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  
  // Chat State
  const [chatSubject, setChatSubject] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSubject) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: `أنت مساعد تعليمي ذكي (معلم خبير) لطلاب مستوى ${level} في مادة ${chatSubject}. هدفك هو تبسيط العلوم، حل المسائل خطوة بخطوة، والإجابة على تساؤلات الطلاب بدقة وباللغة العربية بأسلوب مشجع.`
        }
      });

      const assistantMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response.text || "عذراً، حدث خطأ في معالجة طلبك." 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { id: 'error', role: 'assistant', content: "عذراً، واجهت مشكلة في الاتصال بالذكاء الاصطناعي." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const generatePrompt = () => {
    if (!subject) return;
    const prompts: Record<string, string> = {
      "تبسيط المفاهيم": `أنت معلم خبير في ${subject}. اشرح لي هذا الموضوع وكأني طالب في المستوى ${level}، استخدم أمثلة من الحياة اليومية وتجنب المصطلحات المعقدة.`,
      "تلخيص": `قم بتلخيص أهم النقاط الأساسية في مادة ${subject}. رتبها في نقاط قصيرة ومباشرة يسهل حفظها.`,
      "عمل اختبار": `ضع لي 5 أسئلة اختيارات متعددة (MCQ) لمستوى ${level} في ${subject}، مع تزويدي بالإجابات الصحيحة في النهاية.`,
      "خطة مذاكرة": `ساعدني في وضع خطة مذاكرة مكثفة لمادة ${subject} على مدار 7 أيام القادمة، بمعدل ساعتين يومياً.`
    };
    setGeneratedPrompt(prompts[goal] || prompts["تبسيط المفاهيم"]);
  };

  const resourceLinks = [
    { title: "ملزمتي", url: "https://www.mlzamty.com", desc: "افضل المذكرات والمراجعات النهائية للتحميل المباشر.", icon: <Download className="text-amber-500" /> },
    { title: "موقع الامتحان التعليمي", url: "https://www.exam-eg.com/", desc: "مراجعات وملزمات وكتب خارجية لجميع المراحل.", icon: <Book className="text-sky-500" /> },
  ];

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4" dir="rtl">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 shadow-2xl p-10 md:p-14 flex flex-col justify-center text-right">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 font-black text-xs uppercase tracking-wider">
                 <GraduationCap size={16} /> منصة الطالب الذكي
              </div>
              <div className="flex items-center gap-4">
                {['ابتدائي', 'إعدادي', 'ثانوي', 'جامعي'].map(l => (
                  <button 
                    key={l}
                    onClick={() => setLevel(l as StudyLevel)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${level === l ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
              أدواتك للتميز <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">بالذكاء الاصطناعي</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-2xl">أقوى تقنيات الذكاء الاصطناعي: حل المسائل، تبسيط العلوم، ومولد الأوامر الاحترافي.</p>
          </div>
      </section>

      {/* NotebookLM - Full Restored Section */}
      <section className="space-y-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-48 -mt-48 transition-all duration-700"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-[3rem] flex items-center justify-center text-indigo-300 shadow-2xl backdrop-blur-xl border border-white/20 shrink-0">
                <Library size={64} />
              </div>
              <div className="flex-1 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-black text-xs mb-4 uppercase tracking-widest">
                   <Sparkles size={14} /> الأداة التعليمية الأهم في 2024
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-6">Google NotebookLM</h3>
                <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-3xl mb-10">
                  حوّل كتبك وملاحظاتك إلى شريك دراسة ذكي. ارفع ملفاتك وسيقوم NotebookLM بتلخيصها، إنشاء بودكاست تعليمي منها، أو الإجابة على أسئلة دقيقة داخل المنهج.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <a 
                    href="https://notebooklm.google.com/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-3xl font-black hover:bg-slate-100 transition-all shadow-xl shadow-white/5 hover:-translate-y-1"
                  >
                    <span>ابدأ استخدام الأداة الآن</span>
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
          </div>
        </div>

        {/* NotebookLM Guide Steps */}
        <div className="grid md:grid-cols-3 gap-6">
           {[
             { 
               step: '1', 
               title: 'ارفع ملفاتك', 
               desc: 'قم برفع ملفات PDF، مذكرات، أو حتى روابط لمواقع تعليمية داخل الدفتر الخاص بك ليفهمها الذكاء الاصطناعي.',
               color: 'bg-blue-500/10 text-blue-400' 
             },
             { 
               step: '2', 
               title: 'توليد البودكاست', 
               desc: 'اطلب من الأداة إنشاء "Deep Dive" بالصوت لسماع شرح ممتع ومبسط بصوت شخصين يتحدثان عن مذكراتك.',
               color: 'bg-purple-500/10 text-purple-400' 
             },
             { 
               step: '3', 
               title: 'اسأل بذكاء', 
               desc: 'اطرح أي سؤال حول المنهج وسيقوم المحرك باستخراج الإجابة حصراً من مذكراتك التي قمت برفعها.',
               color: 'bg-emerald-500/10 text-emerald-400' 
             }
           ].map(item => (
             <div key={item.step} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg text-right relative overflow-hidden group hover:border-indigo-200 transition-colors">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center font-black text-xl mb-6`}>
                  {item.step}
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-3">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Main Tools Container */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Subject AI Chat */}
        <section className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[700px]">
          <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                 <Bot size={28} />
               </div>
               <div>
                 <h3 className="text-xl font-black text-slate-800">شات المواد والمسائل</h3>
                 <p className="text-slate-400 text-xs font-bold">اسأل وافهم وحل مسائلك فوراً</p>
               </div>
            </div>
            <select 
              value={chatSubject}
              onChange={(e) => {
                setChatSubject(e.target.value);
                setMessages([]);
              }}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-black text-xs text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:bg-indigo-50"
            >
              <option value="">اختر المادة...</option>
              <option value="الرياضيات">الرياضيات 📐</option>
              <option value="الفيزياء">الفيزياء ⚛️</option>
              <option value="الكيمياء">الكيمياء 🧪</option>
              <option value="الأحياء">الأحياء 🧬</option>
              <option value="اللغة الإنجليزية">الإنجليزية 🔤</option>
              <option value="اللغة العربية">العربية 📖</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <BrainCircuit size={64} className="text-indigo-200" />
                <p className="font-black text-slate-400 max-w-xs">
                  {chatSubject ? `ابدأ الدردشة الآن في مادة ${chatSubject}.. اطلب حل مسألة أو شرح مفهوم.` : "يرجى اختيار المادة لبدء الدردشة الذكية."}
                </p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-800 text-white'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-white text-slate-800 border border-slate-100' : 'bg-indigo-600 text-white'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-end">
                <div className="bg-slate-200 text-slate-600 px-4 py-2 rounded-2xl flex items-center gap-2 animate-pulse">
                   <Loader2 size={16} className="animate-spin" />
                   <span className="text-xs font-bold">جاري التفكير...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
             <div className="flex gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!chatSubject || isTyping}
                  placeholder={chatSubject ? "اكتب سؤالك هنا..." : "اختر المادة أولاً..."}
                   className="flex-1 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all font-bold text-sm text-right"
                />
                <button 
                  type="submit" 
                  disabled={!chatSubject || isTyping || !input.trim()}
                  className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
                >
                  <Send size={24} />
                </button>
             </div>
          </form>
        </section>

        {/* Resources Sidebar */}
        <section className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden min-h-[326px]">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <Download className="text-emerald-500" size={24} /> أفضل مصادر المذكرات والكتب
              </h3>
              <div className="grid grid-cols-1 gap-4">
                 {resourceLinks.map((link, idx) => (
                   <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-6 p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group"
                   >
                     <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                       {link.icon}
                     </div>
                     <div className="text-right flex-1">
                        <p className="font-black text-slate-800 text-sm mb-1">{link.title}</p>
                        <p className="text-xs text-slate-400 font-bold">{link.desc}</p>
                     </div>
                     <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                   </a>
                 ))}
              </div>
          </div>
        </section>
      </div>

      <section className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-3xl font-black text-slate-800">صندوق أدوات الذكاء الاصطناعي 🛠️</h2>
          <div className="h-1 flex-1 mx-8 bg-gradient-to-l from-indigo-100 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Google Gemini',
              desc: 'ذكاء جوجل الخارق للأبحاث العميقة والمنطق المتقدم والبرمجة.',
              icon: <Sparkles className="text-blue-500" />,
              url: 'https://gemini.google.com/',
              color: 'border-blue-100 hover:border-blue-400'
            },
            {
              name: 'ChatGPT',
              desc: 'الأداة الأشهر للمساعدة في الكتابة، شرح الدروس، والتفاعل اللحظي.',
              icon: <MessageSquare className="text-emerald-500" />,
              url: 'https://chatgpt.com/',
              color: 'border-emerald-100 hover:border-emerald-400'
            },
            {
              name: 'Claude AI',
              desc: 'يتميز بكتابة النصوص الطويلة والبرمجة والأسلوب الطبيعي جداً.',
              icon: <Brain className="text-orange-500" />,
              url: 'https://claude.ai/',
              color: 'border-orange-100 hover:border-orange-400'
            },
            {
              name: 'Perplexity',
              desc: 'محرك بحث ذكي يعطيك الإجابات مع توثيق المصادر وروابط أصل المعلومة.',
              icon: <Search className="text-cyan-500" />,
              url: 'https://www.perplexity.ai/',
              color: 'border-cyan-100 hover:border-cyan-400'
            },
            {
              name: 'Gamma App',
              desc: 'أداة سحرية لتحويل النصوص إلى عروض تقديمية (PowerPoint) مبهرة في ثوانٍ.',
              icon: <Presentation className="text-purple-500" />,
              url: 'https://gamma.app/',
              color: 'border-purple-100 hover:border-purple-400'
            },
            {
              name: 'Canva Magic',
              desc: 'استخدم الذكاء الاصطناعي لتصميم الصور والبوسترات التعليمية بضغطة زر.',
              icon: <Palette className="text-fuchsia-500" />,
              url: 'https://www.canva.com/magic-home/',
              color: 'border-fuchsia-100 hover:border-fuchsia-400'
            }
          ].map((tool, idx) => (
            <motion.a 
              key={idx}
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -5 }}
              className={`bg-white p-8 rounded-[2.5rem] border-2 ${tool.color} shadow-lg transition-all text-right group flex flex-col h-full`}
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">{tool.name}</h3>
              <p className="text-slate-500 font-medium leading-relaxed flex-1 text-sm">{tool.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase">
                <span>زيارة الموقع</span>
                <ExternalLink size={14} />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Prompt Generator */}
      <section className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
         <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-10 relative z-10 text-right">
            <div className="max-w-xl text-right">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-xs mb-6 uppercase">
                 <Sparkles size={14} /> مولد الأوامر التعليمية الذكي
               </div>
               <h2 className="text-3xl font-black mb-6">احصل على الرد المثالي من ChatGPT أو Gemini</h2>
               <p className="text-slate-400 text-lg font-medium">أدخل المادة ونوع المساعدة المطلوبة وسيقوم النظام بتوليد "Prompt" احترافي يعطيك أدق النتائج.</p>
            </div>
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-900/50">
               <BrainCircuit size={48} />
            </div>
         </div>

         <div className="grid md:grid-cols-2 gap-8 relative z-10 text-right">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-500 mr-2 uppercase tracking-widest text-right">الموضوع أو المادة</label>
                <input 
                  type="text" 
                  placeholder="مثال: قوانين نيوتن، البناء الضوئي..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 font-bold transition-all text-sm text-right text-white"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-500 mr-2 uppercase tracking-widest text-right">نوع المساعدة</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'تبسيط المفاهيم', label: 'شرح مبسط', icon: <Lightbulb size={16} /> },
                    { id: 'تلخيص', label: 'تلخيص شامل', icon: <FileText size={16} /> },
                    { id: 'عمل اختبار', label: 'توليد اختبار', icon: <HelpCircle size={16} /> },
                    { id: 'خطة مذاكرة', label: 'خطة دراسية', icon: <Zap size={16} /> }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setGoal(opt.id)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl font-black text-xs transition-all border-2 ${goal === opt.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={generatePrompt}
                className="w-full bg-white text-slate-900 rounded-2xl py-4 font-black hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center gap-3 text-base"
              >
                توليد الأمر الاحترافي <ChevronRight size={20} />
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-[2.5rem] p-8 border-2 border-dashed border-white/10 flex flex-col justify-center min-h-[300px]">
               {generatedPrompt ? (
                 <div className="animate-in fade-in zoom-in duration-500">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-6 font-medium text-slate-200 leading-relaxed text-right text-sm">
                       {generatedPrompt}
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPrompt);
                        alert("تم نسخ التعليمات!");
                      }}
                      className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-sm hover:bg-indigo-500 transition shadow-lg flex items-center justify-center gap-2"
                    >
                      <Copy size={18} /> نسخ الأمر
                    </button>
                 </div>
               ) : (
                 <div className="text-center text-slate-600">
                    <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-black text-sm">أدخل البيانات لتوليد الأمر الذكي</p>
                 </div>
               )}
            </div>
         </div>
      </section>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
