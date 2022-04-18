// import { Action } from '@ngrx/store'
/**action or functionality sa actions */
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { UserCodes } from 'src/app/models/interfaces';
import { Actions, ADD_USERCODES, REMOVE_USERCODES } from './../actions/action.actions'


export interface UserCodeState extends EntityState<UserCodes> { }

export const UserCodessAdapter: EntityAdapter<UserCodes> = createEntityAdapter<UserCodes> ({
    selectId: (instance: UserCodes) => instance.id
})

const UserCodesDefaultState : UserCodeState = {
    ids : [],
    entities : {}
}

export const initialState: UserCodeState = UserCodessAdapter.getInitialState(UserCodesDefaultState)

export function UserCodeReducer(state : UserCodeState = initialState, action : Actions) : UserCodeState  {
    switch(action.type){
        case ADD_USERCODES: 
           	return  UserCodessAdapter.addOne(action.payload.data, state)
        case REMOVE_USERCODES: 
            return UserCodessAdapter.removeAll(state)
        default : 
            return state;
    }
}