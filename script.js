const heroScene = document.querySelector(".hero-scene");
const dialogBox = document.querySelector(".dialog-box");
const dialogText = document.querySelector(".dialog-text");
const introEnvelope = document.querySelector(".intro-envelope");
const siteLoader = document.querySelector(".site-loader");
const siteLoaderCount = document.querySelector(".site-loader__count");
const backgroundAudio = document.querySelector(".background-audio");

const preloadAssets = [
  "./public/assets/bride.png",
  "./public/assets/envelope_closed.png",
  "./public/assets/envelope_front.png",
  "./public/assets/envelope_open.png",
  "./public/assets/garden_background.png",
  "./public/assets/garden_bride_talking.png",
  "./public/assets/garden_groom_talking.png",
  "./public/assets/garden_scene.png",
  "./public/assets/groom.png",
  "./public/assets/hall_bride_talking.png",
  "./public/assets/hall_desktop.png",
  "./public/assets/hall_groom_talking.png",
  "./public/assets/hall_mobile.png",
  "./public/assets/hall_talking.png",
  "./public/assets/intro_background.png",
  "./public/assets/invitation_card.png",
  "./public/assets/main_background.png",
  "./public/assets/main_bride_talking.png",
  "./public/assets/main_groom_talking.png",
  "./public/assets/main_scene.png",
  "./public/assets/mobile_letter.png",
];

const speakerStates = {
  bride: {
    label: "Невеста говорит. Нажмите, чтобы передать слово жениху.",
    style: {
      "--bride-filter": "brightness(1.05) saturate(1.04)",
      "--bride-frame-opacity": "1",
      "--bride-opacity": "1",
      "--bride-transform": "translateX(-43%) scale(1)",
      "--bride-z-index": "3",
      "--groom-filter": "brightness(0.46) saturate(0.76)",
      "--groom-frame-opacity": "0",
      "--groom-opacity": "0",
      "--groom-transform": "translateX(-130%) scale(0.92)",
      "--groom-z-index": "2",
      "--dialog-desktop-left": "53%",
      "--dialog-desktop-top": "52%",
      "--dialog-desktop-width": "min(34vw, 520px)",
      "--mobile-bg-position": "58% center",
      "--spotlight-height": "21svh",
      "--spotlight-width": "30vw",
      "--spotlight-x": "56%",
      "--spotlight-y": "35%",
    },
  },
  groom: {
    label: "Жених говорит. Нажмите, чтобы передать слово невесте.",
    style: {
      "--bride-filter": "brightness(0.46) saturate(0.76)",
      "--bride-frame-opacity": "0",
      "--bride-opacity": "0",
      "--bride-transform": "translateX(20%) scale(0.92)",
      "--bride-z-index": "2",
      "--groom-filter": "brightness(1.05) saturate(1.04)",
      "--groom-frame-opacity": "1",
      "--groom-opacity": "1",
      "--groom-transform": "translateX(-57%) scale(1)",
      "--groom-z-index": "3",
      "--dialog-desktop-left": "13%",
      "--dialog-desktop-top": "52%",
      "--dialog-desktop-width": "min(34vw, 520px)",
      "--mobile-bg-position": "42% center",
      "--spotlight-height": "21svh",
      "--spotlight-width": "30vw",
      "--spotlight-x": "44%",
      "--spotlight-y": "32%",
    },
  },
};

