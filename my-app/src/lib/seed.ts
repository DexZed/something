import { env } from "../env";
import { User } from "../interfaces/typeDefs";
import { db } from "../prisma/db";
import { prisma } from "./prisma";
import { faker } from "@faker-js/faker";



async function cleanDatabase() {
  await Promise.all([
    db.orm.public.User.where({ role: "customer" }).deleteAll(),
    db.orm.public.User.where({ role: "technician" }).deleteAll()
  ]);

}

async function main() {
  const runtime = await db.connect({ url: env.DATABASE_URL! });

  // clean tables
  await cleanDatabase();

  await Promise.all([createUser()]);
  let user: User[] = await db.orm.public.User.select("id", "name", "email", "password_hash", "role").all() satisfies User[];
  console.log("Users created:", user);

  await runtime.close();

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function createUser() {
  let user = Array(10)
    .fill(null)
    .map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
      role: Math.random() > 0.5 ? "customer" : "technician",

    }));
  const users = await db.orm.public.User.select("id", "email").createAll(user);
  return users;
}




