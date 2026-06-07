import client from "../../tina/__generated__/client";
import { getAllCourses, getAllTestimonials } from "@/lib/courses";
import HomePageClient from "./HomePageClient";

export default async function Home() {
  const tinaHome = await client.queries.home({ relativePath: "home.yaml" });
  const courses = getAllCourses();
  const testimonials = getAllTestimonials();
  const featured = courses.filter((c) => c.featured).slice(0, 3);

  return (
    <HomePageClient
      query={tinaHome.query}
      variables={tinaHome.variables}
      data={tinaHome.data}
      featured={featured}
      testimonials={testimonials}
    />
  );
}
