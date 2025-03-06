import {API_URL} from "../settings.js";


export async function addUser(userData) {

        const response = await fetch(`${API_URL}/api/add-user`, {
                method: 'POST',
                headers: {
                    'accessToken': localStorage.getItem('acc_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
        if (!response.ok) {
             console.log(response);
            //throw new Error('Failed to create user');
        }

        return response.json();

    }

