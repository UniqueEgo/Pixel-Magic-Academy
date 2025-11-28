// --- 🧠 SMART PATH DETECTION ---
const isPagesFolder = window.location.pathname.includes("/pages/");
const pathPrefix = isPagesFolder ? "../" : "./";

// --- CONFIGURATION: IMAGE PATHS ---
const WIZARD_ASSETS = {
  // 1. CALM MODE
  calmIdle: pathPrefix + "src/wizard-idle.png",
  calmFrames: [
    pathPrefix + "src/calm-talking.png", 
    pathPrefix + "src/wizard-idle.png",
    pathPrefix + "src/calm-open.png"
  ],
  
  // 2. ANGRY MODE
  angryIdle: pathPrefix + "src/angry-close.png",
  angryFrames: [
    pathPrefix + "src/angry-talking.png",
    pathPrefix + "src/angry-close.png",
    pathPrefix + "src/angry-open.png"
  ],

  // 3. SUS MODE (Suspicious)
  susIdle: pathPrefix + "src/sus-close.png",
  susFrames: [
    pathPrefix + "src/sus-talking.png",
    pathPrefix + "src/sus-close.png",
    pathPrefix + "src/sus-open.png"
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
//  DIALOGUE LOGIC (MERGED & FIXED)
// ==========================================

/**
 * Universal function to play wizard dialogue
 */
function playWizardDialogue(lines, mood = 'calm', onComplete = null) {
  const { bubble, layer, container, wizard } = getElements();
  
  // 1. ✨ NEW: Auto-close mobile keyboard if open
  if (document.activeElement && document.activeElement.tagName === "INPUT") {
      document.activeElement.blur();
  }

  // 2. Setup Variables
  wizardQueue = [...lines];
  currentMood = mood;
  onDialogueFinish = onComplete; 
  
  // 3. Show Elements (This was missing in your second function!)
  container.style.display = "flex";
  layer.classList.remove("hidden");
  bubble.style.display = "block";
  container.style.zIndex = "100"; 

  // 4. Start Sequence
  showNextLine();

  // 5. Attach Listeners
  layer.onclick = showNextLine;
  wizard.onclick = showNextLine;
  wizard.style.cursor = "pointer"; 
}

function showNextLine() {
  const { bubble, layer, wizard } = getElements();

  // Check if we are done
  if (wizardQueue.length === 0) {
    bubble.style.display = "none";
    layer.classList.add("hidden");
    
    // Clean up listeners
    layer.onclick = null; 
    wizard.onclick = null;
    wizard.style.cursor = "default";
    
    resetToIdle(); 
    
    // Run callback if exists
    if (onDialogueFinish) {
        const callback = onDialogueFinish;
        onDialogueFinish = null; 
        callback();
    }
    return;
  }

  // Show text and animate
  const text = wizardQueue.shift();
  bubble.textContent = text;

  startTalkingAnimation(currentMood);
}