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
const express_1 = __importDefault(require("express"));
const database_config_1 = require("../../../configs/database.config");
const main_enums_1 = require("../../../utils/main.enums");
class DashboardController {
    constructor() {
        this.router = express_1.default.Router();
    }
    watchRequests() {
        /**
         * @Functions
         */
        this.router.get('/barGraphData', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM wallet_historytransaction", (err, result) => {
                    if (err)
                        throw err;
                    res.status(200).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                throw err;
            }
        }));
        this.router.post('/createAnnouncement', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { messages, createdBy } = req.body;
            /**
             * active 1 un_active announcement 0
             */
            try {
                yield Promise.resolve(database_config_1.connection.query("INSERT INTO announcement ( message, createdBy ) VALUES (?, ?) ", [messages.message, createdBy], (err, result) => {
                    if (err)
                        throw err;
                    (result.affectedRows === 1) ? res.status(200).send({ message: 'ok' })
                        : (result.affectedRows === 0) ? res.status(200).send({ message: 'undefined' })
                            : '';
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.get('/displayAnnouncement', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM announcement ORDER BY createdDate DESC;", (err, result) => {
                    if (err)
                        throw err;
                    res.status(200).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/changeStatus', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { value } = req.body;
            try {
                yield Promise.resolve((value.status === 0) ?
                    database_config_1.connection.query("UPDATE announcement SET status=? WHERE id=?", [1, value.id], (err, result) => {
                        if (err)
                            throw err;
                        (result.affectedRows === 1) ? res.status(200).send({ message: 'ok' })
                            : (result.affectedRows === 0) ? res.status(200).send({ message: 'undefined' })
                                : '';
                    })
                    : (value.status === 1) ? database_config_1.connection.query("UPDATE announcement SET status=? WHERE id=?", [0, value.id], (err, result) => {
                        if (err)
                            throw err;
                        (result.affectedRows === 1) ? res.status(200).send({ message: 'ok' })
                            : (result.affectedRows === 0) ? res.status(200).send({ message: 'undefined' })
                                : '';
                    })
                        : '');
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/updateAnnouncement', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, updatedBy } = req.body;
            try {
                database_config_1.connection.beginTransaction();
                yield new Promise((resolve, reject) => {
                    database_config_1.connection.query("UPDATE announcement SET message=?, updatedBy=? WHERE id=?", [data.message, updatedBy, data.id], (err, result) => {
                        if (err)
                            return reject(err);
                        resolve(result);
                    });
                }).then(() => {
                    res.status(200).send({ message: 'ok' });
                    database_config_1.connection.commit();
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                database_config_1.connection.rollback();
            }
        }));
        this.router.get('/getActivityLogs', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM activitylogs ORDER BY logDate DESC;", (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
    }
    /**
    *@endOfWatchList
    */
    get routerObject() { return this.router; }
}
const user = new DashboardController();
user.watchRequests();
exports.default = user.routerObject;
//# sourceMappingURL=admin.route.js.map