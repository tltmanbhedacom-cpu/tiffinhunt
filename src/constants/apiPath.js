const path = {
  // Base URL updated to match the one provided in the example
  base: "https://tiffinhunt.co.uk/internal/api", // Keeping this as a placeholder, update to your actual production URL
  login: '/login', // Updated to match the curl request
  register : '/register', // Updated to match the curl request
  logout : '/logout', // New logout endpoint
  userProfile: '/user-profile', // New user profile endpoint
  cuisineType: '/cuisine-type', // New cuisine type endpoint
  appSetting: '/app-setting', // New app setting endpoint
  banner: '/banner', // New home banners endpoint
  kitchen: '/kitchen', // New kitchen list endpoint
  kitchenDetail: '/kitchen-detail/', // New kitchen detail endpoint (append ID)
  likeKitchen: '/like-kitchen', // New like/unlike kitchen endpoint
  makeOrder: '/make-order', // New make order endpoint
  getAddress : 'getAddress',
  deleteAddress :'deleteAddress',
  addAddress:'addAddress',
  getHome:'getHomev1',
  getCategories : 'getCategories',
  favouriteRestaurant : 'favouriteRestaurant',
  getFavouriteRestaurant : 'getFavouriteRestaurant',
  unfavouriteDish : 'unfavouriteDish',
  getRestaurant:'getRestaurantv1',
  getRestaurantDetails :'getRestaurantDetailsv1',
  addOrderMeal :'addOrderMeal',
  viewOrder :'viewOrder',
  skipMealplan :'skipMealplan',
  addRate :'addRate',
  editAddress : 'editAddress',
  checkEmailForgotPassword :'checkEmailForgotPassword',
  changePassword:'changePassword',
  editProfile :'editProfile',
  orderHelp : 'orderHelp',
  orderPayment :'orderPaymentv1',
  check_mobile_otp :'check_mobile_otp',
  verify_otp : 'verify_otp',
};

export { path };
