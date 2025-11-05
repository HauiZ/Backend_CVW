/* seed_recruitment_news_enhanced.sql
   - profession phụ thuộc công ty
   - jobTitle ngẫu nhiên trong đúng profession và GIỮ NGUYÊN
   - areaId ngẫu nhiên từ Area, jobAddress = district, province
   - experience random thực sự per-row
   - Không dùng STRING_AGG
   - Chuẩn hoá thời gian theo +07:00:
       + @TodayLocal: hôm nay theo +07:00
       + workDateIn, applicationDeadline tính từ @TodayLocal
       + datePosted là DATETIMEOFFSET +07:00
*/

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
BEGIN TRAN;

DECLARE @Now   DATETIMEOFFSET = SYSDATETIMEOFFSET();
-- HÔM NAY THEO +07:00
DECLARE @TodayLocal DATE = SWITCHOFFSET(@Now, '+07:00');
DECLARE @PerCompany INT = 30;

/* 1) Lấy danh sách công ty */
IF OBJECT_ID('tempdb..#Co') IS NOT NULL DROP TABLE #Co;
CREATE TABLE #Co(
  companyId     INT PRIMARY KEY,
  companyName   NVARCHAR(255),
  areaId        INT,
  companyAddr   NVARCHAR(500),
  contactEmail  NVARCHAR(255),
  contactPhone  NVARCHAR(50)
);

INSERT INTO #Co(companyId, companyName, areaId, companyAddr, contactEmail, contactPhone)
SELECT cu.userId, cu.name, cu.areaId, cu.companyAddress, cu.email, cu.phone
FROM Company_User AS cu;

/* 2) Suy profession theo tên công ty (fallback CNTT) */
IF OBJECT_ID('tempdb..#CoProf') IS NOT NULL DROP TABLE #CoProf;
CREATE TABLE #CoProf(companyId INT PRIMARY KEY, profession NVARCHAR(255));

INSERT INTO #CoProf(companyId, profession)
SELECT c.companyId,
       CASE
         WHEN c.companyName LIKE N'%FPT%'         THEN N'Công nghệ thông tin'
         WHEN c.companyName LIKE N'%VNG%'         THEN N'Công nghệ thông tin'
         WHEN c.companyName LIKE N'%Viettel%'     THEN N'Viễn thông - CNTT'
         WHEN c.companyName LIKE N'%VNPT%'        THEN N'Viễn thông - CNTT'
         WHEN c.companyName LIKE N'%Techcombank%' THEN N'Ngân hàng'
         WHEN c.companyName LIKE N'%MB Bank%'     THEN N'Ngân hàng'
         WHEN c.companyName LIKE N'%MoMo%'        THEN N'Công nghệ tài chính (Fintech)'
         WHEN c.companyName LIKE N'%Tiki%'        THEN N'Thương mại điện tử'
         WHEN c.companyName LIKE N'%Shopee%'      THEN N'Thương mại điện tử'
         WHEN c.companyName LIKE N'%Lazada%'      THEN N'Thương mại điện tử'
         WHEN c.companyName LIKE N'%Media%'       THEN N'Marketing - Truyền thông'
         WHEN c.companyName LIKE N'%Marketing%'   THEN N'Marketing - Truyền thông'
         WHEN c.companyName LIKE N'%Logistics%'   THEN N'Logistics - Vận tải'
         WHEN c.companyName LIKE N'%Pharma%'      THEN N'Y tế - Dược phẩm'
         WHEN c.companyName LIKE N'%Edu%'         THEN N'Giáo dục - Đào tạo'
         ELSE N'Công nghệ thông tin'
       END
FROM #Co c;

