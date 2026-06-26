// Game Seasons with Different Collections
const seasons = [
    {
        name: 'Emojis',
        emoji: '😊',
        items: ['😊', '🎮', '🍕', '🌟', '🎸', '🎨', '🎭', '🎪', '🚀', '🌈', '🦄', '🎵']
    },
    {
        name: 'Animals',
        emoji: '🐸',
        items: ['🐸', '🐶', '🐱', '🦁', '🐼', '🐯', '🦊', '🐻', '🦉', '🦋', '🐢', '🦒']
    },
    {
        name: 'Places',
        emoji: '🏰',
        items: ['🏰', '🗽', '🗼', '🏛️', '🕌', '⛪', '🏟️', '🎪', '🏔️', '🏝️', '🌉', '🏞️']
    },
    {
        name: 'Fruits',
        emoji: '🍎',
        items: ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍑', '🍒', '🍍', '🥭', '🍈', '🍐']
    },
    {
        name: 'Vegetables',
        emoji: '🥕',
        items: ['🥕', '🥦', '🥬', '🌽', '🥒', '🌶️', '🫑', '🥔', '🧄', '🧅', '🍅', '🫒']
    }
];

// Game Variables
let currentSeason = 0;
let currentItems = [];
let cards = [];
let flipped = [];
let matched = [];
let moves = 0;
let matches = 0;
let gameStarted = false;
let startTime = 0;
let timerInterval = null;
let difficulty = 'easy';
let canFlip = true;

// Select Season
function selectSeason(seasonIndex) {
    currentSeason = seasonIndex;
    
    // Update UI
    document.querySelectorAll('.season-btn').forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === seasonIndex) {
            btn.classList.add('active');
        }
    });
    
    // Reset game with new season
    resetGame();
}

// Initialize Game
function initGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    // Get current season items based on difficulty
    currentItems = seasons[currentSeason].items.slice(0, getDifficultyPairCount());
    
    // Create card pairs
    cards = [...currentItems, ...currentItems].sort(() => Math.random() - 0.5);
    
    // Create card elements
    cards.forEach((item, index) => {
        const card = document.createElement('button');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.item = item;
        card.onclick = () => flipCard(card);
        card.innerHTML = '<span class="emoji">?</span>';
        gameBoard.appendChild(card);
    });
    
    flipped = [];
    matched = [];
    moves = 0;
    matches = 0;
    gameStarted = false;
    canFlip = true;
    updateStats();
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = '0s';
}

// Get difficulty pair count
function getDifficultyPairCount() {
    if (difficulty === 'easy') return 8;
    if (difficulty === 'medium') return 6;
    if (difficulty === 'hard') return 12;
    return 8;
}

// Flip Card
function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Start timer on first flip
    if (!gameStarted) {
        gameStarted = true;
        startTime = Date.now();
        startTimer();
    }
    
    card.classList.add('flipped');
    card.innerHTML = `<span class="emoji">${card.dataset.item}</span>`;
    flipped.push(card);
    
    if (flipped.length === 2) {
        canFlip = false;
        moves++;
        checkMatch();
    }
}

// Check for Match
function checkMatch() {
    const [card1, card2] = flipped;
    const isMatch = card1.dataset.item === card2.dataset.item;
    
    if (isMatch) {
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matches++;
            flipped = [];
            canFlip = true;
            updateStats();
            
            if (matches === currentItems.length) {
                endGame();
            }
        }, 600);
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.innerHTML = '<span class="emoji">?</span>';
            card2.innerHTML = '<span class="emoji">?</span>';
            flipped = [];
            canFlip = true;
            updateStats();
        }, 1000);
    }
}

// Update Statistics
function updateStats() {
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = `${matches}/${currentItems.length}`;
}

// Start Timer
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').textContent = elapsed + 's';
    }, 1000);
}

// End Game
function endGame() {
    clearInterval(timerInterval);
    canFlip = false;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    let message = `🎉 You matched all pairs!<br>`;
    message += `Season: ${seasons[currentSeason].name}<br>`;
    message += `Moves: ${moves}<br>`;
    message += `Time: ${minutes}m ${seconds}s`;
    
    // Add rating
    let rating = '⭐';
    const maxMoves = currentItems.length * 2.5;
    if (moves <= currentItems.length) rating = '⭐⭐⭐';
    else if (moves <= maxMoves) rating = '⭐⭐';
    
    message += `<br>${rating}`;
    
    document.getElementById('winMessage').innerHTML = message;
    document.getElementById('winModal').classList.add('show');
}

// Reset Game
function resetGame() {
    document.getElementById('winModal').classList.remove('show');
    initGame();
}

// Change Difficulty
function changeDifficulty() {
    const button = event.target;
    if (difficulty === 'easy') {
        difficulty = 'medium';
        button.textContent = 'Difficulty: Medium';
    } else if (difficulty === 'medium') {
        difficulty = 'hard';
        button.textContent = 'Difficulty: Hard';
    } else {
        difficulty = 'easy';
        button.textContent = 'Difficulty: Easy';
    }
    resetGame();
}

// Start Game
window.onload = () => {
    initGame();
};