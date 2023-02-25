const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const startLat = 43.839767;
const startLng = 18.343170;
const stepDistance = 100;

function generatePlanePath(startLat, startLng, teamName, gridSize) {
    let currentLat = startLat;
    let currentLng = startLng;
    const grid = [];
    let prevLng = startLng;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (j === 0) {
                grid.push({
                    name: teamName,
                    lat: move_coordinate_on_y_axis(currentLat, prevLng, i * stepDistance),
                    lng: prevLng,
                });
            } else {
                const lng = move_coordinate_on_x_axis(
                    currentLat,
                    currentLng,
                    j * stepDistance
                );
                grid.push({
                    name: teamName,
                    lat: move_coordinate_on_y_axis(currentLat, lng, i * stepDistance),
                    lng: lng,
                });
            }
        }

        prevLng = move_coordinate_on_x_axis(currentLat, currentLng, 5 * stepDistance);
        currentLng = prevLng;
    }

    return grid;
}

const teamOnePath = generatePlanePath(startLat, startLng, "OSTIM", 5);
const teamTwoPath = generatePlanePath(startLat + 0.01, startLng - 0.01, "STAMBOL", 5);
const teamThreePath = generatePlanePath(startLat + 0.02, startLng - 0.02, "PBGS", 5);

const teams = [teamOnePath, teamTwoPath, teamThreePath];

app.get("/uav-location", (req, res) => {
    res.render("index", { teams });
});

io.on("connection", async (socket) => {
    console.log("a user connected");

    const promises = [];

    for (let j = 0; j < teams.length; j++) {
        const team = teams[j];
        const teamName = team[0].name;
        for (let i = 0; i < team.length; i++) {
            const currentPoint = team[i];
            const promise = delay(2000 * i).then(() => {
                socket.emit("updateCurrentPoints", { team: teamName, point: currentPoint });
            });
            promises.push(promise);
        }
    }

    await Promise.all(promises);

    console.log("Finished moving through the grid");
});


http.listen(3000, () => {
    console.log("listening on *:3000");
});

function move_coordinate_on_x_axis(lat, lon, distance) {
    const R = 6371e3;
    const new_lon = lon + (distance / (R * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);
    return new_lon;
}

function move_coordinate_on_y_axis(lat, distance) {
    const R = 6371e3;
    const new_lat = lat + (distance / R) * (180 / Math.PI);
    return new_lat;
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



























































































































