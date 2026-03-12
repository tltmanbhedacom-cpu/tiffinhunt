import React, { useEffect, useState } from "react";
import { Linking, TextInput, View, StyleSheet, SafeAreaView,
   TouchableOpacity, ScrollView } from 'react-native';
import HomeFood from '../listitem/HomeFood'
import HomeFoodItalian from '../listitem/HomeFoodItalian'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import { Text, ImageIcon, ImageFast, Loader } from '../component'
import HomeFoodPopular from '../listitem/HomeFoodPopular'
import PermissionDialogModel from '../dialog/PermissionDialogModel';
import HomeMealList from '../listitem/HomeMealList';
import { isLoggedIn, token, userId, getSelectedAddress, isGuest } from '../utils/Session'

import { apiGetHomeMeal } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
// import { getHomeMeal,setSelectedLatLng, setGuestLogin } from '../redux/actions/HomeActionCB'
import { setClientToken } from '../utils/API'
import BannerList from '../listitem/BannerList'
// import { getHomeMeal } from "../redux/reducers/MealReducer";
import { setGuestLogin } from "../redux/reducers/AppReducer";
import { getHomeMeal } from "../redux/reducers/MealReducer";
// import RNGooglePlaces from 'react-native-google-places';
// import stripe from 'tipsi-stripe'

var footerImageWidth = constants.screenWidth;
var loc_lat = 0;
var loc_lng = 0;

function Home({ route, navigation }) {

  const [isFetching, setIsFetching] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [isFirstTab, setIsFirstTab] = useState(true);
  const [bannerData, setBannerData] = useState([])

  const dispatch = useDispatch();
  //Access Redux Store State
  const dataReducer = useSelector((state) => state.MealReducer);

  // const homeMeals = useSelector((state) => state.MealReducer.homeMeals)
  const { homeMeals } = dataReducer;

  useEffect(() => {
    // stripe.setOptions({
    //   publishableKey: 'pk_live_kuQpbFs96oAKrxhj4zdjrxYe00imk9gE0f',
    // })

    setToken();
    callApiGetHomeMeal();
    dispatch(setGuestLogin(true))
    setTimeout(() => {
      dispatch(setGuestLogin(true))
    }, 3000);

    return () => {
      console.log('COMPONENT  unmount');
    }
  }, []);

  async function setToken() {
    var isGuestUser = await isGuest()
    if(isGuestUser !=2){
      const tokenBarrier = await token();
      constants.user_id = await userId();
      setClientToken(tokenBarrier);
    }else{
      constants.user_id =0
    }
    
  }


  function callApiGetHomeMeal() {
    // var param = new FormData();
    // param.append('is_type', isFirstTab ? 2 : 1);
    // param.append('home_lat', loc_lat);
    // param.append('home_lng', loc_lng);

    var param = {
      'is_type': isFirstTab ? 2 : 1,
      'home_lat': loc_lat,
      'home_lng': loc_lng
    }
    setIsFetching(true)
    apiGetHomeMeal(param)
      .then(res => {
        console.log("home meal res : ",JSON.stringify(res))
        if (res.hasOwnProperty('banner_data') && res.banner_data.length > 0) {
          console.log("res.banner_data : ",res.banner_data)
          setBannerData(res.banner_data)
        }
        dispatch(getHomeMeal(res.data))
      })
      .catch(error => alert(error))
      .finally(() => setIsFetching(false));
  }

  // Type 1 = View All
  // 2 =View Meal detail
  function OnMealClick(type, index, item) {
    switch (type) {
      case 1:
        //View All
        console.log("case 1 : ",item)
        var itemObj = {
          category_id: item.id,
          category_name: item.title,
          subcategory_id: 0,
        }
        navigation.navigate('MealListByCat', { item: itemObj });
        break;
      case 2:
        var categoryName = '';
        for (const mealItem of homeMeals) {
          if (mealItem.id == item.category_id) {
            categoryName = mealItem.title;
          }
        }
        var itemObj = {
          category_id: item.category_id,
          category_name: categoryName,
          subcategory_id: item.id,
        }
        navigation.navigate('MealListByCat', { item: itemObj });
        //View Meal Detail
        // console.log(item)
        // var itemObj ={
        //   restaurant_id : item.id,
        // }
        // navigation.navigate('MealDetail', {item : itemObj});
        break;
    }
  }

  function openSearchModal() {
    // RNGooglePlaces.openAutocompleteModal()
    //   .then((place) => {
    //     console.log(place);
    //     if (place != null && place.hasOwnProperty('location')) {
    //       loc_lat = place.location.latitude;
    //       loc_lng = place.location.longitude
    //       var a ={
    //         lat : loc_lat,
    //         lng : loc_lng,
    //       }
    //       dispatch(setSelectedLatLng(a))
    //     }
    //   })
    //   .catch(error => console.log(error))
  }

  const renderHeader = () => {
    return (
      <View style={{ marginTop: dimens.h2 }}>
        <BannerList 
          onClick={ item =>{
            if(item.name!='#'){
              Linking.openURL(item.name)
            }
          }}
          listData={bannerData} />
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={{
        marginVertical: dimens.w3,
        width: footerImageWidth, height: footerImageWidth * 0.7
      }}>
        <ImageFast contain
          style={{ width: footerImageWidth, height: footerImageWidth * 0.7 }}
          source={images.huntFood} />
      </View>
    );
  };

  function setMealList() {
    if (!homeMeals && homeMeals?.length <= 0) {
      return (
        <ScrollView>
          {renderHeader()}
          {renderFooter()}
        </ScrollView>
      );
    } else {
      return (
        <HomeMealList
          listData={homeMeals}
          onClick={OnMealClick}
          ListHeaderComponent={renderHeader()}
          ListFooterComponent={renderFooter()}
        />
      )
    }
  }
  return (
    <SafeAreaView
      style={styleApp.safeAreaRoot}>
      <View style={[styleApp.container]}>
        <PermissionDialogModel visible={showAlert} />
        <Loader loading={isFetching} />
        {/** Search */}
        {/* <View style={[styles.searchRoot, spacing.viewPadding]}>

          <ImageIcon
            touchableStyle={styles.icLocation}
            onClick={() => openSearchModal()}
            path={images.location} />

          <TouchableOpacity style={{ flex: 1 }}
            onPress={() => navigation.navigate('SearchMeal')}>
            <View style={styles.viewSearchMenuStyle}>
              <Text black regular px16 flex1 style={styles.textInputSearchMenuStyle}>Search for meals</Text>
              <ImageIcon
                touchableStyle={{ paddingHorizontal: dimens.w3 }}
                path={images.search} />
            </View>
          </TouchableOpacity>
        </View> */}

      {/* <GuestLogin/> */}
        <View style={[{ flex: 1, }, spacing.viewMarginHorizontal]}>
          {setMealList()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  icLocation: {
    backgroundColor: colors.bgGray, padding: dimens.w3, borderRadius: constants.borderRadius,
  },
  options: {
    backgroundColor: '#eeeeef', borderRadius: dimens.w3, flexDirection: 'row',
    padding: dimens.w1
  },
  searchRoot: {
    flexDirection: 'row', alignItems: 'center',
  },

  viewSearchMenuStyle:
  {
    backgroundColor: colors.bgGray,
    borderRadius: constants.borderRadius,
    marginLeft: dimens.w3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: dimens.wo5
  },
  textInputSearchMenuStyle:
  {
    color: colors.black,
    paddingHorizontal: dimens.w3,
    paddingVertical: dimens.w2
  },
  tabStyle: {
    flex: 1,
    borderRadius: dimens.w3,
    padding: dimens.w1o3,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default Home
