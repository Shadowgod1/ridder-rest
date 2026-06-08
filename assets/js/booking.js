// Ridder Tourism — Booking system (demo)
// Многошаговое бронирование: даты и места → оплата картой → подтверждение.
// Это демонстрационный модуль: реальная оплата не производится,
// данные карты никуда не отправляются и нигде не сохраняются.

(function () {
  'use strict';

  const BK_PHONE = '77082097658'; // WhatsApp для подтверждения брони
  const PREPAY_RATE = 0.3;        // предоплата 30%

  // ── Язык ──────────────────────────────────────────────────────────────
  function lang() {
    return (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'ru';
  }
  function L(ru, kz) { return lang() === 'kz' ? kz : ru; }

  // ── Данные баз и домиков ──────────────────────────────────────────────
  const BASES = {
    bearlog: {
      name: 'BearLog',
      img: 'assets/img/base-bearlog.jpg',
      cabins: [
        { id: 'c2',  name: { ru: 'Коттедж (2 чел.)', kz: 'Коттедж (2 адам)' }, cap: 2, price: 80000,  total: 5 },
        { id: 'c4',  name: { ru: 'Коттедж (4 чел.)', kz: 'Коттедж (4 адам)' }, cap: 4, price: 120000, total: 4 },
        { id: 'spa', name: { ru: 'SPA + коттедж',    kz: 'SPA + коттедж' },    cap: 4, price: 150000, total: 2 },
      ],
    },
    taiga: {
      name: 'Риддер Тайга Шале',
      img: 'assets/img/base-taiga.jpg',
      cabins: [
        { id: 'sh',  name: { ru: 'Шале (2–4 чел.)',     kz: 'Шале (2–4 адам)' },     cap: 4, price: 60000,  total: 6 },
        { id: 'vip', name: { ru: 'VIP шале + баня',      kz: 'VIP шале + монша' },    cap: 6, price: 130000, total: 3 },
      ],
    },
    kedrova: {
      name: 'Кедровка',
      img: 'assets/img/base-kedrova.jpg',
      cabins: [
        { id: 'd6', name: { ru: 'Домик на 6 мест', kz: '6 орынды үй' }, cap: 6, price: 32000, total: 8 },
      ],
    },
    igloo: {
      name: 'Igloo Lodges',
      img: 'assets/img/igloo-aframe.jpg',
      cabins: [
        { id: 'af',  name: { ru: 'A-frame домик (2 чел.)', kz: 'A-frame үй (2 адам)' }, cap: 2, price: 70000,  total: 4 },
        { id: 'afp', name: { ru: 'A-frame + фурако',       kz: 'A-frame + фурако' },    cap: 2, price: 95000,  total: 2 },
      ],
    },
  };

  // ── Состояние ─────────────────────────────────────────────────────────
  const state = {
    baseId: null, cabinId: null,
    checkin: '', checkout: '', guests: 2,
    name: '', phone: '',
    nights: 0, total: 0, prepay: 0, bookingNo: '',
  };

  // ── Утилиты ───────────────────────────────────────────────────────────
  function fmt(n) { return n.toLocaleString('ru-RU').replace(/,/g, ' '); }

  function fmtDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
  function todayStr() {
    return fmtDate(new Date());
  }
  function addDays(str, days) {
    const d = new Date(str + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return fmtDate(d);
  }
  function nightsBetween(a, b) {
    const d1 = new Date(a + 'T00:00:00'), d2 = new Date(b + 'T00:00:00');
    return Math.round((d2 - d1) / 86400000);
  }
  function prettyDate(str) {
    if (!str) return '';
    const d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString(lang() === 'kz' ? 'kk-KZ' : 'ru-RU', { day: 'numeric', month: 'short' });
  }

  // Псевдослучайное (но стабильное) число свободных мест для базы/домика/даты
  function hash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
    return Math.abs(h);
  }
  function freeSpots(baseId, cabin, dateStr) {
    if (!dateStr) return cabin.total;
    const h = hash(baseId + cabin.id + dateStr);
    return (h % cabin.total) + 1; // 1..total — всегда есть хотя бы одно место
  }

  // ── Разметка модального окна (инжектится один раз) ────────────────────
  function ensureModal() {
    if (document.getElementById('bk-modal')) return;
    const el = document.createElement('div');
    el.id = 'bk-modal';
    el.className = 'fixed inset-0 z-[110] bg-black/75 hidden items-center justify-center p-4 overflow-y-auto';
    el.addEventListener('click', e => { if (e.target === el) bkClose(); });
    el.innerHTML =
      '<div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-8 relative">' +
        '<button id="bk-x" class="absolute top-3 right-3 w-9 h-9 bg-black/10 hover:bg-black/20 text-gray-700 rounded-full flex items-center justify-center text-xl z-10">&times;</button>' +
        '<div id="bk-body"></div>' +
      '</div>';
    document.body.appendChild(el);
    document.getElementById('bk-x').addEventListener('click', bkClose);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !el.classList.contains('hidden')) bkClose();
    });
  }

  function show() {
    const m = document.getElementById('bk-modal');
    m.classList.remove('hidden'); m.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
  function bkClose() {
    const m = document.getElementById('bk-modal');
    if (!m) return;
    m.classList.add('hidden'); m.classList.remove('flex');
    document.body.style.overflow = '';
  }

  // ── Шапка с прогрессом ────────────────────────────────────────────────
  function stepper(active) {
    const steps = [
      L('Детали', 'Мәліметтер'),
      L('Оплата', 'Төлем'),
      L('Готово', 'Дайын'),
    ];
    return '<div class="flex items-center justify-center gap-2 mb-5 text-xs font-medium">' +
      steps.map((s, i) => {
        const on = i <= active;
        const circle = '<span class="w-6 h-6 rounded-full flex items-center justify-center ' +
          (on ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500') + '">' + (i + 1) + '</span>';
        const label = '<span class="' + (i === active ? 'text-green-800' : 'text-gray-400') + '">' + s + '</span>';
        const sep = i < steps.length - 1 ? '<span class="w-6 h-px bg-gray-300"></span>' : '';
        return '<span class="flex items-center gap-1.5">' + circle + label + '</span>' + sep;
      }).join('') +
      '</div>';
  }

  // ── Шаг 1: даты, домик, гости ─────────────────────────────────────────
  function renderStep1() {
    const base = BASES[state.baseId];
    if (!state.checkin) { state.checkin = todayStr(); }
    if (!state.checkout) { state.checkout = addDays(state.checkin, 2); }

    const cabinsHtml = base.cabins.map(c => {
      const free = freeSpots(state.baseId, c, state.checkin);
      const checked = state.cabinId === c.id ? 'checked' : '';
      const lowClass = free <= 2 ? 'text-amber-600' : 'text-green-700';
      return '<label class="bk-cabin flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors ' +
          (state.cabinId === c.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300') + '">' +
        '<input type="radio" name="bk-cabin" value="' + c.id + '" ' + checked + ' class="accent-green-700">' +
        '<span class="flex-1">' +
          '<span class="block font-semibold text-gray-800">' + c.name[lang()] + '</span>' +
          '<span class="block text-xs text-gray-500">👥 ' + L('до', 'дейін') + ' ' + c.cap + ' · ' +
            '<span class="' + lowClass + ' font-medium">' + L('свободно', 'бос') + ': ' + free + ' ' +
            L('из', '/') + ' ' + c.total + '</span></span>' +
        '</span>' +
        '<span class="text-green-800 font-bold whitespace-nowrap">' + fmt(c.price) + ' ₸' +
          '<span class="block text-[10px] text-gray-400 font-normal text-right">' + L('/сутки', '/тәулік') + '</span></span>' +
      '</label>';
    }).join('');

    const baseOptions = Object.keys(BASES).map(id =>
      '<option value="' + id + '" ' + (id === state.baseId ? 'selected' : '') + '>' + BASES[id].name + '</option>'
    ).join('');

    document.getElementById('bk-body').innerHTML =
      '<div class="relative h-32 rounded-t-2xl overflow-hidden">' +
        '<img src="' + base.img + '" alt="' + base.name + '" class="w-full h-full object-cover">' +
        '<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>' +
        '<h2 class="absolute bottom-3 left-5 text-white font-playfair text-2xl font-bold drop-shadow">' +
          L('Бронирование', 'Брондау') + '</h2>' +
      '</div>' +
      '<div class="p-6">' +
        stepper(0) +
        '<label class="block text-sm font-medium text-gray-700 mb-1">' + L('База отдыха', 'Демалыс базасы') + '</label>' +
        '<select id="bk-base" class="w-full mb-4 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 outline-none bg-white">' +
          baseOptions + '</select>' +
        '<label class="block text-sm font-medium text-gray-700 mb-1">' + L('Тип домика', 'Үй түрі') + '</label>' +
        '<div class="space-y-2 mb-4">' + cabinsHtml + '</div>' +
        '<div class="grid grid-cols-2 gap-3 mb-4">' +
          '<div><label class="block text-sm font-medium text-gray-700 mb-1">' + L('Заезд', 'Кіру') + '</label>' +
            '<input type="date" id="bk-in" value="' + state.checkin + '" min="' + todayStr() + '" class="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 outline-none"></div>' +
          '<div><label class="block text-sm font-medium text-gray-700 mb-1">' + L('Выезд', 'Шығу') + '</label>' +
            '<input type="date" id="bk-out" value="' + state.checkout + '" min="' + addDays(todayStr(), 1) + '" class="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 outline-none"></div>' +
        '</div>' +
        '<div class="grid grid-cols-2 gap-3 mb-4">' +
          '<div><label class="block text-sm font-medium text-gray-700 mb-1">' + L('Гостей', 'Қонақтар') + '</label>' +
            '<input type="number" id="bk-guests" value="' + state.guests + '" min="1" max="12" class="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 outline-none"></div>' +
          '<div><label class="block text-sm font-medium text-gray-700 mb-1">' + L('Ваше имя', 'Есіміңіз') + '</label>' +
            '<input type="text" id="bk-name" value="' + state.name + '" placeholder="' + L('Имя', 'Аты') + '" class="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 outline-none"></div>' +
        '</div>' +
        '<label class="block text-sm font-medium text-gray-700 mb-1">' + L('Телефон', 'Телефон') + '</label>' +
        '<input type="tel" id="bk-phone" value="' + state.phone + '" placeholder="+7 (___) ___-__-__" class="w-full mb-2 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 outline-none">' +
        '<p id="bk-err" class="text-red-600 text-sm mb-3 hidden"></p>' +
        '<div id="bk-summary" class="bg-green-50 rounded-xl p-3 text-sm text-gray-700 mb-4"></div>' +
        '<button id="bk-next" class="w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all">' +
          L('Перейти к оплате', 'Төлемге өту') + '</button>' +
        '<p class="text-[11px] text-gray-400 text-center mt-3">' +
          L('Демо-бронирование. Реальная оплата не производится.', 'Демо-брондау. Нақты төлем алынбайды.') + '</p>' +
      '</div>';

    // Слушатели
    document.getElementById('bk-base').addEventListener('change', e => {
      state.baseId = e.target.value;
      state.cabinId = BASES[state.baseId].cabins[0].id;
      renderStep1();
    });
    document.querySelectorAll('input[name="bk-cabin"]').forEach(r =>
      r.addEventListener('change', e => { state.cabinId = e.target.value; renderStep1(); }));
    document.getElementById('bk-in').addEventListener('change', e => {
      state.checkin = e.target.value;
      if (nightsBetween(state.checkin, state.checkout) < 1) state.checkout = addDays(state.checkin, 1);
      syncFields(); renderStep1();
    });
    document.getElementById('bk-out').addEventListener('change', e => { state.checkout = e.target.value; syncFields(); updateSummary(); });
    document.getElementById('bk-guests').addEventListener('input', e => { state.guests = e.target.value; });
    document.getElementById('bk-name').addEventListener('input', e => { state.name = e.target.value; });
    document.getElementById('bk-phone').addEventListener('input', e => { state.phone = e.target.value; });
    document.getElementById('bk-next').addEventListener('click', goToPayment);

    function syncFields() {
      state.guests = document.getElementById('bk-guests').value;
      state.name = document.getElementById('bk-name').value;
      state.phone = document.getElementById('bk-phone').value;
    }
    updateSummary();
  }

  function currentCabin() {
    return BASES[state.baseId].cabins.find(c => c.id === state.cabinId);
  }

  function updateSummary() {
    const box = document.getElementById('bk-summary');
    if (!box) return;
    const cabin = currentCabin();
    const nights = Math.max(1, nightsBetween(state.checkin, state.checkout));
    const total = nights * cabin.price;
    const prepay = Math.round(total * PREPAY_RATE);
    box.innerHTML =
      '<div class="flex justify-between"><span>' + cabin.name[lang()] + ' × ' + nights + ' ' +
        L('сут.', 'тәул.') + '</span><span class="font-semibold">' + fmt(total) + ' ₸</span></div>' +
      '<div class="flex justify-between text-green-800 font-bold mt-1 pt-1 border-t border-green-200">' +
        '<span>' + L('Предоплата 30%', 'Алдын ала төлем 30%') + '</span><span>' + fmt(prepay) + ' ₸</span></div>';
  }

  function goToPayment() {
    const err = document.getElementById('bk-err');
    state.guests = +document.getElementById('bk-guests').value;
    state.name = document.getElementById('bk-name').value.trim();
    state.phone = document.getElementById('bk-phone').value.trim();

    const nights = nightsBetween(state.checkin, state.checkout);
    let msg = '';
    if (nights < 1) msg = L('Дата выезда должна быть позже даты заезда.', 'Шығу күні кіру күнінен кейін болуы керек.');
    else if (!state.name) msg = L('Укажите ваше имя.', 'Есіміңізді көрсетіңіз.');
    else if (state.phone.replace(/\D/g, '').length < 10) msg = L('Укажите корректный телефон.', 'Дұрыс телефон нөмірін көрсетіңіз.');
    else if (state.guests > currentCabin().cap) msg = L('В этом домике до ', 'Бұл үйде ') + currentCabin().cap + L(' гостей. Выберите другой тип.', ' қонаққа дейін. Басқа түрін таңдаңыз.');

    if (msg) { err.textContent = msg; err.classList.remove('hidden'); return; }

    state.nights = nights;
    state.total = nights * currentCabin().price;
    state.prepay = Math.round(state.total * PREPAY_RATE);
    renderStep2();
  }

  // ── Шаг 2: оплата картой (демо) ───────────────────────────────────────
  function renderStep2() {
    const base = BASES[state.baseId];
    const cabin = currentCabin();
    document.getElementById('bk-body').innerHTML =
      '<div class="p-6">' +
        stepper(1) +
        '<div class="bg-green-50 rounded-xl p-4 text-sm mb-5">' +
          '<div class="font-semibold text-green-900 mb-2">' + base.name + ' — ' + cabin.name[lang()] + '</div>' +
          row(L('Даты', 'Күндер'), prettyDate(state.checkin) + ' → ' + prettyDate(state.checkout) + ' (' + state.nights + ' ' + L('сут.', 'тәул.') + ')') +
          row(L('Гостей', 'Қонақтар'), String(state.guests)) +
          row(L('Сумма', 'Сома'), fmt(state.total) + ' ₸') +
          '<div class="flex justify-between text-green-800 font-bold mt-2 pt-2 border-t border-green-200">' +
            '<span>' + L('К оплате (предоплата 30%)', 'Төлеуге (алдын ала 30%)') + '</span><span>' + fmt(state.prepay) + ' ₸</span></div>' +
        '</div>' +
        '<p class="text-sm font-medium text-gray-700 mb-2">💳 ' + L('Данные карты', 'Карта мәліметтері') + '</p>' +
        '<input id="bk-card" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" class="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 outline-none tracking-widest">' +
        '<div class="grid grid-cols-2 gap-3 mb-3">' +
          '<input id="bk-exp" inputmode="numeric" maxlength="5" placeholder="' + L('ММ/ГГ', 'АА/ЖЖ') + '" class="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 outline-none">' +
          '<input id="bk-cvv" inputmode="numeric" maxlength="3" placeholder="CVV" class="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 outline-none">' +
        '</div>' +
        '<input id="bk-holder" placeholder="' + L('Имя на карте', 'Картадағы аты') + '" class="w-full mb-2 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 outline-none uppercase">' +
        '<p id="bk-perr" class="text-red-600 text-sm mb-3 hidden"></p>' +
        '<button id="bk-pay" class="w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">' +
          '<span id="bk-pay-txt">' + L('Оплатить', 'Төлеу') + ' ' + fmt(state.prepay) + ' ₸</span>' +
          '<span id="bk-spin" class="hidden w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>' +
        '</button>' +
        '<button id="bk-back" class="w-full text-gray-500 hover:text-gray-700 text-sm py-2 mt-1">← ' + L('Назад', 'Артқа') + '</button>' +
        '<p class="text-[11px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">🔒 ' +
          L('Демо. Данные карты не сохраняются и не передаются.', 'Демо. Карта деректері сақталмайды және берілмейді.') + '</p>' +
      '</div>';

    const card = document.getElementById('bk-card');
    card.addEventListener('input', () => {
      let v = card.value.replace(/\D/g, '').slice(0, 16);
      card.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
    const exp = document.getElementById('bk-exp');
    exp.addEventListener('input', () => {
      let v = exp.value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
      exp.value = v;
    });
    document.getElementById('bk-cvv').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });
    document.getElementById('bk-pay').addEventListener('click', pay);
    document.getElementById('bk-back').addEventListener('click', renderStep1);

    function row(k, v) {
      return '<div class="flex justify-between text-gray-600"><span>' + k + '</span><span class="text-gray-800">' + v + '</span></div>';
    }
  }

  function pay() {
    const perr = document.getElementById('bk-perr');
    const num = document.getElementById('bk-card').value.replace(/\D/g, '');
    const exp = document.getElementById('bk-exp').value;
    const cvv = document.getElementById('bk-cvv').value;
    const holder = document.getElementById('bk-holder').value.trim();

    let msg = '';
    if (num.length < 16) msg = L('Введите 16 цифр номера карты.', 'Карта нөмірінің 16 санын енгізіңіз.');
    else if (!/^\d{2}\/\d{2}$/.test(exp) || +exp.slice(0, 2) < 1 || +exp.slice(0, 2) > 12)
      msg = L('Неверный срок действия (ММ/ГГ).', 'Жарамдылық мерзімі қате (АА/ЖЖ).');
    else if (cvv.length < 3) msg = L('Введите CVV (3 цифры).', 'CVV енгізіңіз (3 сан).');
    else if (!holder) msg = L('Укажите имя на карте.', 'Картадағы атын көрсетіңіз.');

    if (msg) { perr.textContent = msg; perr.classList.remove('hidden'); return; }
    perr.classList.add('hidden');

    // Имитация обработки платежа
    const btn = document.getElementById('bk-pay');
    btn.disabled = true; btn.classList.add('opacity-80', 'cursor-wait');
    document.getElementById('bk-pay-txt').textContent = L('Обработка платежа…', 'Төлем өңделуде…');
    document.getElementById('bk-spin').classList.remove('hidden');

    setTimeout(() => {
      state.bookingNo = 'RDR-' + Math.floor(10000 + Math.random() * 89999);
      renderSuccess();
    }, 2000);
  }

  // ── Шаг 3: успех ──────────────────────────────────────────────────────
  function renderSuccess() {
    const base = BASES[state.baseId];
    const cabin = currentCabin();

    const waText = encodeURIComponent(
      'Здравствуйте! Подтверждаю бронь №' + state.bookingNo + '.\n' +
      'База: ' + base.name + ' — ' + cabin.name.ru + '\n' +
      'Даты: ' + prettyDate(state.checkin) + ' – ' + prettyDate(state.checkout) + ' (' + state.nights + ' сут.)\n' +
      'Гостей: ' + state.guests + '\n' +
      'Имя: ' + state.name + ', тел: ' + state.phone + '\n' +
      'Предоплата: ' + fmt(state.prepay) + ' тг'
    );
    const waUrl = 'https://wa.me/' + BK_PHONE + '?text=' + waText;

    document.getElementById('bk-body').innerHTML =
      '<div class="p-7 text-center">' +
        stepper(2) +
        '<div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-4xl">✅</div>' +
        '<h2 class="font-playfair text-2xl font-bold text-green-900 mb-1">' + L('Бронь подтверждена!', 'Брондау расталды!') + '</h2>' +
        '<p class="text-gray-500 mb-4">' + L('Номер брони', 'Брондау нөмірі') + ': <span class="font-bold text-green-800">' + state.bookingNo + '</span></p>' +
        '<div class="bg-green-50 rounded-xl p-4 text-sm text-left mb-5">' +
          line(base.name + ' — ' + cabin.name[lang()]) +
          line('📅 ' + prettyDate(state.checkin) + ' → ' + prettyDate(state.checkout) + ' (' + state.nights + ' ' + L('сут.', 'тәул.') + ')') +
          line('👥 ' + state.guests + ' · ' + state.name) +
          line('💳 ' + L('Оплачено (предоплата)', 'Төленді (алдын ала)') + ': ' + fmt(state.prepay) + ' ₸') +
          line('💰 ' + L('Остаток при заезде', 'Кіргенде қалдық') + ': ' + fmt(state.total - state.prepay) + ' ₸') +
        '</div>' +
        '<p class="text-sm text-gray-500 mb-4">' +
          L('Мы свяжемся с вами для подтверждения деталей.', 'Мәліметтерді растау үшін сізбен хабарласамыз.') + '</p>' +
        '<a href="' + waUrl + '" target="_blank" rel="noopener" class="block w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition-all mb-2">' +
          '💬 ' + L('Связаться в WhatsApp', 'WhatsApp арқылы байланысу') + '</a>' +
        '<button id="bk-done" class="w-full text-gray-500 hover:text-gray-700 text-sm py-2">' + L('Закрыть', 'Жабу') + '</button>' +
      '</div>';

    document.getElementById('bk-done').addEventListener('click', bkClose);

    function line(t) { return '<div class="py-0.5 text-gray-700">' + t + '</div>'; }
  }

  // ── Публичная точка входа ─────────────────────────────────────────────
  window.openBooking = function (baseId) {
    ensureModal();
    state.baseId = BASES[baseId] ? baseId : 'bearlog';
    state.cabinId = BASES[state.baseId].cabins[0].id;
    state.checkin = todayStr();
    state.checkout = addDays(state.checkin, 2);
    state.bookingNo = '';
    renderStep1();
    show();
  };

  window.bkCloseBooking = bkClose;
})();
