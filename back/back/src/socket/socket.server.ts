export const socket = (data:any) => {
    
    const io = data.instance
   
    io.on("connection", (socket:any) => {
		
       socket.on('eventSent', (data:any) => {

    		// io.emit('response_topUpload', {    
			// 	data /**send to client from server */
			// })
			const res = Object.values(data)
            const x:any = res.map((result:any)=>result)
                
			io.emit(x[0], {    
				data /**send to client from server */
			})
       })	
    })
 }