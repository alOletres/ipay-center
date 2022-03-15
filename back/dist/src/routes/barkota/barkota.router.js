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
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const database_config_1 = require("./../../configs/database.config");
const main_enums_1 = require("../../utils/main.enums");
const moment_1 = __importDefault(require("moment"));
const { BARKOTA_STAGING } = main_enums_1.Endpoints;
const { username, password } = main_enums_1.barkotaCredential;
class BarkotaController {
    constructor() {
        this.router = express_1.default.Router();
    }
    watchRequests() {
        /**
         * @Functions
         */
        this.router.get('/getBarkotaToken', (req, res) => __awaiter(this, void 0, void 0, function* () {
            // res.set('Access-Control-Allow-Origin', '*');
            // res.set('Access-Control-Allow-Origin-Heders', "Origin, X-Requested-With, Content-Type, Accept, access_token, refresh_token")
            const data = { grant_type: 'client_credentials' };
            yield axios_1.default.request({
                method: 'POST',
                headers: { accept: "application/json", 'content-type': 'application/x-www-form-urlencoded' },
                auth: {
                    username: username,
                    password: password,
                },
                data: qs_1.default.stringify(data),
                url: `${BARKOTA_STAGING}/oauth`,
            }).then(function (response) {
                res.status(main_enums_1.Codes.SUCCESS).send(response.data); //token is here
            }).catch(function (err) {
                if (err.response.data.detail !== null) {
                    res.status(500).send(err.response.data.detail);
                }
                else {
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                }
            });
        }));
        this.router.post('/getShippingLines', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { access_token, expires_in, token_type } = req.body;
            axios_1.default.get(`${BARKOTA_STAGING}/outlet/shipping-lines/getshippinglines`, {
                headers: { Authorization: 'Bearer '.concat(access_token) }
            })
                .then(response => {
                res.status(main_enums_1.Codes.SUCCESS).send(response.data);
            }).catch((error) => {
                console.log(error);
            });
        }));
        this.router.post('/getRoutes', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, companId } = req.body;
            const companyid = '8bb73d03-06b4-47c7-80c7-59301f770eda';
            yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/routes/getroutesbyshippingcompany`, { companId: companyid }, {
                headers: { 'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token.access_token)
                }
            })
                .then(response => {
                res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
            }).catch((err) => {
                if (err && err.response && err.response.data && err.response.data.detail && err.response.data.detail !== null) {
                    res.status(500).send(err.response.data.detail);
                }
                else {
                    console.log(err.response.data.detail);
                    res.status(500).send(err.response.data.detail);
                    // res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
                }
            });
        }));
        this.router.post('/listOfTrips', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, origin_id, data, departure_date } = req.body;
            const payload = {
                origin: origin_id,
                destination: data.destination,
                passengerCount: 1,
                departureDate: departure_date
            };
            res.cookie('user', true);
            yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/voyage-accommodations/bylocation`, payload, {
                headers: { 'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token.access_token) }
            }).then(response => {
                res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
            }).catch(err => {
                console.log(err);
                res.status(500).send('Internal ERROR');
            });
        }));
        this.router.post('/ticketPrice', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, voyageId, priceGroupsId, routeAccommodationId } = req.body;
            try {
                const payload = {
                    voyageId: voyageId,
                    priceGroupId: priceGroupsId,
                    routeAccommodationId: routeAccommodationId
                };
                yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/passage/pricing/byvoyageaccommodation`, payload, {
                    headers: { 'Content-Type': 'application/json',
                        Authorization: 'Bearer '.concat(token.access_token) }
                }).then(response => {
                    res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
                }).catch(err => {
                    if (err && err.response && err.response.data && err.response.data.detail && err.response.data.detail !== null) {
                        res.status(500).send(err.response.data.detail);
                    }
                    else {
                        res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                    }
                });
            }
            catch (err) {
                return undefined;
            }
        }));
        this.router.post('/getVoyageCots', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, voyageId, routeAccommodationId } = req.body;
            try {
                const payload = {
                    voyageId: voyageId,
                    routeAccommodationId: routeAccommodationId
                };
                axios_1.default.post(`${BARKOTA_STAGING}/outlet/cots/getcotsbyvoyage`, payload, {
                    headers: { 'Content-Type': 'application/json',
                        Authorization: 'Bearer '.concat(token.access_token) }
                }).then(response => {
                    res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
                }).catch(err => {
                    if (err.response.data.detail !== null) {
                        res.status(500).send(err.response.data.detail);
                    }
                    else {
                        res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        }));
        this.router.post('/computeCharges', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, passengerList, departurePriceId } = req.body;
            // passengerList.forEach((passengers:any) => {
            // 		// console.log(passengers);
            // });
            try {
                const payload = {
                    passengerList: [{
                            passenger: {
                                firstname: passengerList.firstname,
                                lastname: passengerList.lastname,
                                mi: passengerList.middleInitial,
                                isDriver: parseInt(passengerList.isDriver),
                                gender: parseInt(passengerList.gender),
                                birthdate: (0, moment_1.default)(passengerList.birthdate).format().slice(0, 10),
                                idnumber: passengerList.idnumber,
                                nationality: passengerList.nationality,
                                discountType: passengerList.discount,
                                filenames: ''
                            },
                            departurePriceId: departurePriceId
                        }]
                };
                yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/compute-charges/passage`, payload, {
                    headers: { 'Content-Type': 'application/json',
                        Authorization: 'Bearer '.concat(token.access_token) }
                }).then(response => {
                    res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
                }).catch(err => {
                    if (err && err.response && err.response.data && err.response.data.detail && err.response.data.detail !== null) {
                        res.status(500).send(err.response.data.detail);
                    }
                    else {
                        res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                    }
                });
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.post('/bookNow', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { passengers, contactInfo, token, } = req.body;
            /**
             *
             * @params passengers = [...{}]
             * @values
             * @values
             */
            const payload = {
                passengers: [],
                // cargo: {},
                contactInfo: {},
                allowPromotionsNotification: 0
            };
            // passengers.forEach((passengers: any) => {
            payload.passengers = [{
                    passenger: {
                        firstname: passengers[0].firstName,
                        lastname: passengers[0].lastName,
                        mi: passengers[0].middleInitial,
                        isDriver: parseInt(passengers[0].isDriver),
                        gender: parseInt(passengers[0].gender),
                        birthdate: (0, moment_1.default)(passengers[0].birthDate).format().slice(0, 10),
                        idnumber: null,
                        nationality: passengers[0].nationality,
                        discountType: passengers[0].discount.toString(),
                        filenames: ''
                    },
                    departurePriceId: passengers[0].departurePriceId,
                    departureCotId: passengers[0].departureCotId
                }];
            payload.contactInfo = {
                name: contactInfo.completeName,
                email: contactInfo.email,
                mobile: `+63${contactInfo.mobileNumber}`,
                address: contactInfo.address
            };
            payload.allowPromotionsNotification = parseInt(contactInfo.promotion);
            // });
            yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/confirm-booking`, payload, {
                headers: { 'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token.access_token) }
            }).then(response => {
                res.status(200).send(response.data);
            }).catch(err => {
                if (err.response.data.detail !== null) {
                    res.status(500).send(err.response.data.detail);
                }
                else if (err.response.data === undefined) {
                    res.status(500).send({ message: 'Internal Error' });
                }
                else {
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                }
            });
        }));
        this.router.post('/searchTicket', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { dateFrom, dateTo, data, token } = req.body;
            const payload = {
                dateFrom: dateFrom,
                dateTo: dateTo,
                ticketNumber: data.ticketNumber,
                firstname: data.firstname,
                lastname: data.lastname
            };
            yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/search-ticket/searchbyreferenceanddate`, payload, {
                headers: { 'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token.access_token) }
            }).then(response => {
                res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
            }).catch(err => {
                if (err.response.data.detail !== null) {
                    res.status(500).send(err.response.data.detail);
                }
                else {
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                }
            });
        }));
        this.router.post('/searchVoucherByTicket', (req, res) => __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const { data, token } = req.body;
            const payload = {
                barkotaTicketId: data.barkotaTicketId
            };
            yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/search-ticket/getvoucherurl`, payload, {
                headers: { 'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token.access_token) }
            }).then(response => {
                res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
            }).catch(err => {
                if (err.response.data.detail !== null) {
                    res.status(500).send(err.response.data.detail);
                }
                else {
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                }
            });
        }));
        this.router.post('/searchTransactionNo', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, token } = req.body;
            const payload = {
                barkotaTransactionId: data.barkotaTransactionId
            };
            yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/bt/search/transactionvoucherurl`, payload, {
                headers: { 'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token.access_token) }
            }).then(response => {
                res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
            }).catch(err => {
                if (err.response.data.detail !== null) {
                    res.status(500).send(err.response.data.detail);
                }
                else {
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                }
            });
        }));
        this.router.post('/refundTicket', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, token } = req.body;
            const payload = {
                ticketId: data.ticketId,
                reasonId: data.reasonId,
                reason: data.reason,
                filename1: '',
                filename2: ''
            };
            yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/ticket/refund/ticket`, payload, {
                headers: { 'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token.access_token) }
            }).then(response => {
                res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
            }).catch(err => {
                if (err.response.data.detail !== null) {
                    res.status(500).send(err.response.data.detail);
                }
                else {
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                }
            });
        }));
        this.router.post('/voidTicket', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, token } = req.body;
            const payload = {
                ticketId: data.ticketId,
                remarks: data.remarks
            };
            yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/ticket/void/ticket`, payload, {
                headers: { 'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token.access_token) }
            }).then(response => {
                res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
            }).catch(err => {
                if (err.response.data.detail !== null) {
                    res.status(500).send(err.response.data.detail);
                }
                else {
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                }
            });
        }));
        this.router.post('/revalidateTicket', (req, res) => __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);		
            const { token, ticketId, newVoyageId, cotno, newPriceDetailId } = req.body;
            const payload = {
                ticketId: ticketId,
                newVoyageId: newVoyageId,
                cotno: cotno,
                newPriceDetailId: newPriceDetailId
            };
            yield axios_1.default.post(`${BARKOTA_STAGING}/outlet/ticket/revalidate/ticket`, payload, {
                headers: { 'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token.access_token) }
            }).then(response => {
                res.status(main_enums_1.Codes.SUCCESS).send(JSON.stringify(response.data));
            }).catch(err => {
                if (err.response.data.detail !== null) {
                    res.status(500).send(err.response.data.detail);
                }
                else {
                    res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                }
            });
        }));
        this.router.post('/saveBarkotaBookingTransactions', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { passengers, contactInfo, shippingVessel, displayTicketTotal, ticketUrl, currentWallet, branchCode, userLog } = req.body;
            const type = 'BRK';
            try {
                if (userLog.slice(0, 3) === 'FRT') {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve, reject) => {
                        database_config_1.connection.query("SELECT * FROM branch_count WHERE type=? ORDER  BY idCount DESC LIMIT 1", ['barkota'], (err, result) => {
                            if (err)
                                return reject(err);
                            resolve(result);
                        });
                    }).then((response) => __awaiter(this, void 0, void 0, function* () {
                        const i = (parseInt(response[0].count) + (0 + 1));
                        var ticketPrice = 0;
                        var total_collections = 0;
                        ticketPrice = (displayTicketTotal[0].total + 20); //mao ni na price ang mo minus sa wallet 
                        total_collections = ticketPrice + 30;
                        const collections = {
                            collection: total_collections,
                            sales: ticketPrice,
                            income: 30
                        };
                        const currentW = currentWallet - ticketPrice;
                        yield Promise.all([
                            Promise.resolve(database_config_1.connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", [currentW, branchCode], (err, result) => {
                                if (err)
                                    throw err;
                            })),
                            Promise.resolve(database_config_1.connection.query("INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?, ?, ?, ? ,?, ?, ?)", [branchCode, userLog, collections.collection, collections.sales, collections.income, type + ('000' + i).slice(-4), 'Confirm'], (err, result) => {
                                if (err)
                                    throw err;
                            })), Promise.resolve(database_config_1.connection.query("INSERT INTO barkota (barkota_code, shippingLine, origin, destination, departureDate, voyageId, customer_name, contact_personNo, contact_personAdd, ticket_url, ticket_totalPrice, ipayService_charge, franchise_charge, branchCode, transacted_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [type + ('000' + i).slice(-4), shippingVessel[0].voyage.vesselName, shippingVessel[0].voyage.route.origin, shippingVessel[0].voyage.route.destination, shippingVessel[0].voyage.departureDateTime, shippingVessel[0].voyage.id, `${passengers[0].firstName} ${passengers[0].lastName}`, `+63${contactInfo.mobileNumber}`, contactInfo.address, ticketUrl, displayTicketTotal[0].total, 20, 30, branchCode, userLog, 'Confirm'], (err, result) => {
                                if (err)
                                    throw err;
                            })), Promise.resolve(database_config_1.connection.query("UPDATE branch_count SET count=? WHERE type=?", [i, 'barkota'], (err, result) => {
                                if (err)
                                    throw err;
                                res.status(200).send(type + ('000' + i).slice(-4));
                            }))
                        ]);
                        database_config_1.connection.commit();
                    })).catch(err => {
                        res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                    });
                }
                else {
                    database_config_1.connection.beginTransaction();
                    return new Promise((resolve, reject) => {
                        database_config_1.connection.query("SELECT * FROM branch_count WHERE type=?", ['barkota'], (err, result) => {
                            if (err)
                                return reject(err);
                            resolve(result);
                        });
                    }).then((response) => __awaiter(this, void 0, void 0, function* () {
                        if (!response.length) {
                            res.status(main_enums_1.Codes.SUCCESS).send({ message: 'notFound' });
                        }
                        else {
                            const i = (parseInt(response[0].count) + (0 + 1));
                            var ticketPrice = 0;
                            var total_collections = 0;
                            ticketPrice = (displayTicketTotal[0].total + 20); //mao ni na price ang mo minus sa wallet 
                            total_collections = ticketPrice + 25;
                            const currentW = currentWallet - ticketPrice;
                            const collections = {
                                collection: total_collections,
                                sales: ticketPrice,
                                income: 25
                            };
                            yield new Promise((resolve, reject) => {
                                database_config_1.connection.query("SELECT ib_fbranchCode FROM ibrgy_list WHERE ib_ibrgyyCode=?", [branchCode], (err, result) => {
                                    if (err)
                                        return reject(err);
                                    resolve(result);
                                });
                            }).then((result) => __awaiter(this, void 0, void 0, function* () {
                                if (!result.length) {
                                    res.status(main_enums_1.Codes.SUCCESS).send({ message: 'notFound' });
                                }
                                else {
                                    yield Promise.all([
                                        Promise.resolve(database_config_1.connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", [currentW, branchCode], (err, result) => {
                                            if (err)
                                                throw err;
                                            return result;
                                        })),
                                        Promise.resolve(database_config_1.connection.query("INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?, ?, ?, ? ,?, ?, ?)", [branchCode, userLog, collections.collection, collections.sales, collections.income, type + ('000' + i).slice(-4), 'Confirm'], (err, result) => {
                                            if (err)
                                                throw err;
                                            return result;
                                        })), Promise.resolve(database_config_1.connection.query("INSERT INTO barkota (barkota_code, shippingLine, origin, destination, departureDate, voyageId, customer_name, contact_personNo, contact_personAdd, ticket_url, ticket_totalPrice, ipayService_charge, franchise_charge, branchCode, transacted_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [type + ('000' + i).slice(-4), shippingVessel[0].voyage.vesselName, shippingVessel[0].voyage.route.origin, shippingVessel[0].voyage.route.destination, shippingVessel[0].voyage.departureDateTime, shippingVessel[0].voyage.id, `${passengers[0].firstName} ${passengers[0].lastName}`, `+63${contactInfo.mobileNumber}`, contactInfo.address, ticketUrl, displayTicketTotal[0].total, 20, collections.income, branchCode, userLog, 'Confirm'], (err, result) => {
                                            if (err)
                                                throw err;
                                            return result;
                                        })), Promise.resolve(database_config_1.connection.query("UPDATE branch_count SET count=? WHERE type=?", [i, 'barkota'], (err, result) => {
                                            if (err)
                                                throw err;
                                            return result;
                                        })), Promise.resolve(database_config_1.connection.query("INSERT INTO f_commission (franchise, ibarangay, teller, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?,?) ", [result[0].ib_fbranchCode, branchCode, userLog, collections.collection, collections.sales, 5, type + ('000' + i).slice(-4), 'Confirm'], (err, result) => {
                                            if (err)
                                                throw err;
                                            return result;
                                        }))
                                    ]);
                                    res.status(main_enums_1.Codes.SUCCESS).send({ message: 'ok' });
                                    database_config_1.connection.commit();
                                }
                            }));
                        }
                    })).catch((err) => {
                        res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                        database_config_1.connection.rollback();
                    });
                }
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
                database_config_1.connection.rollback();
            }
        }));
        this.router.post('/getByTellerTransactions', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { transacted_by } = req.body;
            /**
             * @value transacted_by Teller Code
            */
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM barkota WHERE transacted_by=?", [transacted_by], (err, result) => {
                    if (err)
                        throw err;
                    res.status(200).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
        this.router.get('/getBarkotaTransactions', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(database_config_1.connection.query("SELECT * FROM barkota", (err, result) => {
                    if (err)
                        throw err;
                    res.status(200).send(JSON.stringify(result));
                }));
            }
            catch (err) {
                res.status(err.status || main_enums_1.Codes.INTERNAL).send(err.message || main_enums_1.Message.INTERNAL);
            }
        }));
    }
    /**
     * @end for watch list
    */
    get routerObject() { return this.router; }
}
const barkota = new BarkotaController();
barkota.watchRequests();
exports.default = barkota.routerObject;
function result(result) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=barkota.router.js.map