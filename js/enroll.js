document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("academyForm");
  const wizard = document.getElementById("wizard");
  const dialogue = document.getElementById("wizard-dialogue");

  let nameTalked = false;
  let addressTalked = false;
  let addressConverted = false;

  const firstNameInput = document.getElementById("mageName");
  const lastNameInput = document.getElementById("codeSpell");
  let addressInput = document.getElementById("homeAddress");

  let dialogueQueue = [];

  function showWizardDialogue(lines) {
    if (!Array.isArray(lines)) lines = [lines];
    dialogueQueue = [...lines];
    showNextDialogue();
  }

  function showNextDialogue() {
    if (dialogueQueue.length === 0) {
      dialogue.style.display = "none";
      wizard.src = "../src/wizard.png";
      wizard.classList.remove("talking");
      return;
    }

    const nextLine = dialogueQueue.shift();
    wizard.src = "../src/evil-laugh-wizard-talk.png";
    wizard.classList.add("talking");
    dialogue.textContent = nextLine;
    dialogue.style.display = "block";

    // If this was the last line of the address dialogue, convert input
    if (!addressConverted && addressTalked && dialogueQueue.length === 0) {
      transformAddressToDropdown();
      addressConverted = true;
    }
  }

  wizard.addEventListener("click", showNextDialogue);

  function checkNameDialogue() {
    if (nameTalked) return;
    const first = firstNameInput.value.trim();
    const last = lastNameInput.value.trim();
    if (first !== "" && last !== "") {
      nameTalked = true;
      showWizardDialogue([
        `“${first} ${last}? I’ve seen countless impostors using that name.”`,
        "At least pretend you belong to this realm."
      ]);
    }
  }

  function transformAddressToDropdown() {
    const oldInput = addressInput;
    const select = document.createElement("select");
    select.id = "homeAddress";
    select.className = oldInput.className;

    const defaultOption = document.createElement("option");
    defaultOption.text = "CHOOSE YOUR REALM OF ORIGIN";
    defaultOption.disabled = true; // cannot submit
    defaultOption.selected = true;
    select.add(defaultOption);

    const wizardCities = [
      "Eldoria",
      "Stormspire",
      "Mistvale",
      "Ravenhold",
      "Arcanum Reach",
      "Frostgarde",
      "Sunfire Haven",
      "Grimwood Hollow",
      "Astral Dune Citadel"
    ];

    wizardCities.forEach(c => {
      const option = document.createElement("option");
      option.value = c;
      option.text = c;
      select.add(option);
    });

    oldInput.replaceWith(select);
    addressInput = select; // update reference
  }

  function checkAddressDialogue() {
    if (addressTalked) return;
    const address = addressInput.value.trim();
    if (address !== "") {
      addressTalked = true;
      showWizardDialogue([
        `“${address}? So vague! Is that a real place, or a story you made up?”`,
        "You don’t even know the land you stand on, do you?",
        "Fine… I’ll help you pick"
      ]);
    }
  }

  firstNameInput.addEventListener("blur", checkNameDialogue);
  lastNameInput.addEventListener("blur", checkNameDialogue);
  addressInput.addEventListener("blur", checkAddressDialogue);

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const first = firstNameInput.value.trim();
    const last = lastNameInput.value.trim();
    const address = addressInput.value;

    if (!first || !last || address === "CHOOSE YOUR REALM OF ORIGIN" || !address ) {
        showWizardDialogue("⚠️ NO  FOOL! ALL THE FIELDS MUST BE FILLED!");
        return;
    }

    window.location.href = "../pages/oneLevel.html";
  });

});
