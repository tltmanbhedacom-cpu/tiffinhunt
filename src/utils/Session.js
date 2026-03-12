import { keys } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function isLoggedIn() {
  try {
    const value = await AsyncStorage.getItem(keys.isLoggedIn)
    if (value !== null) {
      return 1;
    } else {
      return 0;
    }
  } catch (e) {
    return 0;
  }
}

export async function isGuest() {
  try {
    const value = await AsyncStorage.getItem('isGuest')
    if (value !== null) {
      return parseInt(value);
    } else {
      return 0;
    }
  } catch (e) {
    return 0;
  }
}

export async function getUser() {
  const value = await AsyncStorage.getItem(keys.user)
  if (value !== null) {
    return JSON.parse(value);
  } else {
    return {};
  }
}

export async function getCart() {
  const value = await AsyncStorage.getItem(keys.cart)
  if (value !== null) {
    return JSON.parse(value);
  } else {
    return {};
  }
}
export function setCart(cartObj) {
  AsyncStorage.setItem(keys.cart, JSON.stringify(cartObj))
}


export function setSelectedAddress(address) {
  AsyncStorage.setItem(keys.selectedAddress, JSON.stringify(address))
}


export async function getSelectedAddress() {
  const value = await AsyncStorage.getItem(keys.selectedAddress)
  if (value !== null) {
    return JSON.parse(value);
  } else {
    return {};
  }
}

export function setUserObject(userObj) {
  AsyncStorage.setItem(keys.user, JSON.stringify(userObj))
}

export async function userId() {
  try {
    const value = await AsyncStorage.getItem(keys.userId)
    if (value !== null) {
      return value;
    } else {
      return -1;
    }
  } catch (e) {
    return -1;
  }
}
export async function setToken(token){
  AsyncStorage.setItem(keys.token, JSON.stringify(token))
}
export async function token() {
  try {
    const value = await AsyncStorage.getItem(keys.token)
    if (value !== null) {
      return value;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
}