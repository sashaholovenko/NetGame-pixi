export class Bullet {
    constructor(x, y, char) {
      this.sprite = new PIXI.Sprite(PIXI.Texture.from('https://cdn-icons-png.flaticon.com/512/3527/3527827.png'));
      this.sprite.width = 10;
      this.sprite.height = 20;
      this.sprite.anchor.set(0.5);
      this.sprite.position.set(x, y);
      this.char = char;
    }
  
    update() {
      if (this.char === 'player') {
        this.sprite.y -= 10;
      } else if (this.char === 'boss') {
        this.sprite.y += 10;
      }
    }
  }