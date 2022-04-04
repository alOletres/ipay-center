import dotenv, { parse } from 'dotenv'
dotenv.config()
import express, { response } from 'express'
import { Router } from 'express-serve-static-core'
import axios from "axios";
import qs from 'qs';
import { connection } from './../../configs/database.config'
import { Message, Codes, Endpoints } from '../../utils/main.enums'
import moment, { locale } from 'moment';
import { ticketPrices, walletCollection } from './../../utils/main.interfaces'
const { BARKOTA_STAGING } = Endpoints
import { authenticationToken } from '../../middleware/auth';
import { checkWallet } from '../multisys/multisys.router';

const customQuery = (Query :any , values :any) =>{
	
	return new Promise((resolve, reject)=>{
		
		connection.query(Query, values, (err, result)=>{
			if(err) {
				reject(err)
			}else{
				resolve(result)
			}
		})
	})
}

const updateWallet = async(data:any) => {
	try{
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{
			connection.query("SELECT * FROM wallet WHERE branchCode=?", [data], (err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then(async(response:any)=>{
			const walletAdded = response[0].current_wallet + 5

			await Promise.resolve(
				connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", [walletAdded, data], (err, result)=>{
					if(err) throw err;
					return result
				})
			)
			connection.commit()
		})
	}catch(err:any){
		connection.rollback()
		return err
	}
}

const voidTicket = async(BRANCHCODE:any, BARKOTACODE:any) =>{
	try{
		return await new Promise((resolve, reject)=>{
			connection.query("SELECT * FROM barkota WHERE barkota_code=? AND branchCode=?", [BARKOTACODE, BRANCHCODE], (err,result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then(async(response:any)=>{

			if(!response.length){
				return 'again'
			}else{
				await new Promise((resolve,reject)=>{
					/**get the current wallet to be update in wallet table */
					connection.query("SELECT * FROM wallet WHERE branchCode=?", [BRANCHCODE], (err, result)=>{
						if(err) return reject(err)
						resolve(result)
					})
				}).then(async(wallet:any)=>{

					if(!wallet.length){
						return 'again'
					}else{

						const voidedTransaction = wallet[0].current_wallet + parseInt(response[0].ticket_totalPrice)
	
						/***UDPATE WALLET FIRST AND STATUS OF 
						 * wallet
						 * wallet history
						 * barkota table
						 */
		
						await Promise.all([
							Promise.resolve(
								connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", [voidedTransaction, BRANCHCODE], (err, result)=>{
									if(err) throw err
									return result
								})
							),
							Promise.resolve(
								connection.query("UPDATE wallet_historytransaction SET status=? WHERE transaction_id=?", ['Void', BARKOTACODE], (err,result)=>{
									if(err) throw err
									return result
								})
							),
							Promise.resolve(
								connection.query("UPDATE barkota SET status=? WHERE barkota_code=?", ['Void', BARKOTACODE], (err, result)=>{
									if(err) throw err
									return result
								})
							)
						])

					}

				})
				
				connection.commit()
				return 'ok'
			}
		})

	}catch(err){
		connection.rollback()
		return err
	}
}
const bookToBarkota = async(data:any) =>{
	
	const { passengers, contactInfo, token,  } = data
				
	try{
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
		// const response = {
		// 	data: {
		// 		printUrl: 'https://barkota-reseller-php-staging-4kl27j34za-uc.a.run.app/print/voucher.php?c=https%3A%2F%2Fbarkota-reseller-php-staging-4kl27j34za-uc.a.run.app%2Fob%2Fvoucher%2Fcheck%3Fp%3Di63mjd3vmfguu1tm0m89I6iWdn0A0vDKSKH3mEd7wo2ih%252BiN%252B2R2mpgxlJ7ThLZdpnPBc7%252BzlKdOfvWpS%252ByYoSx4KaeB4iA%252FUqp2lKFAgrQ4AH8RrVsWL5AoTJE%253D'
		// 	}
		// }  
		
		const response : any = await axios.post(`${ BARKOTA_STAGING }/outlet/confirm-booking`,payload,{
					
			headers : {'Content-Type' : 'application/json', 
			Authorization : 'Bearer '.concat(token.access_token)}

		})

		return response
	}catch(err:any){
		return err.response.data
	}

}
const generateSeries = async(data:any) =>{
	try{
		let series :any
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{
			connection.query("SELECT * FROM branch_count WHERE type=?", [data], (err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then(async(response : any )=>{
			if(!response.length){
				return 'again'
			}else{
				let count = response[0].count + 1
				series = `${'BRK'}${String(count).padStart(4, '0')}`

				await Promise.resolve(
					connection.query("Update branch_count SET count=? WHERE type=?", [count, data], (err, result)=>{
						if(err) throw err
						return result
					})
				)
			
			}
			connection.commit()
			return series
		})
	}catch(err:any){
		connection.rollback()
		return err
	}
}
const saveToDb = async(data:any, branchCode :any, ticketUrl:any, CURRENT_WALLET :any) =>{
	let commisionResponse :any
	const { tellerCode, passengers, contactInfo, shippingVessel, displayTicketTotal } = data
	const { voyage } = shippingVessel[0]
	const { firstName, lastName, middleInitial } = passengers[0]
	const { mobileNumber, address } = contactInfo
	const { total } = displayTicketTotal[0]

	const ipayCharge : any = 20
	const outletCharge :any = tellerCode.slice(0, 3) === 'FRT' ? 30  : 25
	const status : any = 'Confirm'

	const series :any = await generateSeries('barkota')
 	/**wallet history transaction */
	let collection : any = ipayCharge + outletCharge + total
	let sales :any = ipayCharge + total
	const dataTwo : any = [branchCode, tellerCode, collection, sales , outletCharge, series, status ]
	/**WALLET DEDUCTION TOTAL */
	let deductedWallet :any =  CURRENT_WALLET - sales
	/**data if commision if teller is i barangay  */
	let commision : any = 5
	const dataThree = [branchCode, tellerCode, collection, sales, commision, series, status]
	try{
		connection.beginTransaction()
		let Query = "INSERT INTO barkota (barkota_code, shippingLine, origin, destination, departureDate, voyageId, customer_name, contact_personNo, contact_personAdd, ticket_url, ticket_totalPrice, ipayService_charge, franchise_charge, branchCode, transacted_by, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		const datas :any = [series, voyage.shippingLine.name , voyage.route.origin, voyage.route.destination, voyage.departureDateTime, voyage.id, `${ firstName } ${ middleInitial } ${ lastName }`, mobileNumber, address, ticketUrl, total, ipayCharge, outletCharge, branchCode, tellerCode, status]
		
		let res :any = await customQuery(Query, datas)
		/**table affected wallet history transaction */
		let Query1 = "INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?)"
		/**@values datatwo */

		const res1 :any = res.affectedRows > 0 ? await customQuery(Query1, dataTwo) :'' 
		/**current wallet */
		let Query2 = "UPDATE wallet SET current_wallet=? WHERE branchCode=?"
		let values2 = [deductedWallet, branchCode]
		const res2 :any = res1.affectedRows > 0 ? await customQuery(Query2, values2) : ''
		res2.affectedRows > 0 ? commisionResponse = tellerCode.slice(0, 3) === 'BRT' ? await insertCommision(dataThree, CURRENT_WALLET) : 'ok' : ''
		
		// return await new Promise((resolve, reject)=>{
		// 	connection.query("INSERT INTO barkota (barkota_code, shippingLine, origin, destination, departureDate, voyageId, customer_name, contact_personNo, contact_personAdd, ticket_url, ticket_totalPrice, ipayService_charge, franchise_charge, branchCode, transacted_by, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", datas,(err, result)=>{
		// 		if(err) return reject(err)
		// 		resolve(result)
		// 	})
		// }).then(async(res:any)=>{
		// 	/**
		// 	 * table affected
		// 	 * wallet 
		// 	 * wallet history transaction
		// 	 * f_commision = BRT
		// 	 * ibrgy_list
		// 	 * franchise list
		// 	 */
		// 	if(res.affectedRows === 1){
		// 		await Promise.all([
		// 			Promise.resolve(
		// 				connection.query("INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?)", dataTwo, (err, result)=>{
		// 					if(err) throw err
		// 					return result
		// 				})
		// 			),Promise.resolve(
		// 				/**update wallet */
		// 				connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", [deductedWallet, branchCode], (err, result)=>{
		// 					if(err)  throw err;
		// 					return result
		// 				})
		// 			),Promise.resolve(
		// 				commisionResponse = tellerCode.slice(0, 3) === 'BRT' ? await insertCommision(dataThree, CURRENT_WALLET) : 'ok'
		// 			)
		// 		])
		// 	}else{
		// 		return 'notFound'
		// 	}
			
		// 	connection.commit()
		// 	return commisionResponse
		// })
		connection.commit()
		return commisionResponse

	}catch(err:any){
		
		connection.rollback()
		return err
	}
} 
const insertCommision = async(data:any, wallet:any) =>{
	
	try{
		connection.beginTransaction()
		
		let Query = "SELECT ib_fbranchCode FROM ibrgy_list WHERE ib_ibrgyyCode=?"
		let values = [data[0]]

		const response :any = await customQuery(Query, values)

		data.unshift(response[0].ib_fbranchCode)
		let Query1 = "SELECT * FROM wallet WHERE branchCode=?"
		
		const response1 :any = await customQuery(Query1, values)
		const commision :any = response1[0].current_wallet + 5

		let Query2 = "UPDATE wallet SET current_wallet=? WHERE branchCode=?"
		let values1 = [commision, response[0].ib_fbranchCode]

		const response2 :any = response1.affectedRows > 0 ? await customQuery(Query2, values1)  : ''
		 
		let Query3 = "INSERT INTO f_commission (franchise, ibarangay, teller, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?,?)"

		response2.affectedRows > 0 ? await customQuery(Query3, data) : ''

		connection.commit()
		return 'ok'
		// return await new Promise((resolve, reject)=>{
		// 	connection.query("SELECT ib_fbranchCode FROM ibrgy_list WHERE ib_ibrgyyCode=?", [data[0]], (err, result)=>{
		// 		if(err) return reject(err)
		// 		resolve(result)
		// 	})
		// }).then(async(response:any)=>{
		// 	data.unshift(response[0].ib_fbranchCode)
			
		// 	await new Promise((resolve ,reject )=>{
		// 		connection.query("SELECT * FROM wallet WHERE branchCode=?", [data[0]], (err, result)=>{
		// 			if(err) return reject(err)
		// 			resolve(result)
		// 		})
		// 	}).then(async(res:any)=>{

		// 		const commision :any = res[0].current_wallet + 5
		// 		await Promise.all([
		// 			Promise.resolve(
		// 				connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", [commision, response[0].ib_fbranchCode], (err,result)=>{
		// 					if(err) throw err;
		// 					return result
		// 				})
		// 			),
		// 			Promise.resolve(
		// 				connection.query("INSERT INTO f_commission (franchise, ibarangay, teller, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?,?)", data, (err, result)=>{
		// 					if(err) throw err;
		// 					return result
		// 				})
		// 			)
		// 		])
		// 	})
		// 	connection.commit()
		// 	return 'ok'
		// }) 
	}catch(err:any){
		connection.rollback()
		return err
	}
}

const username = String(process.env.CLIENT_ID)
const password = String(process.env.CLIENT_SECRET)
class BarkotaController{

    private router: Router
    constructor() {
        this.router = express.Router()
    }

    watchRequests() {

        /**
         * @Functions
         */
		

		this.router.get('/getBarkotaToken',authenticationToken, async (req, res) => {

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
		this.router.post('/getShippingLines',authenticationToken,async (req, res) => {

			const { access_token, expires_in, token_type } = req.body

			await axios.get(`${ BARKOTA_STAGING }/outlet/shipping-lines/getshippinglines`,{

				headers : { Authorization : 'Bearer '.concat(access_token)  }
			})

			.then(response=>{

				res.status(Codes.SUCCESS).send(response.data)
				
			}).catch((err:any)=>{
				res.status(500).send(err.response.data.detail)
			})
		})

		this.router.post('/getRoutes',authenticationToken,async (req, res) => {
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
				res.status(500).send(err.response.data.detail)
			})
		})
		
		this.router.post('/listOfTrips',authenticationToken,async (req, res) => {

			const { token, origin_id, data, departure_date } = req.body

			const payload = {
				origin : origin_id,
				destination : data.destination,
				passengerCount : 1,
				departureDate : departure_date
			}
			await axios.post(`${ BARKOTA_STAGING }/outlet/voyage-accommodations/bylocation`,payload, {

			headers : {'Content-Type' : 'application/json',
						Authorization : 'Bearer '.concat(token.access_token)}

			}).then(response=>{
				res.status(Codes.SUCCESS).send(JSON.stringify(response.data))
			}).catch(err=>{
				res.status(500).send(err.response.data.detail)
			})
		})

		this.router.post('/ticketPrice',authenticationToken,async (req, res) => {
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

		this.router.post('/getVoyageCots',authenticationToken,async (req, res) => {
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
			}catch(err:any){
				res.status(500).send(err.response.data.detail)
			}
        })

		this.router.post('/computeCharges',authenticationToken,async (req, res) => {

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

		this.router.post('/bookNow',authenticationToken,async (req, res, next) => {
			
			const { passengers, contactInfo, token,  } = req.body
				
			try{
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
				})
			}catch(err:any){
				if(err.response.data.detail !== null){
					res.status(500).send(err.response.data.detail)

				}else if(err.response.data === undefined){

					res.status(500).send({ message : 'Internal Error'})
					
				}else{
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)

				}
			}

		})

		this.router.post('/searchTicket',authenticationToken, async (req, res) => {
			
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
		this.router.post('/searchVoucherByTicket',authenticationToken,async (req, res) => {
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

		this.router.post('/searchTransactionNo',authenticationToken,async (req, res) => {
	
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
		this.router.post('/refundTicket',authenticationToken,async (req, res) => {
	
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

		this.router.post('/voidTicket',authenticationToken,async (req , res) => {

			const { data, token } = req.body

			const payload = { 
				ticketId : data.ticketId,
				remarks : data.remarks
			}
			const responses :any = await voidTicket(data.branchCode, data.transactionCode)

			if(responses === 'ok'){

				await axios.post(`${ BARKOTA_STAGING }/outlet/ticket/void/ticket`,payload,{

					headers : {'Content-Type' : 'application/json',
					Authorization : 'Bearer '.concat(token.access_token)}

				}).then(async(response)=>{
					res.status(Codes.SUCCESS).send(JSON.stringify(response.data))
				}).catch(err=>{

					if(err.response.data.detail !== null){
						
						res.status(500).send(err.response.data.detail)

					}else{

						res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)

					}
				})

			}else if(responses === 'again'){
				res.status(Codes.SUCCESS).send({ success :  'again' })
			}else{
				res.status(Codes.SUCCESS).send({ success :  'again' })
			}
			
		})

		this.router.post('/revalidateTicket',authenticationToken,async (req, res) => {
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


		this.router.post('/saveBarkotaBookingTransactions',authenticationToken,async (req, res) => {
			// const { passengers, contactInfo, shippingVessel, displayTicketTotal, ticketUrl, currentWallet, branchCode, userLog  } = req.body
			
			// const type = 'BRK'
			
			// try{
			// 	if(userLog.slice(0, 3) === 'FRT'){

			// 		connection.beginTransaction()
			// 		return new Promise((resolve, reject)=>{
			// 			connection.query("SELECT * FROM branch_count WHERE type=? ORDER  BY idCount DESC LIMIT 1", ['barkota'], (err, result)=>{
			// 				if(err) return reject(err);
			// 				resolve(result)
			// 			})
			// 		}).then(async (response:any)=>{

			// 			const i = (parseInt(response[0].count) + ( 0 + 1))
			// 			var ticketPrice = 0;
			// 			var total_collections = 0;

			// 			ticketPrice = (displayTicketTotal[0].total + 20) //mao ni na price ang mo minus sa wallet 
			// 			total_collections = ticketPrice + 30

			// 			const collections : walletCollection = {
							
			// 				collection : total_collections,
			// 				sales : ticketPrice,
			// 				income : 30

			// 			}

			// 			const currentW = currentWallet - ticketPrice
						
			// 			await Promise.all([
			// 				Promise.resolve(
								
			// 					connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", 
			// 					[currentW, branchCode], (err,result)=>{
			// 						if(err) throw err;
									
			// 					})
							
			// 				)
			// 				,Promise.resolve(

			// 					connection.query("INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?, ?, ?, ? ,?, ?, ?)", 
			// 					[branchCode, userLog, collections.collection, collections.sales, collections.income, type+('000'+i).slice(-4), 'Confirm'],(err, result)=>{
			// 						if(err) throw err;
			// 					})

			// 				),Promise.resolve(
								
			// 					connection.query("INSERT INTO barkota (barkota_code, shippingLine, origin, destination, departureDate, voyageId, customer_name, contact_personNo, contact_personAdd, ticket_url, ticket_totalPrice, ipayService_charge, franchise_charge, branchCode, transacted_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
			// 					[type+('000'+i).slice(-4), shippingVessel[0].voyage.vesselName, shippingVessel[0].voyage.route.origin, shippingVessel[0].voyage.route.destination, shippingVessel[0].voyage.departureDateTime, shippingVessel[0].voyage.id, `${passengers[0].firstName} ${passengers[0].lastName}`, `+63${contactInfo.mobileNumber}`, contactInfo.address, ticketUrl, displayTicketTotal[0].total, 20, 30, branchCode, userLog, 'Confirm'], (err, result)=>{
			// 						if(err) throw err;
			// 					})
			// 				), Promise.resolve(
								
			// 					connection.query("UPDATE branch_count SET count=? WHERE type=?",
			// 					[i, 'barkota'], (err, result) => {
			// 						if(err) throw err
									
			// 						res.status(200).send(type+('000'+i).slice(-4))
									
			// 					})
			// 				)
							
			// 			])
			// 			connection.commit()
			// 		}).catch(err=>{

			// 			res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			// 		})

			// 	}else{

			// 		connection.beginTransaction()
			// 		return new Promise((resolve , reject)=>{
			// 			connection.query("SELECT * FROM branch_count WHERE type=?", ['barkota'], (err, result)=>{
			// 				if(err) return reject(err);
			// 				resolve(result)
			// 			})
			// 		}).then(async(response:any)=>{

			// 			if(!response.length){

			// 				res.status(Codes.SUCCESS).send({ message : 'notFound' })
						
			// 			}else{
							
			// 				const i = (parseInt(response[0].count) + ( 0 + 1))

			// 				var ticketPrice = 0;
			// 				var total_collections = 0;

			// 				ticketPrice = (displayTicketTotal[0].total + 20) //mao ni na price ang mo minus sa wallet 
							
			// 				total_collections = ticketPrice + 25

			// 				const currentW = currentWallet - ticketPrice

			// 				const collections : walletCollection = {
							
			// 					collection : total_collections,
			// 					sales : ticketPrice,
			// 					income : 25
	
			// 				}
							
			// 				await new Promise((resolve, reject)=>{
			// 					connection.query("SELECT ib_fbranchCode FROM ibrgy_list WHERE ib_ibrgyyCode=?", [branchCode], (err, result)=>{
			// 						if(err) return reject(err)
			// 						resolve(result)
			// 					})
			// 				}).then(async(result:any)=>{
								
			// 					if(!result.length){
			// 						res.status(Codes.SUCCESS).send({ message : 'notFound' })
			// 					}else{

			// 						await Promise.all([
			// 							Promise.resolve(
											
			// 								connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", 
			// 								[currentW, branchCode], (err,result)=>{
			// 									if(err) throw err;
			// 									return result
			// 								})
										
			// 							)
			// 							,Promise.resolve(
			
			// 								connection.query("INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?, ?, ?, ? ,?, ?, ?)", 
			// 								[branchCode, userLog, collections.collection, collections.sales, collections.income, type+('000'+i).slice(-4), 'Confirm'],(err, result)=>{
			// 									if(err) throw err;
			// 									return result
			// 								})
			
			// 							),Promise.resolve(
											
			// 								connection.query("INSERT INTO barkota (barkota_code, shippingLine, origin, destination, departureDate, voyageId, customer_name, contact_personNo, contact_personAdd, ticket_url, ticket_totalPrice, ipayService_charge, franchise_charge, branchCode, transacted_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
			// 								[type+('000'+i).slice(-4), shippingVessel[0].voyage.vesselName, shippingVessel[0].voyage.route.origin, shippingVessel[0].voyage.route.destination, shippingVessel[0].voyage.departureDateTime, shippingVessel[0].voyage.id, `${passengers[0].firstName} ${passengers[0].lastName}`, `+63${contactInfo.mobileNumber}`, contactInfo.address, ticketUrl, displayTicketTotal[0].total, 20, collections.income, branchCode, userLog, 'Confirm'], (err, result)=>{
			// 									if(err) throw err;
			// 									return result
			// 								})
			// 							), Promise.resolve(
											
			// 								connection.query("UPDATE branch_count SET count=? WHERE type=?",
			// 								[i, 'barkota'], (err, result) => {
			// 									if(err) throw err
			// 									return result
			// 								})
			// 							), Promise.resolve(
			// 								connection.query("INSERT INTO f_commission (franchise, ibarangay, teller, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?,?) ",
			// 								[result[0].ib_fbranchCode, branchCode, userLog, collections.collection, collections.sales, 5, type+('000'+i).slice(-4), 'Confirm'],(err, result)=>{
			// 									if(err) throw err
			// 									return result
			// 								})
			// 							), Promise.resolve(
			// 								await updateWallet(result[0].ib_fbranchCode)
			// 							)
										
			// 						])
			// 						res.status(Codes.SUCCESS).send({ message : 'ok' })
			// 						connection.commit()
			// 					}
			// 				})
			// 			}
			// 		}).catch((err:any)=>{
			// 			res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			// 			connection.rollback()
			// 		})
			// 	}
				
			// }catch(err:any){
			// 	res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			// 	connection.rollback()
			// }
			
		})

		this.router.post('/getByTellerTransactions',authenticationToken,async (req, res) => {
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


		this.router.get('/getBarkotaTransactions',authenticationToken,async (req, res) => {			
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
		
		this.router.post('/barkotaCheckWallet',authenticationToken,async (req , res) => {
			
			const { tellerCode } = req.body
			
			try{
				connection.beginTransaction()
				return await new Promise((resolve ,reject)=>{
					connection.query("SELECT * FROM teller_list WHERE tellerCode=?", [tellerCode], (err, result)=>{
						if(err) return reject(err)
						resolve(result)
					})
				}).then(async(response:any)=>{
					
					if(!response.length){
						res.status(Codes.SUCCESS).send({ message : 'notfound' })
					}else{
						/**
						 * check wallet of branch 
						 */
						if(tellerCode.slice(0,3) === 'FRT'){

							const result :any = await checkWallet(response[0].fiB_Code)
							
							if(result[0].current_wallet === 5000 || result[0].current_wallet < 5000){

								res.status(Codes.SUCCESS).send({ message : 'low_wallet' })
							}else{
								/**
								 * proceed to insert
								 */
								const bookResponse : any = await bookToBarkota(req.body)
								
								if(bookResponse.status !== 500 && bookResponse.status !== 401 && bookResponse.status !== 403 ){
									/**response save to database */
									const responses :any = await saveToDb(req.body, response[0].fiB_Code, bookResponse.data.printUrl, result[0].current_wallet)
									res.status(Codes.SUCCESS).send({ message : responses, ticket_url : bookResponse.data.printUrl })
								}else{
									res.status(Codes.INTERNAL || Codes.BADREQUEST || Codes.NOTFOUND || Codes.UNAUTHORIZED).send(bookResponse.detail)
								}
							}
							
						}else{
							
							const result :any = await checkWallet(response[0].ibrgy_code)
							if(result[0].current_wallet === 5000 || result[0].current_wallet < 5000){
								res.status(Codes.SUCCESS).send({ message : 'low_wallet' })
							}else{
								/**
								 * proceed to insert
								 */
								 const bookResponse :any = await bookToBarkota(req.body)
								 if(bookResponse.status !== 500 && bookResponse.status !== 401 && bookResponse.status !== 403 ){
									/**response save to database */
									const responses :any = await saveToDb(req.body, response[0].ibrgy_code, bookResponse.data.printUrl, result[0].current_wallet)
									res.status(Codes.SUCCESS).send({ message : responses, ticket_url : bookResponse.data.printUrl })
								}else{
									res.status(Codes.INTERNAL || Codes.BADREQUEST || Codes.NOTFOUND || Codes.UNAUTHORIZED).send(bookResponse.detail)
								}
							}
							
						}
					}
					connection.commit()
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})
    }	/**
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

