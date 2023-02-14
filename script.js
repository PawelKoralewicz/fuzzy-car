const asfalt = document.getElementById("asfalt");
asfalt.width = 250;

const ctx = asfalt.getContext("2d");
const controls = new Controls();

const road = new Road(asfalt.width / 2, asfalt.width * 0.9);
const car = new Car(road.getLaneCntr(0), 300, 40, 55, "KEYS");
const traffic = [new Car(road.getLaneCntr(0), 0, 40, 55, "DUMMY")];
for (let i = 0; i<10; i++){
  let randomLane = Math.floor(Math.random() * 3);
  let randomCrd = Math.floor(Math.random() * -2000) - 250;
  traffic.push(new Car(road.getLaneCntr(randomLane), randomCrd, 40, 55, "DUMMY"));
}

animate();

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);
  asfalt.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + asfalt.height * 0.8);
  road.draw(ctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, "blue");
  }
  car.draw(ctx, "#ff1f2f");
  requestAnimationFrame(animate);
}
