export default class Score {
    score = 0;
    HIGH_SCORE_KEY = "highScore";

    multiplayerHighScore: number | undefined

    ctx
    canvas
    scaleRatio
  
    constructor(ctx: any, scaleRatio: number) {
      this.ctx = ctx;
      this.canvas = ctx.canvas;
      this.scaleRatio = scaleRatio;
    }
  
    update(frameTimeDelta: number) {
      this.score += frameTimeDelta * 0.01;
    }
  
    reset() {
      this.score = 0;
    }
  
    setHighScore() {
      const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
      if (this.score > highScore) {
        localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score) + '');
      }
    }
    getHighScore() {
      return this.score;
    }
    setMultiplayerHighScore(score: number) {
      this.multiplayerHighScore = score
    }
  
    draw() {
      const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
      const y = 20 * this.scaleRatio;
  
      const fontSize = 20 * this.scaleRatio;
      this.ctx.font = `${fontSize}px serif`;
      this.ctx.fillStyle = "#525250";
      const scoreX = this.canvas.width - 75 * this.scaleRatio;
      const highScoreX = scoreX - 125 * this.scaleRatio;
  
      const scorePadded = Math.floor(this.score).toString().padStart(6, '0');
      const highScorePadded = highScore.toString().padStart(6, '0');
  
      this.ctx.fillText(`SCORE: ${scorePadded}`, highScoreX, y);
      // this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    }
  }
  