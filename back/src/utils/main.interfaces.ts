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