const sceneStates = {
  room: {
    className: "scene-room",
    style: {
      "--desktop-bride-image": 'url("./public/assets/main_bride_talking.png")',
      "--desktop-groom-image": 'url("./public/assets/main_groom_talking.png")',
      "--mobile-bg-image": 'url("./public/assets/main_background.png")',
    },
  },
  garden: {
    className: "scene-garden",
    style: {
      "--desktop-bride-image": 'url("./public/assets/garden_bride_talking.png")',
      "--desktop-groom-image": 'url("./public/assets/garden_groom_talking.png")',
      "--mobile-bg-image": 'url("./public/assets/garden_background.png")',
    },
  },
  hall: {
    className: "scene-hall",
    style: {
      "--desktop-bride-image": 'url("./public/assets/hall_talking.png")',
      "--desktop-groom-image": 'url("./public/assets/hall_talking.png")',
      "--mobile-bg-image": 'url("./public/assets/hall_mobile.png")',
    },
  },
  hallBrideFocus: {
    className: "scene-hall-focus",
    style: {
      "--desktop-bride-image": 'url("./public/assets/hall_bride_talking.png")',
      "--desktop-groom-image": 'url("./public/assets/hall_bride_talking.png")',
      "--mobile-bg-image": 'url("./public/assets/hall_mobile.png")',
    },
  },
  hallGroomFocus: {
    className: "scene-hall-groom-focus",
    style: {
      "--desktop-bride-image": 'url("./public/assets/hall_groom_talking.png")',
      "--desktop-groom-image": 'url("./public/assets/hall_groom_talking.png")',
      "--mobile-bg-image": 'url("./public/assets/hall_mobile.png")',
    },
  },
};

const dialogSteps = [
  {
    scene: "room",
    speaker: "bride",
    paragraphs: [
      "Уважаемый желанный гость,",
      "Для нас будет большой радостью видеть Вас 12 сентября на торжественной регистрации нашего брака.",
      "Мы будем ожидать Вас к 14:10 в Чкаловском ЗАГСе города Екатеринбурга.",
    ],
  },
  {
    scene: "room",
    speaker: "groom",
    paragraphs: [
      "В этот день мы будем признательны, если Вы поддержите вечерний стиль одежды.",
      "Пусть Ваш образ будет торжественным и элегантным — таким, каким и должен быть вечер, который хочется запомнить надолго.",
    ],
  },
  {
    scene: "room",
    speaker: "bride",
    paragraphs: [
      "Костюм, платье, жакет, благородные оттенки, красивые ткани и немного того самого старого света — всё будет к месту.",
    ],
  },
  {
    scene: "garden",
    speaker: "groom",
    paragraphs: [
      "После торжественной регистрации мы приглашаем Вас продолжить этот день в более уединенной и загородной атмосфере.",
    ],
  },
  {
    scene: "garden",
    speaker: "bride",
    paragraphs: [
      "Сентябрьский вечер за городом может быть особенно красивым, но вместе с тем — прохладным.",
      "Буду Вам очень признательна, если Вы возьмете с собой теплую накидку.",
    ],
  },
  {
    scene: "garden",
    speaker: "bride",
    paragraphs: [
      "И еще одна деталь: часть вечера пройдет на траве, поэтому шпильки могут оказаться не самым удобным выбором.",
    ],
  },
  {
    scene: "hall",
    speaker: "groom",
    style: {
      "--bride-filter": "brightness(1.03) saturate(1.02)",
      "--bride-opacity": "1",
      "--bride-transform": "translateX(-36%) scale(0.96)",
      "--bride-z-index": "4",
      "--groom-filter": "brightness(1.05) saturate(1.04)",
      "--groom-opacity": "1",
      "--groom-transform": "translateX(-64%) scale(1)",
      "--groom-z-index": "3",
      "--dialog-desktop-left": "58%",
      "--dialog-desktop-top": "40%",
      "--dialog-desktop-width": "min(34vw, 520px)",
      "--mobile-bg-position": "center center",
      "--spotlight-height": "27svh",
      "--spotlight-width": "82vw",
      "--spotlight-x": "50%",
      "--spotlight-y": "34%",
    },
    paragraphs: [
      "Ваше присутствие в этот день уже будет для нас большой радостью.",
      "Но если Вы захотите сопроводить его подарком, мы будем искренне благодарны за вклад в нашу будущую семейную жизнь.",
      "Самым желанным и удобным форматом для нас станет подарок в конверте.",
    ],
  },
  {
    scene: "hall",
    speaker: "bride",
    style: {
      "--bride-filter": "brightness(1.03) saturate(1.02)",
      "--bride-opacity": "1",
      "--bride-transform": "translateX(-36%) scale(0.96)",
      "--bride-z-index": "4",
      "--groom-filter": "brightness(1.05) saturate(1.04)",
      "--groom-opacity": "1",
      "--groom-transform": "translateX(-64%) scale(1)",
      "--groom-z-index": "3",
      "--dialog-desktop-left": "58%",
      "--dialog-desktop-top": "40%",
      "--dialog-desktop-width": "min(34vw, 520px)",
      "--mobile-bg-position": "center center",
      "--spotlight-height": "27svh",
      "--spotlight-width": "82vw",
      "--spotlight-x": "50%",
      "--spotlight-y": "34%",
    },
    paragraphs: [
      "От цветов мы просим воздержаться: после торжества мы уедем в Москву, и нам будет грустно не успеть насладиться ими как следует.",
    ],
  },
  {
    scene: "hallBrideFocus",
    speaker: "bride",
    style: {
      "--bride-filter": "brightness(1.05) saturate(1.04)",
      "--bride-opacity": "1",
      "--bride-transform": "translateX(-37%) scale(1)",
      "--bride-z-index": "4",
      "--groom-opacity": "0",
      "--groom-transform": "translateX(-130%) scale(0.92)",
      "--groom-z-index": "2",
      "--dialog-desktop-left": "58%",
      "--dialog-desktop-top": "40%",
      "--dialog-desktop-width": "min(34vw, 520px)",
      "--mobile-bg-position": "center center",
      "--spotlight-height": "21svh",
      "--spotlight-width": "30vw",
      "--spotlight-x": "62%",
      "--spotlight-y": "34%",
    },
    paragraphs: [
      "Уважаемый желанный гость,",
      "Позвольте мне задать Вам несколько вопросов. Ваши ответы помогут нам подготовить вечер с должным вниманием к каждому, кто будет рядом с нами в этот день.",
    ],
  },
];

