import MarketingHeader from '../components/MarketingHeader'
import './LegalPages.css'

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <MarketingHeader />

        <div className="legal-page__shell">
          <aside className="legal-page__sidebar">
            <p className="legal-page__sidebarTitle">On this page</p>
            <nav className="legal-page__sidebarLinks" aria-label="Privacy sections">
              <a href="#info-collect">Information we collect</a>
              <a href="#how-use">How we use information</a>
              <a href="#consent-comms">Consent and communications</a>
              <a href="#service-providers">Service providers</a>
              <a href="#rights">Your rights</a>
              <a href="#contact">Contact</a>
            </nav>
          </aside>

          <article className="legal-page__card">
            <p className="legal-page__eyebrow">Legal</p>
            <h1>Privacy Policy</h1>
            <p className="legal-page__updated">Last updated: April 12, 2026</p>

            <p>
              This Privacy Policy explains how Coodra collects, uses, discloses, and protects personal information when you use our website and services.
              If you have questions, contact us at <a href="mailto:admin@coodra.com">admin@coodra.com</a>.
            </p>
            <p className="legal-page__highlight">
              Coodra is designed for business users. We process retail operational data to provide decision support, while keeping people in control of final actions.
            </p>

            <section id="info-collect">
              <h2>1. Information We Collect</h2>
              <ul>
                <li>Account data: name, business name, email, login credentials.</li>
                <li>Business and platform data: POS, catalog, inventory, sales, and demand-related operational data you connect.</li>
                <li>Usage and technical data: device/browser details, IP address, logs, and service diagnostics.</li>
                <li>Communications: support requests, onboarding responses, and account emails.</li>
              </ul>
            </section>

            <section id="how-use">
              <h2>2. How We Use Information</h2>
              <ul>
                <li>Provide, maintain, and improve Coodra services and recommendations.</li>
                <li>Authenticate users, secure accounts, and prevent fraud/abuse.</li>
                <li>Communicate product, support, security, billing, and policy updates.</li>
                <li>Comply with legal obligations and enforce our Terms.</li>
              </ul>
            </section>

            <section id="consent-comms">
              <h2>3. Consent and Communications (Canada/US)</h2>
              <p>
                By creating an account, you consent to the collection and use described in this policy. Where required by law (including CASL in Canada and CAN-SPAM in the US),
                marketing emails are sent with required disclosures and an unsubscribe mechanism. You can opt out of non-essential marketing communications at any time.
              </p>
            </section>

            <section id="service-providers">
              <h2>4. Disclosure to Service Providers</h2>
              <p>
                We may share information with trusted processors and vendors who help us operate Coodra (for example hosting, authentication, analytics, support, and email delivery),
                under contractual confidentiality and data protection obligations.
              </p>
            </section>

            <section>
              <h2>5. Data Retention</h2>
              <p>
                We retain personal information only as long as needed for the purposes in this policy, to provide services, resolve disputes, enforce agreements, and meet legal requirements.
              </p>
            </section>

            <section>
              <h2>6. Security</h2>
              <p>
                We use administrative, technical, and organizational safeguards designed to protect data from unauthorized access, loss, misuse, or alteration.
                No method of transmission or storage is 100% secure.
              </p>
            </section>

            <section id="rights">
              <h2>7. Your Rights</h2>
              <ul>
                <li>Access and correction rights for personal information we hold about you.</li>
                <li>Withdraw consent (subject to legal/contractual limitations).</li>
                <li>Request deletion where applicable.</li>
                <li>
                  For certain US state residents (including California), rights may include: right to know categories/sources/uses of personal information,
                  right to delete, right to correct, and right to non-discrimination for exercising privacy rights.
                </li>
              </ul>
              <p>To submit a privacy request, email <a href="mailto:admin@coodra.com">admin@coodra.com</a>.</p>
            </section>

            <section>
              <h2>8. International Data Transfers</h2>
              <p>
                If you access Coodra from outside the country where data is processed, your information may be transferred across borders and handled under applicable legal safeguards.
              </p>
            </section>

            <section>
              <h2>9. Children&apos;s Privacy</h2>
              <p>
                Coodra is intended for business users and is not directed to children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2>10. Policy Updates</h2>
              <p>
                We may update this policy from time to time. Material updates will be posted on this page with a revised “Last updated” date.
              </p>
            </section>

            <section id="contact">
              <h2>11. Contact</h2>
              <p>
                Privacy questions and requests: <a href="mailto:admin@coodra.com">admin@coodra.com</a>
              </p>
            </section>
          </article>
        </div>
      </div>
    </div>
  )
}
