import React from 'react';
import { Link } from 'react-router-dom';

export default function VendorDashboardPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome, Vendor!</h2>
        <p className="text-gray-600 mb-6">
          This is your central hub for managing your services and interactions on WeddingMatch.
        </p>
        
        <div className="mt-6">
          <Link 
            to="/vendor/quotes" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 inline-block"
          >
            View & Manage Quote Requests
          </Link>
        </div>
        
        {/* You can add more links or dashboard widgets here in the future */}
        {/* For example:
        <div className=\"mt-4\">
          <Link to=\"/vendor/profile\" className=\"text-blue-500 hover:underline\">Edit Profile</Link>
        </div>
        <div className=\"mt-4\">
          <Link to=\"/vendor/services\" className=\"text-blue-500 hover:underline\">Manage Services</Link>
        </div>
        */}
      </section>
    </main>
  );
}
