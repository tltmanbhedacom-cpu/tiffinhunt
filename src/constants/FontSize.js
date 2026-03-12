import { widthPercentageToDP as wp } from './ResponsiveScreen';
import { constants } from "./constants";

const fontSize = {
  FONT_40Px: !constants.isAndroid ? wp('11%') : wp('8.2%'),
  FONT_22Px: !constants.isAndroid ? wp('4.8%') : wp('4.4%'),
  FONT_20Px: !constants.isAndroid ? wp('4.3%') : wp('4.1%'),
  FONT_18Px: !constants.isAndroid ? wp('4.0%') : wp('3.7%'),
  FONT_16Px: !constants.isAndroid ? wp('3.8%') : wp('3.5%'),
  FONT_14Px: !constants.isAndroid ? wp('3.6%') : wp('3.3%'),
  FONT_12Px: !constants.isAndroid ? wp('3.2%') : wp('2.9%'),
  FONT_10Px: !constants.isAndroid ? wp('2.7%') : wp('2.5%'),

};
export default fontSize;
