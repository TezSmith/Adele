/* @name InsertMessage */
/* @param content: string */
/* @param senderId: string */
INSERT INTO messages (content, sender_id)
VALUES (:content!, :senderId!)
RETURNING *;

/* @name GetRecentMessages */
/* @param limit: number */
SELECT * FROM messages
ORDER BY created_at DESC
LIMIT :limit!;

/* @name GetMessagesBySender */
/* @param senderId: string */
SELECT * FROM messages
WHERE sender_id = :senderId!
ORDER BY created_at DESC;
