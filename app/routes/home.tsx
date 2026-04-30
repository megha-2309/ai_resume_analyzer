import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv, fs } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  const handleDeleteResume = async (id: string) => {
    try {
      const resumeToDelete = resumes.find(r => r.id === id);
      if (resumeToDelete) {
        // Try to delete associated files; fail silently if they don't exist
        try {
            await fs.delete(resumeToDelete.resumePath);
            await fs.delete(resumeToDelete.imagePath);
        } catch (e) {}
      }
      
      await kv.delete(`resume:${id}`);
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Failed to delete resume:", err);
      alert("Failed to delete resume. Please try again.");
    }
  };

  return <main>
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-8">
        <h1>Track Your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <div className="flex flex-col items-center gap-8">
                <h2>No resumes found. Upload your first resume to get feedback.</h2>
                <Link to="/upload" className="primary-button w-fit text-xl font-semibold px-12 py-5 shadow-xl">
                  Upload Resume
                </Link>
            </div>
        ): (
          <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>

      {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="loading" />
          </div>
      )}

      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={handleDeleteResume} />
          ))}
        </div>
      )}

      {!loadingResumes && resumes.length > 0 && (
          <div className="flex justify-center mt-12">
              <Link to="/upload" className="primary-button w-fit px-10">
                  Upload Another Resume
              </Link>
          </div>
      )}
    </section>
  </main>
}
