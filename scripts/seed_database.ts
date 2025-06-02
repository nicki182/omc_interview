import prisma, { Face } from "@prisma_client";

import data from "./seed_data.json" assert { type: "json" };

async function main() {
  for (const sensor of data) {
    await prisma.sensor.upsert({
      where: { id: sensor.id },
      update: {},
      create: {
        id: sensor.id,
        face: sensor.face as Face,
      },
    });
  }

  console.log(`✅ Seeded ${data.length} sensors`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
