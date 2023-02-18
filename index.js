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

let currentLat = startLat;
let currentLng = startLng;

let prevLng = currentLng;

const grid = [];
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        grid.push({
            lat: move_coordinate_on_y_axis(startLat, startLng, i * stepDistance),
            lng: move_coordinate_on_x_axis(startLat, startLng, j * stepDistance)
        });
    }
   
    prevLng = move_coordinate_on_x_axis(currentLat, currentLng, 5 * stepDistance);
    currentLng = prevLng;
}

app.get("/uav-location", (req, res) => {
    res.render("index", { grid, currentPoint: grid[0] });
});

io.on("connection", async (socket) => {
    console.log("a user connected");

    for (let i = 0; i < grid.length; i++) {
        currentLat = grid[i].lat;
        currentLng = grid[i].lng;

        socket.emit("updateCurrentPoint", { lat: currentLat, lng: currentLng });

        await delay(2000);
    }

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

function move_coordinate_on_y_axis(lat,  distance) {
    const R = 6371e3;
    const new_lat = lat + (distance / R) * (180 / Math.PI);
    return new_lat;
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}






























































// const express = require("express");
// const app = express();
// const http = require("http").createServer(app);
// const io = require("socket.io")(http);
// const path = require("path");
// const math = require("mathjs");

// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");

// // starting point coordinates
// const startLat = 43.839767;
// const startLng = 18.343170;

// // step distance in meters
// const stepDistance = 100;

// // current point coordinates
// let currentLat = startLat;
// let currentLng = startLng;

// // grid of 25 points
// const grid = [];
// for (let i = 0; i < 5; i++) {
//     for (let j = 0; j < 5; j++) {
//         grid.push({
//             lat: move_coordinate_on_y_axis(startLat, startLng, i * stepDistance),
//             lng: move_coordinate_on_x_axis(startLat, startLng, j * stepDistance)
//         });
//     }
// }

// // current point index
// let currentIndex = 0;

// app.get("/", (req, res) => {
//     res.render("index", { grid, currentPoint: grid[currentIndex] });
// });

// io.on("connection", socket => {
//     console.log("a user connected");
//     let gridIndex = 0;
//     let intervalId = setInterval(() => {
//         currentLat = grid[gridIndex].lat;
//         currentLng = grid[gridIndex].lng;
//         socket.emit("updateCurrentPoint", { lat: currentLat, lng: currentLng });

//         gridIndex++;
//         if (gridIndex === grid.length) {
//             clearInterval(intervalId);
//         }
//     }, 2000);
// });

// http.listen(3000, () => {
//     console.log("listening on *:3000");
// });

// function move_coordinate_on_x_axis(init_lat, init_lon, distance) {
//     const R = 6371e3;
//     const lat = math.unit(init_lat, "deg").to("rad").value;
//     const lon = math.unit(init_lon, "deg").to("rad").value;
//     const new_lon = lon + distance / (R * Math.cos(lat));
//     return math.unit(new_lon, "rad").to("deg").value;
// }

// function move_coordinate_on_y_axis(init_lat, init_lon, distance) {
//     const R = 6371e3;
//     const lat = math.unit(init_lat, "deg").to("rad").value;
//     const lon = math.unit(init_lon, "deg").to("rad").value;
//     const new_lat = lat + distance / R;
//     return math.unit(new_lat, "rad").to("deg").value;
// }



































































