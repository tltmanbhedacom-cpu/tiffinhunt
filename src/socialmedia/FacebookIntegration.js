const FBSDK = require('react-native-fbsdk-next');
const {
    LoginManager,
    GraphRequest,
    GraphRequestManager,
    AccessToken
} = FBSDK;

export default class FacebookIntegrationClass {

    static myInstance = null;
    /**
    * @returns {FacebookIntegrationClass}
    */
    static getInstance() {
        if (FacebookIntegrationClass.myInstance == null) {
            FacebookIntegrationClass.myInstance = new FacebookIntegrationClass();
        }
        return this.myInstance;
    }

    //This method use login with facebook
    loginWithFacebook(callback) {
        LoginManager.logInWithPermissions(['public_profile'])
            .then((result) => {
                if (result.isCancelled) {
                    alert('Facebook login fail :');
                }
                else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            console.log(data)
                            const infoRequest = new GraphRequest(
                                '/me?fields=name,picture',
                                null,
                                _responseInfoCallback = (error, result) => {
                                    if (error) {
                                        callback("",0);
                                        console.log('Error fetching data: ' + error.toString());
                                    } else {
                                        callback(result,1);
                                    }
                                });
                            // Start the graph request.
                            new GraphRequestManager().addRequest(infoRequest).start();
                        }
                    )
                }
            })
    }
    //Create response callback.
    // responseInfoCallback = (cb, error, result) => {
    //     console.log(result)
    //     if (error) {
    //         cb(error, 2);
    //     } else {
    //         if (result != null) {
    //             cb(result.name, 1);
    //         }
    //     }
    // }

}