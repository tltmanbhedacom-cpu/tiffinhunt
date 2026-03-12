// import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';


export default class GooglePlusIntegrationClass {
    static myInstance = null;

    //[ - END - ] Form data
    /**
     * @returns {GooglePlusIntegrationClass}
     */
    static getInstance() {
        if (GooglePlusIntegrationClass.myInstance == null) {
            GooglePlusIntegrationClass.myInstance = new GooglePlusIntegrationClass();
        }
        return this.myInstance;
    }

    // This Method Use Intilialize Google Plus Sdk
    initializeGooglePlusSdk() {
        //initial configuration
        GoogleSignin.configure({
            //It is mandatory to call this method before attempting to call signIn()
            scopes: ["profile", "email"],
            //Repleace with your webClientId generated from Firebase console
            iosClientId: '601343800396-foqvjv08g706eiggqonvnp52s8te6n8p.apps.googleusercontent.com',
            webClientId: '601343800396-r0l6jf7a43s81ln4ok73u4d05gb8fl97.apps.googleusercontent.com',

        });
    }

    // This Method Use Login With Google Plus
    //cb: Means callback
    loginWithGooglePlus = async (cb) => {
        //Prompts a modal to let the user sign in into your application.
        try {
            console.log('login with google plus')
            await GoogleSignin.hasPlayServices({
                //Check if device has Google Play Services installed.
                //Always resolves to true on iOS.
                showPlayServicesUpdateDialog: true,
            });
            const userInfo = await GoogleSignin.signIn();
            if (userInfo.user != null) {
                console.log('user name :' + userInfo.user.name)
                cb(userInfo.user, 1);
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                cb('User Cancelled the Login Flow', 2);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                cb('Signing In', 2);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                cb('Play Services Not Available or Outdated', 2);
            } else {
                cb(error.message, 2);
            }
        }
    };

    logout() {
        //signOut()
        //revokeAccess()
    }

}