import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { getAllCourses, getAllTestimonials } from "@/lib/courses";
import HomePageClient from "./HomePageClient";

export default async function Home() {
  const raw = fs.readFileSync(path.join(process.cwd(), "content/home.yaml"), "utf-8");
  const homeData = yaml.load(raw) as Record<string, string>;

  const courses = getAllCourses();
  const testimonials = getAllTestimonials();
  const featured = courses.filter((c) => c.featured).slice(0, 3);

  return (
    <HomePageClient
      query=""
      variables={{ relativePath: "home.yaml" }}
      data={{ home: homeData }}
      featured={featured}
      testimonials={testimonials}
    />
  );
}
