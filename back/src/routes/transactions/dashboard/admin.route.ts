import express from 'express'
import { Router } from 'express-serve-static-core'
import { connection } from '../../../configs/database.config'
import { Message, Codes } from '../../../utils/main.enums';


class DashboardController {

    private router: Router

    constructor() {
        this.router = express.Router()
    }

    watchRequests() {
        /**
         * @Functions
         */

        this.router.get('/barGraphData',async (req, res) => {
            try{
                await Promise.resolve(
                    connection.query("SELECT * FROM wallet_historytransaction", (err,result)=>{
                        if (err) throw err;
                        res.status(200).send(JSON.stringify(result))
                    })
                )
            }catch(err){
                throw err
            }            
        })

        this.router.post('/createAnnouncement',async ( req,res ) => {

			const { messages, createdBy } = req.body			
			
			/**
			 * active 1 un_active announcement 0
			 */

			try{
				await Promise.resolve(
					connection.query("INSERT INTO announcement ( message, createdBy ) VALUES (?, ?) ",[messages.message, createdBy], (err, result)=>{
						if(err) throw err;
						
							(result.affectedRows === 1) ? res.status(200).send({ message: 'ok' }) 
						:	(result.affectedRows === 0) ? res.status(200).send({ message: 'undefined' }) 
						: ''
	
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
        })


		this.router.get('/displayAnnouncement',async (req, res) => {
				
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM announcement ORDER BY createdDate DESC;", (err, result)=>{
						if(err) throw err;
						res.status(200).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}			
		})

		this.router.post('/changeStatus',async (req, res) => {
			
			const { value } = req.body

			try{
				await Promise.resolve(
					(value.status === 0)?
						connection.query("UPDATE announcement SET status=? WHERE id=?", [1, value.id], (err, result)=>{
							if(err) throw err;
							(result.affectedRows === 1) ? res.status(200).send({ message: 'ok' }) 
							:(result.affectedRows === 0) ? res.status(200).send({ message: 'undefined' }) 
							: ''
						})
					: (value.status === 1) ? connection.query("UPDATE announcement SET status=? WHERE id=?", [0, value.id], (err, result)=>{
						if(err) throw err;
						(result.affectedRows === 1) ? res.status(200).send({ message: 'ok' }) 
						:	(result.affectedRows === 0) ? res.status(200).send({ message: 'undefined' }) 
						: ''
					})

					: ''
					
					
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}		
		})

		this.router.post('/updateAnnouncement',async (req, res) => {
			
			const { data, updatedBy } = req.body

			try{
				connection.beginTransaction()
				await new Promise((resolve, reject)=>{
					connection.query("UPDATE announcement SET message=?, updatedBy=? WHERE id=?", [ data.message, updatedBy, data.id ], (err, result)=>{
						if(err) return reject(err)
						resolve(result)
					})
				}).then(()=>{
					res.status(200).send({ message: 'ok' })
					connection.commit() 
				})

			}catch(err:any){

				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}
		})

		this.router.get('/getActivityLogs',async (req, res) => {
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM activitylogs ORDER BY logDate DESC;", (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
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
const user = new DashboardController()

user.watchRequests()
export default user.routerObject