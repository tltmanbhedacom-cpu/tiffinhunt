import axios from "axios";
import { apiPath } from '../constants'

export default axios.create({
  baseURL: 'http://remotequote.on-linedemo.com/AppPostingData.ashx',
  responseType: 'json',
  timeout :60 * 1000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});