import express, { response } from 'express'
import { Router } from 'express-serve-static-core'
import axios from "axios";

import md5 from 'md5'
import { Codes, Endpoints, LoadCentralCredential, Message } from './../../utils/main.enums'
import { connection } from '../../configs/database.config';
import xml2js from 'xml2js'

const { LOADCENTRAL_SELL_PRODUCT, LOADCENTRAL_SELL_PRODUCT_STATUS } = Endpoints

const { LOADCENTRAL_USERNAME_TEST, LOADCENTRAL_PASSWORD_TEST ,LOADCENTRAL_PROD_USERNAME, LOADCENTRAL_PROD_PASSWORD } = LoadCentralCredential

const parseXML = async (xml:any) => {

	const parser = new xml2js.Parser()
	try {
	   const parsedJSON = await parser.parseStringPromise(xml)
	   return parsedJSON
	} catch (err) {
	   throw err
	}

 }


 const pCODE = async (Pcode:any, amount:any) =>{

	try{
		switch(Pcode){

			case 'GMXMAX': return `${ Pcode }${ amount }`;

			case 'SMFLEXI': return `${ Pcode }${ amount }`;
	
			default: return Pcode
			
		}
	}catch(err){
		return err
	}

 }

 const checkWallet = async (branchCode:any)=>{
	try{
		connection.beginTransaction()
		return await new Promise((resolve ,reject)=>{
			connection.query("SELECT * FROM wallet WHERE branchCode=?", [branchCode], (err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then((response:any)=>{
			connection.commit()
			return response
		})
		
	}catch(err:any){
		connection.rollback()
		return err
	}
 }
 const getBranchCode = async (data:any)=>{
	try{
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{

			connection.query("SELECT * FROM teller_list WHERE tellerCode=?", [data[8]], (err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
			
		}).then(async (response:any)=>{
			connection.commit()
			if(!response.length){
				return 'notfound'
			}else{
				/**
				 * check wallet of branch 
				 */
				if(data[8].slice(0,3) === 'FRT'){

					const res = await checkWallet(response[0].fiB_Code)
					
					if(res[0].current_wallet === 5000 || res[0].current_wallet < 5000){
						return 'low_wallet'
					}else{
						/**
						 * proceed to insert
						 */
						const resulta = await insertLoad(data, response[0].fiB_Code, res[0].current_wallet)
						return resulta
					}
					
				}else{
					const res = await checkWallet(response[0].ibrgy_code)
					if(res[0].current_wallet === 5000 || res[0].current_wallet < 5000){
						return 'low_wallet'
					}else{
						/**
						 * proceed to insert
						 */
						 const resulta = await insertLoad(data, response[0].ibrgy_code, res[0].current_wallet)
						 return resulta
					}
					
				}
			}
			
		})
	}catch(err){
		connection.rollback()
		return err
	}
 }
 const insertLoad = async (data:any, BRANCHCODE :any, CURRENT_WALLET:any)=>{
	 
	try{
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{
			connection.query("INSERT INTO loadcentral (reference_id, TransId, mobileNo, productCode, amount, markUp, walletBalance, ePIN, tellerCode, createdBy, LC_response) VALUES (?,?,?,?,?,?,?,?,?,?,?)", 
			[data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10]],(err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then(async()=>{
			/**
			 * minus [4]
			 */
			let wallet_deducted = CURRENT_WALLET - data[4]
			let collection = data[4] + data[5]
			console.log(data[6]);
			
			await Promise.all([
				Promise.resolve(
					connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", [wallet_deducted, BRANCHCODE], (err,result)=>{
						if(err) throw err
						result
					})
				),
				Promise.resolve(
					connection.query("INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?)",
					[BRANCHCODE, data[8], collection, data[4], data[5], data[0], 'Confirm'], (err, result)=>{
						if(err) throw err
						result
					})
				)
			])
			connection.commit()
			return 'ok'
		})
	}catch(err){
		connection.rollback()
		return err
	}
 }
 const updateLCWALLET = async (data:any) =>{
	try{
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{
			connection.query("UPDATE mother_wallet SET wallet=? WHERE api_name=?", [data[6], 'LOADCENTRAL'], (err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then(( response : any )=>{
			connection.commit()
			return response
		})
	}catch(err){
		connection.rollback()
		return err
	}
 }
class EloadsController {

    private router: Router
    constructor() {
        this.router = express.Router()
    }
    watchRequests() {

        /**
         * @Functions
         */

       /**
         * Sell Product Request
         *    : https://loadcentral.net/sellapi.do
         *    ?uid=newtest
         *    &auth=3e5d80776b4d520b43adc9ae24aadab1
         *    &pcode=ZTEST1
         *    &to=639180000001
         *    &rrn=ABC5203432373
         * 
         * Sell Product Request Status
         *    : https://loadcentral.net/sellapiinq.do
         *    ?uid=63xxxxxxxxxx
         *    &auth=6cfa21290ed4f9cac5f366aaf2889526
         *    &rrn=ABC5203432373
         * 
         * 
        */

        this.router.post('/sellProduct',async (req, res) => {
            
			const { data, modelType, productName , productPromo, amount, markup, selectedPromoCodes, tellerCode , createdBy} = req.body
			
			const { contactNo } = data
			
			const PCODE = await pCODE( selectedPromoCodes.LCPRODUCTCODE, amount )

			try{
				connection.beginTransaction()
				return await new Promise((resolve, reject)=>{
					connection.query("SELECT * FROM branch_count WHERE type=?", ['IPC'], (err,result)=>{
						if(err) return reject(err)
						resolve(result)
					})
				}).then(async(response:any)=>{
					const series = response[0].count + 1
					const rrn = `${ response[0].type }${String(series).padStart(10,"0")}`

					const hashed = md5(md5(rrn) + md5(LOADCENTRAL_PROD_USERNAME + LOADCENTRAL_PROD_PASSWORD ))
				
					if(!response.length){
						res.status(Codes.SUCCESS).send({ message : 'tryAgain' })
					}else{

						
						await Promise.all([
							Promise.resolve(
								connection.query("UPDATE branch_count SET count=? WHERE type=?", [series, 'IPC'], (err,result)=>{
									if(err) throw err
									return result
								})
							), Promise.resolve(

								await axios.post(`${ LOADCENTRAL_SELL_PRODUCT }?uid=${ LOADCENTRAL_PROD_USERNAME }&auth=${ hashed }&pcode=${ PCODE }&to=63${ contactNo }&rrn=${ rrn }` )
								.then(async(result:any) => {
									
									if(!result.data.length){
										res.status(Codes.SUCCESS).send({ message : 'notFound' })
									
									}else{

										/**
										 * save in database
										*/
									
										const xml = await parseXML(`<data>${ result.data }</data>`)

										const ress = [ xml.data.RRN[0], xml.data.TID[0], contactNo, PCODE, PCODE.match(/(\d+)/)[1], markup, xml.data.BAL[0], xml.data.EPIN[0], tellerCode, createdBy, xml.data.ERR[0] ]	
										/**
										 * check if there's a error or not
										 */
										await updateLCWALLET(ress)

										const lc_response =   xml.data.ERR[0] === 'Insufficient Funds' ? 'lackFunds' 
															: xml.data.ERR[0] === 'LC API System Error' ? 'systemError' 
															: await getBranchCode(ress)
										res.status(Codes.SUCCESS).send(lc_response)	
									}
								}).catch((err:any) => {

									res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
									connection.rollback()
								})

							)
						])

					}
					connection.commit()
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}
        })

		this.router.get('/getLoadCentralTransactions',async (req, res) => {
			
			try{
				connection.query("SELECT * FROM loadcentral", (err,result)=>{
					if(err) throw err
					res.status(Codes.SUCCESS).send(result)
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}		
		})

    }
    get routerObject() { return this.router }

}
const eloads = new EloadsController()
eloads.watchRequests()
export default eloads.routerObject