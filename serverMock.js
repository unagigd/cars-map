const express = require("express");
const faker = require("faker");
const ShortUniqueId = require("short-unique-id");
const R = require("ramda");

const app = express();
const port = 3002;

const uid = new ShortUniqueId({ length: 6 });

const fakeData = R.map(
  () => ({
    id: uid(),
    position: [
      faker.address.latitude(54.5394, 54.4024),
      faker.address.longitude(18.5432, 18.4783),
    ],
  }),
  R.range(0, 10)
);

function movePoints(points) {
  const positionLens = R.lensProp("position");

  return R.map(
    R.over(positionLens, (position) =>
      faker.address.nearbyGPSCoordinate(position, 0.1, true)
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

  let points = fakeData;

  res.write(`data: ${JSON.stringify(fakeData)}\n\n`);

  setInterval(() => {
    points = movePoints(points);
    res.write(`data: ${JSON.stringify(points)}\n\n`);
  }, 3000);
});

app.listen(port, () => {
  console.log(`Points event stream listening at http://localhost:${port}`);
});
