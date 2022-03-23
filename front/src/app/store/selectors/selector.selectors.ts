import { createFeatureSelector, createSelector } from '@ngrx/store'

/**user codes */
import { UserCodessAdapter, UserCodeState } from '../reducer/user.reducer'

const CodesFeatureSelector = createFeatureSelector<UserCodeState>('UserCodes')

export const USERCodes = createSelector(
    CodesFeatureSelector,
    UserCodessAdapter.getSelectors().selectAll
)