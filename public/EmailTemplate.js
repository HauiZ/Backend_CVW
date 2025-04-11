export const textEmail = (email, otp) => `
Xin chào ${email},

Bạn vừa yêu cầu khôi phục mật khẩu cho tài khoản CV Website.

Mã xác minh: ${otp}

Mã này có hiệu lực trong 5 phút. Nếu không phải bạn, vui lòng bỏ qua email.

Trân trọng,
Đội ngũ CV Website
`;

export const htmlEmail = (email, otp) => `
<div style="max-width: 600px; margin: 40px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); color: #2c3e50;">

  <h2 style="color: #27ae60; text-align: center;">🔐 Mã xác minh đặt lại mật khẩu</h2>

  <p style="font-size: 16px;">Xin chào <strong>${email}</strong>,</p>

  <p style="font-size: 16px;">Bạn đã yêu cầu khôi phục mật khẩu cho tài khoản của mình trên <strong>CV Website</strong>.</p>

  <p style="font-size: 16px; margin: 20px 0;">Mã xác minh của bạn là:</p>

  <div style="text-align: center; font-size: 32px; font-weight: bold; color: #27ae60; letter-spacing: 2px; margin: 10px 0 30px;">
    ${otp}
  </div>

  <p style="font-size: 16px;">Mã này có hiệu lực trong <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>

  <p style="font-size: 16px;">Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">

  <p style="font-size: 13px; color: #95a5a6; text-align: center;">
    Bạn nhận được email này vì đã gửi yêu cầu đặt lại mật khẩu trên CV Website.<br>
    © 2025 CV Website. All rights reserved.
  </p>
</div>
`;
