export class Asteroid {
    constructor(game) {
        this.game = game;
      this.sprite = new PIXI.Sprite(PIXI.Texture.from('https://cdn-icons-png.flaticon.com/512/2530/2530826.png'));
      this.sprite.width = 100;
      this.sprite.height = 100;
      this.sprite.anchor.set(0.5);
      this.sprite.position.set(Math.random() * game.app.screen.width, 0);
    }
  
    update() {
      this.sprite.y += 2;
    }
  
    checkCollision(target) {
      const bounds1 = this.sprite.getBounds();
      const bounds2 = target.sprite.getBounds();
      return bounds1.x < bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width > bounds2.x &&
        bounds1.y < bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height > bounds2.y;
    }
  }