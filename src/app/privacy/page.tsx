import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
      
      <div className="space-y-4 text-gray-700">
        <p>
          Welcome to the Sensay Hackathon Ideas Showcase Privacy Policy.
        </p>
        <p>
          This is a demonstration application and does not collect, store, or process any real user data. 
          All interactions are simulated locally within your browser for the purpose of showcasing potential features.
        </p>
        
        <h2 className="text-xl font-semibold pt-4 text-gray-800">Information Collection</h2>
        <p>
          We do not collect any personal information, cookies, or usage data through this application.
        </p>

        <h2 className="text-xl font-semibold pt-4 text-gray-800">Data Usage</h2>
        <p>
          Since no data is collected, no data is used, shared, or sold.
        </p>

        <h2 className="text-xl font-semibold pt-4 text-gray-800">Simulated Interactions</h2>
        <p>
          Please be aware that features involving simulated token transactions ($SNSY), voice input, AI responses, 
          shared states, or memory access are purely illustrative and do not involve real backend systems, 
          blockchains, or AI models.
        </p>

        <h2 className="text-xl font-semibold pt-4 text-gray-800">Contact</h2>
        <p>
          For any questions regarding this privacy notice (even though it&apos;s for a mock application), 
          you can hypothetically contact us at: <a href="mailto:privacy@sensayhacks.com" className="text-indigo-600 hover:underline">privacy@sensayhacks.com</a>.
        </p>
        
        <p className="pt-4 text-sm text-gray-500">
          Last Updated: March 28, 2025
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
