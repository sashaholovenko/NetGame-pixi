export class Player {
    constructor(game) {
      this.game = game;
      this.sprite = new PIXI.Sprite(PIXI.Texture.from('https://cdn.icon-icons.com/icons2/2892/PNG/512/rocket_icon_182791.png'));
      this.sprite.scale.set(0.3, 0.3);
      this.sprite.anchor.set(0.5);
      this.sprite.position.set(this.game.app.screen.width / 2, this.game.app.screen.height - 200);

  
      this.isMovingRight = false;
      this.isMovingLeft = false;
    }
  
    update() {
      if (this.isMovingRight) {
        this.sprite.x += 10;
      }
  
      if (this.isMovingLeft) {
        this.sprite.x -= 10;
      }
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
  
    reset() {
      this.sprite.position.set(this.game.app.screen.width / 2, this.game.app.screen.height - 100);
    }
  }