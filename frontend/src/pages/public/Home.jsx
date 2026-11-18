import Button from "../../components/ui/Button";

function Home() {
  return (
    <div className="bg-white text-[#14532D]">
      {/* HERO SECTION */}
      <section className="relative isolate flex flex-col-reverse items-center justify-between gap-10 overflow-hidden bg-gradient-to-br from-white via-[#F8FBF8] to-[#EAF4EC] px-6 py-20 md:flex-row md:px-12">
        <div className="md:w-1/2 space-y-6">
          <p className="inline-flex rounded-full border border-[#DCE8DE] bg-white/80 px-4 py-1.5 text-sm font-semibold text-[#166534] shadow-sm">
            A better way to work together
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#14532D] md:text-6xl">
            Build. Collaborate.
            <span className="block text-[#166534]">Get Hired.</span>
          </h1>
          <p className="max-w-xl text-lg leading-8 text-[#52705D] md:text-xl">
            Connect with talented professionals, discover meaningful projects, and turn your skills into real opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/projects" className="rounded-xl bg-[#D4AF37] px-5 py-3 text-center font-semibold text-[#14532D] shadow-md shadow-[#D4AF37]/20 transition hover:-translate-y-0.5 hover:bg-[#E6C766]">Find Projects</a>
            <a href="/register" className="rounded-xl border border-[#DCE8DE] bg-white/80 px-5 py-3 text-center font-semibold text-[#315B3F] transition hover:border-[#D4AF37] hover:text-[#14532D]">Start Freelancing</a>
          </div>
        </div>
          {/* Animated freelancers illustration */}
          <div className="md:w-1/2 flex justify-center items-center overflow-hidden relative h-64">
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="freelancer-icon absolute text-[#166534]"
                  style={{
                    width: '40px',
                    height: '40px',
                    left: `${10 + i * 18}%`,
                    animationDelay: `${i}s`,
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                  <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                </svg>
              ))}
            </div>
          </div>
          {/* Inline CSS for continuous animation */}
          <style>{`\n            @keyframes floatUp {\n              0% { transform: translateY(100%); opacity: 0; }\n              30% { opacity: 1; }\n              100% { transform: translateY(-100%); opacity: 0; }\n            }\n            .freelancer-icon { animation: floatUp 8s linear infinite; }\n          `}</style>
      </section>

      {/* STATS SECTION */}
      <section className="bg-[#F8FBF8] py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-12 text-center">
          {[
            { label: "10K+ Freelancers", value: "10K+" },
            { label: "5K+ Projects", value: "5K+" },
            { label: "2K+ Successful Contracts", value: "2K+" },
            { label: "98% Client Satisfaction", value: "98%" },
          ].map((item) => (
            <div key={item.label} className="border border-[#DCE8DE] rounded-xl py-6 bg-[#F1F7F1] hover:shadow-md transition-shadow">
              <p className="text-2xl font-semibold text-[#D4AF37]">{item.value}</p>
              <p className="mt-2 text-[#52705D]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#14532D]">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Create Your Profile", desc: "Show your skills, experience and portfolio." },
            { step: "02", title: "Discover Projects", desc: "Find projects that match your expertise." },
            { step: "03", title: "Send Proposals", desc: "Submit proposals and connect with clients." },
            { step: "04", title: "Get Hired", desc: "Collaborate, complete projects and grow your reputation." },
          ].map((item) => (
            <div key={item.step} className="bg-[#F1F7F1] rounded-xl p-6 border border-[#DCE8DE] hover:border-[#D4AF37] transition-colors">
              <div className="text-2xl font-bold text-[#D4AF37] mb-2">{item.step}</div>
              <h3 className="text-xl font-semibold text-[#14532D] mb-2">{item.title}</h3>
              <p className="text-[#52705D]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section className="bg-[#F8FBF8] py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#14532D]">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "AI-Powered Resume Analyzer", desc: "Leverage AI to evaluate and improve resumes.", skills: "Node.js, TensorFlow", budget: "$500", status: "Open" },
            { title: "Modern E-Commerce Platform", desc: "Build a scalable online store.", skills: "React, Node.js, Stripe", budget: "$2000", status: "Open" },
            { title: "3D Product Landing Page", desc: "Create an interactive 3D showcase.", skills: "Three.js, CSS3", budget: "$800", status: "Open" },
          ].map((proj) => (
            <div key={proj.title} className="bg-[#F1F7F1] rounded-xl p-6 border border-[#DCE8DE] hover:border-[#D4AF37] transition-colors">
              <h3 className="text-xl font-semibold text-[#14532D] mb-2">{proj.title}</h3>
              <p className="text-[#52705D] mb-2">{proj.desc}</p>
              <p className="text-[#52705D] text-sm"><strong>Skills:</strong> {proj.skills}</p>
              <p className="text-[#52705D] text-sm"><strong>Budget:</strong> {proj.budget}</p>
              <p className="text-[#52705D] text-sm mb-4"><strong>Status:</strong> {proj.status}</p>
              <Button>
                <a href="#" className="block text-[#14532D]">View Project</a>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#14532D]">Everything You Need to Freelance Better</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Secure & Reliable", desc: "Protected authentication and secure project workflows." },
            { title: "Find Better Opportunities", desc: "Discover projects based on your skills." },
            { title: "Real-Time Collaboration", desc: "Communicate and work with clients efficiently." },
            { title: "Build Your Reputation", desc: "Create a professional profile and grow your portfolio." },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#F1F7F1] rounded-xl p-6 border border-[#DCE8DE] hover:border-[#D4AF37] transition-colors">
              <div className="text-2xl font-bold text-[#D4AF37] mb-2">0{idx + 1}</div>
              <h3 className="text-xl font-semibold text-[#14532D] mb-2">{item.title}</h3>
              <p className="text-[#52705D]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#F8FBF8] py-20 text-center">
        <h2 className="text-3xl font-bold text-[#14532D] mb-4">Ready to turn your skills into opportunities?</h2>
        <p className="text-[#52705D] mb-6">Join a growing community of freelancers and clients building great things together.</p>
        <Button>
          <a href="/register" className="block text-[#14532D]">Get Started</a>
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#FFFFFF] py-8 px-6 md:px-12 text-[#52705D]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[#14532D] font-semibold mb-2">Freelancer Platform</h3>
            <p>Premium marketplace connecting top talent with impactful projects.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-[#14532D]">Navigation</h4>
            <ul>
              <li><a href="/" className="hover:text-[#D4AF37]">Home</a></li>
              <li><a href="/projects" className="hover:text-[#D4AF37]">Projects</a></li>
              <li><a href="/login" className="hover:text-[#D4AF37]">Login</a></li>
              <li><a href="/register" className="hover:text-[#D4AF37]">Register</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-[#14532D]">© 2026 Freelancer Platform</h4>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;