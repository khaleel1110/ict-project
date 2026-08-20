import * as admin from 'firebase-admin';

// Interface for user data including Firestore fields
interface UserData {
    email: string;
    password: string;
    displayName: string;
    localGovernment: string;
    location: string;
    phone: string;
    phoneType: string;
    /**
     * 'admin' users get the Firebase custom claim { admin: true }, which is
     * what the Angular admin guard / login flow check before letting
     * someone into /admin/*. 'user' accounts can still sign in elsewhere
     * in the app, just not into the ICT admin dashboard.
     */
    role: 'admin' | 'user';
}

export async function CreateUsers() {
    const users: UserData[] = [
        {
            displayName: 'Rukayya Haruna',
            email: 'rukayyajhn006@gmail.com',
            password: '12345678',
            localGovernment: 'Bichi',
            location: 'Kano',
            phone: '++234 903 366 4969',
            phoneType: 'Mobile',
            role: 'admin',
        },

        {
            displayName: 'Administrador',
            email: 'admin001@gmail.com',
            password: 'Baba1234#',
            localGovernment: 'Kano',
            location: 'Kano',
            phone: '+2347031140046',
            phoneType: 'Mobile',
            role: 'admin',
        },
        {
            displayName: 'Ibrahim Kabir',
            email: 'khaleel@gmail.com',
            password: '12345678',
            localGovernment: 'Kumbotso',
            location: 'Kano',
            phone: '+2347031140046',
            phoneType: 'Mobile',
            role: 'admin',
        },
     /*   {
            displayName: 'Sadiq Beli',
            email: 'ccs03127@gmail.com',
            password: 'Ideas4321#',
            localGovernment: 'Naibawa',
            location: 'Kano',
            phone: '+2347031140046',
            phoneType: 'Mobile',
            role: 'user',
        }*/
    ];

    for (const user of users) {
        const photoURL = `https://ui-avatars.com/api/?format=svg&rounded=true&background=random&name=${encodeURIComponent(user.displayName)}`;
        try {
            await createUser(user, photoURL);
        } catch (error) {
            console.error(`Failed to create user ${user.email}:`, error);
        }
    }
}

const createUser = async (userData: UserData, photoURL: string) => {
    try {
        // Create user in Firebase Authentication
        const user = await admin.auth().createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.displayName,
            photoURL,
        });

        // Set the custom claim the Angular app's admin guard checks for.
        // Claims live on the ID token, not in Firestore, which is why this
        // is a separate call from the Firestore write below.
        await admin.auth().setCustomUserClaims(user.uid, {
            admin: userData.role === 'admin',
        });

        // Store additional user data in Firestore
        await admin.firestore().collection('users').doc(user.uid).set({
            displayName: userData.displayName,
            email: userData.email,
            role: userData.role,
            localGovernment: userData.localGovernment,
            location: userData.location,
            phone: userData.phone,
            phoneType: userData.phoneType,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`User created and data stored successfully: ${user.email} (UID: ${user.uid}, role: ${userData.role})`);
        return user;
    } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error);
        throw error;
    }
};

/**
 * Custom claims only take effect on a user's NEXT sign-in, or after a
 * forced token refresh (getIdToken(true)). If you re-run this against a
 * user who's already signed in somewhere, they won't see the updated
 * `admin` claim until they sign out and back in.
 */
