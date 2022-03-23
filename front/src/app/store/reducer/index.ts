import {
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer
  } from '@ngrx/store';
// import { UserCodes } from 'src/app/models/interfaces';

import { Actions } from './../actions/action.actions'

import { UserCodeState, UserCodeReducer } from './user.reducer';

export const UserCODES = 'UserCodes';

export interface State { 
	[UserCODES] : UserCodeState
}
export const reducers:ActionReducerMap<State, Actions> = {

	[UserCODES] : UserCodeReducer
	
}