const TYPE_DELAY_MS = 28;
const UNABLE_TO_ATTEND_OPTION = "К сожалению, не смогу 💎 200";
const RSVP_CONFIG = window.WEDDING_RSVP_CONFIG || {};
const RSVP_SUBMIT_URL = RSVP_CONFIG.appsScriptUrl || "";
const RSVP_EVENT_NAME = RSVP_CONFIG.eventName || "Свадьба";

let currentStep = 0;
let currentQuestion = 0;
let activeParagraphs = [];
const questionnaireAnswers = {};
let typeTimer = null;
let isTyping = false;
let isQuestioning = false;
let isGroomPanel = false;
let isFinalPanel = false;
let isSubmittingRsvp = false;
let isInvitationReady = false;
let hasStartedAudio = false;
let currentGroomPanel = 0;
let hasStartedInvitation = false;
let hasOpenedIntro = false;

const questionSteps = [
  {
    id: "attendance",
    question: "Сможете ли Вы присутствовать на нашем торжестве 12 сентября?",
    options: [
      "Да, с радостью буду",
      "Буду только на регистрации",
      "Поеду только на продолжение вечера",
      UNABLE_TO_ATTEND_OPTION,
    ],
  },
  {
    id: "alcohol",
    question: "Планируете ли Вы пить алкоголь в течение вечера?",
    options: ["Да", "Нет", "Пока не знаю"],
  },
  {
    id: "transfer",
    question: "Понадобится ли Вам трансфер домой после загородного вечера?",
    options: ["Да, пожалуйста", "Нет, доберусь своими силами"],
  },
  {
    id: "address",
    question: "Куда Вас следует отвезти после торжества?",
    input: {
      placeholder: "Ваш адрес",
      type: "text",
    },
  },
  {
    id: "guestName",
    question: "Как Вас следует подписать в списке гостей?",
    input: {
      placeholder: "Ваши имя и фамилия",
      type: "text",
    },
  },
  {
    id: "comment",
    question: "Остались ли у Вас вопросы или пожелания?",
    input: {
      placeholder: "Ваш комментарий",
      type: "text",
    },
  },
  {
    id: "thanks",
    paragraphs: [
      "Благодарю Вас.",
      "Ваши ответы помогут нам сделать этот день по-настоящему внимательным к нашим гостям.",
    ],
    action: "Отправить ответы",
  },
];

