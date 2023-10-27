INSERT INTO
    "user" (
        address,
        name,
        phone,
        birthday,
        email,
        ssn,
        sex,
        role
    )
VALUES
    (
        'hcm',
        'hao',
        '0912967100',
        '2023-10-19 00:00:00',
        'hao@gmail.com',
        '0123123123',
        'male',
        'admin'
    );

WITH new_post AS (
  INSERT INTO "post" (content, user_id)
  VALUES ('This is an example post.', 1)
  RETURNING id
)
-- Generate comments related to the new post
INSERT INTO "post" (content, user_id, parent_post_id)
SELECT 'This is the first comment.', 1, id FROM new_post
UNION ALL
SELECT 'This is the second comment.', 1, id FROM new_post
UNION ALL
SELECT 'This is the third comment.', 1, id FROM new_post;