IF DB_ID(N'QuanLySinhVienDB') IS NULL
BEGIN
    EXEC(N'CREATE DATABASE [QuanLySinhVienDB]');
END;
GO

USE [QuanLySinhVienDB];
GO

IF OBJECT_ID(N'dbo.SinhVien', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.SinhVien
    (
        maSV VARCHAR(5) NOT NULL,
        hoTen NVARCHAR(150) NOT NULL,
        email NVARCHAR(254) NOT NULL,
        maLop NVARCHAR(50) NOT NULL,
        CONSTRAINT PK_SinhVien PRIMARY KEY (maSV)
    );
END
ELSE
BEGIN
    IF (SELECT COUNT(*) FROM sys.columns
        WHERE object_id = OBJECT_ID(N'dbo.SinhVien')) <> 4
       OR NOT EXISTS (
            SELECT 1 FROM sys.columns
            WHERE object_id = OBJECT_ID(N'dbo.SinhVien')
              AND name = N'maSV'
              AND system_type_id = TYPE_ID(N'varchar')
              AND max_length = 5
              AND is_nullable = 0
       )
       OR NOT EXISTS (
            SELECT 1 FROM sys.columns
            WHERE object_id = OBJECT_ID(N'dbo.SinhVien')
              AND name = N'hoTen'
              AND system_type_id = TYPE_ID(N'nvarchar')
              AND max_length = 300
              AND is_nullable = 0
       )
       OR NOT EXISTS (
            SELECT 1 FROM sys.columns
            WHERE object_id = OBJECT_ID(N'dbo.SinhVien')
              AND name = N'email'
              AND system_type_id = TYPE_ID(N'nvarchar')
              AND max_length = 508
              AND is_nullable = 0
       )
       OR NOT EXISTS (
            SELECT 1 FROM sys.columns
            WHERE object_id = OBJECT_ID(N'dbo.SinhVien')
              AND name = N'maLop'
              AND system_type_id = TYPE_ID(N'nvarchar')
              AND max_length = 100
              AND is_nullable = 0
       )
       OR NOT EXISTS (
            SELECT 1
            FROM sys.key_constraints AS kc
            INNER JOIN sys.index_columns AS ic
                ON ic.object_id = kc.parent_object_id
               AND ic.index_id = kc.unique_index_id
            INNER JOIN sys.columns AS c
                ON c.object_id = ic.object_id
               AND c.column_id = ic.column_id
            WHERE kc.parent_object_id = OBJECT_ID(N'dbo.SinhVien')
              AND kc.type = N'PK'
            GROUP BY kc.name
            HAVING COUNT(*) = 1 AND MAX(c.name) = N'maSV'
       )
       OR EXISTS (
            SELECT 1
            FROM sys.indexes AS i
            INNER JOIN sys.index_columns AS ic
                ON ic.object_id = i.object_id
               AND ic.index_id = i.index_id
            INNER JOIN sys.columns AS c
                ON c.object_id = ic.object_id
               AND c.column_id = ic.column_id
            WHERE i.object_id = OBJECT_ID(N'dbo.SinhVien')
              AND i.is_unique = 1
              AND i.is_primary_key = 0
              AND c.name = N'email'
       )
    BEGIN
        THROW 50001, 'dbo.SinhVien already exists but its schema does not match the expected schema. No changes were made.', 1;
    END;
END;
GO
