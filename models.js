/**
 * MODELS
 */
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  pos() {
    return [this.x, this.y];
  }
}
