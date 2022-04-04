
import dotenv, { parse } from 'dotenv'
dotenv.config()
import express, { response } from 'express'
import { Router } from 'express-serve-static-core'
import axios from "axios";
import { MUTISYS_PARTNER_SECRET, MultisysPayload } from '../../utils/main.interfaces';

import { connection } from '../../configs/database.config';

import { Codes, Message, MultisysCredentials } from '../../utils/main.enums';

import { Endpoints } from '../../utils/main.enums';
import { authenticationToken } from '../../middleware/auth';
/**
 * Multi sys Credentials 
 *  
 *
 *  
*/
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

const { HTTP_MULTISYS } = Endpoints
const { BILLER, CHANNEL } = MultisysCredentials

const secret : MUTISYS_PARTNER_SECRET ={
    SECRET : String(process.env.X_MECOM_PARTNER_SECRET)
}

let multisysSecret :any = secret.SECRET

const calculateJulianDate = () => {

	let today :any = new Date();
	let onejan:any = new Date(today.getFullYear(),0,1);
	let j :any = Math.ceil((today - onejan) / 86400000);
	let year = today.getFullYear()

	
	switch(String(j).length){
		case 1 : return `${ year }00${ j }`
		
		case 2 : return `${ year }0${ j }`
		
		default: return `${ year }${ j }`
	}
}
const generateMultisysNumbers = async() =>{
	try{
		let series :any
		connection.beginTransaction()
		let Query = "SELECT * FROM branch_count WHERE type=?"
		let  value = ['IPY']
		const response :any = await customQuery(Query, value)

		if(!response.length){
			return 'again'
		}else{
			let count = response[0].count + 1
			series = `${response[0].type}${String(count).padStart(4, '0')}`
			let Query1 = "Update branch_count SET count=? WHERE type=?"
			let values1 = [count, 'IPY']
			await customQuery(Query1, values1)
		}

		connection.commit()
		return series
	}catch(err:any){
		connection.rollback()
		return err
	}
}

const multisysApi = async(customerName:any, payload:any, BRANCHCODE:any, TELLERCODE:any, CURRENT_WALLET:any) =>{
	try{
		var results :any
		
		const julianDate = await calculateJulianDate()
		const seriesNumber = await generateMultisysNumbers()

		await axios.post(`${ HTTP_MULTISYS }/process`,payload, {
			/**headers is here */
			headers : {
				accept: "application/json",
				'X-MECOM-PARTNER-SECRET' : multisysSecret,
				'X-MECOM-PARTNER-REFNO'  : `${ julianDate }${ seriesNumber }`
			}
		}).then(async(response:any)=>{
			
			results = await insertMultisys(customerName, payload, response.data, BRANCHCODE, TELLERCODE, `${ julianDate }${ seriesNumber }`, CURRENT_WALLET)
		})
		return results
			

	}catch(err:any){
		return err.response.data
	}	
}
const insertMultisys = async(...data:any) =>{
	
	/**
	 * payment charge 
	 * system fee = 10
	 * outlet fee = 15
	 * ibarangay 10
	 * franchise return 5
	 */
	let systemfee = 10
	const outletCharge =  data[4].slice(0,3) === 'FRT' ? 15
				 		: data[4].slice(0,3) === 'BRT' ? 10 
				 		: ''
	let collection :any = data[1].amount + outletCharge + systemfee /**total colletion */
	let sales :any = data[1].amount + systemfee /** deduct your wallet */
	
	let updatedWallet :any = data[6] - sales
	/**
	 * income === outletCharge
	 */
	try{
		connection.beginTransaction()
		let Query = "INSERT INTO multisys (partner_refNo, branchCode, tellerCode, customer_name, account_number, amount, contact_number, channel, refno, txnid, biller, collections, sales, income ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		let values = [data[5], data[3], data[4], data[0], data[1].account_number, data[1].amount, data[1].contact_number, data[1].channel, data[2].data.refno, data[2].data.txnid, data[2].data.biller, collection, sales, outletCharge ]

		const response :any = await customQuery(Query, values)

		/**query for wallet */
		let Query1 = "UPDATE wallet SET current_wallet=? WHERE branchCode=?"
		let values1 = [updatedWallet, data[3] ]
		
		const responses :any =  response.affectedRows > 0 ? await customQuery(Query1,values1) : ''

		/**insert wallet transaction */
		let Query2 = "INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?) "
		let values2 =  [data[3], data[4], collection, sales, outletCharge, data[5], 'Confirm' ]

		const rsponses1 :any = responses.affectedRows > 0 ? await customQuery(Query2, values2) : ''

		rsponses1.affectedRows > 0 ? data[4].slice(0,3) === 'BRT' ? await commision(data) 
								   								  :'' 
								   : ''
		connection.commit()
		return data[2]

	}catch(err:any){
		connection.rollback()
		return err
	}
}
const commision = async(data:any)=>{
	
	let systemfee = 10
	let franchiseReturn = 5

	const outletCharge =  data[4].slice(0,3) === 'FRT' ? 15
				 		: data[4].slice(0,3) === 'BRT' ? 10 
				 		: ''
	let collection :any = data[1].amount + outletCharge + systemfee /**total colletion */
	let sales :any = data[1].amount + systemfee /** deduct your wallet */
	
	
	try{
		connection.beginTransaction()
		let Query = "SELECT ib_fbranchCode FROM ibrgy_list WHERE ib_ibrgyyCode=?"
		let values = [ data[3] ]

		const response :any = await customQuery(Query, values)

		let Query1 = "INSERT INTO f_commission (franchise, ibarangay, teller, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?,?) "
		let values1 = [response[0].ib_fbranchCode, data[3], data[4], collection, sales, franchiseReturn, data[5], 'Confirm' ]
		const response1 :any = await customQuery(Query1, values1)
		response1.affectedRows > 0 ? await addCommission(response[0].ib_fbranchCode) : ''

		connection.commit()
	}catch(err:any){
		connection.rollback()
		return err
	}
}
const addCommission = async(data:any) =>{
	try{
		connection.beginTransaction()
		let Query = "SELECT current_wallet FROM wallet WHERE branchCode=?"
		let values =  [data]

		const response :any = await customQuery(Query, values)
		const total_commission :any = response[0].current_wallet + 5

		let Query1 =  "UPDATE wallet SET current_wallet=? WHERE branchCode=?"
		let values1 = [total_commission, data]

		await customQuery(Query1, values1)

		connection.commit()
	}catch(err:any){
		connection.rollback()
		return err
	}
}
export const checkWallet = async (branchCode:any)=>{
	try{
		
		connection.beginTransaction()
		let Query = "SELECT * FROM wallet WHERE branchCode=?"
		let values = [branchCode]

		const response :any = await customQuery(Query, values)

		connection.commit()
		return response
		
	}catch(err:any){
		connection.rollback()
		return err
	}
 }



