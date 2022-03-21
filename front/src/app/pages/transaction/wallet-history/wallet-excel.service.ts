import { Injectable } from '@angular/core';
import FileSaver from 'file-saver';
import { Workbook } from "exceljs";
import { companyLog } from './../../../models/main.enums'
import moment from 'moment';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;';
const EXCEL_EXTENSION = '.xlsx';
const { bs64image } = companyLog

import { headerss } from 'src/app/globals/interface/branch.interface';


@Injectable({
  providedIn: 'root'
})
export class WalletExcelService {
	workbook = new Workbook();

    constructor() { }
	exportAsExcelFile(...data:any){

		

	
		
		const fileName = atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'? ''
						: ''
		this.workbook.creator = 'alOletres';
		this.workbook.lastModifiedBy = 'Me';
		this.workbook.created = new Date();
		this.workbook.modified = new Date();
		this.workbook.lastPrinted = new Date();

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

		
		const companyLogo = this.workbook.addImage({

			base64: bs64image,
			extension: 'png',
		});	

		worksheet.addImage(companyLogo, 'A1:C6')//adding image

		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			/**wla koy e display bayot */
			worksheet.addRow([])
			worksheet.addRow([])
			worksheet.addRow([])
			worksheet.addRow([])
			worksheet.addRow([])
		}else{
			const { firstname, lastname, email, contactNo, franchiseName, location } = JSON.parse(atob(sessionStorage.getItem('d')))[0]
			const subSeaders = [[franchiseName], [location], [email], [`+63${contactNo}`], [`${firstname}  ${lastname}`]]
			subSeaders.forEach(d => {	
							
				const x = worksheet.addRow([])
				worksheet.getCell(`D${ x.number }`).value = d[0].toUpperCase()
				worksheet.getCell(`D${ x.number }`).alignment = { vertical: 'middle', horizontal: 'left' }
				
			})
		}
		

		/**
		 * @dateDownloaded
		 */
		 const datenow = new Date()
		 const date = worksheet.getCell('I2')
		 date.value = `${'LOAD CENTRAL REPORTS'} ${moment(datenow).format('LLL')}`
		 date.alignment = { vertical: 'middle', horizontal: 'center' }
		 worksheet.addRow([]);
 
		 const tableHeaders : headerss = {
			 headers : [ 'NO', 'TRANSACTION NAME', 'TELLER', 'COLLECTION', 'SALES', 'INCOME', 'DATE TRANSACTED', 'STATUS']
		 }
 
		 const headerRow = worksheet.addRow(tableHeaders.headers)
 
		 headerRow.eachCell((cell, column)=>{
			 cell.fill = {
				 type: 'pattern',
				 pattern: 'solid',
				 fgColor: { argb: '00cc00' },
				 bgColor: { argb: '#208000' },
				 
			 };
			 cell.alignment = { vertical: 'middle', horizontal: 'center' };
			 cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
		 })

		 let rows :any [] = []
		
		 data[0].forEach((d:any, index:any) => {

			const transactionName = d.transaction_id.slice(0, 3) === 'BRK' ? 'BARKOTA' 
									: d.transaction_id.slice(0, 3) === 'IPC' ? 'LOAD CENTRAL' 
									: ''
			 const i = index + 1
			 rows = [i , transactionName, d.tellerCode, d.collection, d.sales, d.income, moment(d.transacted_date).format('LLL'), 'Success']
			 const x = worksheet.addRow(rows)
 
			 x.eachCell((cell, number) => {		
				 
				 cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
				 cell.alignment = { vertical: 'middle', horizontal: 'center' };
			 
			 });	
		 });

		 	/**
		 * @FOOTER
		 */
		const rowsS = worksheet.getColumn(1);
		const lastrow = rowsS.worksheet.rowCount

		worksheet.mergeCells(`B${lastrow + 1}:C${lastrow + 1}`);
		
		const totalWord = worksheet.getCell(`B${lastrow + 1}`)
		totalWord.value = 'TOTAL'	
		totalWord.alignment = { vertical: 'middle', horizontal: 'center' }
		totalWord.font = { bold : true }
		totalWord.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

		/**
		 * @COLLECTION_TOTAL
		 */

		 const totalAmount = worksheet.getCell(`D${lastrow + 1}`)
		 totalAmount.value = { formula: `=SUM(D8 :D${lastrow})`, date1904: false };	
		 this.global(totalAmount)

		 /**TOTAL SALES */
		 const totalsales = worksheet.getCell(`E${lastrow + 1}`)
		 totalsales.value = { formula: `=SUM(E8 :E${lastrow})`, date1904: false };	
		 this.global(totalsales)

		 /**TOTAL INCOME */
		 const totalIncome = worksheet.getCell(`F${lastrow + 1}`)
		 totalIncome.value = { formula: `=SUM(F8 :F${lastrow})`, date1904: false };	
		 this.global(totalIncome)

		 worksheet.getColumn(2).width = 20;
		 worksheet.getColumn(3).width = 20;
		 worksheet.getColumn(4).width = 15;
		 worksheet.getColumn(5).width = 15;
		 worksheet.getColumn(6).width = 15;
		 worksheet.getColumn(7).width = 30;
		this.saveAsExcelFile(data, fileName)
	}

	private saveAsExcelFile(_buffer: any, fileName: string): void {

		const w  = this.workbook.xlsx.writeBuffer().then((_buffer: any) => {
			const blob = new Blob([_buffer], { type: EXCEL_TYPE });
			FileSaver.saveAs(blob, `${ fileName } Load Central Reports Exported - ${ moment().format('ll') }`+ EXCEL_EXTENSION);
		});
		
	}
	global(params:any) {
		params.alignment = { vertical: 'middle', horizontal: 'left' }
		params.font = { bold : true }
		params.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
	}
}
