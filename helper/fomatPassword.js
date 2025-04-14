import messages from "../config/message.js";

export const checkFormatPassword = (password, confirmPassword) => {
    if (!password || !confirmPassword) {
        return { status: 400, data: messages.auth.ERR_ENTER_PASSWORD };
    }
    if (password !== confirmPassword) {
        return { status: 400, data: messages.auth.ERR_MATCH_PASSWORD };
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
        return { status: 400, data: messages.auth.ERR_PASSWORD_FORMAT };
    }
    return true;
};
export default checkFormatPassword;