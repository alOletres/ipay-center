"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mysql_1 = __importDefault(require("mysql"));
const main_object_1 = require("./../configs/main.object");
const pool = mysql_1.default.createConnection(main_object_1.DatabaseConnections);
pool.connect((err) => {
    if (err)
        throw err;
    console.log("Database Connected!");
});
exports.connection = pool;
//# sourceMappingURL=database.config.js.map