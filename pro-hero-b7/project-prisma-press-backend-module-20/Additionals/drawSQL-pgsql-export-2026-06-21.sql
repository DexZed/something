CREATE TABLE "posts"(
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT NULL,
    "isFeatured" BOOLEAN NOT NULL,
    "status" VARCHAR(255) CHECK
        ("status" IN('')) NOT NULL,
        "tags" TEXT[] NOT NULL,
        "views" INTEGER NOT NULL,
        "authorId" UUID NOT NULL,
        "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "posts" ADD PRIMARY KEY("id");
CREATE TABLE "users"(
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "activeStatus" VARCHAR(255) CHECK
        ("activeStatus" IN('')) NOT NULL,
        "role" VARCHAR(255)
    CHECK
        ("role" IN('AUTHOR', 'USER', 'ADMIN')) NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
CREATE TABLE "profile"(
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "profilePhoto" TEXT NULL,
    "bio" TEXT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "profile" ADD PRIMARY KEY("id");
ALTER TABLE
    "profile" ADD CONSTRAINT "profile_userid_unique" UNIQUE("userId");
CREATE TABLE "comments"(
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "status" VARCHAR(255) CHECK
        ("status" IN('')) NOT NULL,
        "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "comments" ADD PRIMARY KEY("id");
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_authorid_foreign" FOREIGN KEY("authorId") REFERENCES "users"("id");
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_postid_foreign" FOREIGN KEY("postId") REFERENCES "posts"("id");
ALTER TABLE
    "profile" ADD CONSTRAINT "profile_userid_foreign" FOREIGN KEY("userId") REFERENCES "users"("id");
ALTER TABLE
    "posts" ADD CONSTRAINT "posts_authorid_foreign" FOREIGN KEY("authorId") REFERENCES "users"("id");