# RSVP backend setup

Этот код нужен для связки:

`GitHub Pages` -> `Google Apps Script` -> `Google Sheets` + `Telegram`.

## 1. Google Sheets

1. Создайте новую Google-таблицу.
2. Скопируйте ее ID из URL.

Пример:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

## 2. Google Apps Script

1. Откройте `Extensions` -> `Apps Script` в созданной таблице.
2. Вставьте содержимое `Code.gs`.
3. Откройте `Project Settings` -> `Script properties`.
4. Добавьте свойства:

```text
SPREADSHEET_ID = ID вашей Google-таблицы
TELEGRAM_BOT_TOKEN = токен бота из BotFather
TELEGRAM_CHAT_ID = id вашего чата, группы или канала
```

`TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` можно не заполнять, если нужны только Google Sheets.

## 3. Первичная настройка

В Apps Script выберите функцию `setupWeddingRsvp` и запустите ее один раз.
Google попросит выдать доступ к таблице и внешним запросам.

После этого в таблице появятся листы:

- `Ответы` — все отправленные формы.
- `Сводка` — счетчики по гостям, трансферу и алкоголю.
- `Лог Telegram` — ответы Telegram API для диагностики.

Если в `Сводке` появились `#ERROR!` или нужно удалить старые колонки `Страница` / `User Agent`, выберите функцию `repairSummaryAndColumns` и нажмите `Run`.

## Проверка Telegram

После добавления `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`:

1. Сохраните код Apps Script.
2. Выберите функцию `testTelegramNotification`.
3. Нажмите `Run`.
4. Откройте лист `Лог Telegram`.

Если все хорошо, в логе будет статус `200` и сообщение с `"ok":true`.

Частые ошибки:

- `Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID` — не заполнено одно из Script properties или есть опечатка в названии.
- `chat not found` — неверный `TELEGRAM_CHAT_ID` или бот не добавлен в чат.
- `bot was blocked by the user` — нужно открыть бота в Telegram и нажать `Start`.
- Для группы `chat_id` обычно отрицательный, например `-1001234567890`.
- Для канала бот должен быть добавлен администратором.

## 4. Публикация backend

1. Нажмите `Deploy` -> `New deployment`.
2. Тип: `Web app`.
3. `Execute as`: `Me`.
4. `Who has access`: `Anyone`.
5. Скопируйте `Web app URL`.

Если открыть `Web app URL` в браузере, должен появиться ответ:

```json
{"ok":true,"service":"wedding-rsvp"}
```

## 5. Подключение сайта

В `config.js` вставьте URL:

```js
window.WEDDING_RSVP_CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/.../exec",
  eventName: "Свадьба Насти и Владика",
};
```

После этого GitHub Pages-сайт начнет отправлять ответы в таблицу.
