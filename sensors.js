class Sensors {
  constructor(car) {
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 220;
    this.raySpread = Math.PI / 3;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
    this.readings = [];
    for (let a = 0; a < this.rays.length; a++) {
      this.readings.push(this.#getReading(this.rays[a], roadBorders, traffic));
    }
  }

  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (value) {
          touches.push(value);
          //   console.log(value.offset);
          return value;
        }
      }
    }

    if (touches.length === 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((e) => e.offset === minOffset);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "silver";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.strokeStyle = "yellow";
    // ctx.moveTo(this.rays[0][0].x, this.rays[0][0].y);
    // ctx.lineTo(this.rays[0][1].x, this.rays[0][1].y);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = "purple";
    // ctx.moveTo(this.rays[1][0].x, this.rays[0][0].y);
    // ctx.lineTo(this.rays[1][1].x, this.rays[0][1].y);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = "orange";
    // ctx.moveTo(this.rays[2][0].x, this.rays[0][0].y);
    // ctx.lineTo(this.rays[2][1].x, this.rays[0][1].y);
    // ctx.stroke();
  }

  getOffset(){
    if (this.readings[1]) {
        return this.readings[1].offset;
      }
  }
}
