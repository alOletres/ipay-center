// import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store'
import { UserCodes } from 'src/app/models/interfaces';

export const ADD_USERCODES = '[USERCODES] Add'
export const REMOVE_USERCODES = '[USERCODES] Remove'

export class AddUser implements Action {
    readonly type = ADD_USERCODES
    constructor(public payload : UserCodes){}
}
export class RemoveUser implements Action {
    readonly type = REMOVE_USERCODES
    constructor(public payload : number){}
}
export type Actions = AddUser | RemoveUser 