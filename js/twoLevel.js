document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("academyForm");
  const wizard = document.getElementById("wizard");
  const dialogue = document.getElementById("wizard-dialogue");

  let dialogueQueue = [];

  function showWizardDialogue(lines) {
    if (!Array.isArray(lines)) lines = [lines];
    dialogueQueue = [...lines];
    showNextDialogue();
  }

  function showNextDialogue() {
    if (dialogueQueue.length === 0) {
      dialogue.style.display = "none";
      wizard.src = "/src/wizard.png";
      wizard.classList.remove("talking");
      return;
    }
    const nextLine = dialogueQueue.shift();
    wizard.src = "/src/evil-laugh-wizard-talk.png";
    wizard.classList.add("talking");
    dialogue.textContent = nextLine;
    dialogue.style.display = "block";
  }

  wizard.addEventListener("click", showNextDialogue);

  // ---- Mage Name Validation ----
  function validateMageName() {
    const name = document.getElementById("mageName").value.trim();
    if (name.length > 6) showWizardDialogue("“Too long! Are you writing your life story?”");
  }

  // ---- Code Spell Validation ----
  function validateCodeSpell() {
    const code = document.getElementById("codeSpell").value.trim().toUpperCase();
    const heroName = document.getElementById("mageName").value.trim().toUpperCase();
    const specialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    let hints = [];
    if (code.length < 15) hints.push("“Your secret is weak! Even a goblin could guess it.”");
    if (/0/.test(code)) hints.push("“No zeros allowed, mortal!”");
    if (/[AEIOU]/.test(code)) hints.push("“Vowels weaken the spell!”");
    if (!specialCharPattern.test(code)) hints.push("“Where is your magical character?”");
    if (code[6] !== "O") hints.push("“7th character must be 'O'!”");
    if (code[12] !== "Y") hints.push("“13th character must be 'y'!”");
    if (!code.includes(heroName)) hints.push("“Include your hero name in the spell!”");

    if (hints.length > 0) showWizardDialogue(hints);
  }

  function validateConfirmCodeSpell() {
    const code = document.getElementById("codeSpell").value.trim();
    const confirm = document.getElementById("confirmCodeSpell").value.trim();
    if (confirm && confirm !== code) showWizardDialogue("“Heh. No peeking, outsider.”");
  }

  // ---- Disable copy/paste on code spell inputs ----
  const codeInputs = [document.getElementById("codeSpell"), document.getElementById("confirmCodeSpell")];
  codeInputs.forEach(input => {
    input.type = "password";
    input.addEventListener("copy", e => { e.preventDefault(); showWizardDialogue("“Cheater! Magic cannot be copied.”"); });
    input.addEventListener("paste", e => { e.preventDefault(); showWizardDialogue("“Try harder! Spells cannot be pasted.”"); });
  });

  document.getElementById("mageName").addEventListener("blur", validateMageName);
  document.getElementById("codeSpell").addEventListener("blur", validateCodeSpell);
  document.getElementById("confirmCodeSpell").addEventListener("blur", validateConfirmCodeSpell);

  // ---- Form Submission ----
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const mageName = document.getElementById("mageName").value.trim();
    const codeSpell = document.getElementById("codeSpell").value.trim();
    const confirmCodeSpell = document.getElementById("confirmCodeSpell").value.trim();

    if (!mageName || !codeSpell || !confirmCodeSpell) {
      showWizardDialogue("⚠️ FILL ALL FIELDS OR FACE THE CONSEQUENCES!");
      return;
    }

    if (codeSpell !== confirmCodeSpell) {
      showWizardDialogue("🔮 CODE SPELLS DO NOT MATCH!");
      return;
    }

    showWizardDialogue([
      "✨ Your spell is accepted!",
      `Welcome, ${mageName}, to the Academy of True Magic!`
    ]);

    setTimeout(() => {
      window.location.href = "../pages/thirdLevel.html";
    }, 1500);
  });
});
