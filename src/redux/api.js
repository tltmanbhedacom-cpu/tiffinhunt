import { apiPath, constants } from '../constants'
import API from '../utils/API';


export function apiGetFavoriteDish() {
    return new Promise((resolve, reject) => {
        API.get(apiPath.path.getFavouriteRestaurant, {})
            .then((response) => {
                console.log("RES 1",response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiRegister(req) {
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.register, req)
            .then((response) => {
                if (response.status == 200) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiLogin(req) {
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.login, req)
            .then((response) => {
                console.log("response : ",JSON.stringify(response))
                if (response.status == 200) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log("apiLogin err: ",strError)
                reject(strError)
            });

    });
}

export function apiForgotPassword(req) {
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.checkEmailForgotPassword, req)
            .then((response) => {
                console.log("RES 1",response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiChangePassword(req) {
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.changePassword, req)
            .then((response) => {
                console.log("RES 1",response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function getRestaurant(request) {
    console.log('getRestaurant ',request)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.getRestaurant, request)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiGetHomeMeal(request) {
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.getHome, request)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiGetMealDetail(request) {
    console.log('apiGetMealDetail ',request)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.getRestaurantDetails, request)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}


export function apiUnFavoriteMeal(request) {
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.unfavouriteDish, request)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.message)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiFavoriteMeal(request) {
    console.log(request)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.favouriteRestaurant, request)
            .then((response) => {
                if (response.status == 200) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiAddOrder(request) {
    console.log('PLACE ORDER : ',request);
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.addOrderMeal, request)
            .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    resolve(response.data.message)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiGetMealCategory() {
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.getCategories, {})
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiEditAddress(request) {
    console.log('EditAddress ',request)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.editAddress, request)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function addAddress(request) {
    console.log('addAddress ',request)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.addAddress, request)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}


export function deleteAddress(id) {
    // var bodyFormData = new FormData();
    // bodyFormData.append('address_id', id);

    var bodyFormData = {
        'address_id': id
    }
    console.log('req ',bodyFormData)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.deleteAddress, bodyFormData)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiAddRating(req) {
    console.log('Rating param : ',req)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.addRate, req)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}


export function apiSkipMealplan(req) {
    console.log('req ',req)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.skipMealplan, req)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function apiViewOrder() {
    return new Promise((resolve, reject) => {
        API.get(apiPath.path.viewOrder, {})
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function orderHelp(req) {
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.orderHelp, req)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.message)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function verifyOTP(req) {
    console.log('verifyOTP Req ',req)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.verify_otp, req)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function sendOTP(req) {
    console.log('sendOTP Req ',req)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.check_mobile_otp, req)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function orderPaymentv1(req) {
    console.log('Payment Req ',req)
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.orderPayment, req)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function getAddress() {
    return new Promise((resolve, reject) => {
        API.get(apiPath.path.getAddress, {})
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

export function editProfile(parm) {
    return new Promise((resolve, reject) => {
        API.post(apiPath.path.editProfile, parm)
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    resolve(response.data.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(err => {
                var strError = handleError(err)
                console.log(strError)
                reject(strError)
            });

    });
}

function handleError(err){
    console.log(err.response)
    console.log("AXIOS ERROR: ", err + " **** ");
      var data = err.response;
      if(data ==null){
          return constants.apiError;
      }else{
          try {
            if(!data.data.message) return constants.apiError
              else return data.data.message;
          } catch (error) {
            return constants.apiError;
          }
      }
  }

