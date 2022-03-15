import express, { response } from 'express'
import { Router } from 'express-serve-static-core'
import axios from "axios";
import qs from 'qs';
import { connection } from './../../configs/database.config'
import { Message, Codes, Endpoints, barkotaCredential } from '../../utils/main.enums'
import moment from 'moment';
import { ticketPrices, walletCollection } from './../../utils/main.interfaces'
const { BARKOTA_STAGING } = Endpoints
const { username, password } = barkotaCredential

class BarkotaController{

    private router: Router
    constructor() {
        this.router = express.Router()
    }

    watchRequests() {

        /**
         * @Functions
         */
		

		this.router.get('/getBarkotaToken', async (req, res) => {

            // res.set('Access-Control-Allow-Origin', '*');
			// res.set('Access-Control-Allow-Origin-Heders', "Origin, X-Requested-With, Content-Type, Accept, access_token, refresh_token")


            const data = { grant_type: 'client_credentials' };

             await axios.request({

				method: 'POST',

                headers: {accept: "application/json", 'content-type': 'application/x-www-form-urlencoded' },

                auth:{
                    username: username,
                    password: password,
                  },

                data: qs.stringify(data),

                url : `${ BARKOTA_STAGING }/oauth`,

              }).then(function(response){

					res.status(Codes.SUCCESS).send(response.data) //token is here
					
              }).catch(function(err){
					if(err.response.data.detail !== null){

						res.status(500).send(err.response.data.detail)
	
					}else{
	
						res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
	
					}
					
              })
		})
		this.router.post('/getShippingLines',async (req, res) => {

			const { access_token, expires_in, token_type } = req.body

			axios.get(`${ BARKOTA_STAGING }/outlet/shipping-lines/getshippinglines`,{

				headers : { Authorization : 'Bearer '.concat(access_token)  }
			})

			.then(response=>{

				res.status(Codes.SUCCESS).send(response.data)
				
			}).catch((error)=>{
				console.log(error);
				
			})
		})

		this.router.post('/getRoutes',async (req, res) => {
			const { token, companId } = req.body
			
			const companyid = '8bb73d03-06b4-47c7-80c7-59301f770eda'
			
			await axios.post(`${ BARKOTA_STAGING }/outlet/routes/getroutesbyshippingcompany`,
			
			{companId : companyid},{

			headers : {'Content-Type' : 'application/json',
						Authorization : 'Bearer '.concat(token.access_token)
			}	
			})
			.then(response=>{
				
				res.status(Codes.SUCCESS).send(JSON.stringify(response.data))
				
			}).catch((err)=>{
				
				if(err && err.response && err.response.data && err.response.data.detail && err.response.data.detail !== null){
	
					res.status(500).send(err.response.data.detail)

				}else{
					console.log(err.response.data.detail);
					
					res.status(500).send(err.response.data.detail)
					// res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)

				}
			})
		})
		
		this.router.post('/listOfTrips',async (req, res) => {

			const { token, origin_id, data, departure_date } = req.body

			const payload = {
				origin : origin_id,
				destination : data.destination,
				passengerCount : 1,
				departureDate : departure_date
			}

			res.cookie('user', true)

			await axios.post(`${ BARKOTA_STAGING }/outlet/voyage-accommodations/bylocation`,payload, {

			headers : {'Content-Type' : 'application/json',
						Authorization : 'Bearer '.concat(token.access_token)}

			}).then(response=>{
				res.status(Codes.SUCCESS).send(JSON.stringify(response.data))
			}).catch(err=>{
				console.log(err);
				

				res.status(500).send('Internal ERROR')
			})
		})

		this.router.post('/ticketPrice',async (req, res) => {
			const { token, voyageId, priceGroupsId, routeAccommodationId } = req.body

			
			try{
				const payload : ticketPrices = {
					voyageId : voyageId,
					priceGroupId : priceGroupsId,
					routeAccommodationId: routeAccommodationId
				}
				await axios.post(`${ BARKOTA_STAGING }/outlet/passage/pricing/byvoyageaccommodation`,payload,{

					headers : {'Content-Type' : 'application/json',
					Authorization : 'Bearer '.concat(token.access_token)}
	
				}).then(response=>{
					
					res.status(Codes.SUCCESS).send(JSON.stringify(response.data))
	
				}).catch(err=>{		
					if(err && err.response && err.response.data && err.response.data.detail && err.response.data.detail !== null){
		
						res.status(500).send(err.response.data.detail)
	
					}else{
	
						res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
	
					}
				})
			}catch(err:any){
				return undefined
			}
		})

		this.router.post('/getVoyageCots',async (req, res) => {
            const { token, voyageId, routeAccommodationId} = req.body
			try{
				const payload = {
					voyageId: voyageId,
					routeAccommodationId : routeAccommodationId
				}
				axios.post(`${ BARKOTA_STAGING }/outlet/cots/getcotsbyvoyage`,payload,{
	
					headers : {'Content-Type' : 'application/json',
					Authorization : 'Bearer '.concat(token.access_token)}
	
				}).then(response=>{
					res.status(Codes.SUCCESS).send(JSON.stringify(response.data))
					
				}).catch(err=>{
					if(err.response.data.detail !== null){
	
						res.status(500).send(err.response.data.detail)
	
					}else{
	
						res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
	
					}
					
				})
			}catch(e){
				console.log(e);
				
			}
        })

		this.router.post('/computeCharges',async (req, res) => {

			const { token , passengerList, departurePriceId } = req.body
			
			// passengerList.forEach((passengers:any) => {
			// 		// console.log(passengers);
				
			// });
			try{
				const payload = {

					passengerList: [{
	
						passenger: {
	
							firstname	: passengerList.firstname,
							lastname	: passengerList.lastname,
							mi			: passengerList.middleInitial,
							isDriver	: parseInt(passengerList.isDriver),
							gender 		: parseInt(passengerList.gender),
							birthdate	: moment(passengerList.birthdate).format().slice(0, 10),
							idnumber	: passengerList.idnumber,
							nationality : passengerList.nationality,
							discountType : passengerList.discount,
							filenames 	: ''
	
						},
	
						departurePriceId: departurePriceId
					}]
		
				}
				await axios.post(`${ BARKOTA_STAGING }/outlet/compute-charges/passage`,payload,{
					
					headers : {'Content-Type' : 'application/json',
					Authorization : 'Bearer '.concat(token.access_token)}
				
				}).then(response=>{
					res.status(Codes.SUCCESS).send(JSON.stringify(response.data))
					
				}).catch(err=>{
					if(err && err.response && err.response.data && err.response.data.detail && err.response.data.detail !== null){
	
						res.status(500).send(err.response.data.detail)
	
					}else{
	
						res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
	
					}
					
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				
			}
			
		})

		this.router.post('/bookNow',async (req, res, next) => {
			
			const { passengers, contactInfo, token,  } = req.body
				
			interface PayloadInterface {
				passengers: object[],
				// cargo: object,
				contactInfo: object,
				allowPromotionsNotification: number
					
			}
			/**
			 * 
			 * @params passengers = [...{}]
			 * @values
			 * @values
			 */
						
			const payload: PayloadInterface = {
				passengers: [],
				// cargo: {},
				contactInfo: {},
				allowPromotionsNotification: 0
			}

			// passengers.forEach((passengers: any) => {
				payload.passengers = [{
					passenger: {
						firstname	: passengers[0].firstName,
						lastname	: passengers[0].lastName,
						mi			: passengers[0].middleInitial,
						isDriver	: parseInt(passengers[0].isDriver),
						gender 		: parseInt(passengers[0].gender),
						birthdate	: moment(passengers[0].birthDate).format().slice(0, 10),
						idnumber	: null,
						nationality : passengers[0].nationality,
						discountType : passengers[0].discount.toString(),
						filenames 	: ''
					},
					departurePriceId : passengers[0].departurePriceId,
					departureCotId : passengers[0].departureCotId
				}]

				payload.contactInfo = {
					name : contactInfo.completeName,
					email : contactInfo.email,
					mobile : `+63${contactInfo.mobileNumber}`,
					address : contactInfo.address
				}

				payload.allowPromotionsNotification = parseInt(contactInfo.promotion)
			// });

			
			await axios.post(`${ BARKOTA_STAGING }/outlet/confirm-booking`,payload,{
						
				headers : {'Content-Type' : 'application/json', 
				Authorization : 'Bearer '.concat(token.access_token)}

			}).then(response=>{

				res.status(200).send(response.data)

			}).catch(err =>{

				if(err.response.data.detail !== null){
					res.status(500).send(err.response.data.detail)

				}else if(err.response.data === undefined){

					res.status(500).send({ message : 'Internal Error'})
					
				}else{
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)

				}
			})

		})

		this.router.post('/searchTicket', async (req, res) => {
			
			const { dateFrom, dateTo, data, token } = req.body
			
			const payload = {
				
				dateFrom: dateFrom,
				dateTo : dateTo,
				ticketNumber : data.ticketNumber,
				firstname : data.firstname,
				lastname : data.lastname

			}

			await axios.post(`${ BARKOTA_STAGING }/outlet/search-ticket/searchbyreferenceanddate`,payload,{
				
				headers : {'Content-Type' : 'application/json',
				Authorization : 'Bearer '.concat(token.access_token)}

			}).then(response=>{
				
				res.status(Codes.SUCCESS).send(JSON.stringify(response.data))

			}).catch(err=>{
				if(err.response.data.detail !== null){

					res.status(500).send(err.response.data.detail)

				}else{

					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)

				}
			})

		})
		this.router.post('/searchVoucherByTicket',async (req, res) => {
			// console.log(req.body);
			const { data, token } = req.body

			const payload = {

				barkotaTicketId : data.barkotaTicketId 
			
			}

			await axios.post(`${ BARKOTA_STAGING }/outlet/search-ticket/getvoucherurl`,payload,{
				
				headers : {'Content-Type' : 'application/json',
				Authorization : 'Bearer '.concat(token.access_token)}

			}).then(response=>{
				res.status(Codes.SUCCESS).send(JSON.stringify(response.data))

			}).catch(err=>{
				
				if(err.response.data.detail !== null){

					res.status(500).send(err.response.data.detail)

				}else{

					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)

				}
			})
						
		})

