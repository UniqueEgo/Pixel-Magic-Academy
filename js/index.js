// Dialogue System
const overlay = document.getElementById("dialogue-overlay");
const dialogueText = document.getElementById("dialogue-text");
const wizard = document.getElementById("wizard"); // ← wizard image

let dialogueLines = [];
let currentLine = 0;

let talkingInterval = null;

// --- Wizard Animation: 3 Frames ---
function startWizardTalking() {
  const frames = [
    "src/normal-talking-closed.png",
    "src/normal-talking-half-open.png",
    "src/normal-talking.png"
  ];
  
  let index = 0;

  talkingInterval = setInterval(() => {
    wizard.src = frames[index];
    index = (index + 1) % frames.length;
  }, 700 ); // speed of talking
}

function stopWizardTalking() {
  clearInterval(talkingInterval);
  wizard.src = "images/normal-talking-closed.png"; // return to idle
}


// --- Dialogue System ---
function startDialogue(lines, callback = null) {
  dialogueLines = lines;
  currentLine = 0;

  overlay.classList.remove("hidden");
  dialogueText.textContent = dialogueLines[currentLine];

  startWizardTalking(); // ← START talking

  function next() {
    currentLine++;

    if (currentLine < dialogueLines.length) {
      dialogueText.textContent = dialogueLines[currentLine];
    } else {
      overlay.classList.add("hidden");
      stopWizardTalking(); // ← STOP talking
      overlay.removeEventListener("click", next);
      if (callback) callback();
    }
  }

  overlay.addEventListener("click", next);
}


// --- Auto Dialogue on Page Load ---
window.addEventListener("load", () => {
  startDialogue([
    "Well, if you want to enter my Academy...",
    "You'll have to enroll properly!",
    "No shortcuts for isekai brats!"
  ]);
});


// --- Form Interactivity ---
document.getElementById("academyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("mageName").value.trim();
  const spell = document.getElementById("codeSpell").value.trim();

  if (!name || !spell) {
    startDialogue([
      "Hmm… You must enter BOTH your name and your spell."
    ]);
    return;
  }

  startDialogue([
    "Heh. The Gate doesn’t accept strangers.",
    "Enrollment is the ceremony, not a suggestion."
  ]);
});


// --- Enroll Button ---
const enrollBtn = document.getElementById("enrollBtn");
if (enrollBtn) {
  enrollBtn.addEventListener("click", function () {
    window.location.href = "pages/enroll.html";
  });
}
