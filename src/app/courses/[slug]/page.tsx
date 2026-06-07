import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/courses";
import client from "../../../../tina/__generated__/client";
import CoursePageClient from "./CoursePageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: `${course.title} | BrightPeak Apprenticeships`,
    description: course.description,
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const tinaData = await client.queries.course({ relativePath: `${slug}.yaml` });
  const allCourses = getAllCourses();
  const related = allCourses.filter((c) => c.slug !== slug).slice(0, 3);

  return (
    <CoursePageClient
      query={tinaData.query}
      variables={tinaData.variables}
      data={tinaData.data}
      slug={slug}
      related={related}
    />
  );
}
