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
export class LcExcelService {
	workbook = new Workbook();


	constructor() { }

	exportAsExcelFile(...data:any){

		const { firstname, lastname, email, contactNo, franchiseName, location } = JSON.parse(atob(sessionStorage.getItem('d')))[0]
		
		const fileName = 'alOletres'
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
		const subSeaders = [[franchiseName], [location], [email], [`+63${contactNo}`], [`${firstname}  ${lastname}`]]
		subSeaders.forEach(d => {	
						
			const x = worksheet.addRow([])
			worksheet.getCell(`D${ x.number }`).value = d[0].toUpperCase()
			worksheet.getCell(`D${ x.number }`).alignment = { vertical: 'middle', horizontal: 'left' }
			
		})
			/**
		 * @dateDownloaded
		 */
		const datenow = new Date()
		const date = worksheet.getCell('I2')
		date.value = `${'LOAD CENTRAL REPORTS'} ${moment(datenow).format('LLL')}`
		date.alignment = { vertical: 'middle', horizontal: 'center' }
		worksheet.addRow([]);

		// worksheet.addRow([]);
		// worksheet.addRow([]);
		// worksheet.addRow([]);
		// worksheet.addRow([]);
		// worksheet.addRow([]);

		const tableHeaders : headerss = {
			headers : [ 'NO', 'REFERENCE NO.', 'TRANSACTION ID', 'MOBILE NUMBER', 'PRODUCT CODE', 'AMOUNT', 'MARKUP', 'EPIN', 'CREATED BY', 'CREATED DATE', 'STATUS']
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
			const status = d.status === 0 ? 'Success' : 'Cancelled'
			rows = [i, d.reference_id, d.TransId, `+63${d.mobileNo}`, d.productCode, d.amount, d.markUp, d.ePIN, d.createdBy.toUpperCase(), moment(d.createdDate).format('LLL'), status ]
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

		worksheet.mergeCells(`D${lastrow + 1}:E${lastrow + 1}`);
		
		const totalWord = worksheet.getCell(`D${lastrow + 1}`)
		totalWord.value = 'TOTAL'	
		totalWord.alignment = { vertical: 'middle', horizontal: 'center' }
		totalWord.font = { bold : true }
		totalWord.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

		/**
		 * @AMOUNT_TOTAL
		 */

		 const totalAmount = worksheet.getCell(`F${lastrow + 1}`)
		 totalAmount.value = { formula: `=SUM(F8 :F${lastrow})`, date1904: false };	
		 this.global(totalAmount)

		/**
		 * @MARKUP_TOTAL
		 */
		
		const totalMarkUp = worksheet.getCell(`G${lastrow + 1}`)
		totalMarkUp.value = { formula: `=SUM(G8 :G${lastrow})`, date1904: false };	
		this.global(totalMarkUp)

		worksheet.getColumn(2).width = 20;
		worksheet.getColumn(3).width = 20;
		worksheet.getColumn(4).width = 20;
		worksheet.getColumn(5).width = 15;
		
		worksheet.getColumn(9).width = 15;
		worksheet.getColumn(10).width = 15;

		this.saveAsExcelFile(data, fileName)
		
	}

	private saveAsExcelFile(_buffer: any, fileName: string): void {

		const w  = this.workbook.xlsx.writeBuffer().then((_buffer: any) => {
			const blob = new Blob([_buffer], { type: EXCEL_TYPE });
			FileSaver.saveAs(blob, `${ fileName } Load Central Reports Exported - ${ moment().format('ll') }`+ EXCEL_EXTENSION);
		});
		console.log(w);
		
	}

	global(params:any) {
		params.alignment = { vertical: 'middle', horizontal: 'left' }
		params.font = { bold : true }
		params.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
	}
}
