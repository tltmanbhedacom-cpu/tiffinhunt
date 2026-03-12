import React, { useEffect, useState, useRef } from "react";
import {
    View, PermissionsAndroid, Dimensions, TextInput, KeyboardAvoidingView,
    StyleSheet, TouchableOpacity, SafeAreaView
} from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import { addAddress, apiEditAddress } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
// import { addAddressS, getAddressS, OnSelectAddress } from '../redux/actions/ActionCB'


import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import RNGooglePlaces from 'react-native-google-places';
import Geocoder from 'react-native-geocoding';
import { getAddressS } from "../redux/reducers/AppReducer";
import { OnSelectAddress } from "../redux/reducers/MealReducer";

var isErrorHouseNo = false;
var isErrorLandmark = false;
var latlngAutoSearch;
var addressComponent;
var addressEdit = null;
var timeOutMap = null;
var isAddressSelect = false;
var address1 = "-";
var address2 = "-";
var address3 = "-";
var cityName = "-";
var state = "-";
var country = "-";
var pincode = "0";
var isEditApi = false;

function AddAddress({ route, navigation }) {

    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [house, setHouse] = useState('');
    const [landMark, setLandMark] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [localArea, setLocalArea] = useState('-');
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')

    const [isHomeType, setIsHomeType] = useState(true);
    const [mapRegion, setMapRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    })

    //Access Redux Store State
    const dataReducer = useSelector((state) => state.AppReducer);
    const { allAddress } = dataReducer;

    const mapRefs = useRef();


    useEffect(() => {
        latlngAutoSearch = null;
        addressComponent = null;
        timeOutMap = null;
        Geocoder.init(constants.googleKey);
        // Geocoder.init("AIzaSyBOWf9_O7q98PhAiCeO48GSxxOKkKZDw5w");
        if (route != null && route.params != null)
            addressEdit = route.params.addressEdit;
        isAddressSelect = route.params.isAddressSelect

        if (addressEdit != null && addressEdit.hasOwnProperty('id')) {
            isEditApi = true;
        }
        if (addressEdit != null) {
            console.log('EDIT ++ ',addressEdit)
            {
                setHouse(addressEdit.house_no);
                setLandMark(addressEdit.landmark);
                setIsHomeType(addressEdit.address_type == 1)
                setLocalArea('-')
                setCity(addressEdit.city_name)
                setPostalCode(addressEdit.pincode)
                var fullA = addressEdit.house_no + ' ' + addressEdit.address_1 + ' ' + addressEdit.address_2 + ' ' + addressEdit.address_3 + ' ' +
                    addressEdit.city_name + ' ' + addressEdit.state_name + ' ' + addressEdit.country_name + ' ' + addressEdit.pincode + ' ' +
                    addressEdit.landmark;
                //setFullAddress(fullA)
            }
            console.log('EDIT E ', addressEdit)
            if (addressEdit.address_lat && addressEdit.address_long) {
                var loc = {
                    latitude: parseFloat(addressEdit.address_lat),
                    longitude: parseFloat(addressEdit.address_long),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }
                console.log('ASDJAsdjas ', loc)
                setTimeout(() => {
                    setMapRegion(loc)
                }, 2000);
            }

        }
        console.log('addressEdit ', addressEdit);
        init();
        console.log("Add_Address : ", allAddress);

        return () => {
            console.log('COMPONENT  unmount Add Address');
            addressComponent = null
            timeOutMap = null;
            isAddressSelect = false;
        }
    }, []);



    async function init() {
        if (constants.isAndroid) {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            
            if (!granted) {
                requestLocationPermission();
            } else {
                callLocation()
            }
        } else {
            callLocation()
        }
    }

    async function requestLocationPermission() {
        if (!constants.isAndroid) {
            Geolocation.requestAuthorization()
        } else {
            let androidGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (androidGranted === PermissionsAndroid.RESULTS.GRANTED) {
                callLocation()
            } else {
                console.log('Location permission not granted!!!!');
            }
        }
    }

    function callLocation() {
        if (isEditApi) return
        if (addressComponent != null) return
        console.log('CALL LOcayion.....')
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                //getting the Latitude from the location json
                console.log('positionpositionposition ', position)
                const mCurrentLatitude = position.coords.latitude;
                const mCurrentLongitude = position.coords.longitude;
                console.log("ABC currentLatitude :" + mCurrentLatitude);
                console.log("ABC currentLongitude :" + mCurrentLongitude);
                getAddressFromLatLng(mCurrentLatitude, mCurrentLongitude)
                var region = {
                    latitude: mCurrentLatitude,
                    longitude: mCurrentLongitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                }
                setMapRegion(region)
            },
            (error) => console.log(error), {
                enableHighAccuracy: false, timeout: 10000,  
            }
        );
    }

    function getAddressFromLatLng(lat, lng) {
        var isEditApi = false;
        if (addressEdit != null && addressEdit.hasOwnProperty('id')) {
            isEditApi = true;
        }
        if (isEditApi) return;
        Geocoder.from(lat, lng)
            .then(json => {
                if (addressComponent != null) return
                var result = json.results[0]
                addressComponent = result.address_components
                console.log('addressComponent', addressComponent[0])
                if (addressComponent.length > 0) {
                    setLocalArea(addressComponent[0].short_name);
                    setFullAddress(result.formatted_address);
                }
                if (addressComponent.length > 1) {
                    if (addressComponent != null && addressComponent.length > 0) {

                        if (addressComponent.length > 0) {
                            address1 = addressComponent[0].long_name;

                        }
                        if (addressComponent.length > 1) {
                            address2 = addressComponent[1].long_name;
                        }
                        if (addressComponent.length > 2) {
                            address3 = addressComponent[2].long_name;
                        }
                        if (addressComponent.length > 3) {
                            cityName = addressComponent[3].long_name;
                        }

                        if (addressComponent.length > 1) {
                            pincode = addressComponent[addressComponent.length - 1].long_name;
                            if (isNaN(pincode)) {
                                pincode = "0"
                            } else {
                                try {
                                    state = addressComponent[addressComponent.length - 2].short_name;
                                    country = addressComponent[addressComponent.length - 3].short_name;
                                    if (state && state.length > 3) {
                                        state = "-"
                                    } else {
                                        state = addressComponent[addressComponent.length - 2].long_name;
                                    }
                                    if (country && country.length > 3) {
                                        country = "-"
                                    } else {
                                        country = addressComponent[addressComponent.length - 3].long_name;
                                    }
                                } catch (error) {
                                    state = '';
                                    country = '';
                                }

                            }
                        }
                    }
                }

            })
            .catch(error => console.warn("Geocoder err : ",error));
    }


    function validateAddAddress() {
        // if (addressComponent == null && (addressEdit == null)) {
        //     alert("Please select address.");
        //     return;
        // } else 
        if (!house && house.trim().length <= 0) {
            alert('Please enter your House/Building No.');
            return;
        } else if (!landMark && landMark.trim().length <= 0) {
            alert('Please enter street address.');
            return;
        } else if (!city && city.trim().length <= 0) {
            alert('Please enter city.');
            return;
        } else if (!postalCode && postalCode.trim().length <= 0) {
            alert('Please enter postalCode.');
            return;
        } 
        else {
            var addressArray = addressComponent;
        }
        var lat = "0";
        var lng = "0";
        if (mapRegion != null) {
            lat = mapRegion.latitude;
            lng = mapRegion.longitude;
        }
        var type = isHomeType ? 1 : 2
        // var bodyFormData = new FormData();
        var bodyFormData = {}

        var isEditApi = false;
        if (addressEdit != null && addressEdit.hasOwnProperty('id')) {
            // bodyFormData.append('address_id', addressEdit.id);
            bodyFormData["address_id"] = addressEdit.id
            isEditApi = true;
        }
        if (!isEditApi || (addressArray != null && addressArray.length > 0)) {

            bodyFormData["address_1"] = address1
            bodyFormData["address_2"] = address2
            bodyFormData["address_3"] = address3
            bodyFormData["city_name"] = city
            bodyFormData["state_name"] = state
            bodyFormData["country_name"] = country
            bodyFormData["pincode"] = postalCode
            bodyFormData["address_lat"] = lat
            bodyFormData["address_long"] = lng
            bodyFormData["address_type"] = type
            bodyFormData["house_no"] = house
            bodyFormData["landmark"] = landMark

            // bodyFormData.append('address_1', address1);
            // bodyFormData.append('address_2', address2);
            // bodyFormData.append('address_3', address3);
            // bodyFormData.append('city_name', city);
            // bodyFormData.append('state_name', state);
            // bodyFormData.append('country_name', country);
            // bodyFormData.append('pincode', postalCode);
            // bodyFormData.append('address_lat', lat);
            // bodyFormData.append('address_long', lng);
            // bodyFormData.append('address_type', type);
            // bodyFormData.append('house_no', house);
            // bodyFormData.append('landmark', landMark);
        } else {

            bodyFormData["address_1"] = addressEdit.address_1
            bodyFormData["address_2"] =  addressEdit.address_2
            bodyFormData["address_3"] = addressEdit.address_3
            bodyFormData["city_name"] = city
            bodyFormData["state_name"] = addressEdit.state_name
            bodyFormData["country_name"] = addressEdit.country_name
            bodyFormData["pincode"] = addressEdit.pincode
            bodyFormData["address_lat"] = lat
            bodyFormData["address_long"] = lng
            bodyFormData["address_type"] = type
            bodyFormData["house_no"] = house
            bodyFormData["landmark"] = landMark


            // bodyFormData.append('address_1', addressEdit.address_1);
            // bodyFormData.append('address_2', addressEdit.address_2);
            // bodyFormData.append('address_3', addressEdit.address_3);
            // bodyFormData.append('city_name', city);
            // bodyFormData.append('state_name', addressEdit.state_name);
            // bodyFormData.append('country_name', addressEdit.country_name);
            // bodyFormData.append('pincode', addressEdit.pincode);
            // bodyFormData.append('address_lat', lat);
            // bodyFormData.append('address_long', lng);
            // bodyFormData.append('address_type', type);
            // bodyFormData.append('house_no', house);
            // bodyFormData.append('landmark', landMark);
        }
        console.log('bodyFormData ', bodyFormData);

        setIsFetching(true)
        if (!isEditApi) {
            addAddress(bodyFormData)
                .then(res => {
                    dispatch(OnSelectAddress(res))
                    navigation.goBack();
                    var mergeAddress = [...allAddress, res]
                    dispatch(getAddressS(mergeAddress))
                })
                .catch(error => alert(error))
                .finally(() => { setIsFetching(false) });
        } else {
            apiEditAddress(bodyFormData)
                .then(res => {
                    console.log('E d res ', res)
                    navigation.goBack();
                    var index = allAddress.findIndex(obj => obj.id === addressEdit.id);
                    allAddress.splice(index, 1);
                    var mergeAddress = [...allAddress, res]
                    dispatch(getAddressS(mergeAddress))
                })
                .catch(error => alert(error))
                .finally(() => { setIsFetching(false) });
        }

    }

    function openSearchModal() {
        // RNGooglePlaces.openAutocompleteModal()
        //     .then((place) => {
        //         console.log(place);
        //         if (place != null) {
        //             setFullAddress(place.address);
        //             latlngAutoSearch = place.location;
        //             console.log('Searcg model ,latlngAutoSearch ', latlngAutoSearch);
        //             if (latlngAutoSearch != null) {
        //                 {
        //                     var region = {
        //                         latitude: latlngAutoSearch.latitude,
        //                         longitude: latlngAutoSearch.longitude,
        //                         latitudeDelta: 0.001,
        //                         longitudeDelta: 0.001
        //                     }
        //                     setTimeout(() => {
        //                         setMapRegion(region)
        //                     }, 3000);
        //                     // var lat = latlngAutoSearch.latitude;
        //                     // var lng = latlngAutoSearch.longitude;
        //                     // mapRefs.current.animateCamera({ center: { lat, lng }})
        //                 }
        //             }
        //             addressComponent = place.addressComponents;
        //             if (addressComponent.length > 1) {
        //                 setLocalArea(addressComponent[1].name);
        //                 if (addressComponent != null && addressComponent.length > 0) {

        //                     if (addressComponent.length > 0) {
        //                         address1 = addressComponent[0].name;

        //                     }
        //                     if (addressComponent.length > 1) {
        //                         address2 = addressComponent[1].name;
        //                     }
        //                     if (addressComponent.length > 2) {
        //                         address3 = addressComponent[2].name;
        //                     }
        //                     if (addressComponent.length > 3) {
        //                         cityName = addressComponent[3].name;
        //                     }

        //                     if (addressComponent.length > 1) {
        //                         pincode = addressComponent[addressComponent.length - 1].name;
        //                         if (isNaN(pincode)) {
        //                             pincode = "0"
        //                         } else {
        //                             try {
        //                                 state = addressComponent[addressComponent.length - 2].shortName;
        //                                 country = addressComponent[addressComponent.length - 3].shortName;
        //                                 if (state && state.length > 3) {
        //                                     state = "-"
        //                                 } else {
        //                                     state = addressComponent[addressComponent.length - 2].name;
        //                                 }
        //                                 if (country && country.length > 3) {
        //                                     country = "-"
        //                                 } else {
        //                                     country = addressComponent[addressComponent.length - 3].name;
        //                                 }
        //                             } catch (error) {
        //                                 state = '';
        //                                 country = '';
        //                             }

        //                         }
        //                     }
        //                 }
        //             }

        //             console.log('addressComponent** ', address1);
        //         }
        //         // place represents user's selection from the
        //         // suggestions and it is a simplified Google Place object.
        //     })
        //     .catch(error => console.log(error.message));  // error is a Javascript Error object
    }

    function handleMapMoving(value) {
        if (timeOutMap != null) clearTimeout(timeOutMap)
        timeOutMap = setTimeout(() => {
            if (value.longitude != 0) {
                var region = {
                    latitude: value.latitude,
                    longitude: value.longitude,
                    latitudeDelta: value.latitudeDelta,
                    longitudeDelta: value.longitudeDelta
                }
                setMapRegion(region)
            }
        }, 1500);
    };


    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <View style={styleApp.container}>
                    <Loader loading={isFetching} />
                    <View style={[styleApp.container, { justifyContent: 'flex-end' }]}>
                        <MapView
                            ref={mapRefs}
                            style={styles.mapStyle}
                            showsUserLocation={true}
                            loadingEnabled={true}
                            showsCompass={false}
                            zoomEnabled={true}
                            maxZoomLevel={18}
                            loadingIndicatorColor={colors.primary}
                            mapType='standard' //Setting Map Type (standard,hybird,satelight)
                            zoomControlEnabled={true}
                            onRegionChangeComplete={value => {
                                handleMapMoving(value);
                            }}
                            region={mapRegion}
                        />
                        <View style={[{
                            position: 'absolute', top: 0, marginTop: constants.screenWidth / 3.2,
                            backgroundColor: 'transparent', alignSelf: 'center'
                        }]}>
                            <ImageIcon path={images.marker} />
                        </View>
                        <View style={{ position: 'absolute', top: 0, width: '100%' }}>
                            <ImageIcon big path={images.back}
                                onClick={() => navigation.goBack()} />
                        </View>

                        <View style={styles.detailRoot}>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                                <ImageIcon big path={images.currentLoc}
                                    onClick={() => callLocation()} />
                            </View>
                            {/** Add address details and change */}
                            <View style={[styles.viewParentAddressStyle, spacing.viewPadding]}>
                                {/** Change Address */}
                                <View style={{ flexDirection: 'row' }}>
                                    <ImageIcon path={images.locationPrime} />
                                    <Text black boldSemi px20 flex1>{localArea}</Text>
                                    <TouchableOpacity onPress={() => openSearchModal()}>
                                        <Text primary boldSemi px16>CHANGE</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text black50 medium px14 style={styles.lblSelectAddressStyle}>{fullAddress}</Text>
                                <View style={styles.viewUnderLineStyle}></View>

                                {/* {searchPlace()} */}
                                <View style={styles.viewInputHouseNoStyle}>
                                    <TextInputView
                                        attrName='house'
                                        headerTitle='Unit / House No.'
                                        placeholder=''
                                        autoCapitalize="none"
                                        actionNext
                                        maxLength={60}
                                        errorText='Please enter house no.'
                                        isError={isErrorHouseNo}
                                        titleTextColor={colors.fontAb9a9d}
                                        isBorder={true}
                                        value={house}
                                        updateMasterState={(attr, value) => {
                                            setHouse(value)
                                        }}
                                    />
                                </View>
                                <View style={styles.viewInputHouseNoStyle}>
                                    <TextInputView
                                        style={[styleApp.textInputPadding]}
                                        attrName='Street Address'
                                        headerTitle='Street Address'
                                        placeholder=''
                                        actionNext
                                        value={landMark}
                                        maxLength={60}
                                        errorText='Please enter landmark.'
                                        isError={isErrorLandmark}
                                        titleTextColor={colors.fontAb9a9d}
                                        isBorder={true}
                                        updateMasterState={(attr, value) => {
                                            setLandMark(value)
                                        }} />
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.viewInputHouseNoStyle, { flex: 1 }]}>
                                        <TextInputView
                                            style={[styleApp.textInputPadding]}
                                            attrName='City'
                                            headerTitle='City'
                                            placeholder=''
                                            actionNext
                                            value={city}
                                            maxLength={20}
                                            errorText='Please enter city.'
                                            isError={false}
                                            titleTextColor={colors.fontAb9a9d}
                                            isBorder={true}
                                            updateMasterState={(attr, value) => {
                                                setCity(value)
                                            }} />
                                    </View>
                                    <View style={[styles.viewInputHouseNoStyle, , { flex: 1, marginStart: dimens.w2 }]}>
                                        <TextInputView
                                            style={[styleApp.textInputPadding]}
                                            attrName='Postal Code'
                                            headerTitle='Postal Code'
                                            placeholder=''
                                            actionNext
                                            value={postalCode}
                                            maxLength={8}
                                            errorText='Please enter postal Code.'
                                            isError={false}
                                            titleTextColor={colors.fontAb9a9d}
                                            isBorder={true}
                                            updateMasterState={(attr, value) => {
                                                setPostalCode(value)
                                            }} />
                                    </View>
                                </View>

                                {/** Address Type */}
                                <View style={styles.viewDeliveryAddressStyle}>
                                    <TouchableOpacity onPress={() => setIsHomeType(true)}>
                                        <View style={styles.addressTypeRoot}>
                                            <ImageIcon path={isHomeType ? images.radio : images.radioblank} />
                                            <Text black boldSemi px14 style={{ marginLeft: dimens.w2, marginEnd: dimens.w8 }}>Home</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setIsHomeType(false)}>
                                        <View style={styles.addressTypeRoot}>
                                            <ImageIcon path={!isHomeType ? images.radio : images.radioblank} />
                                            <Text black boldSemi px14 style={{ marginLeft: dimens.w2 }}>Work</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.viewSaveProceedStyle}>
                                    <Button
                                        onPress={() => validateAddAddress()}
                                        style={[styleApp.buttonPadding]}
                                        full>
                                        <Text white boldSemi px14 transform='uppercase'>Save & Proceed</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    addressTypeRoot: {
        flexDirection: "row", alignItems: 'center'
    },
    container:
    {
        flex: 1,
        justifyContent: 'flex-end',
    },
    mapStyle: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        marginBottom: dimens.h30
    },
    detailRoot: {
        width: '100%',
        position: 'absolute',
    },
    viewParentAddressStyle:
    {
        width: '100%',
        backgroundColor: 'white',
        borderTopRightRadius: dimens.w6,
        borderTopLeftRadius: dimens.w6,
    },
    textInputHouseNoStyle:
    {
        borderColor: '#111111',
        borderWidth: 0.5,
        borderRadius: 3,
        marginHorizontal: 10,
        paddingVertical: 7,
        paddingLeft: 5,
        marginTop: 5,
    },
    lblSelectAddressStyle:
    {
         
    },
    viewUnderLineStyle:
    {
        marginTop: dimens.w1,
        marginBottom: dimens.w1,
        height: 0.5,
        backgroundColor: colors.divider
    },
    lblHouseAndStreetStyle:
    {
        marginHorizontal: dimens.w4,
        marginTop: dimens.w4,
    },
    viewInputHouseNoStyle:
    {
        marginTop: dimens.w2o5,
    },
    viewDeliveryAddressStyle:
    {
        alignItems: 'center',
        marginTop: dimens.w3,
        flexDirection: 'row',
        marginBottom: dimens.w2,
    },
    lblAddressStyle:
    {
        flex: 1,
        marginLeft: dimens.w3,
    },
    lblWorkStyle:
    {
        marginLeft: dimens.w3,
    },
    imgLogoPermissionStyle:
    {
        paddingVertical: 5,
        width: dimens.w5,
        height: dimens.w5,
    },
    imgSelect:
    {
        paddingVertical: 5,
        width: dimens.w5,
        height: dimens.w5,
        marginLeft: dimens.w4,
    },
    imgWorkStyle:
    {
        marginLeft: dimens.w10,
        width: dimens.w5,
        height: dimens.w5
    },
    viewSaveProceedStyle:
    {
        marginBottom: dimens.w2,
    }

});

export default AddAddress;