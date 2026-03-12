import * as actionType from './ActionTypes'

// L -loading
// S- success
// F- fail

export function addAddressS(data) {
  return {
    type: actionType.type.ADD_ADDRESS_S,
    data
  }
}


export function getUnFavoriteDishS(unFavoriteId) {
  return {
    type: actionType.type.UN_FAVORITE_DISH,
    unFavoriteId
  }
}

export function placeOrderS(order) {
  return {
    type: actionType.type.PLACE_ORDER,
    order
  }
}

export function getFavoriteDishS(favoriteDish) {
  return {
    type: actionType.type.GET_FAVORITE_DISH,
    favoriteDish
  }
}

export function getViewOrderS(viewOrders) {
  return {
    type: actionType.type.VEW_ORDER_S,
    viewOrders
  }
}

export function getAddressS(allAddress) {
  return {
    type: actionType.type.GET_ADDRESS_S,
    allAddress
  }
}

export function deleteAddressS(id) {
  return {
    type: actionType.type.DELETE_ADDRESS,
    allAddress :{ id }
  }
}

export function OnLogout() {
  return {
    type: actionType.type.LOG_OUT,
  }
}

export function OnSelectAddress(address) {
  return {
    type: actionType.type.SELECT_ADDRESS,
    selectedAddress : address
  }
}

//[----Login -----]
export function loginL(bool) {
  return {
    type: actionType.type.LOGIN_L,
    isLoading: bool
  }
}
export function loginS(data) {
  return {
    type: actionType.type.LOGIN_S,
    data
  }
}
export function loginF(message) {
  return {
    message,
    type: actionType.type.LOGIN_F,
    
  }
}

//[---- Register -----]
export function RegisterL(bool) {
  return {
    type: actionType.type.REGISTER_L,
    isLoading: bool
  }
}
export function RegisterS(data) {
  return {
    type: actionType.type.REGISTER_S,
    data
  }
}
export function RegisterF(message) {
  return {
    type: actionType.type.REGISTER_F,
    message
  }
}
