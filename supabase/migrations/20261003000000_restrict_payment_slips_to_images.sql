-- Enforce the same payment-slip rules at the storage boundary as the UI.
update storage.buckets
set file_size_limit = 2097152,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'payment-slips';
