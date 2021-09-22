const express = require("express");
const faker = require("faker");
const ShortUniqueId = require("short-unique-id");
const R = require("ramda");

const app = express();
const port = 3002;

const uid = new ShortUniqueId({ length: 6 });

const fakeData = (maxLat, minLat, maxLng, minLng, length = 100) =>
  R.map(
    () => ({
      id: uid(),
      position: [
        faker.address.latitude(maxLat, minLat),
        faker.address.longitude(maxLng, minLng),
      ],
    }),
    R.range(0, length)
  );

const gdyniaSopot = fakeData(54.5394, 54.4024, 18.5432, 18.4783);
const gdansk = fakeData(54.3954, 54.3025, 18.6755, 18.4392);

function movePoints(points) {
  const positionLens = R.lensProp("position");

  return R.map(
    R.over(positionLens, (position) =>
      faker.address.nearbyGPSCoordinate(position, 0.05, true)
    ),
    points
  );
}

app.get("/points", (req, res) => {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });
  res.flushHeaders();

  let points = R.concat(gdyniaSopot, gdansk);

  res.write(`data: ${JSON.stringify(points)}\n\n`);

  setInterval(() => {
    points = movePoints(points);
    res.write(`data: ${JSON.stringify(points)}\n\n`);
  }, 3000);
});

app.listen(port, () => {
  console.log(`Points event stream listening at http://localhost:${port}`);
});