/* 3) KHO TIÊU ĐỀ */
IF OBJECT_ID('tempdb..#Title') IS NOT NULL DROP TABLE #Title;
CREATE TABLE #Title(profession NVARCHAR(255), jobTitle NVARCHAR(255));
INSERT INTO #Title VALUES
-- CNTT (50 titles)
(N'Công nghệ thông tin', N'Frontend Developer'),
(N'Công nghệ thông tin', N'Backend Developer'),
(N'Công nghệ thông tin', N'Fullstack Engineer'),
(N'Công nghệ thông tin', N'Data Engineer'),
(N'Công nghệ thông tin', N'Data Analyst'),
(N'Công nghệ thông tin', N'Machine Learning Engineer'),
(N'Công nghệ thông tin', N'AI Engineer'),
(N'Công nghệ thông tin', N'DevOps Engineer'),
(N'Công nghệ thông tin', N'SRE Engineer'),
(N'Công nghệ thông tin', N'Mobile Developer'),
(N'Công nghệ thông tin', N'iOS Developer'),
(N'Công nghệ thông tin', N'Android Developer'),
(N'Công nghệ thông tin', N'React Native Developer'),
(N'Công nghệ thông tin', N'Flutter Developer'),
(N'Công nghệ thông tin', N'QA Engineer'),
(N'Công nghệ thông tin', N'QC Engineer'),
(N'Công nghệ thông tin', N'Automation Test Engineer'),
(N'Công nghệ thông tin', N'Manual Tester'),
(N'Công nghệ thông tin', N'Product Owner'),
(N'Công nghệ thông tin', N'Product Manager'),
(N'Công nghệ thông tin', N'Project Manager'),
(N'Công nghệ thông tin', N'Scrum Master'),
(N'Công nghệ thông tin', N'Business Analyst'),
(N'Công nghệ thông tin', N'System Analyst'),
(N'Công nghệ thông tin', N'Solution Architect'),
(N'Công nghệ thông tin', N'Software Architect'),
(N'Công nghệ thông tin', N'Technical Lead'),
(N'Công nghệ thông tin', N'Team Leader'),
(N'Công nghệ thông tin', N'Golang Developer'),
(N'Công nghệ thông tin', N'Python Developer'),
(N'Công nghệ thông tin', N'Java Developer'),
(N'Công nghệ thông tin', N'.NET Developer'),
(N'Công nghệ thông tin', N'PHP Developer'),
(N'Công nghệ thông tin', N'NodeJS Developer'),
(N'Công nghệ thông tin', N'Ruby Developer'),
(N'Công nghệ thông tin', N'C++ Developer'),
(N'Công nghệ thông tin', N'Cloud Engineer'),
(N'Công nghệ thông tin', N'AWS Engineer'),
(N'Công nghệ thông tin', N'Azure Engineer'),
(N'Công nghệ thông tin', N'GCP Engineer'),
(N'Công nghệ thông tin', N'Security Engineer'),
(N'Công nghệ thông tin', N'Cybersecurity Analyst'),
(N'Công nghệ thông tin', N'Penetration Tester'),
(N'Công nghệ thông tin', N'Blockchain Developer'),
(N'Công nghệ thông tin', N'Game Developer'),
(N'Công nghệ thông tin', N'Unity Developer'),
(N'Công nghệ thông tin', N'Unreal Developer'),
(N'Công nghệ thông tin', N'Database Administrator'),
(N'Công nghệ thông tin', N'Data Scientist'),
(N'Công nghệ thông tin', N'Big Data Engineer'),
-- Viễn thông (10 titles)
(N'Viễn thông - CNTT', N'NOC Engineer'),
(N'Viễn thông - CNTT', N'System Operator'),
(N'Viễn thông - CNTT', N'Network Engineer'),
(N'Viễn thông - CNTT', N'Network Administrator'),
(N'Viễn thông - CNTT', N'Telecom Engineer'),
(N'Viễn thông - CNTT', N'RF Optimization Engineer'),
(N'Viễn thông - CNTT', N'Core Network Engineer'),
(N'Viễn thông - CNTT', N'VoIP Engineer'),
(N'Viễn thông - CNTT', N'5G Engineer'),
(N'Viễn thông - CNTT', N'Network Security Engineer'),
-- Ngân hàng (15 titles)
(N'Ngân hàng', N'Chuyên viên Quản lý Rủi ro'),
(N'Ngân hàng', N'Chuyên viên Phát triển Sản phẩm'),
(N'Ngân hàng', N'Chuyên viên Tín dụng'),
(N'Ngân hàng', N'Chuyên viên Phân tích Dữ liệu'),
(N'Ngân hàng', N'Chuyên viên Pháp chế'),
(N'Ngân hàng', N'Chuyên viên Quan hệ Khách hàng'),
(N'Ngân hàng', N'Chuyên viên Dịch vụ Khách hàng'),
(N'Ngân hàng', N'Chuyên viên Ngân quỹ'),
(N'Ngân hàng', N'Chuyên viên Kế toán'),
(N'Ngân hàng', N'Chuyên viên Kiểm toán Nội bộ'),
(N'Ngân hàng', N'Trưởng phòng Tín dụng'),
(N'Ngân hàng', N'Trưởng phòng Rủi ro'),
(N'Ngân hàng', N'Giám đốc Chi nhánh'),
(N'Ngân hàng', N'Chuyên viên Tuân thủ'),
(N'Ngân hàng', N'Chuyên viên Thanh toán Quốc tế'),
-- TMĐT (12 titles)
(N'Thương mại điện tử', N'Category Manager'),
(N'Thương mại điện tử', N'Growth Analyst'),
(N'Thương mại điện tử', N'Operations Specialist'),
(N'Thương mại điện tử', N'Key Account Manager'),
(N'Thương mại điện tử', N'Content Strategist'),
(N'Thương mại điện tử', N'Merchandising Manager'),
(N'Thương mại điện tử', N'Supply Chain Coordinator'),
(N'Thương mại điện tử', N'Customer Service Lead'),
(N'Thương mại điện tử', N'E-commerce Manager'),
(N'Thương mại điện tử', N'Digital Marketing Manager'),
(N'Thương mại điện tử', N'SEO Specialist'),
(N'Thương mại điện tử', N'Marketplace Manager'),
-- Fintech (10 titles)
(N'Công nghệ tài chính (Fintech)', N'Payment Operation Specialist'),
(N'Công nghệ tài chính (Fintech)', N'Fraud Analyst'),
(N'Công nghệ tài chính (Fintech)', N'Risk & Compliance Specialist'),
(N'Công nghệ tài chính (Fintech)', N'Blockchain Engineer'),
(N'Công nghệ tài chính (Fintech)', N'KYC/AML Specialist'),
(N'Công nghệ tài chính (Fintech)', N'Product Manager'),
(N'Công nghệ tài chính (Fintech)', N'Financial Analyst'),
(N'Công nghệ tài chính (Fintech)', N'Quantitative Analyst'),
(N'Công nghệ tài chính (Fintech)', N'Credit Risk Analyst'),
(N'Công nghệ tài chính (Fintech)', N'Digital Banking Specialist'),
-- Marketing (10 titles)
(N'Marketing - Truyền thông', N'Digital Marketing Manager'),
(N'Marketing - Truyền thông', N'Content Marketing Specialist'),
(N'Marketing - Truyền thông', N'SEO/SEM Specialist'),
(N'Marketing - Truyền thông', N'Social Media Manager'),
(N'Marketing - Truyền thông', N'Brand Manager'),
(N'Marketing - Truyền thông', N'Performance Marketing'),
(N'Marketing - Truyền thông', N'Marketing Analyst'),
(N'Marketing - Truyền thông', N'PR Manager'),
(N'Marketing - Truyền thông', N'Community Manager'),
(N'Marketing - Truyền thông', N'Email Marketing Specialist'),
-- Kinh doanh (8 titles)
(N'Kinh doanh - Bán hàng', N'Sales Executive'),
(N'Kinh doanh - Bán hàng', N'Account Manager'),
(N'Kinh doanh - Bán hàng', N'Business Development Manager'),
(N'Kinh doanh - Bán hàng', N'Sales Manager'),
(N'Kinh doanh - Bán hàng', N'Telesales'),
(N'Kinh doanh - Bán hàng', N'B2B Sales Manager'),
(N'Kinh doanh - Bán hàng', N'Key Account Director'),
(N'Kinh doanh - Bán hàng', N'Inside Sales Representative');

