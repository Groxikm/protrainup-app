import { API_URL } from "../settings.js";

export async function checkValidity(userId) {
    const response = await fetch(`${API_URL}/api/check-validity?id=${userId}`, {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        }
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    return response.json();
}

export async function findUserByNameSurname(userName, userSurname) {
    const response = await fetch(`${API_URL}/api/find-user-by-name-surname?name=${userName}&surname=${userSurname}`, {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        }
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    return response.json();
}


export async function findUserById(userId) {
    const response = await fetch(`${API_URL}/api/find-user-by-id?id=${userId}`, {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        }
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    return response.json();
}

export async function findUserRegAttempts(userId, latestDateId){
    const limit = 5;
    const response = await fetch(`${API_URL}/api/find-user-reg-attempts?id=${userId}&limit=${limit}&&latest_date_id=${latestDateId}`, {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        }
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    const data = await response.json();

    return data
}

export async function findUsers(latestId){
    const limit = 5;
    const response = await fetch(`${API_URL}/api/get-users?last_id=${latestId}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        }
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    const data = await response.json();

    return data
}

