const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN;
const MINI_APP_URL = 'https://huntersnetplus.github.io/MaxSwap/';

// Guard: если токен не задан — сразу видно в логах
if (!TOKEN) console.error('❌ BOT_TOKEN is not set!');

// In-memory state (resets on cold start — for production use a DB like Redis/Vercel KV)
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

function cardKeyboard(lang) {
  const t = T[lang];
  return {
    inline_keyboard: [
      [{ text: t.proceedBtn, web_app: { url: MINI_APP_URL } }],
      [{ text: '✅ Оплата по СБП через QR-код (без комиссии)', url: 'https://t.me/MaxSwapSupport' }],
      [{ text: '💳 Оплата с карты (без комиссии)',             url: 'https://t.me/MaxSwapSupport' }],
      [
        { text: t.webAppBtn,  web_app: { url: MINI_APP_URL } },
        { text: t.supportBtn, url: 'https://t.me/MaxSwapSupport' }
      ]
    ]
  };
}

// ─── Update handler ───────────────────────────────────────────────────────────
async function handleUpdate(update) {
  // ── Callback query ──
  if (update.callback_query) {
    const query  = update.callback_query;
    const userId = query.from.id;
    const data   = query.data;
    const state  = users[userId] || {};
    const lang   = state.lang || 'ru';
    const t      = T[lang];

    if (data === 'lang_ru' || data === 'lang_en') {
      const chosen = data === 'lang_ru' ? 'ru' : 'en';
      if (!users[userId]) users[userId] = { step: 'enter_email', registeredAt: Date.now() };
      users[userId].lang = chosen;
      users[userId].step = 'enter_email';

      await bot.editMessageText(T[chosen].enterEmail, {
        chat_id: userId,
        message_id: query.message.message_id
      });
      await bot.answerCallbackQuery(query.id);
      return;
    }

    if (data === 'locked') {
      await bot.answerCallbackQuery(query.id);
      await bot.sendMessage(userId, t.needCard, { reply_markup: needCardKeyboard(lang) });
      return;
    }

    if (data === 'open_card') {
      await bot.answerCallbackQuery(query.id);
      await bot.sendMessage(userId, t.cardInfo, {
        parse_mode: 'Markdown',
        reply_markup: cardKeyboard(lang)
      });
      return;
    }

    await bot.answerCallbackQuery(query.id);
    return;
  }

  // ── Message ──
  if (update.message) {
    const msg    = update.message;
    const userId = msg.from.id;
    const text   = msg.text || '';

    // /start
    if (text === '/start') {
      users[userId] = { step: 'choose_lang', lang: null, email: null, registeredAt: Date.now() };
      await bot.sendMessage(userId, T.ru.chooseLanguage, { reply_markup: langKeyboard() });
      return;
    }

    const state = users[userId];
    if (!state || state.step !== 'enter_email') return;

    const lang = state.lang || 'ru';
    const t    = T[lang];

    if (!isValidEmail(text)) {
      await bot.sendMessage(userId, t.invalidEmail);
      return;
    }

    users[userId].email = text.trim();
    users[userId].step  = 'done';

    await bot.sendMessage(userId, t.emailSent(text.trim()), { parse_mode: 'Markdown' });

    // Delay then profile (webhook — use setTimeout, it's fine for Vercel)
    setTimeout(async () => {
      const regDate = formatDate(state.registeredAt);
      await bot.sendMessage(userId, t.profile(userId, regDate), {
        parse_mode: 'Markdown',
        reply_markup: profileKeyboard(lang)
      });
    }, 2500);
  }
}

// ─── Vercel serverless handler ────────────────────────────────────────────────
module.exports = async (req, res) => {
  // Health check
  if (req.method !== 'POST') {
    res.status(200).send('MaxSwap Bot webhook is alive.');
    return;
  }

  // Vercel передаёт тело как объект если Content-Type: application/json
  // но на всякий случай обрабатываем и строку
  let update = req.body;
  if (typeof update === 'string') {
    try {
      update = JSON.parse(update);
    } catch (e) {
      console.error('Failed to parse body:', e);
      res.status(200).json({ ok: false, error: 'bad json' });
      return;
    }
  }

  if (!update) {
    console.error('Empty body received');
    res.status(200).json({ ok: false, error: 'empty body' });
    return;
  }

  console.log('Incoming update:', JSON.stringify(update).slice(0, 300));

  try {
    await handleUpdate(update);
  } catch (err) {
    console.error('Update error:', err.message, err.stack);
  }

  // Telegram требует 200 OK — иначе будет повторять запрос
  res.status(200).json({ ok: true });
};
