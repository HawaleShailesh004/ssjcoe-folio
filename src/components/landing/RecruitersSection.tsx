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
];

export function RecruitersSection() {
  return (
    <section className="section-pad bg-brand-bg">
      <div className="container-main">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-brand-black mb-2">
            Our recruiters
          </h2>
          <p className="text-brand-muted">
            Companies that trust SSJCOE talent
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {RECRUITERS.map((name) => (
            <div
              key={name}
              className="card-base px-5 py-3 text-sm font-semibold text-brand-slate hover:shadow-panel transition-shadow"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
