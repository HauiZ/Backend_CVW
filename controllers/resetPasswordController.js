import resetPasswordService from "../services/resetPasswordService.js";

export const forgotPassword = async (req, res) => {
    try {
        const {roleName} = req.params;
        const result = await resetPasswordService.forgotPassword(req.body, roleName);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const sendOTPCode = async (req, res) => {
    try {
        const {email} = req.body;
        const {roleName} = req.params;
        const result = await resetPasswordService.sendOTPCode(email, roleName);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

