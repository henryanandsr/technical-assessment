import { PrismaClient } from "@prisma/client";
import { Amenity } from "@prisma/client";
import fetch from "node-fetch";
import axios from "axios";
// const fetch = require("node-fetch");
const prisma = new PrismaClient();

interface GeoNamesApiResponse {
  links: { rel: string; href: string }[];
  data: {
    id: number;
    wikiDataId: string;
    type: string;
    city: string;
    name: string;
    country: string;
    countryCode: string;
    region: string;
    regionCode: string;
    regionWdId: string;
    latitude: number;
    longitude: number;
    population: number;
    distance: any;
    placeType: string;
  }[];
  metadata: {
    currentOffset: number;
    totalCount: number;
  };
}

const generateRandomImage = async () => {
  try {
    const imageId = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/seed/${imageId}/800/600`;

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");

    return imageBuffer;
  } catch (error) {
    const response = await axios.get(
      "https://picsum.photos/seed/1234/800/600",
      { responseType: "arraybuffer" }
    );
    const imageBuffer = Buffer.from(response.data, "binary");
    return imageBuffer;
  }
};

const getRandomCityName = async () => {
  try {
    const totalCities = 28065;
    const randomOffset = Math.floor(Math.random() * totalCities);

    const response = await axios.get(
      `http://geodb-free-service.wirefreethought.com/v1/geo/cities`,
      {
        params: {
          offset: randomOffset,
          limit: 1,
        },
      }
    );

    const data = response.data as GeoNamesApiResponse;

    if (data.data && data.data.length > 0) {
      const { name, country, region, longitude, latitude } = data.data[0];
      return { name, country, region, longitude, latitude };
    }

    throw new Error("Unable to fetch city name from GeoNames API");
  } catch (error) {
    console.error("Error fetching city name:", error);
    return {
      name: "New York",
      country: "United States",
      region: "New York",
      longitude: 40.716534,
      latitude: -74.002537,
    };
  }
};
function getRandomAmenities() {
  const amenities = Object.values(Amenity);
  const shuffledAmenities = amenities.sort(() => 0.5 - Math.random());
  const selectedAmenities = shuffledAmenities.slice(
    0,
    Math.floor(Math.random() * amenities.length)
  );
  return selectedAmenities;
}

const seedData = async () => {
  try {
    for (let i = 1; i <= 100; i++) {
      const { name, country, region, longitude, latitude } =
        await getRandomCityName();
      const villa = await prisma.villa.create({
        data: {
          name: `Villa ${region}`,
          short_description: `Description of Villa ${i}`,
          description: `Description of Villa ${i}`,
          price: Math.floor(Math.random() * 500) + 100,
          longitude: longitude,
          latitude: latitude,
          address: `${region}, ${country}`,
          city: `${region}`,
          country: `${country}`,
          amenities: { set: getRandomAmenities() },
          images: {
            create: {
              data: (await generateRandomImage()) || Buffer.from(""),
            },
          },
        },
      });
      console.log(`Villa ${i} seeded successfully`);
    }

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedData();
