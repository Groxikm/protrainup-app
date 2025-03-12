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


export async function changeUserAvatar(userData) {
    const response = await fetch(`${API_URL}/api/change-avatar`, {
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