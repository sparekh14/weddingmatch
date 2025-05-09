import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { setOnboardingData } = useContext(AppContext);
  const navigate = useNavigate();

  const [date, setDate]       = useState('');
  const [city, setCity]       = useState('');
  const [style, setStyle]     = useState('');
  const [budget, setBudget]   = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setOnboardingData({ date, city, style, budget });
    navigate('/matches');
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Find Your Group Deals</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Wedding Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">City</label>
          <input
            type="text"
            placeholder="e.g. Austin, TX"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Style / Theme</label>
          <input
            type="text"
            placeholder="e.g. Boho, Modern, Rustic"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Budget per Couple</label>
          <input
            type="number"
            placeholder="USD"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          See Matches
        </button>
      </form>
    </main>
  );
}