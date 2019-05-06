// Controller für Sounds
class AudioController {
    constructor() {

        // Hintergrundmusik
        /*
        this.bgMusic = new Audio('hintergundmusik.mp3');
        this.bgMusic.volume = 0.5;
        this bgMusic.loop = true;
        */

        // Sounds zu einzelnen Aktionen (Flip, Match, Sieg und Niederlage)
        this.flipSound = new Audio('Sounds/flip.wav');
        this.matchSound = new Audio('Sounds/match.wav');
        this.victorySound = new Audio('Sounds/victory.wav');
        this.gameoverSound = new Audio('Sounds/gameover.wav');
    }

    // Hintergundmusik starten
    startMusic() {
        this.bgMusic.play();
    }

    // Hintergrundmusik stoppen (pausieren+zurücksetzen)
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    // Sounds der Einzelaktionen starten
    flip(){
        this.flipSound.play();
    }

    match(){
        this.matchSound.play();
    }

    victory(){
        this.stopMusic();
        this.victorySound.play();
    }

    gameover(){
        this.stopMusic();
        this.gameoverSound.play();
    }
}

// Spiel-Logik
class MixOrMatch {
    constructor(totalTime, cards){
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audiocontroller = new AudioController();
    }

    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCard = [];
        this.busy = true; // blockiert andere Aktionen (Bsp.: eine Animation soll zuerst fertig laufen)

    }

    flipCard(card){
        if(this.canFlipCard(card)){
            this.audiocontroller.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            // if statement
        }
    }

    /*
    // Name des Shuffles (auch für die Präsi)
    shuffleCards(){
       for() {

       }
    }
*/

    canFlipCard(card){
        return true;
        //return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

// Methode "ready"
function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards)


    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

// Aufruf der "ready"-Methode mit Überprüfung
if(document.readyState === 'loading'){
    document.addEventListener(('DOCContentLoaded', ready()));
} else {
    ready();
}
