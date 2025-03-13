import { API_URL } from "../settings.js";

export async function changeUserData(userData) {
    const response = await fetch(`${API_URL}/api/change-user-data`, {
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


export async function changeUserStatusRules(userData) {
    const response = await fetch(`${API_URL}/api/change-status-rules`, {
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