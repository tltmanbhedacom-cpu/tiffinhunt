import React, { useEffect, useState } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, Header, NoData } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import AddressList from '../listitem/AddressList'
import { getAddress, deleteAddress } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
// import { getAddressS, deleteAddressS, OnSelectAddress } from '../redux/actions/ActionCB'
import { useSafeArea } from 'react-native-safe-area-context';
import { setSelectedAddress } from '../utils/Session'
import { deleteAddressS, getAddressS } from "../redux/reducers/AppReducer";
import { OnSelectAddress } from "../redux/reducers/MealReducer";
var isAddressSelect = false;

function Address({ route, navigation }) {

    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(true);
    const [pageNo, setPageNo] = useState(1)
    //Access Redux Store State
    const mealReducer = useSelector((state) => state.MealReducer);
    const { selectedAddress } = mealReducer;

    const dataReducer = useSelector((state) => state.AppReducer);
    const { allAddress } = dataReducer;
    const insets = useSafeArea();

    useEffect(() => {
        console.log('Address route.params ', route.params)
        if (route.params) {
            isAddressSelect = route.params.isAddressSelect;
        }
        callApiGetAddress()
        return () => {
            isAddressSelect = false;

            // if(route.params!=null)route.params.isAddressSelect=false;
            console.log('COMPONENT  **** ******** ******** will unmount');
        }
    }, []);

    function callApiGetAddress() {
        if (allAddress.length < 0) setIsFetching(true)
        getAddress()
            .then(res => {
                dispatch(getAddressS(res))
            })
            .catch(error => alert(error))
            .finally(() => { if (isFetching) setIsFetching(false) });
    }

    function callApiDeleteAddress(id) {
        setIsFetching(true)
        deleteAddress(id)
            .then(res => {
                if (selectedAddress != null && selectedAddress.hasOwnProperty('id')) {
                    if (id == parseInt(selectedAddress.id)) {
                        dispatch(OnSelectAddress({}))
                        setSelectedAddress({})
                    }
                }
                dispatch(deleteAddressS(id))
            })
            .catch(error => alert(error))
            .finally(() => setIsFetching(false));
    }

    // 1-Delete
    function OnRowClick(type, data) {
        switch (type) {
            case 1:
                callApiDeleteAddress(data);
                break;
            case 2:
                console.log('Select  ', navigation)
                dispatch(OnSelectAddress(data))
                navigation.goBack();
                break;
            case 3:
                navigation.navigate('AddAddress', { addressEdit: data, isAddressSelect: false })
                break;
        }
    }

    function setAddress() {
        if (allAddress.length <= 0) {
            return (<NoData
                btnTxt='Add New Address'
                onButtonClick={() => navigation.navigate('AddAddress', { addressEdit: null })}
                image={images.notebook}
                textOne={"BANG BANG! WHO'S THERE?"}
                textTwo={"You didn't have any addresses saved.\nSaving addresses helps you checkout faster."} />)
        } else {
            return (<View style={{ flex: 1, marginTop: dimens.w7 }}>
                <View style={{ flex: 1, marginBottom: dimens.w2 }}>
                    <AddressList
                        isSelect={isAddressSelect}
                        listData={allAddress}
                        onClick={OnRowClick} />
                </View>
                <View style={[spacing.viewPadding, styleApp.shadows, { paddingBottom: insets.bottom }]}>
                    <Button full style={{ paddingVertical: constants.btnPaddingVertical }}
                        onPress={() => navigation.navigate('AddAddress', { addressEdit: null })}>
                        <Text transform='uppercase' boldSemi white >Add New Address</Text>
                    </Button>
                </View>
            </View>)
        }

    }
    return (
        <View style={[styleApp.container, { paddingTop: insets.top, }]}>
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                <Header titleLeft title="Manage Address" />
                <View style={[styleApp.container]}>
                    {setAddress()}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    lblAddAddress:
    {
        color: colors.black,
        marginLeft: dimens.w3,
    },
    addAddressButtonStyle:
    {
        paddingVertical: dimens.w4,
    },
})
export default Address;