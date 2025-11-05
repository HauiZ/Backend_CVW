USE JobPortal;
GO

-- =============================================
-- 1. Thêm các Role nếu chưa tồn tại (Idempotent)
-- =============================================
IF NOT EXISTS (SELECT 1 FROM Role WHERE name = 'admin')
BEGIN
    INSERT INTO Role (name, discription, displayName)
    VALUES ('admin', 'System administrator', 'Administrator');
END

IF NOT EXISTS (SELECT 1 FROM Role WHERE name = 'candidate')
BEGIN
    INSERT INTO Role (name, discription, displayName)
    VALUES ('candidate', 'Job-seeking candidate', 'Candidate');
END

IF NOT EXISTS (SELECT 1 FROM Role WHERE name = 'recruiter')
BEGIN
    INSERT INTO Role (name, discription, displayName)
    VALUES ('recruiter', 'Company recruiter', 'Recruiter');
END
GO

-- =============================================
-- 2. Thêm dữ liệu Area (Không kiểm tra trùng lặp, chạy 1 lần nếu bảng trống)
-- =============================================
-- Script này giả định bảng Area trống khi chạy phần này
-- SET IDENTITY_INSERT dbo.Area OFF; -- Đảm bảo IDENTITY_INSERT OFF

-- ==================== MIỀN BẮC (NORTHERN VIETNAM) ====================
INSERT INTO dbo.Area (province, district) VALUES
(N'Hà Nội', N'Quận Ba Đình'), (N'Hà Nội', N'Quận Hoàn Kiếm'), (N'Hà Nội', N'Quận Hai Bà Trưng'), (N'Hà Nội', N'Quận Đống Đa'), (N'Hà Nội', N'Quận Tây Hồ'), (N'Hà Nội', N'Quận Cầu Giấy'), (N'Hà Nội', N'Quận Thanh Xuân'), (N'Hà Nội', N'Quận Hoàng Mai'), (N'Hà Nội', N'Quận Long Biên'), (N'Hà Nội', N'Quận Bắc Từ Liêm'), (N'Hà Nội', N'Quận Nam Từ Liêm'),
(N'Hà Nội', N'Thị xã Sơn Tây'), (N'Hà Nội', N'Huyện Ba Vì'), (N'Hà Nội', N'Huyện Chương Mỹ'), (N'Hà Nội', N'Huyện Đan Phượng'), (N'Hà Nội', N'Huyện Đông Anh'), (N'Hà Nội', N'Huyện Gia Lâm'), (N'Hà Nội', N'Huyện Hoài Đức'), (N'Hà Nội', N'Huyện Mê Linh'), (N'Hà Nội', N'Huyện Mỹ Đức'), (N'Hà Nội', N'Huyện Phú Xuyên'), (N'Hà Nội', N'Huyện Phúc Thọ'), (N'Hà Nội', N'Huyện Quốc Oai'), (N'Hà Nội', N'Huyện Sóc Sơn'), (N'Hà Nội', N'Huyện Thạch Thất'), (N'Hà Nội', N'Huyện Thanh Oai'), (N'Hà Nội', N'Huyện Thanh Trì'), (N'Hà Nội', N'Huyện Thường Tín'), (N'Hà Nội', N'Huyện Ứng Hòa');
GO
INSERT INTO dbo.Area (province, district) VALUES
(N'Hà Giang', N'Thành phố Hà Giang'), (N'Hà Giang', N'Huyện Đồng Văn'), (N'Hà Giang', N'Huyện Mèo Vạc'),
(N'Cao Bằng', N'Thành phố Cao Bằng'), (N'Cao Bằng', N'Huyện Trùng Khánh'),
(N'Bắc Kạn', N'Thành phố Bắc Kạn'), (N'Bắc Kạn', N'Huyện Ba Bể'),
(N'Tuyên Quang', N'Thành phố Tuyên Quang'), (N'Tuyên Quang', N'Huyện Chiêm Hóa'),
(N'Lào Cai', N'Thành phố Lào Cai'), (N'Lào Cai', N'Thị xã Sa Pa'), (N'Lào Cai', N'Huyện Bắc Hà'),
(N'Yên Bái', N'Thành phố Yên Bái'), (N'Yên Bái', N'Thị xã Nghĩa Lộ'), (N'Yên Bái', N'Huyện Mù Cang Chải'),
(N'Lai Châu', N'Thành phố Lai Châu'), (N'Lai Châu', N'Huyện Sìn Hồ'),
(N'Sơn La', N'Thành phố Sơn La'), (N'Sơn La', N'Huyện Mộc Châu'),
(N'Điện Biên', N'Thành phố Điện Biên Phủ'), (N'Điện Biên', N'Thị xã Mường Lay'),
(N'Hoà Bình', N'Thành phố Hòa Bình'), (N'Hoà Bình', N'Huyện Mai Châu'),
(N'Thái Nguyên', N'Thành phố Thái Nguyên'), (N'Thái Nguyên', N'Thành phố Sông Công'), (N'Thái Nguyên', N'Thị xã Phổ Yên'),
(N'Lạng Sơn', N'Thành phố Lạng Sơn'), (N'Lạng Sơn', N'Huyện Hữu Lũng'),
(N'Quảng Ninh', N'Thành phố Hạ Long'), (N'Quảng Ninh', N'Thành phố Cẩm Phả'), (N'Quảng Ninh', N'Thành phố Uông Bí'), (N'Quảng Ninh', N'Thành phố Móng Cái'),
(N'Bắc Giang', N'Thành phố Bắc Giang'), (N'Bắc Giang', N'Thị xã Việt Yên'), (N'Bắc Giang', N'Huyện Lục Ngạn'),
(N'Phú Thọ', N'Thành phố Việt Trì'), (N'Phú Thọ', N'Thị xã Phú Thọ'), (N'Phú Thọ', N'Huyện Lâm Thao'),
(N'Vĩnh Phúc', N'Thành phố Vĩnh Yên'), (N'Vĩnh Phúc', N'Thành phố Phúc Yên'), (N'Vĩnh Phúc', N'Huyện Tam Đảo'),
(N'Bắc Ninh', N'Thành phố Bắc Ninh'), (N'Bắc Ninh', N'Thành phố Từ Sơn'), (N'Bắc Ninh', N'Huyện Yên Phong'),
(N'Hải Dương', N'Thành phố Hải Dương'), (N'Hải Dương', N'Thành phố Chí Linh'), (N'Hải Dương', N'Thị xã Kinh Môn'),
(N'Hải Phòng', N'Quận Hồng Bàng'), (N'Hải Phòng', N'Quận Ngô Quyền'), (N'Hải Phòng', N'Quận Lê Chân'), (N'Hải Phòng', N'Quận Kiến An'), (N'Hải Phòng', N'Huyện Thủy Nguyên'),
(N'Hưng Yên', N'Thành phố Hưng Yên'), (N'Hưng Yên', N'Thị xã Mỹ Hào'), (N'Hưng Yên', N'Huyện Văn Lâm'),
(N'Thái Bình', N'Thành phố Thái Bình'), (N'Thái Bình', N'Huyện Tiền Hải'),
(N'Hà Nam', N'Thành phố Phủ Lý'), (N'Hà Nam', N'Thị xã Duy Tiên'),
(N'Nam Định', N'Thành phố Nam Định'), (N'Nam Định', N'Huyện Hải Hậu'),
(N'Ninh Bình', N'Thành phố Ninh Bình'), (N'Ninh Bình', N'Thành phố Tam Điệp'), (N'Ninh Bình', N'Huyện Hoa Lư'),
(N'Thanh Hóa', N'Thành phố Thanh Hóa'), (N'Thanh Hóa', N'Thành phố Sầm Sơn'), (N'Thanh Hóa', N'Thị xã Bỉm Sơn'), (N'Thanh Hóa', N'Huyện Hoằng Hóa');
GO
-- ==================== MIỀN TRUNG (CENTRAL VIETNAM) ====================
INSERT INTO dbo.Area (province, district) VALUES
(N'Nghệ An', N'Thành phố Vinh'), (N'Nghệ An', N'Thị xã Cửa Lò'), (N'Nghệ An', N'Thị xã Thái Hòa'), (N'Nghệ An', N'Huyện Diễn Châu'),
(N'Hà Tĩnh', N'Thành phố Hà Tĩnh'), (N'Hà Tĩnh', N'Thị xã Kỳ Anh'), (N'Hà Tĩnh', N'Huyện Can Lộc'),
(N'Quảng Bình', N'Thành phố Đồng Hới'), (N'Quảng Bình', N'Thị xã Ba Đồn'), (N'Quảng Bình', N'Huyện Phong Nha-Kẻ Bàng'),
(N'Quảng Trị', N'Thành phố Đông Hà'), (N'Quảng Trị', N'Thị xã Quảng Trị'), (N'Quảng Trị', N'Huyện Vĩnh Linh'),
(N'Thừa Thiên Huế', N'Thành phố Huế'), (N'Thừa Thiên Huế', N'Thị xã Hương Thủy'), (N'Thừa Thiên Huế', N'Huyện Phú Vang'),
(N'Đà Nẵng', N'Quận Hải Châu'), (N'Đà Nẵng', N'Quận Sơn Trà'), (N'Đà Nẵng', N'Quận Ngũ Hành Sơn'), (N'Đà Nẵng', N'Huyện Hòa Vang'),
(N'Quảng Nam', N'Thành phố Tam Kỳ'), (N'Quảng Nam', N'Thành phố Hội An'), (N'Quảng Nam', N'Thị xã Điện Bàn'),
(N'Quảng Ngãi', N'Thành phố Quảng Ngãi'), (N'Quảng Ngãi', N'Huyện Lý Sơn'),
(N'Bình Định', N'Thành phố Quy Nhơn'), (N'Bình Định', N'Thị xã An Nhơn'), (N'Bình Định', N'Huyện Tây Sơn'),
(N'Phú Yên', N'Thành phố Tuy Hòa'), (N'Phú Yên', N'Thị xã Sông Cầu'),
(N'Khánh Hòa', N'Thành phố Nha Trang'), (N'Khánh Hòa', N'Thành phố Cam Ranh'), (N'Khánh Hòa', N'Huyện Trường Sa'),
(N'Ninh Thuận', N'Thành phố Phan Rang-Tháp Chàm'), (N'Ninh Thuận', N'Huyện Ninh Hải'),
(N'Bình Thuận', N'Thành phố Phan Thiết'), (N'Bình Thuận', N'Thị xã La Gi'), (N'Bình Thuận', N'Huyện Hàm Thuận Bắc'),
(N'Kon Tum', N'Thành phố Kon Tum'), (N'Kon Tum', N'Huyện Sa Thầy'),
(N'Gia Lai', N'Thành phố Pleiku'), (N'Gia Lai', N'Thị xã An Khê'), (N'Gia Lai', N'Thị xã Ayun Pa'),
(N'Đắk Lắk', N'Thành phố Buôn Ma Thuột'), (N'Đắk Lắk', N'Thị xã Buôn Hồ'), (N'Đắk Lắk', N'Huyện Ea Kar'),
(N'Đắk Nông', N'Thành phố Gia Nghĩa'), (N'Đắk Nông', N'Huyện Đắk R''lấp'),
(N'Lâm Đồng', N'Thành phố Đà Lạt'), (N'Lâm Đồng', N'Thành phố Bảo Lộc'), (N'Lâm Đồng', N'Huyện Đức Trọng');
GO
-- ==================== MIỀN NAM (SOUTHERN VIETNAM) ====================
INSERT INTO dbo.Area (province, district) VALUES
(N'Bình Phước', N'Thành phố Đồng Xoài'), (N'Bình Phước', N'Thị xã Bình Long'), (N'Bình Phước', N'Thị xã Phước Long'),
(N'Tây Ninh', N'Thành phố Tây Ninh'), (N'Tây Ninh', N'Thị xã Trảng Bàng'),
(N'Bình Dương', N'Thành phố Thủ Dầu Một'), (N'Bình Dương', N'Thành phố Dĩ An'), (N'Bình Dương', N'Thành phố Thuận An'), (N'Bình Dương', N'Thị xã Bến Cát'), (N'Bình Dương', N'Thị xã Tân Uyên'),
(N'Đồng Nai', N'Thành phố Biên Hòa'), (N'Đồng Nai', N'Thành phố Long Khánh'), (N'Đồng Nai', N'Huyện Long Thành'),
(N'Bà Rịa - Vũng Tàu', N'Thành phố Vũng Tàu'), (N'Bà Rịa - Vũng Tàu', N'Thành phố Bà Rịa'), (N'Bà Rịa - Vũng Tàu', N'Thị xã Phú Mỹ'), (N'Bà Rịa - Vũng Tàu', N'Huyện Côn Đảo'),
(N'TP Hồ Chí Minh', N'Quận 1'), (N'TP Hồ Chí Minh', N'Quận 3'), (N'TP Hồ Chí Minh', N'Quận 4'), (N'TP Hồ Chí Minh', N'Quận 5'), (N'TP Hồ Chí Minh', N'Quận 6'), (N'TP Hồ Chí Minh', N'Quận 7'), (N'TP Hồ Chí Minh', N'Quận 8'), (N'TP Hồ Chí Minh', N'Quận 10'), (N'TP Hồ Chí Minh', N'Quận 11'), (N'TP Hồ Chí Minh', N'Quận 12'), (N'TP Hồ Chí Minh', N'Quận Gò Vấp'), (N'TP Hồ Chí Minh', N'Quận Tân Bình'), (N'TP Hồ Chí Minh', N'Quận Tân Phú'), (N'TP Hồ Chí Minh', N'Quận Bình Thạnh'), (N'TP Hồ Chí Minh', N'Quận Phú Nhuận'), (N'TP Hồ Chí Minh', N'Thành phố Thủ Đức'), (N'TP Hồ Chí Minh', N'Quận Bình Tân'), (N'TP Hồ Chí Minh', N'Huyện Củ Chi'), (N'TP Hồ Chí Minh', N'Huyện Hóc Môn'), (N'TP Hồ Chí Minh', N'Huyện Bình Chánh'), (N'TP Hồ Chí Minh', N'Huyện Nhà Bè'), (N'TP Hồ Chí Minh', N'Huyện Cần Giờ'),
(N'Long An', N'Thành phố Tân An'), (N'Long An', N'Thị xã Kiến Tường'), (N'Long An', N'Huyện Đức Hòa'),
(N'Tiền Giang', N'Thành phố Mỹ Tho'), (N'Tiền Giang', N'Thị xã Cai Lậy'), (N'Tiền Giang', N'Huyện Gò Công Đông'),
(N'Bến Tre', N'Thành phố Bến Tre'), (N'Bến Tre', N'Huyện Châu Thành'), -- Đã sửa lỗi lặp tên tỉnh
(N'Trà Vinh', N'Thành phố Trà Vinh'), (N'Trà Vinh', N'Thị xã Duyên Hải'),
(N'Vĩnh Long', N'Thành phố Vĩnh Long'), (N'Vĩnh Long', N'Thị xã Bình Minh'),
(N'Đồng Tháp', N'Thành phố Cao Lãnh'), (N'Đồng Tháp', N'Thành phố Sa Đéc'), (N'Đồng Tháp', N'Thành phố Hồng Ngự'),
(N'An Giang', N'Thành phố Long Xuyên'), (N'An Giang', N'Thành phố Châu Đốc'), (N'An Giang', N'Thị xã Tân Châu'),
(N'Kiên Giang', N'Thành phố Rạch Giá'), (N'Kiên Giang', N'Thành phố Hà Tiên'), (N'Kiên Giang', N'Thành phố Phú Quốc'),
(N'Cần Thơ', N'Quận Ninh Kiều'), (N'Cần Thơ', N'Quận Cái Răng'), (N'Cần Thơ', N'Quận Bình Thủy'), (N'Cần Thơ', N'Huyện Phong Điền'),
(N'Hậu Giang', N'Thành phố Vị Thanh'), (N'Hậu Giang', N'Thành phố Ngã Bảy'), (N'Hậu Giang', N'Thị xã Long Mỹ'),
(N'Sóc Trăng', N'Thành phố Sóc Trăng'), (N'Sóc Trăng', N'Thị xã Vĩnh Châu'),
(N'Bạc Liêu', N'Thành phố Bạc Liêu'), (N'Bạc Liêu', N'Thị xã Giá Rai'),
(N'Cà Mau', N'Thành phố Cà Mau'), (N'Cà Mau', N'Huyện Đất Mũi'), (N'Cà Mau', N'Huyện Năm Căn');
GO

