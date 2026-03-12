import { apiPath , constants } from '../../constants'
import API from '../../utils/API';
import * as actionCb from './ActionCB'


/**
 * Login
 */
export function login(request) {
  return dispatch => {
    dispatch(actionCb.loginL(true));
    return API.post(apiPath.path.login, request)
      .then((response) => {
        console.log(response.data);
        if (response.status == 200) {
          dispatch(actionCb.loginS(response.data))
        } else {
          dispatch(actionCb.loginF(response.data.message))
        }
      })
      .catch(err => {
        var strError = handleError(err)
        console.log(strError)
        dispatch(actionCb.loginF(strError))
      });
  }
}

function handleError(err){
  console.log(err.response)
  //console.log("AXIOS ERROR: ", err + " **** ");
    var data = err.response;
    if(data ==null){
        return constants.apiError;
    }else{
        try {
            return data.data.message;
        } catch (error) {
          return constants.apiError;
        }
    }
}

/**
 * Register
 */
export function RegisterApi(request) {
  return dispatch => {
    dispatch(actionCb.RegisterL(true));
    return API.post(apiPath.path.register, request)
    .then((response) => {
      if (response.status == 200) {
        dispatch(actionCb.RegisterS(response.data))
      } else {
        dispatch(actionCb.RegisterF(response.data.message))
      }
    })
    .catch(err => {
      var strError = handleError(err)
      console.log(strError)
      dispatch(actionCb.RegisterF(strError))
    });
  }
}



