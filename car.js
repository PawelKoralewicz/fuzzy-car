class Car {
  constructor(x, y, width, height, controlType) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;
    this.controls = new Controls(controlType);

    if (controlType !== "DUMMY") {
      this.sensors = new Sensors(this);
      this.offset = this.sensors.getFrontOffset();
      this.leftOffset = this.sensors.getLeftOffset();
      this.rightOffset = this.sensors.getRightOffset();
      this.maxSpeed = 3;
    } else {
      this.maxSpeed = Math.random() * 2 + 1;
    }
  }
  
  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensors) {
      this.sensors.update(roadBorders, traffic);
      this.offset = this.sensors.getFrontOffset();
      this.leftOffset = this.sensors.getLeftOffset();
      this.rightOffset = this.sensors.getRightOffset();
      if(this.offset !== undefined){
        if(this.leftOffset !== undefined && this.rightOffset === undefined){
          let angle = this.controls.fuzzifyAngle(this.offset * 100);
          this.angle -= angle/100;
        } else if (this.leftOffset === undefined && this.rightOffset !== undefined){
          let angle = this.controls.fuzzifyAngle(this.offset * 100);
          this.angle += angle/100;
        } else if (this.leftOffset !== undefined && this.rightOffset !== undefined){
          let speed = this.controls.fuzzifySpeed(this.offset * 100);
          this.maxSpeed = speed/10;
        }
      }
    }
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - (Math.sin(this.angle - alpha) * rad),
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - (Math.sin(this.angle + alpha) * rad),
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx, color) {
    if (this.damaged) {
      ctx.fillStyle = "#252525";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    if (this.sensors) {
      this.sensors.draw(ctx);
    }
  }
}
