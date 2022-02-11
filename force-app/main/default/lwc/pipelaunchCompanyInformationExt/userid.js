import USER_ID from "@salesforce/user/Id";
const userID = USER_ID ? USER_ID : "defaultUser"; // id is used for local storage the settings
export default userID;