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
  const overlay = document.getElementById("dialogue-overlay");
  const overlayText = document.getElementById("dialogue-text-enroll");

  // Trackers
  let gmessAttempts = 0;
  let orbAttempts = 0;
  let confirmOrbAttempts = 0; // Tracks failures on the final step
  
  // State Flags
  let isGmessValid = false;
  let isGmessConfirmed = false;
  let isOrbValid = false;

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
        return false;
    }

    if (pattern.test(val)) {
      isGmessValid = true;
      return true;
    } else {
      isGmessValid = false;
      if (showError) {
        gmessAttempts++;
        if (gmessAttempts < 3) {
            playWizardDialogue(["“That is NOT a valid G-Mess!”"], 'angry');
            input.value = "";
        } else {
            playWizardDialogue(["“You are testing my patience!”"], 'angry', () => {
                playSystemOverlay(["Just add @gmess.orb like how gmail works in your world works lol"]);
            });
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
        return false;
    }

    if (confirm === original) {
        isGmessConfirmed = true;
        return true;
    } else {
        if(showError) {
            playWizardDialogue(["“They don't match! Confirm it properly!”"], 'angry');
            document.getElementById("CONFIRME-MESS").value = "";
        }
        isGmessConfirmed = false;
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
        return false;
    }

    const uniqueDigits = new Set(val.split('')).size;
    if (uniqueDigits === 1 && val.length > 1) {
      if(showError) {
        playWizardDialogue(["“A single repeated digit? Pathetic!”"], 'angry', () => {
            orbAttempts = 0;
            input.value = "";
            playSystemOverlay(["You cant have one number code lol, wasnt that obvious?"]);
        });
      }
      isOrbValid = false;
      return false;
    }

    if (/^\d{11}$/.test(val)) {
      isOrbValid = true;
      return true;
    } else {
      isOrbValid = false;
      if(showError) {
        orbAttempts++;
        if (orbAttempts < 3) {
            playWizardDialogue(["“It must be exactly 11 digits!”"], 'angry');
        } else {
            playWizardDialogue(["“Why do you struggle so much?”"], 'sus', () => {
                playSystemOverlay(["Oh yeah I forgot to tell you that the confirmation is the reverse of your orb number"]);
            });
        }
        input.value = "";
      }
      return false;
    }
  }


  // ==========================================
  //  2. STRICT CLICK LOCKING
  // ==========================================

  // 1. User clicks "CONFIRM G-MESS"
  document.getElementById("CONFIRME-MESS").addEventListener("focus", function() {
    if (!validateGmess(true)) this.blur(); 
  });

  // 2. User clicks "ORB NUMBER"
  document.getElementById("ORB").addEventListener("focus", function() {
    if (!validateConfirmGmess(true)) this.blur();
  });

  // 3. User clicks "CONFIRM ORB"
  document.getElementById("CON-ORB").addEventListener("focus", function() {
    if (!validateOrb(true)) {
        this.blur();
    } else {
        // ✨ NEW: Unlock the button immediately when they reach the last step!
        submitBtn.disabled = false;
        submitBtn.innerText = "⭐ STEP UP!!! ⭐";
    }
  });


  // ==========================================
  //  3. LISTENERS
  // ==========================================
  
  // Validate fields when leaving them
  document.getElementById("eMess").addEventListener("blur", () => validateGmess(false));
  document.getElementById("CONFIRME-MESS").addEventListener("blur", () => validateConfirmGmess(true));
  document.getElementById("ORB").addEventListener("blur", () => validateOrb(true));


  // ==========================================
  //  4. SUBMIT LOGIC (The Main Game)
  // ==========================================
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // 1. Basic Empty Check (Shouldn't trigger often due to locking, but good safety)
    const orb = document.getElementById("ORB").value.trim();
    const conOrb = document.getElementById("CON-ORB").value.trim();
    
    // ✨ Scenario A: Clicked Submit but Confirm Orb is Empty
    if (conOrb === "") {
        playWizardDialogue([
            "“Tired already?”", 
            "“Confirm it first.”"
        ], 'calm');
        return;
    }

    // 2. Reverse Check
    const reversedOrb = orb.split('').reverse().join('');
    const input = document.getElementById("CON-ORB");

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

    } else {
        // ❌ FAIL SEQUENCE (3 Tries)
        confirmOrbAttempts++;
        input.value = ""; // Clear bad input

        if (confirmOrbAttempts === 1) {
            playWizardDialogue([
                "“Ohh... is it hard because it was bullets?”",
                "“Or you just don't know how to do it?”"
            ], 'sus');
        } 
        else if (confirmOrbAttempts === 2) {
            playWizardDialogue([
                "“Is it really that hard?”"
            ], 'sus');
        } 
        else if (confirmOrbAttempts === 3) {
            playWizardDialogue([
                "“Oh come on, SERIOUSLY?!”"
            ], 'angry', () => {
                playSystemOverlay(["It should be the reverse of his number."]);
            });
        } 
        else {
            // 4th+ Try (Give Answer)
            playSystemOverlay([
               "Oh can you be better?",
               `Your orb confirmation should be: ${reversedOrb}`
            ]);
        }
    }
  });
  
  // Intro
  playSystemOverlay(["Level One: Orb Connections.", "Do not mess up your G-MESS registration."]);

});