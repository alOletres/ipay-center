"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const socket = (data) => {
    const io = data.instance;
    io.on("connection", (socket) => {
        socket.on('eventSent', (data) => {
            // io.emit('response_topUpload', {    
            // 	data /**send to client from server */
            // })
            const res = Object.values(data);
            const x = res.map((result) => result);
            io.emit(x[0], {
                data /**send to client from server */
            });
        });
    });
};
exports.socket = socket;
//# sourceMappingURL=socket.server.js.map