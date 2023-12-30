import { Bullet } from "./bullet.js";
import { Game } from "./game.js";

export class Boss {
    constructor(game) {
        this.healthBarArray = []
    
      this.game = game;
      this.sprite = new PIXI.Sprite(PIXI.Texture.from('https://cdn.icon-icons.com/icons2/2892/PNG/512/rocket_icon_182791.png'));
      this.sprite.width = 150;
      this.sprite.height = 150;
      this.sprite.anchor.set(0.5);
      this.sprite.position.set(this.game.app.screen.width / 2, 100);
      this.hitPoints = 4;
      this.shootInterval = setInterval(() => {
        if (!this.bossDestroyed && this !== null) {
            this.shoot()
        }
      }, 2000);
      this.createHealthBar();
      this.isMovingLeft = false;
      this.isMovingRight = true;
      this.movementSpeed = 2;
      this.isWaiting = false;
      this.waitTime = 60 * 4;
      this.currentWaitTime = 0;
      this.bossDestroyed = false;
      setInterval( () => {
        setTimeout(() => {
            this.movementSpeed = 0
            setTimeout(() => {
                this.chooseRandomDirection()
                this.movementSpeed = 2;
            }, 2000)
        }, 2000)
      }, 5000)

    }
  
    update() {
        if (this.isMovingLeft) {
            this.healthBar.x -= this.movementSpeed;
            this.sprite.x -= this.movementSpeed;
        } else if (this.isMovingRight) {
            this.healthBar.x += this.movementSpeed;
            this.sprite.x += this.movementSpeed;
        }

        if (this.sprite.x <= 0) {
            this.isMovingLeft = false;
            this.isMovingRight = true;
        } else if (this.sprite.x >= this.game.app.screen.width) {
            this.isMovingLeft = true;
            this.isMovingRight = false;
        }
      this.updateHealthBar();

        if ( this.hitPoints === 0 ){
            this.game.showWinMessage()

        }
    }
  
    shoot() {
      if (this.game.player) {
        const bossBullet = new Bullet(this.sprite.x, this.sprite.y + 60, 'boss');
        this.game.app.stage.addChild(bossBullet.sprite);
        this.game.bossBullets.push(bossBullet);
      }
    }

    chooseRandomDirection() {
        const randomDirection = Math.random() < 0.5 ? 'left' : 'right';
        if (randomDirection === 'left') {
            this.isMovingLeft = true;
        } else {
            this.isMovingRight = true;
        }
    }

    createHealthBar() {
        this.healthBar = new PIXI.Graphics();

        this.healthBar.position.set(this.sprite.x - 30, this.sprite.y - 80 ); 
        this.game.app.stage.addChild(this.healthBar);
      }
    
      updateHealthBar() {
 
        let healthBarWidth = (this.hitPoints / 4) * 60;;
        if (this.hitPoints === 0) {
            this.game.app.stage.removeChild(this.healthBar);
            this.game.app.stage.removeChild(this.sprite);
            this.healthBar.clear();
            this.bossDestroyed = true;
            this.game.resetGame()
        } 
        this.healthBar.clear();
        this.healthBar.beginFill(0xFF0000);
        this.healthBar.drawRect(0, 0, healthBarWidth, 5);
        this.healthBar.endFill();
      }
  
    checkCollision(target) {
      if (target && target.sprite) {
        const bounds1 = this.sprite.getBounds();
        const bounds2 = target.sprite.getBounds();
        return (
          bounds1.x < bounds2.x + bounds2.width &&
          bounds1.x + bounds1.width > bounds2.x &&
          bounds1.y < bounds2.y + bounds2.height &&
          bounds1.y + bounds1.height > bounds2.y
        );
      }
      return false;
    }
  }
