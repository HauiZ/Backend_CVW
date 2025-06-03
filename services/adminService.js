import Request from "../models/Request.js";
import messages from "../config/message.js";
import moment from "moment-timezone";
import RecruitmentNews from "../models/RecruitmentNews.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import PersonalUser from "../models/PersonalUser.js";
import CvFiles from "../models/CvFiles.js";
import CompanyUser from "../models/CompanyUser.js";
import CVTemplate from "../models/CVTemplate.js";
import Notification from "../models/Notification.js";
import { Op } from "sequelize";
import drive from "../config/googleDrive/driveconfig.js";
import JobApplication from "../models/JobApplication.js";
import cloudinary from "../config/cloudinary.js";
import uploadCvService from "./upload/uploadCvService.js";

const getAllUsers = async (userId, filterRole) => {
  try {
    const { keyword, id } = filterRole;
    const includeOptions = [
      { model: Role, as: "Role", attributes: ["name"] },
      {
        model: CompanyUser,
        as: "CompanyUser",
        attributes: ["logoUrl", "name"],
      },
      {
        model: PersonalUser,
        as: "PersonalUser",
        attributes: ["avatarUrl", "name"],
      },
    ];
    const whereConditions = {};

    // lấy người dùng có id cụ thể
    if (id) {
      whereConditions.id = id;
    } else {
      // lất tất cả người dùng trừ người dùng hiện tại
      whereConditions.id = { [Op.ne]: userId };

      if (keyword && keyword.trim() !== "") {
        const searchTerm = `%${keyword.trim()}%`;
        whereConditions[Op.or] = [
          { id: { [Op.like]: searchTerm } },
          { email: { [Op.like]: searchTerm } },
          { "$Role.name$": { [Op.like]: searchTerm } },
          { "$CompanyUser.name$": { [Op.like]: searchTerm } },
          { "$PersonalUser.name$": { [Op.like]: searchTerm } },
        ];
      }
    }

    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // loại bỏ mật khẩu
      include: includeOptions,
      where: whereConditions,
    });

    if (!users.length) {
      return {
        status: 202,
        data: { message: messages.user.ERR_USER_NOT_EXISTS, users: [] },
      };
    }

    const userList = users.map((user) => {
      const userData = {
        id: user.id,
        email: user.email,
        role: user.Role.name,
        imageUrl: null,
        createAt: moment(user.createAt).format("YYYY-MM-DD HH:mm:ss"),
      };
      // lấy ảnh đại diện hoặc logo tùy theo role
      if (user.Role.name === "candidate") {
        userData.imageUrl = user.PersonalUser?.avatarUrl;
      } else if (user.Role.name === "recruiter") {
        userData.imageUrl = user.CompanyUser?.logoUrl;
      }
      return userData;
    });
    return {
      status: 200,
      data: { message: messages.user.GET_INFO, users: userList },
    };
  } catch (error) {
    console.log(error);
    return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
  }
};

const deleteAUser = async (userId) => {
  try {
    const userToDelete = await User.findByPk(userId, {
      include: [
        { model: Role, attributes: ["name"] },
        { model: PersonalUser, attributes: ["avatarId"] },
        { model: CompanyUser, attributes: ["logoId"] },
      ],
    });
    if (!userToDelete) {
      return {
        status: 404,
        data: { message: messages.user.ERR_USER_NOT_EXISTS },
      };
    }
    if (userToDelete.Role.name === "admin") {
      return {
        status: 409,
        data: { message: messages.error.ERR_DELETE_ADMIN },
      };
    }
    const cvFilesToDelete = await CvFiles.findAll({
      where: {
        personalId: userId,
      },
    });
    // Xóa tất cả đơn ứng tuyển của người dùng trên hệ thống ứng với CV xóa
    if (cvFilesToDelete && cvFilesToDelete.length > 0) {
      for (const cvFile of cvFilesToDelete) {
        await JobApplication.destroy({
          where: {
            cvId: cvFile.id,
          },
        });
      }
    }

    const recruitmentNews = await RecruitmentNews.findAll({
      where: {
        companyId: userId,
      },
    });
    // Xóa tất cả đơn ứng tuyển của người dùng trên hệ thống ứng với tin tuyển dụng xóa
    if (recruitmentNews && recruitmentNews.length > 0) {
      for (const news of recruitmentNews) {
        await JobApplication.destroy({
          where: {
            recruitmentNewsId: news.id,
          },
        });
      }
    }
    // Xóa tất cả CV của người dùng trên drive
    if (cvFilesToDelete && cvFilesToDelete.length > 0) {
      for (const cvFile of cvFilesToDelete) {
        const googleDriveFileId = cvFile.fileId;
        await drive.files.delete({
          fileId: googleDriveFileId,
        });
      }
    }
    // Xóa ảnh đại diện cá nhân hoặc logo công ty nếu có trên cloudinary
    if (
      userToDelete.PersonalUser &&
      userToDelete.PersonalUser.avatarId !== null
    ) {
      await cloudinary.uploader.destroy(userToDelete.PersonalUser.avatarId);
    }

    if (userToDelete.CompanyUser && userToDelete.CompanyUser.logoId !== null) {
      await cloudinary.uploader.destroy(userToDelete.CompanyUser.logoId);
    }
    await userToDelete.destroy();
    return {
      status: 200,
      data: { message: `DELETED: ${userId} SUCCESSFULLY!` },
    };
  } catch (error) {
    console.log(error);
    return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
  }
};

