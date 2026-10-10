USE [master];
GO

IF DB_ID(N'QuanLySinhVienDB') IS NULL
BEGIN
    THROW 50003, 'QuanLySinhVienDB does not exist. Run sql/01-quan-ly-sinh-vien.sql first.', 1;
END;

IF SUSER_ID(N'sv_app') IS NULL
BEGIN
    DECLARE @AppPassword nvarchar(128) = N'<REPLACE_WITH_LOCAL_STRONG_PASSWORD>';

    IF @AppPassword = N'<REPLACE_WITH_LOCAL_STRONG_PASSWORD>'
    BEGIN
        THROW 50004, 'Replace the password placeholder in this script before running it.', 1;
    END;

    EXEC (
        N'CREATE LOGIN [sv_app] WITH PASSWORD = '
        + QUOTENAME(@AppPassword, '''')
        + N', CHECK_POLICY = ON;'
    );
END
ELSE IF NOT EXISTS (
    SELECT 1
    FROM sys.server_principals
    WHERE name = N'sv_app'
      AND type = 'S'
      AND is_disabled = 0
)
BEGIN
    THROW 50005, 'A disabled or non-SQL sv_app server principal already exists. Inspect and resolve it before continuing; this script will not alter or remove it.', 1;
END
ELSE
BEGIN
    PRINT 'SQL login sv_app already exists and is enabled; reusing it without changing its password.';
END;
GO

USE [QuanLySinhVienDB];
GO

IF OBJECT_ID(N'dbo.SinhVien', N'U') IS NULL
BEGIN
    THROW 50006, 'dbo.SinhVien does not exist. Run sql/01-quan-ly-sinh-vien.sql first.', 1;
END;

IF SUSER_ID(N'sv_app') IS NULL
BEGIN
    THROW 50007, 'SQL login sv_app does not exist. Run the master section of this script first.', 1;
END;

IF DATABASE_PRINCIPAL_ID(N'sv_app') IS NULL
BEGIN
    CREATE USER [sv_app] FOR LOGIN [sv_app];
END
ELSE IF EXISTS (
    SELECT 1
    FROM sys.database_principals
    WHERE name = N'sv_app'
      AND (sid IS NULL OR sid <> SUSER_SID(N'sv_app'))
)
BEGIN
    THROW 50008, 'Database user sv_app is not mapped to the sv_app login. Inspect the existing user before continuing; this script will not alter or remove it.', 1;
END;
GO

GRANT SELECT, INSERT ON OBJECT::dbo.SinhVien TO [sv_app];
GO
