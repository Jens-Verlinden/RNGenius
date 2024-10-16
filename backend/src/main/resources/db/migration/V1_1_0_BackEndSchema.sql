-- DROP TABLE IF EXISTS greetings;

CREATE TABLE IF NOT EXISTS greetings
(
    id bigint NOT NULL,
    message character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT greetings_pkey PRIMARY KEY (id)
);

INSERT INTO greetings (id, message)
SELECT 1, 'Hello world!'
WHERE NOT EXISTS (SELECT 1 FROM greetings WHERE id = 1);