const groomPanelBlocks = [
  {
    paragraphs: [
      "Чтобы все гости были в курсе деталей, мы создали общий чат.",
      "Там будут адреса, время, обновления, информация о трансфере и всё, что может понадобиться перед торжеством и в сам день.",
      "Будем рады видеть Вас среди гостей чата.",
    ],
    action: "Перейти в чат гостей",
  },
  {
    paragraphs: [
      "Если Вы приезжаете в Екатеринбург, то мы подготовили для Вас небольшой путеводитель по городу.",
      "В нем — места для прогулок, красивые маршруты и несколько адресов, где можно вкусно поесть до или после торжества.",
    ],
    action: "Открыть путеводитель",
  },
];

const finalPanel = {
  paragraphs: [
    "Благодарим Вас за то, что прошли этот маленький путь по нашему приглашению и узнали всё самое важное.",
    "Мы будем счастливы видеть Вас 12 сентября.",
    "С уважением и любовью,\nНастя и Владик",
  ],
  action: "Вернуться на старт",
};

const unableToAttendForm = {
  id: "unableGuestName",
  paragraphs: [
    "Нам очень жаль, что Вы не сможете быть с нами в этот день.",
    "Подскажите, пожалуйста, как Вас зовут?",
  ],
  input: {
    placeholder: "Ваши имя и фамилия",
    type: "text",
  },
  action: "Отправить форму",
};

function createParagraphNodes(paragraphs) {
  const nodes = paragraphs.map(() => document.createElement("p"));

  dialogText.replaceChildren(...nodes);
  return nodes;
}

function resetDialogTextHeight() {
  dialogText.style.minHeight = "";
}

function reserveDialogTextHeight(paragraphs) {
  resetDialogTextHeight();

  const measure = document.createElement("div");
  measure.className = "dialog-text__measure";

  paragraphs.forEach((paragraph) => {
    const node = document.createElement("p");
    node.textContent = paragraph;
    measure.append(node);
  });

  dialogText.append(measure);
  dialogText.style.minHeight = `${measure.getBoundingClientRect().height}px`;
  measure.remove();
}

function stopTyping() {
  if (typeTimer) {
    window.clearTimeout(typeTimer);
    typeTimer = null;
  }

  isTyping = false;
}

function renderDialogInstant(paragraphs) {
  stopTyping();
  heroScene.classList.remove("is-questioning");
  heroScene.classList.remove("is-groom-panel");
  heroScene.classList.remove("is-final-panel");

  dialogText.replaceChildren(
    ...paragraphs.map((paragraph) => {
      const node = document.createElement("p");
      node.textContent = paragraph;
      return node;
    }),
  );
}

function typeDialog(paragraphs) {
  stopTyping();
  resetDialogTextHeight();
  heroScene.classList.remove("is-questioning");
  heroScene.classList.remove("is-groom-panel");
  heroScene.classList.remove("is-final-panel");

  activeParagraphs = paragraphs;

  const nodes = createParagraphNodes(paragraphs);
  reserveDialogTextHeight(paragraphs);
  const characters = paragraphs.flatMap((paragraph, paragraphIndex) =>
    [...paragraph].map((character) => ({ character, paragraphIndex })),
  );

  let characterIndex = 0;
  isTyping = true;

  function typeNextCharacter() {
    if (characterIndex >= characters.length) {
      stopTyping();
      return;
    }

    const { character, paragraphIndex } = characters[characterIndex];
    nodes[paragraphIndex].textContent += character;
    characterIndex += 1;
    typeTimer = window.setTimeout(typeNextCharacter, TYPE_DELAY_MS);
  }

  typeNextCharacter();
}

function createGlassButton(label, onClick) {
  const button = document.createElement("button");
  button.className = "answer-choice";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick(button);
  });
  return button;
}

function noopAction() {}

function setupBackgroundAudio() {
  if (!backgroundAudio) {
    return;
  }

  backgroundAudio.volume = 0.38;
  backgroundAudio.loop = true;
}

function startBackgroundAudio() {
  if (!backgroundAudio || hasStartedAudio) {
    return;
  }

  hasStartedAudio = true;
  backgroundAudio.volume = 0.38;
  backgroundAudio.play().catch((error) => {
    hasStartedAudio = false;
    console.warn("Background audio playback was blocked.", error);
  });
}