const getRequest = async () => {
  try {
    const requests = await Request.findAll();
    const requestList = requests.map((request) => {
      const data = request.toJSON();
      return {
        ...data,
        createAt: moment(data.createAt).format("YYYY-MM-DD HH:mm:ss"),
      };
    });
    return { status: 200, data: requestList };
  } catch (error) {
    return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
  }
};

const approveRecruitment = async (requestId, status) => {
  try {
    const request = await Request.findByPk(requestId);
    const recruitmentNewId = request.recruitmentNewsId;
    const recruitmentNew = await RecruitmentNews.findByPk(recruitmentNewId, {
      attributes: ["id", "companyId", "status", 'parentId'],
      include: [
        {
          model: CompanyUser,
          attributes: ["name", "userId"],
        },
      ],
    });
    const userId = recruitmentNew.CompanyUser.userId;
    const companyName = recruitmentNew.CompanyUser.name;
    switch (request.typeOf) {
      // Đăng tin tuyển dụng
      case messages.recruitmentNews.typeof.JOB_POSTING:
        await recruitmentNew.update({ status: status });
        let content1;
        if (status === messages.recruitmentNews.status.APPROVED) {
          content1 = messages.recruitmentNews.APPROVED_POST;
        } else if (status === messages.recruitmentNews.status.REJECTED) {
          content1 = messages.recruitmentNews.REJECTED_POST;
        }
        await Notification.create({
          sender: "ADMIN",
          receiverId: userId,
          receiver: companyName,
          title: `Response Job Posting Status { Post No.${recruitmentNewId} }`,
          content: content1,
        });
        await request.update({ status: status, isReviewed: true });
        return {
          status: 200,
          data: { message: messages.recruitmentNews.UPDATE_SUCCESS },
        };
      // Chỉnh sửa tin tuyển dụng
      case messages.recruitmentNews.typeof.UPDATE_JOB_POSTING:
        const parentNewsId = recruitmentNew.parentId;
        if (!parentNewsId) {
          return {
            status: 400,
            data: { message: messages.recruitmentNews.ERR_NOT_EXISTS },
          };
        }
        const parentRecruitmentNews = await RecruitmentNews.findByPk(parentNewsId);
        let content2;
        if (status === messages.recruitmentNews.status.APPROVED) {
          content2 = messages.recruitmentNews.UPDATED_POST_SUCCESS;
          await JobApplication.update( // cập nhật lại đơn ứng tuyển sang tin tuyển dụng mới
            { recruitmentNewsId: recruitmentNewId },
            {
              where: {
                recruitmentNewsId: parentRecruitmentNews.id,
              },
            }
          );
          await parentRecruitmentNews.destroy();
          await recruitmentNew.update({ parentId: null, status: messages.recruitmentNews.status.APPROVED });
        } else if (status === messages.recruitmentNews.status.REJECTED) {
          content2 = messages.recruitmentNews.UPDATED_POST_FAILED;
          await parentRecruitmentNews.update({ status: messages.recruitmentNews.status.APPROVED });
          await recruitmentNew.destroy();
        }
        await Notification.create({
          sender: "ADMIN",
          receiverId: userId,
          receiver: companyName,
          title: `Response Update Post Status { Post No.${recruitmentNewId} }`,
          content: content2,
        });
        await request.update({ status: status, isReviewed: true });
        return {
          status: 200,
          data: { message: messages.recruitmentNews.UPDATE_SUCCESS },
        };
      // Xóa tin tuyển dụng
      case messages.recruitmentNews.typeof.DELETE_JOB_POSTING:
        if (!recruitmentNewId) {
          return {
            status: 400,
            data: { message: messages.recruitmentNews.ERR_NOT_EXISTS },
          };
        }
        let content3;
        if (status === messages.recruitmentNews.status.APPROVED) {
          content3 = messages.recruitmentNews.DELETED_POST_SUCCESS;
          await JobApplication.destroy({ // xóa tất cả đơn ứng tuyển ứng với tin tuyển dụng
            where: {
              recruitmentNewsId: recruitmentNew.id,
            },
          });
          await recruitmentNew.destroy();
        } else if (status === messages.recruitmentNews.status.REJECTED) {
          content3 = messages.recruitmentNews.DELETED_POST_FAILED;
        }
        await Notification.create({ // tạo thông báo cho người dùng
          sender: "ADMIN",
          receiverId: userId,
          receiver: companyName,
          title: `Response Delete Post Status { Post No.${recruitmentNewId} }`,
          content: content3,
        });
        await request.update({ status: status, isReviewed: true });
        return {
          status: 200,
          data: { message: messages.recruitmentNews.UPDATE_SUCCESS },
        };
      default:
        return {
          status: 400,
          data: { message: messages.recruitmentNews.ERR_TYPE_NOT_SUPPORTED },
        };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
  }
};

const uploadBufferToCloudinary = (buffer, folder, resource_type = "auto") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const uploadCvTemplate = async (data, files) => {
  try {
    const { name, propoties } = data;
    const pdfFile = files?.pdf?.[0];
    const imageFile = files?.image?.[0];

    if (!pdfFile || !imageFile) {
      return {
        status: 400,
        data: { message: messages.file.ERR_FILE_NOT_EXISTS },
      };
    }

    // Upload PDF lên drive
    const pdfUpload = await uploadCvService.uploadTemplate(pdfFile);

    // Upload ảnh preview lên Cloudinary (image)
    const imageUpload = await uploadBufferToCloudinary(
      imageFile.buffer,
      "PdfPreview",
      "image"
    );

    await CVTemplate.create({
      name,
      templateId: pdfUpload.templateId,
      templateUrl: pdfUpload.templateUrl,
      displayId: imageUpload.public_id,
      displayUrl: imageUpload.secure_url,
      propoties,
    });
    return { status: 200, data: { message: messages.file.FILE_UPLOAD_ACCESS } };
  } catch (error) {
    console.log(error);
    return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
  }
};

const getDataDashBoard = async () => {
  try {
    const data = {
      user: await User.count({
        include: [{
          model: Role,
          where: {
            name: {
              [Op.ne]: 'admin'
            }
          }
        }]
      }),
      candidate: await User.count({
        include: [
          {
            model: Role,
            where: { name: "candidate" },
          },
        ],
      }),
      recruiter: await User.count({
        include: [
          {
            model: Role,
            where: { name: "recruiter" },
          },
        ],
      }),
      recruitmentNews: await RecruitmentNews.count({
        where: { status: messages.recruitmentNews.status.APPROVED },
      }),
    };
    return { status: 200, data: data };
  } catch (error) {
    console.log(error);
    return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
  }
};

const getTemplateCV = async () => {
  try {
    const listTemplate = await CVTemplate.findAll({
      attributes: ["id", "name", "templateUrl", "displayUrl", "propoties"],
    });
    return { status: 200, data: listTemplate };
  } catch (error) {
    console.log(error);
    return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
  }
};

const deleteTemplate = async (templateId) => {
  try {
    const template = await CVTemplate.findByPk(templateId);
    if (template.templateId) {
      const googleDriveFileId = template.templateId;
      await drive.files.delete({ // Xóa file PDF trên Google Drive
        fileId: googleDriveFileId,
      });
    }
    if (template.displayId) {
      await cloudinary.uploader.destroy(template.displayId); // Xóa ảnh đại diện trên Cloudinary
    }
    await template.destroy();
    return {
      status: 200,
      data: { message: `DELETED: ${templateId} SUCCESSFULLY!` },
    };
  } catch (error) {
    console.log(error);
    return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
  }
};

const updateCvTemplate = async (templateId, data, files) => {
  try {
    const { name, propoties } = data;
    const pdfFile = files?.pdf?.[0];
    const imageFile = files?.image?.[0];

    const template = await CVTemplate.findByPk(templateId);
    if (!template) {
      return {
        status: 404,
        data: { message: messages.file.ERR_FILE_NOT_EXISTS },
      };
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (propoties) updateData.propoties = propoties;

    if (pdfFile) {
      // Xóa file PDF cũ nếu có
      if (template.templateId) {
        try {
          await drive.files.delete({
            fileId: template.templateId,
          });
        } catch (deleteError) {
          console.log("Error deleting old PDF:", deleteError);
        }
      }

      // Upload PDF mới
      const pdfUpload = await uploadCvService.uploadTemplate(pdfFile);
      updateData.templateId = pdfUpload.templateId;
      updateData.templateUrl = pdfUpload.templateUrl;
    }

    if (imageFile) {
      // Xóa ảnh cũ nếu có
      if (template.displayId) {
        try {
          await cloudinary.uploader.destroy(template.displayId);
        } catch (deleteError) {
          console.log("Error deleting old image:", deleteError);
        }
      }

      // Upload ảnh mới
      const imageUpload = await uploadBufferToCloudinary(
        imageFile.buffer,
        "PdfPreview",
        "image"
      );
      updateData.displayId = imageUpload.public_id;
      updateData.displayUrl = imageUpload.secure_url;
    }

    await template.update(updateData);

    return { status: 200, data: { message: messages.file.UPDATE_SUCCESS } };
  } catch (error) {
    console.log(error);
    return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
  }
};
export default {
  getAllUsers,
  deleteAUser,
  getRequest,
  approveRecruitment,
  uploadCvTemplate,
  getDataDashBoard,
  getTemplateCV,
  deleteTemplate,
  updateCvTemplate,
};
