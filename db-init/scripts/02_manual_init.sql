-- Active: 1704521267223@@127.0.0.1@5435@educonnect
INSERT INTO
    "user" (
        address,
        name,
        avatar,
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
        'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/824.jpg',
        '0912967100',
        '2023-10-19 00:00:00',
        'hao@gmail.com',
        '0123123123',
        'male',
        'admin'
    );

-- Active: 1698073287420@@127.0.0.1@5435@educonnect
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
        'hung',
        '0852222222',
        '2023-10-19 00:00:00',
        'hung@gmail.com',
        '095202095746',
        'male',
        'user'
    );

INSERT INTO
    "account" (id, username, password)
VALUES
    (2, 'duyhung', 'duyhung');

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
        'abczzz',
        '0852222222',
        '2023-10-19 00:00:00',
        'abc@gmail.com',
        '0952254246',
        'male',
        'user'
    );

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
        'test2',
        '0852222222',
        '2023-10-19 00:00:00',
        'test2@gmail.com',
        '0562126746',
        'male',
        'user'
    );

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
        'test3',
        '0852222222',
        '2023-10-19 00:00:00',
        'test3@gmail.com',
        '05668495746',
        'male',
        'user'
    );

INSERT INTO
    "follow" (follower_id, followed_id)
VALUES
    (1, 2);

INSERT INTO
    "follow" (follower_id, followed_id)
VALUES
    (1, 3);

INSERT INTO
    "follow" (follower_id, followed_id)
VALUES
    (4, 1);

INSERT INTO
    "follow" (follower_id, followed_id)
VALUES
    (5, 1);

INSERT INTO
    "follow" (follower_id, followed_id)
VALUES
    (2, 1);

INSERT INTO
    "notification" (id, user_id, message)
VALUES
    (1, 1, 'Oh');

INSERT INTO
    "group" (title)
VALUES
    ('Example group');

INSERT INTO
    "group" (title)
VALUES
    ('Most famous group');

INSERT INTO
    "member" (user_id, group_id)
VALUES
    (1, 2);

INSERT INTO
    "member" (user_id, group_id)
VALUES
    (1, 1);

INSERT INTO
    "member" (user_id, group_id)
VALUES
    (3, 1);

INSERT INTO
    "member" (user_id, group_id)
VALUES
    (4, 1);

INSERT INTO
    "member" (user_id, group_id)
VALUES
    (5, 1);

INSERT INTO
    "group" (title)
VALUES
    ('Second famous group');

INSERT INTO
    "member" (user_id, group_id)
VALUES
    (4, 3);

INSERT INTO
    "member" (user_id, group_id)
VALUES
    (5, 3);

INSERT INTO
    "post" (content, user_id, parent_post_id, group_id)
VALUES
    ('Example group post', 2, null, 1);

WITH new_post AS (
    INSERT INTO
        "post" (content, user_id, create_at)
    VALUES
        (
            'This is an example post.',
            1,
            '2023-01-01 00:00:01'
        ) RETURNING id
) -- Generate comments related to the new post
INSERT INTO
    "post" (content, user_id, parent_post_id)
SELECT
    'This is the first comment.',
    1,
    id
FROM
    new_post
UNION
ALL
SELECT
    'This is the second comment.',
    1,
    id
FROM
    new_post
UNION
ALL
SELECT
    'This is the third comment.',
    1,
    id
FROM
    new_post;

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
        "post" (content, user_id)
    VALUES
        ('This is second example post', 1) RETURNING id
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

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('love' as "interact_type"), 1, 1);

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('love' as "interact_type"), 1, 2);