import { Link } from 'react-router'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './LegalPages.css'

export default function TermsPage() {
  return (
    <>
      <MarketingHeader />
      <div className="legal-page">
        <div className="legal-page__container">
          <div className="legal-page__shell">
            <aside className="legal-page__sidebar">
              <p className="legal-page__sidebarTitle">On this page</p>
              <nav className="legal-page__sidebarLinks" aria-label="Terms sections">
                <a href="#eligibility">Eligibility and accounts</a>
                <a href="#service-scope">Service scope</a>
                <a href="#acceptable-use">Acceptable use</a>
                <a href="#billing">Fees and billing</a>
                <a href="#liability">Liability</a>
                <a href="#contact">Contact</a>
              </nav>
            </aside>

          <article className="legal-page__card">
            <p className="legal-page__eyebrow">Legal</p>
            <h1>Terms and Conditions</h1>
            <p className="legal-page__updated">Last updated: April 12, 2026</p>

            <p>
              These Terms and Conditions govern your access to and use of Coodra services. By creating an account or using Coodra, you agree to these Terms.
              If you do not agree, do not use the service. Contact us at <a href="mailto:admin@coodra.com">admin@coodra.com</a>.
            </p>
            <p className="legal-page__highlight">
              Coodra provides decision support software. Final operational and purchasing decisions remain your responsibility.
            </p>

            <section id="eligibility">
              <h2>1. Eligibility and Accounts</h2>
              <ul>
                <li>You must be authorized to bind your business organization to these Terms.</li>
                <li>You are responsible for account credentials and all activity under your account.</li>
                <li>You must provide accurate information and keep it up to date.</li>
              </ul>
            </section>

            <section id="service-scope">
              <h2>2. Service Scope</h2>
              <p>
                Coodra provides software and decision-support recommendations based on retail data signals. Recommendations are informational and do not replace independent business judgment.
              </p>
            </section>

            <section id="acceptable-use">
              <h2>3. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use Coodra for unlawful, fraudulent, abusive, or deceptive purposes.</li>
                <li>Attempt unauthorized access to systems, accounts, or data.</li>
                <li>Interfere with platform security, integrity, or performance.</li>
                <li>Reverse engineer or copy proprietary service components except as permitted by law.</li>
              </ul>
            </section>

            <section>
              <h2>4. Data and Privacy</h2>
              <p>
                Your use of Coodra is also governed by our <Link to="/privacy">Privacy Policy</Link>. You represent that you have rights and authority to provide any business data you connect to Coodra.
              </p>
            </section>

            <section id="billing">
              <h2>5. Fees and Billing</h2>
              <p>
                If you purchase paid features, fees and billing terms will be presented at checkout or in a separate order form. Unless stated otherwise, fees are non-refundable except where required by law.
              </p>
            </section>

            <section>
              <h2>6. Intellectual Property</h2>
              <ul>
                <li>Coodra and its underlying software, models, and content are owned by Coodra or its licensors.</li>
                <li>Subject to these Terms, we grant you a limited, non-exclusive, non-transferable right to use the service for your internal business use.</li>
              </ul>
            </section>

            <section>
              <h2>7. Third-Party Services</h2>
              <p>
                Coodra may connect with third-party systems (for example POS and commerce platforms). Your use of those services is governed by their own terms and privacy policies.
              </p>
            </section>

            <section>
              <h2>8. Disclaimers</h2>
              <p>
                Coodra is provided “as is” and “as available.” To the maximum extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <section id="liability">
              <h2>9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Coodra is not liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits, revenue, or data.
                Our aggregate liability is limited to the amounts paid to Coodra for the service in the twelve (12) months before the claim.
              </p>
            </section>

            <section>
              <h2>10. Indemnity</h2>
              <p>
                You agree to indemnify and hold Coodra harmless from claims, damages, and costs arising from your misuse of the service, violation of these Terms, or violation of applicable law.
              </p>
            </section>

            <section>
              <h2>11. Suspension and Termination</h2>
              <p>
                We may suspend or terminate access for material violations, security risk, or legal compliance reasons. You may stop using Coodra at any time.
              </p>
            </section>

            <section>
              <h2>12. Governing Law</h2>
              <p>
                These Terms are governed by the laws of Ontario, Canada and applicable federal laws of Canada, without regard to conflict of law principles, subject to mandatory consumer protection laws.
              </p>
            </section>

            <section>
              <h2>13. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Continued use after updates means you accept the revised Terms.
              </p>
            </section>

            <section id="contact">
              <h2>14. Contact</h2>
              <p>
                Questions about these Terms: <a href="mailto:admin@coodra.com">admin@coodra.com</a>
              </p>
            </section>
            </article>
          </div>
        </div>
      </div>
      <MarketingFooter />
    </>
  )
}
