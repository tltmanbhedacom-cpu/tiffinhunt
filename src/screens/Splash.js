import React, { useEffect, useState } from "react";
import { View, StyleSheet } from 'react-native';

import { constants, images } from '../constants'
import { ScalableImage, ImageFast, NoInternet } from '../component'
import { isLoggedIn,isGuest, token, userId, getSelectedAddress } from '../utils/Session'
import { setClientToken } from '../utils/API'
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { OnSelectAddress } from "../redux/reducers/MealReducer";
// import { OnSelectAddress } from '../redux/actions/ActionCB'

var nextScreenTimeOut = null
function Splash({ route, navigation }) {
  const [isOnline, setIsOnline] = useState(true)
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (nextScreenTimeOut != null) clearTimeout(nextScreenTimeOut)
      nextScreenTimeOut = setTimeout(() => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        setIsOnline(state.isConnected)
        if (state.isConnected){
          unsubscribe();
          init();
        }
      }, 700);

    });
    return () => {
      unsubscribe();
    }
  }, []);


  async function init() {
    if (!isOnline) return;
    setTimeout(async () => {
      if (!isOnline) return
      var result = await isLoggedIn();
      var isGuestUser = await isGuest();
      console.log('isGuestUser ',isGuestUser)
      if(isGuestUser == 2){
        //Guest Login
        navigation.reset({
          index: 0,
          routes: [{ name: 'TabStack' }],
        });
        return
      }else if (result && result > 0) {
        const tokenBarrier = await token();
        constants.user_id = await userId();
        var selectedAdress = await getSelectedAddress()
        dispatch(OnSelectAddress(selectedAdress))
        console.log('tokenBarriertokenBarrier ',tokenBarrier)
        if(!tokenBarrier && tokenBarrier.length<=0){
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        }else{
          setClientToken(tokenBarrier);
          console.log('USER_ID : ', constants.user_id)
          console.log('SPLASH : ', tokenBarrier)
          console.log('selectedAdress ',selectedAdress)
          navigation.reset({
            index: 0,
            routes: [{ name: 'TabStack' }],
          });
        }
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      }
    }, 100);
  }



  return (
    <View style={styles.root}>
      {isOnline ?
        <View style={styles.root}>
          <ImageFast
            contain
            style={{ width: 200, height: 200 }}
            source={images.splashIcon} />

          <View style={styles.bottomImg}>
            <ScalableImage
              width={constants.screenWidth}
              source={images.splashFood} />
          </View>
        </View> : <NoInternet onTryAgain={() => init()} />
      }
    </View>

  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white'
  },
  bottomImg: {
    position: 'absolute', bottom: 0
  }
})

export default Splash