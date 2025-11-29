// returns a bool if input matches regex
export function validateUsername(username: string): boolean {
const usernameRegex = /^[a-zA-Z0-9]{3,}$/

return usernameRegex.test(username);
}

export function validateEmail(email: string): boolean { //TODO: double check regex
const emailRegex = new RegExp('[a-zA-Z0-9]+([a-zA-Z0-9.-]*[a-zA-Z0-9])?@[a-zA-Z0-9]+([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}')

return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
// Password: at least 8 chars, at least one digit, at least one letter (upper and lowercase), one special character (@$!%*?&)
const passwordRegex = /^(?=[a-zA-Z0-9@$!%*?&]*\d+)(?=[a-zA-Z0-9@$!%*?&]*[a-z]+)(?=[a-zA-Z0-9@$!%*?&]*[A-Z]+)(?=[a-zA-Z0-9@$!%*?&]*[@$!%*?&]+)[a-zA-Z0-9@$!%*?&]{8,}$/

return passwordRegex.test(password);
}