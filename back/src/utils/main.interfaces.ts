export interface DatabaseConfigs {
	host?: string,
	user?: string,
	password?: string,
	database?: string
}

export interface ticketPrices {
	voyageId : string
	priceGroupId : string
	routeAccommodationId : string
}

export interface walletCollection {
	collection  : number,
	sales 		: number,
	income 		: number
}
export interface LoadCentralCredentials {
	user? : string,
	password? : string
}

export interface MUTISYS_PARTNER_SECRET  {
	SECRET?: string;
}
export interface MultisysPayload {
	account_number : string, 
	amount : number,
	contact_number : number,
	biller : string,
	channel : string
}
export interface Messages {
	message : object
	
}
