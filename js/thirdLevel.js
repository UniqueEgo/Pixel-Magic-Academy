document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Retrieve Stored Credentials
  const storedName = sessionStorage.getItem("mageName") || "Unknown Mage";
  const storedCode = sessionStorage.getItem("codeSpell") || "";

  const form = document.getElementById("academyForm");
  const trapBtn = document.getElementById("trapEnrollBtn");
  
  // Overlay Elements
  const overlay = document.getElementById("dialogue-overlay");
  const overlayText = document.getElementById("dialogue-text-system");

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

    // ✨ CHANGED: Check everything in Lowercase (Case Insensitive)
    const isNameCorrect = inputName.toLowerCase() === storedName.toLowerCase();
    const isCodeCorrect = inputCode.toLowerCase() === storedCode.toLowerCase();

    // --- FAILURE ---
    if (!inputName || !inputCode || !isNameCorrect || !isCodeCorrect) {
        
        playSystemOverlay([
            "You really don't listen?",
            `Go back and copy your code spell, ${storedName}.`
        ], () => {
            // Optional redirect logic could go here
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
            
            // Redirect
            window.location.href = "../pages/finalLevel.html";
        });
    });

  });

});