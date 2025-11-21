document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("academyForm");
  const wizard = document.getElementById("wizard");
  const dialogue = document.getElementById("wizard-dialogue");

  let dialogueQueue = [];
  let orbAttempts = 0;

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
  }

  wizard.addEventListener("click", showNextDialogue);

  // ---- E-MESS Validation ----
  function validateEMess() {
    const eMess = document.getElementById("eMess").value.trim().toLowerCase();
    const pattern = /^[a-z]+[a-z]+@gmess\.orb$/;
    if (eMess && !pattern.test(eMess)) {
      document.getElementById("eMess").value = "";
      showWizardDialogue("“Oops! Wrong portal seal. This isn’t Gmail, fool, it’s Gmess.”");
    }
  }

  // ---- Confirm E-MESS Validation ----
  function validateConfirmEMess() {
    const eMess = document.getElementById("eMess").value.trim().toLowerCase();
    const confirmEMess = document.getElementById("CONFIRME-MESS").value.trim().toLowerCase();
    if (confirmEMess && confirmEMess !== eMess) {
      showWizardDialogue("“Lost already? Fine… just copy your first one 🙃”");
    }
  }

  // ---- ORB Number Validation ----
  function validateOrb() {
    const orb = document.getElementById("ORB").value.trim();
    if (orb && !/^\d{11}$/.test(orb)) {
      orbAttempts++;
      if (orbAttempts >= 3) {
        showWizardDialogue("“Try putting 11 digits, fool! Even ogres can count better.”");
      } else {
        showWizardDialogue("“The orb number must be exactly 11 digits!”");
      }
    }
  }

  // ---- Confirm ORB Validation ----
  function validateConfirmOrb() {
    const orb = document.getElementById("ORB").value.trim();
    const conOrb = document.getElementById("CON-ORB").value.trim();
    if (conOrb && conOrb !== orb) {
      showWizardDialogue("“Your orb numbers do not match, mortal!”");
    }
  }

  // ---- Event Listeners ----
  document.getElementById("eMess").addEventListener("blur", validateEMess);
  document.getElementById("CONFIRME-MESS").addEventListener("blur", validateConfirmEMess);
  document.getElementById("ORB").addEventListener("blur", validateOrb);
  document.getElementById("CON-ORB").addEventListener("blur", validateConfirmOrb);

  // ---- Form Submission ----
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const eMess = document.getElementById("eMess").value.trim();
    const confirmEMess = document.getElementById("CONFIRME-MESS").value.trim();
    const orb = document.getElementById("ORB").value.trim();
    const conOrb = document.getElementById("CON-ORB").value.trim();

    if (!eMess || !confirmEMess || !orb || !conOrb) {
      showWizardDialogue("⚠️ YOU CANNOT PASS! FILL ALL THE FIELDS!");
      return;
    }

    if (eMess !== confirmEMess) {
      showWizardDialogue("✉️ YOUR E-MESS DOES NOT MATCH, YOU FOOL!");
      return;
    }

    if (orb !== conOrb) {
      showWizardDialogue("🌀 YOUR ORB NUMBERS DO NOT MATCH!");
      return;
    }

    const puzzleNum = Math.floor((2 * parseInt(orb)) / 3 - 99999999999).toString().slice(0,11);
    showWizardDialogue([
      "“Math is the truest magic! Or just smash your abacus 🔢”",
      `“The magical solution of the orb puzzle is: ${puzzleNum}”`
    ]);

    setTimeout(() => {
      window.location.href = "../pages/twoLevel.html";
    }, 1000);
  });

});
