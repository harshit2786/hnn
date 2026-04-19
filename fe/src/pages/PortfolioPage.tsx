const education = [
  { years: "2024 – 2026", degree: "M.A. (English)", institute: "National P.G. College, University of Lucknow", score: "7.6 CPI" },
  { years: "2021 – 2024", degree: "B.A. (Hons.) English", institute: "Amity University, Lucknow", score: "8.03%" },
  { years: "2020 – 2021", degree: "B.A. LL.B (Hons.)", institute: "Amity University, Lucknow", score: "8.71" },
  { years: "2019", degree: "Class XII — Science (ISC)", institute: "Lucknow Public College, Lucknow", score: "67.2%" },
  { years: "2017", degree: "Class X — Science (ICSE)", institute: "ST. Mary's School, Lucknow", score: "84%" },
];

const publications = [
  {
    authors: "Dubey, Adarshi, Mohit Singh, and Rohit Yadav.",
    title: "A Critical Study of James Cameron's Avatar through the Lens of Ecocriticism.",
    journal: "The SPL Journal of Literary Hermeneutics",
    details: "vol. 4, no. 1, Winter 2024, pp. 216–228. CaveMark Publications.",
    url: "https://www.literaryherm.org/index.php/ojs/article/view/147",
  },
  {
    authors: "Dubey, Adarshi, and Adaa Dev.",
    title: "The Bell Jar's Artistic Exploration of Depression: A Study of Sylvia Plath's Poetics and Feminist Identity.",
    journal: "International Journal of Creative Research Thoughts (IJCRT)",
    details: "vol. 11, no. 7, July 2023, pp. 389–394.",
    url: "https://www.ijcrt.org/papers/IJCRT2307629.pdf",
  },
];

const qualifications = [
  {
    title: "UGC NET — December 2025",
    detail: "Qualified for Ph.D. Admission · Subject: English · 92nd Percentile",
    url: "https://drive.google.com/file/d/1S565fTCdFUBheIhljrE3zQAxfPgGGQ8G/view",
    linkLabel: "View certificate",
  },
  {
    title: "Diploma, IGD Bombay Art — Grade B",
    detail: "Conducted by the Government of Maharashtra · Valid by U.P. Board, Allahabad",
    url: "https://www.bombayartsigd.com/wp-content/uploads/2025/02/20240056.pdf",
    linkLabel: "View certificate",
  },
];

const experience = [
  {
    role: "Generalist (Freelancer)",
    org: "Outlier AI",
    period: "Mar 2026 – Present",
    points: [
      "Multimodal AI evaluation across audio, video, text, and image modalities — including data annotation, audio transcription, and ASR correction.",
      "Video and audio quality assessment, computer vision annotation, and AI-generated design evaluation with comparative ranking and prompt engineering.",
      "AI response evaluation for factuality, instruction-following, and helpfulness; HITL AI training and quality assurance with multilingual capability in Hindi.",
    ],
  },
  {
    role: "Amway Business Owner (Part Time)",
    org: "Amway",
    period: "Mar 2026 – Present",
    points: [
      "Achieved 3% tier (200 GPV) through consistent sales growth, customer acquisition, and promotion of health and wellness products.",
      "Developed skills in entrepreneurship, direct sales, leadership, and team mentoring.",
    ],
  },
];

