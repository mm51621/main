create table dodatki
(
    id integer not null
        constraint dodatki_pk
            primary key autoincrement,
    name text ,
    description text,
    created_at datetime default current_timestamp
);
