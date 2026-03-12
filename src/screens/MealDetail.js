import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, Dimensions, StyleSheet, Image, View, Alert, ScrollView } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import { useSafeArea } from 'react-native-safe-area-context';
import BookWeek from '../listitem/BookWeek'
import MealDishWeekList from '../listitem/MealDishWeekList'
import FlexibalPlanList from '../listitem/FlexibalPlanList'
import SelectPlan from '../listitem/SelectPlan'
import { userId, setCart, isLoggedIn } from '../utils/Session'
import RBSheet from "react-native-raw-bottom-sheet";
import { EventEmitter}from '../utils/event'
import GuestLogin from "./GuestLogin";


import { apiGetMealDetail, apiFavoriteMeal } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
// import { getMealDetails } from '../redux/actions/HomeActionCB'
import AddOnList from '../listitem/AddOnList'
import { getMealDetails } from "../redux/reducers/MealReducer";


var dataFlexibal = [
    { id: 1, title: 'SKIP MEAL', icon: images.skipMeal, text: `Sudden Chnage of Schedule? Skip upcoming meal` },
    { id: 2, title: 'PAUSE PLAN', icon: images.pauseMeal, text: `Going out of town? Pause for those days` },
    { id: 3, title: 'SKIP WEEKEND', icon: images.skipWeekend, text: `Ordering to office? Set weekend off while selection` }
]
var menuObject = null;
var restaurant_id = 0;
var isApiGetMeal = true;
var selectedPlan = null;
var fullObj = null;
var isWeekEnd = false;
var isAddOnSelected = false;
var delivery_slot = []
function MealDetail({ route, navigation }) {
    const dispatch = useDispatch();
    const guestLoginRefs = useRef();
    //Access Redux Store State
    const dataReducer = useSelector((state) => state.MealReducer);
    const { mealDetail } = dataReducer;

    const bookWeekRefs = useRef();

    const insets = useSafeArea();
    const [isFetching, setIsFetching] = useState(false);
    const [weekDays, setWeekDays] = useState([1, 2, 3, 4, 5, 6, 7])
    const [flexibalPlan, setFlexibalPlan] = useState(dataFlexibal)
    const [addOnList, setAddOnList] = useState([]);
    const [selectedMealPrice, setSelectedMealPrice] = useState(0)
    const [addOnMealTotal, setAddOnMealTotal] = useState(0)
    const [dishList, setDishList] = useState([])
    const [isGuest, setGuest] = useState(false)

    const addOnRefs = useRef();
    useEffect(() => {
        isAddOnSelected = false;
        menuObject = route.params.item;
        fullObj = menuObject.fullObj
        console.log('menuObject : ,', fullObj);
        restaurant_id = menuObject.restaurant_id;
        callApiGetMealDetail();
        return () => {
            fullObj = null;
            menuObject = null;
            restaurant_id = 0;
            isApiGetMeal = true;
            selectedPlan = null;
            isWeekEnd = false;
            isAddOnSelected = false;
        }
    }, []);

    useEffect(() => {
        calculateAddOnTotal()
    },[addOnList])

    function callApiGetMealDetail() {

        var param = {}
        param["user_id"] = constants.user_id;
        param["restaurant_id"] = restaurant_id

        // var param = new FormData();
        // param.append('user_id', constants.user_id)
        // param.append('restaurant_id', restaurant_id)

        setIsFetching(true)
        apiGetMealDetail(param)
            .then(res => {
                isApiGetMeal = false;
                dispatch(getMealDetails(res))
                setAddOnList(res.restaurant_addon)
                console.log('MEALD===> ', res)
                delivery_slot =res.delivery_slot
                isWeekEnd = res.is_rest_on_weekend
                var tempDishList = res.dishes_list;
                // var tempDishList = res.dishes_list.sort(function (a, b) {
                //     var x = a.day < b.day ? -1 : 1;
                //     return x;
                // });
                if (tempDishList != null && tempDishList.length > 0) {
                    tempDishList[0].isSelected = true
                }
                setDishList(tempDishList)
            })
            .catch(error => alert(error))
            .finally(() => setIsFetching(false));
    }

   async function callFavoriteMeal(restaurant_id, favourite_id) {
    var isLogin = await isLoggedIn()
    if (isLogin <= 0) {
        constants.isGuestLogin =true;
        setGuest(!isGuest)
        return;
    }
    var bodyFormData = {}
    bodyFormData["restaurant_id"] = restaurant_id

        // var bodyFormData = new FormData();
        // bodyFormData.append('restaurant_id', restaurant_id);
        // if (favourite_id > 0) bodyFormData.append('favourite_id', favourite_id);

        if (favourite_id > 0)  bodyFormData["favourite_id"] = favourite_id;

        setIsFetching(true)
        apiFavoriteMeal(bodyFormData)
            .then(res => {
                console.log(res)
                var isFavoriteAdded = res.data != null && res.data.hasOwnProperty('id')
                mealDetail.favourite_id = isFavoriteAdded ? res.data.id : 0
            })
            .catch(error => alert(error))
            .finally(() => {
                setIsFetching(false)
            });
    }

    function SmallBlueDivider() {
        return (<View style={styleApp.blueSmallDivider} />)
    }

    function saveToCart() {
        setCart(fullObj)
        alert('Product added into cart.');
    }
    function calculateAddOnTotal() {
        var total = 0;
        for (const tempItem of addOnList) {
            var listAry = tempItem.data;
            for (const a of listAry) {
                if (a.isSelected) {
                    total += parseFloat(a.addon_price) * parseFloat(selectedPlan?.subscription_days)
                }
            }
        }
        setAddOnMealTotal((parseFloat(selectedPlan?.subscription_price * selectedPlan?.subscription_days) + total).toFixed(2))
    }
    function OnAddOnClick(index, item, type) {
        switch (type) {
            case 1: //select UnSeelct


            var finalData = addOnList.map((ele, i) => {
                // var data = addOnList.filter((obj) => obj.id == item.addon_id);
                if( ele.id == item.addon_id){
                    var filter = ele.data.map((itm) => { 
                        isAddOnSelected = true
                        return{...itm, isSelected : itm.id == item.id}})
                    return {...ele, data : filter};
                }
                return {...ele};
                
               
             })

             console.log('finalData ',JSON.stringify(finalData))
             setAddOnList(finalData)
             calculateAddOnTotal()

return
                var tempList = [...addOnList]
                var data = tempList.filter((obj) => obj.id == item.addon_id);
                if (data != null && data.length > 0) {
                    console.log('data[0] ', data[0])
                    for (let i = 0; i < data[0].data.length; i++) {
                        var is_S = data[0].data[i]
                        console.log(i + '  ' + is_S)
                        data[0].data[i]["isSelected"] = i == index
                        // data[0].data[i] = { ...data[0].data[i], isSelected: i == index }
                        isAddOnSelected = true
                    }
                    console.log('is_Sis_Sis_S ',JSON.stringify(data))
                }
                setAddOnList(tempList)
                calculateAddOnTotal()
                
                break;
        }
    }

    function addOnView() {
        if (addOnList?.length <= 0) return (<View />)
        return (<View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white"
            }}
        >
            <RBSheet
                ref={addOnRefs}
                height={dimens.h70}
                customStyles={{
                    container: {
                        borderTopRightRadius: dimens.w5,
                        borderTopLeftRadius: dimens.w5
                    }
                }}
            >
                <View style={{ flex: 1 }}>
                    {/** Header */}
                    <View style={{ backgroundColor: colors.bgGray, padding: dimens.w3, }}>
                        <TouchableOpacity onPress={() => addOnRefs.current.close()} style={{ alignItems: 'center' }}>
                            <View style={{
                                width: dimens.w15, height: dimens.w1, marginBottom: dimens.w1,
                                backgroundColor: 'rgba(129,129,129,0.2)', borderRadius: dimens.wo5
                            }} />
                        </TouchableOpacity>
                        <Text boldSemi px18 black style={{ marginTop: dimens.h1 }}>Add/Customize</Text>
                        {selectedPlan && selectedPlan.hasOwnProperty('subscription_days')?
                        <Text black50 px14 medium>{constants.currency}
                        {parseFloat(selectedMealPrice * parseFloat(selectedPlan.subscription_days)).toFixed(2)}</Text>:null
                        }
                        
                    </View>
                    <View style={[spacing.viewMarginHorizontal, { flex: 1 }]}>
                        <AddOnList
                            listData={addOnList}
                            selectedPlan={selectedPlan}
                            onClick={OnAddOnClick}
                        />
                    </View>
                    {/**Total */}
                    <View style={[{
                        flexDirection: 'row', paddingBottom: constants.marginBottonNotch,
                        alignItems: 'center', paddingHorizontal: constants.viewPaddingH
                    }, styleApp.shadows]}>
                        <Text px18 boldSemi flex1>Meal Total : {constants.currency}{addOnMealTotal}</Text>
                        <Button onPress={() => {
                                addOnRefs.current.close();
                                var   adOnPrice = parseFloat(addOnMealTotal) - parseFloat(selectedMealPrice * selectedPlan.subscription_days)
                                goToBillDetail(adOnPrice)
                        }}>
                            <Text white boldSemi px14>SAVE</Text>
                        </Button>
                    </View>
                </View>

            </RBSheet>
        </View>)
    }

    function goToBillDetail(adOnPrice) {
        setTimeout(() => {
            if (fullObj != null) fullObj.is_rest_on_weekend = isWeekEnd
            navigation.navigate('BillDetails', {
                subscription: selectedPlan,
                delivery_slot : delivery_slot,
                addOnPrice: adOnPrice, mealDetailCartObj: fullObj,
                dishList: dishList,
                isWeekEnd: isWeekEnd,
                addOnList: isAddOnSelected ? addOnList : []
            })
        }, 500);
    }
    const { homeView, scrollViewStyle, } = styles;
    return (
        <View style={[styleApp.container]}>
            {addOnView()}
            <Loader loading={isFetching} />
            {isApiGetMeal ? <View /> :
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={scrollViewStyle} contentContainerStyle={homeView}>
                    <View style={[styleApp.container]}>
                        {/** Top Image and Back icon */}
                        <View>
                            <ImageFast
                                style={styles.topImage}
                                cover
                                url={mealDetail.restaurant_image} />

                            <View style={[styles.backIconRoot, { marginTop: insets.top * 1.2 }]}>
                                <ImageIcon big path={images.back}
                                    onClick={() => navigation.goBack()} />
                                {fullObj != null ? <ImageIcon big path={images.add}
                                    onClick={() => saveToCart()} /> : null}

                            </View>
                        </View>

                        {/** Meal Details */}
                        <View style={styles.mealDetailRoot}>
                            <View style={[styles.mealDetailInnerRoot, styleApp.shadows]}>
                                {/** Title And Like */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <ImageIcon path={mealDetail.is_type == 1 ? images.vegGreen : images.nonVeg} />
                                    <Text black px18 medium flex1 style={{ marginStart: dimens.w2 }}>{mealDetail.restaurant_name}</Text>
                                    <ImageIcon
                                        onClick={() => callFavoriteMeal(mealDetail.id, mealDetail.favourite_id)}
                                        path={mealDetail.favourite_id > 0 ? images.favoritesRed : images.favourite} />
                                </View>
                                <Text numberOfLines={1} medium primary px14 style={{ marginVertical: dimens.h1 }}>{constants.bullet}
                                    {mealDetail.user_name}   {constants.bullet} {mealDetail.address}</Text>
                                <View style={{ width: '70%', height: 1, backgroundColor: colors.divider }} />
                                <View style={styles.rating}>
                                    <ImageIcon path={images.starYellow} />
                                    <Text black50 medium px14 style={{ marginTop: dimens.w1, marginStart: dimens.wo5 }}>
                                        {mealDetail.avg_rating} Ratings {constants.bullet} {mealDetail.user_count_rating}+</Text>
                                </View>
                                {mealDetail.offer > 0 ?
                                    <Text medium px14 color={colors.fontGreen} style={styleApp.offer}>
                                        OFFER {constants.bullet} {mealDetail.offer}% OFF ON ALL DISHES</Text> : null}
                            </View>

                            {/** Container */}
                            <View style={[spacing.viewPaddingHorizontal, { marginTop: dimens.w2, }]}>
                                {/** Plan Days */}
                                <Text boldSemi px20 black>A sneak-peek into the plan</Text>
                                <SmallBlueDivider />
                                <BookWeek
                                    listData={dishList}
                                    onClick={(selectedPos, item) => {
                                        console.log("selectedPos : ",selectedPos)
                                        console.log("item : ",item)


                                        var finalData = dishList.map((ele, i) => {
                                            return {...ele, isSelected: i == selectedPos};
                                         })

                                        // var tempDisy = [...dishList]
                                        // for (let index = 0; index < tempDisy.length; index++) {
                                        //     tempDisy[index]["isSelected"] = (index == selectedPos)
                                        // }
                                        console.log("tempDisy : ",finalData)
                                        setDishList(finalData)
                                        bookWeekRefs.current.scrollToIndex(selectedPos)
                                        
                                    }} />
                                <View style={{ marginVertical: dimens.h1 }}>
                                    {mealDetail.dishes_list && mealDetail.dishes_list.length > 0 ?
                                        <MealDishWeekList
                                            ref={bookWeekRefs}
                                            listData={mealDetail.dishes_list} /> : <View />}
                                </View>

                                {/** Flexible Plan */}
                                <Text boldSemi px20 black style={{ marginTop: dimens.w3 }}>Flexible plans</Text>
                                <SmallBlueDivider />
                                <View style={{ marginVertical: dimens.h1 }}>
                                    <FlexibalPlanList listData={flexibalPlan} />
                                </View>

                                {/** Choose your Plan */}
                                <Text boldSemi px20 black style={{ marginTop: dimens.w3 }}>Choose your plans</Text>
                                <SmallBlueDivider />
                                <View style={{ marginBottom: constants.marginBottonNotch }}>
                                    {mealDetail.restaurant_subscription && mealDetail.restaurant_subscription.length > 0 ?
                                        <SelectPlan listData={mealDetail.restaurant_subscription}
                                            onClick={(item) => {
                                                selectedPlan = item
                                                {
                                                    setSelectedMealPrice(selectedPlan.subscription_price)
                                                    calculateAddOnTotal()
                                                }
                                                if (addOnList?.length <= 0) {
                                                    goToBillDetail(0)
                                                } else {
                                                    addOnRefs.current.open()
                                                }
                                            }}
                                        /> : <View />}
                                </View>
                                {isGuest?<GuestLogin isShow={isGuest} navigation={navigation}
                     onFinish={()=>setGuest(false)}/> : null}
                                {/* <Button full style={styles.btnSelectPlan}
                                    onPress={() => console.log('')}>
                                    <Text boldSemi px14 white >CHOOSE YOUR PLAN</Text>
                                </Button> */}
                            </View>
                        </View>
                    </View>
                </ScrollView>}
        </View>)
}

const styles = StyleSheet.create({
    backIconRoot: {
        flexDirection: 'row', justifyContent: 'space-between',
    },
    topImage: {
        width: constants.screenWidth,
        height: constants.screenWidth * 0.55, position: 'absolute', top: 0, left: 0
    },
    mealDetailRoot: {
        width: constants.screenWidth,
        marginTop: constants.screenWidth * 0.2,
    },
    mealDetailInnerRoot: {
        backgroundColor: 'white', margin: dimens.w4,
        padding: dimens.w3, borderRadius: constants.borderRadius
    },
    rating: {
        flexDirection: 'row', alignItems: 'center', marginTop: dimens.w2
    },
    btnSelectPlan: {
        paddingVertical: dimens.w3,
        marginBottom: constants.marginBottonNotch
    },

    scrollViewStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    homeView: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    mainView: {
        flex: 1,
        position: 'relative'
    }
});
export default MealDetail;