const activities = [
  {
    title: "Hearts and Notes — Personal Website",
    period: "",
    detail: "Leading product management and UI/UX design to build a personal content platform. Authoring and editing all blog content; driving content strategy, creative writing, and feature ideation.",
  },
  {
    title: "Anchor & Organising Committee Member",
    period: "2022",
    detail: "Challenging The Status Quo: 'Voices In Literary Studies' — Faculty Development Program, Amity University. Led event coordination, delivered public speaking sessions, and prepared event reports.",
    url: "https://youtu.be/jVMRpDPl468?si=MBVxZpnrncuYziEm",
    linkLabel: "Watch recording",
  },
  {
    title: "Member, Mimesis Dramatics and Film Club",
    period: "2021 – 2024",
    detail: "Amity University Lucknow Campus.",
  },
  {
    title: "Best Performer — National Space Science Essay Competition",
    period: "2018",
    detail: "Conducted by Go4Guru through The Hindu Educational Series.",
    url: "https://www.go4guru.com/spacescience/bestperformers.html",
    linkLabel: "View results",
  },
];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="py-10 sm:py-12 border-b border-border last:border-0">
      <div className="sm:grid sm:grid-cols-[160px_1fr] sm:gap-12">
        <div className="mb-4 sm:mb-0 sm:pt-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export default function PortfolioPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <div className="pb-10 sm:pb-12 border-b border-border">
        <div className="sm:grid sm:grid-cols-[160px_1fr] sm:gap-12">
          <div className="mb-4 sm:mb-0 sm:pt-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Portfolio</p>
          </div>
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight text-foreground mb-3">
              Adarshi Dubey
            </h1>
            <p className="font-serif italic text-muted-foreground text-base sm:text-lg mb-4 sm:mb-5">
              Graduate, Department of English
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              Scholar of English literature with a focus on ecocriticism, feminist literary theory,
              and the intersections of language, identity, and form. Based in Lucknow, Uttar Pradesh.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-5 mt-5 sm:mt-6 text-xs text-muted-foreground">
              <a href="mailto:adarshidy@gmail.com" className="hover:text-foreground transition-colors">
                adarshidy@gmail.com
              </a>
              <span>+91-9369269905</span>
              <span>Lucknow, U.P.</span>
              <a
                href="https://www.linkedin.com/in/adarshidubey/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Education */}
      <Section label="Education">
        <div className="divide-y divide-border">
          {education.map((e) => (
            <div key={e.degree} className="py-4">
              {/* Mobile: stacked */}
              <div className="sm:hidden">
                <div className="flex items-baseline justify-between mb-0.5">
                  <p className="font-serif text-sm text-foreground">{e.degree}</p>
                  <p className="text-xs text-muted-foreground tabular-nums shrink-0 ml-3">{e.score}</p>
                </div>
                <p className="text-xs text-muted-foreground">{e.institute}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{e.years}</p>
              </div>
              {/* Desktop: 3-col */}
              <div className="hidden sm:grid sm:grid-cols-[110px_1fr_auto] sm:gap-4 sm:items-baseline">
                <p className="text-xs text-muted-foreground">{e.years}</p>
                <div>
                  <p className="font-serif text-sm text-foreground">{e.degree}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.institute}</p>
                </div>
                <p className="text-xs text-muted-foreground tabular-nums">{e.score}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Publications */}
      <Section label="Publications">
        <div className="space-y-8">
          {publications.map((p) => (
            <div key={p.title}>
              <p className="font-serif text-sm sm:text-base text-foreground leading-snug mb-1">
                "{p.title}"
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {p.authors}{" "}
                <span className="italic">{p.journal}</span>,{" "}
                {p.details}
              </p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-primary hover:underline mt-1 inline-block"
              >
                View publication →
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* Qualifications */}
      <Section label="Qualifications">
        <div className="space-y-5">
          {qualifications.map((q) => (
            <div key={q.title}>
              <p className="font-serif text-sm text-foreground">{q.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{q.detail}</p>
              {"url" in q && (
                <a
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-primary hover:underline mt-1 inline-block"
                >
                  {q.linkLabel} →
                </a>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section label="Experience">
        <div className="space-y-8">
          {experience.map((e) => (
            <div key={e.role}>
              <div className="flex flex-wrap items-baseline justify-between gap-1 mb-2">
                <div>
                  <span className="font-serif text-sm text-foreground">{e.role}</span>
                  <span className="text-muted-foreground text-xs mx-2">·</span>
                  <span className="text-xs text-muted-foreground">{e.org}</span>
                </div>
                <span className="text-xs text-muted-foreground">{e.period}</span>
              </div>
              <ul className="space-y-1.5">
                {e.points.map((pt, i) => (
                  <li key={i} className="text-xs text-muted-foreground leading-relaxed pl-3 border-l border-border">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Activities */}
      <Section label="Activities">
        <div className="space-y-6">
          {activities.map((a) => (
            <div key={a.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
                <p className="font-serif text-sm text-foreground">{a.title}</p>
                {a.period && <p className="text-xs text-muted-foreground shrink-0">{a.period}</p>}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{a.detail}</p>
              {"url" in a && (
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-primary hover:underline mt-1 inline-block"
                >
                  {a.linkLabel} →
                </a>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Languages */}
      <Section label="Languages">
        <div className="flex gap-8">
          <div>
            <p className="font-serif text-sm text-foreground">Hindi</p>
            <p className="text-xs text-muted-foreground mt-0.5">Native Proficiency</p>
          </div>
          <div>
            <p className="font-serif text-sm text-foreground">English</p>
            <p className="text-xs text-muted-foreground mt-0.5">Full Professional Proficiency</p>
          </div>
        </div>
      </Section>
    </main>
  );
}
