# MaxSwap Bot

Telegram-бот для MaxSwap Crypto Wallet.

## Структура

```
MsBot/
├── api/
│   └── webhook.js   ← serverless handler для Vercel
├── bot.js           ← локальный запуск (polling)
├── package.json
├── vercel.json
├── .env.example
└── .gitignore
```

## Локальный запуск

1. Скопируй `.env.example` → `.env` и вставь токен бота:
   ```
   BOT_TOKEN=123456:ABC-DEF...
   ```

2. Установи зависимости:
   ```bash
   npm install
   ```

3. Запусти:
   ```bash
   npm start
   ```

## Деплой на Vercel

### 1. Залей на GitHub

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USER/maxswap-bot.git
git push -u origin main
```

### 2. Подключи репозиторий в Vercel

- Зайди на [vercel.com](https://vercel.com) → New Project → импортируй репо
- В разделе **Environment Variables** добавь:
  - `BOT_TOKEN` = твой токен от @BotFather

### 3. Зарегистрируй webhook

После деплоя Vercel даст тебе URL вида `https://your-project.vercel.app`.  
Открой в браузере (или выполни curl):

```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhook
```

Должен вернуться ответ `{"ok":true,"result":true}` — бот готов к работе.

## Примечание

Vercel serverless функции не хранят состояние между вызовами (cold start сбрасывает `users`).  
Для продакшена рекомендуется подключить **Vercel KV** (Redis) для хранения состояния пользователей.
