import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/courses";
import CoursePageClient from "./CoursePageClient";

const courseQuery = `
  fragment CourseParts on Course {
    __typename
    title
    level
    sector
    duration
    tagline
    description
    heroImage
    featured
    whatYouLearn
    employerBenefits
    modules {
      __typename
      title
      slug
      duration
      videoUrl
      description
      resources
    }
  }
  query course($relativePath: String!) {
    course(relativePath: $relativePath) {
      ... on Document {
        _sys { filename basename path relativePath extension }
        id
      }
      ...CourseParts
    }
  }
`;

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

  const allCourses = getAllCourses();
  const related = allCourses.filter((c) => c.slug !== slug).slice(0, 3);

  return (
    <CoursePageClient
      query={courseQuery}
      variables={{ relativePath: `${slug}.yaml` }}
      data={{ course }}
      slug={slug}
      related={related}
    />
  );
}