/* 4) Component */
IF OBJECT_ID('tempdb..#Component') IS NOT NULL DROP TABLE #Component;
CREATE TABLE #Component(type NVARCHAR(20), val NVARCHAR(100));
INSERT INTO #Component VALUES
(N'level', N'Thực tập sinh'),(N'level', N'Nhân viên'),(N'level', N'Chuyên viên'),(N'level', N'Trưởng nhóm'),
(N'level', N'Phó phòng'),(N'level', N'Trưởng phòng'),(N'level', N'Quản lý'),(N'level', N'Giám sát'),
(N'level', N'Phó giám đốc'),(N'level', N'Giám đốc'),
(N'workType', N'Toàn thời gian'),(N'workType', N'Bán thời gian'),(N'workType', N'Thực tập'),
(N'workType', N'Remote'),(N'workType', N'Hybrid'),(N'workType', N'Theo dự án'),(N'workType', N'Hợp đồng tư vấn'),
(N'degree', N'Không yêu cầu'),(N'degree', N'Trung cấp'),(N'degree', N'Cao đẳng'),(N'degree', N'Đại học'),
(N'degree', N'Sau đại học'),(N'degree', N'Thạc sĩ'),(N'degree', N'Tiến sĩ'),
(N'exp', N'Không yêu cầu'),(N'exp', N'Dưới 1 năm'),(N'exp', N'1-3 năm'),
(N'exp', N'2-3 năm'),(N'exp', N'3-5 năm'),(N'exp', N'5-7 năm'),(N'exp', N'Trên 5 năm');

