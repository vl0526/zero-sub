const { Server } = require("socket.io");

module.exports = (req, res) => {
    if (!res.socket.server.io) {
        console.log("🚀 Khởi tạo WebSocket...");
        const io = new Server(res.socket.server, {
            path: "/api/socket",
            cors: { origin: "*" },
        });
        
        let players = {};
        let safeZoneRadius = 20;

        io.on("connection", (socket) => {
            console.log(`🔗 Người chơi ${socket.id} đã vào`);

            players[socket.id] = { x: 0, y: 1, z: 0, health: 100 };
            io.emit("updatePlayers", players);

            socket.on("move", (data) => {
                players[socket.id] = data;
                io.emit("updatePlayers", players);
            });

            socket.on("shoot", (bullet) => {
                io.emit("spawnBullet", bullet);
            });

            socket.on("disconnect", () => {
                delete players[socket.id];
                io.emit("updatePlayers", players);
            });
        });

        setInterval(() => {
            safeZoneRadius -= 0.5;
            io.emit("updateSafeZone", safeZoneRadius);
        }, 5000);

        res.socket.server.io = io;
    }
    res.end();
};
