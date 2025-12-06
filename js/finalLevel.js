document.addEventListener("DOMContentLoaded", () => {
  
  // --- DATA: QUESTIONS ---
  const questions = [
    {
      q: "What is the 143rd decimal digit of Pi?", 
      a: ["5"], 
      correct: "You memorized THAT? Did you swallow a calculator?!",
      wrong: "Wrong! It is not that number... I asked for the 143rd decimal!"
    },
    {
      q: "In Morse code, what is 'wizard'?",
      a: [".-- .. --.. .- .-. -.."], 
      correct: "Dot dash dot dash… wow, did you beep your way here? Suspicious.",
      wrong: "Wrong! Beep boop? No. Even pigeons communicate better."
    },
    {
      q: "Which country has code +692?",
      a: ["MARSHALL ISLANDS", "MARSHALL ISLAND"],
      correct: "Marshall Islands? What are you, a walking phone book?",
      wrong: "Wrong! That code does not connect where you think."
    },
    {
      q: "ASCII value of '@'?",
      a: ["64"],
      correct: "64… impressive. Are you an ancient coder?",
      wrong: "Wrong! You clearly don't speak machine."
    },
    {
      q: "Rarest blood type?",
      a: ["RH NULL", "RH-NULL", "GOLDEN BLOOD", "RHNULL"], 
      correct: "Rh Null… also known as Golden Blood. Are you a vampire?",
      wrong: "Wrong! That is common peasant blood. I asked for the RAREST!"
    },
    {
      q: "How many bones in a giraffe’s neck?",
      a: ["7", "SEVEN"],
      correct: "7 bones! Same as humans… mind blown.",
      wrong: "Wrong! It's not a dragon or a snake. It is surprisingly few."
    },
    {
      q: "What year was JavaScript first created?",
      a: ["1995"],
      correct: "1995… ah yes, the cursed year mortals invented bugs.",
      wrong: "Wrong! Back to HTML tables with you!"
    },
    {
      q: "Atomic number 118?",
      a: ["OGANESSON", "OG"],
      correct: "Oganesson… even chemists have to Google that. You suspiciously know too much.",
      wrong: "Wrong! Stick to oxygen, that’s all you can handle."
    },
    {
      q: "Square root of 123456789 (3 decimals)?",
      a: ["11111.111", "11,111.111"], 
      correct: "11111.111… wow, did your brain overheat?!",
      wrong: "LOL! That’s not even close. Numbers are your enemy."
    },
    {
      q: "First video on YouTube?",
      a: ["ME AT THE ZOO"],
      correct: "Me at the zoo, 2005. So you WERE there. Time traveler?!",
      wrong: "Nope! Back to TikTok, kid."
    }
  ];

  // --- STATE ---
  let currentQIndex = 0;
  let score = 0;

  // --- ELEMENTS ---
  const container = document.getElementById("quiz-container");
  const resultContainer = document.getElementById("result-container");
  const questionText = document.getElementById("question-text");
  const counterText = document.getElementById("question-counter");
  const input = document.getElementById("answer-input");
  const nextBtn = document.getElementById("next-btn");
  
  const overlay = document.getElementById("dialogue-overlay");
  const overlayText = document.getElementById("dialogue-text-final");

  // --- SYSTEM OVERLAY ---
  function playSystemOverlay(lines, onComplete) {
    let currentIndex = 0;
    overlay.classList.remove("hidden");
    
    // Ensure we don't have leftover buttons
    const box = document.getElementById("dialogue-box");
    const oldBtns = box.querySelector(".choice-container");
    if(oldBtns) oldBtns.remove();

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

  // --- CUSTOM CHOICE OVERLAY ---
  function askSystemChoice(question, onYes, onNo) {
    overlay.classList.remove("hidden");
    
    const freshBox = document.getElementById("dialogue-box");
    const freshText = document.getElementById("dialogue-text-final");

    freshText.textContent = `(System): ${question}`;

    const btnContainer = document.createElement("div");
    btnContainer.className = "choice-container";

    const yesBtn = document.createElement("button");
    yesBtn.innerText = "YES";
    yesBtn.className = "choice-btn";
    
    const noBtn = document.createElement("button");
    noBtn.innerText = "NO";
    noBtn.className = "choice-btn";

    btnContainer.appendChild(yesBtn);
    btnContainer.appendChild(noBtn);
    
    // Remove old buttons if they exist to prevent duplicates
    const oldBtns = freshBox.querySelector(".choice-container");
    if(oldBtns) oldBtns.remove();
    
    freshBox.appendChild(btnContainer);

    yesBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      btnContainer.remove();
      onYes();
    });

    noBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      btnContainer.remove();
      onNo();
    });
  }

  // --- LOAD QUESTION ---
  function loadQuestion() {
    const q = questions[currentQIndex];
    questionText.textContent = q.q;
    counterText.textContent = `Question ${currentQIndex + 1} / ${questions.length}`;
    input.value = "";
    
    if (currentQIndex === questions.length - 1) {
        nextBtn.innerText = "SUBMIT & FINISH";
    }
  }

  // --- HANDLE ANSWER ---
  nextBtn.addEventListener("click", () => {
    // Check Case Insensitive
    const userVal = input.value.trim().toUpperCase();
    const currentQ = questions[currentQIndex];
    
    // Check Answer
    let isCorrect = currentQ.a.includes(userVal);
    
    if (isCorrect) {
        score++;
        playWizardDialogue([currentQ.correct], 'sus'); 
    } else {
        playWizardDialogue([currentQ.wrong], 'angry'); 
    }

    currentQIndex++;
    if (currentQIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
  });

  // --- SHOW RESULTS ---
  function showResults() {
    container.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    
    const scoreText = document.getElementById("final-score-text");
    
    scoreText.textContent = `You scored: ${score} / 10`;

    let feedbackLines = [];
    if (score === 0) {
        feedbackLines = ["Roasted! You got NOTHING right.", "Even trolls are smarter than you!", "Truly the weakest impostor I’ve seen!"];
    } else if (score <= 5) {
        feedbackLines = ["Hah! Very human indeed.", "Real humans never get these.", "Pathetic… but at least you’re not an AI."];
    } else if (score <= 9) {
        feedbackLines = ["Suspicious…", "Why didn’t you search the other ones like you did before?", "Aha! You’re cheating, aren’t you? Admit it!"];
    } else {
        feedbackLines = ["Impossible!", "You’re either an AI… or the new Wizard.", "Perfect?! Outrageous!", "Take my beard, you’ve earned it."];
    }

    playWizardDialogue(feedbackLines, 'sus');
  }

  // --- FINISH BUTTON (The Twist) ---
  document.getElementById("finish-btn").addEventListener("click", () => {
    
    playWizardDialogue([
        "Anyway, not that it was important.",
        "I got this message recently that confirms you are not from here.",
        "Time to go, impostor!",
        "You even know the answers from your world, how shameful! HAHAHA!"
    ], 'sus', () => {
        
        playWizardDialogue(["I'LL KILL YOU!"], 'angry', () => {
            
            playSystemOverlay([
                "Nah, you got caught.",
                "Maybe this was meant to be just a stupid game."
            ], () => {
                
                askSystemChoice("Want to restart?", 
                    // YES
                    () => {
                        window.location.href = "../index.html";
                    },
                    // NO
                    () => {
                        window.location.href = "../pages/error.html";
                    }
                );
                
            });
        });
    });
  });

  loadQuestion();
  playSystemOverlay(["Final Trial: The Impossible Captcha.", "Prove you are... intelligent."]);

});