/* 5) Area */
IF OBJECT_ID('tempdb..#Area') IS NOT NULL DROP TABLE #Area;
CREATE TABLE #Area(areaId INT PRIMARY KEY, district NVARCHAR(255), province NVARCHAR(255));
INSERT INTO #Area(areaId, district, province)
SELECT a.id, a.district, a.province
FROM Area a;

/* 6) Lib */
IF OBJECT_ID('tempdb..#Lib') IS NOT NULL DROP TABLE #Lib;
CREATE TABLE #Lib(kind NVARCHAR(20), content NVARCHAR(300));
INSERT INTO #Lib VALUES
-- Work Details (30 câu)
(N'detail', N'Tham gia họp sprint planning và retrospective hằng tuần'),
(N'detail', N'Phát triển và tối ưu hoá tính năng theo quy trình Agile'),
(N'detail', N'Phối hợp với nhóm QA để đảm bảo chất lượng sản phẩm'),
(N'detail', N'Viết tài liệu kỹ thuật và hướng dẫn sử dụng cho người dùng cuối'),
(N'detail', N'Tối ưu hiệu năng và khả năng mở rộng của hệ thống'),
(N'detail', N'Cập nhật và áp dụng xu hướng công nghệ mới vào dự án'),
(N'detail', N'Thiết kế kiến trúc phần mềm tuân thủ best practices'),
(N'detail', N'Thực hiện code review và mentoring cho junior members'),
(N'detail', N'Tích hợp hệ thống với API của bên thứ ba'),
(N'detail', N'Triển khai và giám sát ứng dụng trên môi trường cloud'),
(N'detail', N'Xây dựng và maintain CI/CD pipeline'),
(N'detail', N'Phân tích yêu cầu nghiệp vụ từ stakeholders'),
(N'detail', N'Thiết kế database schema và optimize queries'),
(N'detail', N'Implement các tính năng bảo mật theo chuẩn quốc tế'),
(N'detail', N'Xây dựng RESTful API và microservices'),
(N'detail', N'Phát triển giao diện người dùng responsive và thân thiện'),
(N'detail', N'Viết unit test và integration test đầy đủ'),
(N'detail', N'Monitor và troubleshoot production issues'),
(N'detail', N'Tham gia technical discussion và brainstorming sessions'),
(N'detail', N'Refactor legacy code để cải thiện maintainability'),
(N'detail', N'Làm việc với Docker và Kubernetes cho containerization'),
(N'detail', N'Implement caching strategies để tối ưu performance'),
(N'detail', N'Phát triển mobile app cho iOS và Android'),
(N'detail', N'Setup monitoring và logging system'),
(N'detail', N'Collaborate với designers để implement UI/UX'),
(N'detail', N'Xây dựng data pipeline và ETL processes'),
(N'detail', N'Implement real-time features với WebSocket'),
(N'detail', N'Optimize frontend bundle size và loading time'),
(N'detail', N'Conduct performance testing và load testing'),
(N'detail', N'Maintain technical documentation và knowledge base'),
-- Requirements (40 câu)
(N'req', N'Tốt nghiệp Đại học chuyên ngành liên quan đến công nghệ'),
(N'req', N'Có ít nhất 2 năm kinh nghiệm làm việc trong lĩnh vực tương tự'),
(N'req', N'Thành thạo ngôn ngữ lập trình Java, Python hoặc JavaScript'),
(N'req', N'Hiểu biết sâu về OOP và Design Patterns'),
(N'req', N'Kinh nghiệm với Spring Boot hoặc Django framework'),
(N'req', N'Thành thạo React, Vue.js hoặc Angular'),
(N'req', N'Có kinh nghiệm làm việc với SQL và NoSQL databases'),
(N'req', N'Kinh nghiệm sử dụng Git và quy trình Git Flow'),
(N'req', N'Hiểu biết về RESTful API design và GraphQL'),
(N'req', N'Kinh nghiệm với cloud platforms (AWS, Azure, hoặc GCP)'),
(N'req', N'Kỹ năng debugging và problem-solving tốt'),
(N'req', N'Khả năng làm việc độc lập và teamwork hiệu quả'),
(N'req', N'Có khả năng đọc hiểu tài liệu tiếng Anh chuyên ngành'),
(N'req', N'Kinh nghiệm với Agile/Scrum methodology'),
(N'req', N'Hiểu biết về Security best practices'),
(N'req', N'Kinh nghiệm với Docker và container orchestration'),
(N'req', N'Kỹ năng communication và presentation tốt'),
(N'req', N'Có khả năng học hỏi công nghệ mới nhanh chóng'),
(N'req', N'Kinh nghiệm làm việc trong môi trường startup là lợi thế'),
(N'req', N'Thành thạo HTML5, CSS3 và responsive design'),
(N'req', N'Kinh nghiệm với testing frameworks (Jest, Mocha, JUnit)'),
(N'req', N'Hiểu biết về microservices architecture'),
(N'req', N'Kinh nghiệm optimize performance cho web và mobile'),
(N'req', N'Có khả năng review code và mentor junior developers'),
(N'req', N'Kinh nghiệm với message queues (RabbitMQ, Kafka)'),
(N'req', N'Hiểu biết về CI/CD pipelines và DevOps practices'),
(N'req', N'Kỹ năng phân tích và thiết kế hệ thống tốt'),
(N'req', N'Kinh nghiệm với monitoring tools (Prometheus, Grafana)'),
(N'req', N'Có certificate chuyên môn là một lợi thế'),
(N'req', N'Kinh nghiệm làm việc trong dự án quốc tế'),
(N'req', N'Thành thạo TypeScript cho frontend development'),
(N'req', N'Kinh nghiệm với state management (Redux, MobX)'),
(N'req', N'Hiểu biết về data structures và algorithms'),
(N'req', N'Kinh nghiệm với serverless architecture'),
(N'req', N'Kỹ năng time management và priority setting tốt'),
(N'req', N'Có portfolio hoặc Github projects để tham khảo'),
(N'req', N'Kinh nghiệm với automated testing và TDD'),
(N'req', N'Hiểu biết về accessibility standards (WCAG)'),
(N'req', N'Kinh nghiệm optimize SEO cho web applications'),
(N'req', N'Có passion cho coding và công nghệ mới'),
-- Benefits (35 câu)
(N'ben', N'Lương cạnh tranh, xét tăng lương định kỳ 6 tháng/lần'),
(N'ben', N'Thưởng hiệu suất hằng quý và cuối năm'),
(N'ben', N'Thưởng dự án khi hoàn thành đúng deadline'),
(N'ben', N'Bảo hiểm sức khoẻ toàn diện cho nhân viên và gia đình'),
(N'ben', N'Bảo hiểm tai nạn 24/7'),
(N'ben', N'Chế độ nghỉ phép 14-18 ngày/năm'),
(N'ben', N'Giờ làm việc linh hoạt từ 8h-10h sáng'),
(N'ben', N'Hỗ trợ WFH 2-3 ngày/tuần'),
(N'ben', N'Môi trường làm việc năng động, sáng tạo và chuyên nghiệp'),
(N'ben', N'Team building, du lịch trong và ngoài nước hằng năm'),
(N'ben', N'Snack, trái cây, cà phê free hằng ngày'),
(N'ben', N'Budget đào tạo và tham gia khóa học chuyên môn'),
(N'ben', N'Hỗ trợ chi phí học tiếng Anh và các kỹ năng mềm'),
(N'ben', N'Cơ hội onsite tại Singapore, Nhật Bản, Hàn Quốc'),
(N'ben', N'Được làm việc với công nghệ và stack hiện đại nhất'),
(N'ben', N'Văn phòng hiện đại, đầy đủ trang thiết bị'),
(N'ben', N'Phòng gym, game room, thư viện sách'),
(N'ben', N'Chương trình recognition và rewards hằng tháng'),
(N'ben', N'Happy hour mỗi thứ 6 hằng tuần'),
(N'ben', N'Thưởng sinh nhật, lễ tết, hiếu hỉ'),
(N'ben', N'Review lương và thăng tiến theo năng lực'),
(N'ben', N'Được mentoring bởi senior và tech leads giàu kinh nghiệm'),
(N'ben', N'Tham gia các sự kiện tech community'),
(N'ben', N'Budget cho equipment (laptop, màn hình, bàn ghế)'),
(N'ben', N'Hỗ trợ chi phí đi lại và ăn trưa'),
(N'ben', N'Khám sức khoẻ định kỳ hằng năm'),
(N'ben', N'Phụ cấp điện thoại và internet'),
(N'ben', N'Nghỉ thai sản và chế độ cho phụ nữ có thai'),
(N'ben', N'Chính sách bonus cho referral thành công'),
(N'ben', N'Clear career path và cơ hội thăng tiến rõ ràng'),
(N'ben', N'Được tham gia các dự án lớn và challenging'),
(N'ben', N'Văn hoá startup năng động, ít hierarchical'),
(N'ben', N'Support visa và work permit cho expats'),
(N'ben', N'Performance bonus lên đến 3-6 tháng lương'),
(N'ben', N'Employee Stock Option Plan (ESOP) cho key members');

