import { json } from 'body-parser'
import express, { response } from 'express'
import { Router } from 'express-serve-static-core'
import moment from 'moment'

import { connection } from '../../configs/database.config'
import { authenticationToken } from '../../middleware/auth'
import { Message, Codes } from '../../utils/main.enums'
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


class WalletsController {
    private router: Router
    constructor() {
        this.router = express.Router()
    }
    watchRequests() {
        /**
         * @Functions
         */

        this.router.post('/topupload',authenticationToken,async (req, res) => {
            const { data, img, remarks} = req.body
			
            try{
				connection.beginTransaction()
				let Query = remarks === '' || remarks === null || remarks === undefined 
							? 'INSERT INTO top_uploads (branchCode, fbranchCode, image, referenceNumber, payment_date, payment_status, amount) VALUES (?, ?, ?, ?, ?, ?, ?)'
							: 'INSERT INTO top_uploads (branchCode, fbranchCode, image, referenceNumber, payment_date, payment_status, amount, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
				
				let values = remarks === '' || remarks === null || remarks === undefined
							? [data.bcode, data.fcode, img, data.reference, data.date_trans, 0, data.credit] 
							: [data.bcode, data.fcode, img, data.reference,  data.date_trans, 0, data.credit, remarks ]
				
				const result :any =  await customQuery(Query, values)
				result.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) : res.status(Codes.BADREQUEST).send({ message : 'again' }) 
				connection.commit()
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				
			}
        })

