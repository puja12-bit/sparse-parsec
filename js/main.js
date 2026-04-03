import { Game } from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    canvas.width = 600;
    canvas.height = 800;

    const game = new Game(canvas);

    // UI Elements
    const menuScreen = document.getElementById('menu-screen');
    const hudScreen = document.getElementById('hud-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const levelCompleteScreen = document.getElementById('level-complete-screen');
    const destButtons = document.querySelectorAll('.dest-buttons button');
    
    // Bind buttons
    destButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dest = e.target.dataset.dest;
            menuScreen.classList.add('hidden');
            hudScreen.classList.remove('hidden');
            game.startGame(dest);
        });
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        gameOverScreen.classList.add('hidden');
        menuScreen.classList.remove('hidden');
        hudScreen.classList.add('hidden');
    });

    document.getElementById('btn-next').addEventListener('click', () => {
        levelCompleteScreen.classList.add('hidden');
        menuScreen.classList.remove('hidden');
        hudScreen.classList.add('hidden');
    });

    // Expose a way for Game to trigger UI changes
    game.onGameOver = (reason, score) => {
        hudScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        document.getElementById('game-over-reason').innerText = reason;
        document.getElementById('final-score').innerText = score;
    };

    game.onLevelComplete = (score, feedback) => {
        hudScreen.classList.add('hidden');
        levelCompleteScreen.classList.remove('hidden');
        document.getElementById('win-score').innerText = score;
        document.getElementById('win-feedback').innerText = feedback;
    };
});
