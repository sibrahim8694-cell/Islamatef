import React from 'react';
import { Type, Grid, MessageCircle, Headphones, Book, GraduationCap, Zap } from 'lucide-react';

export type ContentType = 'info' | 'multiple_choice' | 'writing';

export interface InteractiveStep {
  type: ContentType;
  eng?: string;
  ar?: string;
  phonetic?: string;
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
}

export interface Lesson {
  id: string;
  title: string;
  steps: InteractiveStep[];
}

export interface Level {
  id: number;
  title: string;
  description: string;
  color: string;
  badge: string;
  icon: React.ReactNode;
  lessons: Lesson[];
  level_type: 'beginner' | 'intermediate' | 'advanced';
  category: 'kids' | 'students' | 'general';
}

export const curriculum: Level[] = [
  {
    id: 1,
    title: "1. الأبجدية والأساسيات",
    description: "تعلّم نطق جميع الحروف الإنجليزية الـ 26 وبناء الكلمات الأولى",
    color: "from-blue-600 to-indigo-700",
    badge: "ميدالية المبتدئ",
    level_type: 'beginner',
    category: 'kids',
    icon: <Type className="w-8 h-8 text-white" />,
    lessons: [
      { id: "alphabet_1", title: "الحروف (A - H)", steps: [
        { type: 'info', eng: "A - Apple", ar: "أ - تفاحة", phonetic: "أبل" },
        { type: 'info', eng: "B - Book", ar: "ب - كتاب", phonetic: "بوك" },
        { type: 'info', eng: "C - Cat", ar: "ك - قطة", phonetic: "كات" },
        { type: 'info', eng: "D - Dog", ar: "د - كلب", phonetic: "دوج" },
        { type: 'info', eng: "E - Egg", ar: "إ - بيضة", phonetic: "إيغ" },
        { type: 'info', eng: "F - Fish", ar: "ف - سمكة", phonetic: "فيش" },
        { type: 'info', eng: "G - Goat", ar: "ج - ماعز", phonetic: "جوت" },
        { type: 'info', eng: "H - House", ar: "هـ - منزل", phonetic: "هاوس" },
        { type: 'multiple_choice', questionText: "أي حرف تبدأ به كلمة Apple؟", options: ["A", "C", "D"], correctAnswer: "A" }
      ]},
      { id: "alphabet_2", title: "الحروف (I - Q)", steps: [
        { type: 'info', eng: "I - Ice", ar: "آي - ثلج", phonetic: "آيس" },
        { type: 'info', eng: "J - Jam", ar: "ج - مربى", phonetic: "جام" },
        { type: 'info', eng: "K - Key", ar: "ك - مفتاح", phonetic: "كي" },
        { type: 'info', eng: "L - Lion", ar: "ل - أسد", phonetic: "لايون" },
        { type: 'info', eng: "M - Moon", ar: "م - قمر", phonetic: "مون" },
        { type: 'info', eng: "N - Night", ar: "ن - ليل", phonetic: "نايت" },
        { type: 'info', eng: "O - Owl", ar: "أو - بومة", phonetic: "أول" },
        { type: 'info', eng: "P - Pen", ar: "ب - قلم", phonetic: "بين" },
        { type: 'info', eng: "Q - Queen", ar: "ك - ملكة", phonetic: "كوين" }
      ]},
      { id: "alphabet_3", title: "الحروف (R - Z)", steps: [
        { type: 'info', eng: "R - Rain", ar: "ر - مطر", phonetic: "رين" },
        { type: 'info', eng: "S - Sun", ar: "س - شمس", phonetic: "صن" },
        { type: 'info', eng: "T - Tree", ar: "ت - شجرة", phonetic: "تري" },
        { type: 'info', eng: "U - Up", ar: "أ - فوق", phonetic: "أب" },
        { type: 'info', eng: "V - Van", ar: "ف - حافلة", phonetic: "فان" },
        { type: 'info', eng: "W - Wind", ar: "و - رياح", phonetic: "ويند" },
        { type: 'info', eng: "X - Box", ar: "كس - صندوق", phonetic: "بوكس" },
        { type: 'info', eng: "Y - Yo-yo", ar: "ي - يويو", phonetic: "يويو" },
        { type: 'info', eng: "Z - Zebra", ar: "ز - حمار وحشي", phonetic: "زيبرا" }
      ]},
      { id: "alphabet_full_test", title: "اختبار الحروف الشامل", steps: [
        { type: 'multiple_choice', questionText: "أي حرف هو 'S'؟", options: ["ص", "س", "ش"], correctAnswer: "س" },
        { type: 'writing', questionText: "اكتب الحرف الصغير لـ 'A'", correctAnswer: "a" },
        { type: 'multiple_choice', questionText: "ما هي كلمة 'Zebra'؟", options: ["أسد", "فيل", "حمار وحشي"], correctAnswer: "حمار وحشي" }
      ]}
    ]
  },
  {
    id: 2,
    title: "2. سحر الأرقام والعد (كامل)",
    description: "الأرقام من 1 إلى 100 مع أمثلة بالصور وتدريبات شاملة",
    color: "from-amber-400 to-orange-500",
    badge: "خبير الأرقام",
    level_type: 'beginner',
    category: 'kids',
    icon: <Zap className="w-8 h-8 text-white" />,
    lessons: [
      { id: "numbers_1_10", title: "الأرقام السحرية (1 - 10)", steps: [
        { type: 'info', eng: "1 - One Apple", ar: "1 - واحد - تفاحة واحدة", phonetic: "وان أبل" },
        { type: 'info', eng: "2 - Two Cats", ar: "2 - اثنان - قطتان", phonetic: "تو كاتس" },
        { type: 'info', eng: "3 - Three Dogs", ar: "3 - ثلاثة - 3 كلاب", phonetic: "ثري دوجز" },
        { type: 'info', eng: "4 - Four Cars", ar: "4 - أربعة - 4 سيارات", phonetic: "فور كارز" },
        { type: 'info', eng: "5 - Five Stars", ar: "5 - خمسة - 5 نجوم", phonetic: "فايف ستارز" },
        { type: 'info', eng: "6 - Six Birds", ar: "6 - ستة - 6 طيور", phonetic: "سكس بيردز" },
        { type: 'info', eng: "7 - Seven Balls", ar: "7 - سبعة - 7 كرات", phonetic: "سيفين بولز" },
        { type: 'multiple_choice', questionText: "كيف نقول 'ثلاثة كلاب' بالإنجليزية؟", options: ["Three Cats", "Three Dogs", "Five Dogs"], correctAnswer: "Three Dogs" },
        { type: 'multiple_choice', questionText: "ما هو رقم 'Seven'؟", options: ["6", "7", "8"], correctAnswer: "7" },
        { type: 'writing', questionText: "اكتب '5 نجوم' بالإنجليزية (Five Stars)", correctAnswer: "Five Stars" },
        { type: 'writing', questionText: "اكتب كلمة 'ستة' بالإنجليزية (Six)", correctAnswer: "Six" }
      ]},
      { id: "numbers_11_20", title: "سحر الأرقام (11 - 20)", steps: [
        { type: 'info', eng: "11 - Eleven Eggs", ar: "11 - إحدى عشرة بيضة", phonetic: "إليفن إيغز" },
        { type: 'info', eng: "12 - Twelve Cars", ar: "12 - اثنتا عشرة سيارة", phonetic: "تولف كارز" },
        { type: 'info', eng: "13 - Thirteen Cats", ar: "13 - ثلاثة عشر قطة", phonetic: "ثيرتين كاتس" },
        { type: 'info', eng: "15 - Fifteen Stars", ar: "15 - خمسة عشر نجمة", phonetic: "فيفتين ستارز" },
        { type: 'multiple_choice', questionText: "ما معنى 'Twelve'؟", options: ["11", "12", "20"], correctAnswer: "12" },
        { type: 'multiple_choice', questionText: "ما معنى 'Eleven'؟", options: ["11", "7", "1"], correctAnswer: "11" },
        { type: 'writing', questionText: "اكتب رقم 13 بالإنجليزية (Thirteen)", correctAnswer: "Thirteen" },
        { type: 'writing', questionText: "اكتب رقم 15 بالإنجليزية (Fifteen)", correctAnswer: "Fifteen" }
      ]},
      { id: "numbers_tens", title: "الأرقام الكبيرة (20 - 100)", steps: [
        { type: 'info', eng: "20 - Twenty", ar: "20 - عشرون", phonetic: "توينتي" },
        { type: 'info', eng: "30 - Thirty", ar: "30 - ثلاثون", phonetic: "ثيرتي" },
        { type: 'info', eng: "40 - Forty", ar: "40 - أربعون", phonetic: "فورتي" },
        { type: 'info', eng: "50 - Fifty", ar: "50 - خمسون", phonetic: "فيفتي" },
        { type: 'info', eng: "100 - One Hundred", ar: "100 - مائة", phonetic: "ون هاندرد" },
        { type: 'multiple_choice', questionText: "ما هو رقم 50؟", options: ["Fifteen", "Fifty", "Five"], correctAnswer: "Fifty" },
        { type: 'multiple_choice', questionText: "ما معنى 'Forty'؟", options: ["4", "14", "40"], correctAnswer: "40" },
        { type: 'writing', questionText: "اكتب رقم 100 بالإنجليزية (One Hundred)", correctAnswer: "One Hundred" },
        { type: 'writing', questionText: "اكتب رقم 20 بالإنجليزية (Twenty)", correctAnswer: "Twenty" }
      ]},
      { id: "numbers_counting_game", title: "تحدي العد بالصور (Counting Challenge)", steps: [
        { type: 'multiple_choice', questionText: "🍎🍎🍎 -> كم عدد التفاحات؟", options: ["Two", "Three", "Four"], correctAnswer: "Three" },
        { type: 'multiple_choice', questionText: "⭐ -> كم عدد النجوم؟", options: ["One", "Zero", "Ten"], correctAnswer: "One" },
        { type: 'multiple_choice', questionText: "🚗🚗 -> كم عدد السيارات؟", options: ["One", "Two", "Three"], correctAnswer: "Two" },
        { type: 'writing', questionText: "اكتب عدد هؤلاء: 🐱🐱🐱🐱 (بـ أرقام الكلمات)", correctAnswer: "Four" }
      ]},
      { id: "shapes_game", title: "لعبة الأشكال (Shapes Game)", steps: [
        { type: 'info', eng: "Circle", ar: "دائرة", phonetic: "سيركل" },
        { type: 'info', eng: "Square", ar: "مربع", phonetic: "سكوير" },
        { type: 'info', eng: "Triangle", ar: "مثلث", phonetic: "ترايانجل" },
        { type: 'info', eng: "Rectangle", ar: "مستطيل", phonetic: "ريكتانجل" },
        { type: 'multiple_choice', questionText: "ما معنى 'Circle'؟", options: ["دائرة", "مربع", "مثلث"], correctAnswer: "دائرة" },
        { type: 'multiple_choice', questionText: "أي شكل هو 'Square'؟", options: ["مربع", "مستطيل", "دائرة"], correctAnswer: "مربع" },
        { type: 'writing', questionText: "اكتب كلمة 'مثلث' بالإنجليزية", correctAnswer: "Triangle" }
      ]}
    ]
  },
  {
    id: 10,
    title: "3. تركيب الحروف والنطق (كامل)",
    description: "تعلّم دمج الحروف ونطقها بطريقة صحيحة مع تدريبات مكثفة",
    color: "from-purple-500 to-indigo-600",
    badge: "خبير المخارج",
    level_type: 'beginner',
    category: 'kids',
    icon: <Headphones className="w-8 h-8 text-white" />,
    lessons: [
      { id: "phonics_1", title: "الحروف المركبة الأساسية", steps: [
        { type: 'info', eng: "SH (Shoes/Fish)", ar: "ش - شوز / فيش", phonetic: "ش" },
        { type: 'info', eng: "CH (Chair/Watch)", ar: "تش - تشير / واتش", phonetic: "تش" },
        { type: 'info', eng: "TH (Thin/Thank)", ar: "ث - ثن / ثانك", phonetic: "ث" },
        { type: 'info', eng: "PH (Phone/Photo)", ar: "ف - فون / فوتو", phonetic: "ف" },
        { type: 'multiple_choice', questionText: "كيف ننطق 'SH'؟", options: ["ش", "تش", "ف"], correctAnswer: "ش" },
        { type: 'writing', questionText: "اكتب كلمة 'كُرسي' (Chair)", correctAnswer: "Chair" }
      ]},
      { id: "phonics_2", title: "أصوات الحروف المتحركة المزدوجة", steps: [
        { type: 'info', eng: "EE (Bee/See)", ar: "إي ممدودة - نحلة / يرى", phonetic: "بي / سي" },
        { type: 'info', eng: "OO (Moon/Food)", ar: "أو ممدودة - قمر / طعام", phonetic: "مون / فود" },
        { type: 'info', eng: "EA (Eat/Meat)", ar: "إي ممدودة - يأكل / لحم", phonetic: "إيت / ميت" },
        { type: 'multiple_choice', questionText: "كيف ننطق 'OO' في كلمة Moon؟", options: ["أو قصيرة", "أو ممدودة", "إي"], correctAnswer: "أو ممدودة" }
      ]}
    ]
  },
  {
    id: 11,
    title: "3. القواعد الأساسية للأطفال",
    description: "تعلّم بناء الجمل البسيطة، الضمائر، والجمع بطريقة سهلة",
    color: "from-emerald-500 to-teal-600",
    badge: "النحوي الصغير",
    level_type: 'beginner',
    category: 'kids',
    icon: <Book className="w-8 h-8 text-white" />,
    lessons: [
      { id: "grammar_pronouns", title: "الضمائر (Pronouns)", steps: [
        { type: 'info', eng: "I", ar: "أنا", phonetic: "آي" },
        { type: 'info', eng: "He", ar: "هو", phonetic: "هي" },
        { type: 'info', eng: "She", ar: "هي", phonetic: "شي" },
        { type: 'info', eng: "It", ar: "هو/هي لغير العاقل", phonetic: "إت" },
        { type: 'multiple_choice', questionText: "ما معنى 'She'؟", options: ["هو", "هي", "أنا"], correctAnswer: "هي" },
        { type: 'writing', questionText: "اكتب 'أنا' بالإنجليزية", correctAnswer: "I" }
      ]},
      { id: "grammar_plurals", title: "الجمع (Add -s)", steps: [
        { type: 'info', eng: "1 Cat -> 2 Cats", ar: "قطة واحدة -> قطتان", phonetic: "وان كات -> تو كاتس" },
        { type: 'info', eng: "1 Pen -> 5 Pens", ar: "قلم واحد -> 5 أقلام", phonetic: "وان بين -> فايف بينز" },
        { type: 'multiple_choice', questionText: "ما هو جمع 'Dog'؟", options: ["Dogs", "Doges", "Dogis"], correctAnswer: "Dogs" }
      ]}
    ]
  },
  {
    id: 6,
    title: "5. المطاعم والتسوق",
    description: "كيف تطلب طعامك وتتفاوض على الأسعار وتختار ما يناسبك",
    color: "from-rose-400 to-pink-600",
    badge: "المتسوق المحترف",
    level_type: 'intermediate',
    category: 'general',
    icon: <Type className="w-8 h-8 text-white" />,
    lessons: [
      { id: "restaurant_1", title: "الطلب في المطعم", steps: [
        { type: 'info', eng: "I would like to order", ar: "أود أن أطلب", phonetic: "آي وود لايك تو أوردر" },
        { type: 'info', eng: "The check, please", ar: "الحساب من فضلك", phonetic: "ذا تشيك بليز" }
      ]}
    ]
  },
  {
    id: 7,
    title: "6. الصحة والطوارئ",
    description: "عبارات حيوية للتعامل مع المواقف الصحية الصعبة والأطباء",
    color: "from-red-500 to-rose-700",
    badge: "المسعف اللغوي",
    level_type: 'intermediate',
    category: 'general',
    icon: <Zap className="w-8 h-8 text-white" />,
    lessons: [
      { id: "health_1", title: "عند الطبيب", steps: [
        { type: 'info', eng: "I feel sick", ar: "أشعر بالمرض", phonetic: "آي فيل سيك" },
        { type: 'writing', questionText: "كيف تقول 'أحتاج مساعدة'؟", correctAnswer: "I need help" }
      ] }
    ]
  },
  {
    id: 9,
    title: "7. المواقف والطلاقة (بنك العبارات)",
    description: "أكثر من 1000 جملة لجميع مواقف الحياة اليومية",
    color: "from-indigo-600 to-purple-800",
    badge: "المتحدث اللبق",
    level_type: 'intermediate',
    category: 'general',
    icon: <Headphones className="w-8 h-8 text-white" />,
    lessons: [
      { id: "phrases_intro", title: "مستودع الجمل اليومية", steps: [
        { type: 'info', eng: "استكشف الآن بنك الجمل العملاق لجميع المواقف.", ar: "اضغط للدخول إلى بنك المواقف" }
      ]}
    ]
  }
];
