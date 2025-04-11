import { CompanyLogo } from "../../../assets";

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto p-6">
      <div className="flex items-center mb-8">
        <img
          src={CompanyLogo}
          alt="Hiringdog Logo"
          className="w-16 h-16 mr-4"
        />
        <div>
          <h1 className="text-base font-bold text-gray-800">
            PRIVACY POLICY
          </h1>
          <h2 className="text-base font-semibold text-gray-700">
            OF HIRINGDOG INTERVIEW PLATFORM (HDIP)
          </h2>
          <p className="text-gray-600 mt-1 text-sm">
            Effective Date: 01-April-2025
          </p>
          <p className="text-gray-600 text-sm">
            Last Updated: 07-April-2025
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 text-default">
          {`  This Privacy Policy describes how Adhyapan Education For Career Development Private
          Limited, operating under the brand Hiringdog Interview Platform (HDIP) ("we", "us", or "our"),
          collects, uses, stores, and protects your information when you access or use our services via
          our platform, website, or mobile applications (collectively, the "Platform").`}
        </p>
        <p className="text-gray-700 mt-2 text-default">
          By using our services, you agree to the terms of
          this Privacy Policy.
        </p>
      </div>

      {/* Section 1 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            1. INFORMATION WE COLLECT
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            We may collect and process the following
            categories of information from our clients:
          </p>
          <p className="my-2 text-xs font-semibold">
            a. Company Information
          </p>
          <ul className="list-disc pl-8 text-xs">
            <li className="my-1">
              Company name, type, and industry
            </li>
            <li className="my-1">
              Point of contact details (name, designation,
              email, phone number)
            </li>
            <li className="my-1">
              Billing and payment information
            </li>
          </ul>
          <p className="my-2 text-xs font-semibold">
            b. Usage Information
          </p>
          <ul className="list-disc pl-8 text-xs">
            <li className="my-1">
              Log data (IP address, browser type, access
              time)
            </li>
            <li className="my-1">
              Usage patterns and preferences on the platform
            </li>
          </ul>
          <p className="my-2 text-xs font-semibold">
            c. Candidate Data (Uploaded by Client)
          </p>
          <ul className="list-disc pl-8 text-xs">
            <li className="my-1">
              Candidate name, contact information, resume,
              job role details
            </li>
            <li className="my-1">
              Interview notes, recordings, and evaluation
              results
            </li>
          </ul>
          <p className="my-2 text-xs italic">
            Note: You must ensure that you have obtained
            consent from your candidates before sharing
            their personal information with HDIP.
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            2. PURPOSE OF DATA COLLECTION
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            We collect and process your data for the
            following legitimate purposes:
          </p>
          <ul className="list-disc pl-8 text-xs">
            <li className="my-1">
              To create and manage your HDIP client account
            </li>
            <li className="my-1">
              To facilitate and schedule interviews
            </li>
            <li className="my-1">
              To generate interview reports and analytics
            </li>
            <li className="my-1">
              For billing, invoicing, and customer support
            </li>
            <li className="my-1">
              To improve our services and platform
              functionality
            </li>
            <li className="my-1">
              To comply with legal or regulatory obligations
            </li>
          </ul>
        </div>
      </div>

      {/* Section 3 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            3. DATA SHARING AND DISCLOSURE
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            We do <span className="font-bold">not</span>{" "}
            sell your data. However, we may share
            information:
          </p>
          <ul className="list-disc pl-8 text-xs">
            <li className="my-1">
              With our interviewers or internal teams to
              fulfill interview requests
            </li>
            <li className="my-1">
              With third-party service providers (e.g.,
              payment gateways, cloud storage) under strict
              confidentiality
            </li>
            <li className="my-1">
              If required by law, regulation, or legal
              process
            </li>
            <li className="my-1">
              During a merger, acquisition, or asset sale
              (with notice, if applicable)
            </li>
          </ul>
        </div>
      </div>

      {/* Section 4 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            4. DATA SECURITY
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            We implement appropriate technical and
            organizational security measures to protect your
            data from unauthorized access, disclosure,
            alteration, or destruction, including:
          </p>
          <ul className="list-disc pl-8 text-xs">
            <li className="my-1">
              Role-based access controls
            </li>
            <li className="my-1">
              Encryption at rest and in transit
            </li>
            <li className="my-1">
              Regular security audits and monitoring
            </li>
          </ul>
          <p className="my-2 text-xs">
            However, no system is 100% secure. We encourage
            you to maintain confidentiality of your access
            credentials.
          </p>
        </div>
      </div>

      {/* Section 5 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            5. DATA RETENTION
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            We retain client data as long as your account is
            active and for a reasonable period thereafter
            for compliance, legal, and operational purposes.
            Candidate-related data is retained per the
            agreed duration in your service contract or
            until deletion is requested.
          </p>
        </div>
      </div>

      {/* Section 6 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            6. YOUR RIGHTS
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            As a client, you have the right to:
          </p>
          <ul className="list-disc pl-8 text-xs">
            <li className="my-1">
              Request access to your data
            </li>
            <li className="my-1">
              Request correction of inaccurate or outdated
              information
            </li>
            <li className="my-1">
              Request deletion of your account and
              associated data (subject to contract
              obligations)
            </li>
            <li className="my-1">
              Withdraw consent (where processing is based on
              consent)
            </li>
          </ul>
          <p className="my-2 text-xs">
            You may email us at{" "}
            <span className="font-medium">
              contact@hiringdog.com
            </span>{" "}
            for any such requests.
          </p>
        </div>
      </div>

      {/* Section 7 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            7. COOKIES AND TRACKING
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            We use cookies and tracking technologies to
            enhance your experience and understand platform
            usage. You can modify your browser settings to
            control cookie usage.
          </p>
        </div>
      </div>

      {/* Section 8 (Skipped in the PDF, but keeping the numbering consistent for section 9) */}

      {/* Section 9 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            {` 9. CHILDREN'S PRIVACY`}
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            Our platform and services are not intended for
            individuals under 18 years of age. We do not
            knowingly collect personal information from
            minors.
          </p>
        </div>
      </div>

      {/* Section 10 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            10. CHANGES TO THIS POLICY
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            We may update this Privacy Policy from time to
            time. Any changes will be effective upon posting
            on our Platform. Continued use of our services
            indicates your acceptance of the revised policy.
          </p>
        </div>
      </div>

      {/* Section 11 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            11. CONTACT US
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            If you have any questions or concerns regarding
            this Privacy Policy or your data, you may
            contact:
          </p>
          <div className="my-2 text-xs pl-4">
            <p>
              <strong>Data Protection Officer</strong>
            </p>
            <p>
              Adhyapan Education For Career Development
              Private Limited (HDIP)
            </p>
            <p>Email: sumit.dey@hiringdog.com</p>
            <p>Phone: 8018863521</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700 font-semibold text-sm">
          By using HDIP, the Client acknowledges and agrees
          to this Privacy Policy.
        </p>
      </div>

      <div className="mt-6 text-2xs text-gray-500">
        <p>
          Adhyapan Education For Career Development Private
          Limited, GSTIN: 29AAZCA1833B1ZK
        </p>
        <p>
          #677, Spacelance, 1st Floor, 13th Cross, 27th Main
          Rd, 1st Sector, HSR Layout, Bengaluru, Karnataka
          560102
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