function updateLoaderProgress(loaded, total) {
  if (!siteLoader) {
    return;
  }

  const percent = total > 0 ? Math.round((loaded / total) * 100) : 100;

  siteLoader.style.setProperty("--loader-progress", `${percent}%`);
  if (siteLoaderCount) {
    siteLoaderCount.textContent = `${percent}%`;
  }
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = async () => {
      try {
        if (image.decode) {
          await image.decode();
        }
        resolve({ ok: true, src });
      } catch (error) {
        resolve({ ok: true, src });
      }
    };
    image.onerror = () => resolve({ ok: false, src });
    image.src = src;
  });
}

async function preloadInvitationAssets() {
  const total = preloadAssets.length;
  let loaded = 0;

  updateLoaderProgress(loaded, total);

  await Promise.all(
    preloadAssets.map(async (src) => {
      const result = await preloadImage(src);

      loaded += 1;
      updateLoaderProgress(loaded, total);

      if (!result.ok) {
        console.warn(`Failed to preload image: ${src}`);
      }
    }),
  );
}

function finishAssetLoading() {
  isInvitationReady = true;
  updateLoaderProgress(1, 1);
  document.body.classList.remove("is-loading");

  if (siteLoader) {
    siteLoader.setAttribute("aria-hidden", "true");
  }

  if (!introEnvelope) {
    startInvitation();
  }
}

function prepareInvitation() {
  preloadInvitationAssets().then(finishAssetLoading);
}

function getAnswerValue(id) {
  return questionnaireAnswers[id] || "";
}

function createRsvpPayload(submissionType) {
  const guestName =
    getAnswerValue("guestName") || getAnswerValue(unableToAttendForm.id);

  return {
    eventName: RSVP_EVENT_NAME,
    submissionType,
    submittedAt: new Date().toISOString(),
    attendance: getAnswerValue("attendance"),
    alcohol: getAnswerValue("alcohol"),
    transfer: getAnswerValue("transfer"),
    address: getAnswerValue("address"),
    guestName,
    comment: getAnswerValue("comment"),
  };
}

async function submitRsvpAnswers(submissionType) {
  const url = RSVP_SUBMIT_URL.trim();

  if (isSubmittingRsvp) {
    return false;
  }

  if (!url) {
    console.warn("RSVP Apps Script URL is not configured.");
    return false;
  }

  isSubmittingRsvp = true;

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(createRsvpPayload(submissionType)),
    });
    return true;
  } catch (error) {
    console.error("Failed to submit RSVP answers.", error);
    return false;
  } finally {
    isSubmittingRsvp = false;
  }
}

async function submitAndContinue(button, submissionType, onComplete) {
  const previousLabel = button.textContent;

  button.disabled = true;
  button.textContent = "Отправляем...";
  await submitRsvpAnswers(submissionType);
  button.textContent = previousLabel;
  button.disabled = false;
  onComplete();
}

function getNextQuestionIndex(index, answer) {
  const step = questionSteps[index];

  if (step.id === "attendance" && answer === UNABLE_TO_ATTEND_OPTION) {
    return null;
  }

  if (step.id === "transfer" && answer === "Нет, доберусь своими силами") {
    delete questionnaireAnswers.address;
    return questionSteps.findIndex(({ id }) => id === "guestName");
  }

  return index + 1;
}

async function sendUnableToAttendForm(button) {
  const previousLabel = button?.textContent;

  if (button) {
    button.disabled = true;
    button.textContent = "Отправляем...";
  }

  questionnaireAnswers.attendance = UNABLE_TO_ATTEND_OPTION;
  questionnaireAnswers.__ready = true;
  await submitRsvpAnswers("declined");

  if (button) {
    button.textContent = previousLabel;
    button.disabled = false;
  }

  returnToEnvelopeStart();
}

