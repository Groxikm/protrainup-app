import {API_URL} from "../settings.js";


export async function addUser(userData) {
        console.log(`${API_URL}/api/add-user`);
        console.log(userData);

        /* userData is
        {
        "name":"TestUser155",
        "surname":"TestUser155",
        "login":"TestLogin10",
        "password":"password",
        "avatar_link": 0,
        "valid_due":"10/11/25 12:00:00"
        }
         */


        const response = await fetch(`${API_URL}/api/add-user`, {
                method: 'POST',
                headers: {
                    'accessToken': localStorage.getItem('acc_token'),
                    'Content-Type': 'application/json'
                },
                body: userData
            });
        if (!response.ok) {
            throw new Error('User not found');
        }

        return response.json();

    }


