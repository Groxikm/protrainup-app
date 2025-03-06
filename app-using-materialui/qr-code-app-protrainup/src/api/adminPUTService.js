import { API_URL } from "../settings.js";

export async function changeUserNameSurname(userData) {
    const response = await fetch(`${API_URL}/api/change-user-name`, {
        method: 'PUT',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    return response.json();
}


export async function changeUserValidDue(userData) {
    const response = await fetch(`${API_URL}/api/change-validdue`, {
        method: 'PUT',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    return response.json();
}

export async function deleteUser(userId) {
    const response = await fetch(`${API_URL}/api/delete-user-by-id?id=${userId}`, {
        method: 'PUT',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        },
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    return response.json();
}