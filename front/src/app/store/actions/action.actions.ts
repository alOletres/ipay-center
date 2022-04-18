// import { Injectable } from '@angular/core';
/**mura siya og buttons or ui  */
import { Action } from '@ngrx/store'
import { UserCodes , UserDetails } from 'src/app/models/interfaces';
/**USER CODES VARIABLES */
export const ADD_USERCODES = '[USERCODES] Add'
export const REMOVE_USERCODES = '[USERCODES] Remove'

/**USER DETAILS */
export const ADD_USERDETAILS = '[USERDETAILS] Add user details'
export const REMOVE_USERDETAILS = '[USERDETAILS] Remove user details'



/**STORE CODE USER */
export class AddUser implements Action {
    readonly type = ADD_USERCODES
    constructor(public payload : {
        data : UserCodes 
    }){}
}
export class RemoveUser implements Action {
    readonly type = REMOVE_USERCODES
}

/**USER DETAILS */
export class AddUserDetails implements Action {
    readonly type = ADD_USERDETAILS
    constructor (public payload : {
        data : UserDetails
    }) {}
}
export class RemoveUserDetails implements Action {
    readonly type = REMOVE_USERDETAILS
}

export type Actions = AddUser 
                    | RemoveUser
                    | AddUserDetails
                    | RemoveUserDetails 