// Dialogue System
const overlay = document.getElementById("dialogue-overlay");
const dialogueText = document.getElementById("dialogue-text");

let dialogueLines = [];
let currentLine = 0;

function startDialogue(lines, callback = null) {
  dialogueLines = lines;
  currentLine = 0;

  overlay.classList.remove("hidden");
  dialogueText.textContent = dialogueLines[currentLine];

  function next() {
    currentLine++;
    if (currentLine < dialogueLines.length) {
      dialogueText.textContent = dialogueLines[currentLine];
    } else {
      overlay.classList.add("hidden");
      overlay.removeEventListener("click", next);
      if (callback) callback();
    }
  }

  overlay.addEventListener("click", next);
}

// ✅ AUTO-PLAY INTRO DIALOGUE ON PAGE LOAD
window.addEventListener("load", () => {
  startDialogue([
    "Well, if you want to enter my Academy...",
    "You'll have to enroll properly!",
    "No shortcuts for isekai brats!"
  ]);
});


// Simple interactivity on form
document.getElementById("academyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("mageName").value.trim();
  const spell = document.getElementById("codeSpell").value.trim();

  if (!name || !spell) {
    // You can add wizard dialogue here later if you want
    return;
  }

  // Success dialogue
  startDialogue(
    [
      "Heh. The Gate doesn’t accept strangers. Enrollment is the ceremony, not a suggestion."
    ],
  );
});


// Enroll Button
const enrollBtn = document.getElementById("enrollBtn");
if (enrollBtn) {
  enrollBtn.addEventListener("click", function () {
    window.location.href = "pages/enroll.html";
  });
}
