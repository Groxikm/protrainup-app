import {API_URL, PAGINATION_LIMIT} from "../settings.js";

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

export async function findRules() {
    const response = await fetch(`${API_URL}/api/find-rules?`, {
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

export async function findUserRegAttempts(userId, latestDate, limit = PAGINATION_LIMIT){
    const response = await fetch(`${API_URL}/api/find-user-reg-attempts?user_id=${userId}&limit=${limit}&latest_date=${latestDate}`, {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        }
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    let data = await response.json();
    if(response.status === 204){
        data = null;
    }


    return data
}

export async function findAllRegAttempts(latestDate, limit = PAGINATION_LIMIT){
    const response = await fetch(`${API_URL}/api/find-all-reg-attempts?last_date=${latestDate}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        }
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    let data = await response.json();
    if(response.status === 204){
        data = null;
    }
    return data
}

export async function findUsers(latestDate, limit  = PAGINATION_LIMIT){
    const response = await fetch(`${API_URL}/api/get-users?last_date=${latestDate}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        }
    });

    if (!response.ok) {
        throw new Error('Bad response');
    }

    let data = await response.json();
    if(response.status === 204){
        data = null;
    }

    return data
}

