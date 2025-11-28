// --- HELPER: AutoSave ---
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
  enableAutoSave(["eMess", "CONFIRME-MESS", "ORB", "CON-ORB"]);

  // Elements
  const form = document.getElementById("academyForm");
  const submitBtn = document.getElementById("twoLevelbutton");
  
  // Overlay Elements
  const overlay = document.getElementById("dialogue-overlay");
  const overlayText = document.getElementById("dialogue-text-enroll");

  // Trackers
  let gmessAttempts = 0;
  let orbAttempts = 0;
  let confirmOrbAttempts = 0; 
  
  // State Flags (For the button)
  let isGmessValid = false;
  let isGmessConfirmed = false;
  let isOrbValid = false;
  let isOrbConfirmed = false;

  // Disable button initially
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

  // --- BUTTON STATE UPDATER ---
  function updateButtonState() {
    // Only unlock if ALL steps are valid
    if (isGmessValid && isGmessConfirmed && isOrbValid && isOrbConfirmed) {
        submitBtn.disabled = false;
        submitBtn.innerText = "⭐ STEP UP!!! ⭐";
    } else {
        submitBtn.disabled = true;
        submitBtn.innerText = "🔒 COMPLETE TASKS";
    }
  }

  // ==========================================
  //  1. VALIDATION FUNCTIONS
  // ==========================================

  // A. Check G-Mess
  function validateGmess(showError = true) {
    const input = document.getElementById("eMess");
    const val = input.value.trim().toLowerCase();
    const pattern = /^[a-z]+[a-z]+@gmess\.orb$/;

    if (!val) {
        if(showError) playWizardDialogue(["“The field is empty, fool!”"], 'angry');
        isGmessValid = false;
        updateButtonState();
        return false;
    }

    if (pattern.test(val)) {
      isGmessValid = true;
      updateButtonState();
      return true;
    } else {
      isGmessValid = false;
      updateButtonState();
      
      if (showError) {
        gmessAttempts++;
        // Don't clear input immediately, let them fix it
        if (gmessAttempts < 3) {
            playWizardDialogue(["“That is NOT a valid G-Mess!”"], 'angry');
        } else {
            playWizardDialogue(["“You are testing my patience!”"], 'angry', () => {
                playSystemOverlay(["Just add @gmess.orb like how gmail works in your world works lol"]);
            });
            // Only clear on the big fail to force reset
            input.value = ""; 
        }
      }
      return false;
    }
  }

  // B. Check Confirm G-Mess
  function validateConfirmGmess(showError = true) {
    const original = document.getElementById("eMess").value.trim().toLowerCase();
    const confirm = document.getElementById("CONFIRME-MESS").value.trim().toLowerCase();

    if (!confirm) {
        if(showError) playWizardDialogue(["“Confirm it first! You haven't typed anything.”"], 'angry');
        isGmessConfirmed = false;
        updateButtonState();
        return false;
    }

    if (confirm === original) {
        isGmessConfirmed = true;
        updateButtonState();
        return true;
    } else {
        if(showError) {
            playWizardDialogue(["“They don't match! Confirm it properly!”"], 'angry');
            document.getElementById("CONFIRME-MESS").value = "";
        }
        isGmessConfirmed = false;
        updateButtonState();
        return false;
    }
  }

  // C. Check Orb Number
  function validateOrb(showError = true) {
    const input = document.getElementById("ORB");
    const val = input.value.trim();

    if (!val) {
        if(showError) playWizardDialogue(["“Add orb number first! It is empty.”"], 'angry');
        isOrbValid = false;
        updateButtonState();
        return false;
    }

    // Rule 1: Repeated Digits
    const uniqueDigits = new Set(val.split('')).size;
    if (uniqueDigits === 1 && val.length > 1) {
      if(showError) {
        playWizardDialogue(["“A single repeated digit? Pathetic!”"], 'angry', () => {
            orbAttempts = 0;
            input.value = ""; // Clear for troll reset
            playSystemOverlay(["You cant have one number code lol, wasnt that obvious?"]);
        });
      }
      isOrbValid = false;
      updateButtonState();
      return false;
    }

    // Rule 2: 11 Digits
    if (/^\d{11}$/.test(val)) {
      isOrbValid = true;
      updateButtonState();
      return true;
    } else {
      isOrbValid = false;
      updateButtonState();
      
      if(showError) {
        orbAttempts++;
        if (orbAttempts < 3) {
            playWizardDialogue(["“It must be exactly 11 digits!”"], 'angry');
            // ✨ FIX: Do NOT clear input here. Let them fix the number.
        } else {
            playWizardDialogue(["“Why do you struggle so much?”"], 'sus', () => {
                playSystemOverlay(["Oh yeah I forgot to tell you that the confirmation is the reverse of your orb number"]);
            });
            input.value = ""; // Clear only on 3rd fail
        }
      }
      return false;
    }
  }

  // D. Check Confirm Orb (Reverse)
  function validateConfirmOrb(showError = true) {
    const orbVal = document.getElementById("ORB").value.trim();
    const confirmVal = document.getElementById("CON-ORB").value.trim();
    const input = document.getElementById("CON-ORB");

    if (!confirmVal) {
        isOrbConfirmed = false;
        updateButtonState();
        if(showError) playWizardDialogue(["“Confirm your Orb Number first!”"], 'angry');
        return false;
    }

    const reversedOrb = orbVal.split('').reverse().join('');

    if (confirmVal === reversedOrb) {
        isOrbConfirmed = true;
        updateButtonState(); // This will finally unlock the button!
        return true;
    } else {
        isOrbConfirmed = false;
        updateButtonState();

        if (showError) {
            confirmOrbAttempts++;
            input.value = ""; // Clear input to annoy them

            if (confirmOrbAttempts === 1) {
                playWizardDialogue(["“Ohh... is it hard because it was bullets?”", "“Or you just don't know how to do it?”"], 'sus');
            } else if (confirmOrbAttempts === 2) {
                playWizardDialogue(["“Is it really that hard?”"], 'sus');
            } else if (confirmOrbAttempts === 3) {
                playWizardDialogue(["“Oh come on, SERIOUSLY?!”"], 'angry', () => {
                    playSystemOverlay(["It should be the reverse of his number."]);
                });
            } else {
                playSystemOverlay(["Oh can you be better?", `Your orb confirmation should be: ${reversedOrb}`]);
            }
        }
        return false;
    }
  }


  // ==========================================
  //  2. STRICT CLICK LOCKING
  // ==========================================

  document.getElementById("CONFIRME-MESS").addEventListener("focus", function() {
    // Only block if prev step is invalid (don't show error dialogue again on focus, blur handled it)
    if (!validateGmess(false)) this.blur(); 
  });

  document.getElementById("ORB").addEventListener("focus", function() {
    if (!validateConfirmGmess(false)) this.blur();
  });

  document.getElementById("CON-ORB").addEventListener("focus", function() {
    if (!validateOrb(false)) this.blur();
  });


  // ==========================================
  //  3. LISTENERS
  // ==========================================
  
  // Validation on Blur (Leaving the field)
  document.getElementById("eMess").addEventListener("blur", () => validateGmess(true));
  document.getElementById("CONFIRME-MESS").addEventListener("blur", () => validateConfirmGmess(true));
  document.getElementById("ORB").addEventListener("blur", () => validateOrb(true));
  document.getElementById("CON-ORB").addEventListener("blur", () => validateConfirmOrb(true));
  
  // Real-time check to light up button
  document.getElementById("CON-ORB").addEventListener("input", () => validateConfirmOrb(false));


  // ==========================================
  //  4. SUBMIT LOGIC
  // ==========================================
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const orb = document.getElementById("ORB").value.trim();
    const conOrb = document.getElementById("CON-ORB").value.trim();
    
    // Double Check
    const reversedOrb = orb.split('').reverse().join('');

    if (conOrb === reversedOrb) {
        // ✅ SUCCESS
        playWizardDialogue([
           "“Hmm...”",
           "“I thought you didn't know the standard on confirming the orb.”",
           "“You may pass.”"
        ], 'sus', () => {
            playSystemOverlay([
                "Oh that was too close, be careful of being caught."
            ], () => {
                window.location.href = "../pages/twoLevel.html";
            });
        });
    }
  });
  
  // Intro
  playSystemOverlay(["Level One: Orb Connections.", "Do not mess up your G-MESS registration."]);

});