
const messages = {
    auth: {
        LOGIN_SUCCESS: 'LOGIN SUCCESSFUL',
        ERR_INVALID_CREDENTIALS: 'INVALID CREDENTIALS',
        ERR_WRONG_ACCOUNT_OR_PASSWORD: 'WRONG ACCOUNT OR PASSWORD',
        ERR_TOKEN_MISSING: 'ACCESS TOKEN IS REQUIRED',
        ERR_TOKEN_INVALID: 'INVALID OR EXPIRED ACCESS TOKEN',
        ERR_NO_PERMISSION: 'YOU DO NOT HAVE PERMISSION TO ACCESS THIS RESOURCE',
        ERR_WRONG_OTP: 'OTP INCORRECT',
        ERR_OTP_EXPIRED: 'OTP CODE HAS EXPIRED',
        ERR_ENTER_PASSWORD: 'PLEASE ENTER FULL PASSWORD AND CONFIRMPASSWORD',
        ERR_MATCH_PASSWORD: 'CONFIRMATION PASSWORD DOES NOT MATCH',
        ERR_LEAST_PASSWORD: 'PASSWORD MUST BE AT LEAST 6 CHARACTERS',
        UPDATE_PASSWORD_SUCCESS: 'PASSWORD HAS BEEN UPDATED, PLEASE LOGIN AGAIN',
        ERR_EXISTS_EMAIL: 'EMAIL NOT EXISTS',
        ERR_PASSWORD_FORMAT: 'PASSWORD MUST BE AT LEAST 6 CHARACTERS INCLUDING UPPERCASE, LOWERCASE AND SPECIAL CHARACTERS!',
        ERR_INCORRECT_PASSWORD: 'INCORRECT PASSWORD',
        CHANGE_PASSWORD_SUCCESS: 'PASSWORD HAS BEEN CHANGED',
    },
    user: {
        USER_CREATED_SUCCESSFULLY: 'USER CREATED SUCCESSFULLY',
        USER_UPDATED_SUCCESSFULLY: 'USER UPDATED SUCCESSFULLY',
        USER_DELETED: 'USER DELETED',
        ERR_USER_NOT_EXISTS: 'USER NOT EXISTS',
        GET_INFO: 'GET INFORMATION USER SUCCESSFUL',
        BLANK_NAME: 'NAME CANNOT BE BLANK',
        BLANK_AREA: 'AREA CANNOT BE BLANK',
    },
    recruitmentNews: {
        status: {
            PENDING: 'PENDING',
            APPROVED: 'APPROVED',
            REJECTED: 'REJECTED',
        },
        typeof: {
            RECRUITMENT_NEWS: 'RECRUITMENT NEWS',
        },
        POST_SUCCESS: 'WAITTING FOR ADMIN APPROVAL',
        UPDATE_SUCCESS: 'UPDATED',
        APPLY_SUCCESS: 'APPLY SUCCESSFULLY',
    },
    file: {
        ERR_ONLY_ACCEPT_PDF: 'ONLY ACCEPT FILE PDF',
        ERR_ONLY_ACCEPT_IMAGE: 'ONLY ACCEPT FILE IMAGE',
        ERR_FILE_NOT_EXISTS: 'FILE NOT EXISTS',
        FILE_UPLOAD_ACCESS: 'UPLOAD ACCESS',
        UPLOAD_FAILED: 'UPLOAD FAILED',
    },
    error: {
        ERR_INTERNAL: 'SOMETHING WENT WRONG. PLEASE TRY AGAIN LATER.',
        ERR_DELETE_ADMIN: 'CANNOT DELETE ADMINISTRATOR',
    },
    mail: {
        SEND_OTP_SUCCESS: 'OTP SENT SUCCESSFULLY',
    },
    application: {
        ERR_DEADLINE_APPLICATION: 'APPLICATION DEADLINE PASSED',
        TITLE_NOFI: 'JOB APPLICATION FEEDBACK',
        APPROVED_FEEDBACK: 'CONGRATULATIONS! YOUR APPLICATION HAS BEEN APPROVED. PLEASE WAIT FOR AN EMAIL FROM THE EMPLOYER!',
        REJECTED_FEEDBACK: 'WE REGRET TO INFORM YOU THAT YOUR APPLICATION HAS BEEN REJECTED. THANK YOU FOR YOUR INTEREST IN OUR COMPANY. WE WISH YOU THE BEST OF LUCK IN YOUR FUTURE OPPORTUNITIES!',
        UPDATE_SUCCESS: 'UPDATED',
    },
};

export default messages;
