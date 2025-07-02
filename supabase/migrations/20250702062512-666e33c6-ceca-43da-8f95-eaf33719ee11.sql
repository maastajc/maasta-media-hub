
-- Add missing values to the project_type enum
ALTER TYPE project_type ADD VALUE IF NOT EXISTS 'theater';
ALTER TYPE project_type ADD VALUE IF NOT EXISTS 'commercial'; 
ALTER TYPE project_type ADD VALUE IF NOT EXISTS 'documentary';
ALTER TYPE project_type ADD VALUE IF NOT EXISTS 'tv_show';
