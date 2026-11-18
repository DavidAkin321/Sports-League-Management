import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient()

async function main() {
    //Hash password for all seed users
    const hashedPassword = await bcrypt.hash("password123", 10);

    //Create Users
    const admin = await prisma.user.create({
        data: {
            name: "David Clerk",
            email: "admin@watefordleague.ie",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    const coachOne = await prisma.user.create({
        data: {
            name: "John Murphy",
            email: "john@lisduggan.ie",
            password: hashedPassword,
            role: "COACH",
        },
    });

    const coachTwo = await prisma.user.create({
        data: {
            name: "Sarah Power",
            email: "sarah@graceduie.ie",
            password: hashedPassword,
            role: "COACH",
        },
    });

    //Teams
    const teams = [
    {
        name: "Lisduggan Athletic",
        city: "Waterford",
        logo: "...",
        createdBy: coachTwo.id
    },

    {
        name: "Hennesy's Road United",
        city: "Waterford",
        logo: "...",
        createdBy:coachOne.id
    },

     {
        name: "Dunmore Road Athletic",
        city: "Waterford",
        logo: "...",
        createdBy:coachTwo.id
    },

     {
        name: "Ballybeg Fc",
        city: "Waterford",
        logo: "...",
        createdBy:coachOne.id
    },

     {
        name: "Graceduie Fc",
        city: "Waterford",
        logo: "...",
        createdBy:coachTwo.id
    },

     {
        name: "Ballybricken United",
        city: "Waterford",
        logo: "...",
        createdBy:coachOne.id
    },

]

//Insert Teams
await prisma.teams.createMany({
    data:teams,
});

//League
await prisma.league.create({
    data: {
        name: "Waterford Estates League",
        season: "2026",
        createdBy: admin.id,
    },
})
console.log("Database sucessfully seeded");

}

main()
    .catch((err) => {
        console.error(err);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });

