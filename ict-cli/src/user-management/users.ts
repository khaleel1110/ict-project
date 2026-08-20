import {ad as admin} from './../index';

export async function DeleteAllUsers() {

    //get all users
    const users = await admin.auth().listUsers();

    for (let i = 0; i < users.users.length; i++) {
        const user = users.users[i];
        await admin.auth().deleteUser(user.uid);
        console.log('User deleted successfully.', user.email);
    }
    //delete all users

}