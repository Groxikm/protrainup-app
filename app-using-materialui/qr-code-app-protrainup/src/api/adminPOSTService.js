import {API_URL} from "../settings.js";


export async function addUser(userData) {

        const sample =
        {
        "name":"TestUser155",
        "surname":"TestUser155",
        "login":"TestLogin10",
        "password":"password",
        "avatar_link": 0,
        "valid_due":"10/11/25 12:00:00"
        }
        console.log(("sample"));
        console.log(typeof JSON.stringify(sample));
        console.log(JSON.stringify(sample));
        console.log(("userData"));
        console.log(typeof userData);
        console.log(userData);

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

    /* //why doesn't the lower work???

    {"name":"TestUser155","surname":"TestUser155","login":"TestLogin10","password":"password","avatar_link":0,"valid_due":"10/11/25 12:00:00"}

    {"name":"sdfsdfdf","surname":"dsfs","login":"dfsfds","password":"dsfsf","avatar_link":"dfsfd","valid_due":"03/29/25 12:00:00"}
     */

