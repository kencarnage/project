import React, { useState, useEffect } from 'react';
import { FilterGroup } from './components/FilterGroup';
import { StatCard } from './components/StatCard';
import { BarChart } from './components/BarChart';
import { AreaChart } from './components/AreaChart';
import { DelhiMap } from './components/DelhiMap';
import { fetchCrimeData } from './services/api';

function App() {
  const [suspectAge, setSuspectAge] = useState(null);
  const [suspectSex, setSuspectSex] = useState(null);
  const [victimAge, setVictimAge] = useState(null);
  const [victimSex, setVictimSex] = useState(null);

  const [data, setData] = useState({
    locationData: [],
    crimeData: [],
    hourlyData: [],
    mapPoints: [],
    sharePercentage: '0%',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateData = async () => {
      try {
        setLoading(true);
        const newData = await fetchCrimeData({
          suspectAge,
          suspectSex,
          victimAge,
          victimSex,
        });
        setData(newData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    updateData();
  }, [suspectAge, suspectSex, victimAge, victimSex]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Suspect Background</h2>
            <FilterGroup
              title="Age"
              filters={['<18', '18-24', '25-44', '45-64', '65+']}
              activeFilter={suspectAge}
              onFilterChange={setSuspectAge}
              onReset={() => setSuspectAge(null)}
            />
            <FilterGroup
              title="Sex"
              filters={['Male', 'Female']}
              activeFilter={suspectSex}
              onFilterChange={setSuspectSex}
              onReset={() => setSuspectSex(null)}
            />
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Victim Background</h2>
            <FilterGroup
              title="Age"
              filters={['<18', '18-24', '25-44', '45-64', '65+']}
              activeFilter={victimAge}
              onFilterChange={setVictimAge}
              onReset={() => setVictimAge(null)}
            />
            <FilterGroup
              title="Sex"
              filters={['Male', 'Female']}
              activeFilter={victimSex}
              onFilterChange={setVictimSex}
              onReset={() => setVictimSex(null)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Share of all crimes" value={data.sharePercentage} />
              <BarChart title="Top crime locations" data={data.locationData} />
              <BarChart title="Crimes by law category" data={data.crimeData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AreaChart title="Crime rate by hour" data={data.hourlyData} />
              <DelhiMap className="h-96" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
