/* seed_candidates_only_insert.sql
   - Chỉ INSERT vào [Users] và [Personal_User].
   - Cần bảng [Area] có cột province.
*/

SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRAN;

DECLARE @Now DATETIME2 = SYSDATETIME();

-- Role ứng viên (điều chỉnh nếu khác)
DECLARE @CandidateRoleId INT = 2;

-- Lấy danh sách province
IF OBJECT_ID('tempdb..#Province') IS NOT NULL DROP TABLE #Province;
CREATE TABLE #Province(
  rn INT PRIMARY KEY,
  province NVARCHAR(255) NOT NULL
);

INSERT INTO #Province(rn, province)
SELECT ROW_NUMBER() OVER (ORDER BY province ASC), province
FROM Area
WHERE province IS NOT NULL AND LTRIM(RTRIM(province)) <> N'';

IF (SELECT COUNT(*) FROM #Province) = 0
BEGIN
  RAISERROR(N'Area.province trống. Không thể seed location.', 16, 1);
  ROLLBACK TRAN;
  RETURN;
END;

DECLARE @ProvCount INT = (SELECT COUNT(*) FROM #Province);

-- Bảng tạm dữ liệu nguồn 100 ứng viên
DECLARE @Seed TABLE(
  n INT PRIMARY KEY,
  email           NVARCHAR(255) NOT NULL,
  [name]          NVARCHAR(255) NOT NULL,
  phone           NVARCHAR(20)  NULL,
  desiredJob      NVARCHAR(200) NULL,
  skills          NVARCHAR(MAX) NULL,   -- JSON string
  yearsExperience INT           NULL,
  currentLevel    NVARCHAR(200) NULL,
  [about]         NVARCHAR(400) NULL,
  [location]      NVARCHAR(255) NULL,
  expectedSalary  NVARCHAR(50)  NULL
);

WITH N AS (
  SELECT TOP (100) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.objects
)
INSERT INTO @Seed(n, email, [name], phone, desiredJob, skills, yearsExperience, currentLevel, [about], [location], expectedSalary)
SELECT
  n,
  CONCAT(
  'user_',
  RIGHT('000000' + CAST(ABS(CHECKSUM(NEWID())) % 1000000 AS NVARCHAR(6)), 6),
  '@gmail.com'
) AS email
,
  CONCAT(
    CHOOSE( (n%10)+1, N'Nguyễn',N'Trần',N'Lê',N'Phạm',N'Hoàng',N'Phan',N'Vũ',N'Võ',N'Đặng',N'Bùi'), N' ',
    CHOOSE( (n%10)+1, N'Văn',N'Thị',N'Anh',N'Minh',N'Quang',N'Thu',N'Hồng',N'Tuấn',N'Duy',N'Ngọc'), N' ',
    CHOOSE( (n%15)+1, N'An',N'Bình',N'Châu',N'Dũng',N'Hà',N'Hải',N'Hưng',N'Kiên',N'Linh',N'Phong',N'Sơn',N'Thảo',N'Trang',N'Trí',N'Vy')
  ) AS [name],

  -- SĐT giả lập 10 số bắt đầu bằng 0
  CONCAT(N'0', RIGHT(REPLICATE(N'0', 9) + CAST(ABS(CHECKSUM(NEWID())) % 1000000000 AS NVARCHAR(10)), 9)) AS phone,

  CHOOSE( (n%5)+1,
          N'Frontend Developer',
          N'Backend Developer',
          N'Fullstack Engineer',
          N'Data Analyst',
          N'QA Engineer') AS desiredJob,

  /* SKILLS -> JSON array 3..6 phần tử; dùng FOR XML để nối */
  (
    SELECT N'[' + STUFF((
      SELECT N',' + QUOTENAME(s, '"')
      FROM (
        SELECT TOP (3 + (n % 4))  -- 3..6
               CHOOSE(((n+ord)%30)+1,
                 'Có khả năng học hỏi công nghệ mới nhanh chóng','JavaScript','TypeScript','Node.js','React','Vue','Angular','Java','Spring Boot','Python','Django',
                 'Flask','C#','.NET','SQL','PostgreSQL','MySQL','MongoDB','Redis','Docker','Kubernetes',
                 'AWS','GCP','Azure','Git','HTML','CSS','Tailwind','Sass','REST','GraphQL','Kinh nghiệm optimize SEO cho web applications',
                  'Kinh nghiệm làm việc với Agile/Scrum'
               ) AS s,
               ord
        FROM (VALUES(1),(2),(3),(4),(5),(6),(7),(8)) AS t(ord)
        ORDER BY ord
      ) AS x
      FOR XML PATH(''), TYPE
    ).value('.', 'nvarchar(max)'), 1, 1, '') + N']'
  ) AS skills,

  -- Kinh nghiệm 0..10 năm phân bố đều
  (n % 11) AS yearsExperience,

  -- Cấp bậc 5 mức, CHOOSE với (n%5)+1 để không ra NULL
  CHOOSE( (n%5)+1,
          N'Internship',
          N'Junior',
          N'Mid-level',
          N'Senior',
          N'Team Lead') AS currentLevel,

  CONCAT(N'Ứng viên có động lực cao. Hồ sơ số ', n, N'.') AS [about],

  -- Xoay vòng tỉnh
  (SELECT province FROM #Province WHERE rn = ((n-1) % @ProvCount) + 1) AS [location],

  -- Lương kỳ vọng 8tr..50tr
  CONCAT(8 + (n % 43), '000000') AS expectedSalary
FROM N;

-- Ghi Users mới (bỏ qua email đã tồn tại)
IF OBJECT_ID('tempdb..#NewUsers') IS NOT NULL DROP TABLE #NewUsers;
CREATE TABLE #NewUsers(
  id INT NOT NULL,
  email NVARCHAR(255) NOT NULL
);

INSERT INTO [Users] (roleId, email, [password], typeAccount, createAt)
OUTPUT INSERTED.id, INSERTED.email INTO #NewUsers(id, email)
SELECT
  @CandidateRoleId,
  s.email,
  N'Pass1@',
  N'LOCAL',
  SWITCHOFFSET(SYSDATETIMEOFFSET(), '+07:00')
FROM @Seed s
WHERE NOT EXISTS (SELECT 1 FROM [Users] u WHERE u.email = s.email);

-- Ghi Personal_User tương ứng user vừa tạo; không đụng bản ghi đã có
INSERT INTO [Personal_User] (
  userId, googleId, [name], phone, email,
  avatarId, avatarUrl, desiredJob, skills, expectedSalary,
  yearsExperience, currentLevel, [about], [location]
)
SELECT
  u.id,
  NULL,
  s.[name],
  s.phone,
  s.email,
  NULL, NULL,
  s.desiredJob,
  s.skills,               -- JSON string, phù hợp getter/setter hiện tại
  s.expectedSalary,
  s.yearsExperience,
  s.currentLevel,
  s.[about],
  s.[location]
FROM #NewUsers u
JOIN @Seed s ON s.email = u.email
WHERE NOT EXISTS (
  SELECT 1 FROM [Personal_User] p WHERE p.userId = u.id
);

COMMIT TRAN;
PRINT N'Done: inserted Users + Personal_User cho những email chưa tồn tại.';
