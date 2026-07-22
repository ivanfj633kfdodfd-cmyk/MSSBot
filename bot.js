const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN;
const MINI_APP_URL = 'https://huntersnetplus.github.io/MaxSwap/';
const SUPPORT_USERNAME = '@MaxSwapSupport';

const bot = new TelegramBot(TOKEN, { polling: true });

// ─── User state storage ───────────────────────────────────────────────────────
// { userId: { step, lang, email, registeredAt } }
const users = {};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function formatDate(date) {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

// ─── Texts ────────────────────────────────────────────────────────────────────
const T = {
  ru: {
    chooseLanguage: '🌐 Выберите язык интерфейса:',
    enterEmail: '📧 Введите ваш адрес электронной почты:',
    invalidEmail: '❌ Некорректный адрес электронной почты. Пожалуйста, введите действительный e-mail:',
    emailSent: (email) =>
      `📨 На адрес электронной почты *${email}* отправлено письмо для подтверждения.\n\nВы можете подтвердить почту в любой удобный момент — тогда она станет дополнительным каналом связи.\n\nЕсли вы не получили письмо и/или истёк срок действия ссылки — проверьте папку «Спам».`,
    profile: (id, date) =>
      `👤 *Профиль*\n\n🆔 ID аккаунта: \`${id}\`\n📅 Дата создания: ${date}\n\n💼 *Доступные балансы:*\nUSDT: 0.00\nUSDC: 0.00\nBTC: 0.0\nETH: 0.0\nXRP: 0.0\nLTC: 0.0\nTRX: 0.0\nXLM: 0.0\nBNB: 0.0\nBCH: 0.0\nHBAR: 0.0\nDOT: 0.0\nAVAX: 0.0\nALGO: 0.0\nDOGE: 0.0\nPOL: 0.0\nTRUMP: 0.0\nNEAR: 0.0\nTON: 0.0\nADA: 0.0\nSOL: 0.0`,
    needCard: '🔒 Для доступа к этому разделу нужно открыть Max Swap Карту.',
    openCardBtn: '💳 Открыть в приложении',
    openTgBtn: '📲 Открыть в Telegram',
    openCardTitle: '💳 Открыть Max Swap Карту',
    cardInfo:
      `🪙 Виртуальная карта за 5 минут — легко, безопасно, надёжно.\n\n💳 Получите мгновенно, оплачивайте в 1000+ онлайн-сервисах через ApplePay.\n\n✅ Баланс в USDT, полная анонимность, абсолютная безопасность без необходимости верификации.\n\n🔒 Ваша конфиденциальность гарантирована.\n\n♻️ Отслеживайте расходы прямо в Telegram. Мгновенная выдача — используйте сразу после пополнения.\n\nВыпуск карты: 25 USDT\nПервый депозит: минимум 25 USDT\nКомиссия за пополнение: 3%`,
    proceedBtn: '✅ Перейти к оформлению',
    chooseCardTitle: '💳 Выберите тип карты',
    chooseCardText:
      `💳 *Выберите тип карты:*\n\n` +
      `1️⃣ *MaxSwap Online Card* — 52.5 USDT\n` +
      `Подойдёт для покупок в интернете, подписок, оплаты онлайн-сервисов (Netflix, ChatGPT, Spotify и тд.)\n\n` +
      `2️⃣ *MaxSwap NFC Card* — 52.5 USDT\n` +
      `Подойдёт для привязки к Google Pay | Apple Pay и оплаты через NFC-терминалы.\n\n` +
      `3️⃣ *MaxSwap Ultima* — 99 USDT\n` +
      `Комбинация двух предыдущих пунктов. Карта подойдёт для любых целей.`,
    cardOnlineBtn: '💻 MaxSwap Online Card — 52.5 USDT',
    cardNfcBtn: '📱 MaxSwap NFC Card — 52.5 USDT',
    cardUltimaBtn: '⭐ MaxSwap Ultima — 99 USDT',
    cardSelectedText: (name, price) =>
      `✅ Вы выбрали *${name}*\n💰 Стоимость: *${price} USDT*\n\nПожалуйста, выберите способ оплаты:`,
    payQrBtn: '✅ Оплата по СБП через QR-код (без комиссии)',
    payCardBtn: '💳 Оплата с карты (без комиссии)',
    webAppBtn: '🌐 Web-приложение',
    supportBtn: '🆘 Поддержка',
    openCardMenuBtn: '💳 Открыть MaxSwap Карту',
    walletBtn: '💰 Кошелёк',
    exchangeBtn: '🔄 Обмен',
    buyBtn: '💵 Купить',
    sellBtn: '📤 Продать',
    limitBtn: '📋 Лимитные ордера',
    amlBtn: '🔐 AML',
    settingsBtn: '⚙️ Настройки',
    infoBtn: '📄 Инфо',
  },
  en: {
    chooseLanguage: '🌐 Choose your interface language:',
    enterEmail: '📧 Enter your email address:',
    invalidEmail: '❌ Invalid email address. Please enter a valid e-mail:',
    emailSent: (email) =>
      `📨 A confirmation email has been sent to *${email}*.\n\nYou can confirm your email at any convenient time — it will then become an additional communication channel.\n\nIf you did not receive the confirmation email and/or the link has expired — please check your Spam folder.`,
    profile: (id, date) =>
      `👤 *Profile*\n\n🆔 Account ID: \`${id}\`\n📅 Created: ${date}\n\n💼 *Available balances:*\nUSDT: 0.00\nUSDC: 0.00\nBTC: 0.0\nETH: 0.0\nXRP: 0.0\nLTC: 0.0\nTRX: 0.0\nXLM: 0.0\nBNB: 0.0\nBCH: 0.0\nHBAR: 0.0\nDOT: 0.0\nAVAX: 0.0\nALGO: 0.0\nDOGE: 0.0\nPOL: 0.0\nTRUMP: 0.0\nNEAR: 0.0\nTON: 0.0\nADA: 0.0\nSOL: 0.0`,
    needCard: '🔒 To access this section you need to open a Max Swap Card.',
    openCardBtn: '💳 Open in App',
    openTgBtn: '📲 Open in Telegram',
    openCardTitle: '💳 Open Max Swap Card',
    cardInfo:
      `🪙 Virtual card in 5 minutes — easy, secure, reliable.\n\n💳 Get it instantly, pay at 1000+ online services via ApplePay.\n\n✅ USDT balance, full anonymity, absolute security without verification.\n\n🔒 Your privacy is guaranteed.\n\n♻️ Track expenses directly in Telegram. Instant issuance — use immediately after top-up.\n\nCard issuance: 25 USDT\nFirst deposit: minimum 25 USDT\nTop-up fee: 3%`,
    proceedBtn: '✅ Proceed to checkout',
    chooseCardTitle: '💳 Choose your card type',
    chooseCardText:
      `💳 *Choose your card type:*\n\n` +
      `1️⃣ *MaxSwap Online Card* — 52.5 USDT\n` +
      `Perfect for online shopping, subscriptions, and online services (Netflix, ChatGPT, Spotify, etc.)\n\n` +
      `2️⃣ *MaxSwap NFC Card* — 52.5 USDT\n` +
      `Perfect for linking to Google Pay | Apple Pay and paying via NFC terminals.\n\n` +
      `3️⃣ *MaxSwap Ultima* — 99 USDT\n` +
      `A combination of both previous options. Suitable for any purpose.`,
    cardOnlineBtn: '💻 MaxSwap Online Card — 52.5 USDT',
    cardNfcBtn: '📱 MaxSwap NFC Card — 52.5 USDT',
    cardUltimaBtn: '⭐ MaxSwap Ultima — 99 USDT',
    cardSelectedText: (name, price) =>
      `✅ You selected *${name}*\n💰 Price: *${price} USDT*\n\nPlease choose a payment method:`,
    payQrBtn: '✅ Pay via SBP QR code (no fee)',
    payCardBtn: '💳 Pay by card (no fee)',
    webAppBtn: '🌐 Web App',
    supportBtn: '🆘 Support',
    openCardMenuBtn: '💳 Open MaxSwap Card',
    walletBtn: '💰 Wallet',
    exchangeBtn: '🔄 Exchange',
    buyBtn: '💵 Buy',
    sellBtn: '📤 Sell',
    limitBtn: '📋 Limit Orders',
    amlBtn: '🔐 AML',
    settingsBtn: '⚙️ Settings',
    infoBtn: '📄 Info',
  }
};

// ─── Keyboards ────────────────────────────────────────────────────────────────
function langKeyboard() {
  return {
    inline_keyboard: [[
      { text: '🇷🇺 Русский', callback_data: 'lang_ru' },
      { text: '🇬🇧 English', callback_data: 'lang_en' }
    ]]
  };
}

function profileKeyboard(lang) {
  const t = T[lang];
  return {
    inline_keyboard: [
      [{ text: t.openCardMenuBtn, callback_data: 'open_card' }],
      [
        { text: t.walletBtn,   callback_data: 'locked' },
        { text: t.exchangeBtn, callback_data: 'locked' }
      ],
      [
        { text: t.buyBtn,  callback_data: 'locked' },
        { text: t.sellBtn, callback_data: 'locked' }
      ],
      [
        { text: t.limitBtn, callback_data: 'locked' },
        { text: t.amlBtn,   callback_data: 'locked' }
      ],
      [
        { text: t.settingsBtn, callback_data: 'locked' },
        { text: t.infoBtn,     callback_data: 'locked' }
      ],
      [{ text: t.supportBtn, url: `https://t.me/MaxSwapSupport` }]
    ]
  };
}

function needCardKeyboard(lang) {
  const t = T[lang];
  return {
    inline_keyboard: [
      [{ text: t.openCardBtn, web_app: { url: MINI_APP_URL } }],
      [{ text: t.openTgBtn,   callback_data: 'open_card' }]
    ]
  };
}

function cardKeyboard(lang) {
  const t = T[lang];
  return {
    inline_keyboard: [
      [{ text: t.proceedBtn, callback_data: 'choose_card' }],
      [
        { text: t.webAppBtn,  web_app: { url: MINI_APP_URL } },
        { text: t.supportBtn, url: `https://t.me/MaxSwapSupport` }
      ]
    ]
  };
}

function chooseCardKeyboard(lang) {
  const t = T[lang];
  return {
    inline_keyboard: [
      [{ text: t.cardOnlineBtn, callback_data: 'card_online' }],
      [{ text: t.cardNfcBtn,    callback_data: 'card_nfc' }],
      [{ text: t.cardUltimaBtn, callback_data: 'card_ultima' }]
    ]
  };
}

function paymentKeyboard(lang) {
  const t = T[lang];
  return {
    inline_keyboard: [
      [{ text: t.payQrBtn,   url: `https://t.me/MaxSwapSupport` }],
      [{ text: t.payCardBtn, url: `https://t.me/MaxSwapSupport` }],
      [{ text: t.supportBtn, url: `https://t.me/MaxSwapSupport` }]
    ]
  };
}

// ─── /start ───────────────────────────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const userId = msg.from.id;
  users[userId] = { step: 'choose_lang', lang: null, email: null, registeredAt: new Date() };

  bot.sendMessage(userId, T.ru.chooseLanguage, {
    reply_markup: langKeyboard()
  });
});

