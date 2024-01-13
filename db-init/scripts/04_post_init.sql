INSERT INTO
    "post" (content, user_id, parent_post_id, group_id)
VALUES
    ('Example group post', 2, null, 1);

INSERT INTO
    "post" (title, content, user_id, create_at)
VALUES
    (
        'Title of example post',
        'This is an example post.',
        1,
        '2023-01-01 00:00:01'
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the first comment.',
        1,
        2
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the first comment of first comment.',
        1,
        3
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the second comment of first comment.',
        2,
        3
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the third comment of first comment.',
        3,
        3
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the second comment.',
        1,
        2
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the third comment.',
        1,
        2
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
SELECT
    'This is subcomment 1',
    1,
    2
UNION
All
SELECT
    'This is subcomment 2',
    1,
    2
UNION
All
SELECT
    'This is subcomment 3',
    1,
    2;

WITH new_post AS (
    INSERT INTO
        "post" (title, content, user_id)
    VALUES
        (
            'Example 2: Post example',
            'This is second example post',
            1
        ) RETURNING id
)
INSERT INTO
    "post" (content, user_id, parent_post_id)
SELECT
    'This is first comment of second post',
    1,
    id
FROM
    new_post;

INSERT INTO
    "post" (content, user_id, parent_post_id)
SELECT
    'This is latest comment of first post',
    1,
    1;