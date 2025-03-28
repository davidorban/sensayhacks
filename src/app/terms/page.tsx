import React from 'react';

const TermsAndConditionsPage = () => {
  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> 
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Terms and Conditions</h1> 
      
      <div className="bg-white p-6 rounded-lg shadow-lg flex-1">
        <div className="space-y-4 text-gray-700">
          <p>
            Welcome to the Sensay Hackathon Ideas Showcase.
          </p>
          <p>
            By using this demonstration application, you acknowledge and agree to the following terms and conditions:
          </p>
          
          <h2 className="text-xl font-semibold pt-4 text-gray-800">1. Purpose of Application</h2>
          <p>
            This application is a non-functional prototype created solely for demonstration purposes during the Sensay Hackathon. 
            It showcases potential concepts and does not offer any real services or functionalities.
          </p>

          <h2 className="text-xl font-semibold pt-4 text-gray-800">2. Simulated Interactions</h2>
          <p>
            All features, including but not limited to chat interactions, voice processing, task management, token transactions ($SNSY), 
            AI responses, memory access, and replica bonding, are simulated locally in your browser. No real data processing, 
            financial transactions, or AI computations occur.
          </p>

          <h2 className="text-xl font-semibold pt-4 text-gray-800">3. No Data Collection</h2>
          <p>
            This application does not collect, store, transmit, or process any personal data or user information. Refer to our Privacy Policy for more details.
          </p>

          <h2 className="text-xl font-semibold pt-4 text-gray-800">4. No Warranties</h2>
          <p>
            This application is provided &quot;as is&quot; without any warranties, express or implied. We make no guarantees regarding its 
            functionality, accuracy, or availability.
          </p>
          
          <h2 className="text-xl font-semibold pt-4 text-gray-800">5. Limitation of Liability</h2>
          <p>
            In no event shall the creators be liable for any damages arising from the use or inability to use this demonstration application.
          </p>

          <h2 className="text-xl font-semibold pt-4 text-gray-800">6. Contact</h2>
          <p>
            If you have questions about these terms in the context of this mock application, you can notionally reach out to: 
            <a href="mailto:legal@sensayhacks.com" className="text-indigo-600 hover:underline">legal@sensayhacks.com</a>.
          </p>

          <p className="pt-4 text-sm text-gray-500">
            Last Updated: March 28, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
