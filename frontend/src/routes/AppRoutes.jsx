import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import Dashboard from "../pages/dashboard/Dashboard";

import Projects from "../pages/projects/Projects";
import CreateProject from "../pages/projects/CreateProject";
import ProjectDetails from "../pages/projects/ProjectDetails";
import EditProject from "../pages/projects/EditProject";
import BrowseProjects from "../pages/projects/BrowseProjects";
import CreateProposal from "../pages/proposals/CreateProposal";
import ProjectProposals from "../pages/proposals/projectProposals";
import MyProposals from "../pages/proposals/MyProposals";
import ClientProposals from "../pages/proposals/ClientProposals";
import FreelancerDashboard from "../pages/dashboard/freelancer/FreelancerDashboard";
import ProjectMessages from "../pages/messages/ProjectMessages";
import Messages from "../pages/messages/Messages";
import Notifications from "../pages/notifications/Notifications";
import Settings from "../pages/settings/Settings";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route element={<PublicLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>

        {/* Protected Routes */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/proposals"
            element={<ClientProposals />}
          />

          <Route
            path="/projects/create"
            element={<CreateProject />}
          />
          <Route
          path="/browse-projects"
          element={<BrowseProjects />}
         />
         <Route
            path="/projects/:projectId/proposals"
            element={<ProjectProposals />}
          />
        <Route
          path="/my-proposals"
          element={<MyProposals />}
        />
        <Route
          path="/dashboard/freelancer"
          element={<FreelancerDashboard />}
        />
        

          <Route
            path="/projects/:id"
            element={<ProjectDetails />}
          />

          <Route
            path="/projects/edit/:id"
            element={<EditProject />}
          />
          <Route
           path="/projects/:projectId/apply"
           element={<CreateProposal />}
          />
          <Route
            path="/projects/:id/messages"
            element={<ProjectMessages />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;