-- 3. Insert Users (recruiters)
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'hr@fptsoftware.com')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'recruiter'), 'hr@fptsoftware.com', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'hr@vng.com.vn')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'recruiter'), 'hr@vng.com.vn', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'careers.vn@shopee.com')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'recruiter'), 'careers.vn@shopee.com', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'tuyendung@viettel.com.vn')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'recruiter'), 'tuyendung@viettel.com.vn', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'tuyendung@vingroup.net')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'recruiter'), 'tuyendung@vingroup.net', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'hr@techcombank.com.vn')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'recruiter'), 'hr@techcombank.com.vn', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'hr@momo.vn')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'recruiter'), 'hr@momo.vn', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'hr@tiki.vn')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'recruiter'), 'hr@tiki.vn', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'hr@mbbank.com.vn')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'recruiter'), 'hr@mbbank.com.vn', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'tuyendung@vnpt.vn')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'recruiter'), 'tuyendung@vnpt.vn', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'admin@gmail.com')
INSERT INTO Users (roleId, email, password, typeAccount, createAt)
VALUES ((SELECT id FROM Role WHERE name = 'admin'), 'admin@gmail.com', 'Pass1@', 'LOCAL', SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00'));
GO

-- 4. Insert Company_User

IF NOT EXISTS (SELECT 1 FROM Company_User WHERE name = N'FPT Software')
BEGIN
    DECLARE @areaId_0 INT = (SELECT TOP 1 id FROM Area WHERE province = N'Hà Nội' AND district = N'Quận Cầu Giấy');
    DECLARE @userId_0 INT = (SELECT TOP 1 id FROM Users WHERE email = 'hr@fptsoftware.com');
    INSERT INTO Company_User (userId, name, phone, email, areaId, companyAddress, field, companySize, website, introduction, logoId, logoUrl)
    VALUES (
        @userId_0,
        N'FPT Software',
        '02473008999',
        'hr@fptsoftware.com',
        @areaId_0,
        N'Tòa nhà FPT, Phạm Văn Bạch, Cầu Giấy, Hà Nội',
        N'Công nghệ thông tin',
        N'1000+',
        'https://www.fpt-software.com',
        N'FPT Software là một trong những công ty hàng đầu tại Việt Nam trong lĩnh vực Công nghệ thông tin, 
        với sứ mệnh cung cấp các dịch vụ chuyển đổi số và tư vấn IT.
        Chúng tôi cam kết mang đến môi trường làm việc chuyên nghiệp, 
        sáng tạo, và đầy cơ hội phát triển cá nhân và nghề nghiệp cho tất cả nhân viên. 
        FPT Software luôn chú trọng đến việc đào tạo và phát triển kỹ năng cho nhân viên, 
        đảm bảo rằng họ có thể đáp ứng các yêu cầu ngày càng cao của thị trường công nghệ toàn cầu.',
        N'FPT_pnbyur',
        N'https://res.cloudinary.com/dsokd4mmb/image/upload/v1748936614/FPT_pnbyur.png'
    );
END

IF NOT EXISTS (SELECT 1 FROM Company_User WHERE name = N'VNG Corporation')
BEGIN
    DECLARE @areaId_1 INT = (SELECT TOP 1 id FROM Area WHERE province = N'TP Hồ Chí Minh' AND district = N'Quận 7');
    DECLARE @userId_1 INT = (SELECT TOP 1 id FROM Users WHERE email = 'hr@vng.com.vn');
    INSERT INTO Company_User (userId, name, phone, email, areaId, companyAddress, field, companySize, website, introduction, logoId, logoUrl)
    VALUES (
        @userId_1,
        N'VNG Corporation',
        '02839627111',
        'hr@vng.com.vn',
        @areaId_1,
        N'Z06, đường số 13, Khu chế xuất Tân Thuận, Quận 7, TP.HCM',
        N'Công nghệ thông tin',
        N'1000+',
        'https://www.vng.com.vn',
        N'VNG Corporation là một trong những công ty công nghệ hàng đầu tại Việt Nam, 
        với sứ mệnh kiến tạo công nghệ và phát triển con người. 
        Chúng tôi không ngừng đổi mới và sáng tạo để cung cấp các sản phẩm và dịch vụ chất lượng cao,
        nhằm phục vụ người dùng tốt nhất. 
        Tại VNG, chúng tôi tin rằng con người là tài sản quý giá nhất, 
        và chúng tôi luôn nỗ lực tạo ra một môi trường làm việc thân thiện, 
        năng động và đầy cơ hội để nhân viên phát triển sự nghiệp cũng như năng lực cá nhân.',
        N'VNG_ttjguj',
        N'https://res.cloudinary.com/dsokd4mmb/image/upload/v1748935671/VNG_ttjguj.jpg'
    );
END

IF NOT EXISTS (SELECT 1 FROM Company_User WHERE name = N'Shopee Việt Nam')
BEGIN
    DECLARE @areaId_2 INT = (SELECT TOP 1 id FROM Area WHERE province = N'TP Hồ Chí Minh' AND district = N'Quận 1');
    DECLARE @userId_2 INT = (SELECT TOP 1 id FROM Users WHERE email = 'careers.vn@shopee.com');
    INSERT INTO Company_User (userId, name, phone, email, areaId, companyAddress, field, companySize, website, introduction, logoId, logoUrl)
    VALUES (
        @userId_2,
        N'Shopee Việt Nam',
        '02873001221',
        'careers.vn@shopee.com',
        @areaId_2,
        N'Tòa nhà Saigon Centre, Quận 1, TP.HCM',
        N'Thương mại điện tử',
        N'1000+',
        'https://careers.shopee.vn',
        N'Shopee Việt Nam là một trong những nền tảng thương mại điện tử hàng đầu tại Việt Nam, 
        cung cấp trải nghiệm mua sắm tiện lợi và an toàn cho người tiêu dùng. 
        Chúng tôi cam kết mang đến một môi trường làm việc sáng tạo, 
        nơi mà mọi ý tưởng đều được lắng nghe và phát triển. 
        Tại Shopee, chúng tôi tin tưởng vào việc phát triển đội ngũ nhân viên 
        thông qua các chương trình đào tạo chuyên sâu và cơ hội thăng tiến trong sự nghiệp.',
        N'Shopee_akh9mz',
        N'https://res.cloudinary.com/dsokd4mmb/image/upload/v1748935670/Shopee_akh9mz.png'
    );
END

IF NOT EXISTS (SELECT 1 FROM Company_User WHERE name = N'Viettel Group')
BEGIN
    DECLARE @areaId_3 INT = (SELECT TOP 1 id FROM Area WHERE province = N'Hà Nội' AND district = N'Quận Ba Đình');
    DECLARE @userId_3 INT = (SELECT TOP 1 id FROM Users WHERE email = 'tuyendung@viettel.com.vn');
    INSERT INTO Company_User (userId, name, phone, email, areaId, companyAddress, field, companySize, website, introduction, logoId, logoUrl)
    VALUES (
        @userId_3,
        N'Viettel Group',
        '02462556789',
        'tuyendung@viettel.com.vn',
        @areaId_3,
        N'Số 1 Giang Văn Minh, Ba Đình, Hà Nội',
        N'Viễn thông',
        N'1000+',
        'https://www.viettel.com.vn',
        N'Viettel Group là một trong những công ty viễn thông hàng đầu tại Việt Nam, 
        với sứ mệnh cung cấp các dịch vụ viễn thông hiện đại và tiên tiến nhất cho khách hàng. 
        Chúng tôi luôn nỗ lực để tạo ra một môi trường làm việc chuyên nghiệp và cởi mở, 
        nơi mà nhân viên có thể phát huy tối đa khả năng của mình. 
        Viettel cam kết đầu tư vào đào tạo và phát triển kỹ năng cho đội ngũ nhân viên, 
        nhằm đáp ứng nhu cầu ngày càng cao của thị trường.',
        N'Viettel_yxghxn',
        N'https://res.cloudinary.com/dsokd4mmb/image/upload/v1748935670/Viettel_yxghxn.jpg'
    );
END

IF NOT EXISTS (SELECT 1 FROM Company_User WHERE name = N'VinGroup')
BEGIN
    DECLARE @areaId_4 INT = (SELECT TOP 1 id FROM Area WHERE province = N'Hà Nội' AND district = N'Quận Hai Bà Trưng');
    DECLARE @userId_4 INT = (SELECT TOP 1 id FROM Users WHERE email = 'tuyendung@vingroup.net');
    INSERT INTO Company_User (userId, name, phone, email, areaId, companyAddress, field, companySize, website, introduction, logoId, logoUrl)
    VALUES (
        @userId_4,
        N'VinGroup',
        '02439749999',
        'tuyendung@vingroup.net',
        @areaId_4,
        N'Tòa nhà Vincom, 191 Bà Triệu, Hai Bà Trưng, Hà Nội',
        N'Đầu tư đa ngành',
        N'1000+',
        'https://www.vingroup.net',
        N'VinGroup là một trong những tập đoàn đa ngành hàng đầu tại Việt Nam, 
        với sứ mệnh nâng cao chất lượng cuộc sống của người dân thông qua các sản phẩm và dịch vụ chất lượng. 
        Chúng tôi cam kết tạo ra một môi trường làm việc tích cực và phát triển, 
        nơi mà nhân viên được khuyến khích đổi mới và sáng tạo. 
        VinGroup không ngừng đầu tư vào công nghệ và con người, 
        nhằm xây dựng một tương lai tốt đẹp hơn cho cộng đồng và xã hội.',
        N'Vingroup_icscve',
        N'https://res.cloudinary.com/dsokd4mmb/image/upload/v1748935671/Vingroup_icscve.png'
    );
END

IF NOT EXISTS (SELECT 1 FROM Company_User WHERE name = N'Techcombank')
BEGIN
    DECLARE @areaId_5 INT = (SELECT TOP 1 id FROM Area WHERE province = N'Hà Nội' AND district = N'Quận Hai Bà Trưng');
    DECLARE @userId_5 INT = (SELECT TOP 1 id FROM Users WHERE email = 'hr@techcombank.com.vn');
    INSERT INTO Company_User (userId, name, phone, email, areaId, companyAddress, field, companySize, website, introduction, logoId, logoUrl)
    VALUES (
        @userId_5,
        N'Techcombank',
        '02439449999',
        'hr@techcombank.com.vn',
        @areaId_5,
        N'191 Bà Triệu, Quận Hai Bà Trưng, Hà Nội',
        N'Ngân hàng',
        N'1000+',
        'https://www.techcombank.com.vn',
        N'Techcombank là một trong những ngân hàng thương mại cổ phần hàng đầu tại Việt Nam, 
        với sứ mệnh cung cấp các dịch vụ tài chính an toàn và hiệu quả cho khách hàng. 
        Chúng tôi cam kết xây dựng một môi trường làm việc năng động, 
        nơi mà nhân viên được phát triển toàn diện và có cơ hội thăng tiến trong sự nghiệp. 
        Techcombank cũng chú trọng đến việc đào tạo kỹ năng và phát triển năng lực cho nhân viên, 
        nhằm đáp ứng tốt nhất nhu cầu của khách hàng và thị trường.',
        N'TCB_y9bget',
        N'https://res.cloudinary.com/dsokd4mmb/image/upload/v1748935670/TCB_y9bget.png'
    );
END

IF NOT EXISTS (SELECT 1 FROM Company_User WHERE name = N'MoMo')
BEGIN
    DECLARE @areaId_6 INT = (SELECT TOP 1 id FROM Area WHERE province = N'TP Hồ Chí Minh' AND district = N'Quận 7');
    DECLARE @userId_6 INT = (SELECT TOP 1 id FROM Users WHERE email = 'hr@momo.vn');
    INSERT INTO Company_User (userId, name, phone, email, areaId, companyAddress, field, companySize, website, introduction, logoId, logoUrl)
    VALUES (
        @userId_6,
        N'MoMo',
        '02839954545',
        'hr@momo.vn',
        @areaId_6,
        N'Tòa nhà Riverpark Premier, Quận 7, TP.HCM',
        N'Công nghệ tài chính (Fintech)',
        N'500-1000',
        'https://momo.vn',
        N'MoMo là một trong những công ty công nghệ tài chính (Fintech) hàng đầu tại Việt Nam, 
        với sứ mệnh mang lại sự tiện lợi và an toàn trong các giao dịch tài chính cho người dùng. 
        Chúng tôi cam kết xây dựng một môi trường làm việc thân thiện và sáng tạo, 
        nơi mà mọi nhân viên có thể phát triển toàn diện về kỹ năng và năng lực cá nhân. 
        MoMo không ngừng đổi mới công nghệ và cải tiến dịch vụ để đáp ứng nhu cầu ngày càng cao của khách hàng.',
        N'Momo_nd0xaa',
        N'https://res.cloudinary.com/dsokd4mmb/image/upload/v1748935670/Momo_nd0xaa.png'
    );
END

IF NOT EXISTS (SELECT 1 FROM Company_User WHERE name = N'Tiki Corporation')
BEGIN
    DECLARE @areaId_7 INT = (SELECT TOP 1 id FROM Area WHERE province = N'TP Hồ Chí Minh' AND district = N'Quận Tân Bình');
    DECLARE @userId_7 INT = (SELECT TOP 1 id FROM Users WHERE email = 'hr@tiki.vn');
    INSERT INTO Company_User (userId, name, phone, email, areaId, companyAddress, field, companySize, website, introduction, logoId, logoUrl)
    VALUES (
        @userId_7,
        N'Tiki Corporation',
        '02873002222',
        'hr@tiki.vn',
        @areaId_7,
        N'52 Út Tịch, Quận Tân Bình, TP.HCM',
        N'Thương mại điện tử',
        N'500-1000',
        'https://tiki.vn',
        N'Tiki Corporation là một trong những nền tảng thương mại điện tử hàng đầu tại Việt Nam, 
        với sứ mệnh cung cấp trải nghiệm mua sắm trực tuyến an toàn và tiện lợi cho người tiêu dùng. 
        Chúng tôi cam kết xây dựng một môi trường làm việc sáng tạo và năng động, 
        nơi mà nhân viên được khuyến khích phát triển ý tưởng và cải tiến dịch vụ. 
        Tiki luôn chú trọng đến việc phát triển kỹ năng và năng lực cho nhân viên, 
        nhằm đáp ứng tốt nhất nhu cầu của khách hàng và thị trường.',
        N'Tiki_p7awlq',
        N'https://res.cloudinary.com/dsokd4mmb/image/upload/v1748935670/Tiki_p7awlq.png'
    );
END

IF NOT EXISTS (SELECT 1 FROM Company_User WHERE name = N'MB Bank')
BEGIN
    DECLARE @areaId_8 INT = (SELECT TOP 1 id FROM Area WHERE province = N'Hà Nội' AND district = N'Quận Cầu Giấy');
    DECLARE @userId_8 INT = (SELECT TOP 1 id FROM Users WHERE email = 'hr@mbbank.com.vn');
    INSERT INTO Company_User (userId, name, phone, email, areaId, companyAddress, field, companySize, website, introduction, logoId, logoUrl)
    VALUES (
        @userId_8,
        N'MB Bank',
        '02437267788',
        'hr@mbbank.com.vn',
        @areaId_8,
        N'63 Lê Văn Lương, Cầu Giấy, Hà Nội',
        N'Ngân hàng',
        N'1000+',
        'https://mbbank.com.vn',
        N'MB Bank là một trong những ngân hàng thương mại hàng đầu tại Việt Nam, 
        với sứ mệnh cung cấp dịch vụ tài chính hiện đại và tiện ích cho khách hàng. 
        Chúng tôi cam kết mang đến môi trường làm việc chuyên nghiệp, 
        nơi mà mọi nhân viên đều có cơ hội phát triển và thăng tiến trong sự nghiệp. 
        MB Bank cũng chú trọng đến việc đào tạo và phát triển kỹ năng cho đội ngũ nhân viên, 
        để đáp ứng tốt nhất nhu cầu của khách hàng và thị trường.',
        N'MB_lrxwok',
        N'https://res.cloudinary.com/dsokd4mmb/image/upload/v1748935671/MB_lrxwok.png'
    );
END

IF NOT EXISTS (SELECT 1 FROM Company_User WHERE name = N'VNPT')
BEGIN
    DECLARE @areaId_9 INT = (SELECT TOP 1 id FROM Area WHERE province = N'Hà Nội' AND district = N'Quận Đống Đa');
    DECLARE @userId_9 INT = (SELECT TOP 1 id FROM Users WHERE email = 'tuyendung@vnpt.vn');
    INSERT INTO Company_User (userId, name, phone, email, areaId, companyAddress, field, companySize, website, introduction, logoId, logoUrl)
    VALUES (
        @userId_9,
        N'VNPT',
        '02437741684',
        'tuyendung@vnpt.vn',
        @areaId_9,
        N'57 Huỳnh Thúc Kháng, Đống Đa, Hà Nội',
        N'Viễn thông - CNTT',
        N'1000+',
        'https://vnpt.com.vn',
        N'VNPT là một trong những công ty viễn thông hàng đầu tại Việt Nam, 
        với sứ mệnh cung cấp các dịch vụ viễn thông và công nghệ thông tin 
        tiên tiến để phục vụ cộng đồng và doanh nghiệp. 
        Chúng tôi cam kết tạo ra một môi trường làm việc năng động và sáng tạo, 
        nơi mà nhân viên được phát triển tài năng và có cơ hội đóng góp cho sự phát triển chung của công ty. 
        VNPT luôn thúc đẩy việc đào tạo và nâng cao kỹ năng cho nhân viên, 
        nhằm đáp ứng tốt nhất nhu cầu của thị trường.',
        N'VNPT_xh3zy1',
        N'https://res.cloudinary.com/dsokd4mmb/image/upload/v1748935670/VNPT_xh3zy1.png'
    );
END

GO
-- End of scriptSQL.sql

