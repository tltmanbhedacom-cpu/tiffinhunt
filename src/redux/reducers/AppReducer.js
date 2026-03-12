// import * as actionType from '../actions/ActionTypes'

// const INITIAL_STATE = {
//   isLoading: false,
//   data: [],
//   allAddress: [],
//   message: '',
//   favoriteDish: [],
//   viewOrders: [],
//   isGuestLogin: false,
// }

// export default function AppReducerInit(state = INITIAL_STATE, action) {
//   switch (action.type) {
//     case actionType.GUEST_LOGIN:
//       return {
//         ...state,
//         isGuestLogin: action.isGuestLogin,
//       }
//     case actionType.type.LOG_OUT:
//       return INITIAL_STATE
//     case actionType.type.DELETE_ADDRESS:
//       let { id } = action.allAddress;
//       //clone the current state
//       let clone = state.allAddress;
//       //check if quote already exist
//       const index = clone.findIndex((obj) => obj.id === id);
//       //if the quote is in the array, remove the quote
//       console.log('index ', index)
//       if (index !== -1) clone.splice(index, 1);
//       console.log('clone ', clone)
//       return {
//         ...state,
//         data: clone,
//         message: undefined
//       }
//     case actionType.type.UN_FAVORITE_DISH:
//       let cloneFavDish = state.favoriteDish;
//       const indexFavDish = cloneFavDish.findIndex((obj) => obj.favourite_id === action.unFavoriteId);
//       if (indexFavDish !== -1) cloneFavDish.splice(indexFavDish, 1);
//       return {
//         ...state,
//         favoriteDish: cloneFavDish,
//         message: undefined
//       }
//     case actionType.type.GET_ADDRESS_S:
//       return {
//         ...state,
//         allAddress: action.allAddress,
//         message: undefined
//       }
//     case actionType.type.VEW_ORDER_S:
//       return {
//         ...state,
//         viewOrders: action.viewOrders,
//         message: undefined
//       }
//     case actionType.type.GET_FAVORITE_DISH:
//       return {
//         ...state,
//         favoriteDish: action.favoriteDish,
//         message: undefined
//       }
//     case actionType.type.LOGIN_L:
//       return {
//         ...state,
//         isLoading: true,
//         data: {},
//         message: undefined
//       }
//     case actionType.type.LOGIN_S:
//       return {
//         ...state,
//         isLoading: false,
//         data: action.data,
//         message: undefined
//       }
//     case actionType.type.LOGIN_F:
//       return {
//         ...state,
//         isLoading: false,
//         data: {},
//         message: action.message
//       }

//     case actionType.type.REGISTER_L:
//       return {
//         ...state,
//         isLoading: true,
//       }
//     case actionType.type.REGISTER_S:
//       return {
//         ...state,
//         isLoading: false,
//         data: action.data,
//         message: undefined
//       }
//     case actionType.type.REGISTER_F:
//       return {
//         ...state,
//         isLoading: false,
//         message: action.message
//       }
//     default:
//       return state
//   }
// }

import {createSlice} from '@reduxjs/toolkit';

export const AppReducer = createSlice({
  name: 'AppReducer',
  initialState: {
    isLoading: false,
    data: [],
    allAddress: [],
    message: '',
    favoriteDish: [],
    viewOrders: [],
    isGuestLogin: false,
  },
  reducers: {
    setGuestLogin: (state, action) => {
      state.isGuestLogin = action.payload;
    },
    OnLogout: (state, action) => {
      return {
        isLoading: false,
        data: [],
        allAddress: [],
        message: '',
        favoriteDish: [],
        viewOrders: [],
        isGuestLogin: false,
      };
    },
    deleteAddressS: (state, action) => {
      let {id} = action.payload;
      //clone the current state
      let clone = state.allAddress;
      //check if quote already exist
      const index = clone.findIndex(obj => obj.id === id);
      //if the quote is in the array, remove the quote
      console.log('index ', index);
      if (index !== -1) clone.splice(index, 1);
      console.log('clone ', clone);
      state.data = clone;
      state.message = undefined;
    },
    getUnFavoriteDishS: (state, action) => {
      let cloneFavDish = state.favoriteDish;
      const indexFavDish = cloneFavDish.findIndex((obj) => obj.favourite_id === action.payload);
      if (indexFavDish !== -1) cloneFavDish.splice(indexFavDish, 1);
      state.favoriteDish = cloneFavDish;
      state.message = undefined;
    },
    getAddressS:(state, action)=>{
      state.allAddress = action.payload;
      state.message = undefined;
    },
    getViewOrderS:(state, action)=>{
      state.viewOrders = action.payload;
      state.message = undefined;
     
    },
    getFavoriteDishS:(state, action)=>{
      state.favoriteDish = action.payload;
      state.message = undefined;
    },
    loginL:(state, action)=>{
      state.isLoading = true
      state.data = {}
      state.message = undefined;
    },
    loginS:(state, action)=>{
      state.isLoading = false
      state.data = action.payload
      state.message = undefined;
     
    },
    loginF:(state, action)=>{
      state.isLoading = false
      state.data = {}
      state.message = action.payload;
    },
    RegisterL:(state, action)=>{
      state.isLoading = true
     
    },
    RegisterS:(state, action)=>{
      state.isLoading = false
      state.data = action.payload
      state.message = undefined
    },
    RegisterF:(state, action)=>{
      state.isLoading = false
      state.message = undefined
    },
  },
});

// Action creators are generated for each case reducer function
export const {setGuestLogin, OnLogout,deleteAddressS, getUnFavoriteDishS, getAddressS, getViewOrderS, getFavoriteDishS, loginL, loginS, loginF, RegisterL, RegisterS, RegisterF } = AppReducer.actions;

// export const user_data = state => state.AppReducer.user_data;
export default AppReducer.reducer;
