import {Player} from "./player.js"
import { Asteroid } from "./asteroid.js";
import { Bullet } from "./bullet.js"
import { Boss } from "./boss.js";
 export class Game {
    constructor() {
      this.app = new PIXI.Application({ width: 1280, height: 720 });
      document.body.appendChild(this.app.view);
  
      this.player = new Player(this);
      this.bullets = [];
      this.bossBullets = [];
      this.asteroids = [];
      this.score = 0;
      this.shotsLeft = 10;
      this.gameTime = 60;
      this.asteroidsCount = 10;
      this.isGameOverStatus = false;
      this.isGameWonStatus = false;
      this.app.stage.addChild(this.player.sprite);

      this.scoreText = new PIXI.Text('Score: 0', { fontSize: 24, fill: 0xFFFFFF });
      this.shotsText = new PIXI.Text('Shots left: 10', { fontSize: 24, fill: 0xFFFFFF });
      this.timerText = new PIXI.Text('Time: 60', { fontSize: 24, fill: 0xFFFFFF });
 
      this.scoreText.position.set(20, 20);
      this.shotsText.position.set(20, 50);
      this.timerText.position.set(20, 80);

      this.winText = new PIXI.Text('YOU WIN!', {
        fontSize: 48,
        fill: 0xFFFFFF,
        align: 'center',
        fontWeight: 'bold',
      });
      this.winText.anchor.set(0.5);
      this.winText.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
  
      this.loseText = new PIXI.Text('YOU LOSE!', {
        fontSize: 48,
        fill: 0xFFFFFF,
        align: 'center',
        fontWeight: 'bold',
      });

      this.loseText.anchor.set(0.5);
      this.loseText.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

      this.lvlTwoText = new PIXI.Text('LEVEL 2: BOSS FIGHT', {
        fontSize: 48,
        fill: 0xFFFFFF,
        align: 'center',
        fontWeight: 'bold',
      })

      this.lvlTwoText.anchor.set(0.5);
      this.lvlTwoText.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
  
      this.app.stage.addChild(this.scoreText, this.shotsText, this.timerText);
      document.addEventListener('keydown', this.onKeyDown.bind(this));
      document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

  
    createAsteroid() {
      if (this.asteroidsCount > 0) {
        const asteroid = new Asteroid(this);
        this.app.stage.addChild(asteroid.sprite);
        this.asteroids.push(asteroid);
        this.asteroidsCount--;
      }
    }
  
    updateScore() {
      this.scoreText.text = `Score: ${this.score}`;
    }
  
    updateShots() {
      this.shotsText.text = `Shots left: ${this.shotsLeft}`;
    }
  
    updateTimer() {
      this.timerText.text = `Time: ${this.gameTime.toFixed(0)}`;
    }
  
    onKeyDown(event) {
      if (event.code === 'ArrowRight') {
        this.player.isMovingRight = true;
      } else if (event.code === 'ArrowLeft') {
        this.player.isMovingLeft = true;
      } else if (event.code === 'Space') {
        this.shoot();
      }
    }
  
    onKeyUp(event) {
      if (event.code === 'ArrowRight') {
        this.player.isMovingRight = false;
      } else if (event.code === 'ArrowLeft') {
        this.player.isMovingLeft = false;
      }
    }
  
    shoot() {
      if (this.shotsLeft > 0) {
        const bullet = new Bullet(this.player.sprite.x, this.player.sprite.y - 60, 'player');
        this.app.stage.addChild(bullet.sprite);
        this.bullets.push(bullet);
        this.shotsLeft--;
        this.updateShots();
      }
      
    }

    checkLoseCondition() {
    if (this.shotsLeft <= 0 && this.asteroids.length > 0) {
      this.showLoseMessage();
    }
  }

  removeWinMessage() {
    this.app.stage.removeChild(this.winText);
  }

  removeLoseMessage() {
    this.app.stage.removeChild(this.loseText);
  }
  
  createAsteroid() {
    if (this.asteroidsCount > 0) {
      const asteroid = new Asteroid(this);
      this.app.stage.addChild(asteroid.sprite);
      this.asteroids.push(asteroid);
      this.asteroidsCount--;
    } else if (this.score === 100 && !this.boss) {
      this.showLevelTwoMessage()
      setTimeout(() => {
        this.createBoss();
      }, 1000)
    }
  }

  createBoss() {
    this.boss = new Boss(this);
    this.app.stage.addChild(this.boss.sprite);
    this.shotsLeft = 10;
    this.boss.createHealthBar();
  }

  updateBoss() {
    if (this.boss ) {
      this.boss.update();

      if (this.boss.checkCollision(this.player)) {
        this.showLoseMessage();
      }

      this.bullets.forEach((bullet) => {
        if (this.boss.checkCollision(bullet)) {

          this.app.stage.removeChild(bullet.sprite);
          this.bullets.splice(this.bullets.indexOf(bullet), 1);
          this.boss.hitPoints--;

          if (this.boss.hitPoints === 0) {
            this.app.stage.removeChild(this.boss.sprite);
            this.app.stage.removeChild(this.boss.healthBar)
            this.boss.bossDestroyed = true;
            this.showWinMessage();
 
          }
        }
        
      });
      this.bossBullets.forEach((bullet) => {
        if (this.player.checkCollision(bullet)) {
          this.showLoseMessage()
          this.app.stage.removeChild(this.boss.sprite);
          this.app.stage.removeChild(this.boss.healthBar)
          this.app.stage.removeChild(bullet.sprite);
          this.boss.bossDestroyed = true;
          this.bullets.splice(this.bullets.indexOf(bullet), 1);
        }
      })

    }
  }

  update() {
    if (!this.isGameOverStatus) {
      if (this.gameTime > 0) {
        requestAnimationFrame(this.update.bind(this));

        this.bullets.forEach((bullet) => {
          bullet.update();
        });

        this.bossBullets.forEach((bullet) => {
          bullet.update();
        });

        this.asteroids.forEach((asteroid) => {
          asteroid.update();

          if (asteroid.checkCollision(this.player)) {
            this.app.stage.removeChild(asteroid.sprite);
            this.app.stage.removeChild(this.player.sprite);
            this.showLoseMessage();
          }

          this.bullets.forEach((bullet) => {
            if (asteroid.checkCollision(bullet)) {
              this.app.stage.removeChild(asteroid.sprite);
              this.app.stage.removeChild(bullet.sprite);

              this.asteroids.splice(this.asteroids.indexOf(asteroid), 1);
              this.bullets.splice(this.bullets.indexOf(bullet), 1);

              this.score += 10;
              this.updateScore();
            }
          });
        });

        this.player.update();
        this.updateBoss();  // Додано оновлення для боса

        if (this.player.sprite.x > this.app.screen.width) {
          this.player.sprite.x = this.app.screen.width;
        }

        if (this.player.sprite.x < 0) {
          this.player.sprite.x = 0;
        }

        this.gameTime -= 1 / 60;
        this.updateTimer();
      } 


      if ( this.asteroidsCount > 0 && this.shotsLeft === 0 ) {
        this.showLoseMessage()
      }
    }
  }
  
    gameOver() {
      this.isGameOverStatus = true;
      this.showLoseMessage();
      this.resetGame();

    }
  
    showWinMessage() {
      this.app.stage.addChild(this.winText);
      setTimeout(() => this.resetGame(), 1500)      
    }
  
    showLoseMessage() {
      this.app.stage.addChild(this.loseText);
      setTimeout(() => this.resetGame(), 1500)
    }
    
    showLevelTwoMessage() {
      this.app.stage.addChild(this.lvlTwoText);
      setTimeout(() => this.app.stage.removeChild(this.lvlTwoText), 1500)
    }
  
    resetGame() {
      this.bullets.forEach((bullet) => {
        this.app.stage.removeChild(bullet.sprite);
      });
  
      this.asteroids.forEach((asteroid) => {
        this.app.stage.removeChild(asteroid.sprite);
      });
      this.bossBullets.forEach((bullet) => {
        this.app.stage.removeChild(bullet.sprite);
      });
  
      this.player.reset();
      this.score = 0;
      this.shotsLeft = 10;
      this.gameTime = 60;
      this.asteroidsCount = 10;
      this.asteroids = [];
      this.isGameOverStatus = false;
      this.isGameWonStatus = false;
      this.updateScore();
      this.updateShots();
      this.updateTimer();
      this.app.stage.removeChild(this.winText);
      this.app.stage.removeChild(this.loseText);
      // this.app.stage.removeChild(this.boss);
      this.app.stage.addChild(this.player.sprite);
      this.boss = null;
      this.bossBullets = [];
    }
  }
  const game = new Game();

  setInterval(() => game.createAsteroid(), 1500);
  game.update();
