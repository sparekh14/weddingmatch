import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth

// API endpoint for fetching quotes for a specific vendor
const GET_VENDOR_QUOTES_API_ENDPOINT = (vendorId) => `/api/vendors/${vendorId}/quotes`;

// API endpoints for accepting/declining quotes
const ACCEPT_QUOTE_API_ENDPOINT = (quoteId) => `/api/quotes/${quoteId}/accept`;
const DECLINE_QUOTE_API_ENDPOINT = (quoteId) => `/api/quotes/${quoteId}/decline`;

export default function VendorQuotesPage() {
  const { vendorId, token } = useAuth(); // Use the hook to get vendorId and token
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vendorId || !token) { // Don't fetch if vendorId or token is not available
      setLoading(false);
      setError('Vendor not authenticated. Please log in.'); // Or handle appropriately
      return;
    }

    setLoading(true);
    setError(null);
    fetch(GET_VENDOR_QUOTES_API_ENDPOINT(vendorId), { // Use actual vendorId
      headers: {
        'Authorization': `Bearer ${token}`, // Use actual token
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setQuotes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch quotes:", err);
        setError(err.message || 'Failed to fetch quotes.');
        setLoading(false);
      });
  }, []);

  const handleAcceptQuote = async (quoteId) => {
    // TODO: Replace prompts with a modal/form for better UX
    const perCoupleInput = prompt("Enter final price per couple:");
    const totalInput = prompt("Enter total cost for the group:");

    if (perCoupleInput === null || totalInput === null) {
      alert("Pricing information cancelled.");
      return;
    }

    const perCouple = parseFloat(perCoupleInput);
    const total = parseFloat(totalInput);

    if (isNaN(perCouple) || isNaN(total) || perCouple <= 0 || total <= 0) {
      alert("Invalid pricing information. Please enter valid numbers.");
      return;
    }

    if (!token) { // Check if token is available before making the call
      alert("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(ACCEPT_QUOTE_API_ENDPOINT(quoteId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // Use actual token
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pricing: { perCouple, total } })
      });

      if (!response.ok) {
        const errorData = await response.text(); // Or response.json() if backend sends structured error
        throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
      }

      const updatedQuote = await response.json();
      setQuotes(prevQuotes => 
        prevQuotes.map(q => q.id === quoteId ? updatedQuote : q)
      );
      alert("Quote accepted successfully!");
    } catch (err) {
      console.error("Error accepting quote:", err);
      alert(`Error accepting quote: ${err.message}`);
    }
  };

  const handleDeclineQuote = async (quoteId) => {
    // TODO: Replace prompt with a modal/form for better UX if reason becomes complex
    const reason = prompt("Optional: Enter reason for declining (leave blank if none):");

    if (!token) { // Check if token is available before making the call
      alert("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const bodyPayload = {};
      if (reason && reason.trim() !== "") {
        bodyPayload.reason = reason.trim();
      }

      const response = await fetch(DECLINE_QUOTE_API_ENDPOINT(quoteId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // Use actual token
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload) // Send empty object if no reason
      });

      if (!response.ok) {
        const errorData = await response.text(); // Or response.json() if backend sends structured error
        throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
      }

      const updatedQuote = await response.json();
      setQuotes(prevQuotes => 
        prevQuotes.map(q => q.id === quoteId ? updatedQuote : q)
      );
      alert("Quote declined successfully!");
    } catch (err) {
      console.error("Error declining quote:", err);
      alert(`Error declining quote: ${err.message}`);
    }
  };

  if (!vendorId && !loading) { // If not loading and no vendorId, show auth error from useEffect
    return (
      <main className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-red-500">{error || 'Vendor not authenticated. Please log in.'}</p>
        {/* TODO: Add a button/link to the login page */}
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-6 max-w-4xl mx-auto text-center">
        <p>Loading vendor quotes...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-red-500">Error: {error}</p>
        {/* Optionally, add a retry button here */}
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Incoming Quote Requests</h1>
      {quotes.length === 0 ? (
        <p>No incoming quotes at the moment.</p>
      ) : (
        <div className="space-y-6">
          {quotes.map((quote) => (
            <div key={quote.id} className="border rounded-lg p-4 shadow-md bg-white">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-semibold text-blue-700">{quote.service}</h2>
                <span 
                  className={`px-3 py-1 text-xs font-medium rounded-full 
                            ${quote.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 
                              quote.status === 'accepted' ? 'bg-green-200 text-green-800' : 
                              'bg-red-200 text-red-800'}`}
                >
                  {quote.status}
                </span>
              </div>

              {quote.group && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <h3 className="text-md font-semibold text-gray-700 mb-1">Group Details:</h3>
                  <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(quote.group.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600"><strong>City:</strong> {quote.group.city}</p>
                  <p className="text-sm text-gray-600"><strong>Style:</strong> {quote.group.style}</p>
                  <p className="text-sm text-gray-600"><strong>Matched Couples:</strong> {quote.group.matchedCouples}</p>
                  <p className="text-sm text-gray-600"><strong>Budget per Couple:</strong> ${quote.group.budgetPerCouple}</p>
                </div>
              )}

              {quote.details && (
                <div className="mb-3">
                  <h3 className="text-md font-semibold text-gray-700 mb-1">Client Notes:</h3>
                  <p className="text-sm text-gray-600 italic">{quote.details.notes || "No specific notes."}</p>
                  {quote.details.maxTotalBudget && (
                     <p className="text-sm text-gray-600"><strong>Max Total Budget (from client):</strong> ${quote.details.maxTotalBudget}</p>
                  )}
                </div>
              )}
              
              <div className="mb-3">
                <h3 className="text-md font-semibold text-gray-700 mb-1">Vendor Pricing:</h3>
                <p className="text-sm text-gray-600">
                  <strong>Per Couple:</strong> {quote.pricing?.perCouple ? `$${quote.pricing.perCouple}` : 'Not set'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total:</strong> {quote.pricing?.total ? `$${quote.pricing.total}` : 'Not set'}
                </p>
              </div>

              <p className="text-xs text-gray-500 mb-3">Requested: {new Date(quote.requestedAt).toLocaleString()}</p>

              {quote.status === 'pending' && (
                <div className="mt-4 flex space-x-3">
                  <button 
                    onClick={() => handleAcceptQuote(quote.id)} 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-colors duration-150"
                  >
                    Accept & Add Pricing
                  </button>
                  <button 
                    onClick={() => handleDeclineQuote(quote.id)} 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-colors duration-150"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}