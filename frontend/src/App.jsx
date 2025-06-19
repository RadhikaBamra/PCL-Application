import React from "react";
import IntroductionPage from "./pages/IntroductionPage/IntroductionPage";
import LoginChoice from "./pages/LoginChoice/LoginChoice";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import SubmitSample from "./pages/SubmitSample/SubmitSample";
import MainLayout from "./pages/Layouts/MainLayout";
import { UserProvider } from "./StoreContext/StoreContext";
import PrivateRoute from "./components/PrivateRoute";
import SubmittedPage from "./pages/SubmittedPage/SubmittedPage";
import MySamples from "./pages/MySamples/MySamples";
import SampleManagement from "./pages/SampleManagement/SampleManagement";
import RoleBasedRoute from "./components/RoleBasedRoute";
import SampleDetails from "./pages/SampleDetails/SampleDetails";
import FinishedSamples from "./pages/FinishedSamples/FinishedSamples";
import MyFinishedSamples from "./pages/MyFinishedSamples/MyFinishedSamples";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IntroductionPage />} />
          <Route path="/login-choice" element={<LoginChoice />} />

          {/* Private Routes (need user) */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Homepage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/submit-sample"
            element={
              <PrivateRoute>
                <MainLayout>
                  <SubmitSample />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/submitted-page"
            element={
              <PrivateRoute>
                <MainLayout>
                  <SubmittedPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-samples"
            element={
              <PrivateRoute>
                <MainLayout>
                  <MySamples />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-finished-samples"
            element={
              <PrivateRoute>
                <MainLayout>
                  <MyFinishedSamples />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/pending-samples"
            element={
              <PrivateRoute>
                <RoleBasedRoute
                  allowedRoles={["Scientist", "Admin", "scientist", "admin"]}
                >
                  <MainLayout>
                    <SampleManagement />
                  </MainLayout>
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/sample/:id"
            element={
              <PrivateRoute>
                <RoleBasedRoute
                  allowedRoles={["Scientist", "Admin", "scientist", "admin"]}
                >
                  <MainLayout>
                    <SampleDetails />
                  </MainLayout>
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/finished-samples"
            element={
              <PrivateRoute>
                <RoleBasedRoute
                  allowedRoles={["Scientist", "Admin", "scientist", "admin"]}
                >
                  <MainLayout>
                    <FinishedSamples />
                  </MainLayout>
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <RoleBasedRoute
                  allowedRoles={["Scientist", "Admin", "scientist", "admin"]}
                >
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
