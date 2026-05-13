-- AUTO-APPROVE: change defaults so new submissions are immediately visible
ALTER TABLE media_uploads    ALTER COLUMN approved SET DEFAULT true;
ALTER TABLE memories         ALTER COLUMN approved SET DEFAULT true;
ALTER TABLE slideshow_photos ALTER COLUMN approved SET DEFAULT true;

-- REVERT (run this when returning to manual approval):
-- ALTER TABLE media_uploads    ALTER COLUMN approved SET DEFAULT false;
-- ALTER TABLE memories         ALTER COLUMN approved SET DEFAULT false;
-- ALTER TABLE slideshow_photos ALTER COLUMN approved SET DEFAULT false;
