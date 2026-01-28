import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const locations = [
    { name: "Aleppo", region: "Mount Simeon District" },
    { name: "Aleppo", region: "Al-Bab District" },
    { name: "Aleppo", region: "Afrin District" },
    { name: "Aleppo", region: "Azaz District" },
    { name: "Aleppo", region: "Manbij District" },
    { name: "Aleppo", region: "Kobani District" },
    { name: "Aleppo", region: "As-Safira District" },
    { name: "Aleppo", region: "Jarabulus District" },
    { name: "Aleppo", region: "Atarib District" },
    { name: "Aleppo", region: "Deir Hafer District" },

    { name: "Damascus", region: "Damascus" },
    { name: "Damascus", region: "Al-Midan" },
    { name: "Damascus", region: "Al-Qadam" },
    { name: "Damascus", region: "Al-Qassa'a" },
    { name: "Damascus", region: "Al-Mazzah" },
    { name: "Damascus", region: "Kafr Souseh" },

    { name: "Rif Dimashq", region: "Douma District" },
    { name: "Rif Dimashq", region: "Rif Dimashq District" },
    { name: "Rif Dimashq", region: "Darayya District" },
    { name: "Rif Dimashq", region: "Al-Tall District" },
    { name: "Rif Dimashq", region: "Yabroud District" },
    { name: "Rif Dimashq", region: "Al-Zabadani District" },
    { name: "Rif Dimashq", region: "An-Nabk District" },
    { name: "Rif Dimashq", region: "Qudsaya District" },
    { name: "Rif Dimashq", region: "Al-Qutayfah District" },
    { name: "Rif Dimashq", region: "Qatana District" },

    { name: "Homs", region: "Homs District" },
    { name: "Homs", region: "Al-Rastan District" },
    { name: "Homs", region: "Palmyra District" },
    { name: "Homs", region: "Al-Mukharram District" },
    { name: "Homs", region: "Al-Qusayr District" },
    { name: "Homs", region: "Talkalakh District" },

    { name: "Hama", region: "Hama District" },
    { name: "Hama", region: "Masyaf District" },
    { name: "Hama", region: "Al-Suqaylabiyah District" },
    { name: "Hama", region: "Mahardah District" },
    { name: "Hama", region: "Salamiyah District" },

    { name: "Latakia", region: "Latakia District" },
    { name: "Latakia", region: "Jableh District" },
    { name: "Latakia", region: "Al-Qardaha District" },
    { name: "Latakia", region: "Al-Haffah District" },
    { name: "Latakia", region: "Slunfeh District" },

    { name: "Tartus", region: "Tartus District" },
    { name: "Tartus", region: "Baniyas District" },
    { name: "Tartus", region: "Sheikh Badr District" },
    { name: "Tartus", region: "Dreikish District" },
    { name: "Tartus", region: "Safita District" },

    { name: "Idlib", region: "Idlib District" },
    { name: "Idlib", region: "Ariha District" },
    { name: "Idlib", region: "Maarrat al-Numan District" },
    { name: "Idlib", region: "Harem District" },
    { name: "Idlib", region: "Jisr al-Shughur District" },

    { name: "Al-Hasakah", region: "Al-Hasakah District" },
    { name: "Al-Hasakah", region: "Qamishli District" },
    { name: "Al-Hasakah", region: "Al-Malikiyah District" },
    { name: "Al-Hasakah", region: "Ras al-Ayn District" },
    { name: "Al-Hasakah", region: "Amuda District" },

    { name: "Deir ez-Zor", region: "Deir ez-Zor District" },
    { name: "Deir ez-Zor", region: "Al-Mayadin District" },
    { name: "Deir ez-Zor", region: "Al-Bukamal District" },

    { name: "Raqqa", region: "Raqqa District" },
    { name: "Raqqa", region: "Al-Thawrah District" },
    { name: "Raqqa", region: "Tal Abyad District" },

    { name: "As-Suwayda", region: "As-Suwayda District" },
    { name: "As-Suwayda", region: "Salkhad District" },
    { name: "As-Suwayda", region: "Shahba District" },

    { name: "Daraa", region: "Daraa District" },
    { name: "Daraa", region: "Izra District" },
    { name: "Daraa", region: "Al-Sanamayn District" },
    { name: "Daraa", region: "Da'el District" },
    { name: "Daraa", region: "Sheikh Miskeen District" },

    { name: "Quneitra", region: "Quneitra District" },
    { name: "Quneitra", region: "Fiq District" },
  ];

  await prisma.location.createMany({
    data: locations,
    skipDuplicates: true,
  });

  console.log("🌍 Locations seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
