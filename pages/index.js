import { useState } from 'react';
import { fifo } from '../algorithms/fifo';
import { sjf } from '../algorithms/sjf';
import { stcf } from '../algorithms/stcf';  
import ChartComponent from '../components/Chart';
import Header from '../components/Header';

export default function Home() {
  const [numProcesses, setNumProcesses] = useState(3);
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); 

  const generateProcesses = () => {
    const generatedProcesses = [];
    for (let i = 0; i < numProcesses; i++) {
      generatedProcesses.push({
        id: i + 1,
        burstTime: Math.floor(Math.random() * 10) + 1,
        arrivalTime: Math.floor(Math.random() * 10), 
      });
    }
    setProcesses(generatedProcesses);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const handleRunAlgorithm = () => {
    if (!algorithm || processes.length === 0) return;

    setLoading(true); 

    setTimeout(() => { 
      let algoResult = null;

      if (algorithm === 'FIFO') {
        algoResult = fifo(processes);
      } else if (algorithm === 'SJF') {
        algoResult = sjf(processes);
      } else if (algorithm === 'STCF') {
        algoResult = stcf(processes); 
      }

      setResult(algoResult);
      setLoading(false); 
    }, 1000); 
  };  

  return (
    <div>
      <Header />
      <h1>CPU Scheduling Algorithms</h1>

      <label>Number of Processes: </label>
      <input
        type="number"
        value={numProcesses}
        onChange={(e) => setNumProcesses(parseInt(e.target.value))}
      />
      <button onClick={generateProcesses}>Generate Processes</button>

      <label>Select Algorithm:</label>
      <select value={algorithm} onChange={handleAlgorithmChange}>
        <option value="">Select Algorithm</option>
        <option value="FIFO">FIFO</option>
        <option value="SJF">SJF</option>
        <option value="STCF">STCF</option>
      </select>

      <button onClick={handleRunAlgorithm} disabled={loading}>
        {loading ? 'Running...' : 'Run Algorithm'} {/* Show loading text */}
      </button>

      {loading && <p>Processing... Please wait.</p>} {/*  Show loading message */}

      {result && (
        <ChartComponent
          data={{
            labels: result.result.map((p) => `P${p.id}`),
            burstTimes: result.result.map((p) => p.burstTime),
          }}
        />
      )}
    </div>
  );
}
