// Simple interactivity
document.getElementById("academyForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("mageName").value.trim();
  const spell = document.getElementById("codeSpell").value.trim();

  if (name && spell) {
    alert(`✨ Welcome, Mage ${name}! Your spell "${spell}" is ready!`);
  } else {
    alert("Please enter both your name and your spell.");
  }
});

  const enrollBtn = document.getElementById("enrollBtn");
  if (enrollBtn) {
    enrollBtn.addEventListener("click", function () {
      window.location.href = "pages/enroll.html";
    });
  }
