// import { createStore, combineReducers,applyMiddleware ,compose} from 'redux';
// import thunk from 'redux-thunk';
// import rootReducer from '../reducers'

// const enhancer = compose(applyMiddleware(thunk));

// const configureStore = () => {
//   return createStore(rootReducer,enhancer);
// }

// export default configureStore;

import { configureStore } from '@reduxjs/toolkit'
import AppReducer from '../reducers/AppReducer'
import MealReducer from '../reducers/MealReducer'

export default configureStore({
	reducer: {
		AppReducer: AppReducer,
    MealReducer : MealReducer
	}
})