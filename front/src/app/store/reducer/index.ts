import {
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer
  } from '@ngrx/store';
// import { UserCodes } from 'src/app/models/interfaces';
import { environment } from '../../../environments/environment';
import { Actions } from './../actions/action.actions'

import { UserCodeState, UserCodeReducer } from './user.reducer';
// import { UserDetailsReducer, UserDetailsState } from './userdetails.reducer';

export const UserCODES = 'UserCodes';
export const UserDETAILS = 'UserDetails'

export interface State { 
	[UserCODES] : UserCodeState,
	// [UserDETAILS] : UserDetailsState
}
export const reducers:ActionReducerMap<State, Actions> = {
	[UserCODES] : UserCodeReducer,
	// [UserDETAILS] : UserDetailsReducer
	
}
export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];