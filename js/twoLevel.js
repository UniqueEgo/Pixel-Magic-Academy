function enableAutoSave(fieldIds) {
  fieldIds.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    const savedValue = sessionStorage.getItem(id);
    if (savedValue) input.value = savedValue;
    input.addEventListener("input", () => {
      sessionStorage.setItem(id, input.value);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  enableAutoSave(["mageName", "codeSpell"]);

  const form = document.getElementById("academyForm");
  const submitBtn = document.getElementById("finalButton");
  const overlay = document.getElementById("dialogue-overlay");
  const overlayText = document.getElementById("dialogue-text-enroll");

  // Trackers
  let isNameValid = false;
  let isCodeValid = false;
  let confirmAttempts = 0; 

  submitBtn.disabled = true;

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

  // --- BUTTON STATE ---
  function updateButtonState() {
    // Unlock button if Name and Code are valid. 
    // We DON'T check confirm here, so the user can click it and fail (Troll Mechanic).
    if (isNameValid && isCodeValid) {
        submitBtn.disabled = false;
        submitBtn.innerText = "⭐ CAST SPELL!!! ⭐";
    } else {
        submitBtn.disabled = true;
        submitBtn.innerText = "🔒 COMPLETE TASKS";
    }
  }

  // --- INTRO ---
  playSystemOverlay(["Level Two: Arcane Security.", "Create a spell that cannot be broken."]);


  // ==========================================
  //  1. VALIDATION LOGIC
  // ==========================================

  // A. Check Name
  function validateName(showError = true) {
    const name = document.getElementById("mageName").value.trim();
    if (!name) {
        if(showError) playWizardDialogue(["“Who are you? The name field is empty.”"], 'sus');
        isNameValid = false;
    } else if (name.length > 10) {
        if(showError) playWizardDialogue(["“Too long! Are you writing a novel?”"], 'sus');
        isNameValid = false;
    } else {
        isNameValid = true;
    }
    updateButtonState();
    return isNameValid;
  }

  // B. Check Code Spell
  function validateCodeSpell(showError = true) {
    const code = document.getElementById("codeSpell").value.toUpperCase(); 
    const heroName = document.getElementById("mageName").value.trim().toUpperCase();
    
    // Reset validity to check rules
    isCodeValid = false;

    // 0. Empty
    if (!code) {
        if(showError) playWizardDialogue(["“Where is the spell? Invisible ink?”"], 'sus');
        updateButtonState(); return false;
    }

    // Rule 1: No Numbers
    if (/\d/.test(code)) {
        if(showError) playWizardDialogue(["“Numbers are for accountants, not wizards!”", "“Remove them.”"], 'sus');
        isCodeValid = false; // 🔴 IMPORTANT: Mark as invalid before updating button
        updateButtonState(); 
        return false;
    }

    // Rule 2: Length (15+)
    if (code.length < 15) {
        if(showError) playWizardDialogue(["“Too short! Your spell lacks power.”", "“Minimum 15 runes.”"], 'sus');
        isCodeValid = false; // 🔴 IMPORTANT
        updateButtonState(); 
        return false;
    }

    // Rule 3: Special Character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(code)) {
        if(showError) playWizardDialogue(["“It needs a spark of chaos!”", "“Add a special symbol.”"], 'sus');
        isCodeValid = false; // 🔴 IMPORTANT
        updateButtonState(); 
        return false;
    }

    // Rule 4: No Character > 2 times
    const charCounts = {};
    for (let char of code) {
        charCounts[char] = (charCounts[char] || 0) + 1;
        if (charCounts[char] > 2) {
            if(showError) playWizardDialogue([`“You stutter! The rune '${char}' appears too often.”`, "“Max 2 times.”"], 'sus');
            updateButtonState(); return false;
        }
    }

    // Rule 5: No Vowel beside Vowel
    if (/[AEIOU]{2,}/.test(code)) {
        if(showError) playWizardDialogue(["“Vowels weaken the structure when clumped!”", "“Separate them.”"], 'sus');
        updateButtonState(); return false;
    }

    // Rule 6: 7th Char = 'O'
    if (code.length >= 7 && code[6] !== 'O') {
        if(showError) playWizardDialogue(["“The 7th rune aligns the stars.”", "“It must be 'O'.”"], 'sus');
        updateButtonState(); return false;
    }

    // Rule 7: 13th Char = 'Y'
    if (code.length >= 13 && code[12] !== 'Y') {
        if(showError) playWizardDialogue(["“The 13th rune seals the fate.”", "“It must be 'Y'.”"], 'sus');
        updateButtonState(); return false;
    }

    // Rule 8: Include Name
    if (/\d/.test(heroName)) {
        if(showError) playWizardDialogue(["“Your name contains numbers!”", "“Fix your name first.”"], 'angry');
        updateButtonState(); return false;
    }
    if (!code.includes(heroName)) {
        if(showError) playWizardDialogue(["“A true wizard signs their work.”", "“Include your Name in the spell.”"], 'sus');
        updateButtonState(); return false;
    }

    // ALL PASSED
    isCodeValid = true;
    updateButtonState();
    return true;
  }


  // ==========================================
  //  2. INPUT LISTENERS
  // ==========================================

  // Focus Blocking
  document.getElementById("codeSpell").addEventListener("focus", function() {
    if (!validateName(true)) this.blur();
  });

  document.getElementById("confirmCodeSpell").addEventListener("focus", function() {
    if (!validateCodeSpell(true)) this.blur();
  });

  // No Paste
  document.getElementById("confirmCodeSpell").addEventListener("paste", function(e) {
    e.preventDefault();
    playWizardDialogue(["“Cheater! Magic cannot be pasted.”"], 'angry');
  });

  // Validation on Leave
  document.getElementById("mageName").addEventListener("blur", () => validateName(false)); 
  document.getElementById("codeSpell").addEventListener("blur", () => validateCodeSpell(false));
  
  // Update button in real-time (to enable it for the troll trap)
  document.getElementById("codeSpell").addEventListener("input", () => validateCodeSpell(false));


  // ==========================================
  //  3. SUBMIT LOGIC (The Troll)
  // ==========================================
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Re-validate strictly before proceeding
    if (!validateName(false) || !validateCodeSpell(false)) return;

    const original = document.getElementById("codeSpell").value.toUpperCase();
    const confirm = document.getElementById("confirmCodeSpell").value.toUpperCase();
    const confirmInput = document.getElementById("confirmCodeSpell");

    // TROLL LOGIC: Check Confirm on Submit
    if (confirm !== original) {
        confirmAttempts++;
        confirmInput.value = ""; // Clear input immediately

        if (confirmAttempts === 1) {
            playWizardDialogue(["“Haha! Wrong!”"], 'sus');
        } else {
            // Random Troll Lines
            const taunts = [
                "“Ahh, lemme clear it again for you.”",
                "“Are you frustrated?”",
                "“Oops magic! Your input has gone again haha!”"
            ];
            const randomTaunt = taunts[Math.floor(Math.random() * taunts.length)];
            
            playWizardDialogue([randomTaunt], 'sus');
        }
        return;
    }

    const mageName = document.getElementById("mageName").value.trim();

    playWizardDialogue([
      "Hmph. Not bad.",
      `“Your spell is... acceptable, ${mageName}.”`
    ], 'calm', () => {
        
        playSystemOverlay([
            "Level 2 Cleared.",
            "Remember your mage name and code spell, copy it or write it down."
        ], () => {
            window.location.href = "../pages/thirdLevel.html";
        });
        
    });
  });

});