import { Injectable } from '@angular/core';
import FileSaver from 'file-saver';
import { Workbook } from "exceljs";
import { companyLog } from './../../../models/main.enums'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;';
const EXCEL_EXTENSION = '.xlsx';
const { bs64image } = companyLog

@Injectable({
  providedIn: 'root'
})
export class LcExcelService {

  constructor() { }
}
