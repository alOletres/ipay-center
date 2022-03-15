"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs = __importStar(require("fs"));
const module_main_1 = __importDefault(require("./module.main"));
const main_enums_1 = require("./utils/main.enums");
const socket_server_1 = require("./socket/socket.server");
const db_watcher_server_1 = require("./databaseWatcher/db_watcher.server");
const socket_io_1 = require("socket.io");
const startSocketServer = (instance) => (0, socket_server_1.socket)({ instance });
class MainServer {
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json({ limit: "50mb" }));
        this.app.use(express_1.default.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
        this.app.use((0, cors_1.default)());
        if (environment === 'test prod') {
            const options = {
                key: fs.readFileSync("./../../ssl/keys/f15a6_e242b_9adc49af084fce6a9e6493f1cedb02fd.key"),
                cert: fs.readFileSync("./../../ssl/certs/ippctransaction_com_ca648_2f011_1677769970_ef63cb59405f8ca8d1b98f0e6be176ed.crt")
            };
            this.server = https_1.default.createServer(options, this.app);
            // this.server = http.createServer(this.app)
            new module_main_1.default(this.app);
            const ioConn = new socket_io_1.Server(this.server, { cors: { origin: "*" } });
            startSocketServer(ioConn);
            (0, db_watcher_server_1.watch)(ioConn).then(() => console.log('Waiting for events'));
            this.startServer(this.port).then(() => console.log(`Server is running on port ${this.port}`));
        }
        else {
            this.server = http_1.default.createServer(this.app);
            new module_main_1.default(this.app);
            const ioConn = new socket_io_1.Server(this.server, { cors: { origin: "*" } });
            startSocketServer(ioConn);
            (0, db_watcher_server_1.watch)(ioConn).then(() => console.log('Waiting for events'));
            this.startServer(this.port).then(() => console.log(`Server is running on port ${this.port}`));
        }
    }
    startServer(port) {
        return Promise.resolve(this.server.listen(port));
    }
}
const { DEVELOPMENT, PRODUCTION } = main_enums_1.Keywords;
const PORT = process.env.NODE_ENV === DEVELOPMENT ? process.env.DEV_PORT
    : process.env.NODE_ENV === DEVELOPMENT ? process.env.DEV_PORT
        : process.env.TEST_PROD_PORT;
const environment = process.env.NODE_ENV === DEVELOPMENT ? DEVELOPMENT
    : process.env.NODE_ENV === PRODUCTION ? PRODUCTION
        : 'test prod';
new MainServer(PORT);
//# sourceMappingURL=app.main.js.map