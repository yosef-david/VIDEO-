"use client";

import { useEffect, useMemo, useState } from "react";
import type { VideoProject } from "@/lib/types";

type FormState = {
  name: string;
  prompt: string;
  duration: 1 | 5 | 10 | 30 | 60 | 120;
  style: string;
  language: string;
  narrationLanguage: string;
  voice: string;
  soundtrack: string;
  closedCaptions: boolean;
  onScreenTitles: boolean;
  pacing: "slow" | "balanced" | "fast";
  quality: "720p" | "1080p" | "4K";
  aspectRatio: "16:9" | "9:16" | "1:1" | "4:3" | "21:9";
};

const durationOptions = [1, 5, 10, 30, 60, 120] as const;
const styles = [
  "realistic",
  "cinematic",
  "3d-animation",
  "anime",
  "documentary",
  "presentation",
  "ad",
  "illustration",
  "freeform",
];

const initialForm: FormState = {
  name: "תוצר חדש",
  prompt: "סרטון על איך לנהל צוות בכיר בחברה ישראלית שמצמיחה מוצר AI לשוק האנרגיה",
  duration: 5,
  style: "cinematic",
  language: "he",
  narrationLanguage: "he",
  voice: "female-professional",
  soundtrack: "cinematic-orchestral",
  closedCaptions: true,
  onScreenTitles: true,
  pacing: "balanced",
  quality: "1080p",
  aspectRatio: "16:9",
};

