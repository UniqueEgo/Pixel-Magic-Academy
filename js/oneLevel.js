document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("academyForm");
  const wizard = document.getElementById ("wizard");
  const dialogue = document.getElementById ("wizard-dialogue");


  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const eMess = document.getElementById("eMess").value.trim();
    const confirmEMess = document.getElementById("CONFIRME-MESS").value.trim();
    const orb = document.getElementById("ORB").value.trim();
    const conOrb= document.getElementById("CON-ORB").value.trim();
  
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

    window.location.href = "../pages/twoLevel.html";
  });

  function showWizardDialogue(message) {
    wizard.src = "../src/evil-laugh-wizard-talk.png";
    wizard.classList.add("talking");

    dialogue.textContent = message;
    dialogue.style.display = "block";

    setTimeout(()=>
    {
      dialogue.style.display = "none";
      wizard.src = "../src/wizard.png";
      wizard.classList.remove("talking");
    }, 3000);
  }
});
