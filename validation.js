export function validateForm(data) {
    console.log("Server side validation occurs here.");

    // errors are stored in an array
    const errors = [];

    // name/email validation
    if (data.fname.trim() == "") { errors.push("First name is required."); }
    if (data.lname.trim() == "") { errors.push("Last name is required."); }
    if (data.email.trim() == "") { errors.push("Email is required."); }

    // spoof prevention
    const validMethods = ['pickup', 'delivery'];
    if (!validMethods.includes(data.method)) { errors.push("Method must be pickup or delivery."); }

    // size validation
    const validSizes = ['small', 'medium', 'large'];
    if(!validSizes.includes(data.size)) { errors.push("Size invalid. Shameful spoofing attempt."); }

    // print all stored errors
    console.log(errors);
    return {
        isValid: errors.length === 0,
        errors
    };
}