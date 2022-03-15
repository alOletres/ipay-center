import { Injectable } from '@angular/core';
import { companyLog } from './../models/main.enums'
import { Workbook } from "exceljs";

import  moment from 'moment'
import FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;';
const EXCEL_EXTENSION = '.xlsx';

interface headerss {
	headers : object
}
const { bs64image } = companyLog
@Injectable({
  providedIn: 'root'
})
export class AdminExcelService {

	workbook = new Workbook();

	constructor() { }
	
	async exportAsExcelFile(data:any, type:any, name:any) {

		console.log(data);
		console.log(type);
		console.log(name);
		
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
	
		const current_date = new Date()
		const fileName = `wallet reports ${moment(current_date).format().slice(0, 10)}` 

		/**
		 * @startDataOfCellAndRows
		 */

		 const companyLogo = this.workbook.addImage({

			base64: bs64image,
			extension: 'png',
		});	

		worksheet.addImage(companyLogo, 'A1:B6')//adding image

		// headers
		const tableHeaders : headerss = {
			headers : [ 'NO', 'FRANCHISEE', 'TELLER', 'TRANSACTION NO', 'PRODUCT/SERVICES', 'DEBIT', 'CREDIT', 'DATE TRANSACTED']
		}

		worksheet.addRow([]);
		worksheet.addRow([]);
		worksheet.addRow([]);
		worksheet.addRow([]);
		worksheet.addRow([]);
		worksheet.addRow([]);
		const headerRow = worksheet.addRow(tableHeaders.headers)

		// await Promise.resolve(
			
			
		// )

		headerRow.eachCell((cell, column)=>{
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFFFFF00' },
				bgColor: { argb: '#208000' },
				
			};
			cell.alignment = { vertical: 'middle', horizontal: 'center' };
		
		})


		let rows :any [] 
		// await Promise.resolve(

			

		// )
		(type === 'Admin')
			?  
			data.forEach((d :any, index : any)=> {

				console.log(d);
				
					
					const i = index + 1
					const sales = Number(d.ticket_totalPrice) + Number(d.ipayService_charge)
		
					rows = [i, d.branchCode, d.transacted_by, d.barkota_code, d.shippingLine,sales, d.ipayService_charge, moment(d.transacted_date).format().slice(0, 10)]
		
					const x = worksheet.addRow(rows)
		
					x.eachCell((cell, number) => {		
						
						cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
						cell.alignment = { vertical: 'middle', horizontal: 'center' };
					
					});	

				})

			:  
			 data.forEach((d :any, index : any)=> {
					
					const i = index + 1
					const sales = Number(d.ticket_totalPrice) + Number(d.ipayService_charge)
		
					rows = [i, d.branchCode, d.transacted_by, d.barkota_code, d.shippingLine,sales, d.franchise_charge, moment(d.transacted_date).format().slice(0, 10)]
		
					const x = worksheet.addRow(rows)
		
					x.eachCell((cell, number) => {		
						
						cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
						cell.alignment = { vertical: 'middle', horizontal: 'center' };
					
					});	

				})

		const rowsS = worksheet.getColumn(1);
		const lastrow = rowsS.worksheet.rowCount

		console.log(lastrow);
		
		worksheet.mergeCells(`A${lastrow + 1}:E${lastrow + 1}`);
		
		const totalWord = worksheet.getCell(`C${lastrow + 1}`)
		totalWord.value = 'TOTAL'	
		totalWord.alignment = { vertical: 'middle', horizontal: 'center' }
		totalWord.font = { bold : true }
		totalWord.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

		/**
		 * @DebitTotal
		 */

		const totalDebit = worksheet.getCell(`F${lastrow + 1}`)
		totalDebit.value = { formula: `=SUM(F8 :F${lastrow})`, date1904: false };	
		this.global(totalDebit)

		/**
		 * @CREDITtOTAL
		 */
		
		 const totalCredit = worksheet.getCell(`G${lastrow + 1}`)
		 totalCredit.value = { formula: `=SUM(G8 :G${lastrow})`, date1904: false };	
		 this.global(totalCredit)
 
		/**
		 * @dateDownloaded
		 */
		const datenow = new Date()
		const date = worksheet.getCell('G2')
		date.value = moment(datenow).format('LLL')
		date.alignment = { vertical: 'middle', horizontal: 'center' }
		
			
		/**
		 * @footer 
		 * @name of teller
		 */
		worksheet.mergeCells(`G${lastrow + 3}:H${lastrow + 3}`);
		worksheet.mergeCells(`G${lastrow + 4}:H${lastrow + 4}`);

		if(type === 'Admin'){
			
			const admin = worksheet.getCell(`G${lastrow + 4}`);
			admin.value = 'Prepared by: ADMIN';
			admin.alignment = { vertical: 'middle', horizontal: 'center' };
			admin.font = { bold : true };
			admin.border = { top: { style: 'thin' } };

		}else{

			const branchName = worksheet.getCell(`G${lastrow + 4}`);
			branchName.value = `Prepared by:${name.charAt(0).toUpperCase() + name.slice(1)}` ;
			branchName.alignment = { vertical: 'middle', horizontal: 'center' };
			branchName.font = { bold : true };
			branchName.border = { top: { style: 'thin' } };

		}
			 	

		worksheet.getColumn(2).width = 20;
		worksheet.getColumn(3).width = 20;
		worksheet.getColumn(4).width = 25;
		worksheet.getColumn(5).width = 25;
		worksheet.getColumn(6).width = 15;
		worksheet.getColumn(7).width = 20;
		worksheet.getColumn(8).width = 20;

		this.saveAsExcelFile(data, fileName)
	}

	private saveAsExcelFile(_buffer: any, fileName: string): void {

		const w  = this.workbook.xlsx.writeBuffer().then((_buffer: any) => {
			const blob = new Blob([_buffer], { type: EXCEL_TYPE });
			FileSaver.saveAs(blob, `${ fileName } Reports Exported - ${ moment().format('ll') }`+ EXCEL_EXTENSION);
		});
		console.log(w);
		
	}

	global(params:any) {
		params.alignment = { vertical: 'middle', horizontal: 'left' }
		params.font = { bold : true }
		params.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
	}
}
