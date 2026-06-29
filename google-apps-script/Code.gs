const SHEET_RESPONSES = "Ответы";
const SHEET_SUMMARY = "Сводка";
const SHEET_TELEGRAM_LOG = "Лог Telegram";

const HEADERS = [
  "Дата",
  "Событие",
  "Тип формы",
  "Присутствие",
  "Алкоголь",
  "Трансфер",
  "Адрес",
  "Имя гостя",
  "Комментарий",
];

function doGet() {
  return jsonResponse_({ ok: true, service: "wedding-rsvp" });
}

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const sheet = getResponsesSheet_();
    const row = buildResponseRow_(payload);

    sheet.appendRow(row);
    updateSummarySheet_();
    sendTelegramNotification_(payload);

    return jsonResponse_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: error.message });
  }
}

function setupWeddingRsvp() {
  getResponsesSheet_();
  updateSummarySheet_();
  getTelegramLogSheet_();
}

function repairSummaryAndColumns() {
  getResponsesSheet_();
  updateSummarySheet_();
}

function testTelegramNotification() {
  sendTelegramNotification_({
    guestName: "Тест Apps Script",
    attendance: "Проверка Telegram",
    alcohol: "не указано",
    transfer: "не указано",
    address: "",
    comment: "Если это сообщение пришло, Telegram настроен правильно.",
  });
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Empty request body");
  }

  return JSON.parse(e.postData.contents);
}

function getSpreadsheet_() {
  const spreadsheetId = getRequiredProperty_("SPREADSHEET_ID");
  return SpreadsheetApp.openById(spreadsheetId);
}

function getResponsesSheet_() {
  const spreadsheet = getSpreadsheet_();
  const sheet =
    spreadsheet.getSheetByName(SHEET_RESPONSES) ||
    spreadsheet.insertSheet(SHEET_RESPONSES);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  trimExtraColumns_(sheet, HEADERS.length);
  return sheet;
}

function trimExtraColumns_(sheet, keepColumns) {
  const extraColumns = sheet.getMaxColumns() - keepColumns;

  if (extraColumns > 0) {
    sheet.deleteColumns(keepColumns + 1, extraColumns);
  }
}

function getTelegramLogSheet_() {
  const spreadsheet = getSpreadsheet_();
  const sheet =
    spreadsheet.getSheetByName(SHEET_TELEGRAM_LOG) ||
    spreadsheet.insertSheet(SHEET_TELEGRAM_LOG);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Дата", "Статус", "Ответ Telegram"]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function updateSummarySheet_() {
  const spreadsheet = getSpreadsheet_();
  const sheet =
    spreadsheet.getSheetByName(SHEET_SUMMARY) ||
    spreadsheet.insertSheet(SHEET_SUMMARY);
  const responses = getResponsesSheet_().getDataRange().getValues().slice(1);
  const attendanceValues = responses.map((row) => row[3]);
  const alcoholValues = responses.map((row) => row[4]);
  const transferValues = responses.map((row) => row[5]);

  sheet.clear();
  sheet.getRange("A1:B1").setValues([["Показатель", "Значение"]]);
  sheet.getRange("A2:B10").setValues([
    ["Всего ответов", responses.length],
    ["Будут полностью", countValues_(attendanceValues, "Да, с радостью буду")],
    ["Только регистрация", countValues_(attendanceValues, "Буду только на регистрации")],
    ["Только вечер", countValues_(attendanceValues, "Поеду только на продолжение вечера")],
    ["Не смогут", countValues_(attendanceValues, "К сожалению, не смогу 💎 200")],
    ["Нужен трансфер", countValues_(transferValues, "Да, пожалуйста")],
    ["Алкоголь: да", countValues_(alcoholValues, "Да")],
    ["Алкоголь: нет", countValues_(alcoholValues, "Нет")],
    ["Алкоголь: пока не знаю", countValues_(alcoholValues, "Пока не знаю")],
  ]);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 2);
}

function countValues_(values, target) {
  return values.filter((value) => clean_(value) === target).length;
}

function buildResponseRow_(payload) {
  return [
    payload.submittedAt ? new Date(payload.submittedAt) : new Date(),
    clean_(payload.eventName),
    clean_(payload.submissionType),
    clean_(payload.attendance),
    clean_(payload.alcohol),
    clean_(payload.transfer),
    clean_(payload.address),
    clean_(payload.guestName),
    clean_(payload.comment),
  ];
}

function sendTelegramNotification_(payload) {
  const botToken = PropertiesService.getScriptProperties().getProperty("TELEGRAM_BOT_TOKEN");
  const chatId = PropertiesService.getScriptProperties().getProperty("TELEGRAM_CHAT_ID");

  if (!botToken || !chatId) {
    logTelegramResult_("skipped", "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return;
  }

  const message = [
    "Новый ответ на свадебное приглашение",
    "",
    `Имя: ${clean_(payload.guestName) || "не указано"}`,
    `Присутствие: ${clean_(payload.attendance) || "не указано"}`,
    `Алкоголь: ${clean_(payload.alcohol) || "не указано"}`,
    `Трансфер: ${clean_(payload.transfer) || "не указано"}`,
    `Адрес: ${clean_(payload.address) || "не указан"}`,
    `Комментарий: ${clean_(payload.comment) || "нет"}`,
  ].join("\n");

  const response = UrlFetchApp.fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "post",
    muteHttpExceptions: true,
    payload: {
      chat_id: chatId,
      text: message,
    },
  });
  const status = response.getResponseCode();
  const body = response.getContentText();

  logTelegramResult_(status, body);

  if (status < 200 || status >= 300) {
    console.error(`Telegram notification failed: ${status} ${body}`);
  }
}

function logTelegramResult_(status, body) {
  try {
    getTelegramLogSheet_().appendRow([new Date(), status, body]);
  } catch (error) {
    console.error(`Failed to write Telegram log: ${error.message}`);
  }
}

function getRequiredProperty_(name) {
  const value = PropertiesService.getScriptProperties().getProperty(name);

  if (!value) {
    throw new Error(`Missing script property: ${name}`);
  }

  return value;
}

function clean_(value) {
  return String(value || "").trim();
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
