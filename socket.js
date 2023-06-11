let io;

// Making io available across all files
module.exports = {
  // Socket io setup
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT"],
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialised!");
    }
    return io;
  },
};
