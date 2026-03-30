/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function generateSlug(title: string):string{
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

async function main(){
    const users  = Array.from ({length: 10}).map(()=>({
        name:faker.person.fullName(),
        email:faker.internet.email(),
        bio: faker.lorem.sentence(),
        avatar: faker.image.avatarGitHub()
    }))

    await prisma.user.createMany({
        data: users
    })

    const posts = Array.from({length: 40}).map(()=>({
        title: faker.lorem.sentence(),
        slug: generateSlug(faker.lorem.sentence()),
        content: faker.lorem.paragraphs(),
        thumbnail: faker.image.avatar(),
        authorId: faker.number.int({min:1, max:10})

    }))

    await Promise.all(
    posts.map(async(post)=> await prisma.post.create({
        data: {
            ...post,
            comments:{
                createMany:{
                    data: Array.from({length:20}).map(()=>({
                        content: faker.lorem.sentence(),
                        authorId: faker.number.int({min:1, max:10})
                    }))
                }
            }
        }
    }))
    )

    console.log("Seeding completed")
}

main().then(()=>{
    prisma.$disconnect()
    process.exit(0)
}).catch((error)=>{
    console.error("Error seeding data:", error)
    prisma.$disconnect()
    process.exit(1)
})

