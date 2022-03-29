import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { EndPoint } from "./../../../globals/endpoints";

/**excel import */
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
export class GovbillpaymentService {
	workbook = new Workbook();
  	constructor(private http : HttpClient) { }
	
	  async multisys(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/multisy/mutisys/getMultisysTransaction`).toPromise()
		}catch(err:any){
			throw err
		}
	}


	/**excel  */
	exportAsExcelFile(...data:any){

		const fileName = ''
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
			/**ADMIN  */
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
		 date.value = `${'Govt Bill Payment REPORTS'} ${moment(datenow).format('LLL')}`
		 date.alignment = { vertical: 'middle', horizontal: 'center' }
		 worksheet.addRow([]);
 
		 const tableHeaders : headerss = {
			 headers : [ 'NO', 'CUSTOMER NAME', 'ACCOUNT NUMBER', 'AMOUNT', 'CONTACT NUMBER', 'REF NO.', 'BILLER', 'COLLECTIONS', 'SALES', 'INCOME', 'STATUS']
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

			const i = index + 1
			rows = [i, d.customer_name.toUpperCase(), d.account_number, d.amount, d.contact_number, d.refno, d.biller, d.collections, d.sales, d.income, 'Success']
			const x = worksheet.addRow(rows)

			x.eachCell((cell, number) => {		
				
				cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
				cell.alignment = { vertical: 'middle', horizontal: 'left' };
			
			});	
		});
		/**
		 * @FOOTER
		*/
		const rowsS = worksheet.getColumn(1);
		const lastrow = rowsS.worksheet.rowCount

		worksheet.mergeCells(`F${lastrow + 1}:G${lastrow + 1}`);
		
		const totalWord = worksheet.getCell(`F${lastrow + 1}`)
		totalWord.value = 'TOTAL'	
		totalWord.alignment = { vertical: 'middle', horizontal: 'center' }
		totalWord.font = { bold : true }
		totalWord.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
		/**
		 * @_TOTALCOLLECCTION
		 */

		 const collections = worksheet.getCell(`H${lastrow + 1}`)
		 collections.value = { formula: `=SUM(H8 :H${lastrow})`, date1904: false };	
		 this.global(collections)
		/**
		 * @TOTAL_SALES
		 */
		 const sales = worksheet.getCell(`I${lastrow + 1}`)
		 sales.value = { formula: `=SUM(I8 :I${lastrow})`, date1904: false };	
		 this.global(sales)
		/**
		* @TOTAL_INCOME
		*/
		const income = worksheet.getCell(`J${lastrow + 1}`)
		income.value = { formula: `=SUM(J8 :J${lastrow})`, date1904: false };	
		this.global(income)
		
		 worksheet.getColumn(2).width = 20;
		 worksheet.getColumn(3).width = 20;
		 worksheet.getColumn(5).width = 20;
		 worksheet.getColumn(6).width = 15;
		 worksheet.getColumn(7).width = 15;
		 worksheet.getColumn(8).width = 15;
		 this.saveAsExcelFile(data, fileName)
	}
	private saveAsExcelFile(_buffer: any, fileName: string): void {

		const w  = this.workbook.xlsx.writeBuffer().then((_buffer: any) => {
			const blob = new Blob([_buffer], { type: EXCEL_TYPE });
			FileSaver.saveAs(blob, `${ fileName } Gov't Bill Payment Reports Exported - ${ moment().format('ll') }`+ EXCEL_EXTENSION);
		});
	}
	global(params:any) {
		params.alignment = { vertical: 'middle', horizontal: 'left' }
		params.font = { bold : true }
		params.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
	}
}
