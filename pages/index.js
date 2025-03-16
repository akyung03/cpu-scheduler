import { useState } from 'react';
import { fifo } from '../algorithms/fifo';
import { sjf } from '../algorithms/sjf';
import { stcf } from '../algorithms/stcf';
import { rr } from '../algorithms/rr';
import { mlfq } from '../algorithms/mlfq';
import ChartComponent from '../components/Chart';
import Header from '../components/Header';
import dynamic from 'next/dynamic';

// Dynamically import jsPDF to avoid SSR issues
const jsPDF = dynamic(() => import('jspdf').then((module) => module.default), { ssr: false });

export default function Home() {
  const [numProcesses, setNumProcesses] = useState(3);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [results, setResults] = useState({});
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
    setResults({});
  };

  const handleAlgorithmChange = (e) => {
    const algorithm = e.target.value;
    if (selectedAlgorithms.includes(algorithm)) {
      setSelectedAlgorithms(selectedAlgorithms.filter((algo) => algo !== algorithm));
    } else {
      setSelectedAlgorithms([...selectedAlgorithms, algorithm]);
    }
  };

  const runAlgorithms = () => {
    if (selectedAlgorithms.length === 0 || processes.length === 0) return;

    setLoading(true);

    setTimeout(() => {
      const newResults = {};

      selectedAlgorithms.forEach((algorithm) => {
        switch (algorithm) {
          case 'FIFO':
            newResults.FIFO = fifo(processes);
            break;
          case 'SJF':
            newResults.SJF = sjf(processes);
            break;
          case 'STCF':
            newResults.STCF = stcf(processes);
            break;
          case 'RR':
            newResults.RR = rr(processes, timeQuantum);
            break;
          case 'MLFQ':
            newResults.MLFQ = mlfq(processes);
            break;
          default:
            break;
        }
      });

      setResults(newResults);
      setLoading(false);
    }, 1000);
  };

  const resetSimulation = () => {
    setNumProcesses(3);
    setTimeQuantum(2);
    setProcesses([]);
    setSelectedAlgorithms([]);
    setResults({});
  };

  const downloadPDF = async () => {
    try {
      // Dynamically import jsPDF if not already loaded
      const { default: jsPDF } = await import('jspdf');
      
      if (!jsPDF) {
        console.error('jsPDF is not loaded yet.');
        return;
      }

      if (!results || Object.keys(results).length === 0) {
        console.error('No results to export.');
        return;
      }

      const doc = new jsPDF(); // Correct initialization
      let yOffset = 7;

      Object.entries(results).forEach(([algorithm, result]) => {
        doc.text(`Algorithm: ${algorithm}`, 7, yOffset);
        yOffset += 7;
        doc.text(`Average Wait Time: ${result.avgWaitTime?.toFixed(2) ?? 'N/A'}`, 7, yOffset);
        yOffset += 7;
        doc.text(`Average Turnaround Time: ${result.avgTurnAroundTime?.toFixed(2) ?? 'N/A'}`, 7, yOffset);
        yOffset += 7;

        result.result.forEach((process) => {
          doc.text(
            `Process ${process.id}: Burst Time - ${process.burstTime}, Wait Time - ${process.waitTime}, Turnaround Time - ${process.turnAroundTime}`,
            10,
            yOffset
          );
          yOffset += 7;
        });

        yOffset += 7;
      });

      doc.save('scheduling_results.pdf');
    } catch (error) {
      console.error('Error loading or using jsPDF:', error);
    }
  };

  return (
    <div>
      <Header />
      <h1>CPU Scheduling Algorithms</h1>

      <p>1. Enter the number of processes and click <strong>Generate Processes</strong>.</p>
      <p>2. Select the algorithms you want to run.</p>
      <p>3. Click <strong>Run Selected Algorithms</strong> to see the results.</p>
      <p>4. After running, click <strong>Reset Simulation</strong> to start a new simulation.</p>

      <label>Number of Processes: </label>
      <input
        type="number"
        value={numProcesses}
        onChange={(e) => setNumProcesses(parseInt(e.target.value))}
      />
      <button onClick={generateProcesses}>Generate Processes</button>

      {selectedAlgorithms.includes('RR') && (
        <div>
          <label>Time Quantum (for RR): </label>
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
          />
        </div>
      )}

      <div>
        <label>Select Algorithms:</label>
        {['FIFO', 'SJF', 'STCF', 'RR', 'MLFQ'].map((algorithm) => (
          <div key={algorithm}>
            <input
              type="checkbox"
              value={algorithm}
              checked={selectedAlgorithms.includes(algorithm)}
              onChange={handleAlgorithmChange}
            />
            {algorithm}
          </div>
        ))}
      </div>

      <button onClick={runAlgorithms} disabled={loading || processes.length === 0}>
        {loading ? 'Running...' : 'Run Selected Algorithms'}
      </button>

      <button onClick={resetSimulation} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
        Reset Simulation
      </button>

      <button onClick={downloadPDF} style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white' }}>
        Download Results as PDF
      </button>

      {loading && <p>Processing... Please wait.</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {Object.entries(results).map(([algorithm, result]) => (
          <div key={algorithm} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <h2>{algorithm}</h2>
            <p>Average Wait Time: {result.avgWaitTime?.toFixed(2) ?? 'N/A'}</p>
            <p>Average Turnaround Time: {result.avgTurnAroundTime?.toFixed(2) ?? 'N/A'}</p>

            <ChartComponent
              data={{
                labels: result.result.map((p) => `P${p.id}`),
                burstTimes: result.result.map((p) => p.burstTime),
                waitTimes: result.result.map((p) => p.waitTime),
                turnaroundTimes: result.result.map((p) => p.turnAroundTime),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}