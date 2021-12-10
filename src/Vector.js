class Vector {

  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  
  static add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }
  
}

export default Vector;