function setSpeaker(speaker) {
  const state = speakerStates[speaker];

  heroScene.dataset.speaker = speaker;
  heroScene.classList.toggle("is-bride-speaking", speaker === "bride");
  heroScene.classList.toggle("is-groom-speaking", speaker === "groom");
  heroScene.setAttribute("aria-label", state.label);

  Object.entries(state.style).forEach(([property, value]) => {
    heroScene.style.setProperty(property, value);
  });
}

function setScene(scene) {
  const state = sceneStates[scene];

  heroScene.dataset.scene = scene;
  Object.values(sceneStates).forEach(({ className }) => {
    heroScene.classList.remove(className);
  });
  heroScene.classList.add(state.className);

  Object.entries(state.style).forEach(([property, value]) => {
    heroScene.style.setProperty(property, value);
  });
}

function setDialogStep(index) {
  const step = dialogSteps[index];

  isQuestioning = false;
  isGroomPanel = false;
  isFinalPanel = false;
  currentQuestion = 0;
  setScene(step.scene);
  setSpeaker(step.speaker);
  if (step.style) {
    Object.entries(step.style).forEach(([property, value]) => {
      heroScene.style.setProperty(property, value);
    });
  }
  typeDialog(step.paragraphs);
}

function setQuestionScene() {
  setScene("hallBrideFocus");
  setSpeaker("bride");
  Object.entries({
    "--bride-filter": "brightness(1.05) saturate(1.04)",
    "--bride-opacity": "1",
    "--bride-transform": "translateX(-37%) scale(1)",
    "--bride-z-index": "4",
    "--dialog-desktop-left": "38%",
    "--dialog-desktop-top": "8%",
    "--dialog-desktop-width": "min(56vw, 900px)",
    "--groom-opacity": "0",
    "--groom-transform": "translateX(-130%) scale(0.92)",
    "--groom-z-index": "2",
    "--mobile-bg-position": "center center",
    "--spotlight-height": "21svh",
    "--spotlight-width": "30vw",
    "--spotlight-x": "62%",
    "--spotlight-y": "34%",
  }).forEach(([property, value]) => {
    heroScene.style.setProperty(property, value);
  });
}

function renderQuestion(index) {
  const step = questionSteps[index];

  isQuestioning = true;
  isGroomPanel = false;
  isFinalPanel = false;
  currentQuestion = index;
  resetDialogTextHeight();
  setQuestionScene();
  heroScene.classList.add("is-questioning");
  dialogText.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.className = "questionnaire";

  const questionBubble = document.createElement("div");
  questionBubble.className = "question-bubble";

  if (step.paragraphs) {
    step.paragraphs.forEach((paragraph) => {
      const node = document.createElement("p");
      node.textContent = paragraph;
      questionBubble.append(node);
    });
  } else {
    questionBubble.textContent = step.question;
  }

  wrapper.append(questionBubble);

  if (step.options) {
    const options = document.createElement("div");
    options.className = "answer-list";

    step.options.forEach((option, optionIndex) => {
      const button = createGlassButton(option, () => {
        questionnaireAnswers[step.id] = option;
        const nextQuestionIndex = getNextQuestionIndex(index, option);

        if (nextQuestionIndex === null) {
          renderUnableToAttendForm();
          return;
        }

        renderQuestion(nextQuestionIndex);
      });

      if (index === 0 && optionIndex === step.options.length - 1) {
        button.classList.add("answer-choice--accent");
      }

      options.append(button);
    });

    wrapper.append(options);
  }

  if (step.input) {
    const input = document.createElement("input");
    input.className = "answer-input";
    input.placeholder = step.input.placeholder;
    input.type = step.input.type;
    input.value = questionnaireAnswers[step.id] || "";
    input.addEventListener("click", (event) => event.stopPropagation());
    input.addEventListener("input", () => {
      questionnaireAnswers[step.id] = input.value;
    });
    input.addEventListener("keydown", (event) => {
      event.stopPropagation();

      if (event.key === "Enter") {
        event.preventDefault();
        renderQuestion(index + 1);
      }
    });
    wrapper.append(input);
  }

  if (step.action) {
    const action = createGlassButton(step.action, (button) => {
      questionnaireAnswers.__ready = true;
      submitAndContinue(button, "attending", renderGroomPanel);
    });
    action.classList.add("answer-choice--submit");
    wrapper.append(action);
  }

  dialogText.append(wrapper);
}

