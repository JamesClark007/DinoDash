class HighScoreManager {
    constructor() {
        this.highScore = 0;
    }

    setHighScore(newScore) {
        if (newScore > this.highScore) {
            this.highScore = newScore;
        }
    }

    getHighScore() {
        return this.highScore;
    }
}

const highScoreManager = new HighScoreManager();