		this.router.post('/searchTransactionNo',async (req, res) => {
	
			const {  data, token } = req.body
			const payload = {
				barkotaTransactionId : data.barkotaTransactionId
			}
			
			await axios.post(`${ BARKOTA_STAGING }/outlet/bt/search/transactionvoucherurl`,payload,{

				headers : {'Content-Type' : 'application/json',
				Authorization : 'Bearer '.concat(token.access_token)}

			}).then(response=>{

				res.status(Codes.SUCCESS).send(JSON.stringify(response.data))

			}).catch(err=>{
				

				if(err.response.data.detail !== null){

					res.status(500).send(err.response.data.detail)

				}else{

					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)

				}
			})
		})
		this.router.post('/refundTicket',async (req, res) => {
	
			const { data, token } = req.body
			
			const payload = {
				ticketId 	: data.ticketId,
				reasonId 	: data.reasonId,
				reason 		: data.reason,
				filename1 	: '',
				filename2 	: ''
			}

			await axios.post(`${ BARKOTA_STAGING }/outlet/ticket/refund/ticket`,payload,{

				headers : {'Content-Type' : 'application/json',
				Authorization : 'Bearer '.concat(token.access_token)}

			}).then(response=>{
				
				res.status(Codes.SUCCESS).send(JSON.stringify(response.data))
				
			}).catch(err=>{
				if(err.response.data.detail !== null){

					res.status(500).send(err.response.data.detail)

				}else{

					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)

				}
			})
		})

		this.router.post('/voidTicket',async (req , res) => {

			const { data, token } = req.body

			const payload = { 
				ticketId : data.ticketId,
				remarks : data.remarks
			}

			await axios.post(`${ BARKOTA_STAGING }/outlet/ticket/void/ticket`,payload,{

				headers : {'Content-Type' : 'application/json',
				Authorization : 'Bearer '.concat(token.access_token)}

			}).then(response=>{
				
				res.status(Codes.SUCCESS).send(JSON.stringify(response.data))
			}).catch(err=>{

				if(err.response.data.detail !== null){

					res.status(500).send(err.response.data.detail)

				}else{

					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)

				}
			})
		})

		this.router.post('/revalidateTicket',async (req, res) => {
			// console.log(req.body);		
			const { token, ticketId, newVoyageId, cotno, newPriceDetailId } = req.body

			const payload = {
				ticketId 			: ticketId,
				newVoyageId 		: newVoyageId,
				cotno 				: cotno, 
				newPriceDetailId 	: newPriceDetailId
			}

			await	axios.post(`${ BARKOTA_STAGING }/outlet/ticket/revalidate/ticket`,payload,{

				headers : {'Content-Type' : 'application/json',
				Authorization : 'Bearer '.concat(token.access_token)}

			}).then(response=>{
				res.status(Codes.SUCCESS).send(JSON.stringify(response.data))
			}).catch(err=>{

				if(err.response.data.detail !== null){

					res.status(500).send(err.response.data.detail)

				}else{

					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)

				}
			})

		})


		this.router.post('/saveBarkotaBookingTransactions',async (req, res) => {
			const { passengers, contactInfo, shippingVessel, displayTicketTotal, ticketUrl, currentWallet, branchCode, userLog  } = req.body
			
			const type = 'BRK'
			
			try{
				if(userLog.slice(0, 3) === 'FRT'){

					connection.beginTransaction()
					return new Promise((resolve, reject)=>{
						connection.query("SELECT * FROM branch_count WHERE type=? ORDER  BY idCount DESC LIMIT 1", ['barkota'], (err, result)=>{
							if(err) return reject(err);
							resolve(result)
						})
					}).then(async (response:any)=>{

						const i = (parseInt(response[0].count) + ( 0 + 1))
						var ticketPrice = 0;
						var total_collections = 0;

						ticketPrice = (displayTicketTotal[0].total + 20) //mao ni na price ang mo minus sa wallet 
						total_collections = ticketPrice + 30

						const collections : walletCollection = {
							
							collection : total_collections,
							sales : ticketPrice,
							income : 30

						}

						const currentW = currentWallet - ticketPrice
						
						await Promise.all([
							Promise.resolve(
								
								connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", 
								[currentW, branchCode], (err,result)=>{
									if(err) throw err;
									
								})
							
							)
							,Promise.resolve(

								connection.query("INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?, ?, ?, ? ,?, ?, ?)", 
								[branchCode, userLog, collections.collection, collections.sales, collections.income, type+('000'+i).slice(-4), 'Confirm'],(err, result)=>{
									if(err) throw err;
								})

							),Promise.resolve(
								
								connection.query("INSERT INTO barkota (barkota_code, shippingLine, origin, destination, departureDate, voyageId, customer_name, contact_personNo, contact_personAdd, ticket_url, ticket_totalPrice, ipayService_charge, franchise_charge, branchCode, transacted_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
								[type+('000'+i).slice(-4), shippingVessel[0].voyage.vesselName, shippingVessel[0].voyage.route.origin, shippingVessel[0].voyage.route.destination, shippingVessel[0].voyage.departureDateTime, shippingVessel[0].voyage.id, `${passengers[0].firstName} ${passengers[0].lastName}`, `+63${contactInfo.mobileNumber}`, contactInfo.address, ticketUrl, displayTicketTotal[0].total, 20, 30, branchCode, userLog, 'Confirm'], (err, result)=>{
									if(err) throw err;
								})
							), Promise.resolve(
								
								connection.query("UPDATE branch_count SET count=? WHERE type=?",
								[i, 'barkota'], (err, result) => {
									if(err) throw err
									
									res.status(200).send(type+('000'+i).slice(-4))
									
								})
							)
							
						])
						connection.commit()
					}).catch(err=>{

						res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
					})

				}else{

					connection.beginTransaction()
					return new Promise((resolve , reject)=>{
						connection.query("SELECT * FROM branch_count WHERE type=?", ['barkota'], (err, result)=>{
							if(err) return reject(err);
							resolve(result)
						})
					}).then(async(response:any)=>{

						if(!response.length){

							res.status(Codes.SUCCESS).send({ message : 'notFound' })
						
						}else{
							
							const i = (parseInt(response[0].count) + ( 0 + 1))

							var ticketPrice = 0;
							var total_collections = 0;

							ticketPrice = (displayTicketTotal[0].total + 20) //mao ni na price ang mo minus sa wallet 
							
							total_collections = ticketPrice + 25

							const currentW = currentWallet - ticketPrice

							const collections : walletCollection = {
							
								collection : total_collections,
								sales : ticketPrice,
								income : 25
	
							}
							
							await new Promise((resolve, reject)=>{
								connection.query("SELECT ib_fbranchCode FROM ibrgy_list WHERE ib_ibrgyyCode=?", [branchCode], (err, result)=>{
									if(err) return reject(err)
									resolve(result)
								})
							}).then(async(result:any)=>{
								
								if(!result.length){
									res.status(Codes.SUCCESS).send({ message : 'notFound' })
								}else{

									await Promise.all([
										Promise.resolve(
											
											connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", 
											[currentW, branchCode], (err,result)=>{
												if(err) throw err;
												return result
											})
										
										)
										,Promise.resolve(
			
											connection.query("INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?, ?, ?, ? ,?, ?, ?)", 
											[branchCode, userLog, collections.collection, collections.sales, collections.income, type+('000'+i).slice(-4), 'Confirm'],(err, result)=>{
												if(err) throw err;
												return result
											})
			
										),Promise.resolve(
											
											connection.query("INSERT INTO barkota (barkota_code, shippingLine, origin, destination, departureDate, voyageId, customer_name, contact_personNo, contact_personAdd, ticket_url, ticket_totalPrice, ipayService_charge, franchise_charge, branchCode, transacted_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
											[type+('000'+i).slice(-4), shippingVessel[0].voyage.vesselName, shippingVessel[0].voyage.route.origin, shippingVessel[0].voyage.route.destination, shippingVessel[0].voyage.departureDateTime, shippingVessel[0].voyage.id, `${passengers[0].firstName} ${passengers[0].lastName}`, `+63${contactInfo.mobileNumber}`, contactInfo.address, ticketUrl, displayTicketTotal[0].total, 20, collections.income, branchCode, userLog, 'Confirm'], (err, result)=>{
												if(err) throw err;
												return result
											})
										), Promise.resolve(
											
											connection.query("UPDATE branch_count SET count=? WHERE type=?",
											[i, 'barkota'], (err, result) => {
												if(err) throw err
												return result
											})
										), Promise.resolve(
											connection.query("INSERT INTO f_commission (franchise, ibarangay, teller, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?,?) ",
											[result[0].ib_fbranchCode, branchCode, userLog, collections.collection, collections.sales, 5, type+('000'+i).slice(-4), 'Confirm'],(err, result)=>{
												if(err) throw err
												return result
											})
										)
										
									])
									res.status(Codes.SUCCESS).send({ message : 'ok' })
									connection.commit()
								}
							})
						}
					}).catch((err:any)=>{
						res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
						connection.rollback()
					})
				}
				
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}
			
		})

		this.router.post('/getByTellerTransactions',async (req, res) => {
			const { transacted_by } = req.body
			/**
			 * @value transacted_by Teller Code
			*/

			try{
				await Promise.resolve(
					connection.query("SELECT * FROM barkota WHERE transacted_by=?", [transacted_by], (err, result)=>{
						if(err) throw err
						res.status(200).send(JSON.stringify(result))		
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})


		this.router.get('/getBarkotaTransactions',async (req, res) => {			
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM barkota",(err, result)=>{
						if(err) throw err;
					
						res.status(200).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})
    }
	/**
	 * @end for watch list
	*/

    get routerObject() { return this.router }
}

const barkota = new BarkotaController()

barkota.watchRequests()
export default barkota.routerObject

function result(result: any) {
	throw new Error('Function not implemented.');
}

