document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Retrieve Stored Credentials
  // Note: "codeSpell" comes from the "Last Name" field in Enroll level.
  const storedName = sessionStorage.getItem("mageName") || "Unknown Mage";
  const storedCode = sessionStorage.getItem("codeSpell") || "";

  const form = document.getElementById("academyForm");
  const trapBtn = document.getElementById("trapEnrollBtn");
  
  // Overlay Elements
  const overlay = document.getElementById("dialogue-overlay");
  const overlayText = document.getElementById("dialogue-text-system");

  // --- BLOCK PASTING (Anti-Cheat) ---
  const codeInput = document.getElementById("loginCode");
  if(codeInput) {
      codeInput.addEventListener("paste", function(e) {
          e.preventDefault();
          playWizardDialogue(["“No copying! Recite the spell from memory!”"], 'angry');
      });
  }

  // --- SYSTEM OVERLAY ---
  function playSystemOverlay(lines, onComplete) {
    let currentIndex = 0;
    overlay.classList.remove("hidden");
    function updateText() { overlayText.textContent = "(System): " + lines[currentIndex]; }
    function advance() {
      currentIndex++;
      if (currentIndex < lines.length) updateText();
      else {
        overlay.classList.add("hidden");
        overlay.removeEventListener("click", advance);
        if (onComplete) onComplete();
      }
    }
    updateText();
    overlay.addEventListener("click", advance);
  }

  // --- INTRO ---
  playSystemOverlay(["Level Three: Official Login.", "Recall your credentials."]);


  // ==========================================
  //  1. ENROLL BUTTON (THE TRAP)
  // ==========================================
  trapBtn.addEventListener("click", () => {
    playWizardDialogue([
        `“You are applying again, ${storedName}?!”`,
        "“Are you stupid?”"
    ], 'angry');
  });


  // ==========================================
  //  2. SUBMIT LOGIC
  // ==========================================
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const inputName = document.getElementById("loginName").value.trim();
    const inputCode = document.getElementById("loginCode").value.trim(); 

    // Check Case Insensitive
    const isNameCorrect = inputName.toLowerCase() === storedName.toLowerCase();
    const isCodeCorrect = inputCode.toLowerCase() === storedCode.toLowerCase();

    // --- FAILURE ---
    if (!inputName || !inputCode || !isNameCorrect || !isCodeCorrect) {
        
        playSystemOverlay([
            "You really don't listen?",
            `Go back and copy your code spell, ${storedName}.`
        ], () => {
            // Optional: You can redirect them back to Enroll if they are truly stuck
            // window.location.href = "../pages/enroll.html";
        });
        return;
    }

    // --- SUCCESS ---
    playWizardDialogue([
        "“Finally.”",
        "“Now, let's go with the captcha.”"
    ], 'calm', () => {
        
        playSystemOverlay([
            "Oh, I can't help you with this one.",
            "I'm a robot, remember?"
        ], () => {
            
            // Redirect to Final Level
            window.location.href = "../pages/finalLevel.html";
        });
    });

  });

});