export function VideoStudio() {
  const [language, setLanguage] = useState<"he" | "en">("he");
  const [form, setForm] = useState<FormState>(initialForm);
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  useEffect(() => {
    void loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      const data = await response.json();
      const nextProjects = Array.isArray(data.projects) ? data.projects : [];
      setProjects(nextProjects);
      if (nextProjects[0]) {
        setSelectedProjectId(nextProjects[0].id);
      }
    } catch {
      setProjects([]);
    }
  }

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateScene = (sceneId: string, updates: Partial<VideoProject["scenes"][number]>) => {
    if (!selectedProject) return;

    const nextScenes = selectedProject.scenes.map((scene) => {
      if (scene.id !== sceneId) return scene;
      return { ...scene, ...updates };
    });

    const nextProject = { ...selectedProject, scenes: nextScenes, updatedAt: new Date().toISOString() };
    setProjects((current) => current.map((project) => (project.id === selectedProject.id ? nextProject : project)));
  };

  const addScene = () => {
    if (!selectedProject) return;
    const nextScene = {
      id: crypto.randomUUID(),
      title: `סצנה ${selectedProject.scenes.length + 1}`,
      description: "תוכן חדש של סצנה",
      duration: 15,
    };

    const nextProject = {
      ...selectedProject,
      scenes: [...selectedProject.scenes, nextScene],
      updatedAt: new Date().toISOString(),
    };

    setProjects((current) => current.map((project) => (project.id === selectedProject.id ? nextProject : project)));
  };

  const moveScene = (sceneId: string, direction: "up" | "down") => {
    if (!selectedProject) return;
    const currentIndex = selectedProject.scenes.findIndex((scene) => scene.id === sceneId);
    if (currentIndex < 0) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= selectedProject.scenes.length) return;

    const nextScenes = [...selectedProject.scenes];
    const [moved] = nextScenes.splice(currentIndex, 1);
    nextScenes.splice(targetIndex, 0, moved);

    const nextProject = { ...selectedProject, scenes: nextScenes, updatedAt: new Date().toISOString() };
    setProjects((current) => current.map((project) => (project.id === selectedProject.id ? nextProject : project)));
  };

  const deleteScene = (sceneId: string) => {
    if (!selectedProject || selectedProject.scenes.length <= 1) return;
    const nextProject = {
      ...selectedProject,
      scenes: selectedProject.scenes.filter((scene) => scene.id !== sceneId),
      updatedAt: new Date().toISOString(),
    };

    setProjects((current) => current.map((project) => (project.id === selectedProject.id ? nextProject : project)));
  };

  const saveProjectToServer = async (project: VideoProject) => {
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save project");
      }
      return data.project as VideoProject;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleCreateVideo = async () => {
    if (!form.prompt.trim()) {
      setError("אנא כתבו תיאור ברור כדי ליצור סרטון.");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.message || "Failed to initialize generation");
        return;
      }

      setProjects(data.projects || []);
      setSelectedProjectId(data.project.id);
      setEditorOpen(true);
      setMessage(data.message || "הפרויקט נוצר בהצלחה.");
    } catch {
      setError("שגיאה ביצירת הסרטון. נסו שוב בעוד מספר רגעים.");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setProjects((current) => current.filter((project) => project.id !== projectId));
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
      }
      setMessage("הפרויקט נמחק בהצלחה.");
    } catch {
      setError("לא ניתן למחוק את הפרויקט כעת.");
    }
  };

  const handleDuplicateProject = async (project: VideoProject) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId: project.id, name: `${project.name} (העתק)` }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Duplicate failed");
      }

      setProjects((current) => [data.project, ...current]);
      setSelectedProjectId(data.project.id);
      setMessage("הפרויקט הוכפל בהצלחה.");
    } catch {
      setError("לא ניתן לשכפל את הפרויקט.");
    }
  };

  const handleRenameProject = async (project: VideoProject) => {
    const newName = window.prompt("שם הפרויקט החדש:", project.name);
    if (!newName || !newName.trim()) return;

    const updated = { ...project, name: newName.trim(), updatedAt: new Date().toISOString() };
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!response.ok) throw new Error();
      setProjects((current) => current.map((item) => (item.id === project.id ? updated : item)));
      setMessage("השם עודכן.");
    } catch {
      setError("לא ניתן לשנות את שם הפרויקט.");
    }
  };

  const handleDownload = async (project: VideoProject) => {
    const response = await fetch(`/api/download?projectId=${project.id}`);
    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "אין קובץ וידאו זמין להורדה.");
      return;
    }

    setMessage("הקובץ מוכן להורדה.");
  };

  const handleSaveEditor = async () => {
    if (!selectedProject) return;
    try {
      await saveProjectToServer(selectedProject);
      setMessage("השינויים נשמרו בפרויקט.");
    } catch {
      setError("לא הצלחנו לשמור את השינויים.");
    }
  };

  return (
    <div dir={language === "he" ? "rtl" : "ltr"} className="page-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">V</div>
          <span>VIDEOMIND AI</span>
        </div>

        <nav>
          <button className="nav-button" onClick={() => setEditorOpen(false)}>בית</button>
          <button className="nav-button" onClick={() => setEditorOpen(true)}>עורך</button>
          <button className="nav-button" onClick={() => void loadProjects()}>רענון</button>
          <button className="secondary-button" onClick={() => setLanguage((current) => (current === "he" ? "en" : "he"))}>
            {language === "he" ? "English" : "עברית"}
          </button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <h1>{language === "he" ? "הרעיון שלך. הסרטון שלך." : "Your idea. Your video."}</h1>
            <p>
              {language === "he"
                ? "בנה סרטונים מקצועיים על ידי תיאור רעיון, בחר סגנון, איכות ומוזיקה, ואז שלח את הפרויקט לעיבוד AI. המערכת תומכת בעיבוד ארוך, עריכה ושמירה של פרויקטים לעתיד."
                : "Create polished videos by describing your idea, selecting style and quality, then sending the project through the AI pipeline. The platform supports long-form rendering, editing, and saving projects for later."}
            </p>

            <div className="hero-actions">
              <button className="primary-button" onClick={() => document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" })}>
                {language === "he" ? "צור סרטון חדש" : "Create a new video"}
              </button>
              <button className="ghost-button" onClick={() => setEditorOpen(true)}>
                {language === "he" ? "פתח עריכה" : "Open editor"}
              </button>
            </div>

            <div className="quick-stats">
              <div className="metric-box">
                <strong>24h</strong>
                <span>{language === "he" ? "מיזוג מהיר" : "Fast turnaround"}</span>
              </div>
              <div className="metric-box">
                <strong>4K</strong>
                <span>{language === "he" ? "איכות גבוהה" : "High quality"}</span>
              </div>
              <div className="metric-box">
                <strong>120m</strong>
                <span>{language === "he" ? "אורך מקסימלי" : "Max duration"}</span>
              </div>
            </div>
          </div>

          <div className="preview-card">
            <div className="preview-stage">
              <div className="preview-panel">
                <h3>{language === "he" ? "תהליך יצירה" : "Generation flow"}</h3>
                <p>{language === "he" ? "נוצרים סצנות, מוסיפים מוזיקה וקריינות, ומחברים סרטון שלם." : "Scenes are created, soundtrack and narration are added, then the final video is stitched."}</p>
                <div className="bar">
                  <div className="fill" />
                </div>
                <div style={{ marginTop: 10, color: "#cfe8ff", fontSize: 13 }}>
                  {language === "he" ? "72% הושלם" : "72% complete"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && <div className="alert">{error}</div>}
        {message && <div className="alert" style={{ borderColor: "rgba(66,212,176,0.4)", color: "#d5ffef" }}>{message}</div>}

        <section id="studio" className="content-grid">
          <div className="panel">
            <h2 style={{ marginTop: 0 }}>{language === "he" ? "יצירת סרטון" : "Create video"}</h2>

            <div className="form-grid">
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>{language === "he" ? "שם הפרויקט" : "Project name"}</label>
                <input value={form.name} onChange={(event) => updateField("name", event.target.value)} />
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>{language === "he" ? "תיאור הסרטון" : "Video prompt"}</label>
                <textarea value={form.prompt} onChange={(event) => updateField("prompt", event.target.value)} />
              </div>

              <div className="field">
                <label>{language === "he" ? "אורך הסרטון" : "Duration"}</label>
                <select value={String(form.duration)} onChange={(event) => updateField("duration", Number(event.target.value) as FormState["duration"])}>
                  {durationOptions.map((option) => (
                    <option key={option} value={option}>{option} {language === "he" ? "דקות" : "min"}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>{language === "he" ? "סגנון" : "Style"}</label>
                <select value={form.style} onChange={(event) => updateField("style", event.target.value)}>
                  {styles.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>{language === "he" ? "שפת הסרטון" : "Video language"}</label>
                <select value={form.language} onChange={(event) => updateField("language", event.target.value)}>
                  <option value="he">עברית</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="field">
                <label>{language === "he" ? "שפת הקריינות" : "Narration language"}</label>
                <select value={form.narrationLanguage} onChange={(event) => updateField("narrationLanguage", event.target.value)}>
                  <option value="he">עברית</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="field">
                <label>{language === "he" ? "סוג הקול" : "Voice type"}</label>
                <select value={form.voice} onChange={(event) => updateField("voice", event.target.value)}>
                  <option value="female-professional">Female professional</option>
                  <option value="male-professional">Male professional</option>
                  <option value="warm-narrator">Warm narrator</option>
                </select>
              </div>

              <div className="field">
                <label>{language === "he" ? "מוזיקת רקע" : "Background music"}</label>
                <select value={form.soundtrack} onChange={(event) => updateField("soundtrack", event.target.value)}>
                  <option value="cinematic-orchestral">Cinematic orchestral</option>
                  <option value="electronic-ambient">Electronic ambient</option>
                  <option value="minimal-piano">Minimal piano</option>
                </select>
              </div>

              <div className="field">
                <label>{language === "he" ? "איכות הסרטון" : "Video quality"}</label>
                <select value={form.quality} onChange={(event) => updateField("quality", event.target.value as FormState["quality"])}>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4K">4K</option>
                </select>
              </div>

              <div className="field">
                <label>{language === "he" ? "יחס מסך" : "Aspect ratio"}</label>
                <select value={form.aspectRatio} onChange={(event) => updateField("aspectRatio", event.target.value as FormState["aspectRatio"])}>
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="1:1">1:1</option>
                  <option value="4:3">4:3</option>
                  <option value="21:9">21:9</option>
                </select>
              </div>

              <div className="field">
                <label>{language === "he" ? "קצב הסרטון" : "Pacing"}</label>
                <select value={form.pacing} onChange={(event) => updateField("pacing", event.target.value as FormState["pacing"])}>
                  <option value="slow">Slow</option>
                  <option value="balanced">Balanced</option>
                  <option value="fast">Fast</option>
                </select>
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <div className="checkbox-row">
                  <label className="checkbox">
                    <input type="checkbox" checked={form.closedCaptions} onChange={() => updateField("closedCaptions", !form.closedCaptions)} />
                    {language === "he" ? "כתוביות אוטומטיות" : "Auto captions"}
                  </label>
                  <label className="checkbox">
                    <input type="checkbox" checked={form.onScreenTitles} onChange={() => updateField("onScreenTitles", !form.onScreenTitles)} />
                    {language === "he" ? "כותרות על המסך" : "On-screen titles"}
                  </label>
                </div>
              </div>
            </div>

            <div className="metrics-line">
              <span className="pill">{form.quality}</span>
              <span className="pill">{form.aspectRatio}</span>
              <span className="pill">{form.style}</span>
              <span className="pill">{form.soundtrack}</span>
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="primary-button" disabled={busy} onClick={() => void handleCreateVideo()}>
                {busy ? (language === "he" ? "יוצר סרטון..." : "Generating...") : language === "he" ? "צור סרטון" : "Generate video"}
              </button>
              <button className="secondary-button" onClick={() => setForm(initialForm)}>
                {language === "he" ? "איפוס" : "Reset"}
              </button>
            </div>
          </div>

          <div className="panel">
            <h2 style={{ marginTop: 0 }}>{language === "he" ? "פרויקטים אחרונים" : "Recent projects"}</h2>

            <div className="project-list">
              {projects.length === 0 ? (
                <div className="project-item">
                  <p style={{ margin: 0, color: "#b9cee3" }}>{language === "he" ? "אין פרויקטים עדיין. צור פרויקט ראשון." : "No projects yet. Create your first project."}</p>
                </div>
              ) : (
                projects.slice(0, 4).map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="project-header">
                      <div>
                        <strong>{project.name}</strong>
                        <div style={{ color: "#b9cee3", fontSize: 12, marginTop: 6 }}>
                          {project.style} · {project.duration}m · {project.quality}
                        </div>
                      </div>

                      <span className={`status-badge status-${project.status}`}>{project.status}</span>
                    </div>

                    <div className="project-actions" style={{ marginTop: 12 }}>
                      <button className="inline-button" onClick={() => setSelectedProjectId(project.id)}>{language === "he" ? "פתח" : "Open"}</button>
                      <button className="inline-button" onClick={() => void handleDuplicateProject(project)}>{language === "he" ? "שכפול" : "Duplicate"}</button>
                      <button className="inline-button" onClick={() => void handleRenameProject(project)}>{language === "he" ? "שנה שם" : "Rename"}</button>
                      <button className="inline-button" onClick={() => void handleDeleteProject(project.id)}>{language === "he" ? "מחק" : "Delete"}</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {editorOpen && selectedProject && (
          <section className="panel" style={{ marginTop: 26 }}>
            <div className="project-header" style={{ marginBottom: 18 }}>
              <div>
                <h2 style={{ margin: 0 }}>{selectedProject.name}</h2>
                <div style={{ color: "#b9cee3", marginTop: 6 }}>{selectedProject.prompt}</div>
              </div>
              <button className="primary-button" onClick={() => void handleSaveEditor()}>{language === "he" ? "שמור" : "Save"}</button>
            </div>

            <div className="editor-shell">
              <div className="editor-tools">
                <button className="inline-button" onClick={addScene}>{language === "he" ? "הוסף סצנה" : "Add scene"}</button>
                <button className="inline-button" onClick={() => void handleDownload(selectedProject)}>{language === "he" ? "הורד סרטון" : "Download video"}</button>
                <button className="inline-button" onClick={() => setMessage(language === "he" ? "הפקה פעילה. בשרת יופיעו עדכוני התקדמות אמיתיים כאשר מחובר מנוע AI." : "Rendering is active. Real progress updates appear when a real AI engine is connected.")}>{language === "he" ? "הצג התקדמות" : "Progress"}</button>
              </div>

              <div className="timeline">
                {selectedProject.scenes.map((scene, index) => (
                  <div key={scene.id} className="scene-item">
                    <div className="scene-header">
                      <div>
                        <strong>{index + 1}. {scene.title}</strong>
                        <div style={{ color: "#b9cee3", fontSize: 12, marginTop: 6 }}>{scene.duration}s</div>
                      </div>

                      <div className="scene-actions">
                        <button className="inline-button" onClick={() => moveScene(scene.id, "up")}>↑</button>
                        <button className="inline-button" onClick={() => moveScene(scene.id, "down")}>↓</button>
                        <button className="inline-button" onClick={() => updateScene(scene.id, { duration: Math.max(5, scene.duration - 5) })}>-5s</button>
                        <button className="inline-button" onClick={() => updateScene(scene.id, { duration: scene.duration + 5 })}>+5s</button>
                        <button className="inline-button" onClick={() => deleteScene(scene.id)}>{language === "he" ? "מחק" : "Delete"}</button>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                      <div className="field">
                        <label>{language === "he" ? "כותרת" : "Title"}</label>
                        <input value={scene.title} onChange={(event) => updateScene(scene.id, { title: event.target.value })} />
                      </div>

                      <div className="field">
                        <label>{language === "he" ? "משך" : "Length"}</label>
                        <input type="number" value={scene.duration} onChange={(event) => updateScene(scene.id, { duration: Number(event.target.value) || 5 })} />
                      </div>
                    </div>

                    <div className="field" style={{ marginTop: 12 }}>
                      <label>{language === "he" ? "תיאור הסצנה" : "Scene description"}</label>
                      <textarea value={scene.description} onChange={(event) => updateScene(scene.id, { description: event.target.value })} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
