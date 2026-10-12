import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Pill,
  CalendarCheck,
  BellRing,
  ShieldAlert,
  Lock,
  LayoutDashboard,
  ArrowRight,
  Upload,
  CheckCircle2,
  HeartPulse
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import heroMedicalIllustration from '../assets/illustrations/hero-medical.svg';

const LandingPage = () => {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar isDashboard={false} />

      <main style={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#eff6ff',
                  color: '#0f62fe',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  marginBottom: '20px'
                }}>
                  <HeartPulse size={18} />
                  <span>Accessible Healthcare Explainer For Everyone</span>
                </div>

                <h1 className="hero-title">
                  Understand Your Medical Reports. <span style={{ color: '#0f62fe' }}>Simply.</span>
                </h1>

                <p className="hero-subtitle">
                  Upload your medical report or prescription and get clear, easy-to-understand explanations in one place.
                  Designed especially for elderly and non-technical patients.
                </p>

                <div className="hero-cta-group">
                  <Link to="/upload" className="btn btn-primary btn-large">
                    <Upload size={22} />
                    <span>Upload Report</span>
                  </Link>

                  <Link to="/register" className="btn btn-secondary btn-large">
                    <span>Get Started</span>
                    <ArrowRight size={20} />
                  </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '36px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={20} style={{ color: '#059669' }} />
                    <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>No medical jargon</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={20} style={{ color: '#059669' }} />
                    <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>High contrast text</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={20} style={{ color: '#059669' }} />
                    <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>100% Secure & Private</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={heroMedicalIllustration}
                  alt="Medical Report and Medication Illustration"
                  style={{ maxWidth: '100%', height: 'auto', maxHeight: '420px' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Persistent Medical Disclaimer */}
        <div className="container" style={{ margin: '16px auto' }}>
          <MedicalDisclaimer />
        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="container">
            <div className="section-headline">
              <h2>How It Works</h2>
              <p>A simple four-step process built around your peace of mind and convenience.</p>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number-badge">1</div>
                <h3>Upload</h3>
                <p>Upload your medical report, blood test, or doctor's prescription as a PDF or image photo.</p>
              </div>

              <div className="step-card">
                <div className="step-number-badge">2</div>
                <h3>Extract</h3>
                <p>The system carefully extracts the important laboratory numbers, tests, and medication names.</p>
              </div>

              <div className="step-card">
                <div className="step-number-badge">3</div>
                <h3>Understand</h3>
                <p>Complex medical terms and test values are explained in plain, simple everyday language.</p>
              </div>

              <div className="step-card">
                <div className="step-number-badge">4</div>
                <h3>Track</h3>
                <p>Keep track of your active medicines, schedule daily reminders, and check drug interactions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="container">
            <div className="section-headline">
              <h2>Everything You Need To Stay Informed</h2>
              <p>Clean, professional healthcare tools designed without complicated menus or confusing charts.</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-box">
                  <FileText size={28} />
                </div>
                <h3>Medical Report Explanation</h3>
                <p>Understand difficult medical terminology in simple, everyday language that anyone can easily read.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: '#fffbeb', color: '#d97706' }}>
                  <AlertTriangle size={28} />
                </div>
                <h3>Abnormal Value Detection</h3>
                <p>Highlight laboratory numbers that fall outside the typical reference range without causing alarm.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <Pill size={28} />
                </div>
                <h3>Prescription Understanding</h3>
                <p>Extract and organize prescribed medicine names, daily dosages, and meal-time instructions cleanly.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">
                  <CalendarCheck size={28} />
                </div>
                <h3>Medication Tracker</h3>
                <p>Manage all your prescribed medications and review current daily courses from a single screen.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: '#eff6ff', color: '#0f62fe' }}>
                  <BellRing size={28} />
                </div>
                <h3>Medication Reminders</h3>
                <p>View daily medicine timings and mark medications as taken so you never miss an essential dose.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <ShieldAlert size={28} />
                </div>
                <h3>Drug Interaction Check</h3>
                <p>Check common interactions between entered medicines to discuss safely with your doctor or pharmacist.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
                  <Lock size={28} />
                </div>
                <h3>Secure Account</h3>
                <p>Industry-standard JWT encryption and password protection keep your health documents private.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">
                  <LayoutDashboard size={28} />
                </div>
                <h3>Medical Information Dashboard</h3>
                <p>Keep your historical reports, prescriptions, and medicines organized and ready for your doctor's visit.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" style={{ padding: '80px 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
          <div className="container" style={{ maxWidth: '840px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
              Built For Clarity, Care & Family
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: 1.7, marginBottom: '32px' }}>
              We believe medical information should never be intimidating. MediExplain was created to bridge the communication gap between complex clinical reports and patients who need clear, compassionate, and straightforward explanations.
            </p>
            <Link to="/register" className="btn btn-primary btn-large">
              <span>Start Using MediExplain Today</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
