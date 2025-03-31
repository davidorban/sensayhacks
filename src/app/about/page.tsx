export const metadata = {
  title: 'About & Contact | Sensay Proto',
};

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">About & Contact</h1>

        {/* Content Area - White Rounded Box */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* About Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">About the Project</h2>
            <p className="text-gray-600 mb-4">
              SensayHacks is a collection of innovative AI prototypes developed during the March 2025 Sensay internal hackathon. 
              These prototypes explore cutting-edge concepts in AI interaction, memory management, and system evolution.
            </p>
            <p className="text-gray-600">
              The project is built with modern web technologies including Next.js 14, TypeScript, and Tailwind CSS, 
              showcasing different aspects of Sensay's capabilities in areas such as chat interfaces, memory management, 
              and replica interactions.
            </p>
          </section>

          {/* Project Maintainers */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Project Maintainers</h2>
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-medium text-gray-800 mb-2">David Orban</h3>
                <div className="space-y-2">
                  <a 
                    href="https://github.com/davidorban" 
                    className="block text-indigo-600 hover:text-indigo-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub: @davidorban
                  </a>
                  <a 
                    href="https://twitter.com/davidorban" 
                    className="block text-indigo-600 hover:text-indigo-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter: @davidorban
                  </a>
                  <a 
                    href="https://davidorban.com" 
                    className="block text-indigo-600 hover:text-indigo-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website: davidorban.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Contributing */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contributing</h2>
            <p className="text-gray-600 mb-4">
              We welcome contributions to the SensayHacks project! Here's how you can contribute:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
              <li>Check our <a href="https://github.com/davidorban/sensayhacks/issues" className="text-indigo-600 hover:text-indigo-800">GitHub Issues</a> for open tasks</li>
              <li>Fork the repository</li>
              <li>Create a feature branch</li>
              <li>Submit a Pull Request</li>
            </ol>
          </section>

          {/* Support */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Support</h2>
            <p className="text-gray-600 mb-2">For technical support:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Open an issue on our <a href="https://github.com/davidorban/sensayhacks/issues" className="text-indigo-600 hover:text-indigo-800">GitHub repository</a></li>
              <li>Tag it with appropriate labels (bug, enhancement, question, etc.)</li>
            </ul>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Security</h2>
            <p className="text-gray-600">
              To report security vulnerabilities, please do not open a public issue. Instead, contact the maintainers directly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
