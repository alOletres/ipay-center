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
const database_config_1 = require("./../../configs/database.config");
const main_enums_1 = require("../../utils/main.enums");
const bcrypt_1 = __importDefault(require("bcrypt"));
class BranchController {
    constructor() {
        this.router = express_1.default.Router();
    }
    watchRequests() {
        /**
         * @Functions
         */
        this.router.post('/saveBranch', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, reference } = req.body;
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve, reject) => {
                    database_config_1.connection.query("SELECT * from branch_count WHERE type=?", ['Branch Head'], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                })
                    .then((responce) => __awaiter(this, void 0, void 0, function* () {
                    const i = parseInt(responce[0].count) + 1;
                    const type = 'BH';
                    const saltRounds = process.env.SALT_ROUNDS;
                    const password = process.env.STAT_PASSWORD;
                    const salt = bcrypt_1.default.genSaltSync(parseInt(saltRounds));
                    const savePassword = bcrypt_1.default.hashSync(password, salt);
                    yield Promise.all([
                        Promise.resolve(database_config_1.connection.query("INSERT INTO branch_list(ownerFirstname, ownerLastname, contactNo, emailAdd, address, branchName, branchType, branchCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [data.ownerFirstname, data.ownerLastname, data.contactNo, data.emailAdd, data.address, data.branchName, 'Branch Head', type + ('000' + i).slice(-4)], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(database_config_1.connection.query("INSERT INTO user_account(user_type, username, password, status) VALUES (?, ?, ?, ?)", ['Branch Head', type + ('000' + i).slice(-4), savePassword, 1], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(database_config_1.connection.query("UPDATE branch_count SET count=? WHERE type=?", [i, 'Branch Head'], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        }))
                    ]);
                    database_config_1.connection.commit();
                    res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
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
        this.router.get('/getBranches', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                database_config_1.connection.query("SELECT * FROM branch_list", (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/updateBranch', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ownerFirstname, ownerLastname, contactNo, emailAdd, address, branchName, id } = req.body;
            try {
                database_config_1.connection.query("UPDATE branch_list SET ownerFirstname=?, ownerLastname=?, contactNo=?, emailAdd=?, address=?, branchName=? WHERE b_id=?", [ownerFirstname, ownerLastname, contactNo, emailAdd, address, branchName, id], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Updates.`);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/updateBranchStatus', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, loggedBy } = req.body;
            try {
                if (data.branchStatus == 1) {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve, reject) => {
                        database_config_1.connection.query("UPDATE branch_list SET branchStatus=? WHERE b_id=?", [0, data.b_id], (err, result) => {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    }).then((response) => __awaiter(this, void 0, void 0, function* () {
                        yield Promise.resolve(database_config_1.connection.query("UPDATE user_account SET status =? WHERE username =?", [0, data.branchCode], (err, result) => {
                            if (err)
                                throw err;
                            res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Updates.`);
                        }));
                        // await Promise.resolve(
                        // 	connection.query("INSERT INTO activitylogs (affectedTable, loggedBy, dataBefore, logStatusCode) VALUES (?, ?, ?, ?)", 
                        // 	['branch_list', loggedBy, JSON.stringify(req.body), Codes.SUCCESS], (err, result)=>{
                        // 		if(err) throw err
                        // 		res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
                        // 	})
                        // )
                        database_config_1.connection.commit();
                    }));
                }
                else {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve) => {
                        database_config_1.connection.query("UPDATE branch_list SET branchStatus=? WHERE b_id=?", [1, data.b_id], (err, result) => {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    }).then((response) => __awaiter(this, void 0, void 0, function* () {
                        yield Promise.resolve(database_config_1.connection.query("UPDATE user_account SET status =? WHERE username =?", [1, data.branchCode], (err, result) => {
                            if (err)
                                throw err;
                            res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Updates.`);
                        }));
                        // await Promise.resolve(
                        // 	connection.query("INSERT INTO activitylogs (affectedTable, loggedBy, dataBefore, logStatusCode) VALUES (?, ?, ?, ?)", 
                        // 	['branch_list', loggedBy, JSON.stringify(data), Codes.SUCCESS], (err, result)=>{
                        // 		if(err) throw err
                        // 		res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
                        // 	})
                        // )
                        database_config_1.connection.commit();
                    }));
                }
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        // end of Branch Head Query
        // start of Franchise query
        this.router.post('/saveFbranch', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const type = "FRA";
            const { firstname, lastname, contactNo, email, locationAddress, branchName, code } = req.body;
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve, reject) => {
                    database_config_1.connection.query("SELECT * from branch_count WHERE type=?", ['Franchise'], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                })
                    .then((responce) => __awaiter(this, void 0, void 0, function* () {
                    const i = parseInt(responce[0].count) + 1;
                    const saltRounds = process.env.SALT_ROUNDS;
                    const password = process.env.STAT_PASSWORD;
                    const salt = bcrypt_1.default.genSaltSync(parseInt(saltRounds));
                    const savePassword = bcrypt_1.default.hashSync(password, salt);
                    yield Promise.all([
                        Promise.resolve(database_config_1.connection.query("INSERT INTO franchise_list (branchCode, fbranchCode, franchiseName, fbranchType, lastname, firstname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [code, type + ('000' + i).slice(-4), branchName, 'Franchise', lastname, firstname, contactNo, email, locationAddress, 1], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(database_config_1.connection.query("INSERT INTO user_account(user_type, username, password, status) VALUES (?, ?, ?, ?)", ['Franchise', type + ('000' + i).slice(-4), savePassword, 1], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(database_config_1.connection.query("UPDATE branch_count SET count=? WHERE type=?", [i, 'Franchise'], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        }))
                    ]);
                    database_config_1.connection.commit();
                    res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Added.`);
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
        /**
         * @franchiseList
         */
        this.router.get('/getFranchiselist', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                database_config_1.connection.query('SELECT * FROM franchise_list', (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        // wallet for new franchisee 
        this.router.post('/savefWallet', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { wallet, branchCode } = req.body;
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve, reject) => {
                    database_config_1.connection.query('SELECT branchCode, fbranchCode FROM franchise_list WHERE branchCode =? ORDER  BY id DESC LIMIT 1 ', [branchCode], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                }).then((responce) => {
                    const fbranchCode = (responce[0].fbranchCode);
                    database_config_1.connection.query('INSERT INTO wallet (branchCode, approved_wallet, current_wallet) VALUES (?, ?, ?)', [fbranchCode, wallet, wallet], (err, result) => {
                        if (err)
                            throw err;
                        database_config_1.connection.commit();
                        res.status(main_enums_1.Codes.SUCCESS).send(result);
                    });
                });
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        })); //end of new franchise wallet
        // wallet for new ibarangay
        this.router.post('/saveibWallet', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { fbranchCode, wallet } = req.body;
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve, reject) => {
                    database_config_1.connection.query('SELECT ib_fbranchCode, ib_ibrgyyCode FROM ibrgy_list WHERE ib_fbranchCode=? ORDER BY ib_id DESC LIMIT 1', [fbranchCode], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                }).then((responce) => {
                    const ib_branchCode = (responce[0].ib_ibrgyyCode);
                    database_config_1.connection.query('INSERT INTO wallet (branchCode, approved_wallet, current_wallet) VALUES (?, ?, ?)', [ib_branchCode, wallet, wallet], (err, result) => {
                        if (err)
                            throw err;
                        database_config_1.connection.commit();
                        res.status(main_enums_1.Codes.SUCCESS).send(result);
                    });
                });
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        // end for new ibarangay walleting
        // start new query!
        this.router.post('/updateFbranchStatus', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, approved_by } = req.body;
            try {
                if (data.status === 1) {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve, reject) => {
                        database_config_1.connection.query("UPDATE franchise_list SET status=? WHERE id=?", [0, data.id], (err, result) => {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    }).then((response) => {
                        database_config_1.connection.query("UPDATE user_account SET status=? WHERE username=?", [0, data.fbranchCode], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Updates.`);
                        });
                    });
                }
                else {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve, reject) => {
                        database_config_1.connection.query("UPDATE franchise_list SET status=? WHERE id=?", [1, data.id], (err, result) => {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    }).then((response) => {
                        database_config_1.connection.query("UPDATE user_account SET status=?, approved_by=? WHERE username=?", [1, approved_by, data.fbranchCode], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Updates.`);
                        });
                    });
                }
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/updateFbranch', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data } = req.body;
            try {
                database_config_1.connection.query('UPDATE franchise_list SET franchiseName=?, lastname =?, firstname =?, contactNo =?, email =?, location =? WHERE id =?', [data.branchName, data.lastname, data.firstname, data.contactNo, data.email, data.locationAddress, data.id], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        // the end of franchise query
        // start for ibarangay query
        this.router.post('/saveIbarangay', (req, res) => {
            const type = "BRA";
            const { branchCode, fbranchCode, branchName, lastname, firstname, suffix, contactNo, email, locationAddress } = req.body;
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve, reject) => {
                    database_config_1.connection.query("SELECT * from branch_count WHERE type=?", ['iBarangay'], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                })
                    .then((responce) => __awaiter(this, void 0, void 0, function* () {
                    const i = parseInt(responce[0].count) + 1;
                    const saltRounds = process.env.SALT_ROUNDS;
                    const password = process.env.STAT_PASSWORD;
                    const salt = bcrypt_1.default.genSaltSync(parseInt(saltRounds));
                    const savePassword = bcrypt_1.default.hashSync(password, salt);
                    yield Promise.all([
                        Promise.resolve(database_config_1.connection.query("INSERT INTO ibrgy_list (branchCode, ib_fbranchCode, ib_ibrgyyCode, franchiseName, branchType, lastname, firstname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [branchCode, fbranchCode, type + ('000' + i).slice(-4), branchName, 'iBarangay', lastname, firstname, contactNo, email, locationAddress, 1], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(database_config_1.connection.query("INSERT INTO user_account (user_type, username, password, status) VALUES (?, ?, ?, ?)", ['iBarangay', type + ('000' + i).slice(-4), savePassword, 1], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(database_config_1.connection.query("UPDATE branch_count SET count=? WHERE type=?", [i, 'iBarangay'], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        }))
                    ]);
                    database_config_1.connection.commit();
                    res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Added.`);
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
        });
        this.router.get('/getIbarangaylist', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                database_config_1.connection.query('SELECT * FROM ibrgy_list', (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/updateStatusIb', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, approved_by } = req.body;
            try {
                if (data.status == 1) {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve) => {
                        database_config_1.connection.query("UPDATE ibrgy_list SET status=? WHERE ib_id=?", [0, data.ib_id], (err, result) => {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    }).then(() => __awaiter(this, void 0, void 0, function* () {
                        database_config_1.connection.query("UPDATE user_account SET status=? WHERE username=?", [0, data.ib_ibrgyyCode], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Updates.`);
                        });
                    }));
                }
                else {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve) => {
                        database_config_1.connection.query("UPDATE ibrgy_list SET status=? WHERE ib_id=?", [1, data.ib_id], (err, result) => {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    }).then(() => __awaiter(this, void 0, void 0, function* () {
                        database_config_1.connection.query("UPDATE user_account SET status=?, approved_by=? WHERE username=?", [1, approved_by, data.ib_ibrgyyCode], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Updates.`);
                        });
                    }));
                }
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/updateIbarangaylist', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data } = req.body;
            try {
                database_config_1.connection.query('UPDATE ibrgy_list SET franchiseName=?, lastname =?, firstname =?, contactNo =?, email =?, location =? WHERE ib_id =?', [data.branchName, data.lastname, data.firstname, data.contactNo, data.email, data.locationAddress, data.ib_id], (err, result) => {
                    if (err)
                        throw err;
                    (result.affectedRows === 1)
                        ? res.status(200).send({ message: 'ok' })
                        : (result.affectedRows === 0) ? res.status(200).send({ message: 'undefined' })
                            : '';
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/addibTeller', (req, res) => {
            const { data, fbranchCode, branchCode } = req.body;
            const type = "BRT";
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve, reject) => {
                    database_config_1.connection.query("SELECT * from branch_count WHERE type=?", ['BRTeller'], (err, result) => {
                        if (err)
                            return reject(err);
                        resolve(result);
                    });
                })
                    .then((responce) => __awaiter(this, void 0, void 0, function* () {
                    const i = parseInt(responce[0].count) + 1;
                    const saltRounds = process.env.SALT_ROUNDS;
                    const password = process.env.STAT_PASSWORD;
                    const salt = bcrypt_1.default.genSaltSync(parseInt(saltRounds));
                    const savePassword = bcrypt_1.default.hashSync(password, salt);
                    yield Promise.all([
                        Promise.resolve(database_config_1.connection.query("INSERT INTO teller_list (branchCode, fiB_Code, tellerCode, type, firstname, lastname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [branchCode, fbranchCode, type + ('000' + i).slice(-4), 'Teller', data.firstname, data.lastname, data.contactNo, data.email, data.locationAddress, 0], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(database_config_1.connection.query("INSERT INTO user_account (user_type, username, password) VALUES (?, ?, ?) ", ['Teller', type + ('000' + i).slice(-4), savePassword], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(database_config_1.connection.query("UPDATE branch_count SET count=? WHERE type=?", [i, 'BRTeller'], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        }))
                    ]);
                    database_config_1.connection.commit();
                    res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Added.`);
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
        });
        this.router.post('/addFranchiseTeller', (req, res) => {
            const { data, fcode } = req.body;
            const type = "FRT";
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve) => {
                    database_config_1.connection.query("SELECT * from branch_count WHERE type=?", ['FRTeller'], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                }).then((response) => __awaiter(this, void 0, void 0, function* () {
                    const i = parseInt(response[0].count) + 1;
                    const saltRounds = process.env.SALT_ROUNDS;
                    const password = process.env.STAT_PASSWORD;
                    const salt = bcrypt_1.default.genSaltSync(parseInt(saltRounds));
                    const savePassword = bcrypt_1.default.hashSync(password, salt);
                    yield new Promise((resolve) => {
                        database_config_1.connection.query('SELECT branchCode FROM  franchise_list WHERE fbranchCode=?', [fcode], (err, result) => {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    }).then((result) => __awaiter(this, void 0, void 0, function* () {
                        (!result.length)
                            ? res.status(main_enums_1.Codes.SUCCESS).send({ message: 'notFound' })
                            : yield Promise.all([
                                Promise.resolve(database_config_1.connection.query("INSERT INTO teller_list (branchCode, fiB_Code, tellerCode, type, firstname, lastname, contactNo, email, location, status, addedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [result[0].branchCode, fcode, type + ('000' + i).slice(-4), 'Teller', data.firstname, data.lastname, data.contactNo, data.email, data.locationAddress, 1, fcode], (err, result) => {
                                    if (err)
                                        throw err;
                                    return result;
                                })), Promise.resolve(database_config_1.connection.query("INSERT INTO user_account (user_type, username, password, status) VALUES (?, ?, ?, ?) ", ['Teller', type + ('000' + i).slice(-4), savePassword, 1], (err, result) => {
                                    if (err)
                                        throw err;
                                    return result;
                                })), Promise.resolve(database_config_1.connection.query("UPDATE branch_count SET count=? WHERE type=?", [i, 'FRTeller'], (err, result) => {
                                    if (err)
                                        throw err;
                                    res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
                                }))
                            ]);
                        database_config_1.connection.commit();
                    }));
                })).catch((err) => {
                    database_config_1.connection.rollback();
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                });
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
            // const type = "FRT"
            // try {
            // 	connection.beginTransaction()
            // 	return new Promise((resolve, reject) => {
            // 		connection.query("SELECT * from branch_count WHERE type=?", 
            // 		['FRTeller'], (err, result) => {
            // 			if(err) throw err
            // 			resolve (result)
            // 		})
            // 	})
            // 	.then(async (responce: any) => {
            // 		const i = parseInt(responce[0].count)+1
            // 		const saltRounds : any = process.env.SALT_ROUNDS
            // 		const password : any = process.env.STAT_PASSWORD
            // 		const salt = bcrypt.genSaltSync(parseInt(saltRounds));
            // 		const savePassword = bcrypt.hashSync(password, salt)
            // 		await Promise.all([
            // 			Promise.resolve(
            // 				connection.query("INSERT INTO teller_list (branchCode, fiB_Code, tellerCode, type, firstname, lastname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            // 				[branchCode, fbranchCode, type+('000'+i).slice(-4), 'Teller', data.firstname, data.lastname, data.contactNo, data.email, data.locationAddress, 1 ], (err, result) => {
            // 					if(err) throw err;
            // 					return result
            // 				})
            // 			), Promise.resolve(
            // 				connection.query("INSERT INTO user_account (user_type, username, password, status) VALUES (?, ?, ?, ?) ",
            // 				['Teller', type+('000'+i).slice(-4), savePassword, 1], (err, result)=>{
            // 					if(err) throw err;
            // 					return result
            // 				})
            // 			), Promise.resolve(
            // 				connection.query("UPDATE branch_count SET count=? WHERE type=?",
            // 				[i, 'FRTeller'], (err, result) => {
            // 					if(err) throw err
            // 					return result
            // 				})
            // 			)
            // 		])
            // 		connection.commit()
            // 		res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Added.`)
            // 	})
            // 	.catch((err) => {
            //         connection.rollback()
            //         res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            //     })
            // } catch (err: any) { 
            // 	connection.rollback()
            // 	res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            // }
        });
        // get teller list
        this.router.get('/getTellerlist', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                database_config_1.connection.query('SELECT * FROM teller_list', (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/updateStatusTeller', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, approved_by } = req.body;
            try {
                if (data.status == 1) {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve, reject) => {
                        database_config_1.connection.query("UPDATE teller_list SET status=? WHERE id=?", [0, data.id], (err, result) => {
                            if (err)
                                throw err;
                            resolve(result);
                            // res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
                        });
                    }).then((response) => __awaiter(this, void 0, void 0, function* () {
                        database_config_1.connection.query("UPDATE user_account SET status=? WHERE username=?", [0, data.tellerCode], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Updates.`);
                        });
                    }));
                }
                else {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve, reject) => {
                        database_config_1.connection.query("UPDATE teller_list SET status=? WHERE id=?", [1, data.id], (err, result) => {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    }).then((response) => __awaiter(this, void 0, void 0, function* () {
                        // update for user account
                        database_config_1.connection.query("UPDATE user_account SET status=?, approved_by=? WHERE username=?", [1, approved_by, data.tellerCode], (err, result) => {
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Updates.`);
                        });
                    }));
                }
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/updateTeller_list', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { firstname, lastname, contactNo, email, locationAddress, id } = req.body;
            try {
                yield Promise.resolve(database_config_1.connection.query("UPDATE teller_list SET firstname=?, lastname=?, contactNo=?, email=?, location=? WHERE id=?", [firstname, lastname, contactNo, email, locationAddress, id], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Updates.`);
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/saveIbarangayForapproval', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, franchiseCode, branchCode } = req.body;
            const type = 'BRA';
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve, reject) => {
                    database_config_1.connection.query("SELECT * from branch_count WHERE type=?", ['iBarangay'], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                })
                    .then((responce) => __awaiter(this, void 0, void 0, function* () {
                    const i = parseInt(responce[0].count) + 1;
                    yield Promise.all([
                        Promise.resolve(database_config_1.connection.query("INSERT INTO ibrgy_list (branchCode, ib_fbranchCode, ib_ibrgyyCode, franchiseName, branchType, lastname, firstname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [branchCode, franchiseCode, type + ('000' + i).slice(-4), data.branchName, 'iBarangay', data.lastname, data.firstname, data.contactNo, data.email, data.locationAddress, 1], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(database_config_1.connection.query("UPDATE branch_count SET count=? WHERE type=?", [i, 'iBarangay'], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        }))
                    ]);
                    database_config_1.connection.commit();
                    res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Added.`);
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
        this.router.post('/getIbarangayForApproval', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { code } = req.body;
            try {
                (code === 'admin')
                    ? yield Promise.resolve(database_config_1.connection.query("SELECT * FROM ibrgy_list  WHERE status=? OR status=? ", [1, 2], (err, result) => {
                        if (err)
                            throw err;
                        res.status(main_enums_1.Codes.SUCCESS).send(result);
                    }))
                    : yield Promise.resolve(database_config_1.connection.query("SELECT * FROM ibrgy_list WHERE branchCode=? AND status=? OR branchCode=? AND status=?", [code, 1, code, 2], (err, result) => {
                        if (err)
                            throw err;
                        res.status(main_enums_1.Codes.SUCCESS).send(result);
                    }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/approvedIBstatus', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, code, wallet, dateApproved } = req.body;
            const saltRounds = process.env.SALT_ROUNDS;
            const password = process.env.STAT_PASSWORD;
            const salt = bcrypt_1.default.genSaltSync(parseInt(saltRounds));
            const savePassword = bcrypt_1.default.hashSync(password, salt);
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve, reject) => {
                    database_config_1.connection.query("UPDATE ibrgy_list SET status=?, date_approved=? WHERE ib_id=?", [0, dateApproved, id], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                }).then((reponse) => __awaiter(this, void 0, void 0, function* () {
                    yield Promise.all([
                        Promise.resolve(database_config_1.connection.query("INSERT INTO wallet (branchCode, approved_wallet, current_wallet) VALUES (?, ?, ?)", [code, wallet, wallet], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        })), Promise.resolve(database_config_1.connection.query("INSERT INTO user_account (user_type, username, password, status) VALUES (?, ?, ?, ?)", ['iBarangay', code, savePassword, 0], (err, result) => {
                            if (err)
                                throw err;
                            return result;
                        }))
                    ]);
                    database_config_1.connection.commit();
                    res.status(main_enums_1.Codes.SUCCESS).send(`${main_enums_1.Message.SUCCESS} Added.`);
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
        this.router.post('/declineiBarangay', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, dateDecline } = req.body;
            try {
                database_config_1.connection.query('UPDATE ibrgy_list SET status=?, date_decline=? WHERE ib_id = ?', [2, dateDecline, id], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/saveiB', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, fcode } = req.body;
            const type = 'BRA';
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve) => {
                    database_config_1.connection.query("SELECT * from branch_count WHERE type=?", ['iBarangay'], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                }).then((response) => __awaiter(this, void 0, void 0, function* () {
                    const i = parseInt(response[0].count) + 1;
                    if (!response.length) {
                        res.status(main_enums_1.Codes.SUCCESS).send({ message: 'undefined' });
                    }
                    else {
                        yield new Promise((resolve) => {
                            database_config_1.connection.query('SELECT branchCode FROM franchise_list WHERE fbranchCode=?', [fcode], (err, result) => {
                                if (err)
                                    throw err;
                                resolve(result);
                            });
                        }).then((result) => __awaiter(this, void 0, void 0, function* () {
                            (!result.length)
                                ? res.status(main_enums_1.Codes.SUCCESS).send({ message: 'undefined' })
                                : yield Promise.all([
                                    Promise.resolve(database_config_1.connection.query("INSERT INTO ibrgy_list (branchCode, ib_fbranchCode, ib_ibrgyyCode, franchiseName, branchType, lastname, firstname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [result[0].branchCode, fcode, type + ('000' + i).slice(-4), data.branchName, 'iBarangay', data.lastname, data.firstname, data.contactNo, data.email, data.locationAddress, 1], (err, result) => {
                                        if (err)
                                            throw err;
                                        return result;
                                    })), Promise.resolve(database_config_1.connection.query("UPDATE branch_count SET count=? WHERE type=?", [i, 'iBarangay'], (err, result) => {
                                        if (err)
                                            throw err;
                                        res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
                                    }))
                                ]);
                            database_config_1.connection.commit();
                        }));
                    }
                })).catch((err) => {
                    database_config_1.connection.rollback();
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                });
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/addIbarangayTeller', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, ibCode } = req.body;
            const type = 'BRT';
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve, reject) => {
                    database_config_1.connection.query("SELECT * from branch_count WHERE type=?", ['BRTeller'], (err, result) => {
                        if (err)
                            return reject(err);
                        resolve(result);
                    });
                }).then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (!response.length) {
                        res.status(main_enums_1.Codes.SUCCESS).send({ message: 'notFound' });
                    }
                    else {
                        const i = parseInt(response[0].count) + 1;
                        const saltRounds = process.env.SALT_ROUNDS;
                        const password = process.env.STAT_PASSWORD;
                        const salt = bcrypt_1.default.genSaltSync(parseInt(saltRounds));
                        const savePassword = bcrypt_1.default.hashSync(password, salt);
                        yield new Promise((resolve, reject) => {
                            database_config_1.connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyyCode=?", [ibCode], (err, result) => {
                                if (err)
                                    return reject(err);
                                resolve(result);
                            });
                        }).then((res) => __awaiter(this, void 0, void 0, function* () {
                            yield Promise.all([
                                Promise.resolve(database_config_1.connection.query("INSERT INTO teller_list (branchCode, ibrgy_code, tellerCode, type, firstname, lastname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [res[0].branchCode, ibCode, type + ('000' + i).slice(-4), 'Teller', data.firstname, data.lastname, data.contactNo, data.email, data.locationAddress, 0], (err, result) => {
                                    if (err)
                                        throw err;
                                    return result;
                                })), Promise.resolve(database_config_1.connection.query("INSERT INTO user_account (user_type, username, password) VALUES (?, ?, ?) ", ['Teller', type + ('000' + i).slice(-4), savePassword], (err, result) => {
                                    if (err)
                                        throw err;
                                    return result;
                                })), Promise.resolve(database_config_1.connection.query("UPDATE branch_count SET count=? WHERE type=?", [i, 'BRTeller'], (err, result) => {
                                    if (err)
                                        throw err;
                                    return result;
                                }))
                            ]);
                        }));
                    }
                    res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
                    database_config_1.connection.commit();
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                database_config_1.connection.rollback();
            }
        }));
    }
    /**
     * endwatchBlock
     */
    get routerObject() { return this.router; }
}
const user = new BranchController();
user.watchRequests();
exports.default = user.routerObject;
//# sourceMappingURL=branch.route.js.map