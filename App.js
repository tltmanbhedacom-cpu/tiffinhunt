import React from 'react';
import {Text, View, Image, YellowBox} from 'react-native';

import HomeScreen from './src/screens/Home';
import SettingsScreen from './src/screens/Setting';
import images from './src/constants/images';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Splash from './src/screens/Splash';
import Intro from './src/screens/Intro';
import Profile from './src/screens/Profile';
import {colors, font, fontSize} from './src/constants';
import Address from './src/screens/Address';
import MealListByCat from './src/screens/MealListByCat';
import AddAddress from './src/screens/AddAddress';
import SearchMeal from './src/screens/SearchMeal';
import MealDetail from './src/screens/MealDetail';
import Cart from './src/screens/Cart';
import Favorites from './src/screens/Favorites';
import BillDetails from './src/screens/BillDetails';
import OrderSuccess from './src/screens/OrderSuccess';
import MyTiffinPlan from './src/screens/MyTiffinPlan';
import SkipPauseMeal from './src/screens/SkipPauseMeal';
import Payment from './src/screens/Payment';
import Rating from './src/screens/Rating';
import ChangePassword from './src/screens/ChangePassword';
import ForgotPassword from './src/screens/ForgotPassword';
import WebViews from './src/screens/WebViews';
import Help from './src/screens/Help';
import CardFormScreen from './src/stripe/scenes/CardFormScreen';
// import DrawerContent from './src/screens/DrawerContent'

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

function App({navigation, route}) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="TabStack" component={HomeTabNavigator} />
        {/* <Stack.Screen name="DrawerStack" component={TestDrawerStatc} /> */}


        {/* Meal Stack */}
        <Stack.Screen name="MealListByCat" component={MealListByCat} />
      <Stack.Screen name="SearchMeal" component={SearchMeal} />
      <Stack.Screen name="BillDetails" component={BillDetails} />
      <Stack.Screen name="MealDetail" component={MealDetail} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
      {/* <Stack.Screen name="Address" component={Address} /> */}
      {/* <Stack.Screen name="AddAddress" component={AddAddress} /> */}
      {/* <Stack.Screen name="MyTiffinPlan" component={MyTiffinPlan} /> */}
      <Stack.Screen name="CardFormScreen" component={CardFormScreen} />
      {/* <Stack.Screen name="Rating" component={Rating} /> */}
      {/* <Stack.Screen name="WebViews" component={WebViews} /> */}
      {/* <Stack.Screen name="Help" component={Help} /> */}
      {/* <Stack.Screen name="SkipPauseMeal" component={SkipPauseMeal} /> */}


{/* Profile Stack */}
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="MyTiffinPlan" component={MyTiffinPlan} />
      <Stack.Screen name="SkipPauseMeal" component={SkipPauseMeal} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Rating" component={Rating} />
      <Stack.Screen name="WebViews" component={WebViews} />
      <Stack.Screen name="Help" component={Help} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeTabNavigator({navigation, route}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.iconDisable,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.borderColor },
        tabBarLabelStyle: { fontFamily: font.boldSemi, fontSize: fontSize.FONT_10Px },
        tabBarHideOnKeyboard: true
      }}>
      <Tab.Screen
        name="Meals"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Meals',
          tabBarIcon: ({size, focused}) => (
            <Image
              style={{width: size, height: size}}
              source={focused ? images.exploreB : images.explore}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarLabel: 'Cart',

          tabBarIcon: ({color, size, focused}) => (
            <Image
              style={{width: size, height: size}}
              source={focused ? images.cartB : images.cart}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',

          tabBarIcon: ({color, size, focused}) => (
            <Image
              style={{width: size, height: size}}
              source={focused ? images.profileB : images.profile}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// function TestDrawerStatc() {
//   return (<Drawer.Navigator
//   drawerContent={props => <DrawerContent {...props}/>}
//     hideStatusBar ={true}
//     statusBarAnimation ='fade'
//     drawerStyle={{
//       backgroundColor: '#c6cbef',
//       width: 240,
//     }}
//     drawerContentOptions={{
//       activeTintColor: '#e91e63',
//       itemStyle: { marginVertical: 30 },
//     }}
//   >
//     <Drawer.Screen name="Tab" component={HomeTabNavigator}/>
//     {/* <Drawer.Screen name="Login" component={Login} options={{ drawerLabel: 'Home' }}/>
//     <Drawer.Screen name="Register" component={Register} /> */}
//   </Drawer.Navigator>)
// }
function AuthStack({navigation, route}) {
  return (
    <Stack.Navigator
      // mode='card'
      // headerMode="none"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="WebViews" component={WebViews} />
    </Stack.Navigator>
  );
}

function MealsStack({navigation, route}) {
  if (route.state) {
    var routeName = route.state.routes[route.state.index].name;
    navigation.setOptions({
      tabBarVisible:
        routeName == 'Home' || routeName == 'MealListByCat' ? true : false,
    });
  }
  return (
    <Stack.Navigator
      // mode='card'
      // headerMode="none"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MealListByCat" component={MealListByCat} />
      <Stack.Screen name="SearchMeal" component={SearchMeal} />
      <Stack.Screen name="BillDetails" component={BillDetails} />
      <Stack.Screen name="MealDetail" component={MealDetail} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="MyTiffinPlan" component={MyTiffinPlan} />
      <Stack.Screen name="CardFormScreen" component={CardFormScreen} />
      <Stack.Screen name="Rating" component={Rating} />
      <Stack.Screen name="WebViews" component={WebViews} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="SkipPauseMeal" component={SkipPauseMeal} />
    </Stack.Navigator>
  );
}

function CartStack({navigation, route}) {
  if (route.state) {
    var routeName = route.state.routes[route.state.index].name;
    navigation.setOptions({
      tabBarVisible: false,
    });
  }
  return (
    <Stack.Navigator
      // mode='card'
      // headerMode="none"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="CartScreen" component={Cart} />
    </Stack.Navigator>
  );
}

function ProfileStack({navigation, route}) {
  if (route.state) {
    var routeName = route.state.routes[route.state.index].name;
    navigation.setOptions({
      tabBarVisible:
        routeName == 'Address' ||
        routeName == 'AddAddress' ||
        routeName == 'Favorites' ||
        routeName == 'MyTiffinPlan' ||
        routeName == 'Payment' ||
        routeName == 'SkipPauseMeal' ||
        routeName == 'Rating' ||
        routeName == 'Help'
          ? false
          : true,
    });
  }

  return (
    <Stack.Navigator
      // mode='card'
      // headerMode="none"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreen" component={Profile} />
      {/* <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="MyTiffinPlan" component={MyTiffinPlan} />
      <Stack.Screen name="SkipPauseMeal" component={SkipPauseMeal} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Rating" component={Rating} />
      <Stack.Screen name="WebViews" component={WebViews} />
      <Stack.Screen name="Help" component={Help} /> */}
    </Stack.Navigator>
  );
}

export default App;
