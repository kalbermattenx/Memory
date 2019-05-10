// Controller für Sounds
class AudioController {
    constructor() {

        // Hintergrundmusik
        this.bgMusic = new Audio('Sounds/hintergrundmusik.mp3');
        this.bgMusic.volume = 0.2;
        this.bgMusic.loop = true;

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

    // Spiel starten
    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCard = [];
        this.busy = true; // blockiert andere Aktionen (Bsp.: eine Animation soll zuerst fertig laufen)

        setTimeout(() =>{
            this.audiocontroller.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.ticker.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    // Karten "verstecken"
    hideCard(){
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    // Karten umdrehen
    flipCard(card){
        if(this.canFlipCard(card)){
            this.audiocontroller.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) // wenn cardToCheck null ist, geht es in die else-Anweisung
                this.checkForCardMatch(card)
            else
                this.cardToCheck = card;
        }
    }

    // Auf Match überprüfen
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMisMatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }

    // Karten stimmen überein
    cardMatch(card1, card2) {
        this.matchedCard.push(card1);
        this.matchedCard.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audiocontroller.match();
        if(this.matchedCard.length === this.cardsArray.length)
            this.victory();
    }

    // Karten stimmen nicht überein
    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000)
    }


    // Kartentyp herausfinden
    getCardType(card) {
        return  card.getElementsByClassName('card-value')[0].src;
    }

    // Timer (setInterval funktioniert ähnlich wie setTimeout => ruft/führt alle x MS etwas auf/aus)
    startCountDown(){
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0) // wenn Timer bei 0, dann GameOver
                this.gameOver();
        }, 1000)
    }

    // Niederlage
    gameOver(){
        clearInterval(this.countDown);
        this.audiocontroller.gameover();
        document.getElementById('game-over-text').classList.add('visible');
        this.hideCard();
    }

    // Sieg
    victory(){
        clearInterval(this.countDown);
        this.audiocontroller.victory();
        document.getElementById('victory-text').classList.add('visible');
        this.hideCard();
    }

    // Fisher-Yates-Shuffle (in Präsi erklären -> 27.30)
    shuffleCards(){
       for(let i = this.cardsArray.length - 1; i > 0; i--) {
           let randIndex = Math.floor(Math.random() * (i+1));
           this.cardsArray[randIndex].style.order = i;
           this.cardsArray[i].style.order = randIndex;
       }
    }

    // Überprüfung
    canFlipCard(card){
        return !this.busy && !this.matchedCard.includes(card) && card !== this.cardToCheck;
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
