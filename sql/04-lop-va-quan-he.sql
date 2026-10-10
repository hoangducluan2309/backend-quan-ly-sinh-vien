USE [QuanLySinhVienDB];
GO

IF OBJECT_ID(N'dbo.SinhVien', N'U') IS NULL
BEGIN
    THROW 50010, 'dbo.SinhVien does not exist. Run sql/01-quan-ly-sinh-vien.sql first.', 1;
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.SinhVien')
      AND name = N'maLop'
      AND system_type_id = TYPE_ID(N'nvarchar')
      AND max_length = 100
      AND is_nullable = 0
)
BEGIN
    THROW 50017, 'dbo.SinhVien.maLop must be NVARCHAR(50) NOT NULL before adding the class relationship.', 1;
END;

IF OBJECT_ID(N'dbo.Lop', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Lop
    (
        maLop NVARCHAR(50) NOT NULL,
        tenLop NVARCHAR(150) NOT NULL,
        CONSTRAINT PK_Lop PRIMARY KEY (maLop)
    );
END
ELSE IF (SELECT COUNT(*) FROM sys.columns
         WHERE object_id = OBJECT_ID(N'dbo.Lop')) <> 2
     OR NOT EXISTS (
         SELECT 1 FROM sys.columns
         WHERE object_id = OBJECT_ID(N'dbo.Lop')
           AND name = N'maLop'
           AND system_type_id = TYPE_ID(N'nvarchar')
           AND max_length = 100
           AND is_nullable = 0
     )
     OR NOT EXISTS (
         SELECT 1 FROM sys.columns
         WHERE object_id = OBJECT_ID(N'dbo.Lop')
           AND name = N'tenLop'
           AND system_type_id = TYPE_ID(N'nvarchar')
           AND max_length = 300
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
         WHERE kc.parent_object_id = OBJECT_ID(N'dbo.Lop')
           AND kc.type = N'PK'
         GROUP BY kc.name
         HAVING COUNT(*) = 1 AND MAX(c.name) = N'maLop'
     )
BEGIN
    THROW 50011, 'dbo.Lop already exists but its schema does not match the expected schema. No changes were made.', 1;
END;
GO

INSERT INTO dbo.Lop (maLop, tenLop)
SELECT DISTINCT sv.maLop, sv.maLop
FROM dbo.SinhVien AS sv
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Lop AS l
    WHERE l.maLop = sv.maLop
);
GO

IF EXISTS (
    SELECT 1
    FROM dbo.SinhVien AS sv
    LEFT JOIN dbo.Lop AS l ON l.maLop = sv.maLop
    WHERE l.maLop IS NULL
)
BEGIN
    THROW 50012, 'SinhVien contains maLop values without a matching Lop row; the foreign key was not added.', 1;
END;

DECLARE @ForeignKeyName sysname;
DECLARE @DeleteAction tinyint;
DECLARE @UpdateAction tinyint;
DECLARE @IsDisabled bit;
DECLARE @IsNotTrusted bit;

SELECT
    @ForeignKeyName = fk.name,
    @DeleteAction = fk.delete_referential_action,
    @UpdateAction = fk.update_referential_action,
    @IsDisabled = fk.is_disabled,
    @IsNotTrusted = fk.is_not_trusted
FROM sys.foreign_keys AS fk
WHERE fk.parent_object_id = OBJECT_ID(N'dbo.SinhVien')
  AND fk.referenced_object_id = OBJECT_ID(N'dbo.Lop')
  AND (
      SELECT COUNT(*)
      FROM sys.foreign_key_columns AS fkc
      WHERE fkc.constraint_object_id = fk.object_id
  ) = 1
  AND EXISTS (
      SELECT 1
      FROM sys.foreign_key_columns AS fkc
      INNER JOIN sys.columns AS parentColumn
          ON parentColumn.object_id = fkc.parent_object_id
         AND parentColumn.column_id = fkc.parent_column_id
      INNER JOIN sys.columns AS referencedColumn
          ON referencedColumn.object_id = fkc.referenced_object_id
         AND referencedColumn.column_id = fkc.referenced_column_id
      WHERE fkc.constraint_object_id = fk.object_id
        AND parentColumn.name = N'maLop'
        AND referencedColumn.name = N'maLop'
  );

IF @ForeignKeyName IS NULL
BEGIN
    IF OBJECT_ID(N'dbo.FK_SinhVien_Lop_maLop', N'F') IS NOT NULL
    BEGIN
        THROW 50013, 'Constraint name dbo.FK_SinhVien_Lop_maLop is already used by another foreign key.', 1;
    END;

    ALTER TABLE dbo.SinhVien WITH CHECK
    ADD CONSTRAINT FK_SinhVien_Lop_maLop
        FOREIGN KEY (maLop)
        REFERENCES dbo.Lop (maLop)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
END
ELSE
BEGIN
    IF @DeleteAction <> 0 OR @UpdateAction <> 0
    BEGIN
        THROW 50014, 'The existing SinhVien.maLop foreign key uses cascading actions. Inspect it before continuing; it was not changed.', 1;
    END;

    IF @IsDisabled = 1 OR @IsNotTrusted = 1
    BEGIN
        DECLARE @CheckConstraintSql nvarchar(500) =
            N'ALTER TABLE dbo.SinhVien WITH CHECK CHECK CONSTRAINT '
            + QUOTENAME(@ForeignKeyName)
            + N';';
        EXEC sys.sp_executesql @CheckConstraintSql;
    END;
END;
GO

SELECT maLop, tenLop
FROM dbo.Lop
ORDER BY maLop;
GO
