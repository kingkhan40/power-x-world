"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/socket-server.ts
// Run with: npx ts-node server/socket-server.ts
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var server = http_1.default.createServer(app);
// 🔌 Initialize Socket.IO
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // ⚠️ Change to your actual frontend domain later
        methods: ["GET", "POST"],
    },
});
io.on("connection", function (socket) {
    console.log("✅ Socket connected:", socket.id);
    socket.on("disconnect", function () {
        console.log("❌ Socket disconnected:", socket.id);
    });
});
// Optional endpoint (Next.js API can POST here)
app.post("/emit", function (req, res) {
    var _a = req.body || {}, _b = _a.event, event = _b === void 0 ? "depositUpdate" : _b, payload = _a.payload;
    io.emit(event, payload);
    return res.json({ ok: true });
});
var PORT = process.env.SOCKET_PORT || 4000;
server.listen(PORT, function () {
    console.log("\uD83D\uDE80 Socket.IO server running on port ".concat(PORT));
});
