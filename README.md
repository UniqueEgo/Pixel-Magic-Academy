# Pixel-Magic-Academy
"A frustration-based web game where a suspicious Wizard trolls you through increasingly impossible enrollment forms. Can you pass the Captcha?"

# 🧙‍♂️ Magic Academy: The Isekai Enrollment

> *"You have successfully possessed a body in a magical world... but before you can cast a single spell, you must survive the ultimate trial: BUREAUCRACY."*

**Magic Academy** is a web-based puzzle game inspired by *The Password Game*. You play as an "Isekai" protagonist who must navigate a magical enrollment process guarded by a suspicious, trolling Wizard and a helpful (but limited) "System" voice.

## 🎮 Game Features

* **Story-Driven Logic:** It's not just a form; it's a conversation. The Wizard reacts to every keystroke with different moods (Calm, Angry, Suspicious) and animated pixel-art expressions.
* **Dynamic Validation:** Inputs are checked in real-time. The game detects copy-pasting, impossible numbers, and rule violations immediately.
* **The "Impossible" Captcha:** A final boss level that tests your knowledge of obscure trivia, reverse logic, and patience.
* **Universal Wizard System:** A custom JavaScript engine that manages the Wizard's dialogue, state, and screen-blocking mechanics across multiple pages.
* **Mobile Friendly:** A responsive design that adapts the interface for mobile devices, ensuring the Wizard floats without blocking the input fields.

## 🕹️ The Journey (Levels)

1.  **The Gate (Index):**
    * Enter your Mage Name and Code Spell.
    * *Challenge:* Don't try to sneak in empty-handed, or the Wizard will catch you.

2.  **Enrollment:**
    * Fill out your personal details.
    * *Challenge:* The Wizard knows which magical realms are real. If you make up a fake address, he *will* call you out.

3.  **Level 1: Orb Connections:**
    * Verify your magical email (G-Mess) and Orb Number.
    * *Challenge:* The confirmation logic requires you to think in reverse. Literally.

4.  **Level 2: Arcane Security:**
    * Create a robust Code Spell following strict arcane rules.
    * *Challenge:* No numbers, specific lengths, mandatory special characters, and specific letters at specific indices.

5.  **Level 3: Official Login:**
    * Prove you remember your credentials from the previous levels.
    * *Challenge:* The "Enroll" button is a trap. Do you remember your own name?

6.  **Final Level: The Impossible Captcha:**
    * Survive 10 grueling questions ranging from Pi digits to Morse code.
    * *Challenge:* One wrong move, and the Wizard mocks you. Get a perfect score to earn his respect.

## 🛠️ Tech Stack

* **HTML5 / CSS3:** Retro, pixel-perfect layout with custom fonts (`Pixelify Sans`).
* **Vanilla JavaScript:** Handles all game logic, validation, state management, and the dialogue system (no frameworks used).
* **SessionStorage:** Persists user data (Mage Name, Code Spell) between levels so progress isn't lost on reload.

## 📂 Project Structure

```text
/
├── css/              # Stylesheets for each level + universal wizard.css
├── js/               # Game logic scripts
│   ├── wizardManager.js  # Core engine for Wizard animations & dialogue
│   ├── index.js          # Logic for the Title Screen
│   ├── enroll.js         # Logic for Enrollment
│   ├── oneLevel.js       # Logic for Orb Connections
│   ├── twoLevel.js       # Logic for Arcane Security
│   ├── thirdLevel.js     # Logic for Login
│   └── finalLevel.js     # Logic for the Captcha Boss
├── src/              # Images and Assets (Wizard sprites, icons)
├── pages/            # HTML files for levels 1, 2, 3, and Final
└── index.html        # The main entry point