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

    const attempts = data.attempts || [];

    if (attempts.length < limit) {
        return false // false is response to say nothing was loaded
    }

    if (attempts.length > 0) {
        this.latestDateId = attempts[attempts.length - 1].id;
        this.attempts.push(...attempts);
    }
}

/// User Manipulation functions

