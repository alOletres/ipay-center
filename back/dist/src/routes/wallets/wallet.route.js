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
const database_config_1 = require("../../configs/database.config");
const main_enums_1 = require("../../utils/main.enums");
class WalletsController {
    constructor() {
        this.router = express_1.default.Router();
    }
    watchRequests() {
        /**
         * @Functions
         */
        this.router.post('/topupload', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, img, remarks } = req.body;
            try {
                if (remarks === '' || remarks === null || remarks === undefined) {
                    database_config_1.connection.beginTransaction();
                    yield new Promise((resolve, reject) => {
                        database_config_1.connection.query('INSERT INTO top_uploads (branchCode, fbranchCode, image, referenceNumber, payment_date, payment_status, amount) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.bcode, data.fcode, img, data.reference, data.date_trans, 0, data.credit], (err, result) => {
                            if (err)
                                return reject(err);
                            resolve(result);
                        });
                    }).then((response) => {
                        if (!response.length) {
                            res.status(main_enums_1.Codes.SUCCESS).send({ message: 'again' });
                            database_config_1.connection.commit();
                        }
                        else {
                            res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
                            database_config_1.connection.commit();
                        }
                    });
                }
                else {
                    database_config_1.connection.beginTransaction();
                    yield new Promise((resolve, reject) => {
                        database_config_1.connection.query('INSERT INTO top_uploads (branchCode, fbranchCode, image, referenceNumber, payment_date, payment_status, amount, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [data.bcode, data.fcode, img, data.reference, data.date_trans, 0, data.credit, remarks], (err, result) => {
                            if (err)
                                return reject(err);
                            resolve(result);
                        });
                    }).then((response) => {
                        if (!response.length) {
                            res.status(main_enums_1.Codes.SUCCESS).send({ message: 'again' });
                            database_config_1.connection.commit();
                        }
                        else {
                            res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
                            database_config_1.connection.commit();
                        }
                    });
                }
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                database_config_1.connection.rollback();
            }
        }));
        this.router.post('/getTopup_list', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { code } = req.body;
            try {
                database_config_1.connection.query('SELECT * FROM top_uploads WHERE fbranchCode=?', [code], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/getTopup_listForBranchHead', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { code } = req.body;
            try {
                database_config_1.connection.query('SELECT * FROM top_uploads WHERE branchCode=? AND payment_status=?', [code, 0], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/approvedTopupLoad', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { approved_date, approved_by, id, data, fcode } = req.body;
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve, reject) => {
                    // select for top uploads table if theres any data
                    database_config_1.connection.query("SELECT * FROM wallet WHERE branchCode=? ", [fcode], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                }).then((response) => __awaiter(this, void 0, void 0, function* () {
                    // total values from wallet table to top upload 
                    const total_approvedWallet = response[0].approved_wallet + data.credit;
                    const total_currentWallet = response[0].current_wallet + data.credit;
                    yield Promise.all([
                        Promise.resolve(
                        // update current wallet to wallet table
                        database_config_1.connection.query("UPDATE wallet SET approved_wallet=?, current_wallet=? WHERE branchCode=?", [total_approvedWallet, total_currentWallet, fcode], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(
                        // update top uploads wallet has been approved 
                        database_config_1.connection.query('UPDATE top_uploads SET payment_status=?, approved_by=?, approved_date=? WHERE id=?', [1, approved_by, approved_date, id], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        }))
                    ]);
                    database_config_1.connection.commit();
                    res.status(main_enums_1.Codes.SUCCESS).send(`Added.`);
                }))
                    .catch((err) => {
                    database_config_1.connection.rollback();
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                });
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/sendLoadtable', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, fbranchCode, available_wallet } = req.body;
            const dateNow = new Date();
            if (available_wallet < data.credit) {
                res.status(main_enums_1.Codes.SUCCESS).send('dli');
            }
            else {
                // 
                try {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve, reject) => {
                        // insert the load in sendload table
                        database_config_1.connection.query("SELECT * FROM wallet WHERE branchCode=?", [data.ib_code], (err, result) => {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    }).then((response) => __awaiter(this, void 0, void 0, function* () {
                        // plus the ibarangay wallet load afterwards minus the franchise wallet
                        const totalapproved = data.credit + response[0].approved_wallet;
                        const totalcurrent_wallet = data.credit + response[0].current_wallet;
                        // 2nd query
                        database_config_1.connection.beginTransaction();
                        return new Promise((resolve, reject) => {
                            database_config_1.connection.query("SELECT * FROM wallet WHERE branchCode=?", [fbranchCode], (err, result) => {
                                if (err)
                                    throw err;
                                resolve(result);
                            });
                        }).then((response) => __awaiter(this, void 0, void 0, function* () {
                            // mag minus ko dri para makuhaan ang wallet ni franchise
                            const decCurrent_wallet = response[0].current_wallet - data.credit;
                            yield Promise.all([
                                Promise.resolve(
                                // update wallet for ibarangay approved and current wallet
                                database_config_1.connection.query("UPDATE wallet SET approved_wallet=?, current_wallet=? WHERE branchCode=?", [totalapproved, totalcurrent_wallet, data.ib_code], (err, result) => {
                                    if (err)
                                        throw err;
                                    return result;
                                })), Promise.resolve(
                                // update wallet in franchise current wallet
                                database_config_1.connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", [decCurrent_wallet, fbranchCode], (err, result) => {
                                    if (err)
                                        throw err;
                                    return result;
                                })), Promise.resolve(
                                // insert data to send load list
                                database_config_1.connection.query("INSERT INTO sendload_list (fbranchCode, ibrgy_code, credit_sent, load_status, paid_date) VALUES (?, ?, ?, ?, ?)", [fbranchCode, data.ib_code, data.credit, data.paymentStatus, dateNow], (err, result) => {
                                    if (err)
                                        throw err;
                                    return result;
                                }))
                            ]);
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Added.`);
                        })).catch((err) => {
                            database_config_1.connection.rollback();
                            res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                        });
                        // last block of catch
                    })).catch((err) => {
                        database_config_1.connection.rollback();
                        res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                    });
                }
                catch (err) {
                    database_config_1.connection.rollback();
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                }
            }
        }));
        this.router.post('/getFranchisewallet', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { fbranchCode } = req.body;
            try {
                database_config_1.connection.query("SELECT * FROM wallet WHERE branchCode=?", [fbranchCode], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/updateLoadstatus', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { paymentStatus, id } = req.body;
            const dateNow = new Date();
            try {
                database_config_1.connection.query("UPDATE sendload_list SET load_status=?, paid_date=? WHERE id=?", [paymentStatus, dateNow, id], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/checkAvailableWallet', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { branchCode } = req.body;
            try {
                database_config_1.connection.beginTransaction();
                return yield new Promise((resolve, reject) => {
                    database_config_1.connection.query("SELECT * FROM teller_list WHERE tellerCode=?", [branchCode], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                }).then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response[0].fiB_Code !== '' && response[0].ibrgy_code !== '') {
                        yield Promise.resolve(database_config_1.connection.query("SELECT * FROM wallet WHERE branchCode=?", [response[0].ibrgy_code], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                        }));
                    }
                    else if (response[0].fiB_Code !== '' && response[0].ibrgy_code === '') {
                        yield Promise.resolve(database_config_1.connection.query("SELECT * FROM wallet WHERE branchCode=?", [response[0].fiB_Code], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                        }));
                    }
                    else if (response[0].fiB_Code === '' && response[0].ibrgy_code !== '') {
                        yield Promise.resolve(database_config_1.connection.query("SELECT * FROM wallet WHERE branchCode=?", [response[0].ibrgy_code], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                        }));
                    }
                })).catch((err) => {
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                });
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.get('/adminTopUpload', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM top_uploads WHERE payment_status=?", [0], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/walletHistory', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { code } = req.body;
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM wallet_historytransaction INNER JOIN barkota ON wallet_historytransaction.transaction_id = barkota.barkota_code WHERE wallet_historytransaction.branchCode=? AND barkota.branchCode=?", [code, code], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/checkFranchiseWallet', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { code } = req.body;
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM wallet WHERE branchCode=?", [code], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.get('/walletTransactionForAdminBranchHead', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM wallet_historytransaction INNER JOIN barkota ON wallet_historytransaction.transaction_id = barkota.barkota_code", (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.get('/walletBranchesMonitoring', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM wallet INNER JOIN franchise_list ON wallet.branchCode = franchise_list.fbranchCode", (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.get('/walletiBarangayMonitoring', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM wallet INNER JOIN ibrgy_list ON wallet.branchCode = ibrgy_list.ib_ibrgyyCode", (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.get('/topUploadsFranchiseeHistory', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM top_uploads INNER JOIN franchise_list ON top_uploads.fbranchCode = franchise_list.fbranchCode", (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.get('/topUploadsIbarangayHistory', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM top_uploads INNER JOIN ibrgy_list ON top_uploads.fbranchCode = ibrgy_list.ib_ibrgyyCode", (err, result) => {
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
const user = new WalletsController();
user.watchRequests();
exports.default = user.routerObject;
function resolve(result) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=wallet.route.js.map