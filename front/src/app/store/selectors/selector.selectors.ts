import { createFeatureSelector, createSelector } from '@ngrx/store'

/**user codes */
import { UserCodessAdapter, UserCodeState } from '../reducer/user.reducer'
/**User Details */
// import { UserDetailsAdapter, UserDetailsState } from '../reducer/userdetails.reducer'

const CodesFeatureSelector = createFeatureSelector<UserCodeState>('UserCodes')

// const DetailsFeatureSelector = createFeatureSelector<UserDetailsState>('UserDetails')

/**query of all stored data */
export const UserCodes = createSelector(
    CodesFeatureSelector,
    UserCodessAdapter.getSelectors().selectAll
)
// export const UserDetails = createSelector(
//     DetailsFeatureSelector,
//     UserDetailsAdapter.getSelectors().selectAll
// )

