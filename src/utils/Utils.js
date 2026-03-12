export function checkPassword(str) {
   // var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
   var re= /^(?=.*[\d])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[\w!@#$%^&*]{6,16}$/
    return re.test(str);
}