class MultisysController {
    private router: Router
    constructor() {
        this.router = express.Router()
    }
    watchRequests() {
		
        /***PROCESS IS HERE */

        this.router.post('/inquireMultisys',authenticationToken,async (req, res) => {
			
			const { CostumersName, contactNo, account_number, Amount } = req.body

			const payload : MultisysPayload = {
				account_number : account_number,
				amount : Amount,
				contact_number : contactNo,
				biller : BILLER,
				channel : CHANNEL
			}
			try{
				const julianDate = await calculateJulianDate()
				
				const seriesNumber = await generateMultisysNumbers()
				
				await axios.post(`${ HTTP_MULTISYS }/inquire`,payload, {
					/**headers is here */
					headers : {
						accept: "application/json",
						'X-MECOM-PARTNER-SECRET' : multisysSecret,
						'X-MECOM-PARTNER-REFNO'  : `${ julianDate }${ seriesNumber }`
					}
				}).then((response:any)=>{
					if(response.data.status === 200 && response.data.reason === 'OK'){
						/**insert in database */
						res.status(200).send(response.data.data)
					}else{
						res.status(Codes.SUCCESS).send('again')
					}
				})

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.response.data.reason)
			}
			
		})

		this.router.post('/proceedTransaction',authenticationToken,async (req, res) => {
			
			const { data, amount, tellerCode } = req.body

			const payload : MultisysPayload = {
				account_number : data.account_number,
				amount : amount,
				contact_number : data.contactNo,
				biller : BILLER,
				channel : CHANNEL
			}
			try{
				connection.beginTransaction()
				return await new Promise((resolve, reject)=>{

					connection.query("SELECT * FROM teller_list WHERE tellerCode=?", [tellerCode], (err, result)=>{
						if(err) return reject(err)
						resolve(result)
					})
					
				}).then(async (response:any)=>{
					
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
								const results = await multisysApi(data.CostumersName, payload, response[0].fiB_Code, tellerCode, result[0].current_wallet)
								
								res.status(Codes.SUCCESS).send(results)
							
							}
							
						}else{
							const result = await checkWallet(response[0].ibrgy_code)
							
							if(result[0].current_wallet === 5000 || result[0].current_wallet < 5000){
							
								res.status(Codes.SUCCESS).send({ message : 'low_wallet' })

							}else{
								/**
								 * proceed to insert
								 */
								// const resss = await LoadCentralApi(req.body, response[0].ibrgy_code, result[0].current_wallet)
							
								// res.status(Codes.SUCCESS).send({ message : resss })
								const results = await multisysApi(data.CostumersName, payload, response[0].ibrgy_code, tellerCode, result[0].current_wallet)
								
								res.status(Codes.SUCCESS).send(results)
							}
							
						}
					}
					connection.commit()
					
				})
				
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}
			
		})

		this.router.get('/getMultisysTransaction',authenticationToken,async (req, res) => {
			try{
				connection.query("SELECT * FROM multisys", (err, result)=>{
					if(err) throw err
					res.status(Codes.SUCCESS).send(result)
				})

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}			
		})

		this.router.post('/getFranchiseAddress',authenticationToken,async (req, res) => {
			
			const { code } = req.body
			
			try{
				connection.beginTransaction()
				return await new Promise((resolve, reject)=>{
					(code.slice(0,3) === 'FRT')
					? connection.query("SELECT fiB_Code FROM teller_list WHERE tellerCode=?", [code], (err, result)=>{
							if(err) return reject(err)
							resolve(result)
						}) 
					: connection.query("SELECT ibrgy_code FROM teller_list WHERE tellerCode=?", [code], (err, result)=>{
						if(err) return reject(err)
						resolve(result)
					})
				}).then(async(response:any)=>{
					if(!response.length){
						res.status(Codes.SUCCESS).send('Again')
					}else{
						if(code.slice(0,3) === 'FRT'){
							/**franchise table */
							await Promise.resolve(
								connection.query("SELECT * FROM franchise_list WHERE fbranchCode=?", [ response[0].fiB_Code ], (err, result)=>{
									if(err) throw err
									res.status(Codes.SUCCESS).send(result)
								})
							)
						}else{
							/**ibarangay table */
							await Promise.resolve(
								connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyyCode=?", [ response[0].ibrgy_code ], (err, result)=>{
									if(err) throw err
									res.status(Codes.SUCCESS).send(result)
								})
							)
						}
					}
					connection.commit()
				})

			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}		
		})
    } /**end of wacth function */
  get routerObject() { return this.router }

}
const multisys = new MultisysController()
multisys.watchRequests()
export default multisys.routerObject
