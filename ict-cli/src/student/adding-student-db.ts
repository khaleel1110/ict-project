
import {ad as admin} from "../index";
import {appointments} from "./student-record";

export  async function AddingUsersDb() {

    const userList = appointments;

    for(let i = 0; i < userList.length; i++){
        console.log(userList[i]);

        await admin.firestore().collection('bookings').add({...userList[i]});

    }
}