var schema = [
`CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"gender"	TEXT NOT NULL,
	"birthday"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);`,
`CREATE TABLE IF NOT EXISTS "boards" (
	"id"	INTEGER NOT NULL,
	"boardName"	TEXT NOT NULL,
	"description"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);`,
`CREATE TABLE IF NOT EXISTS "topics" (
	"id"	INTEGER NOT NULL,
	"threadName"	TEXT NOT NULL,
	"boardId"	INTEGER NOT NULL,
	"createdDate"	INTEGER NOT NULL,
	"userId"	INTEGER NOT NULL,
	"firstPost"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);`,
`CREATE TABLE IF NOT EXISTS "posts" (
	"id"	INTEGER NOT NULL,
	"topicId"	INTEGER NOT NULL,
	"text"	TEXT NOT NULL,
	"userId"	INTEGER NOT NULL,
	"postDate"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);`,
`CREATE TABLE IF NOT EXISTS "sessions" (
	"id"	TEXT,
	"userId"	INTEGER,
	"expiresOn"	INTEGER,
	"startedOn"	INTEGER,
	PRIMARY KEY("id")
);`

]

export default schema