		this.router.post('/getTopup_list',authenticationToken,async (req, res) => {
			const { code } = req.body
			try{
				let Query = 'SELECT * FROM top_uploads WHERE fbranchCode=?'
				let values =  [code]

				const result :any = await customQuery(Query, values)
				
				res.status(Codes.SUCCESS).send(result)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}			
		})
		this.router.post('/getTopup_listForBranchHead',authenticationToken,async (req, res) => {
			const { code } = req.body
			try{
				let Query = 'SELECT * FROM top_uploads WHERE branchCode=? AND payment_status=?'
				let values =  [code, 0]
				const result :any = await customQuery(Query, values)
				res.status(Codes.SUCCESS).send(result)

			}catch(err : any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/approvedTopupLoad',authenticationToken,async (req, res) => {
			const { approved_date, approved_by, id, data, fcode } = req.body	
			console.log(req.body);
			
			try{
				connection.beginTransaction()

				let Query1 = "SELECT * FROM wallet WHERE branchCode=? "
				let value1 = [fcode]

				const response : any = await customQuery(Query1, value1)
				
				const total_approvedWallet = response[0].approved_wallet + data.credit
				const total_currentWallet = response[0].current_wallet + data.credit

				let Query2 = "UPDATE wallet SET approved_wallet=?, current_wallet=? WHERE branchCode=?"
				let value2 = [total_approvedWallet, total_currentWallet, fcode]

				const response1 :any = await customQuery(Query2, value2)
				
				let Query3 = 'UPDATE top_uploads SET payment_status=?, approved_by=?, approved_date=? WHERE id=?'
				let value3 = [1, approved_by, approved_date, id]
				const QueryRes :any = response1.affectedRows > 0 ? await customQuery(Query3, value3) : ''

				QueryRes.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) : res.status(Codes.BADREQUEST).send({ message : 'notFound'})
				
				connection.commit()
				
				
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		// this.router.post('/sendLoadtable',authenticationToken,async (req, res) => {
		// 	const { data, fbranchCode, available_wallet } = req.body
		// 	const dateNow = new Date()
		// 	if(available_wallet < data.credit){

		// 		res.status(Codes.SUCCESS).send('dli')

		// 	}else{

		// 		// 
		// 		try{
		// 			connection.beginTransaction()
		// 			return new Promise((resolve, reject)=>{
		// 				// insert the load in sendload table
		// 				connection.query("SELECT * FROM wallet WHERE branchCode=?", [data.ib_code],(err, result)=>{
		// 					if(err) throw err;
		// 					resolve(result)
		// 				})

		// 			}).then(async(response:any) =>{
		// 				// plus the ibarangay wallet load afterwards minus the franchise wallet
		// 				const totalapproved = data.credit + response[0].approved_wallet
		// 				const totalcurrent_wallet = data.credit + response[0].current_wallet 
						
		// 				// 2nd query
		// 				connection.beginTransaction()
		// 				return new Promise((resolve, reject)=>{
		// 					connection.query("SELECT * FROM wallet WHERE branchCode=?", [fbranchCode],(err, result)=>{
		// 						if(err) throw err;
		// 						resolve(result)
		// 					})
		// 				}).then(async (response:any) => {
		// 					// mag minus ko dri para makuhaan ang wallet ni franchise
		// 					const decCurrent_wallet = response[0].current_wallet - data.credit

		// 					await Promise.all([
		// 						Promise.resolve(
		// 							// update wallet for ibarangay approved and current wallet
		// 							connection.query("UPDATE wallet SET approved_wallet=?, current_wallet=? WHERE branchCode=?",
		// 							[totalapproved, totalcurrent_wallet, data.ib_code], (err, result)=>{
		// 								if(err) throw err;
		// 								return result
		// 							})
		// 						),Promise.resolve(
		// 							// update wallet in franchise current wallet
		// 							connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?",
		// 							[decCurrent_wallet, fbranchCode], (err, result)=>{
		// 								if(err) throw err;
		// 								return result
		// 							})
		// 						),Promise.resolve(
		// 							// insert data to send load list
		// 							connection.query("INSERT INTO sendload_list (fbranchCode, ibrgy_code, credit_sent, load_status, paid_date) VALUES (?, ?, ?, ?, ?)",
		// 							[fbranchCode, data.ib_code, data.credit, data.paymentStatus, dateNow], (err, result)=>{
		// 								if(err) throw err;
		// 								return result
		// 							})
		// 						)
		// 					])
		// 					connection.commit()
		// 					res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Added.`)

		// 				}).catch((err) => {
		// 					connection.rollback()
		// 					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
		// 				})

		// 				// last block of catch
		// 			}).catch((err) => {
		// 				connection.rollback()
		// 				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
		// 			})

		// 		}catch( err : any ) {
		// 			connection.rollback()
		// 			res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
		// 		}	
		// 	}
				
		// })

		this.router.post('/getFranchisewallet',authenticationToken,async (req, res) => {
			const { fbranchCode } = req.body
			try{
				let Query = "SELECT * FROM wallet WHERE branchCode=?"
				let values = [fbranchCode]
				const result :any = await customQuery(Query, values)
				res.status(Codes.SUCCESS).send(result)
			}catch( err: any ){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/updateLoadstatus',authenticationToken,async (req, res) => {

			const { paymentStatus, id } = req.body
			const dateNow = new Date();
			
			try{
				connection.query("UPDATE sendload_list SET load_status=?, paid_date=? WHERE id=?", [paymentStatus, dateNow, id], (err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				})
			}catch(err : any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/checkAvailableWallet',authenticationToken, async (req, res) => {
			const { branchCode } = req.body
			try{
				connection.beginTransaction()
				 return await new Promise((resolve, reject)=>{
					connection.query("SELECT * FROM teller_list WHERE tellerCode=?", [branchCode], (err, result)=>{
						if(err) throw err;
						resolve(result)
					})
				}).then(async(response:any)=>{
					
					if(response[0].fiB_Code !== '' && response[0].ibrgy_code !== ''){
						await Promise.resolve(
							connection.query("SELECT * FROM wallet WHERE branchCode=?", [response[0].ibrgy_code], (err,result)=>{
								if(err)throw err;
								connection.commit()
								res.status(Codes.SUCCESS).send(JSON.stringify(result))
							})
						)
					}else if(response[0].fiB_Code !== '' && response[0].ibrgy_code === ''){
						await Promise.resolve(
							connection.query("SELECT * FROM wallet WHERE branchCode=?", [response[0].fiB_Code], (err,result)=>{
								if(err)throw err;
								connection.commit()
								res.status(Codes.SUCCESS).send(JSON.stringify(result))
							})
						)
					}else if (response[0].fiB_Code === '' && response[0].ibrgy_code !== ''){
						await Promise.resolve(
							connection.query("SELECT * FROM wallet WHERE branchCode=?", [response[0].ibrgy_code], (err,result)=>{
								if(err)throw err;
								connection.commit()
								res.status(Codes.SUCCESS).send(JSON.stringify(result))
							})
						)
					}		
					
				}).catch((err:any)=>{
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				})
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.get('/adminTopUpload',authenticationToken,async (req, res) => {
			try{

				await Promise.resolve(
					connection.query("SELECT * FROM top_uploads WHERE payment_status=?",[0], (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(result)
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}		
		})

		this.router.post('/walletHistory',authenticationToken,async (req, res) => {
			
			const { code } = req.body
			
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM wallet_historytransaction INNER JOIN barkota ON wallet_historytransaction.transaction_id = barkota.barkota_code WHERE wallet_historytransaction.branchCode=? AND barkota.branchCode=?", [code, code], (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(result)
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
						
		})

		this.router.post('/checkFranchiseWallet',authenticationToken,async (req, res) => {
			const { code } = req.body
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM wallet WHERE branchCode=?", [code], (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.get('/walletTransactionForAdminBranchHead',authenticationToken,async (req, res) => {
		
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM wallet_historytransaction INNER JOIN barkota ON wallet_historytransaction.transaction_id = barkota.barkota_code", 
					(err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
						
		})
		this.router.get('/walletBranchesMonitoring',authenticationToken,async (req, res) => {

			try{
				await Promise.resolve(
					connection.query("SELECT * FROM wallet INNER JOIN franchise_list ON wallet.branchCode = franchise_list.fbranchCode", (err, result)=>{
						if(err) throw err
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})


		this.router.get('/walletiBarangayMonitoring',authenticationToken,async (req, res) => {
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM wallet INNER JOIN ibrgy_list ON wallet.branchCode = ibrgy_list.ib_ibrgyyCode", (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}		
		})

		this.router.get('/topUploadsFranchiseeHistory',authenticationToken,async (req, res) => {
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM top_uploads INNER JOIN franchise_list ON top_uploads.fbranchCode = franchise_list.fbranchCode", (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(result)
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.get('/topUploadsIbarangayHistory',authenticationToken,async (req, res) => {
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM top_uploads INNER JOIN ibrgy_list ON top_uploads.fbranchCode = ibrgy_list.ib_ibrgyyCode", (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}			
		})

		this.router.get('/getOverallWallet',authenticationToken,async (req, res) => {
			try{
				connection.query("SELECT * FROM wallet_historytransaction", (err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}		
		})
	}
	/**
	*@endOfWatchList
	*/
    get routerObject() { return this.router }
}


const user = new WalletsController()

user.watchRequests()
export default user.routerObject

