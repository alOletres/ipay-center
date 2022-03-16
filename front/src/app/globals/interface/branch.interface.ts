export interface branchType {
	no: number;
	type: string;
}

export interface branch {
	ownerFirstname: string,
	ownerLastname: string,
	contactNo: string,
	emailAdd: string,
	address: string,
	branchName: string,
	branchType: string,
	branchCode: string,
}
export interface fbranch{
	referenceNumber: string,
	walletAmount : string,
	fbranchCode: string,
	
	lastname : string,
	firstname : string,
	contactNo : string, 
	email : string,
	location: string,
	franchiseName : string
}
export interface accountName{
	firstName : string;
	lastName : string;

}

export interface barkotaReports{
	transactionNo : string
	services : string
	collection : number
	sales : number
	income : number
	status : string
	transacted_by : string
}
