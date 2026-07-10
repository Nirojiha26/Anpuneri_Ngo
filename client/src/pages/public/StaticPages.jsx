import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useSelector } from 'react-redux';

// ── Mission Page ────────────────────────────────────────────────
export const MissionPage = () => (
  <div>
    <div className="page-header">
      <div className="container-custom text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Our Mission</h1>
      </div>
    </div>
    <div className="container-custom py-16 max-w-3xl">
      <div className="prose prose-lg max-w-none">
        <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-xl mb-8">
          <p className="text-xl font-semibold text-primary-800 italic leading-relaxed">
            "To empower under-resourced individuals and families through education, healthcare, and emergency support — enabling them to build lives of dignity, independence, and hope."
          </p>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Our mission drives every program, every partnership, and every dollar we spend. We focus on the root causes of poverty — lack of education, limited healthcare access, and vulnerability to crises — and address them directly.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          Education is at our core. We believe that when a child stays in school, the entire trajectory of their family changes. Our programs remove every financial barrier that stands between a student and their education.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Three Pillars</h2>
        <div className="grid gap-4">
          {[
            { icon: '📚', title: 'Education Access', desc: 'Scholarships, school supplies, tutoring, and digital literacy to ensure every child can learn.' },
            { icon: '🏥', title: 'Health & Wellbeing', desc: 'Free health camps, nutritional support, and medical referrals for families who cannot afford care.' },
            { icon: '🆘', title: 'Emergency Response', desc: 'Immediate aid for families struck by disasters, providing food, shelter, and recovery support.' },
          ].map((p) => (
            <div key={p.title} className="card p-5 flex gap-4">
              <span className="text-3xl">{p.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-4">
          <Link to="/projects" className="btn-primary">See Our Projects</Link>
          <Link to="/about" className="btn-outline">About Us</Link>
        </div>
      </div>
    </div>
  </div>
);

// ── Vision Page ────────────────────────────────────────────────
export const VisionPage = () => (
  <div>
    <div className="page-header">
      <div className="container-custom text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Our Vision</h1>
      </div>
    </div>
    <div className="container-custom py-16 max-w-3xl">
      <div className="bg-secondary-50 border-l-4 border-secondary-600 p-6 rounded-xl mb-8">
        <p className="text-xl font-semibold text-secondary-800 italic leading-relaxed">
          "A world where every person — regardless of where they were born or how little they have — has the opportunity to learn, grow, and thrive."
        </p>
      </div>
      <p className="text-gray-600 leading-relaxed mb-4">
        We envision communities where children don't have to choose between education and survival. Where a medical emergency doesn't push a family into permanent poverty. Where the next generation rises on merit — not on the luck of circumstance.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        We know we can't solve everything at once. But we believe that by building strong local programs, developing trusted community partnerships, and inspiring generous giving — we move consistently closer to that world.
      </p>
      <p className="text-gray-600 leading-relaxed">
        Every scholarship awarded, every supply kit distributed, every health camp run brings us closer. Our vision is ambitious — and that is exactly the point.
      </p>
      <div className="mt-8">
        <Link to="/about" className="btn-primary">About Us</Link>
      </div>
    </div>
  </div>
);

// ── 404 Page ────────────────────────────────────────────────
export const NotFoundPage = () => (
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="text-8xl font-bold text-primary-100 mb-4 font-heading">404</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/" className="btn-primary">
          <FiArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <Link to="/contact" className="btn-outline">Contact Us</Link>
      </div>
    </div>
  </div>
);

// ── Privacy Page ────────────────────────────────────────────────
export const PrivacyPage = () => (
  <div>
    <div className="page-header">
      <div className="container-custom text-center">
        <h1 className="text-4xl font-bold text-white font-heading mb-2">Privacy Policy</h1>
        <p className="text-primary-200">Last updated: January 2024</p>
      </div>
    </div>
    <div className="container-custom py-16 max-w-3xl">
      <div className="prose prose-lg max-w-none space-y-8">
        {[
          { title: 'Information We Collect', content: 'We collect information you provide directly, such as when you donate, apply to volunteer, or contact us. This may include name, email, phone number, and payment details for donations.' },
          { title: 'How We Use Your Information', content: 'We use your information to process donations, send receipts, communicate about your volunteer application, respond to inquiries, and send occasional updates about our programs (with your consent).' },
          { title: 'Information Sharing', content: 'We do not sell, trade, or rent your personal information. We may share information with trusted service providers who assist our operations, subject to strict confidentiality agreements.' },
          { title: 'Data Security', content: 'We implement industry-standard security measures to protect your personal information. Payment information is processed through encrypted connections and we do not store credit card details on our servers.' },
          { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal information at any time. Contact us at privacy@ngo.org to exercise these rights.' },
          { title: 'Contact Us', content: 'If you have questions about this Privacy Policy, please contact us at privacy@ngo.org or at our office address listed on the Contact page.' },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
            <p className="text-gray-600 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Terms Page ────────────────────────────────────────────────
export const TermsPage = () => {
  const { data: settings } = useSelector((s) => s.settings);

  return (
  <div>
    <div className="page-header">
      <div className="container-custom text-center">
        <h1 className="text-4xl font-bold text-white font-heading mb-2">Terms of Service</h1>
        <p className="text-primary-200">Last updated: January 2024</p>
      </div>
    </div>
    <div className="container-custom py-16 max-w-3xl">
      <div className="space-y-8">
        {[
          { title: 'Acceptance of Terms', content: 'By accessing and using our website, you accept and agree to be bound by these Terms of Service and our Privacy Policy.' },
          { title: 'Donations', content: 'All donations are voluntary and non-refundable unless there has been an error. Donations are used to fund our programs and operations. We are a registered non-profit and provide tax receipts where applicable.' },
          { title: 'Volunteer Applications', content: 'Volunteer applications are subject to review and approval. We reserve the right to accept or decline applications. Volunteering is governed by our separate Volunteer Agreement.' },
          { title: 'Intellectual Property', content: `All content on this website, including text, images, and logos, is the property of ${settings?.org_name || 'Anpuneri'} and may not be reproduced without written permission.` },
          { title: 'Limitation of Liability', content: 'We are not liable for any indirect, incidental, or consequential damages arising from your use of our website or services.' },
          { title: 'Changes to Terms', content: 'We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.' },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
            <p className="text-gray-600 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};
