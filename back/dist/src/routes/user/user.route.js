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
class UserController {
    constructor() {
        this.router = express_1.default.Router();
    }
    watchRequests() {
        /**
         * @Functions
         */
        this.router.post('/checkuserAccount', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve) => {
                    database_config_1.connection.query("SELECT * FROM user_account WHERE username=? AND status=?", [username, 0], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                }).then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (!response.length) {
                        res.status(400).send('Something Went Wrong');
                    }
                    else {
                        if (bcrypt_1.default.compareSync(password, response[0].password)) {
                            res.status(main_enums_1.Codes.SUCCESS).send(response[0]);
                        }
                        else {
                            res.status(400).send('Something Went Wrong');
                        }
                    }
                })).catch(err => {
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/getUser', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { type, type_code } = req.body;
            try {
                switch (type) {
                    case 'Branch Head':
                        // query here
                        database_config_1.connection.query("SELECT * FROM branch_list WHERE branchCode=?", [type_code], (err, result) => {
                            if (err)
                                throw err;
                            res.status(main_enums_1.Codes.SUCCESS).send(result);
                        });
                        break;
                    case 'Franchise':
                        // query here
                        database_config_1.connection.query("SELECT * FROM franchise_list WHERE fbranchCode=?", [type_code], (err, result) => {
                            if (err)
                                throw err;
                            res.status(main_enums_1.Codes.SUCCESS).send(result);
                        });
                        break;
                    case 'iBarangay':
                        // query here
                        database_config_1.connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyyCode=?", [type_code], (err, result) => {
                            if (err)
                                throw err;
                            res.status(main_enums_1.Codes.SUCCESS).send(result);
                        });
                        break;
                    case 'Teller':
                        // query here 
                        database_config_1.connection.query("SELECT * FROM teller_list WHERE tellerCode=?", [type_code], (err, result) => {
                            if (err)
                                throw err;
                            res.status(main_enums_1.Codes.SUCCESS).send(result);
                        });
                        break;
                    default:
                }
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/getUserForBfranchise', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { branchCode } = req.body;
            try {
                database_config_1.connection.query('SELECT * FROM franchise_list WHERE branchCode=?', [branchCode], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        })); //branch head display for his only franchise
        this.router.post('/getForBranchIB', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { branchCode } = req.body;
            try {
                database_config_1.connection.query('SELECT * FROM ibrgy_list WHERE branchCode=?', [branchCode], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        })); // branch head display for ibarangay
        this.router.post('/getForBranchTeller', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { branchCode } = req.body;
            try {
                database_config_1.connection.query("SELECT * FROM teller_list WHERE branchCode=?", [branchCode], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        //start for franchise user queries
        this.router.post('/getForFranchiseList', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { fbranchCode } = req.body;
            try {
                database_config_1.connection.query("SELECT * FROM ibrgy_list WHERE ib_fbranchCode=?", [fbranchCode], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/getTellerlistFr', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { fbranchCode } = req.body;
            try {
                database_config_1.connection.query("SELECT * FROM teller_list WHERE fiB_code=?", [fbranchCode], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/getTellerIbarangay', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ib_code } = req.body;
            try {
                database_config_1.connection.query("SELECT * FROM teller_list WHERE ibrgy_code=?", [ib_code], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/changePassword', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { code, data } = req.body;
            const saltRounds = 10;
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const newPassword = bcrypt_1.default.hashSync(data.newPassword, salt);
            try {
                database_config_1.connection.beginTransaction();
                return new Promise((resolve) => {
                    database_config_1.connection.query("SELECT * FROM user_account WHERE username=?", [code], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                }).then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (!response.length) {
                        res.status(main_enums_1.Codes.SUCCESS).send({ message: 'undefined' });
                    }
                    else {
                        /**
                         * compare password current to database password
                         */
                        (bcrypt_1.default.compareSync(data.currentPassword, response[0].password))
                            ? yield Promise.resolve(database_config_1.connection.query("UPDATE user_account SET password=? WHERE username=?", [newPassword, code], (err, result) => {
                                if (err)
                                    throw err;
                                res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
                            }))
                            : res.status(main_enums_1.Codes.SUCCESS).send({ message: 'notMatch' });
                    }
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.get('/getUsernameBranchCode', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                database_config_1.connection.query("SELECT username FROM user_account WHERE whitelist=?", [''], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/putWhitelist', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, updated_by } = req.body;
            try {
                const date = new Date();
                database_config_1.connection.query("UPDATE user_account SET whitelist=?, update_by=?, updated_date=? WHERE username=?", [data.whitelist, updated_by, date, data.branchCode], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send('success');
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.get('/getBranchCodeWithWhitelist', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                database_config_1.connection.query("SELECT * FROM user_account WHERE user_type!=? AND whitelist!=?", ['Admin', ''], (err, result) => {
                    if (err)
                        throw err;
                    res.status(main_enums_1.Codes.SUCCESS).send(result);
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/getBranchNameOfTeller', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                        yield Promise.resolve(database_config_1.connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyyCode=?", [response[0].ibrgy_code], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(200).send(JSON.stringify(result));
                        }));
                    }
                    else if (response[0].fiB_Code !== '' && response[0].ibrgy_code === '') {
                        yield Promise.resolve(database_config_1.connection.query("SELECT * FROM franchise_list WHERE fbranchCode=?", [response[0].fiB_Code], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                        }));
                    }
                    else if (response[0].fiB_Code === '' && response[0].ibrgy_code !== '') {
                        yield Promise.resolve(database_config_1.connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyCode=?", [response[0].ibrgy_code], (err, result) => {
                            if (err)
                                throw err;
                            database_config_1.connection.commit();
                            res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                        }));
                    }
                })).catch(err => {
                    database_config_1.connection.rollback();
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                });
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/getNameOfBranchesForModalAdmin', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { fbranchCode } = req.body;
            try {
                const code = fbranchCode.slice(0, 3);
                if (code === 'BRA') {
                    yield Promise.resolve(database_config_1.connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyyCode=?", [fbranchCode], (err, result) => {
                        if (err)
                            throw err;
                        res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                    }));
                }
                else if (code === 'FRA') {
                    yield Promise.resolve(database_config_1.connection.query("SELECT * FROM franchise_list WHERE fbranchCode=?", [fbranchCode], (err, result) => {
                        if (err)
                            throw err;
                        res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                    }));
                }
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/updateAccountInformationBranches', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { type, code, data } = req.body;
            try {
                (type === 'Franchise')
                    ? yield Promise.resolve(database_config_1.connection.query("UPDATE franchise_list SET lastname=?, firstname=?, contactNo=?, email=?, location=?,  update_byss=? WHERE fbranchCode=?", [data.ownerLastname, data.ownerFirstname, data.contactNo, data.emailAdd, data.address, 'you', code], (err, result) => {
                        if (err)
                            throw err;
                        res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                    }))
                    : yield Promise.resolve(database_config_1.connection.query("UPDATE ibrgy_list SET lastname=?, firstname=?, contactNo=?, email=?, location=?, updated_byy=? WHERE ib_ibrgyyCode=?", [data.ownerLastname, data.ownerFirstname, data.contactNo, data.emailAdd, data.address, 'you', code], (err, result) => {
                        if (err)
                            throw err;
                        res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(result));
                    }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/changePasswordForBranches', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { type, code, data } = req.body;
            /***
             *@FranchiseCode FRA
             *@iBarangayCode BRA
             *@TellerCode FRT BRT
             */
            const saltRounds = 10;
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const newPassword = bcrypt_1.default.hashSync(data.newPassword, salt);
            // if(user_code === 'FRT' || user_code === 'BRT'){
            // 	try{
            // 		connection.beginTransaction()
            // 		return await new Promise((resolve, reject)=>{
            // 			connection.query("SELECT * FROM teller_list WHERE branchCode=? AND tellerCode=?", [code, data.username], (err, result)=>{
            // 				if(err) throw err;
            // 				resolve(result)
            // 			})
            // 		}).then(async(result:any) => {
            // 			if(!result.length){
            // 				res.status(200).send({message : 'NotMatch'})
            // 			}else{
            // 				await new Promise((resolve, reject)=>{
            // 					connection.query("SELECT * FROM user_account WHERE username=?", [data.username], (err, result)=>{
            // 						if(err) throw err;
            // 						resolve(result)
            // 					})
            // 				}).then(async(response:any)=>{
            // 					if(!response.length){
            // 						res.status(200).send({message : 'userNameNotMatch'})
            // 					}else{
            // 						(bcrypt.compareSync(data.currentPassword, response[0].password))
            // 						? await Promise.resolve(
            // 							connection.query("UPDATE user_account SET password=?, update_by=?, updated_date=? WHERE username=?", 
            // 							[newPassword, code, dateNow, data.username], (err, result)=>{
            // 								if(err) throw err;
            // 								res.status(200).send ({ message : 'ok' })
            // 							})
            // 						)
            // 						: res.status(200).send({message : 'wrongPassword'})
            // 					}
            // 				})
            // 			}
            // 		}).catch((err : any) => {
            // 			res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            // 		});
            // 	}catch(err:any){
            // 		res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            // 	}
            // }else if(user_code === 'FRA'){
            // 	try{
            // 		connection.beginTransaction()
            // 		return await new Promise((resolve, reject)=>{
            // 			connection.query("SELECT * FROM franchise_list WHERE branchCode=? AND fbranchCode=?", [code, data.username], (err, result)=>{
            // 				if(err) throw err;
            // 				resolve(result)
            // 			})
            // 		}).then(async(response : any)=>{
            // 			if(!response.length){
            // 				res.status(200).send({message : 'NotMatch'})
            // 			}else{
            // 				/**
            // 				 * @checkThePassword
            // 				 */
            // 				await new Promise((resolve, reject)=>{
            // 					connection.query("SELECT * FROM user_account WHERE username=?", [data.username], (err, result)=>{
            // 						if(err) throw err;
            // 						resolve(result)
            // 					})
            // 				}).then(async(result:any)=>{
            // 					if(!result.length){
            // 						res.status(200).send({message : 'userNameNotMatch'})
            // 					}else{
            // 						(bcrypt.compareSync(data.currentPassword, result[0].password))
            // 						? await Promise.resolve(
            // 							connection.query("UPDATE user_account SET password=?, update_by=?, updated_date=? WHERE username=?", 
            // 							[newPassword, code, dateNow, data.username], (err, result)=>{
            // 								if(err) throw err;
            // 								res.status(200).send ({ message : 'ok' })
            // 							})
            // 						)
            // 						: res.status(200).send({message : 'wrongPassword'})
            // 					}
            // 				}) 
            // 			}
            // 		}) 
            // 	}catch(err:any){
            // 		res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            // 	}
            // }else if(user_code === 'BRA'){
            // 	try{
            // 		connection.beginTransaction()
            // 		return await new Promise((resolve, reject) =>{
            // 			connection.query("SELECT * FROM ibrgy_list WHERE branchCode=? AND ib_ibrgyyCode=?", [code, data.username], (err, result)=>{
            // 				if(err) throw err;
            // 				resolve(result)
            // 			})
            // 		}).then(async(response:any)=>{
            // 			if(!response.length){
            // 				res.status(200).send({message : 'NotMatch'})
            // 			}else{
            // 				/**
            // 				 * @If MATCH DIN CHECK PASSWORD
            // 				 */
            // 				await new Promise((resolve, reject)=>{
            // 					connection.query("SELECT * FROM user_account WHERE username=?", [data.username], (err, result)=>{
            // 						if(err) throw err;
            // 						resolve(result)
            // 					})
            // 				}).then(async(result:any)=>{
            // 					if(!result.length){
            // 						res.status(200).send({message : 'userNameNotMatch'})
            // 					}else{
            // 						(bcrypt.compareSync(data.currentPassword, result[0].password))
            // 						? await Promise.resolve(
            // 							connection.query("UPDATE user_account SET password=?, update_by=?, updated_date=? WHERE username=?", 
            // 							[newPassword, code, dateNow, data.username], (err ,result)=>{
            // 								if(err) throw err;
            // 								res.status(200).send ({ message : 'ok' })
            // 							})
            // 						)
            // 						: res.status(200).send({ message : 'ok' })
            // 					}
            // 				})
            // 			}
            // 		})
            // 	}catch(err:any){
            // 		res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            // 	}
            // }
        }));
        this.router.post('/loginLogs', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user_type, username } = req.body;
            const data = ['isOnline', username, user_type, JSON.stringify(req.body), main_enums_1.Codes.SUCCESS];
            try {
                database_config_1.connection.beginTransaction();
                yield new Promise((resolve, reject) => {
                    database_config_1.connection.query("INSERT INTO activitylogs (affectedColumn, reference, loggedBy, dataBefore, logStatusCode) VALUES (?, ?, ?, ?, ?) ", data, (err, result) => {
                        if (err)
                            return reject(err);
                        resolve(result);
                    });
                }).then(() => {
                    res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
                    database_config_1.connection.commit();
                }).catch((err) => {
                    throw err;
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                database_config_1.connection.rollback();
            }
        }));
        this.router.post('/signOut', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { type, code } = req.body;
            const data = ['offLine', code, type, '', main_enums_1.Codes.SUCCESS];
            try {
                database_config_1.connection.beginTransaction();
                database_config_1.connection.query("INSERT INTO activitylogs (affectedColumn, reference, loggedBy, dataBefore, logstatusCode) VALUES (?, ?, ?, ?, ?) ", data, (err, result) => {
                    if (err)
                        throw err;
                    return true;
                });
                database_config_1.connection.commit();
                res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/tellerChangePassword', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, user } = req.body;
            const saltRounds = 10;
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const newPassword = bcrypt_1.default.hashSync(data.newPassword, salt);
            try {
                database_config_1.connection.beginTransaction();
                return yield new Promise((resolve) => {
                    database_config_1.connection.query('SELECT * FROM user_account WHERE username=?', [user], (err, result) => {
                        if (err)
                            throw err;
                        resolve(result);
                    });
                }).then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (!response.length) {
                        res.status(main_enums_1.Codes.SUCCESS).send({ message: 'somethingWrong' });
                    }
                    else {
                        (bcrypt_1.default.compareSync(data.currentPassword, response[0].password))
                            ? yield Promise.resolve(database_config_1.connection.query("UPDATE user_account SET password=? , updated_date=? WHERE username=?", [newPassword, new Date(), user], (err, result) => {
                                if (err)
                                    throw err;
                                res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
                            }))
                            : res.status(main_enums_1.Codes.SUCCESS).send({ message: 'notMatch' });
                    }
                    database_config_1.connection.commit();
                })).catch(err => {
                    database_config_1.connection.rollback();
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                });
            }
            catch (err) {
                database_config_1.connection.rollback();
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
    } /**
    *@ENDoFWatchRequest
     */
    get routerObject() { return this.router; }
}
const user = new UserController();
user.watchRequests();
exports.default = user.routerObject;
//# sourceMappingURL=user.route.js.map