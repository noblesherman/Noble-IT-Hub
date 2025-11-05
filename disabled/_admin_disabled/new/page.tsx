"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";

export default function CreateWizardPage() {
  const [step, setStep] = useState(1);

  const [client, setClient] = useState({ name: "", website: "", logoUrl: "" });
  const [project, setProject] = useState({ title: "", description: "", link: "" });
  const [incident, setIncident] = useState({ title: "", description: "", impact: "" });

  const [includeProject, setIncludeProject] = useState(true);
  const [includeIncident, setIncludeIncident] = useState(false);
  const [includeMonitor, setIncludeMonitor] = useState(true);
  const [includeTicket, setIncludeTicket] = useState(true);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function fixUrl(url: string) {
    if (!url) return undefined;
    if (!url.startsWith("http")) return `https://${url}`;
    return url;
  }

  useEffect(() => {
    if (!client.website) return;

    const domain = client.website
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      .split("/")[0];

    if (!client.logoUrl) {
      setClient((c) => ({
        ...c,
        logoUrl: `https://logo.clearbit.com/${domain}`
      }));
    }

    if (!project.title) {
      setProject((p) => ({
        ...p,
        title: `${client.name} Website`
      }));
    }

    if (!project.description) {
      setProject((p) => ({
        ...p,
        description: "Primary client presence and business site"
      }));
    }

    if (!project.link) {
      setProject((p) => ({
        ...p,
        link: fixUrl(client.website) || ""
      }));
    }
  }, [client.website]);

  async function submit() {
    setLoading(true);
    setMsg("");

    const body = {
      client: {
        name: client.name,
        website: fixUrl(client.website),
        logoUrl: fixUrl(client.logoUrl)
      },
      project: includeProject ? project : undefined,
      incident: includeIncident ? incident : undefined,
      createUptimeMonitor: includeMonitor,
      createOnboardingTicket: includeTicket
    };

    const res = await fetch("/api/admin/create-wizard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMsg("✅ Saved. Dashboard updated instantly.");
      setStep(4);
    } else {
      setMsg("⚠️ " + (data.error || "Something went kaboom"));
    }
  }

  function next() {
    if (step === 1 && !client.name) {
      setMsg("⚠️ Client name required");
      return;
    }
    if (step === 2 && includeProject && !project.title) {
      setMsg("⚠️ Project title required");
      return;
    }
    setMsg("");
    setStep(step + 1);
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <StepBar step={step} />

      <div className="rounded-3xl bg-white/70 border border-white/50 backdrop-blur-xl shadow-xl p-10 space-y-8">

        {step === 1 && (
          <ClientStep client={client} setClient={setClient} next={next} msg={msg} />
        )}

        {step === 2 && (
          <ProjectStep
            includeProject={includeProject}
            setIncludeProject={setIncludeProject}
            project={project}
            setProject={setProject}
            back={() => setStep(1)}
            next={next}
            msg={msg}
          />
        )}

        {step === 3 && (
          <AutomationStep
            includeMonitor={includeMonitor}
            setIncludeMonitor={setIncludeMonitor}
            includeTicket={includeTicket}
            setIncludeTicket={setIncludeTicket}
            includeIncident={includeIncident}
            setIncludeIncident={setIncludeIncident}
            incident={incident}
            setIncident={setIncident}
            back={() => setStep(2)}
            submit={submit}
            loading={loading}
          />
        )}

        {step === 4 && (
          <FinishStep msg={msg} />
        )}

      </div>
    </div>
  );
}

function StepBar({ step }: any) {
  return (
    <nav className="flex justify-center gap-4">
      {[1,2,3,4].map((s) => (
        <div
          key={s}
          className={clsx(
            "w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold",
            s <= step ? "bg-blue-600 text-white" : "bg-neutral-300 text-neutral-600"
          )}
        >
          {s}
        </div>
      ))}
    </nav>
  );
}

/* ========== INDIVIDUAL STEP COMPONENTS ========== */

