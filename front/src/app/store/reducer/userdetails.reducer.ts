// import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
// import { UserDetails } from 'src/app/models/interfaces'
// import { Actions, ADD_USERDETAILS, REMOVE_USERDETAILS } from './../actions/action.actions'


// export interface UserDetailsState extends EntityState<UserDetails> { }

// export const UserDetailsAdapter: EntityAdapter<UserDetails> = createEntityAdapter<UserDetails> ({
//     selectId: (instance: UserDetails) => instance.id
// })


// const UserDetailsDefaultState : UserDetailsState = {
//     ids : [],
//     entities : {}
// }

// export const initialState: UserDetailsState = UserDetailsAdapter.getInitialState(UserDetailsDefaultState)
// export function UserDetailsReducer(state : UserDetailsState = initialState, action : Actions) : UserDetailsState  {
//     switch(action.type){
//         case ADD_USERDETAILS: 
//            	return  UserDetailsAdapter.addOne(action.payload.data, state)
//         case REMOVE_USERDETAILS: 
//             return UserDetailsAdapter.removeAll(state)
//         default : 
//             return state;
//     }
// }