// ─── Callback queries ─────────────────────────────────────────────────────────
bot.on('callback_query', async (query) => {
  const userId = query.from.id;
  const data   = query.data;
  const state  = users[userId] || {};
  const lang   = state.lang || 'ru';
  const t      = T[lang];

  // ── Language selection ──
  if (data === 'lang_ru' || data === 'lang_en') {
    const chosen = data === 'lang_ru' ? 'ru' : 'en';
    if (!users[userId]) users[userId] = { step: 'enter_email', registeredAt: new Date() };
    users[userId].lang = chosen;
    users[userId].step = 'enter_email';

    await bot.editMessageText(T[chosen].enterEmail, {
      chat_id: userId,
      message_id: query.message.message_id
    });
    await bot.answerCallbackQuery(query.id);
    return;
  }

  // ── Locked sections ──
  if (data === 'locked') {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(userId, t.needCard, {
      reply_markup: needCardKeyboard(lang)
    });
    return;
  }

  // ── Open card ──
  if (data === 'open_card') {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(userId, t.cardInfo, {
      parse_mode: 'Markdown',
      reply_markup: cardKeyboard(lang)
    });
    return;
  }

  // ── Choose card type ──
  if (data === 'choose_card') {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(userId, t.chooseCardText, {
      parse_mode: 'Markdown',
      reply_markup: chooseCardKeyboard(lang)
    });
    return;
  }

  // ── Card selected ──
  if (data === 'card_online' || data === 'card_nfc' || data === 'card_ultima') {
    const cardMap = {
      card_online: { name: 'MaxSwap Online Card', price: '52.5' },
      card_nfc:    { name: 'MaxSwap NFC Card',    price: '52.5' },
      card_ultima: { name: 'MaxSwap Ultima',       price: '99' }
    };
    const card = cardMap[data];
    if (users[userId]) users[userId].selectedCard = card;

    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(userId, t.cardSelectedText(card.name, card.price), {
      parse_mode: 'Markdown',
      reply_markup: paymentKeyboard(lang)
    });
    return;
  }

  await bot.answerCallbackQuery(query.id);
});

// ─── Text messages (email input) ──────────────────────────────────────────────
bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/')) return; // ignore commands

  const userId = msg.from.id;
  const state  = users[userId];

  if (!state || state.step !== 'enter_email') return;

  const lang  = state.lang || 'ru';
  const t     = T[lang];
  const input = msg.text.trim();

  if (!isValidEmail(input)) {
    await bot.sendMessage(userId, t.invalidEmail);
    return;
  }

  // Save email, move to next step
  users[userId].email = input;
  users[userId].step  = 'done';

  // Email confirmation notice
  await bot.sendMessage(userId, t.emailSent(input), { parse_mode: 'Markdown' });

  // Short delay, then show profile
  setTimeout(async () => {
    const regDate = formatDate(state.registeredAt);
    await bot.sendMessage(userId, t.profile(userId, regDate), {
      parse_mode: 'Markdown',
      reply_markup: profileKeyboard(lang)
    });
  }, 2500);
});

console.log('✅ MaxSwap Bot is running...');
