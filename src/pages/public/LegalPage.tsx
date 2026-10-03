import { Link } from 'react-router-dom';

const CONTACT_EMAIL = 'codewave.studio.tech@gmail.com';
type Section = { heading: string; paragraphs?: string[]; bullets?: string[] };

const policies: Record<string, { title: string; updated: string; intro: string; sections: Section[] }> = {
  privacy: {
    title: 'Privacy Policy', updated: 'September 30, 2026',
    intro: 'This policy explains how Codewave Studio handles personal information when you use our website, create an account, contact us, or order a service.',
    sections: [
      { heading: 'Information we collect', bullets: ['Account details such as your name and email address.', 'Order details such as your selected package, business name, preferred domain, project requirements, status, and price.', 'Payment evidence, including payment-slip images that you choose to upload.', 'Contact-form details: your name, email address, and message.', 'Authentication details and a copy of your profile photo supplied by Google if you choose Google sign-in. We do not receive your Google password.'] },
      { heading: 'Why we use it', paragraphs: ['We use this information to create and secure your account, respond to inquiries, provide and manage projects, verify payments, communicate about your order, and operate the site. We do not sell or rent personal information.'] },
      { heading: 'Storage and service providers', paragraphs: ['Account, order, contact, and uploaded payment-slip data is stored and processed using Supabase. The website is hosted on Vercel, which may process basic request information such as IP address, browser details, and server logs to deliver and protect the site. Google processes information when you choose Google sign-in.'] },
      { heading: 'Retention and security', paragraphs: ['We keep information only as long as reasonably needed to provide the service, meet legal or accounting duties, resolve disputes, and prevent abuse. No internet service can promise absolute security, but we use access controls and authenticated storage rules intended to restrict customer data to the customer and authorized administrators.'] },
      { heading: 'Your choices and deletion', paragraphs: ['You may delete your account from the profile menu by selecting “Delete my account.” This removes your profile, orders, and uploaded payment slips. To request deletion or correction of contact messages or other information not linked to your account, email us at the address below. We may retain limited records when the law requires it.'] },
      { heading: 'Children', paragraphs: ['Our services are not directed to children, and we do not knowingly collect children’s personal information.'] },
      { heading: 'Contact', paragraphs: [`For privacy questions or requests, email ${CONTACT_EMAIL}.`] },
    ],
  },
  terms: {
    title: 'Terms of Service', updated: 'September 30, 2026',
    intro: 'These terms apply when you use Codewave Studio’s website or purchase our web design, development, maintenance, or related services.',
    sections: [
      { heading: 'Services and scope', paragraphs: ['The selected package, written proposal, or agreed project brief defines the work. Custom work, third-party costs, and requests outside that scope require a separate written agreement or quote.'] },
      { heading: 'Prices and payment', paragraphs: ['Displayed fixed-package prices are the total Codewave Studio service price for the listed scope. Custom projects start at the displayed amount and require a quote before work begins. We will disclose and obtain approval for any additional work or third-party cost before charging it. Payment instructions and any milestones will be confirmed with you in writing.'] },
      { heading: 'Delivery and revisions', paragraphs: ['Published delivery times are good-faith estimates that begin after payment is verified and we receive all required content and decisions. Delays in feedback, content, approvals, or third-party services may change the schedule. Included revision rounds are shown on the Pricing page; extra revisions require agreement before work proceeds.'] },
      { heading: 'Your responsibilities', bullets: ['Provide accurate account and project information and keep login credentials secure.', 'Supply content and materials you have the right to use.', 'Review work and provide timely, specific feedback.', 'Notify us promptly of unauthorized account use.'] },
      { heading: 'Intellectual property', paragraphs: ['You keep ownership of materials you provide. Ownership or licensing of project deliverables will follow the applicable proposal or project agreement after required payments are complete. Third-party software, fonts, and assets remain subject to their own licences.'] },
      { heading: 'Limitation of liability', paragraphs: ['To the extent allowed by law, Codewave Studio is not liable for indirect, incidental, special, or consequential loss, lost profits, or issues caused by third-party platforms. Our total liability relating to a project will not exceed the amount you paid us for that project. Nothing here excludes liability that cannot legally be excluded.'] },
      { heading: 'Ending service', paragraphs: ['Either party may end a project for a material breach that is not corrected after reasonable notice. Refund eligibility is described in our Refund Policy.'] },
      { heading: 'Contact', paragraphs: [`Questions about these terms can be sent to ${CONTACT_EMAIL}.`] },
    ],
  },
  refund: {
    title: 'Refund Policy', updated: 'September 30, 2026',
    intro: 'These are provisional refund terms for Codewave Studio projects. Any project-specific written agreement takes priority where it says otherwise.',
    sections: [
      { heading: 'Before work starts', paragraphs: ['If you cancel before we have started project work, you may request a full refund, less any non-refundable payment-processing charges or third-party costs already incurred with your approval.'] },
      { heading: 'After work starts', paragraphs: ['Once work has started, payments for completed work and time already spent are non-refundable. At our discretion, we may refund the unused portion of a prepaid fee after deducting completed work, committed resources, and approved third-party costs.'] },
      { heading: 'Completed or delivered work', paragraphs: ['Payments are not refundable after the agreed deliverables have been completed or delivered. We will first try to correct a material failure to meet the written scope within a reasonable time.'] },
      { heading: 'Maintenance and recurring services', paragraphs: ['You may cancel future maintenance periods before renewal. A period that has already begun is normally non-refundable because capacity and monitoring are reserved for that period.'] },
      { heading: 'How to request a refund', paragraphs: [`Email ${CONTACT_EMAIL} with your account email, order reference, reason for the request, and relevant details. We aim to review requests within 10 business days. Approved refunds are returned through an agreed available method; processing time depends on the payment provider.`] },
    ],
  },
  cookies: {
    title: 'Cookie Policy', updated: 'September 30, 2026',
    intro: 'This policy explains the small amounts of browser storage used by the Codewave Studio website.',
    sections: [
      { heading: 'Essential authentication storage', paragraphs: ['Supabase authentication uses browser storage to keep you signed in securely and refresh your session. This is essential to provide customer and administrator account features.'] },
      { heading: 'Preference storage', paragraphs: ['We use localStorage to remember your light or dark theme, remember that you dismissed the cookie notice, and apply a short contact-form submission cooldown that helps reduce accidental duplicate messages.'] },
      { heading: 'Analytics and advertising', paragraphs: ['We do not currently use analytics, advertising, or marketing cookies. If we add non-essential analytics later, we will describe the provider and purpose here and request consent before enabling them where required.'] },
      { heading: 'Managing storage', paragraphs: ['You can clear cookies and localStorage using your browser settings. Clearing essential authentication storage will sign you out, and clearing preferences will reset them.'] },
      { heading: 'Contact', paragraphs: [`Questions about browser storage can be sent to ${CONTACT_EMAIL}.`] },
    ],
  },
};

