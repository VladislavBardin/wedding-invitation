const heroScene = document.querySelector(".hero-scene");
const dialogText = document.querySelector(".dialog-text");

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
      "--spotlight-x": "44%",
      "--spotlight-y": "32%",
    },
  },
};

const dialogSteps = [
  {
    speaker: "bride",
    paragraphs: [
      "Уважаемый желанный гость,",
      "Для нас будет большой радостью видеть Вас 12 сентября на торжественной регистрации нашего брака.",
      "Мы будем ожидать Вас к 14:10\nв Чкаловском ЗАГСе города Екатеринбурга.",
    ],
  },
  {
    speaker: "groom",
    paragraphs: [
      "В этот день мы будем признательны,\nесли Вы поддержите вечерний стиль одежды.",
      "Пусть Ваш образ будет торжественным и элегантным — таким, каким и должен быть вечер, который хочется запомнить надолго.",
    ],
  },
  {
    speaker: "bride",
    paragraphs: [
      "Костюм, платье, жакет, благородные оттенки, красивые ткани и немного того самого старого света — всё будет к месту.",
    ],
  },
];

const TYPE_DELAY_MS = 28;

let currentStep = 0;
let activeParagraphs = [];
let typeTimer = null;
let isTyping = false;

function createParagraphNodes(paragraphs) {
  const nodes = paragraphs.map(() => document.createElement("p"));

  dialogText.replaceChildren(...nodes);
  return nodes;
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

  activeParagraphs = paragraphs;

  const nodes = createParagraphNodes(paragraphs);
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

function setDialogStep(index) {
  const step = dialogSteps[index];

  setSpeaker(step.speaker);
  typeDialog(step.paragraphs);
}

function advanceDialog() {
  if (isTyping) {
    renderDialogInstant(activeParagraphs);
    return;
  }

  currentStep = (currentStep + 1) % dialogSteps.length;
  setDialogStep(currentStep);
}

heroScene.addEventListener("click", advanceDialog);
heroScene.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  advanceDialog();
});

setDialogStep(currentStep);
