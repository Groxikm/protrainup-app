import {API_URL} from "../settings.js";


export async function addUser(userData) {
        console.log(typeof userData);
        console.log(userData);
        console.log(JSON.stringify(userData));
        const sample =
            {
                "name":"TestUser223",
                "surname":"TestUser223",
                "login":"TestLogin110",
                "password":"password",
                "avatar_link": "link",
                "valid_due":"10/11/25 12:00:00"
            }
        console.log(typeof sample);
        console.log(sample);
        console.log(JSON.stringify(sample));

        const response = await fetch(`${API_URL}/api/add-user`, {
                method: 'POST',
                headers: {
                    'accessToken': localStorage.getItem('acc_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
        if (!response.ok) {
            throw new Error('Failed to create user');
        }

        return response.json();

    }