/* 7) Sinh dữ liệu và chèn */
;WITH Tally AS (
  SELECT TOP (@PerCompany) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
),
Base AS (
  SELECT c.companyId, c.companyName, c.areaId, c.companyAddr, c.contactEmail, c.contactPhone, t.n
  FROM #Co c CROSS JOIN Tally t
)
INSERT INTO Recruitment_News (
  companyId, jobTitle, profession, candidateNumber,
  jobLevel, workType, degree, areaId, jobAddress,
  salaryMin, salaryMax, salaryNegotiable,
  experience, workDateIn,
  workDetail, jobRequirements, benefits,
  applicationDeadline,
  contactInfo, contactAddress, contactPhone, contactEmail, videoUrl,
  datePosted, status
)
SELECT
  b.companyId,

  -- jobTitle ngẫu nhiên trong đúng profession của công ty
  BT.baseTitle,
  CP.profession,

  CAND.candidateNumber,

  JL.jobLevel,
  WT.workType,
  DG.degree,

  -- area ngẫu nhiên
  AR.selAreaId AS areaId,
  CONCAT(ISNULL(AR.district,N''), N', ', ISNULL(AR.province,N'')) AS jobAddress,

  SAL.salaryMin,
  SAL.salaryMax,

  CAST(NEG.negoFlag AS bit) AS salaryNegotiable,

  EX.experience,

  -- workDateIn: 0–14 ngày từ HÔM NAY +07:00 (kiểu DATE)
  WDIN.workDateIn,
  LEFT(WD.workDetailJson, 1000),
  LEFT(RQ.reqJson,        1000),
  LEFT(BN.benJson,        1000),

  -- applicationDeadline: 15–60 ngày từ HÔM NAY +07:00 (kiểu DATE)
  ADL.applicationDeadline,

  CI.contactInfo,
  ISNULL(b.companyAddr, N''),
  ISNULL(b.contactPhone, N''),
  ISNULL(b.contactEmail, N''),
  N'https://www.youtube.com/embed/g7DW5YsJD5M',

  -- datePosted: DATETIMEOFFSET +07:00
  DP.datePosted,
  N'APPROVED'
