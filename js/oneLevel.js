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
  // 1. Enable AutoSave
  enableAutoSave(["eMess", "CONFIRME-MESS", "ORB", "CON-ORB"]);

  const form = document.getElementById("academyForm");
  
  // Overlay Elements
  const overlay = document.getElementById("dialogue-overlay");
  const overlayText = document.getElementById("dialogue-text-enroll");

  // Trackers
  let gmessAttempts = 0;
  let orbAttempts = 0;
  let conOrbAttempts = 0;
  
  // State Flags
  let isGmessValid = false;
  let isGmessConfirmed = false;
  let isOrbValid = false;

  // --- SYSTEM OVERLAY FUNCTION ---
  function playSystemOverlay(lines, onComplete) {
    let currentIndex = 0;
    overlay.classList.remove("hidden");
    
    function updateText() {
      overlayText.textContent = "(System): " + lines[currentIndex];
    }

    function advance() {
      currentIndex++;
      if (currentIndex < lines.length) {
        updateText();
      } else {
        overlay.classList.add("hidden");
        overlay.removeEventListener("click", advance);
        if (onComplete) onComplete();
      }
    }

    updateText();
    overlay.addEventListener("click", advance);
  }

  // ==========================================
  //  1. INTRO
  // ==========================================
  playSystemOverlay([
    "Level One: Orb Connections.",
    "Do not mess up your G-MESS registration."
  ]);

  // ==========================================
  //  2. SEQUENTIAL VALIDATION (Focus Logic)
  // ==========================================
  
  // --- A. CHECK G-MESS (Triggered when user clicks 'CONFIRM G-MESS') ---
  document.getElementById("CONFIRME-MESS").addEventListener("focus", function() {
    const input = document.getElementById("eMess");
    const val = input.value.trim().toLowerCase();
    const pattern = /^[a-z]+[a-z]+@gmess\.orb$/;

    // If already valid, do nothing
    if (isGmessValid) return;

    if (!val) {
        playWizardDialogue(["“Fill the G-Mess first!”"], 'angry');
        input.focus(); // Kick back to previous input
        return;
    }

    if (pattern.test(val)) {
      isGmessValid = true; 
    } else {
      isGmessValid = false;
      input.focus(); // Kick back
      
      gmessAttempts++;
      if (gmessAttempts < 3) {
        playWizardDialogue(["“That is NOT a valid G-Mess format!”"], 'angry');
      } else {
        playWizardDialogue(["“Are you even trying?!”"], 'angry', () => {
             playSystemOverlay(["Just add @gmess.orb like how gmail works in your world lol"]);
        });
      }
    }
  });

  // --- B. CHECK CONFIRMATION (Triggered when user clicks 'ORB') ---
  document.getElementById("ORB").addEventListener("focus", function() {
    // 1. Ensure Step A is done
    if (!isGmessValid) {
        document.getElementById("eMess").focus();
        return;
    }

    const original = document.getElementById("eMess").value.trim().toLowerCase();
    const confirm = document.getElementById("CONFIRME-MESS").value.trim().toLowerCase();

    if (isGmessConfirmed) return;

    if (confirm && confirm === original) {
        isGmessConfirmed = true;
    } else {
        playWizardDialogue(["“They don't match! Can you not read?”"], 'angry');
        document.getElementById("CONFIRME-MESS").focus(); // Kick back
    }
  });

  // --- C. CHECK ORB NUMBER (Triggered when user clicks 'CONFIRM ORB') ---
  // This implements your specific logic request
  document.getElementById("CON-ORB").addEventListener("focus", function() {
     // 1. Ensure Step B is done
     if (!isGmessConfirmed) {
        document.getElementById("CONFIRME-MESS").focus();
        return;
     }

     validateOrb(true);
  });

  function validateOrb(showError) {
      const input = document.getElementById("ORB");
      const val = input.value.trim();
      
      // Success Check
      if (val && /^\d{11}$/.test(val)) {
          isOrbValid = true;
          return true;
      }
      
      // Failure Logic
      isOrbValid = false;
      input.focus(); // Kick back to ORB input

      if (showError) {
          orbAttempts++;
          if (orbAttempts < 3) {
              // 1st & 2nd Try: Angry, NO CLEAR
              playWizardDialogue([
                  "“Don you know how orb number works?”", 
                  "“Seriosly??”"
              ], 'angry');
          } else {
              // 3rd Try: Sus -> System Reveal -> CLEAR
              playWizardDialogue(["“Why do you struggle so much?”"], 'sus', () => {
                  playSystemOverlay(["Oh yeah I forgot to tell you that the orb number sould consist of 11 digits."]);
              });
          }
      }
      return false;
  }

  // ==========================================
  //  4. SUBMIT LOGIC (Checks Final Input)
  // ==========================================
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // 1. If user clicked button too early, trigger the validation chain
    if (!isGmessValid) { document.getElementById("eMess").focus(); return; }
    if (!isGmessConfirmed) { document.getElementById("CONFIRME-MESS").focus(); return; }
    if (!isOrbValid) { validateOrb(true); return; }

    // 2. Validate Final Step (Confirm Orb)
    const orb = document.getElementById("ORB").value.trim();
    const conOrb = document.getElementById("CON-ORB").value.trim();
    const reversedOrb = orb.split('').reverse().join('');

    // ✨ UPDATED: Progressive Failure Logic
    if (conOrb !== reversedOrb) {
      conOrbAttempts++; // Increment failure count

      if (conOrbAttempts === 1) {
        // --- 1st Fail: Cryptic Hint ---
        playWizardDialogue(["“The confirmation seal is broken!”"], 'angry', () => {
             // System Quote 1 (The Mirror)
             playSystemOverlay(["Have you not heard of the mirror? The old man says reflection!"]);
        });
      } else {
        // --- 2nd+ Fail: Obvious Answer ---
        playWizardDialogue(["“Did you not listen to the laws of reflection?!”"], 'angry', () => {
             // System Quote 2 (The Give Away)
             playSystemOverlay(["Oh come on, it was the reverse version of your orb number."]);
        });
      }
      return;
    }

    // 3. SUCCESS
    const puzzleNum = Math.floor((2 * parseInt(orb)) / 3 - 99999999999).toString().slice(0,11);
    
    playWizardDialogue([
      "“Math is the truest magic!”"
    ], 'calm');

    setTimeout(() => {
      window.location.href = "../pages/twoLevel.html";
    }, 5000); 
  });
});