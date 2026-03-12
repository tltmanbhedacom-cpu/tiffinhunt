import * as actionType from './ActionTypes'

export function getHomeMeal(homeMeals) {
  return {
    type: actionType.type.GET_HOME_MEALS,
    homeMeals
  }
}

export function setSelectedLatLng(selectedLatLng) {
  return {
    type: actionType.type.SELECTED_LAT_LNG,
    selectedLatLng
  }
}

export function setGuestLogin(isGuestLogin) {
  return {
    type: actionType.type.GUEST_LOGIN,
    isGuestLogin
  }
}

export function getMealDetails(mealDetail) {
  return {
    type: actionType.type.GET_MEAL_DETAIL,
    mealDetail
  }
}

export function getCategoryMealLIST(categoryMealList) {
  return {
    type: actionType.type.GET_CATEGORY_MEALLIST,
    categoryMealList
  }
}

export function getRestaurantAction(restaurantList) {
  return {
    type: actionType.type.GET_RESTAURANT_LIST,
    restaurantList
  }
}

export function getMealCategoryList(mealCategorys) {
  return {
    type: actionType.type.GET_MEAL_CATEGORY,
    mealCategorys
  }
}