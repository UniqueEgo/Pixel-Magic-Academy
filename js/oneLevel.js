document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("academyForm");
  const wizardNormal = document.querySelector(".wizard.normal");
  const wizardTalking = document.querySelector(".wizard.talking");
  const dialogue = document.getElementById("wizard-dialogue");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); 
    
    const first = document.getElementById("mageName").value.trim();
    const last = document.getElementById("codeSpell").value.trim();
    const address = document.getElementById("homeAddress").value.trim();

    if (!first || !last || !address) {
      showWizardDialogue("⚠️ NO YOU FOOL! ALL THE FIELDS MUST BE FILLED!");
      return;
    }

    alert(`✨ Welcome, ${first} ${last} of ${address}! Proceeding...`);
  });

function showWizardDialogue(message) {
  const wizard = document.getElementById("wizard");
  wizard.src = "/src/evil-laugh-wizard-talk.png"; 
  wizard.classList.add("talking");

  dialogue.textContent = message;
  dialogue.style.display = "block";

  setTimeout(() => {
    dialogue.style.display = "none";
    wizard.src = "/src/wizard.png"; 
    wizard.classList.remove("talking");
  }, 3000);
}
});

  const twoLevelBtn = document.getElementById("enrollBtn");
  if (twoLevelBtn) {
    enrollBtn.addEventListener("click", function () {
      window.location.href = "pages/enroll.html";
    });
  }
