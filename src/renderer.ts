// DOM Elements
const vocabularyBtn = document.getElementById('vocabularyBtn') as HTMLButtonElement;
const practiceBtn = document.getElementById('practiceBtn') as HTMLButtonElement;
const settingsBtn = document.getElementById('settingsBtn') as HTMLButtonElement;
const contentDiv = document.getElementById('content') as HTMLDivElement;

// Event Listeners
vocabularyBtn.addEventListener('click', () => {
    loadVocabularySection();
});

practiceBtn.addEventListener('click', () => {
    loadPracticeSection();
});

settingsBtn.addEventListener('click', () => {
    loadSettingsSection();
});

// Content Loading Functions
function loadVocabularySection() {
    contentDiv.innerHTML = `
        <h2>Vocabulary</h2>
        <div style="margin: 20px 0;">
            <input type="text" id="wordInput" placeholder="Enter a word" style="padding: 8px; margin-right: 10px;">
            <button onclick="addWord()" style="padding: 8px 15px;">Add Word</button>
        </div>
        <div id="wordList" style="margin-top: 20px;">
            <!-- Words will be added here -->
        </div>
    `;
}

function loadPracticeSection() {
    contentDiv.innerHTML = `
        <h2>Practice</h2>
        <div style="text-align: center; margin-top: 20px;">
            <p>Choose a practice mode:</p>
            <button onclick="startFlashcards()" style="margin: 10px;">Flashcards</button>
            <button onclick="startQuiz()" style="margin: 10px;">Quiz</button>
        </div>
    `;
}

function loadSettingsSection() {
    contentDiv.innerHTML = `
        <h2>Settings</h2>
        <div style="margin: 20px 0;">
            <h3>Preferences</h3>
            <label>
                <input type="checkbox" id="darkMode"> Dark Mode
            </label>
            <br><br>
            <h3>Study Settings</h3>
            <label>
                Words per practice session:
                <input type="number" min="5" max="50" value="10" style="margin-left: 10px;">
            </label>
        </div>
    `;
}

// Initialize with vocabulary section
window.addEventListener('DOMContentLoaded', () => {
    loadVocabularySection();
});