export interface Customer {
	name: string;
	email: string;
	product: string;
	price: string;
	date: string;
	city: string;
	status: string;
}

export interface PassengerDetails {
	passengers : [{
		passenger : {
			firstname : string;
			lastname  : string;
			mi 		  : string;
			isDriver	: BigInteger;
			gender 		: BigInteger;
			birthdate	: string;
			idnumber	: null;
			nationality : string;
			discountType : string;
		},
		departurePriceId : BigInteger,
		departureCotId : BigInteger
	}],
	contactInfo : {

		name : string;
		email : string;
		mobile : string;
		address : string;

	},

	allowPromotionsNotification : BigInteger	

}

export interface PassengerCount {
	id: number;
	firstName : string;
	lastName : string;
	middleInitial : string;
	isDriver : number
	gender : number
	birthDate : string
	nationality : string
	discount : string
	departurePriceId: string
	departureCotId: string
	cots : string
}

export interface Month{
	month : object 
}