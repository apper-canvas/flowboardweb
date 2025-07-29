import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";
import ProjectOverview from "@/components/pages/ProjectOverview";
import ProjectTodos from "@/components/pages/ProjectTodos";
import ProjectMessages from "@/components/pages/ProjectMessages";
import ProjectFiles from "@/components/pages/ProjectFiles";
import ProjectCalendar from "@/components/pages/ProjectCalendar";
import ProjectPeople from "@/components/pages/ProjectPeople";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { projectService } from "@/services/api/projectService";

const Layout = () => {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
      
      // Set active project based on URL or default to first project
      if (projectId) {
        const project = data.find(p => p.Id === parseInt(projectId));
        if (project) {
          setActiveProject(project);
        } else {
          // Project not found, redirect to first project
          if (data.length > 0) {
            navigate(`/projects/${data[0].Id}/overview`);
          }
        }
      } else if (data.length > 0) {
        // No project in URL, redirect to first project
        navigate(`/projects/${data[0].Id}/overview`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.Id === parseInt(projectId));
      if (project) {
        setActiveProject(project);
      }
    }
  }, [projectId, projects]);

  const handleProjectChange = (project) => {
    setActiveProject(project);
    navigate(`/projects/${project.Id}/overview`);
    setIsMobileSidebarOpen(false);
  };

  const handleProjectSelect = (project) => {
    setActiveProject(project);
    navigate(`/projects/${project.Id}/overview`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProjects} />;
  if (projects.length === 0) {
    return <Error message="No projects found. Please create a project to get started." />;
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          projects={projects}
          activeProject={activeProject}
          onProjectSelect={handleProjectSelect}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        projects={projects}
        activeProject={activeProject}
        onProjectSelect={handleProjectSelect}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          projects={projects}
          activeProject={activeProject}
          onProjectChange={handleProjectChange}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/projects/:projectId/overview" element={<ProjectOverview />} />
              <Route path="/projects/:projectId/todos" element={<ProjectTodos />} />
              <Route path="/projects/:projectId/messages" element={<ProjectMessages />} />
              <Route path="/projects/:projectId/files" element={<ProjectFiles />} />
              <Route path="/projects/:projectId/calendar" element={<ProjectCalendar />} />
              <Route path="/projects/:projectId/people" element={<ProjectPeople />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Layout />} />
        <Route path="/" element={<Navigate to={`/projects/1/overview`} replace />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </BrowserRouter>
  );
};

export default App;