import { useState } from 'react';
import { fifo } from '../algorithms/fifo';
import { sjf } from '../algorithms/sjf';
import { stcf } from '../algorithms/stcf';
import { rr } from '../algorithms/rr'; // Import Round Robin
import { mlfq } from '../algorithms/mlfq'; // Import MLFQ
import ChartComponent from '../components/Chart';
import Header from '../components/Header';

export default function Home() {
  const [numProcesses, setNumProcesses] = useState(3);
  const [timeQuantum, setTimeQuantum] = useState(2); // Add time quantum for RR
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate random processes
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

  // Handle algorithm selection
  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  // Handle running the selected algorithm
  const handleRunAlgorithm = () => {
    if (!algorithm || processes.length === 0) return;

    setLoading(true);

    setTimeout(() => {
      let algoResult = null;

      switch (algorithm) {
        case 'FIFO':
          algoResult = fifo(processes);
          break;
        case 'SJF':
          algoResult = sjf(processes);
          break;
        case 'STCF':
          algoResult = stcf(processes);
          break;
        case 'RR':
          algoResult = rr(processes, timeQuantum); // Pass time quantum to RR
          break;
        case 'MLFQ':
          algoResult = mlfq(processes); // Run MLFQ
          break;
        default:
          break;
      }

      setResult(algoResult);
      setLoading(false);
    }, 1000); // Simulate processing delay
  };

  return (
    <div>
      <Header />
      <h1>CPU Scheduling Algorithms</h1>

      {/* Input for number of processes */}
      <label>Number of Processes: </label>
      <input
        type="number"
        value={numProcesses}
        onChange={(e) => setNumProcesses(parseInt(e.target.value))}
      />
      <button onClick={generateProcesses}>Generate Processes</button>

      {/* Input for time quantum (for RR) */}
      {algorithm === 'RR' && (
        <div>
          <label>Time Quantum (for RR): </label>
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
          />
        </div>
      )}

      {/* Algorithm selection dropdown */}
      <label>Select Algorithm:</label>
      <select value={algorithm} onChange={handleAlgorithmChange}>
        <option value="">Select Algorithm</option>
        <option value="FIFO">FIFO</option>
        <option value="SJF">SJF</option>
        <option value="STCF">STCF</option>
        <option value="RR">Round Robin (RR)</option>
        <option value="MLFQ">Multi-Level Feedback Queue (MLFQ)</option>
      </select>

      {/* Run algorithm button */}
      <button onClick={handleRunAlgorithm} disabled={loading}>
        {loading ? 'Running...' : 'Run Algorithm'}
      </button>

      {/* Loading message */}
      {loading && <p>Processing... Please wait.</p>}

      {/* Display results */}
      {result && (
        <div>
          <h2>Results for {algorithm}</h2>
          <p>Average Wait Time: {result.avgWaitTime.toFixed(2)}</p>
          <p>Average Turnaround Time: {result.avgTurnAroundTime.toFixed(2)}</p>

          {/* Chart for burst times */}
          <ChartComponent
            data={{
              labels: result.result.map((p) => `P${p.id}`),
              burstTimes: result.result.map((p) => p.burstTime),
              waitTimes: result.result.map((p) => p.waitTime),
              turnaroundTimes: result.result.map((p) => p.turnAroundTime),
            }}
          />
        </div>
      )}
    </div>
  );
}