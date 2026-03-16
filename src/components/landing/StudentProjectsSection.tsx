import { Github, ExternalLink, Code2, Cpu, Globe, FlaskConical, Cog, Link2 } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { StaggerReveal } from "@/components/shared/StaggerReveal";
import { createClient } from "@supabase/supabase-js";

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof Code2; color: string }> = {
  web:        { label: "Web",        icon: Globe,        color: "badge-saffron" },
  iot:        { label: "IoT",        icon: Cpu,          color: "badge-idle" },
  ai_ml:      { label: "AI / ML",    icon: Code2,        color: "badge-idle" },
  blockchain: { label: "Blockchain", icon: Link2,        color: "badge-saffron" },
  mechanical: { label: "Mechanical", icon: Cog,          color: "badge-idle" },
  chemical:   { label: "Chemical",   icon: FlaskConical, color: "badge-idle" },
  robotics:   { label: "Robotics",   icon: Cpu,          color: "badge-idle" },
  mobile:     { label: "Mobile",     icon: Code2,        color: "badge-idle" },
  other:      { label: "Project",    icon: Code2,        color: "badge-idle" },
};

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  category: string;
  team_members: string[];
  achievement?: string;
  image_url?: string;
  github_url?: string;
  demo_url?: string;
}

export async function StudentProjectsSection() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: projects } = await supabase
    .from("student_projects")
    .select("*")
    .eq("is_featured", true)
    .eq("status", "approved")
    .limit(4);

  if (!projects?.length) return null;

  return (
    <section className="section bg-white border-y border-stone-200">
      <div className="container">
        <RevealOnScroll>
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="accent-rule" />
              <h2 className="font-display text-4xl text-stone-950">
                What our students build
              </h2>
              <p className="subtext mt-2">
                Real projects — published, patented, and competition-winning
              </p>
            </div>
          </div>
        </RevealOnScroll>

        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          stagger={70}
        >
          {projects.map((project: Project, i) => {
            const cat = CATEGORY_CONFIG[project.category] ?? CATEGORY_CONFIG.other;
            const CatIcon = cat.icon;

            return (
              <div
                key={project.id}
                className={`group card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                  i === 0 ? "md:row-span-2" : ""
                }`}
              >
                {/* Image */}
                {project.image_url && (
                  <div
                    className={`relative overflow-hidden ${
                      i === 0 ? "h-52" : "h-36"
                    }`}
                  >
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(12,10,9,0.7) 0%, transparent 60%)",
                      }}
                    />
                    {/* Category badge on image */}
                    <div className="absolute top-3 left-3">
                      <span className={`badge ${cat.color} flex items-center gap-1`}>
                        <CatIcon className="w-2.5 h-2.5" />
                        {cat.label}
                      </span>
                    </div>
                  </div>
                )}

                <div className={`p-5 ${i === 0 ? "p-6" : ""}`}>
                  {/* Title */}
                  <h3
                    className={`font-semibold text-stone-950 leading-snug mb-2 ${
                      i === 0 ? "text-lg" : "text-base"
                    }`}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-stone-600 leading-relaxed mb-4 ${
                      i === 0 ? "text-sm clamp-3" : "text-sm clamp-2"
                    }`}
                  >
                    {project.description}
                  </p>

                  {/* Achievement badge */}
                  {project.achievement && (
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
                      style={{
                        background: "#FFF7ED",
                        border: "1px solid rgba(232,130,12,0.2)",
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-saffron shrink-0" />
                      <p
                        className="text-saffron-dark font-medium"
                        style={{ fontSize: "12px" }}
                      >
                        {project.achievement}
                      </p>
                    </div>
                  )}

                  {/* Tech stack */}
                  {project.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech_stack.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-stone-600 font-mono"
                          style={{
                            fontSize: "11px",
                            background: "#F5F5F4",
                            border: "1px solid #E7E5E4",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="caption">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid #F5F5F4" }}
                  >
                    <p className="caption">
                      {project.team_members?.slice(0, 2).join(", ")}
                      {project.team_members?.length > 2 &&
                        ` +${project.team_members.length - 2}`}
                    </p>

                    <div className="flex items-center gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="caption hover:text-stone-950 transition-colors flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Code
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="caption hover:text-stone-950 transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
