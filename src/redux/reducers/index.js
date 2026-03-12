import {combineReducers} from 'redux'
import appReducer from './AppReducer'
import mealReducer from './MealReducer'

const rootReducer = combineReducers({
  appReducer,
  mealReducer,
})
export default rootReducer;
