USE [QuanLySinhVienDB];
GO

IF OBJECT_ID(N'dbo.SinhVien', N'U') IS NULL
BEGIN
    THROW 50002, 'dbo.SinhVien does not exist. Run sql/01-quan-ly-sinh-vien.sql first.', 1;
END;
GO

INSERT INTO dbo.SinhVien (maSV, hoTen, email, maLop)
SELECT seed.maSV, seed.hoTen, seed.email, seed.maLop
FROM (VALUES
    ('SV001', N'Minh Nhật', N'minhnhat@example.com', N'25CT114'),
    ('SV002', N'Lan Anh', N'lananh@example.com', N'25CT114')
) AS seed (maSV, hoTen, email, maLop)
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.SinhVien AS existing
    WHERE existing.maSV = seed.maSV
);
GO

SELECT maSV, hoTen, email, maLop
FROM dbo.SinhVien
ORDER BY maSV;
GO
