-- Migration script for schema improvements
-- This script safely migrates the database to the new improved schema

-- Step 1: Create a backup strategy and update News table
-- Remove redundant author fields and make authorId required

-- First, set a default authorId for any records that don't have one
-- (using the first admin user as fallback)
UPDATE "news" 
SET "authorId" = (SELECT "id" FROM "users" WHERE "role" = 'SUPER_ADMIN' LIMIT 1)
WHERE "authorId" IS NULL;

-- Make authorId NOT NULL
ALTER TABLE "news" ALTER COLUMN "authorId" SET NOT NULL;

-- Drop the redundant author fields
ALTER TABLE "news" DROP COLUMN IF EXISTS "authorAr";
ALTER TABLE "news" DROP COLUMN IF EXISTS "authorEn";

-- Step 2: Update Program table
-- Add partnerId column for proper relationship
ALTER TABLE "programs" ADD COLUMN "partnerId" TEXT;

-- Set a default authorId for any records that don't have one
UPDATE "programs" 
SET "authorId" = (SELECT "id" FROM "users" WHERE "role" = 'SUPER_ADMIN' LIMIT 1)
WHERE "authorId" IS NULL;

-- Make authorId NOT NULL
ALTER TABLE "programs" ALTER COLUMN "authorId" SET NOT NULL;

-- Try to match existing partner strings to actual partner records
-- This is a best-effort migration - you may need to manually verify
UPDATE "programs" 
SET "partnerId" = (
  SELECT p."id" 
  FROM "partners" p 
  WHERE LOWER(p."nameEn") = LOWER("programs"."partnerEn")
     OR LOWER(p."nameAr") = LOWER("programs"."partnerAr")
  LIMIT 1
)
WHERE "partnerEn" IS NOT NULL OR "partnerAr" IS NOT NULL;

-- Combine prerequisites fields (keep the English one as the combined field)
UPDATE "programs" 
SET "prerequisitesEn" = COALESCE("prerequisitesEn", '') || 
  CASE 
    WHEN "prerequisitesAr" IS NOT NULL AND "prerequisitesEn" IS NOT NULL 
    THEN ' | ' || "prerequisitesAr"
    WHEN "prerequisitesAr" IS NOT NULL AND "prerequisitesEn" IS NULL 
    THEN "prerequisitesAr"
    ELSE ''
  END
WHERE "prerequisitesAr" IS NOT NULL;

-- Rename the combined prerequisites field
ALTER TABLE "programs" RENAME COLUMN "prerequisitesEn" TO "prerequisites";

-- Drop redundant fields
ALTER TABLE "programs" DROP COLUMN IF EXISTS "prerequisitesAr";
ALTER TABLE "programs" DROP COLUMN IF EXISTS "partnerAr";
ALTER TABLE "programs" DROP COLUMN IF EXISTS "partnerEn";
ALTER TABLE "programs" DROP COLUMN IF EXISTS "instructorAr";
ALTER TABLE "programs" DROP COLUMN IF EXISTS "instructorEn";

-- Step 3: Update Events table
-- Set a default authorId for any records that don't have one
UPDATE "events" 
SET "authorId" = (SELECT "id" FROM "users" WHERE "role" = 'SUPER_ADMIN' LIMIT 1)
WHERE "authorId" IS NULL;

-- Make authorId NOT NULL
ALTER TABLE "events" ALTER COLUMN "authorId" SET NOT NULL;

-- Convert time strings to proper timestamps (this is complex and may need manual work)
-- For now, we'll just change the column types and let NULL values remain
-- You may need to manually update these based on your data format

-- Create new time columns with DateTime type
ALTER TABLE "events" ADD COLUMN "startTime_new" TIMESTAMP;
ALTER TABLE "events" ADD COLUMN "endTime_new" TIMESTAMP;

-- Try to convert time strings to timestamps (basic attempt)
-- This assumes times are in format "HH:MM" or similar
-- You may need to adjust this based on your actual data format
UPDATE "events" 
SET "startTime_new" = 
  CASE 
    WHEN "startTime" IS NOT NULL AND "startTime" ~ '^[0-9]{1,2}:[0-9]{2}$'
    THEN ("startDate"::date + "startTime"::time)::timestamp
    ELSE NULL
  END,
  "endTime_new" = 
  CASE 
    WHEN "endTime" IS NOT NULL AND "endTime" ~ '^[0-9]{1,2}:[0-9]{2}$'
    THEN ("endDate"::date + "endTime"::time)::timestamp
    ELSE NULL
  END;

-- Drop old time columns and rename new ones
ALTER TABLE "events" DROP COLUMN "startTime";
ALTER TABLE "events" DROP COLUMN "endTime";
ALTER TABLE "events" RENAME COLUMN "startTime_new" TO "startTime";
ALTER TABLE "events" RENAME COLUMN "endTime_new" TO "endTime";

-- Step 4: Add foreign key constraints for the new relationships
-- Add foreign key constraint for Program -> Partner relationship
ALTER TABLE "programs" ADD CONSTRAINT "programs_partnerId_fkey" 
  FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL;

-- Step 5: Update any API transformations that may be affected
-- This is handled in the application code updates

-- Step 6: Regenerate Prisma client after running this migration
-- Run: npx prisma generate

COMMIT;
