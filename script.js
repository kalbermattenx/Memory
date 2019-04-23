// Controller für Sounds
class AudioController {
    constructor() {
        // this.bgMusic = new Audio('hintergundmusik.mp3');
        // this.bgMusic.volume = 0.5;
        // this bgMusic.loop = true;

        this.flipSound = new Audio('Sounds/flip.wav');
        this.matchSound = new Audio('Sounds/match.wav');
        this.victorySound = new Audio('Sounds/victory.wav');
        this.gameoverSound = new Audio('Sounds/gameover.wav');
    }

    startMusic() {
        this.bgMusic.play();
    }

    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
}

// Methode "ready"
function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            // game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // game.flipCard(card);
        });
    });
}

// Aufruf der "ready"-Methode mit Überprüfung
if(document.readyState === 'loading'){
    document.addEventListener(('DOCContentLoaded', ready()));
} else {
    ready();
}
