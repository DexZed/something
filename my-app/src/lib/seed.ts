import { User } from "../interfaces/typeDefs";
import { prisma } from "./prisma";
import { faker } from "@faker-js/faker";



async function cleanDatabase() {
  await Promise.all([
    prisma.user.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.category.deleteMany(),
    prisma.payments.deleteMany(),
    prisma.review.deleteMany(),
    prisma.service.deleteMany(),
    prisma.technician.deleteMany(),
    prisma.technicianService.deleteMany(),
  ]);
}

async function main() {
  // clean tables
  await cleanDatabase();

  await Promise.all([createUser()]);
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
    .map(() => {
      return prisma.user.createManyAndReturn({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password_hash: faker.internet.password(),
          role: Math.random() > 0.5 ? "CUSTOMER" : "TECHNICIAN",
        },
      });
    });
  return await Promise.all(user);
}


let user: User[] = await prisma.user.findMany() satisfies User[];

console.log("Users created:", user);