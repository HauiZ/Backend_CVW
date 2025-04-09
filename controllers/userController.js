
import userService from '../services/userService.js';

export const registerCandidate = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body, "candidate");
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error("Lỗi đăng ký ứng viên (controller):", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

export const registerRecruiter = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body, "recruiter");
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error("Lỗi đăng ký nhà tuyển dụng (controller):", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

// export const registerAdmin = async (req, res) => {
//     try {
//         const result = await userService.registerUser(req.body, "admin");
//         res.status(result.status).json(result.data);
//     } catch (error) {
//         console.error("Lỗi đăng ký admin (controller):", error);
//         res.status(500).json({ message: "Lỗi máy chủ!" });
//     }
// };

export const getProfile = async (req, res) => {
    try {
        const result = await userService.getUserProfile(req.user.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error("Lỗi lấy thông tin người dùng (controller):", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsers();
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error("Lỗi lấy danh sách người dùng (controller):", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteAUser(req.params.id);
        res.status(result.status).json(result.data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi máy chủ!", err});
    }
}

