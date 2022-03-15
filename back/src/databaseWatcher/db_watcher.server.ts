const MySQLEvents = require('@rodrigogs/mysql-events');
import mysql from 'mysql'
import { ReplicatorConfig } from './../configs/main.object'


export const watch = async (io:any) => {

	const connection = mysql.createConnection(ReplicatorConfig)
	
	const instance = new MySQLEvents(connection, {
		startAtEnd: true
	  });
	
	await instance.start();
	
	instance.addTrigger({
		name : 'Watching Events...',
		expression : '*',
		statement : MySQLEvents.STATEMENTS.ALL,
		
		onEvent : (e:any) =>{

			const { type, schema, table, affectedRows, affectedColumns } = e
			const { after, before } = affectedRows[0]
			
			console.log(e);


			if(table === 'top_uploads'){
				console.log(table);
				
			}
			
		},
	})

	instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
	instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
}