function renderUnableToAttendForm() {
  isQuestioning = true;
  isGroomPanel = false;
  isFinalPanel = false;
  currentQuestion = -1;
  resetDialogTextHeight();
  setQuestionScene();
  heroScene.classList.add("is-questioning");
  dialogText.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.className = "questionnaire";

  const questionBubble = document.createElement("div");
  questionBubble.className = "question-bubble";
  unableToAttendForm.paragraphs.forEach((paragraph) => {
    const node = document.createElement("p");
    node.textContent = paragraph;
    questionBubble.append(node);
  });

  const input = document.createElement("input");
  input.className = "answer-input";
  input.placeholder = unableToAttendForm.input.placeholder;
  input.type = unableToAttendForm.input.type;
  input.value = questionnaireAnswers[unableToAttendForm.id] || "";
  input.addEventListener("click", (event) => event.stopPropagation());
  input.addEventListener("input", () => {
    questionnaireAnswers[unableToAttendForm.id] = input.value;
  });
  input.addEventListener("keydown", (event) => {
    event.stopPropagation();

    if (event.key === "Enter") {
      event.preventDefault();
      sendUnableToAttendForm();
    }
  });

  const action = createGlassButton(unableToAttendForm.action, sendUnableToAttendForm);
  action.classList.add("answer-choice--submit");

  wrapper.append(questionBubble, input, action);
  dialogText.append(wrapper);
  input.focus();
}

function setGroomPanelScene() {
  setScene("hallGroomFocus");
  setSpeaker("groom");
  Object.entries({
    "--bride-filter": "brightness(0.46) saturate(0.76)",
    "--bride-opacity": "0",
    "--bride-transform": "translateX(20%) scale(0.92)",
    "--bride-z-index": "2",
    "--dialog-desktop-left": "43%",
    "--dialog-desktop-top": "7%",
    "--dialog-desktop-width": "min(52vw, 860px)",
    "--groom-filter": "brightness(1.05) saturate(1.04)",
    "--groom-opacity": "1",
    "--groom-transform": "translateX(-72%) scale(1)",
    "--groom-z-index": "4",
    "--mobile-bg-position": "center center",
    "--spotlight-height": "24svh",
    "--spotlight-width": "42vw",
    "--spotlight-x": "34%",
    "--spotlight-y": "31%",
  }).forEach(([property, value]) => {
    heroScene.style.setProperty(property, value);
  });
}

function renderGroomPanel(index = 0) {
  const block = groomPanelBlocks[index];

  isQuestioning = false;
  isGroomPanel = true;
  currentGroomPanel = index;
  resetDialogTextHeight();
  setGroomPanelScene();
  heroScene.classList.remove("is-questioning");
  heroScene.classList.add("is-groom-panel");
  dialogText.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.className = "groom-panel";

  const item = document.createElement("article");
  item.className = "groom-panel__item";

  const bubble = document.createElement("div");
  bubble.className = "groom-panel__bubble";
  block.paragraphs.forEach((paragraph) => {
    const node = document.createElement("p");
    node.textContent = paragraph;
    bubble.append(node);
  });

  const actions = document.createElement("div");
  actions.className = "groom-panel__actions";

  const action = createGlassButton(block.action, noopAction);
  action.classList.add("groom-panel__action");

  const nextAction = createGlassButton("Дальше", () => {
    if (index < groomPanelBlocks.length - 1) {
      renderGroomPanel(index + 1);
    } else {
      renderFinalPanel();
    }
  });
  nextAction.classList.add("groom-panel__action", "groom-panel__next");

  actions.append(action, nextAction);

  item.append(bubble, actions);
  wrapper.append(item);

  dialogText.append(wrapper);
}

