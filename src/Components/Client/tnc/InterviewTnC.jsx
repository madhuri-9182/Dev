import { CompanyLogo } from "../../../assets";

const InterviewerTermsAndConditions = () => {
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
            TERMS AND CONDITIONS AGREEMENT
          </h1>
          <h2 className="text-base font-semibold text-gray-700">
            ON HIRINGDOG INTERVIEW PLATFORM (HDIP)
          </h2>
          <p className="text-gray-600 mt-1 text-sm">
            Last Updated: 5th April 2025
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 text-default">
          {`These Terms and Conditions ("Terms") govern your use of the Hiringdog Interview Platform
          ("HDIP"), including websites, mobile applications, and any other digital platform (collectively the
          "Platform") as an Interviewer. These Terms should be read in conjunction with HDIP's Privacy Policy available at`}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() =>
              window.open(
                "https://hiringdog-assets.s3.ap-south-1.amazonaws.com/Privacy+Policy.pdf",
                "_blank"
              )
            }
          >
            {" "}
            [link]
          </span>
          .
        </p>
      </div>

      {/* Section 1 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            1. SCOPE AND APPLICABILITY
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            {`1.1 These Terms apply to all individuals accessing the Platform as interviewers, regardless of the device or
            internet-enabled resource used (each a "Device"). By accessing the Platform, you acknowledge that you have read,
            understood, and agreed to be bound by these Terms, the Privacy Policy, and any other applicable policies of HDIP.`}
          </p>
          <p className="my-2 text-xs">
            1.2 These Terms govern your rights and
            obligations in using the Platform as an
            interviewer and are in addition to any other
            valid legal contract you may have executed with
            HDIP for providing interview services.
          </p>
          <p className="my-2 text-xs">
            1.3 HDIP reserves all rights in relation to the
            Platform that are not expressly granted in these
            Terms.
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            2. REGISTRATION AND ACCESS
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            2.1 To be an interviewer on HDIP, you must
            register on the Platform and provide accurate,
            up-to-date information about your professional
            background and qualifications.
          </p>
          <p className="my-2 text-xs">
            2.2 HDIP reserves the right to verify your
            credentials, conduct background checks, and
            approve or reject your application at its sole
            discretion.
          </p>
          <p className="my-2 text-xs">
            2.3 You are responsible for safeguarding your
            login credentials and are solely responsible for
            activities conducted under your account.
          </p>
          <p className="my-2 text-xs">
            2.4 If HDIP determines that inaccurate or
            misleading information has been provided, it
            reserves the right to suspend or terminate your
            access to the Platform.
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            3. ROLE AND RESPONSIBILITIES OF INTERVIEWERS
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            {` 3.1 Interviewers must conduct interviews professionally, impartially, and in accordance with HDIP's
            interview guidelines and standards.`}
          </p>
          <p className="my-2 text-xs">3.2 You agree to:</p>
          <ul className="list-disc pl-8 text-xs">
            <li className="mb-1">
              Conduct scheduled interviews on time and in a
              professional manner.
            </li>
            <li className="mb-1">
              Provide fair, unbiased, and constructive
              feedback on candidates.
            </li>
            <li className="mb-1">
              Maintain confidentiality of all candidate
              information and assessment reports.
            </li>
            <li className="mb-1">
              Not engage in any form of discrimination,
              harassment, or unprofessional conduct during
              interviews.
            </li>
          </ul>
          <p className="my-2 text-xs">
            {`  3.3 Failure to adhere to HDIP's interview standards may result in termination of your access to the
            Platform.`}
          </p>
        </div>
      </div>

      {/* Section 4 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            4. PAYMENT TERMS
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            4.1 Interviewers will be compensated based on
            the rates agreed upon with HDIP, as per the
            terms outlined in separate agreements or
            contracts.
          </p>
          <p className="my-2 text-xs">
            {` 4.2 Payments will be processed within the stipulated timeframe as per HDIP's payment cycle.`}
          </p>
          <p className="my-2 text-xs">
            4.3 In case of disputes regarding payment,
            interviewers must notify HDIP within 7 days of
            receiving payment.
          </p>
          <p className="my-2 text-xs">
            4.4 HDIP reserves the right to withhold payment
            in case of any breach of these Terms.
          </p>
        </div>
      </div>

      {/* Section: Feedback Submission Timelines and Penalty Clause */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-red-600">
            FEEDBACK SUBMISSION TIMELINES AND PENALTY CLAUSE
          </h3>
        </div>
        <div className="mt-2 text-gray-800">
          <h4 className="text-xs font-semibold mb-2 text-red-600">
            AI Feedback Generation Process
          </h4>
          <p className="my-2 text-xs text-red-600">
            The Hiringdog Interview Platform (HDIP) utilizes
            AI to generate structured feedback forms based
            on the interview recordings. This process
            generally takes up to 100 minutes post-interview
            completion. Once the AI-generated feedback form
            is ready, the interviewer receives an email
            notification.
          </p>

          <h4 className="text-xs font-semibold mb-2 mt-3 text-red-600">
            Required Feedback Submission Timeline
          </h4>
          <p className="my-2 text-xs font-medium text-red-600">
            Interviewers are requested to submit their final
            feedback{" "}
            <span className="text-red-600 font-semibold">
              within one (1) hour
            </span>{" "}
            of receiving the AI-generated form to ensure a
            prompt and high-quality experience for the
            candidate and client.
          </p>

          <h4 className="text-xs font-semibold mb-2 mt-3 text-red-600">
            Penalty for Delay in Feedback Submission
          </h4>
          <p className="my-2 text-xs text-red-600">
            Any delay in submitting the feedback beyond the
            permitted window will result in a{" "}
            <span className="text-red-600 font-semibold">
              monetary penalty
            </span>
            {`, which will be deducted from the interviewer's
            payout. This clause is enforced to ensure timely
            delivery to clients, as delays may result in
            penalties being levied on HDIP.`}
          </p>

          <h4 className="text-xs font-semibold mb-2 mt-3 text-red-600">
            Penalty Structure
          </h4>
          <p className="my-2 text-xs text-red-600">
            The applicable penalties based on the time delay
            post-AI feedback generation are as follows:
          </p>
          <div className="overflow-x-auto my-3">
            <table className="min-w-full bg-white border border-gray-700 text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-700 px-3 py-2 text-left text-gray-800">
                    Delay Duration (Post AI Feedback
                    Generation)
                  </th>
                  <th className="border border-gray-700 px-3 py-2 text-left text-gray-800">
                    Penalty Amount (INR)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-100">
                  <td className="border border-gray-700 px-3 py-2">
                    AI + 60 Minutes
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    ₹0
                  </td>
                </tr>
                <tr className="bg-red-100">
                  <td className="border border-gray-700 px-3 py-2">
                    1 – 2 Hours
                  </td>
                  <td className="border border-gray-700 px-3 py-2 text-red-600">
                    ₹100
                  </td>
                </tr>
                <tr className="bg-red-100">
                  <td className="border border-gray-700 px-3 py-2">
                    2 – 3 Hours
                  </td>
                  <td className="border border-gray-700 px-3 py-2 text-red-600">
                    ₹300
                  </td>
                </tr>
                <tr className="bg-red-100">
                  <td className="border border-gray-700 px-3 py-2">
                    3 – 5 Hours
                  </td>
                  <td className="border border-gray-700 px-3 py-2 text-red-600">
                    ₹500
                  </td>
                </tr>
                <tr className="bg-red-100">
                  <td className="border border-gray-700 px-3 py-2">
                    5 – 8 Hours
                  </td>
                  <td className="border border-gray-700 px-3 py-2 text-red-600">
                    ₹700
                  </td>
                </tr>
                <tr className="bg-red-100">
                  <td className="border border-gray-700 px-3 py-2">
                    8+ Hours
                  </td>
                  <td className="border border-gray-700 px-3 py-2 text-red-600">
                    ₹1000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-xs font-semibold mb-2 mt-3 text-red-600">
            Special Timing Consideration for Late Evening
            Interviews
          </h4>
          <p className="my-2 text-xs text-red-600">
            If the interview ends after 8:30 PM, the time
            window between 11:00 PM and 9:00 AM is
            considered a grace period and is excluded from
            the feedback delay calculation. The feedback
            time will be counted starting from 9:00 AM the
            following day.
          </p>

          <h4 className="text-xs font-semibold mb-2 mt-3 text-red-600">
            Examples:
          </h4>
          <p className="my-2 text-xs font-semibold text-red-600">
            Scenario 1:
          </p>
          <ul className="list-disc pl-8 text-xs text-red-600">
            <li className="mb-1">
              Interview ends at 8:00 PM
            </li>
            <li className="mb-1">
              AI feedback form is generated by 10:00 PM
            </li>
            <li className="mb-1">
              The first hour post-feedback generation (AI +
              60 mins) = 10:00 PM – 11:00 PM
            </li>
            <li className="mb-1">
              The next penalty bracket (1–2 hrs) = 9:00 AM –
              10:00 AM (next day), and so on.
            </li>
          </ul>

          <p className="my-2 text-xs font-semibold mt-3 text-red-600">
            Scenario 2:
          </p>
          <ul className="list-disc pl-8 text-xs text-red-600">
            <li className="mb-1">
              Interview ends at 10:00 PM
            </li>
            <li className="mb-1">
              AI feedback form is generated at 12:00 AM
            </li>
            <li className="mb-1">
              AI + 60 mins will be counted from 9:00 AM –
              10:00 AM (next day)
            </li>
            <li className="mb-1">
              1–2 hours delay will be counted as 10:00 AM –
              11:00 AM, and so on.
            </li>
          </ul>

          <h4 className="text-xs font-semibold mb-2 mt-3 text-red-600">
            Acknowledgment and Acceptance
          </h4>
          <p className="my-2 text-xs text-red-600">
            By signing this agreement, the interviewer
            acknowledges the importance of timely feedback
            submission and agrees to the penalty terms
            outlined above.
          </p>
        </div>
      </div>

      {/* Section 5 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            5. CONFIDENTIALITY AND DATA PRIVACY
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            {`  5.1 Interviewers must keep all candidate information and interview reports confidential and must not share
            or disclose any details to third parties without HDIP's explicit consent.`}
          </p>
          <p className="my-2 text-xs">
            5.2 Any misuse of candidate data will lead to
            immediate termination of access and potential
            legal action.
          </p>
          <p className="my-2 text-xs">
            5.3 HDIP processes personal data in accordance
            with its Privacy Policy and applicable data
            protection laws.
          </p>
        </div>
      </div>

      {/* Section 6 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            6. INTELLECTUAL PROPERTY RIGHTS
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            6.1 All interview reports, evaluations, and
            feedback provided through HDIP remain the
            intellectual property of HDIP.
          </p>
          <p className="my-2 text-xs">
            6.2 Interviewers are prohibited from using,
            reproducing, or distributing any reports or
            assessments outside of the HDIP platform.
          </p>
        </div>
      </div>

      {/* Section 7 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            7. TERMINATION OF ACCESS
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            {`  7.1 HDIP reserves the right to terminate or suspend an interviewer's access to the Platform for any
            breach of these Terms.`}
          </p>
          <p className="my-2 text-xs">
            {`  7.2 Interviewers may voluntarily discontinue their association with HDIP by providing 7 days' notice.`}
          </p>
          <p className="my-2 text-xs">
            7.3 HDIP may also terminate access if required
            by legal authorities or regulatory bodies.
          </p>
        </div>
      </div>

      {/* Section 8 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            8. LIMITATION OF LIABILITY
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            {`  8.1 To the extent permitted by law, HDIP shall not be liable for any indirect, incidental, or consequential
            damages arising from an interviewer's use of the Platform.`}
          </p>
          <p className="my-2 text-xs">
            {`  8.2 HDIP's total liability for any claims shall not exceed the total amount paid to the interviewer in the last
            12 months.`}
          </p>
        </div>
      </div>

      {/* Section 9 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            9. DISPUTE RESOLUTION
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            9.1 Any disputes shall first be resolved through
            mutual discussions within 15 business days of
            notification.
          </p>
          <p className="my-2 text-xs">
            9.2 If unresolved, disputes shall be settled
            through arbitration in accordance with the Law
            of India in Bangalore Location.
          </p>
          <p className="my-2 text-xs">
            9.3 The governing law for this Agreement shall
            be the laws of India.
          </p>
        </div>
      </div>

      {/* Section 10 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            10. AMENDMENTS
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            10.1 HDIP reserves the right to update these
            Terms at any time. Interviewers will be notified
            of significant changes.
          </p>
          <p className="my-2 text-xs">
            10.2 Continued use of the Platform constitutes
            acceptance of revised Terms.
          </p>
        </div>
      </div>

      {/* Section 11 */}
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            11. CONTACT INFORMATION
          </h3>
        </div>
        <div className="mt-2 text-gray-700">
          <p className="my-2 text-xs">
            For any queries regarding these Terms, please
            contact:
          </p>
          <div className="my-2 text-xs pl-4">
            <p>
              <strong>
                HDIP (Hiringdog Interview Platform)
              </strong>
            </p>
            <p>
              Adhyapan Education For Career Development
              Private Limited
            </p>
            <p>
              #677, Spacelance, 1st Floor, 13th Cross, 27th
              Main Rd, 1st Sector, HSR Layout, Bengaluru,
              Karnataka 560102
            </p>
            <p>Email: contact@hiringdog.com</p>
            <p>Phone Number: +91-9916864727</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700 font-semibold text-sm">
          By using HDIP as an Interviewer, you acknowledge
          and agree to these Terms and Conditions.
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

export default InterviewerTermsAndConditions;
