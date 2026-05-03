export interface Phrase {
  eng: string;
  ar: string;
  phonetic: string;
}

export interface PhraseCategory {
  title: string;
  icon: string;
  phrases: Phrase[];
}

export const phraseBank: PhraseCategory[] = [
  {
    title: "التحيات والمجاملات",
    icon: "👋",
    phrases: [
      { eng: "Hello, how are you?", ar: "مرحباً، كيف حالك؟", phonetic: "هالو، هاو آر يو؟" },
      { eng: "I'm doing well, thank you.", ar: "أنا بخير، شكراً لك.", phonetic: "آي آم دوينغ ويل، ثانك يو" },
      { eng: "What is your name?", ar: "ما اسمك؟", phonetic: "وات إيز يور نيم؟" },
      { eng: "My name is Ahmed.", ar: "اسمي أحمد.", phonetic: "ماي نيم إيز أحمد" },
      { eng: "Nice to meet you.", ar: "سعدت بلقائك.", phonetic: "نايس تو ميت يو" },
      { eng: "Good morning.", ar: "صباح الخير.", phonetic: "جود مورنينغ" },
      { eng: "Good afternoon.", ar: "طاب مساؤك.", phonetic: "جود آفتر نون" },
      { eng: "Good night.", ar: "تصبح على خير.", phonetic: "جود نايت" },
      { eng: "How was your day?", ar: "كيف كان يومك؟", phonetic: "هاو واز يور داي؟" },
      { eng: "Have a nice day!", ar: "أتمنى لك يوماً سعيداً!", phonetic: "هاف أ نايس داي" }
    ]
  },
  {
    title: "في المطار والسفر",
    icon: "✈️",
    phrases: [
      { eng: "Where is the airport?", ar: "أين المطار؟", phonetic: "وير إيز ذا إيربورت؟" },
      { eng: "I'd like to check in.", ar: "أود تسجيل الوصول.", phonetic: "آيد لايك تو تشيك إن" },
      { eng: "Here is my passport.", ar: "تفضل جواز سفري.", phonetic: "هير إيز ماي باسبورت" },
      { eng: "Where is my boarding gate?", ar: "أين بوابة الصعود للطائرة؟", phonetic: "وير إيز ماي بوردينغ غيت؟" },
      { eng: "Is the flight delayed?", ar: "هل الرحلة متأخرة؟", phonetic: "إيز ذا فلايت ديلايد؟" },
      { eng: "I have two bags.", ar: "لدي حقيبتان.", phonetic: "آي هاف تو باغز" },
      { eng: "Which way to the exit?", ar: "أين الطريق للمخرج؟", phonetic: "وتش واي تو ذا إيكزيت؟" },
      { eng: "Do I need a visa?", ar: "هل أحتاج لتأشيرة؟", phonetic: "دو آي نيد أ فيزا؟" }
    ]
  },
  {
    title: "في المطعم والكافيه",
    icon: "🍴",
    phrases: [
      { eng: "A table for two, please.", ar: "طاولة لشخصين من فضلك.", phonetic: "أ تايبل فور تو بليز" },
      { eng: "Can I see the menu?", ar: "هل يمكنني رؤية القائمة؟", phonetic: "كان آي سي ذا مينيو؟" },
      { eng: "I'm ready to order.", ar: "أنا مستعد للطلب.", phonetic: "آي آم ريدي تو أوردر" },
      { eng: "I would like a coffee.", ar: "أود فنجان قهوة.", phonetic: "آي وود لايك أ كوفي" },
      { eng: "Water, please.", ar: "ماء من فضلك.", phonetic: "ووتر بليز" },
      { eng: "The check, please.", ar: "الحساب من فضلك.", phonetic: "ذا تشيك بليز" },
      { eng: "Is there any discount?", ar: "هل يوجد أي خصم؟", phonetic: "إيز ذير إيني ديسكونت؟" },
      { eng: "This is delicious!", ar: "هذا لذيذ!", phonetic: "ذِس إيز ديليشس" }
    ]
  },
  {
    title: "التسوق والأسعار",
    icon: "🛍️",
    phrases: [
      { eng: "How much is this?", ar: "كم سعر هذا؟", phonetic: "هاو ماتش إيز ذِس؟" },
      { eng: "Do you have a smaller size?", ar: "هل لديك مقاس أصغر؟", phonetic: "دو يو هاف أ سمولر سايز؟" },
      { eng: "I want to buy this.", ar: "أريد شراء هذا.", phonetic: "آي وونت تو باي ذِس" },
      { eng: "Where is the dressing room?", ar: "أين غرفة القياس؟", phonetic: "وير إيز ذا دريسينغ روم؟" },
      { eng: "Can I pay with credit card?", ar: "هل يمكنني الدفع بالبطاقة؟", phonetic: "كان آي باي ويذ كريديت كارد؟" },
      { eng: "It's too expensive.", ar: "إنه غالٍ جداً.", phonetic: "إت إيز تو إكسبنسيف" }
    ]
  },
  {
    title: "الصحة والطوارئ",
    icon: "🏥",
    phrases: [
      { eng: "I need help!", ar: "أحتاج للمساعدة!", phonetic: "آي نيد هيلب" },
      { eng: "Where is the hospital?", ar: "أين المستشفى؟", phonetic: "وير إيز ذا هوسبيتال" },
      { eng: "I feel sick.", ar: "أشعر بالمرض.", phonetic: "آي فيل سيك" },
      { eng: "Call the police!", ar: "اتصل بالشرطة!", phonetic: "كول ذا بوليس" },
      { eng: "I lost my phone.", ar: "لقد فقدت هاتفي.", phonetic: "آي لوست ماي فون" },
      { eng: "Are you okay?", ar: "هل أنت بخير؟", phonetic: "آر يو أوكي؟" }
    ]
  },
  {
    title: "السؤال عن الاتجاهات",
    icon: "🗺️",
    phrases: [
      { eng: "Excuse me, where is the station?", ar: "عذراً، أين المحطة؟", phonetic: "إكسكيوز مي، وير إيز ذا ستيشن؟" },
      { eng: "Turn left at the corner.", ar: "انعطف يساراً عند الزاوية.", phonetic: "تيرن ليفت آت ذا كورنر" },
      { eng: "Go straight for two blocks.", ar: "سر مستقيماً لمسافة مبنيين.", phonetic: "جو ستريت فور تو بلوكس" },
      { eng: "Is it far from here?", ar: "هل هو بعيد من هنا؟", phonetic: "إيز إت فار فروم هير؟" },
      { eng: "It is near the park.", ar: "إنه بالقرب من الحديقة.", phonetic: "إت إيز نير ذا بارك" }
    ]
  },
  {
    title: "في العمل والمكتب",
    icon: "💼",
    phrases: [
      { eng: "I have a meeting at ten.", ar: "لدي اجتماع في الساعة العاشرة.", phonetic: "آي هاف أ ميتينغ آت تين" },
      { eng: "Where is my desk?", ar: "أين مكتبي؟", phonetic: "وير إيز ماي ديسك؟" },
      { eng: "Can you send me the file?", ar: "هل يمكنك إرسال الملف لي؟", phonetic: "كان يو سيند مي ذا فايل؟" },
      { eng: "I am out of the office today.", ar: "أنا خارج المكتب اليوم.", phonetic: "آي آم آوت أوف ذا أوفيس توداي" },
      { eng: "Let's discuss this tomorrow.", ar: "لنناقش هذا غداً.", phonetic: "لتس ديسكاس ذِس تومورو" },
      { eng: "I need to print this document.", ar: "أحتاج لطباعة هذا المستند.", phonetic: "آي نيد تو برينت ذِس دوكيومنت" }
    ]
  },
  {
    title: "في الفندق والإقامة",
    icon: "🏨",
    phrases: [
      { eng: "I have a reservation.", ar: "لدي حجز.", phonetic: "آي هاف أ ريزيرفيشن" },
      { eng: "What time is breakfast?", ar: "ما هو موعد الإفطار؟", phonetic: "وات تايم إيز بريكفاست؟" },
      { eng: "Is there free Wi-Fi?", ar: "هل يوجد واي فاي مجاني؟", phonetic: "إيز ذير فري واي فاي؟" },
      { eng: "I need more towels, please.", ar: "أحتاج للمزيد من المناشف من فضلك.", phonetic: "آي نيد مور تاولز بليز" },
      { eng: "Can I have a wake-up call?", ar: "هل يمكنني الحصول على مكالمة إيقاظ؟", phonetic: "كان آي هاف أ ويك أب كول؟" },
      { eng: "I'd like to check out.", ar: "أود تسجيل المغادرة.", phonetic: "آيد لايك تو تشيك آوت" }
    ]
  },
  {
    title: "البنك والمال",
    icon: "💰",
    phrases: [
      { eng: "Where is the nearest ATM?", ar: "أين أقرب صراف آلي؟", phonetic: "وير إيز ذا نيرست إي تي إم؟" },
      { eng: "I want to exchange some money.", ar: "أريد تصريف بعض المال.", phonetic: "آي وونت تو إكسشينج سام ماني" },
      { eng: "What is the exchange rate?", ar: "ما هو سعر الصرف؟", phonetic: "وات إيز ذا إكسشينج ريت؟" },
      { eng: "My card is stuck in the machine.", ar: "بطاقتي عالقة في الآلة.", phonetic: "ماي كارد إيز ستاك إن ذا ماشين" },
      { eng: "I'd like to open an account.", ar: "أود فتح حساب.", phonetic: "آيد لايك تو أوبن آن أكاونت" }
    ]
  },
  {
    title: "الطقس والفصول",
    icon: "🌤️",
    phrases: [
      { eng: "It's very hot today.", ar: "الجو حار جداً اليوم.", phonetic: "إت إيز فيري هوت توداي" },
      { eng: "It looks like it will rain.", ar: "يبدو أنها ستمطر.", phonetic: "إت لوكس لايك إت ويل رين" },
      { eng: "The weather is beautiful.", ar: "الطقس جميل.", phonetic: "ذا ويذر إيز بيوتيفول" },
      { eng: "It's freezing outside.", ar: "الجو متجمد في الخارج.", phonetic: "إت إيز فريزينغ آوت سايد" },
      { eng: "What is the temperature?", ar: "ما هي درجة الحرارة؟", phonetic: "وات إيز ذا تيمبريتشر؟" }
    ]
  },
  {
    title: "الوقت والأيام والأشهر",
    icon: "📅",
    phrases: [
      { eng: "What time is it?", ar: "كم الساعة؟", phonetic: "وات تايم إيز إت؟" },
      { eng: "Today is Monday.", ar: "اليوم هو الاثنين.", phonetic: "توداي إيز ماندي" },
      { eng: "Tomorrow is Tuesday.", ar: "غداً هو الثلاثاء.", phonetic: "تومورو إيز تيوزدي" },
      { eng: "I'll see you on Friday.", ar: "سأراك يوم الجمعة.", phonetic: "آيل سي يو أون فرايداي" },
      { eng: "The month is May.", ar: "الشهر هو مايو.", phonetic: "ذا مانث إيز ماي" },
      { eng: "In the morning.", ar: "في الصباح.", phonetic: "إن ذا مورنينغ" },
      { eng: "At noon.", ar: "في الظهر.", phonetic: "آت نون" },
      { eng: "In the evening.", ar: "في المساء.", phonetic: "إن ذا إيفنينغ" }
    ]
  },
  {
    title: "التكنولوجيا والإنترنت",
    icon: "💻",
    phrases: [
      { eng: "What is your Wi-Fi password?", ar: "ما هي كلمة سر الواي فاي؟", phonetic: "وات إيز يور واي فاي باسوورد؟" },
      { eng: "The internet is slow.", ar: "الإنترنت بطيء.", phonetic: "ذا إنترنت إيز سلو" },
      { eng: "I need to charge my phone.", ar: "أحتاج لشحن هاتفي.", phonetic: "آي نيد تو تشارج ماي فون" },
      { eng: "Can you send the link?", ar: "هل يمكنك إرسال الرابط؟", phonetic: "كان يو سيند ذا لينك؟" },
      { eng: "I am checking my email.", ar: "أنا أتفقد بريدي الإلكتروني.", phonetic: "آي آم تشيكينغ ماي إيميل" }
    ]
  },
  {
    title: "الأسرة والعلاقات",
    icon: "👨‍👩‍👧",
    phrases: [
      { eng: "This is my brother.", ar: "هذا أخي.", phonetic: "ذِس إيز ماي براذر" },
      { eng: "I have two sisters.", ar: "لدي أختان.", phonetic: "آي هاف تو سيسترز" },
      { eng: "Are you married?", ar: "هل أنت متزوج؟", phonetic: "آر يو ماريد؟" },
      { eng: "I have a big family.", ar: "لدي عائلة كبيرة.", phonetic: "آي هاف أ بيغ فاميلي" },
      { eng: "He is my best friend.", ar: "هو صديقي المفضل.", phonetic: "هي إيز ماي بيست فريند" }
    ]
  },
  {
    title: "وسائل النقل",
    icon: "🚌",
    phrases: [
      { eng: "I'll take the bus.", ar: "سآخذ الحافلة.", phonetic: "آيل تيك ذا باس" },
      { eng: "Where is the train station?", ar: "أين محطة القطار؟", phonetic: "وير إيز ذا ترين ستيشن؟" },
      { eng: "How much is the fare?", ar: "كم تبلغ الأجرة؟", phonetic: "هاو ماتش إيز ذا فير؟" },
      { eng: "Stop here, please.", ar: "توقف هنا من فضلك.", phonetic: "ستوب هير بليز" },
      { eng: "The taxi is coming.", ar: "التاكسي قادم.", phonetic: "ذا تاكسي إيز كامينغ" }
    ]
  },
  {
    title: "الدراسة والتعليم",
    icon: "🎓",
    phrases: [
      { eng: "I am a student.", ar: "أنا طالب.", phonetic: "آي آم أ ستودنت" },
      { eng: "I have an exam today.", ar: "لدي امتحان اليوم.", phonetic: "آي هاف آن إكزام توداي" },
      { eng: "Can you explain this?", ar: "هل يمكنك شرح هذا؟", phonetic: "كان يو إكسبلين ذِس؟" },
      { eng: "I study English.", ar: "أنا أدرس الإنجليزية.", phonetic: "آي ستادي إنغليش" },
      { eng: "Where is the library?", ar: "أين المكتبة؟", phonetic: "وير إيز ذا لايبراري؟" }
    ]
  },
  {
    title: "الهوايات والرياضة",
    icon: "⚽",
    phrases: [
      { eng: "I like playing football.", ar: "أحب لعب كرة القدم.", phonetic: "آي لايك بليينغ فوتبول" },
      { eng: "What is your hobby?", ar: "ما هي هوايتك؟", phonetic: "وات إيز يور هوبي؟" },
      { eng: "I enjoy reading books.", ar: "أستمتع بقراءة الكتب.", phonetic: "آي إنجوي ريدينغ بوكس" },
      { eng: "Do you play any sports?", ar: "هل تمارس أي رياضة؟", phonetic: "دو يو بلي إيني سبورتس؟" },
      { eng: "I go to the gym every day.", ar: "أذهب للنادي الرياضي كل يوم.", phonetic: "آي جو تو ذا جيم إيفري داي" }
    ]
  },
  {
    title: "في صالون الحلاقة",
    icon: "✂️",
    phrases: [
      { eng: "I'd like a haircut, please.", ar: "أود قص شعري من فضلك.", phonetic: "آيد لايك أ هيركات بليز" },
      { eng: "Don't cut it too short.", ar: "لا تقصه قصيراً جداً.", phonetic: "دونت كات إت تو شورت" },
      { eng: "Trim my beard, please.", ar: "هذب لحيتي من فضلك.", phonetic: "تريم ماي بيرد بليز" },
      { eng: "I want a new hairstyle.", ar: "أريد تسريحة شعر جديدة.", phonetic: "آي وونت أ نيو هيرستايل" },
      { eng: "How much do I owe you?", ar: "كم الحساب؟", phonetic: "هاو ماتش دو آي أو يو؟" }
    ]
  },
  {
    title: "الملابس والموضة",
    icon: "👕",
    phrases: [
      { eng: "What are you wearing?", ar: "ماذا ترتدي؟", phonetic: "وات آر يو ويرنيغ؟" },
      { eng: "I like your shirt.", ar: "أعجبني قميصك.", phonetic: "آي لايك يور شيرت" },
      { eng: "This dress is beautiful.", ar: "هذا الفستان جميل.", phonetic: "ذِس دريس إيز بيوتيفول" },
      { eng: "Put on your shoes.", ar: "ارتدِ حذائك.", phonetic: "بوت أون يور شوز" },
      { eng: "It fits you perfectly.", ar: "إنه يناسبك تماماً.", phonetic: "إت فيتس يو بيرفكتلي" }
    ]
  },
  {
    title: "المنزل والأثاث",
    icon: "🏠",
    phrases: [
      { eng: "Welcome to my home.", ar: "مرحباً بك في منزلي.", phonetic: "ويلكام تو ماي هوم" },
      { eng: "The kitchen is very big.", ar: "المطبخ كبير جداً.", phonetic: "ذا كيتشن إيز فيري بيغ" },
      { eng: "Sit on the sofa.", ar: "اجلس على الأريكة.", phonetic: "سيت أون ذا سوفا" },
      { eng: "Turn off the lights.", ar: "أطفئ الأنوار.", phonetic: "تيرن أوف ذا لايتس" },
      { eng: "I need a new bed.", ar: "أحتاج لسرير جديد.", phonetic: "آي نيد أ نيو بيد" }
    ]
  },
  {
    title: "الترفيه والسينما",
    icon: "🎬",
    phrases: [
      { eng: "Let's watch a movie.", ar: "لنشاهد فيلماً.", phonetic: "لتس واتش أ موفي" },
      { eng: "Who is your favorite actor?", ar: "من هو ممثلك المفضل؟", phonetic: "هو إيز يور فيفوريت أكتر؟" },
      { eng: "The movie was exciting.", ar: "الفيلم كان مشوقاً.", phonetic: "ذا موفي واز إكسايتينغ" },
      { eng: "I want to buy popcorn.", ar: "أريد شراء فشار.", phonetic: "آي وونت تو باي بوبكورن" },
      { eng: "Is this seat taken?", ar: "هل هذا المقعد محجوز؟", phonetic: "إيز ذِس سيت تيكن؟" }
    ]
  },
  {
    title: "الطبيعة والحيوانات",
    icon: "🌳",
    phrases: [
      { eng: "Look at the mountains.", ar: "انظر إلى الجبال.", phonetic: "لوك آت ذا ماونتنزي" },
      { eng: "I love animals.", ar: "أنا أحب الحيوانات.", phonetic: "آي لاف أنيمالز" },
      { eng: "The flowers are blooming.", ar: "الأزهار تتفتح.", phonetic: "ذا فلاورز آر بلومينغ" },
      { eng: "Is there a park nearby?", ar: "هل يوجد حديقة قريبة؟", phonetic: "إيز ذير أ بارك نيرباي؟" },
      { eng: "The sea is calm today.", ar: "البحر هادئ اليوم.", phonetic: "ذا سي إيز كام توداي" }
    ]
  },
  {
    title: "أجزاء الجسم",
    icon: "💪",
    phrases: [
      { eng: "Close your eyes.", ar: "أغمض عينيك.", phonetic: "كلوز يور آيز" },
      { eng: "My head hurts.", ar: "رأسي يؤلمني.", phonetic: "ماي هيد هيرتس" },
      { eng: "Wash your hands.", ar: "اغسل يديك.", phonetic: "واش يور هاندز" },
      { eng: "Open your mouth.", ar: "افتح فمك.", phonetic: "أوبن يور ماوث" },
      { eng: "He has long hair.", ar: "لديه شعر طويل.", phonetic: "هي هاز لونغ هير" }
    ]
  },
  {
    title: "السوبر ماركت",
    icon: "🛒",
    phrases: [
      { eng: "I need to buy eggs.", ar: "أحتاج لشراء بيض.", phonetic: "آي نيد تو باي إيغز" },
      { eng: "Where is the milk section?", ar: "أين قسم الحليب؟", phonetic: "وير إيز ذا ميلك سيكشن؟" },
      { eng: "Is this fresh?", ar: "هل هذا طازج؟", phonetic: "إيز ذِس فريش؟" },
      { eng: "I want a shopping cart.", ar: "أريد عربة تسوق.", phonetic: "آي وونت أ شوبينغ كارت" },
      { eng: "Can I have a plastic bag?", ar: "هل يمكنني الحصول على كيس بلاستيك؟", phonetic: "كان آي هاف أ بلاستيك باغ؟" }
    ]
  },
  {
    title: "عبارات تشجيعية",
    icon: "✨",
    phrases: [
      { eng: "You can do it!", ar: "يمكنك فعل ذلك!", phonetic: "يو كان دو إت" },
      { eng: "Don't give up.", ar: "لا تستسلم.", phonetic: "دونت غيف آب" },
      { eng: "Keep going.", ar: "استمر في التقدم.", phonetic: "كيب غوينغ" },
      { eng: "I am proud of you.", ar: "أنا فخور بك.", phonetic: "آي آم براود أوف يو" },
      { eng: "Good luck!", ar: "حظاً موفقاً!", phonetic: "جود لاك" }
    ]
  },
  {
    title: "أدوات المطبخ",
    icon: "🍳",
    phrases: [
      { eng: "Where is the spoon?", ar: "أين الملعقة؟", phonetic: "وير إيز ذا سبون؟" },
      { eng: "I need a sharp knife.", ar: "أحتاج لسكين حاد.", phonetic: "آي نيد أ شارب نايف" },
      { eng: "The pot is hot.", ar: "القِدْر ساخن.", phonetic: "ذا بوت إيز هوت" },
      { eng: "Wash the dishes.", ar: "اغسل الأطباق.", phonetic: "واش ذا ديشيز" },
      { eng: "Put it in the fridge.", ar: "ضعه في الثلاجة.", phonetic: "بوت إت إن ذا فريدج" }
    ]
  },
  {
    title: "في الصيدلية",
    icon: "💊",
    phrases: [
      { eng: "I need some painkillers.", ar: "أحتاج لبعض المسكنات.", phonetic: "آي نيد سام بين كيلرز" },
      { eng: "Do you have cough syrup?", ar: "هل لديك شراب للسعال؟", phonetic: "دو يو هاف كوف سيرب؟" },
      { eng: "How often should I take this?", ar: "كم مرة يجب أن آخذ هذا؟", phonetic: "هاو أوفن شود آي تيك ذِس؟" },
      { eng: "I have a prescription.", ar: "لدي وصفة طبية.", phonetic: "آي هاف أ بريسكريبشن" },
      { eng: "Is there any side effect?", ar: "هل هناك أي أعراض جانبية؟", phonetic: "إيز ذير إيني سايد إيفكت؟" }
    ]
  },
  {
    title: "الأجهزة الإلكترونية",
    icon: "📱",
    phrases: [
      { eng: "My laptop is broken.", ar: "محمولي معطل.", phonetic: "ماي لابتوب إيز بروكن" },
      { eng: "Turn up the volume.", ar: "ارفع مستوى الصوت.", phonetic: "تيرن آب ذا فوليوم" },
      { eng: "The screen is cracked.", ar: "الشاشة مكسورة.", phonetic: "ذا سكرين إيز كراكت" },
      { eng: "Connect to the Bluetooth.", ar: "اتصل بالبلوتوث.", phonetic: "كونيكت تو ذا بلوتوث" },
      { eng: "Battery is low.", ar: "البطارية منخفضة.", phonetic: "باتري إيز لو" }
    ]
  },
  {
    title: "في السيارة",
    icon: "🚗",
    phrases: [
      { eng: "Fasten your seatbelt.", ar: "اربط حزام الأمان.", phonetic: "فاسن يور سيتبيلت" },
      { eng: "Fill it up with petrol.", ar: "املأها بالبنزين.", phonetic: "فيل إت آب ويذ بيترول" },
      { eng: "The engine won't start.", ar: "المحرك لا يعمل.", phonetic: "ذا إنجن وونت ستارت" },
      { eng: "Park the car here.", ar: "اركن السيارة هنا.", phonetic: "بارك ذا كار هير" },
      { eng: "Slow down, please.", ar: "هدئ السرعة من فضلك.", phonetic: "سلو داون بليز" }
    ]
  },
  {
    title: "الأنشطة اليومية",
    icon: "🛀",
    phrases: [
      { eng: "I wake up early.", ar: "أستيقظ مبكراً.", phonetic: "آي ويك آب إيرلي" },
      { eng: "I take a shower.", ar: "أستحم.", phonetic: "آي تيك أ شاور" },
      { eng: "I brush my teeth.", ar: "أنظف أسناني.", phonetic: "آي براش ماي تيث" },
      { eng: "I get dressed.", ar: "أرتدي ملابسي.", phonetic: "آي غيت درست" },
      { eng: "I go to sleep at ten.", ar: "أذهب للنوم في العاشرة.", phonetic: "آي جو تو سليب آت تين" }
    ]
  },
  {
    title: "مقارنة الأشياء",
    icon: "⚖️",
    phrases: [
      { eng: "This is better than that.", ar: "هذا أفضل من ذلك.", phonetic: "ذِس إيز بيتر ذان ذات" },
      { eng: "It's bigger than I thought.", ar: "إنه أكبر مما ظننت.", phonetic: "إت إيز بيغر ذان آي ثوت" },
      { eng: "She is taller than him.", ar: "هي أطول منه.", phonetic: "شي إيز تولر ذان هيم" },
      { eng: "The red one is cheaper.", ar: "الأحمر أرخص.", phonetic: "ذا ريد وان إيز تشيبر" },
      { eng: "This is the best choice.", ar: "هذا هو الخيار الأفضل.", phonetic: "ذِس إيز ذا بيست تشويس" }
    ]
  },
  {
    title: "الحفلات والمناسبات",
    icon: "🎉",
    phrases: [
      { eng: "Happy Birthday!", ar: "عيد ميلاد سعيد!", phonetic: "هابي بيرثداي" },
      { eng: "Congratulations on your success.", ar: "مبارك نجاحك.", phonetic: "كونغراتيوليشنز أون يور ساكسيس" },
      { eng: "Would you like to come?", ar: "هل تود المجيء؟", phonetic: "وود يو لايك تو كام؟" },
      { eng: "Thank you for the invitation.", ar: "شكراً على الدعوة.", phonetic: "ثانك يو فور ذا إنفيتيشن" },
      { eng: "Let's celebrate!", ar: "لنحتفل!", phonetic: "لتس سيليبريت" }
    ]
  },
  {
    title: "الاعتذار والشكر",
    icon: "🙏",
    phrases: [
      { eng: "I'm so sorry.", ar: "أنا آسف جداً.", phonetic: "آيم سو سوري" },
      { eng: "It was my mistake.", ar: "كان خطئي.", phonetic: "إت واز ماي مستيك" },
      { eng: "No problem at all.", ar: "لا مشكلة على الإطلاق.", phonetic: "نو بروبلم آت أول" },
      { eng: "I really appreciate it.", ar: "أقدر ذلك حقاً.", phonetic: "آي ريلي أبريشييت إت" },
      { eng: "You're very kind.", ar: "أنت لطيف جداً.", phonetic: "يور فيري كايند" }
    ]
  },
  {
    title: "الوظائف والمهن",
    icon: "👨‍🏫",
    phrases: [
      { eng: "What do you do for a living?", ar: "ماذا تعمل لكسب عيشك؟", phonetic: "وات دو يو دو فور أ ليفينغ؟" },
      { eng: "He is an engineer.", ar: "هو مهندس.", phonetic: "هي إيز آن إنجنير" },
      { eng: "I am looking for a job.", ar: "أبحث عن عمل.", phonetic: "آي آم لوكينغ فور أ جوب" },
      { eng: "She works in a bank.", ar: "هي تعمل في بنك.", phonetic: "شي ويركس إن أ بانك" },
      { eng: "My dream is to be a pilot.", ar: "حلمي أن أكون طياراً.", phonetic: "ماي دريم إيز تو بي أ بايلوت" }
    ]
  },
  {
    title: "الفواكه والخضروات",
    icon: "🍎",
    phrases: [
      { eng: "I want an apple.", ar: "أريد تفاحة.", phonetic: "آي وونت آن آبل" },
      { eng: "Bananas are yellow.", ar: "الموز أصفر.", phonetic: "باناناز آر يلو" },
      { eng: "Eat your vegetables.", ar: "تول خضرواتك.", phonetic: "إيت يور فيجيتيبلز" },
      { eng: "These oranges are sweet.", ar: "هذا البرتقال حلو.", phonetic: "ذيس أورانجيز آر سويت" },
      { eng: "I need some tomatoes.", ar: "أحتاج لبعض الطماطم.", phonetic: "آي نيد سام توماتوز" }
    ]
  },
  {
    title: "الألوان والأشكال",
    icon: "🎨",
    phrases: [
      { eng: "The sky is blue.", ar: "السماء زرقاء.", phonetic: "ذا سكاي إيز بلو" },
      { eng: "What is your favorite color?", ar: "ما هو لونك المفضل؟", phonetic: "وات إيز يور فيفوريت كالر؟" },
      { eng: "This is a red circle.", ar: "هذه دائرة حمراء.", phonetic: "ذِس إيز أ ريد سيركل" },
      { eng: "Draw a square.", ar: "ارسم مربعاً.", phonetic: "دروا أ سكوير" },
      { eng: "The grass is green.", ar: "العشب أخضر.", phonetic: "ذا غراس إيز غرين" }
    ]
  },
  {
    title: "في مكتب البريد",
    icon: "📮",
    phrases: [
      { eng: "I want to send a letter.", ar: "أريد إرسال رسالة.", phonetic: "آي وونت تو سيند أ ليتر" },
      { eng: "Where is the post office?", ar: "أين مكتب البريد؟", phonetic: "وير إيز ذا بوست أوفيس؟" },
      { eng: "I need a stamp, please.", ar: "أحتاج لطابع من فضلك.", phonetic: "آي نيد أ ستامب بليز" },
      { eng: "How much is the postage?", ar: "كم تبلغ تكلفة البريد؟", phonetic: "هاو ماتش إيز ذا بوستيدج؟" },
      { eng: "When will it arrive?", ar: "متى ستصل؟", phonetic: "وين ويل إت آرايف؟" }
    ]
  },
  {
    title: "السفر بالبحر",
    icon: "🚢",
    phrases: [
      { eng: "The ship is very large.", ar: "السفينة كبيرة جداً.", phonetic: "ذا شيب إيز فيري لارج" },
      { eng: "I feel seasick.", ar: "أشعر بدوار البحر.", phonetic: "آي فيل سي سيك" },
      { eng: "Where is the deck?", ar: "أين سطح السفينة؟", phonetic: "وير إيز ذا ديك؟" },
      { eng: "The boat is sailing.", ar: "القارب يبحر.", phonetic: "ذا بوت إيز سيلينغ" },
      { eng: "Look at the waves.", ar: "انظر إلى الأمواج.", phonetic: "لوك آت ذا ويفز" }
    ]
  },
  {
    title: "الحيوانات الأليفة",
    icon: "🐱",
    phrases: [
      { eng: "I have a cat.", ar: "لدي قطة.", phonetic: "آي هاف أ كات" },
      { eng: "Do you have a dog?", ar: "هل لديك كلب؟", phonetic: "دو يو هاف أ دوغ؟" },
      { eng: "My pet is very playful.", ar: "حيواني الأليف يحب اللعب جداً.", phonetic: "ماي بيت إيز فيري بلايفول" },
      { eng: "Feed the fish.", ar: "أطعم السمك.", phonetic: "فيد ذا فيش" },
      { eng: "Take the dog for a walk.", ar: "خذ الكلب في نزهة.", phonetic: "تيك ذا دوغ فور أ ووك" }
    ]
  },
  {
    title: "في حديقة الحيوان",
    icon: "🦁",
    phrases: [
      { eng: "The lion is the king.", ar: "الأسد هو الملك.", phonetic: "ذا لايون إيز ذا كينغ" },
      { eng: "Look at the elephant.", ar: "انظر إلى الفيل.", phonetic: "لوك آت ذا إليفانت" },
      { eng: "The giraffes are tall.", ar: "الزرافات طويلة.", phonetic: "ذا جيرافس آر تول" },
      { eng: "Don't feed the monkeys.", ar: "لا تطعم القردة.", phonetic: "دونت فيد ذا مونكيز" },
      { eng: "Where are the zebras?", ar: "أين الحمر الوحشية؟", phonetic: "وير آر ذا زيبرز؟" }
    ]
  },
  {
    title: "عبارات الشكوى",
    icon: "😠",
    phrases: [
      { eng: "This is not what I ordered.", ar: "ليس هذا ما طلبته.", phonetic: "ذِس إيز نوت وات آي أوردرد" },
      { eng: "I want to speak to the manager.", ar: "أريد التحدث مع المدير.", phonetic: "آي وونت تو سبيك تو ذا مانجر" },
      { eng: "It's too loud in here.", ar: "الضجيج عالٍ جداً هنا.", phonetic: "إيتس تو لاود إن هير" },
      { eng: "I am not satisfied.", ar: "أنا لست راضياً.", phonetic: "آي آم نوت ساتيسفايد" },
      { eng: "Fix this immediately.", ar: "أصلح هذا فوراً.", phonetic: "فيكس ذِس إيميديتلي" }
    ]
  },
  {
    title: "الاتفاق والاختلاف",
    icon: "🤝",
    phrases: [
      { eng: "I agree with you.", ar: "أنا أتفق معك.", phonetic: "آي أغري ويذ يو" },
      { eng: "I don't think so.", ar: "لا أظن ذلك.", phonetic: "آي دونت ثينك سو" },
      { eng: "Exactly!", ar: "بالضبط!", phonetic: "إكزاكتلي" },
      { eng: "You are right.", ar: "أنت على حق.", phonetic: "يو آر رايت" },
      { eng: "I disagree.", ar: "أنا لا أتفق.", phonetic: "آي ديسأغري" }
    ]
  },
  {
    title: "المقابلة الشخصية",
    icon: "👔",
    phrases: [
      { eng: "Tell me about yourself.", ar: "حدثني عن نفسك.", phonetic: "تيل مي أباوت يورسيلف" },
      { eng: "What are your strengths?", ar: "ما هي نقاط قوتك؟", phonetic: "وات آر يور سترينغثس؟" },
      { eng: "I have five years of experience.", ar: "لدي خمس سنوات من الخبرة.", phonetic: "آي هاف فايف ييرز أوف إكسبرينس" },
      { eng: "Why should we hire you?", ar: "لماذا يجب أن نوظفك؟", phonetic: "واي شود وي هاير يو؟" },
      { eng: "I am a hard worker.", ar: "أنا عامل مجد.", phonetic: "آي آم أ هارد ويركر" }
    ]
  },
  {
    title: "مكالمات هاتفية",
    icon: "📞",
    phrases: [
      { eng: "Who is speaking?", ar: "من المتحدث؟", phonetic: "هو إيز سبيكينغ؟" },
      { eng: "I can't hear you clearly.", ar: "لا أستطيع سماعك بوضوح.", phonetic: "آي كانت هير يو كليرلي" },
      { eng: "Hold on a second, please.", ar: "انتظر لحظة من فضلك.", phonetic: "هولد أون أ سيكند بليز" },
      { eng: "I'll call you back later.", ar: "سأعاود الاتصال بك لاحقاً.", phonetic: "آيل كول يو باك ليتر" },
      { eng: "You have the wrong number.", ar: "طلبتم الرقم الخطأ.", phonetic: "يو هاف ذا رونغ نمبر" }
    ]
  },
  {
    title: "التعبير عن الرأي",
    icon: "💭",
    phrases: [
      { eng: "In my opinion...", ar: "في رأيي...", phonetic: "إن ماي أوبنيون" },
      { eng: "I believe that...", ar: "أعتقد أن...", phonetic: "آي بليف ذات" },
      { eng: "What do you think?", ar: "ماذا تعتقد؟", phonetic: "وات دو يو ثينك؟" },
      { eng: "I have no doubt.", ar: "ليس لدي أدنى شك.", phonetic: "آي هاف نو داوت" },
      { eng: "That's a good point.", ar: "هذه نقطة جيدة.", phonetic: "ذاتس أ جود بوينت" }
    ]
  },
  {
    title: "في محطة الوقود",
    icon: "⛽",
    phrases: [
      { eng: "Check the oil, please.", ar: "افحص الزيت من فضلك.", phonetic: "تشيك ذا أويل بليز" },
      { eng: "Check the tire pressure.", ar: "افحص ضغط الإطارات.", phonetic: "تشيك ذا تاير بريشر" },
      { eng: "Clean the windshield.", ar: "نظف الزجاج الأمامي.", phonetic: "كلين ذا ويندشيلد" },
      { eng: "I need some air for my tires.", ar: "أحتاج لبعض الهواء لإطاراتي.", phonetic: "آي نيد سام إير فور ماي تايرز" },
      { eng: "Where is the car wash?", ar: "أين مغسلة السيارات؟", phonetic: "وير إيز ذا كار واش؟" }
    ]
  },
  {
    title: "في الخياط",
    icon: "🪡",
    phrases: [
      { eng: "Can you shorten these pants?", ar: "هل يمكنك تقصير هذا البنطال؟", phonetic: "كان يو شورتن ذيس بانتس؟" },
      { eng: "I'd like to take it in.", ar: "أود تضييقه.", phonetic: "آيد لايك تو تيك إت إن" },
      { eng: "The sleeves are too long.", ar: "الأكمام طويلة جداً.", phonetic: "ذا سليفز آر تو لونغ" },
      { eng: "Can you sew this button?", ar: "هل يمكنك خياطة هذا الزر؟", phonetic: "كان يو سو ذِس باتن؟" },
      { eng: "When will it be ready?", ar: "متى سيكون جاهزاً؟", phonetic: "وين ويل إت بي ريدي؟" }
    ]
  },
  {
    title: "في الحديقة العامة",
    icon: "🌳",
    phrases: [
      { eng: "The grass is very green.", ar: "العشب أخضر جداً.", phonetic: "ذا غراس إيز فيري غرين" },
      { eng: "Don't walk on the grass.", ar: "لا تمشِ على العشب.", phonetic: "دونت ووك أون ذا غراس" },
      { eng: "Where is the playground?", ar: "أين الملعب؟", phonetic: "وير إيز ذا بلاي غرواند؟" },
      { eng: "Let's sit on the bench.", ar: "لنجلس على المقعد.", phonetic: "لتس سيت أون ذا بينش" },
      { eng: "The flowers smell nice.", ar: "رائحة الأزهار جميلة.", phonetic: "ذا فلاورز سميل نايس" }
    ]
  },
  {
    title: "التسوق الإلكتروني",
    icon: "📦",
    phrases: [
      { eng: "Add to cart.", ar: "أضف إلى السلة.", phonetic: "آد تو كارت" },
      { eng: "I want to track my order.", ar: "أريد تتبع طلبي.", phonetic: "آي وونت تو تراك ماي أوردر" },
      { eng: "The delivery is late.", ar: "التوصيل متأخر.", phonetic: "ذا دليفري إيز ليت" },
      { eng: "Confirm the payment.", ar: "تأكيد الدفع.", phonetic: "كونفيرم ذا بيمينت" },
      { eng: "I want a refund.", ar: "أريد استرداد المال.", phonetic: "آي وونت أ ريفاند" }
    ]
  },
  {
    title: "المصطلحات العلمية",
    icon: "🧪",
    phrases: [
      { eng: "The experiment was successful.", ar: "التجربة كانت ناجحة.", phonetic: "ذا إكسبيريمنت واز ساكسيسفول" },
      { eng: "Gravity pulls things down.", ar: "الجاذبية تسحب الأشياء للأسفل.", phonetic: "غرافيتي بولز ثينغز داون" },
      { eng: "The water is boiling.", ar: "الماء يغلي.", phonetic: "ذا ووتر إيز بويلينغ" },
      { eng: "Planets orbit the sun.", ar: "الكواكب تدور حول الشمس.", phonetic: "بلانتس أوربيت ذا صن" },
      { eng: "Observe the results.", ar: "لاحظ النتائج.", phonetic: "أوبزيرف ذا ريزالتس" }
    ]
  },
  {
    title: "عبارات الندم",
    icon: "😔",
    phrases: [
      { eng: "I wish I knew.", ar: "أتمنى لو كنت أعلم.", phonetic: "آي ويش آي نيو" },
      { eng: "If only I was there.", ar: "لو كنت هناك فقط.", phonetic: "إف أونلي آي واز ذير" },
      { eng: "I shouldn't have done that.", ar: "لم يكن يجب علي فعل ذلك.", phonetic: "آي شودنت هاف دان ذات" },
      { eng: "It's too late now.", ar: "لقد فات الأوان الآن.", phonetic: "إت إيز تو ليت ناو" },
      { eng: "I regret my decision.", ar: "أنا نادم على قراري.", phonetic: "آي ريغريت ماي ديسيجين" }
    ]
  },
  {
    title: "المسكن والمقاولات",
    icon: "🏗️",
    phrases: [
      { eng: "The house is under construction.", ar: "المنزل قيد الإنشاء.", phonetic: "ذا هاوس إيز أندر كونستركشن" },
      { eng: "I want to rent an apartment.", ar: "أريد استئجار شقة.", phonetic: "آي وونت تو رينت آن أبارتمنت" },
      { eng: "How much is the rent?", ar: "كم يبلغ الإيجار؟", phonetic: "هاو ماتش إيز ذا رينت؟" },
      { eng: "The elevator is out of order.", ar: "المصعد معطل.", phonetic: "ذا إليفيتور إيز آوت أوف أوردر" },
      { eng: "I need a plumber.", ar: "أحتاج لسباك.", phonetic: "آي نيد أ بلامر" }
    ]
  },
  {
    title: "في الفضاء والنجوم",
    icon: "🚀",
    phrases: [
      { eng: "The moon is full tonight.", ar: "القمر بدر الليلة.", phonetic: "ذا مون إيز فول تونايت" },
      { eng: "Stars are shining.", ar: "النجوم تلمع.", phonetic: "ستارز آر شاينينغ" },
      { eng: "Is there life on Mars?", ar: "هل هناك حياة على المريخ؟", phonetic: "إيز ذير لايف أون مارز؟" },
      { eng: "The galaxy is vast.", ar: "المجرة شاسعة.", phonetic: "ذا غالاكسي إيز فاست" },
      { eng: "I want to see the planets.", ar: "أريد رؤية الكواكب.", phonetic: "آي وونت تو سي ذا بلانتس" }
    ]
  },
  {
    title: "المواد المدرسية",
    icon: "📚",
    phrases: [
      { eng: "Mathematics is difficult.", ar: "الرياضيات صعبة.", phonetic: "ماثيماتيكس إيز ديفيكولت" },
      { eng: "History is my favorite subject.", ar: "التاريخ مادتي المفضلة.", phonetic: "هيستوري إيز ماي فيفوريت سابجيكت" },
      { eng: "We have a science lab.", ar: "لدينا مختبر علوم.", phonetic: "وي هاف أ ساينس لاب" },
      { eng: "Geography is interesting.", ar: "الجغرافيا ممتعة.", phonetic: "جيوغرافي إيز إنتريستينغ" },
      { eng: "Who is the teacher?", ar: "من هو المعلم؟", phonetic: "هو إيز ذا تيتشر؟" }
    ]
  },
  {
    title: "الأدوات المكتبية",
    icon: "🖊️",
    phrases: [
      { eng: "I need a pencil.", ar: "أحتاج لقلم رصاص.", phonetic: "آي نيد أ بنسل" },
      { eng: "Bring me the stapler.", ar: "أحضر لي الدباسة.", phonetic: "برينغ مي ذا ستيبلر" },
      { eng: "The paper is white.", ar: "الورقة بيضاء.", phonetic: "ذا بيبر إيز وايت" },
      { eng: "I lost my eraser.", ar: "فقدت ممحاتي.", phonetic: "آي لوست ماي إيريزر" },
      { eng: "Where is the notebook?", ar: "أين المفكرة؟", phonetic: "وير إيز ذا نوتبوك؟" }
    ]
  },
  {
    title: "على الشاطئ",
    icon: "🏖️",
    phrases: [
      { eng: "The sand is warm.", ar: "الرمل دافئ.", phonetic: "ذا ساند إيز وارم" },
      { eng: "Let's swim in the sea.", ar: "لنسبح في البحر.", phonetic: "لتس سويم إن ذا سي" },
      { eng: "I need sunblock.", ar: "أحتاج لواقي شمس.", phonetic: "آي نيد صن بلوك" },
      { eng: "Whale watching is fun.", ar: "مشاهدة الحيتان ممتعة.", phonetic: "ويل واتشينغ إيز فان" },
      { eng: "The waves are high.", ar: "الأمواج عالية.", phonetic: "ذا ويفز آر هاي" }
    ]
  },
  {
    title: "المذاق والنكهات",
    icon: "😋",
    phrases: [
      { eng: "This is spicy.", ar: "هذا حار (بهارات).", phonetic: "ذِس إيز سبايسي" },
      { eng: "It's too salty.", ar: "إنه مالح جداً.", phonetic: "إت إيز تو سالتي" },
      { eng: "The cake is sweet.", ar: "الكعكة حلوة.", phonetic: "ذا كيك إيز سويت" },
      { eng: "This lemon is sour.", ar: "هذا الليمون حامض.", phonetic: "ذِس ليمون إيز ساور" },
      { eng: "It tastes bitter.", ar: "طعمه مر.", phonetic: "إت تيستس بيتر" }
    ]
  },
  {
    title: "الطيور والحشرات",
    icon: "🦜",
    phrases: [
      { eng: "The eagle is flying.", ar: "النسر يطير.", phonetic: "ذا إيغل إيز فلايينغ" },
      { eng: "The butterfly is colorful.", ar: "الفراشة ملونة.", phonetic: "ذا باترفلاي إيز كالرفول" },
      { eng: "Bees make honey.", ar: "النحل يصنع العسل.", phonetic: "بيز ميك هاني" },
      { eng: "The bird is singing.", ar: "الطائر يغرد.", phonetic: "ذا بيرد إيز سينغينغ" },
      { eng: "Watch out for the spider.", ar: "احذر من العنكبوت.", phonetic: "واتش آوت فور ذا سبايدر" }
    ]
  },
  {
    title: "وصف الطقس المتقدم",
    icon: "🌪️",
    phrases: [
      { eng: "It's very foggy.", ar: "الجو ضبابي جداً.", phonetic: "إت إيز فيري فوغي" },
      { eng: "The wind is blowing hard.", ar: "الرياح تهب بقوة.", phonetic: "ذا ويند إيز بلويينغ هارد" },
      { eng: "There is a thunderstorm.", ar: "هناك عاصفة رعدية.", phonetic: "ذير إيز أ ثاندرستورم" },
      { eng: "The sky is overcast.", ar: "السماء غائمة كلياً.", phonetic: "ذا سكاي إيز أوفركاست" },
      { eng: "It's humid today.", ar: "الجو رطب اليوم.", phonetic: "إت إيز هيوميد توداي" }
    ]
  },
  {
    title: "الأرقام من 1 إلى 20",
    icon: "🔢",
    phrases: [
      { eng: "One, two, three", ar: "واحد، اثنان، ثلاثة", phonetic: "وان، تو، ثري" },
      { eng: "I have five apples.", ar: "لدي خمس تفاحات.", phonetic: "آي هاف فايف آبلز" },
      { eng: "Ten plus ten is twenty.", ar: "عشرة زائد عشرة يساوي عشرين.", phonetic: "تين بلس تين إيز توينتي" },
      { eng: "What is your phone number?", ar: "ما هو رقم هاتفك؟", phonetic: "وات إيز يور فون نمبر؟" },
      { eng: "Count to ten.", ar: "عد إلى عشرة.", phonetic: "كاونت تو تين" }
    ]
  },
  {
    title: "في المدرسة والفصل",
    icon: "🏫",
    phrases: [
      { eng: "May I go to the bathroom?", ar: "هل يمكنني الذهاب للحمام؟", phonetic: "مي آي جو تو ذا باثروم؟" },
      { eng: "Open your books to page ten.", ar: "افتحوا كتبكم على صفحة عشرة.", phonetic: "أوبن يور بوكس تو بيج تين" },
      { eng: "I forgot my homework.", ar: "نسيت واجبي المنزلي.", phonetic: "آي فورغوت ماي هومورك" },
      { eng: "Can you repeat that, please?", ar: "هل يمكنك تكرار ذلك من فضلك؟", phonetic: "كان يو ريبيت ذات بليز؟" },
      { eng: "Write it down.", ar: "اكتب ذلك.", phonetic: "رايت إت داون" }
    ]
  },
  {
    title: "هوايات الأطفال",
    icon: "🪁",
    phrases: [
      { eng: "I like drawing.", ar: "أحب الرسم.", phonetic: "آي لايك درووينغ" },
      { eng: "Let's play hide and seek.", ar: "لنلعب الغميضة.", phonetic: "لتس بلي هايد آند سيك" },
      { eng: "I want to watch a cartoon.", ar: "أريد مشاهدة أفلام كرتون.", phonetic: "آي وونت تو واتش أ كارتون" },
      { eng: "Can I play with you?", ar: "هل يمكنني اللعب معك؟", phonetic: "كان آي بلي ويذ يو؟" },
      { eng: "This is my favorite toy.", ar: "هذه لعبتي المفضلة.", phonetic: "ذِس إيز ماي فيفوريت توي" }
    ]
  }
];
