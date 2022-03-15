"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = void 0;
const MySQLEvents = require('@rodrigogs/mysql-events');
const mysql_1 = __importDefault(require("mysql"));
const main_object_1 = require("./../configs/main.object");
const watch = (io) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = mysql_1.default.createConnection(main_object_1.ReplicatorConfig);
    const instance = new MySQLEvents(connection, {
        startAtEnd: true
    });
    yield instance.start();
    instance.addTrigger({
        name: 'Watching Events...',
        expression: '*',
        statement: MySQLEvents.STATEMENTS.ALL,
        onEvent: (e) => {
            const { type, schema, table, affectedRows, affectedColumns } = e;
            const { after, before } = affectedRows[0];
            console.log(e);
            if (table === 'top_uploads') {
                console.log(table);
            }
        },
    });
    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
});
exports.watch = watch;
//# sourceMappingURL=db_watcher.server.js.map