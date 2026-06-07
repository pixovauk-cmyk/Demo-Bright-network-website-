import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { getAllCourses, getAllTestimonials } from "@/lib/courses";
import HomePageClient from "./HomePageClient";

const homeQuery = `
  fragment HomeParts on Home {
    __typename
    announcementText
    heroHeadline
    heroSubtext
    heroTrustLine1
    heroTrustLine2
    heroTrustLine3
    ctaHeadline
    ctaSubtext
    ctaPhone
    ctaEmail
  }
  query home($relativePath: String!) {
    home(relativePath: $relativePath) {
      ... on Document {
        _sys { filename basename path relativePath extension }
        id
      }
      ...HomeParts
    }
  }
`;

export default async function Home() {
  const raw = fs.readFileSync(path.join(process.cwd(), "content/home.yaml"), "utf-8");
  const homeData = yaml.load(raw) as Record<string, unknown>;

  const courses = getAllCourses();
  const testimonials = getAllTestimonials();
  const featured = courses.filter((c) => c.featured).slice(0, 3);

  return (
    <HomePageClient
      query={homeQuery}
      variables={{ relativePath: "home.yaml" }}
      data={{ home: homeData }}
      featured={featured}
      testimonials={testimonials}
    />
  );
}
