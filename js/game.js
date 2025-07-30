let words = [];
let selectedWord = '';
let guessedLetters = [];
let wrongGuesses = 0;
const maxGuesses = 6;

fetch('data/words.json')
  .then(response => response.json())
  .then(data => {
    words = data;
    startGame();
  });

function startGame() {
  const randomIndex = Math.floor(Math.random() * words.length);
  selectedWord = words[randomIndex].word.toLowerCase();
  document.getElementById('hint').textContent = "Hint: " + words[randomIndex].hint;

  guessedLetters = [];
  wrongGuesses = 0;
  document.getElementById('result').textContent = '';
  document.getElementById('play-again').style.display = 'none';
  updateWordDisplay();
  createLetterButtons();
  updateHangmanImage();
  updateGuessLeft();
}

function updateWordDisplay() {
  const display = selectedWord.split('').map(letter =>
    guessedLetters.includes(letter) || letter === ' ' || letter === '-' ? letter : '_'
  ).join(' ');
  document.getElementById('word-display').textContent = display;

  if (!display.includes('_')) {
    document.getElementById('result').textContent = 'You Win!';
    showWinImage();  // <-- 정답 이미지 표시
    disableAllButtons();
    document.getElementById('play-again').style.display = 'inline-block';
  }
}

function createLetterButtons() {
  const container = document.getElementById('letter-buttons');
  container.innerHTML = '';
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const button = document.createElement('button');
    button.textContent = letter;
    button.addEventListener('click', () => handleGuess(letter.toLowerCase(), button));
    container.appendChild(button);
  }
}

function handleGuess(letter, button) {
  button.disabled = true;
  if (selectedWord.includes(letter)) {
    guessedLetters.push(letter);
    updateWordDisplay();
  } else {
    wrongGuesses++;
    updateHangmanImage();
    updateGuessLeft();
    if (wrongGuesses >= maxGuesses) {
      document.getElementById('result').textContent = 'You Lose! Word was: ' + selectedWord;
      disableAllButtons();
      document.getElementById('play-again').style.display = 'inline-block';
    }
  }
}

function updateHangmanImage() {
  const img = document.querySelector('#hangman-image img');
  img.src = `images/${wrongGuesses}.png`;
  img.classList.add('wrong-guess');
  setTimeout(() => img.classList.remove('wrong-guess'), 300);
}

function showWinImage() {
  document.querySelector('#hangman-image img').src = `images/correct.png`;
}

function updateGuessLeft() {
  const guessesLeft = maxGuesses - wrongGuesses;
  document.getElementById('guess-left').textContent = `Guesses Left: ${guessesLeft}`;
}

function disableAllButtons() {
  document.querySelectorAll('#letter-buttons button').forEach(btn => btn.disabled = true);
}

document.getElementById('play-again').addEventListener('click', startGame);
