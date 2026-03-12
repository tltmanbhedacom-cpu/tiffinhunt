import axios from "axios";
import { apiPath, constants } from '../constants'
import { token } from '../utils/Session'

const APIKit =axios.create({
  baseURL: apiPath.path.base,
  responseType: 'json',
  timeout :60 * 1000,
  headers: {
    'Accept' : 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
});

//Set JSON Web Token in Client to be included in all calls
export const setClientToken = token => {
  APIKit.defaults.headers.common['Authorization'] = JSON.parse(token);
  // APIKit.interceptors.request.use(function(config) {
  //  config.headers.Authorization = JSON.parse(token);
  //   return config;
  // });
};


export default APIKit;