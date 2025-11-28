document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const overlay = document.getElementById("dialogue-overlay");
  const wizardContainer = document.getElementById("wizard-container");

  // Ideally, wizardManager.js handles the wizard elements, 
  // but we need to hide the container initially for the Intro sequence.
  wizardContainer.style.display = "none"; 

  // ============================================
  //  SYSTEM OVERLAY (Narrator)
  // ============================================
  
  function askSystemChoice(question, onYes, onNo) {
    overlay.classList.remove("hidden");
    const newBox = document.getElementById("dialogue-box");
    const newText = document.getElementById("dialogue-text");

    newText.textContent = `(System): ${question}`;

    // Create Buttons
    const btnContainer = document.createElement("div");
    btnContainer.className = "choice-container";
    
    // (Button creation logic same as before...)
    const yesBtn = document.createElement("button"); yesBtn.innerText = "YES"; yesBtn.className = "choice-btn";
    const noBtn = document.createElement("button"); noBtn.innerText = "NO"; noBtn.className = "choice-btn";
    
    btnContainer.appendChild(yesBtn); btnContainer.appendChild(noBtn);
    const oldBtns = newBox.querySelector(".choice-container");
    if(oldBtns) oldBtns.remove();
    newBox.appendChild(btnContainer);

    yesBtn.addEventListener("click", (e) => { e.stopPropagation(); btnContainer.remove(); onYes(); });
    noBtn.addEventListener("click", (e) => { e.stopPropagation(); btnContainer.remove(); onNo(); });
  }

  function playSystemNarrative(lines, onComplete) {
    const textEl = document.getElementById("dialogue-text");
    let currentIndex = 0;

    function showLine() {
      textEl.textContent = `(System): ${lines[currentIndex]}`;
    }

    function advance() {
      currentIndex++;
      if (currentIndex < lines.length) {
        showLine();
      } else {
        overlay.classList.add("hidden");
        overlay.removeEventListener("click", advance);
        if (onComplete) onComplete();
      }
    }

    showLine();
    overlay.removeEventListener("click", advance);
    overlay.addEventListener("click", advance);
  }

  // ============================================
  //  MAIN GAME FLOW
  // ============================================

  window.addEventListener("load", () => {
    
    // 1. Intro Choice
    askSystemChoice("Are you new to this world?", 
      () => { // YES
        playSystemNarrative([
          "Initializing synchronization...",
          "You have successfully possessed a body within the Academy.",
          "Login is required to blend in.",
          "TIP: Tap anywhere to advance dialogue."
        ], triggerWizardEntrance);
      },
      () => { // NO
        playSystemNarrative([
          "Very well. Initiating Login Sequence.",
          "TIP: Tap anywhere to advance dialogue."
        ], triggerWizardEntrance);
      }
    );
  });

  function triggerWizardEntrance() {
    // 2. WELCOME -> MOOD: CALM
    playWizardDialogue([
      "Welcome to my Academy...",
      "Hmm? You smell quite unfamiliar.",
      "Come closer, let's get you enrolled."
    ], 'calm');
  }
  
  // --- Form Logic ---
  const form = document.getElementById("academyForm");
  if(form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("mageName").value.trim();
        const spell = document.getElementById("codeSpell").value.trim();

        // 3. ENTER ACADEMY (Validation) -> MOOD: ANGRY
        if (!name || !spell) {
          playWizardDialogue([
            "No shortcuts for isekai brats!",
            "You must enter both your name and your spell!"
          ], 'angry'); 
          return;
        }

        // 4. ENTER ACADEMY (Success) -> MOOD: ANGRY
        playWizardDialogue([
          "The Gate doesn’t accept strangers!",
          "Enrollment is the ceremony, not a suggestion."
        ], 'angry');
      });
  }
  
  // --- Enroll Button ---
  const enrollBtn = document.getElementById("enrollBtn");
  if (enrollBtn) {
    enrollBtn.addEventListener("click", function () {
      window.location.href = "pages/enroll.html";
    });
  }
});