

export function formatDate(inputDate) {
    // Create a Date object from the input string
    const dateObject = new Date(inputDate);

    // Check if the date is valid
    if (isNaN(dateObject)) {
        console.error("Invalid date format:", inputDate);
        return null; // Return null or handle error as needed
    }

    // Extract date components
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(dateObject.getDate()).padStart(2, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getSeconds()).padStart(2, '0');

    // Format the date as desired
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}