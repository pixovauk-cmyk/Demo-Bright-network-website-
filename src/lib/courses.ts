import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface Module {
  title: string;
  slug: string;
  duration: string;
  videoUrl: string;
  description: string;
  resources: string[];
}

export interface Course {
  slug: string;
  title: string;
  level: string;
  sector: string;
  duration: string;
  tagline: string;
  description: string;
  heroImage: string;
  featured: boolean;
  whatYouLearn: string[];
  employerBenefits: string[];
  modules: Module[];
}

const contentDir = path.join(process.cwd(), "content/courses");

export function getAllCourses(): Course[] {
  try {
    const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".yaml"));
    return files.map((file) => {
      const slug = file.replace(".yaml", "");
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const data = yaml.load(raw) as Omit<Course, "slug">;
      return { ...data, slug };
    });
  } catch {
    return [];
  }
}

export function getCourseBySlug(slug: string): Course | null {
  try {
    const filePath = path.join(contentDir, `${slug}.yaml`);
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = yaml.load(raw) as Omit<Course, "slug">;
    return { ...data, slug };
  } catch {
    return null;
  }
}

export interface Testimonial {
  slug: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  result: string;
}

const testimonialsDir = path.join(process.cwd(), "content/testimonials");

export function getAllTestimonials(): Testimonial[] {
  try {
    const files = fs.readdirSync(testimonialsDir).filter((f) => f.endsWith(".yaml"));
    return files.map((file) => {
      const slug = file.replace(".yaml", "");
      const raw = fs.readFileSync(path.join(testimonialsDir, file), "utf-8");
      const data = yaml.load(raw) as Omit<Testimonial, "slug">;
      return { ...data, slug };
    });
  } catch {
    return [];
  }
}