export default function LegalPage({ policy }: { policy: keyof typeof policies }) {
  const content = policies[policy];
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <header className="mb-10 border-b border-[#CBD5E1] dark:border-[#1E3A5F] pb-8">
        <p className="text-sm font-semibold text-[#8A6A00] dark:text-[#F3C623]">Legal information</p>
        <h1 className="mt-2 text-4xl font-extrabold text-[#0B132B] dark:text-[#F9E79F]">{content.title}</h1>
        <p className="mt-3 text-sm text-[#405678] dark:text-[#B7C4DC]">Last updated: {content.updated}</p>
        <p className="mt-6 text-base leading-7 text-[#1E3A5F] dark:text-[#D7DEEC]">{content.intro}</p>
      </header>
      <div className="space-y-9">
        {content.sections.map((section) => <section key={section.heading}>
          <h2 className="text-xl font-bold text-[#0B132B] dark:text-[#F9E79F]">{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-3 leading-7 text-[#1E3A5F] dark:text-[#D7DEEC]">{paragraph}</p>)}
          {section.bullets && <ul className="mt-3 list-disc space-y-2 pl-6 text-[#1E3A5F] dark:text-[#D7DEEC]">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
        </section>)}
      </div>
      <p className="mt-12 border-t border-[#CBD5E1] dark:border-[#1E3A5F] pt-6 text-sm text-[#405678] dark:text-[#B7C4DC]">
        See also our <Link className="underline" to="/privacy">Privacy Policy</Link>, <Link className="underline" to="/terms">Terms of Service</Link>, <Link className="underline" to="/refund-policy">Refund Policy</Link>, and <Link className="underline" to="/cookies">Cookie Policy</Link>.
      </p>
    </article>
  );
}
