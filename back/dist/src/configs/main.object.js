"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnections = exports.ReplicatorConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const main_enums_1 = require("./../utils/main.enums");
const { DEVELOPMENT, PRODUCTION } = main_enums_1.Keywords;
exports.ReplicatorConfig = {
    host: process.env.NODE_ENV === DEVELOPMENT ? "localhost" : "localhost",
    user: process.env.NODE_ENV === DEVELOPMENT ? "replicator" : process.env.REPLICATOR_USERNAME,
    password: process.env.NODE_ENV === DEVELOPMENT ? '' : process.env.REPLICATOR_PASSWORD
};
exports.DatabaseConnections = {
    host: process.env.NODE_ENV === DEVELOPMENT ? "localhost" : "localhost",
    user: process.env.NODE_ENV === DEVELOPMENT ? "root"
        : process.env.NODE_ENV === PRODUCTION ? "rootcpan_ippctransaction"
            : "",
    password: process.env.NODE_ENV === DEVELOPMENT ? "" : "4dww9u$~aEds",
    database: process.env.NODE_ENV === DEVELOPMENT ? "ipaypaymentcenter"
        : process.env.NODE_ENV === PRODUCTION ? "rootcpan_ipaydb"
            : ""
};
//# sourceMappingURL=main.object.js.map