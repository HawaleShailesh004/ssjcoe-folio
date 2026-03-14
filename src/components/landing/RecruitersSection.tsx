const RECRUITERS = [
  "TCS",
  "Infosys",
  "Wipro",
  "Cognizant",
  "Capgemini",
  "Persistent",
  "KPIT",
  "L&T",
  "Accenture",
  "HCL",
  "Hexaware",
  "Mphasis",
  "Tech Mahindra",
  "Cyient",
];

export function RecruitersSection() {
  return (
    <section className="section bg-ink-9">
      <div className="container">
        <div className="mb-10">
          <span className="accent-line" />
          <h2 className="text-3xl">Our recruiters</h2>
          <p className="text-base text-ink-4 mt-2">
            Companies that consistently hire from SSJCOE
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {RECRUITERS.map((name) => (
            <span
              key={name}
              className="card px-4 py-2 text-sm font-medium text-ink-3"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