function ClientStep({ client, setClient, next, msg }: any) {
  return (
    <>
      <h2 className="text-2xl font-semibold">Client Details</h2>
      <Input label="Business Name" value={client.name} onChange={(v: string) => setClient({ ...client, name: v })} />
      <Input label="Website" placeholder="domain.com" value={client.website} onChange={(v: string) => setClient({ ...client, website: v })} />
      <Input label="Logo URL" value={client.logoUrl} onChange={(v: string) => setClient({ ...client, logoUrl: v })} />
      {msg && <p className="text-red-600 text-sm">{msg}</p>}
      <NavNext onClick={next} />
    </>
  );
}

function ProjectStep({ includeProject, setIncludeProject, project, setProject, back, next, msg }: any) {
  return (
    <>
      <h2 className="text-2xl font-semibold">Project Setup</h2>
      <Toggle label="Create a website project" checked={includeProject} onToggle={setIncludeProject} />

      {includeProject && (
        <>
          <Input label="Project Title" value={project.title} onChange={(v: string) => setProject({ ...project, title: v })} />
          <Input label="Description" value={project.description} onChange={(v: string) => setProject({ ...project, description: v })} />
          <Input label="Project URL" value={project.link} onChange={(v: string) => setProject({ ...project, link: v })} />
        </>
      )}

      {msg && <p className="text-red-600 text-sm">{msg}</p>}
      <NavBackNext onBack={back} onNext={next} />
    </>
  );
}

function AutomationStep(props: any) {
  const {
    includeMonitor, setIncludeMonitor,
    includeTicket, setIncludeTicket,
    includeIncident, setIncludeIncident,
    incident, setIncident,
    back, submit, loading
  } = props;

  return (
    <>
      <h2 className="text-2xl font-semibold">Automation Options</h2>

      <Toggle label="Monitor uptime via UptimeRobot" checked={includeMonitor} onToggle={setIncludeMonitor} />
      <Toggle label="Create onboarding ticket" checked={includeTicket} onToggle={setIncludeTicket} />
      <Toggle label="Add an active incident" checked={includeIncident} onToggle={setIncludeIncident} />

      {includeIncident && (
        <>
          <Input label="Incident Title" value={incident.title} onChange={(v: string) => setIncident({ ...incident, title: v })} />
          <Input label="Incident Description" value={incident.description} onChange={(v: string) => setIncident({ ...incident, description: v })} />
        </>
      )}

      <NavBackSubmit onBack={back} onSubmit={submit} loading={loading} />
    </>
  );
}

function FinishStep({ msg }: any) {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-semibold text-green-600">All Done 🎉</h2>
      <p className="text-neutral-600">{msg}</p>
      <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold" onClick={() => location.href="/admin"}>
        Go to Dashboard
      </button>
    </div>
  );
}

/* ------- UI bits ------- */
function Input({ label, value, onChange, placeholder }: any) {
  return (
    <label className="block space-y-2">
      <span className="text-neutral-700 font-medium">{label}</span>
      <input
        className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 focus:ring-4 focus:ring-blue-300/40 transition"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Toggle({ label, checked, onToggle }: any) {
  return (
    <div
      onClick={() => onToggle(!checked)}
      className={clsx(
        "w-full px-6 py-4 rounded-xl border flex justify-between cursor-pointer text-sm",
        checked ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-white border-neutral-300 text-neutral-700"
      )}
    >
      {label}
      <div className={clsx(
        "w-10 h-6 rounded-full flex items-center transition",
        checked ? "bg-blue-600" : "bg-neutral-300"
      )}>
        <div className={clsx(
          "w-5 h-5 bg-white rounded-full shadow ml-[2px] transition",
          checked ? "translate-x-4" : "translate-x-0"
        )}/>
      </div>
    </div>
  );
}

function NavNext({ onClick }: any) {
  return <button onClick={onClick} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold">Next →</button>;
}

function NavBackNext({ onBack, onNext }: any) {
  return (
    <div className="flex justify-between pt-4">
      <button onClick={onBack} className="px-6 py-3 rounded-xl bg-neutral-200">← Back</button>
      <button onClick={onNext} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold">Next →</button>
    </div>
  );
}

function NavBackSubmit({ onBack, onSubmit, loading }: any) {
  return (
    <div className="flex justify-between pt-4">
      <button onClick={onBack} className="px-6 py-3 rounded-xl bg-neutral-200">← Back</button>
      <button disabled={loading} onClick={onSubmit}
        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50">
        {loading ? "Saving…" : "Finish"}
      </button>
    </div>
  );
}