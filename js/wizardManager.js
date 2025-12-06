// --- CONFIGURATION: IMAGE PATHS (Absolute Paths) ---
const WIZARD_ASSETS = {
  // 1. CALM MODE
  calmIdle: "/src/wizard-idle.png",
  calmFrames: [
    "/src/calm-talking.png", 
    "/src/wizard-idle.png",
    "/src/calm-open.png"
  ],
  
  // 2. ANGRY MODE
  angryIdle: "/src/angry-close.png",
  angryFrames: [
    "/src/angry-talking.png",
    "/src/angry-close.png",
    "/src/angry-open.png"
  ],

  // 3. SUS MODE
  susIdle: "/src/sus-close.png",
  susFrames: [
    "/src/sus-talking.png",
    "/src/sus-close.png",
    "/src/sus-open.png"
  ]
};

// --- STATE VARIABLES ---
let talkingInterval = null;
let wizardQueue = [];
let currentMood = 'calm'; 
let onDialogueFinish = null; 

// --- ELEMENTS ---
function getElements() {
  return {
    wizard: document.getElementById("wizard"),
    bubble: document.getElementById("wizard-dialogue"),
    layer: document.getElementById("wizard-click-layer"),
    container: document.getElementById("wizard-container")
  };
}

// ==========================================
//  ANIMATION LOGIC
// ==========================================

function startTalkingAnimation(mood) {
  const { wizard } = getElements();
  
  let frames;
  if (mood === 'angry') {
    frames = WIZARD_ASSETS.angryFrames;
  } else if (mood === 'sus') {
    frames = WIZARD_ASSETS.susFrames;
  } else {
    frames = WIZARD_ASSETS.calmFrames;
  }

  let index = 0;

  if (talkingInterval) clearInterval(talkingInterval);

  talkingInterval = setInterval(() => {
    wizard.src = frames[index];
    index = (index + 1) % frames.length; 
  }, 200); 
}

function resetToIdle() {
  const { wizard } = getElements();
  if (talkingInterval) clearInterval(talkingInterval);
  talkingInterval = null;

  if (currentMood === 'angry') {
    wizard.src = WIZARD_ASSETS.angryIdle;
  } else if (currentMood === 'sus') {
    wizard.src = WIZARD_ASSETS.susIdle;
  } else {
    wizard.src = WIZARD_ASSETS.calmIdle;
  }
}

// ==========================================
//  DIALOGUE LOGIC
// ==========================================

function playWizardDialogue(lines, mood = 'calm', onComplete = null) {
  const { bubble, layer, container, wizard } = getElements();
  
  // Auto-close keyboard on mobile
  if (document.activeElement && document.activeElement.tagName === "INPUT") {
      document.activeElement.blur();
  }

  wizardQueue = [...lines];
  currentMood = mood;
  onDialogueFinish = onComplete; 
  
  container.style.display = "flex";
  layer.classList.remove("hidden");
  bubble.style.display = "block";
  container.style.zIndex = "100"; 

  showNextLine();

  layer.onclick = showNextLine;
  wizard.onclick = showNextLine;
  wizard.style.cursor = "pointer"; 
}

function showNextLine() {
  const { bubble, layer, wizard } = getElements();

  if (wizardQueue.length === 0) {
    bubble.style.display = "none";
    layer.classList.add("hidden");
    
    layer.onclick = null; 
    wizard.onclick = null;
    wizard.style.cursor = "default";
    
    resetToIdle(); 
    
    if (onDialogueFinish) {
        const callback = onDialogueFinish;
        onDialogueFinish = null; 
        callback();
    }
    return;
  }

  const text = wizardQueue.shift();
  bubble.textContent = text;

  startTalkingAnimation(currentMood);
}