import User from '../models/User.js';
import Role from '../models/Role.js';
import PersonalUser from '../models/PersonalUser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CompanyUser from '../models/CompanyUser.js';
import Area from '../models/Area.js';
import sequelize from '../config/database.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, attributes: ["name"] }]
        });

        if (!user) {
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        // const isMatch = bcrypt.compareSync(password, user.password);
        // if (!isMatch) {
        //     return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        // }

        if (password !== user.password) {
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        const userRoles = user.Roles ? user.Roles.map(role => role.name) : [];

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Đăng nhập thành công!",
            user: {
                id: user.id,
                email: user.email,
                roles: userRoles
            },
            token
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};


const registerUser = async (req, res, roleName) => {
    const transaction = await sequelize.transaction();
    try {
        const { username, email, password, confirmpassword, BusinessName, phone } = req.body;
        const uniqueEmail = await User.findOne({
            where: { email: email },
            include: [Role]
        });
        let user;

        if (uniqueEmail) {
            const hasRole = uniqueEmail.Roles.some(role => role.name === roleName);
            if (hasRole) {
                return res.status(400).json({ message: `Email đã tồn tại với quyền ${roleName}` });
            }
            user = uniqueEmail;
        } else {
            user = await User.create({ 
                email, 
                password 
            }, { transaction });
        }

        const role = await Role.findOne({ where: { name: roleName } });
        if (role) {
            await user.addRole(role, { transaction });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        if (roleName === "candidate") {
            const personalUser = await PersonalUser.create({
                userId: user.id,
                name: username,
                email
            }, { transaction });

            await transaction.commit();

            res.status(201).json({ message: `Đăng ký thành công với quyền ${roleName}`, personalUser, token });
        }

        if (roleName === "recruiter") {
            const { province, district, domain } = req.body;

            let area = await Area.findOne({ where: { province, district, domain } }, { transaction });

            if (!area) {
                area = await Area.create({ province, district, domain }, { transaction });
            }

            const companyUser = await CompanyUser.create({
                userId: user.id,
                name: BusinessName,
                email,
                phone,
                areaId: area.id
            }, { transaction });

            await transaction.commit();

            res.status(201).json({
                message: `Đăng ký thành công với quyền ${roleName}`,
                companyUser,
                token
            });
        }


        if (roleName == 'admin') {
            await transaction.commit();
            res.status(201).json({ message: `Đăng ký thành công với quyền ${roleName}`, token });
        }

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


export const registerCandidate = async (req, res) => {
    return registerUser(req, res, "candidate");
};

export const registerRecruiter = async (req, res) => {
    return registerUser(req, res, "recruiter");
};

export const registerAdmin = async (req, res) => {
    return registerUser(req, res, "admin");
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Role, as: 'Roles', attributes: ["name"] },
                { model: PersonalUser, as: 'PersonalUser' },
                { model: CompanyUser, as: 'CompanyUser', include: [{ model: Area, as: 'Area' }] }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại!' });
        }

        const userRoles = user.Roles.map(role => role.name);

        let userInfo = { id: user.id, email: user.email, roles: userRoles };

        if (userRoles.includes('candidate') && user.PersonalUser) {
            userInfo.personalUser = {
                username: user.PersonalUser.name,
                email: user.PersonalUser.email,
                phone: user.PersonalUser.phone,
            };
        }

        if (userRoles.includes('recruiter') && user.CompanyUser) {
            userInfo.companyUser = {
                businessName: user.CompanyUser.name,
                email: user.CompanyUser.email,
                phone: user.CompanyUser.phone,
                area: user.CompanyUser.Area
                    ? {
                        id: user.CompanyUser.Area.id,
                        province: user.CompanyUser.Area.province,
                        district: user.CompanyUser.Area.district,
                        domain: user.CompanyUser.Area.domain
                    }
                    : null
            };
        }

        res.json({
            message: 'Lấy thông tin thành công!',
            user: userInfo
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
};


export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            include: [{ model: Role, as: 'Roles', attributes: ["name"] }]
        });

        if (!users.length) {
            return res.status(404).json({ message: "Không có người dùng nào!" });
        }

        const userList = users.map(user => ({
            id: user.id,
            email: user.email,
            roles: user.Roles ? user.Roles.map(role => role.name) : []
        }));

        res.json({
            message: "Lấy danh sách người dùng thành công!",
            users: userList
        });

    } catch (error) {
        console.error("Lỗi lấy danh sách user:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

