-- Active: 1704521267223@@127.0.0.1@5435@educonnect
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
    "notification" (user_id, message)
VALUES
    (1, 'Oh');

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('love' as "interact_type"), 1, 1);

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('love' as "interact_type"), 2, 1);

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('love' as "interact_type"), 2, 9);

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('love' as "interact_type"), 1, 9);

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('love' as "interact_type"), 3, 9);

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('love' as "interact_type"), 4, 9);

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('like' as "interact_type"), 5, 9);

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('like' as "interact_type"), 6, 9);

INSERT INTO
    interact ("type", user_id, post_id)
VALUES
    (CAST('wow' as "interact_type"), 7, 9);