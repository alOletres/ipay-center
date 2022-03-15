import { Injectable } from '@angular/core';
import { Workbook } from "exceljs";
// import * as Excel from 'exceljs';
// import * as Excel from 'exceljs/dist/exceljs.min.js'
import  moment from 'moment'
import FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;';
const EXCEL_EXTENSION = '.xlsx';

import { companyLog } from './../models/main.enums'
const { bs64image } = companyLog

interface image {
	bs64image : string		
}

interface headerss {
	headers : object
}
interface footerRows {
	fRows : object
}


@Injectable({
  providedIn: 'root'
})

export class ExcelService {

	workbook = new Workbook();

	

  	constructor() { }
	
	async exportAsExcelFile(table :any , data:any, branchInfo:any, tellerName:any){
	
		this.workbook.creator = 'Me';
		this.workbook.lastModifiedBy = 'Her';
		this.workbook.created = new Date(1985, 8, 30);
		this.workbook.modified = new Date();
		this.workbook.lastPrinted = new Date(2016, 9, 27);

		// Set workbook dates to 1904 date system
		this.workbook.properties.date1904 = true;

		// Force workbook calculation on load
		this.workbook.calcProperties.fullCalcOnLoad = true;

		this.workbook.views = [
			{
			x: 0, y: 0, width: 10000, height: 20000,
			firstSheet: 0, activeTab: 1, visibility: 'visible'
			}
		]
		
		// Create worksheets with headers and footers
		const worksheet = this.workbook.addWorksheet('My Sheet', {

			pageSetup:{paperSize: 5, orientation:'landscape'},
			headerFooter:{firstHeader: "Hello Exceljs", firstFooter: "Hello World"},
			properties:{tabColor:{argb:'FFC0000'}}
		
		});

		// adjust pageSetup settings afterwards
		worksheet.pageSetup.margins = {
			left: 0.2, right: 0.7,
			top: 0.75, bottom: 0.75,
			header: 0.3, footer: 0.3
		};

		// declaration to be added
		
		
	

		const current_date = new Date()
				
		const fileName = `${tellerName} ${moment(current_date).format().slice(0, 10)}` 

		const tableHeaders : headerss = {
			headers : [ 'NO', 'TRANSACTION NO', 'SERVICES', 'COLLECTION', 'SALES', 'INCOME', 'STATUS', 'DATE TRANSACTED', 'TRANSACTED BY']
		}

		
		// add in row and colums 
		const subSeaders = [
		
			[JSON.parse(branchInfo)[0].franchiseName],
			[JSON.parse(branchInfo)[0].location],
			[JSON.parse(branchInfo)[0].email],
			[`+63${JSON.parse(branchInfo)[0].contactNo}`]

		]
		
		const companyLogo = this.workbook.addImage({

			base64: bs64image,
			extension: 'png',
		});	

		worksheet.addImage(companyLogo, 'A1:B6')//adding image
		worksheet.addRow([]);
		await Promise.resolve(
			subSeaders.forEach(d => {	
						
				const x = worksheet.addRow([])
				worksheet.getCell(`C${ x.number }`).value = d[0].charAt(0).toUpperCase() + d[0].slice(1)
				worksheet.getCell(`C${ x.number }`).alignment = { vertical: 'middle', horizontal: 'left' }
				
			})
		)
		
		worksheet.addRow([]);
		const headerRow = worksheet.addRow(tableHeaders.headers)

		await Promise.resolve(
			
			headerRow.eachCell((cell, column)=>{
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'FFFFFF00' },
					bgColor: { argb: '#208000' },
					
				};
				cell.alignment = { vertical: 'middle', horizontal: 'center' };
			
			})
		)
		

		let rows :any [] = []
		await Promise.resolve(

			data.forEach((d :any, index : any)=> {
				
				const i = index + 1
				const collection = Number(d.ticket_totalPrice) + Number(d.franchise_charge) + Number(d.ipayService_charge)
				const sales = Number(d.ticket_totalPrice) + Number(d.ipayService_charge)
	
				rows = [i, d.barkota_code, d.shippingLine, collection, sales, d.franchise_charge, d.status, moment(d.transacted_date).format().slice(0, 10), d.transacted_by]
	
				const x = worksheet.addRow(rows)
	
				x.eachCell((cell, number) => {		
					
					cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
					cell.alignment = { vertical: 'middle', horizontal: 'center' };
				
				});	

			})

			
		)

		const rowsS = worksheet.getColumn(1);
		const lastrow = rowsS.worksheet.rowCount

		worksheet.mergeCells(`A${lastrow + 1}:C${lastrow + 1}`);
		
		const totalWord = worksheet.getCell(`B${lastrow + 1}`)
		totalWord.value = 'TOTAL'	
		totalWord.alignment = { vertical: 'middle', horizontal: 'center' }
		totalWord.font = { bold : true }
		totalWord.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
	
		/**
		 * @value lastrow last index 30
		 * @firstrow given 7
		 * @totalcollection
		 */
		const totalCollection = worksheet.getCell(`D${lastrow + 1}`)
		totalCollection.value = { formula: `=SUM(D7 :D${lastrow})`, date1904: false };	
		this.global(totalCollection)
		
		/**
		 * @totalsales
		 * @value 7 : lastrow 30
		 */
		const totalsales = worksheet.getCell(`E${lastrow + 1 }`)
		totalsales.value = { formula: `=SUM(E7 :E${lastrow})`, date1904: false  }
		this.global(totalsales)
		
		/**
		 * @totalincome 
		 */
		const totalincome = worksheet.getCell(`F${lastrow + 1}`)
		totalincome.value = { formula: `=SUM(F7 :F${lastrow})`, date1904: false };	
		this.global(totalincome)
		
		/**
		 * @footer 
		 * @name of teller
		 */
		worksheet.mergeCells(`H${lastrow + 3}:I${lastrow + 3}`);
		worksheet.mergeCells(`H${lastrow + 4}:I${lastrow + 4}`);
		const teller = worksheet.getCell(`H${lastrow + 4}`)
		teller.value = `Teller: ${tellerName.charAt(0).toUpperCase() + tellerName.slice(1)}`;
		teller.alignment = { vertical: 'middle', horizontal: 'center' }
		teller.font = { bold : true }
		teller.border = { top: { style: 'thin' } };

		/**
		 * @dateDownloaded
		 */
		const datenow = new Date()
		const date = worksheet.getCell('I2')
		date.value = moment(datenow).format('LLL')
		date.alignment = { vertical: 'middle', horizontal: 'center' }


		worksheet.getColumn(2).width = 20;
		worksheet.getColumn(3).width = 25;
		worksheet.getColumn(4).width = 15;
		worksheet.getColumn(5).width = 15;
		worksheet.getColumn(6).width = 15;
		worksheet.getColumn(7).width = 20;
		worksheet.getColumn(8).width = 20;
		worksheet.getColumn(9).width = 20;



		this.saveAsExcelFile(data, fileName)

	}
	private saveAsExcelFile(_buffer: any, fileName: string): void {

		const w  = this.workbook.xlsx.writeBuffer().then((_buffer: any) => {
			const blob = new Blob([_buffer], { type: EXCEL_TYPE });
			FileSaver.saveAs(blob, `${ fileName } Brk Reports Exported - ${ moment().format('ll') }`+ EXCEL_EXTENSION);
		});
		console.log(w);
		
	}

	global(params:any) {
		params.alignment = { vertical: 'middle', horizontal: 'left' }
		params.font = { bold : true }
		params.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
	}
}
