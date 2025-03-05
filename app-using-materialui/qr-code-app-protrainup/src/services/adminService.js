import { API_URL } from "../settings.js";
import { formatDate } from "../utils/formatDate.js";

export async function checkValidity(userId) {
    const response = await fetch(`${API_URL}/api/check-validity?id=${userId}`, {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        }
    });

    if (!response.ok) {
        throw new Error('User not found');
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
        throw new Error('User not found');
    }

    return response.json();
}

// Function to find a user by ID
export async function findUserById(userId) {
    const response = await fetch(`${API_URL}/api/find-user-by-id?id=${userId}`, {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('acc_token'),
        }
    });

    if (!response.ok) {
        throw new Error('User not found');
    }

    return response.json();
}