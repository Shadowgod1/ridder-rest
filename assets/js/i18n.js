// Ridder Tourism — i18n translation system
const TRANSLATIONS = {
  ru: {
    'brand': 'Риддер',
    'nav.home': 'Главная',
    'nav.sights': 'Достопримечательности',
    'nav.bases': 'Базы отдыха',
    'nav.gallery': 'Галерея',
    'nav.contact': 'Контакты',

    'hero.title': 'Риддер —<br>сокровищница природы',
    'hero.subtitle': 'Откройте для себя удивительный мир гор, тайги и чистых рек Восточного Казахстана',
    'hero.btn.sights': 'Достопримечательности',
    'hero.btn.bases': 'Базы отдыха',
    'hero.btn.contact': 'Связаться',

    'about.title': 'О Риддере',
    'about.text': 'Риддер (Лениногорск) — город в Восточно-Казахстанской области, расположенный у подножия Ивановского хребта Алтайских гор. Это настоящий рай для любителей природы, активного отдыха и экотуризма.',
    'about.nature': 'Нетронутая природа',
    'about.nature.text': 'Горные леса, реки и водопады',
    'about.eco': 'Экотуризм',
    'about.eco.text': 'Пешие маршруты, рыбалка, сплавы',
    'about.family': 'Семейный отдых',
    'about.family.text': 'Уютные базы для всей семьи',

    'sights.title': 'Достопримечательности',
    'sights.subtitle': 'Откройте культурное и природное наследие Риддера',
    'sights.btn.all': 'Все достопримечательности →',
    'sights.page.hero': 'Достопримечательности Риддера',
    'sights.page.sub': 'Культура, история и природа',

    'sights.museum.title': 'Историко-краеведческий музей',
    'sights.museum.desc': 'Риддерский историко-краеведческий музей хранит богатую историю города с момента основания. Здесь представлены экспонаты о горнодобывающей промышленности, природе края и культуре народов.',
    'sights.church.title': 'Никольский храм',
    'sights.church.desc': 'Православный храм святителя Николая Чудотворца — духовный центр Риддера. Красивое архитектурное сооружение, памятник истории и культуры города.',
    'sights.flame.title': 'Вечный огонь',
    'sights.flame.desc': 'Мемориал Вечного огня — дань уважения героям Великой Отечественной войны. Место памяти и скорби, где жители чтят подвиг своих предков.',
    'sights.park.title': 'Парк Жамбыла Жабаева',
    'sights.park.desc': 'Центральный парк отдыха Риддера, названный в честь великого казахского поэта. Прекрасное место для прогулок, семейного отдыха и культурных мероприятий.',
    'sights.zhastar.title': 'Парк Жастар',
    'sights.zhastar.desc': 'Молодёжный парк "Жастар" — любимое место отдыха жителей всех возрастов. Зелёные аллеи, детские площадки и уютные скамейки.',
    'sights.republic.title': 'Площадь Республики',
    'sights.republic.desc': 'Главная площадь города, место проведения городских праздников, культурных событий и торжественных мероприятий.',
    'sights.alley.title': 'Аллея ветеранов',
    'sights.alley.desc': 'Живописная аллея, посвящённая ветеранам Великой Отечественной войны. Место прогулок и памятных мероприятий.',
    'sights.gromotuha.title': 'Река Громотуха',
    'sights.gromotuha.desc': 'Живописная горная река, протекающая через Риддер. Популярное место для рыбалки, пикников и отдыха на природе. Кристально чистая вода привлекает туристов.',

    'bases.title': 'Базы отдыха',
    'bases.subtitle': 'Выберите идеальное место для вашего отдыха',
    'bases.btn.all': 'Все базы →',
    'bases.btn.book': 'Забронировать',
    'bases.btn.details': 'Подробнее',
    'bases.page.hero': 'Базы отдыха Риддера',
    'bases.page.sub': 'Комфорт среди дикой природы',
    'bases.filter.all': 'Все базы',
    'bases.filter.budget': 'До 50 000 тг',
    'bases.filter.mid': '50 000–100 000 тг',
    'bases.filter.luxury': 'Свыше 100 000 тг',
    'bases.price.from': 'от',
    'bases.price.per': 'тг/сутки',
    'bases.price.request': 'По запросу',
    'bases.services': 'Услуги',
    'bases.website': 'Сайт базы',

    'bases.bearlog.title': 'BearLog',
    'bases.bearlog.desc': 'Премиальная база отдыха с коттеджами класса люкс, бассейном, SPA-комплексом и широким выбором активностей: от езды на багги до зимних снегоходных туров.',
    'bases.bearlog.services': 'Коттеджи • Бассейн • Багги • Снегоходы • SPA • Баня • Ресторан',
    'bases.taiga.title': 'Риддер Тайга Шале',
    'bases.taiga.desc': 'Уютные шале в сердце тайги. Идеальное место для любителей зимнего отдыха, рыбалки и единения с природой. Частная территория в горном лесу.',
    'bases.taiga.services': 'Шале • Баня • Снегоходы • Рыбалка • Беседки',
    'bases.kedrova.title': 'Кедровка',
    'bases.kedrova.desc': 'Семейная база отдыха в окружении кедрового леса. Уютные домики на 6 мест, домашняя кухня и прекрасная природа Алтая. Доступные цены для семей.',
    'bases.kedrova.services': 'Домики • Питание • Беседки • Мангал • Парковка',
    'bases.igloo.title': 'Igloo Lodges',
    'bases.igloo.desc': 'Уникальные A-frame домики в стиле скандинавского дизайна. Панорамные виды на горы, баня, фурако и незабываемая атмосфера единения с природой.',
    'bases.igloo.services': 'A-frame домики • Баня • Фурако • Панорамный вид',

    'gallery.title': 'Галерея',
    'gallery.subtitle': 'Красоты Риддера в фотографиях',

    'map.title': 'На карте',
    'map.subtitle': 'Найдите нас в Риддере, ВКО, Казахстан',

    'contact.title': 'Контакты',
    'contact.subtitle': 'Свяжитесь с нами для бронирования или вопросов',
    'contact.name': 'Ваше имя',
    'contact.email': 'Email',
    'contact.phone': 'Телефон',
    'contact.message': 'Сообщение',
    'contact.send': 'Отправить сообщение',
    'contact.whatsapp': 'WhatsApp',
    'contact.telegram': 'Telegram',
    'contact.address': 'Адрес',
    'contact.quick': 'Быстрая связь',
    'contact.success': '✅ Сообщение отправлено! Мы свяжемся с вами.',

    'footer.rights': '© 2025 Риддер — Сокровищница природы. Все права защищены.',
    'footer.city': 'Риддер, ВКО, Казахстан',
    'footer.nav': 'Навигация',
    'footer.connect': 'Связаться',

    'common.read_more': 'Подробнее',
    'common.close': 'Закрыть',
    'common.book_whatsapp': 'Забронировать в WhatsApp',
    'common.all_services': 'Все услуги',
    'common.price': 'Цена',
  },

  kz: {
    'brand': 'Риддер',
    'nav.home': 'Басты бет',
    'nav.sights': 'Тарихи орындар',
    'nav.bases': 'Демалыс базалары',
    'nav.gallery': 'Галерея',
    'nav.contact': 'Байланыс',

    'hero.title': 'Риддер —<br>табиғаттың қазынасы',
    'hero.subtitle': 'Шығыс Қазақстанның таулары, тайгасы және таза өзендерінің таңғажайып әлемін ашыңыз',
    'hero.btn.sights': 'Тарихи орындар',
    'hero.btn.bases': 'Демалыс базалары',
    'hero.btn.contact': 'Байланысу',

    'about.title': 'Риддер туралы',
    'about.text': 'Риддер (Лениногорск) — Алтай таулары жоталарының етегінде орналасқан Шығыс Қазақстан облысының қаласы. Бұл табиғатты сүйетіндер мен белсенді демалыс және экотуризм үшін нағыз жұмақ.',
    'about.nature': 'Бұзылмаған табиғат',
    'about.nature.text': 'Таулы ормандар, өзендер мен сарқырамалар',
    'about.eco': 'Экотуризм',
    'about.eco.text': 'Жаяу жорықтар, балық аулау, рафтинг',
    'about.family': 'Отбасылық демалыс',
    'about.family.text': 'Барлық отбасына арналған жайлы базалар',

    'sights.title': 'Тарихи орындар',
    'sights.subtitle': 'Риддердің мәдени және табиғи мұрасын ашыңыз',
    'sights.btn.all': 'Барлық орындар →',
    'sights.page.hero': 'Риддердің тарихи орындары',
    'sights.page.sub': 'Мәдениет, тарих және табиғат',

    'sights.museum.title': 'Тарихи-өлкетану мұражайы',
    'sights.museum.desc': 'Риддер тарихи-өлкетану мұражайы қаланың бай тарихын сақтайды. Мұнда тау-кен өнеркәсібі, өлкенің табиғаты және халықтар мәдениеті туралы экспонаттар ұсынылған.',
    'sights.church.title': 'Никола шіркеуі',
    'sights.church.desc': 'Риддердің рухани орталығы — Николай Чудотворец атындағы православиелік шіркеу. Қаланың тарих және мәдениет ескерткіші болып табылатын сәулет ғимараты.',
    'sights.flame.title': 'Мәңгілік от',
    'sights.flame.desc': 'Мәңгілік от мемориалы — Ұлы Отан соғысы батырларына деген құрмет. Тұрғындар аталарының ерлігін мойындайтын ескерту орны.',
    'sights.park.title': 'Жамбыл Жабаев паркі',
    'sights.park.desc': 'Ұлы қазақ ақыны Жамбылдың атымен аталған орталық демалыс паркі. Серуендеу, отбасылық демалыс және мәдени іс-шаралар үшін тамаша орын.',
    'sights.zhastar.title': 'Жастар паркі',
    'sights.zhastar.desc': '"Жастар" паркі — барлық жастағы тұрғындардың сүйікті демалыс орны. Жасыл аллеялар, балалар алаңдары мен жайлы орындықтар.',
    'sights.republic.title': 'Республика алаңы',
    'sights.republic.desc': 'Қаланың басты алаңы, қалалық мерекелер, мәдени іс-шаралар мен салтанатты жиындар өтетін орын.',
    'sights.alley.title': 'Ардагерлер аллеясы',
    'sights.alley.desc': 'Ұлы Отан соғысы ардагерлеріне арналған көркем аллея. Серуендеу мен еске алу іс-шараларының орны.',
    'sights.gromotuha.title': 'Громотуха өзені',
    'sights.gromotuha.desc': 'Риддер арқылы ағатын сурет тәрізді таулы өзен. Балық аулауға, пикникке және табиғатта демалуға танымал орын. Мөп-мөлдір таза су туристерді тартады.',

    'bases.title': 'Демалыс базалары',
    'bases.subtitle': 'Демалысыңыз үшін тамаша орынды таңдаңыз',
    'bases.btn.all': 'Барлық базалар →',
    'bases.btn.book': 'Брондау',
    'bases.btn.details': 'Толығырақ',
    'bases.page.hero': 'Риддердің демалыс базалары',
    'bases.page.sub': 'Жабайы табиғатта жайлылық',
    'bases.filter.all': 'Барлық базалар',
    'bases.filter.budget': '50 000 тг дейін',
    'bases.filter.mid': '50 000–100 000 тг',
    'bases.filter.luxury': '100 000 тг жоғары',
    'bases.price.from': 'бастап',
    'bases.price.per': 'тг/тәулік',
    'bases.price.request': 'Сұрау бойынша',
    'bases.services': 'Қызметтер',
    'bases.website': 'База сайты',

    'bases.bearlog.title': 'BearLog',
    'bases.bearlog.desc': 'Люкс коттедждері, бассейні, SPA-кешені бар премиум демалыс базасы. Баггиден снегоход турларына дейін кең таңдау белсенділіктер.',
    'bases.bearlog.services': 'Коттедждер • Бассейн • Багги • Снегоходтар • SPA • Монша • Мейрамхана',
    'bases.taiga.title': 'Риддер Тайга Шале',
    'bases.taiga.desc': 'Тайганың жүрегіндегі жайлы шалелер. Қысқы демалысты, балық аулауды және табиғатпен бірігуді жақсы көретіндерге тамаша орын.',
    'bases.taiga.services': 'Шалелер • Монша • Снегоходтар • Балық аулау • Беседкалар',
    'bases.kedrova.title': 'Кедровка',
    'bases.kedrova.desc': 'Қарағай орманындағы отбасылық демалыс базасы. 6 орынға арналған жайлы үйлер, үй тамағы және Алтайдың керемет табиғаты.',
    'bases.kedrova.services': 'Үйлер • Тамақтану • Беседкалар • Мангал • Тұрақ',
    'bases.igloo.title': 'Igloo Lodges',
    'bases.igloo.desc': 'Скандинав дизайнындағы бірегей A-frame үйлері. Таулардың панорамалық көріністері, монша, фурако және ұмытылмас атмосфера.',
    'bases.igloo.services': 'A-frame үйлер • Монша • Фурако • Панорамалық көрініс',

    'gallery.title': 'Галерея',
    'gallery.subtitle': 'Риддердің сұлулығы фотосуреттерде',

    'map.title': 'Картада',
    'map.subtitle': 'Бізді Риддерден, ШҚО, Қазақстаннан табыңыз',

    'contact.title': 'Байланыс',
    'contact.subtitle': 'Брондау немесе сұрақтар үшін бізбен байланысыңыз',
    'contact.name': 'Есіміңіз',
    'contact.email': 'Электрондық пошта',
    'contact.phone': 'Телефон',
    'contact.message': 'Хабарлама',
    'contact.send': 'Хабарлама жіберу',
    'contact.whatsapp': 'WhatsApp',
    'contact.telegram': 'Telegram',
    'contact.address': 'Мекенжай',
    'contact.quick': 'Жылдам байланыс',
    'contact.success': '✅ Хабарлама жіберілді! Жақын арада хабарласамыз.',

    'footer.rights': '© 2025 Риддер — Табиғаттың қазынасы. Барлық құқықтар қорғалған.',
    'footer.city': 'Риддер, ШҚО, Қазақстан',
    'footer.nav': 'Навигация',
    'footer.connect': 'Байланысу',

    'common.read_more': 'Толығырақ',
    'common.close': 'Жабу',
    'common.book_whatsapp': 'WhatsApp арқылы брондау',
    'common.all_services': 'Барлық қызметтер',
    'common.price': 'Баға',
  }
};

let currentLang = localStorage.getItem('ridder-lang') || 'ru';

function t(key) {
  return TRANSLATIONS[currentLang][key] || TRANSLATIONS['ru'][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ridder-lang', lang);
  applyTranslations();
  updateLangButtons();
  document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru';
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val.replace(/<[^>]+>/g, '');
    } else {
      el.innerHTML = val;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key).replace(/<[^>]+>/g, '');
  });
}

function updateLangButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle('bg-white', isActive);
    btn.classList.toggle('text-green-900', isActive);
    btn.classList.toggle('font-bold', isActive);
    btn.classList.toggle('text-white', !isActive);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  updateLangButtons();
});