FROM Base b

/* seed per-row */
CROSS APPLY (SELECT NEWID() AS guid) RND

/* chọn Area ngẫu nhiên mỗi dòng */
CROSS APPLY (SELECT COUNT(*) AS cnt FROM #Area) Ac
CROSS APPLY (SELECT 1 + ABS(CHECKSUM(RND.guid, b.companyId, b.n, N'area')) % Ac.cnt AS idx) Aidx
CROSS APPLY (
  SELECT y.areaId AS selAreaId, y.district, y.province
  FROM (
    SELECT a.areaId, a.district, a.province,
           ROW_NUMBER() OVER (ORDER BY a.areaId) AS rn
    FROM #Area a
  ) y
  WHERE y.rn = Aidx.idx
) AR

/* xác định profession công ty */
CROSS APPLY (
  SELECT
    CASE
      WHEN b.companyName LIKE N'%Viettel%' OR b.companyName LIKE N'%VNPT%'         THEN N'Viễn thông - CNTT'
      WHEN b.companyName LIKE N'%Techcombank%' OR b.companyName LIKE N'%MB Bank%'  THEN N'Ngân hàng'
      WHEN b.companyName LIKE N'%Tiki%' OR b.companyName LIKE N'%Shopee%'          THEN N'Thương mại điện tử'
      WHEN b.companyName LIKE N'%MoMo%'                                            THEN N'Công nghệ tài chính (Fintech)'
      ELSE N'Công nghệ thông tin'
    END AS profession
) CP

/* Chọn jobTitle NGẪU NHIÊN trong đúng profession */
CROSS APPLY (
  SELECT COUNT(*) AS cnt
  FROM #Title
  WHERE profession = CP.profession
) JTc
CROSS APPLY (
  SELECT 1 + ABS(CHECKSUM(RND.guid, b.companyId, b.n, N'jt')) % JTc.cnt AS idx
) JTsel
CROSS APPLY (
  SELECT x.jobTitle AS baseTitle, x.profession
  FROM (
    SELECT t.jobTitle, t.profession,
           ROW_NUMBER() OVER (ORDER BY t.jobTitle) AS rn
    FROM #Title t
    WHERE t.profession = CP.profession
  ) x
  WHERE x.rn = JTsel.idx
) BT

/* level/workType/degree theo băm */
CROSS APPLY (SELECT COUNT(*) AS cnt FROM #Component WHERE type = N'level') Lc
CROSS APPLY (SELECT (ABS(CHECKSUM(b.companyId, b.n, N'level')) % Lc.cnt) + 1 AS k) Lpick
CROSS APPLY (
  SELECT val AS jobLevel
  FROM (SELECT val, ROW_NUMBER() OVER (ORDER BY val) AS rn FROM #Component WHERE type = N'level') x
  WHERE x.rn = Lpick.k
) JL

CROSS APPLY (SELECT COUNT(*) AS cnt FROM #Component WHERE type = N'workType') Wc
CROSS APPLY (SELECT (ABS(CHECKSUM(b.companyId, b.n, N'workType')) % Wc.cnt) + 1 AS k) Wpick
CROSS APPLY (
  SELECT val AS workType
  FROM (SELECT val, ROW_NUMBER() OVER (ORDER BY val) AS rn FROM #Component WHERE type = N'workType') x
  WHERE x.rn = Wpick.k
) WT

CROSS APPLY (SELECT COUNT(*) AS cnt FROM #Component WHERE type = N'degree') Dc
CROSS APPLY (SELECT (ABS(CHECKSUM(b.companyId, b.n, N'degree')) % Dc.cnt) + 1 AS k) Dpick
CROSS APPLY (
  SELECT val AS degree
  FROM (SELECT val, ROW_NUMBER() OVER (ORDER BY val) AS rn FROM #Component WHERE type = N'degree') x
  WHERE x.rn = Dpick.k
) DG

/* experience RANDOM thực sự per-row */
CROSS APPLY (SELECT COUNT(*) AS cnt FROM #Component WHERE type = N'exp') Ec
CROSS APPLY (SELECT (ABS(CHECKSUM(NEWID(), b.companyId, b.n, RND.guid)) % Ec.cnt) + 1 AS k) Epick
CROSS APPLY (
  SELECT val AS experience
  FROM (SELECT val, ROW_NUMBER() OVER (ORDER BY val) AS rn FROM #Component WHERE type = N'exp') x
  WHERE x.rn = Epick.k
) EX

/* phần còn lại giữ nguyên */
CROSS APPLY (SELECT 1 + (ABS(CHECKSUM(NEWID(), b.companyId, b.n)) % 20) AS candidateNumber) CAND
CROSS APPLY (SELECT 1000000 + (ABS(CHECKSUM(RND.guid, b.n)) % 21) * 1000000 AS salaryMin) SM
CROSS APPLY (SELECT 1000000  + (ABS(CHECKSUM(NEWID(), b.companyId)) % 21) * 1000000 AS salaryDelta) SD
CROSS APPLY (SELECT SM.salaryMin AS salaryMin, (SM.salaryMin + SD.salaryDelta) AS salaryMax) SAL
CROSS APPLY (SELECT ABS(CHECKSUM(NEWID(), b.companyId, b.n)) % 2 AS negoFlag) NEG

-- workDateIn từ @TodayLocal (DATE)
CROSS APPLY (
  SELECT DATEADD(DAY, ABS(CHECKSUM(NEWID(), b.n)) % 15, SWITCHOFFSET(@Now, '+07:00')) AS workDateIn
) WDIN

/* JSON arrays: KHÔNG dùng STRING_AGG */
CROSS APPLY (
  SELECT 
    N'["' + COALESCE(
      STUFF((
        SELECT '","' + REPLACE(s.content, '"', '""')
        FROM (
          SELECT TOP (5 + (ABS(CHECKSUM(NEWID(), b.companyId, b.n)) % 4)) content
          FROM #Lib WHERE kind = N'detail' ORDER BY NEWID()
        ) AS s
        FOR XML PATH(''), TYPE
      ).value('.', 'NVARCHAR(MAX)'), 1, 3, ''), N'') + N'"]' AS workDetailJson
) WD
CROSS APPLY (
  SELECT 
    N'["' + COALESCE(
      STUFF((
        SELECT '","' + REPLACE(s.content, '"', '""')
        FROM (
          SELECT TOP (6 + (ABS(CHECKSUM(NEWID(), b.companyId, b.n)) % 5)) content
          FROM #Lib WHERE kind = N'req' ORDER BY NEWID()
        ) AS s
        FOR XML PATH(''), TYPE
      ).value('.', 'NVARCHAR(MAX)'), 1, 3, ''), N'') + N'"]' AS reqJson
) RQ
CROSS APPLY (
  SELECT 
    N'["' + COALESCE(
      STUFF((
        SELECT '","' + REPLACE(s.content, '"', '""')
        FROM (
          SELECT TOP (6 + (ABS(CHECKSUM(NEWID(), b.companyId, b.n)) % 5)) content
          FROM #Lib WHERE kind = N'ben' ORDER BY NEWID()
        ) AS s
        FOR XML PATH(''), TYPE
      ).value('.', 'NVARCHAR(MAX)'), 1, 3, ''), N'') + N'"]' AS benJson
) BN

/* Hạn nộp hồ sơ: 15–60 ngày từ @TodayLocal (DATE) */
CROSS APPLY (SELECT 15 + (ABS(CHECKSUM(NEWID(), b.companyId)) % 46) AS deadlineDays) DDL
CROSS APPLY (
  SELECT DATEADD(DAY, DDL.deadlineDays, SWITCHOFFSET(@Now, '+07:00')) AS applicationDeadline
) ADL

CROSS APPLY (
  SELECT TOP 1 contactInfo
  FROM (VALUES
    (N'Phòng Nhân sự'),
    (N'Talent Acquisition'),
    (N'HRBP'),
    (N'Recruitment Team'),
    (N'HR Department')
  ) v(contactInfo)
  ORDER BY NEWID()
) CI

/* datePosted: trong 30 ngày gần đây, offset +07:00 */
CROSS APPLY (
  SELECT DATEADD(
           MINUTE,
           -1 * (ABS(CHECKSUM(NEWID(), b.companyId, b.n)) % 43200),
           SWITCHOFFSET(@Now, '+07:00')
         ) AS datePosted
) DP
OPTION (RECOMPILE, MAXDOP 1);

DECLARE @inserted INT = @@ROWCOUNT;

COMMIT TRAN;

PRINT N'✅ Đã chèn ' + CAST(@inserted AS NVARCHAR(20)) + N' tin tuyển dụng.';
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0 ROLLBACK TRAN;
  SELECT ERROR_NUMBER() AS err_no,
         ERROR_SEVERITY() AS err_sev,
         ERROR_STATE() AS err_state,
         ERROR_LINE() AS err_line,
         ERROR_MESSAGE() AS err_msg;
END CATCH;
