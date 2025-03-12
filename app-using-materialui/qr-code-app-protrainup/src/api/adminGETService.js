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

export async function findUserRegAttempts(userId, latestDate){
    const limit = 4;
    const response = await fetch(`${API_URL}/api/find-user-reg-attempts?user_id=${userId}&limit=${limit}&latest_date=${latestDate}`, {
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

export async function findAllRegAttempts(latestDate){
    const limit = 10;
    const response = await fetch(`${API_URL}/api/find-all-reg-attempts?last_date=${latestDate}&limit=${limit}`, {
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

export async function findUsers(latestDate){
    const limit = 10;
    const response = await fetch(`${API_URL}/api/get-users?last_date=${latestDate}&limit=${limit}`, {
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

