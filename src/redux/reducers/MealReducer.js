// import * as actionType from '../actions/ActionTypes'

// const INITIAL_STATE = {
//   data: [],
//   message: '',
//   homeMeals: [],
//   categoryMealList: [],
//   mealCategorys: [],
//   restaurantList: [],
//   mealDetail: [],
//   selectedAddress: {},
//   selectedLatLng: { lat: 0, lng: 0 }
// }

// export default function MealReducerInit(state = INITIAL_STATE, action) {
//   switch (action.type) {
//     case actionType.type.LOG_OUT:
//       return INITIAL_STATE
//     case actionType.type.SELECT_ADDRESS:
//       return {
//         ...state,
//         selectedAddress: action.selectedAddress,
//       }
//     case actionType.type.SELECTED_LAT_LNG:
//       return {
//         ...state,
//         selectedLatLng: action.selectedLatLng,
//       }
//     case actionType.type.GET_MEAL_DETAIL:
//       return {
//         ...state,
//         mealDetail: action.mealDetail,
//         message: undefined
//       }
//     case actionType.type.GET_RESTAURANT_LIST:
//       return {
//         ...state,
//         restaurantList: action.restaurantList,
//         message: undefined
//       }
//     case actionType.type.GET_HOME_MEALS:
//       return {
//         ...state,
//         homeMeals: action.homeMeals,
//         message: undefined
//       }
//     case actionType.type.GET_CATEGORY_MEALLIST:
//       return {
//         ...state,
//         categoryMealList: action.categoryMealList,
//         message: undefined
//       }
//     case actionType.type.GET_MEAL_CATEGORY:
//       return {
//         ...state,
//         mealCategorys: action.mealCategorys,
//         message: undefined
//       }
//     default:
//       return state
//   }
// }



import {createSlice} from '@reduxjs/toolkit';

export const MealReducer = createSlice({
  name: 'MealReducer',
  initialState: {
    data: [],
    message: '',
    homeMeals: [],
    categoryMealList: [],
    mealCategorys: [],
    restaurantList: [],
    mealDetail: [],
    selectedAddress: {},
    selectedLatLng: { lat: 0, lng: 0 }
  },
  reducers: {
    OnLogout: (state, action) => {
      return {
        data: [],
    message: '',
    homeMeals: [],
    categoryMealList: [],
    mealCategorys: [],
    restaurantList: [],
    mealDetail: [],
    selectedAddress: {},
    selectedLatLng: { lat: 0, lng: 0 }
      };
    },
    OnSelectAddress: (state, action) => {
      state.selectedAddress = action.payload
    },
    setSelectedLatLng: (state, action) => {

      state.selectedLatLng = action.payload
    },
    getMealDetails: (state, action) => {

      state.mealDetail = action.payload
      state.message =undefined
    },
    getRestaurantAction: (state, action) => {

      state.restaurantList = action.payload
      state.message =undefined

    },
    getHomeMeal: (state, action) => {
      console.log("getHomeMeal reducer : ",JSON.stringify(action))
      state.homeMeals = action.payload
      state.message =undefined
    },
    getCategoryMealLIST: (state, action) => {

      state.categoryMealList = action.payload
      state.message =undefined

    },
    getMealCategoryList : (state, action) => {

      state.mealCategorys = action.payload
      state.message =undefined
    },
   
  },
});

// Action creators are generated for each case reducer function
export const {OnLogout, OnSelectAddress, setSelectedLatLng, getMealDetails, getRestaurantAction, getHomeMeal,getCategoryMealLIST,getMealCategoryList  } = MealReducer.actions;

// export const user_data = state => state.AppReducer.user_data;
export default MealReducer.reducer;