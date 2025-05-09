import { useContext, useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { getMatches } from '../utils/api';

export default function MatchResultsPage() {
  const { onboardingData } = useContext(AppContext);
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If they hit /matches without data, send them home
  if (!onboardingData) {
    return <Navigate to="/" replace />;
  }

  const { date, city, style, budget } = onboardingData;

  useEffect(() => {
    if (onboardingData) {
      setLoading(true);
      setError(null);
      getMatches(onboardingData)
        .then(data => {
          setMatches(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch matches:", err);
          setError(err.message || 'Failed to fetch matches.');
          setLoading(false);
        });
    }
  }, [onboardingData]);

  // Mocked match data — later you'll fetch this from your API
  const mockDeals = [
    { service: 'Flowers', matchedCouples: 5, totalCost: 1200 },
    { service: 'Chairs & Tables', matchedCouples: 3, totalCost: 450 },
    { service: 'DJ', matchedCouples: 4, totalCost: 800 },
  ];

  if (loading) {
    return (
      <main className="p-6 max-w-3xl mx-auto text-center">
        <p>Loading matches...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-red-500">Error: {error}</p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigate('/')}
        >
          ← Go Home
        </button>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Group Deals</h1>
      <p className="mb-6">
        Matches for <strong>{style}</strong> weddings around <strong>{date}</strong> in <strong>{city}</strong>
      </p>

      <div className="space-y-4">
        {matches && matches.length > 0 ? matches.map((deal) => {
          const perCouple = (deal.totalCost / deal.matchedCouples).toFixed(0);
          const saved = ((budget - perCouple) > 0)
            ? Math.abs(budget - perCouple)
            : 0;

          return (
            <div
              key={deal.service}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{deal.service}</h2>
                <p>
                  {deal.matchedCouples} couples —&nbsp;
                  <span className="font-medium">${perCouple}</span> each
                </p>
                {saved > 0 && (
                  <p className="text-green-600">You save ≈ ${saved}</p>
                )}
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/quotes', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ 
                        service: deal.service, 
                        cost: perCouple, // Or deal.totalCost, depending on what backend expects
                        onboardingData // Send relevant onboarding context
                      }),
                    });
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const result = await response.json();
                    // TODO: Provide user feedback, e.g., toast notification
                    alert(`Quote requested for ${deal.service}! Details: ${JSON.stringify(result)}`);
                  } catch (err) {
                    console.error("Failed to request quote:", err);
                    // TODO: Provide user feedback for error
                    alert(`Failed to request quote for ${deal.service}. Please try again.`);
                  }
                }}
              >
                Request Quote
              </button>
            </div>
          );
        }) : <p>No matches found for your criteria.</p>}
      </div>

      <button
        className="mt-8 text-sm text-gray-600 hover:underline"
        onClick={() => navigate('/')}
      >
        ← Modify search
      </button>
    </main>
  );
}