/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Mission } from "./pages/Mission";
import { Vision } from "./pages/Vision";
import { Gallery } from "./pages/Gallery";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { DocumentVerification } from "./pages/DocumentVerification";

export default function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="mission" element={<Mission />} />
            <Route path="vision" element={<Vision />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="verify/document/:documentId" element={<DocumentVerification />} />
            <Route path="verify/document" element={<DocumentVerification />} />
            <Route path="verify" element={<DocumentVerification />} />
          </Route>
          
          {/* Admin Routes outside main layout */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}