function setFinalPanelScene() {
  setScene("hall");
  setSpeaker("bride");
  Object.entries({
    "--bride-filter": "brightness(1.05) saturate(1.04)",
    "--bride-opacity": "1",
    "--bride-transform": "translateX(-36%) scale(0.96)",
    "--bride-z-index": "4",
    "--dialog-desktop-left": "30%",
    "--dialog-desktop-top": "8%",
    "--dialog-desktop-width": "min(48vw, 760px)",
    "--groom-filter": "brightness(1.05) saturate(1.04)",
    "--groom-opacity": "1",
    "--groom-transform": "translateX(-64%) scale(1)",
    "--groom-z-index": "3",
    "--mobile-bg-position": "center center",
    "--spotlight-height": "30svh",
    "--spotlight-width": "82vw",
    "--spotlight-x": "50%",
    "--spotlight-y": "34%",
  }).forEach(([property, value]) => {
    heroScene.style.setProperty(property, value);
  });
}

function resetInvitation({ renderFirstStep = true } = {}) {
  stopTyping();
  isQuestioning = false;
  isGroomPanel = false;
  isFinalPanel = false;
  currentQuestion = 0;
  currentGroomPanel = 0;
  currentStep = 0;
  Object.keys(questionnaireAnswers).forEach((key) => {
    delete questionnaireAnswers[key];
  });
  heroScene.classList.remove("is-questioning", "is-groom-panel", "is-final-panel");

  if (renderFirstStep) {
    setDialogStep(currentStep);
  } else {
    resetDialogTextHeight();
    dialogText.replaceChildren();
  }
}

function startInvitation() {
  if (hasStartedInvitation) {
    return;
  }

  hasStartedInvitation = true;
  setDialogStep(currentStep);
}

function finishIntro() {
  document.body.classList.remove("intro-active");
  introEnvelope.classList.add("is-done");
  startInvitation();
}

function returnToEnvelopeStart() {
  resetInvitation({ renderFirstStep: false });
  hasStartedInvitation = false;
  hasOpenedIntro = false;
  document.body.classList.add("intro-active");
  introEnvelope.classList.remove("is-open", "is-done");
  introEnvelope.setAttribute("aria-label", "Открыть приглашение");
}

function openIntro() {
  if (!isInvitationReady) {
    return;
  }

  startBackgroundAudio();

  if (hasOpenedIntro) {
    finishIntro();
    return;
  }

  hasOpenedIntro = true;
  introEnvelope.classList.add("is-open");
  introEnvelope.setAttribute("aria-label", "Продолжить приглашение");
}

function renderFinalPanel() {
  isQuestioning = false;
  isGroomPanel = false;
  isFinalPanel = true;
  resetDialogTextHeight();
  setFinalPanelScene();
  heroScene.classList.remove("is-questioning", "is-groom-panel");
  heroScene.classList.add("is-final-panel");
  dialogText.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.className = "final-panel";

  const bubble = document.createElement("div");
  bubble.className = "final-panel__bubble";
  finalPanel.paragraphs.forEach((paragraph, index) => {
    const node = document.createElement("p");
    node.textContent = paragraph;
    if (index === finalPanel.paragraphs.length - 1) {
      node.className = "final-panel__signature";
    }
    bubble.append(node);
  });

  const action = createGlassButton(finalPanel.action, returnToEnvelopeStart);
  action.classList.add("final-panel__action");

  wrapper.append(bubble, action);
  dialogText.append(wrapper);
}

function advanceDialog() {
  if (isQuestioning || isGroomPanel || isFinalPanel) {
    return;
  }

  if (isTyping) {
    renderDialogInstant(activeParagraphs);
    return;
  }

  if (currentStep >= dialogSteps.length - 1) {
    renderQuestion(0);
    return;
  }

  currentStep = (currentStep + 1) % dialogSteps.length;
  setDialogStep(currentStep);
}

dialogBox.addEventListener("click", (event) => {
  if (isQuestioning || isGroomPanel || isFinalPanel) {
    event.stopPropagation();
  }
});

heroScene.addEventListener("click", advanceDialog);
heroScene.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  advanceDialog();
});

if (introEnvelope) {
  introEnvelope.addEventListener("click", openIntro);
  introEnvelope.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openIntro();
  });
} else {
  prepareInvitation();
}

setupBackgroundAudio();

if (introEnvelope) {
  prepareInvitation();
}
