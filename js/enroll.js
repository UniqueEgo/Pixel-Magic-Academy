// Function definition
function enableAutoSave(fieldIds) {
  fieldIds.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    const savedValue = sessionStorage.getItem(id);
    if (savedValue) {
      input.value = savedValue;
    }

    input.addEventListener("input", () => {
      sessionStorage.setItem(id, input.value);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Enable AutoSave
  enableAutoSave(["mageName", "codeSpell"]); 

  const form = document.getElementById("academyForm");
  
  // Overlay Elements
  const overlay = document.getElementById("dialogue-overlay");
  const overlayText = document.getElementById("dialogue-text-enroll");

  // Trackers
  let nameTalked = false;
  let addressAttempts = 0; 
  let addressConverted = false; 

  // Inputs
  const firstNameInput = document.getElementById("mageName");
  const lastNameInput = document.getElementById("codeSpell");

  // --- BLOCK PASTING (Anti-Cheat) ---
  lastNameInput.addEventListener("paste", function(e) {
      e.preventDefault();
      playWizardDialogue(["“Type it yourself! Magic requires effort!”"], 'angry');
  });

  const wizardCities = [
    "Eldoria", "Stormspire", "Mistvale", "Ravenhold",
    "Arcanum Reach", "Frostgarde", "Sunfire Haven",
    "Grimwood Hollow", "Astral Dune Citadel"
  ];

  // --- 1. NAME CHECK (Calm) ---
  function checkNameDialogue() {
    if (nameTalked) return;
    const first = firstNameInput.value.trim();
    const last = lastNameInput.value.trim();
    
    if (first !== "" && last !== "") {
      nameTalked = true;
      playWizardDialogue([
        `“${first} ${last}? I’ve seen countless impostors using that name.”`,
        "At least pretend you belong to this realm."
      ], 'calm');
    }
  }

  // --- 2. ADDRESS TRANSFORMATION ---
  function transformAddressToDropdown() {
    const currentInput = document.getElementById("homeAddress");
    if (!currentInput) return;

    const select = document.createElement("select");
    select.id = "homeAddress";
    select.className = currentInput.className;

    const defaultOption = document.createElement("option");
    defaultOption.text = "⬇️ SELECT YOUR REALM ⬇️";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.add(defaultOption);

    wizardCities.forEach(c => {
      const option = document.createElement("option");
      option.value = c;
      option.text = c;
      select.add(option);
    });

    currentInput.replaceWith(select);
    addressConverted = true; 
  }

  // --- 3. SYSTEM OVERLAY (Narrator) ---
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

  // --- LISTENERS ---
  firstNameInput.addEventListener("blur", checkNameDialogue);
  lastNameInput.addEventListener("blur", checkNameDialogue);


  // --- SUBMIT LOGIC ---
  form.addEventListener("submit", function(e) {
    e.preventDefault(); 

    const first = firstNameInput.value.trim();
    const last = lastNameInput.value.trim();
    const currentAddressInput = document.getElementById("homeAddress");
    const address = currentAddressInput.value.trim(); 

    // 1. EMPTY FIELDS -> ANGRY
    if (!first || !last || !address || address === "⬇️ SELECT YOUR REALM ⬇️") {
        playWizardDialogue([
          "⚠️ FILL ALL THE FIELDS, FOOL!",
          "Do not waste my time!"
        ], 'angry');
        return;
    }

    // ✨ FIX: Case Insensitive Check (Eldoria == eldoria)
    const isValidCity = wizardCities.some(city => city.toLowerCase() === address.toLowerCase());

    if (isValidCity) {
        // Safe Save before leaving
        sessionStorage.setItem("mageName", first);
        sessionStorage.setItem("codeSpell", last);

        // ✅ SUCCESS
        playSystemOverlay(
            ["Don't make yourself so obvious..."], 
            () => {
                window.location.href = "../pages/oneLevel.html";
            }
        );

    } else {
        // ❌ FAIL LOGIC
        addressAttempts++;

        if (addressAttempts === 1) {
            playWizardDialogue([
              `“${address}? Never heard of it. Try again.”`
            ], 'calm');
            if(currentAddressInput.tagName === "INPUT") currentAddressInput.value = ""; 
        } 
        else if (addressAttempts === 2) {
            playWizardDialogue([
              "“Are you just making up words? ONE LAST CHANCE.”"
            ], 'calm');
            if(currentAddressInput.tagName === "INPUT") currentAddressInput.value = ""; 
        } 
        else if (addressAttempts >= 3) {
            // ✨ 3. SEQUENCE TRIGGER ✨
            playWizardDialogue([
                "“Enough! You are clearly lost!”", 
                "Wait, are you really from here?!"
            ], 'angry', () => {
                playSystemOverlay([
                    "Oh come on, here let me help you."
                ], () => {
                    transformAddressToDropdown();
                });
            });
        }
    }
  });

});