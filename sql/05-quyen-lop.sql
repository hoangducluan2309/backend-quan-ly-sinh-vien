USE [QuanLySinhVienDB];
GO

IF OBJECT_ID(N'dbo.Lop', N'U') IS NULL
BEGIN
    THROW 50015, 'dbo.Lop does not exist. Run sql/04-lop-va-quan-he.sql first.', 1;
END;

IF DATABASE_PRINCIPAL_ID(N'sv_app') IS NULL
BEGIN
    THROW 50016, 'Database user sv_app does not exist. Run sql/03-app-login.sql first.', 1;
END;
GO

GRANT SELECT ON OBJECT::dbo.Lop TO [sv_app];
GO
