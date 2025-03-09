import { useState } from 'react';
import { fifo } from '../algorithms/fifo';
import { sjf } from '../algorithms/sjf';
import ChartComponent from '../components/Chart';

export default function Home() {
  const [numProcesses, setNumProcesses] = useState(3);
  const [processes, setProcesses] = useState([]);
  const [fifoResult, setFifoResult] = useState(null);
  const [sjfResult, setSjfResult] = useState(null);

  const generateProcesses = () => {
    const generatedProcesses = [];
    for (let i = 0; i < numProcesses; i++) {
      generatedProcesses.push({
        id: i + 1,
        burstTime: Math.floor(Math.random() * 10) + 1,
      });
    }
    setProcesses(generatedProcesses);
  };

  const runFIFO = () => {
    const result = fifo(processes);
    setFifoResult(result);
  };

  const runSJF = () => {
    const result = sjf(processes);
    setSjfResult(result);
  };

  return (
    <div>
      <h1>CPU Scheduling Algorithms</h1>
      <label>Number of Processes: </label>
      <input
        type="number"
        value={numProcesses}
        onChange={(e) => setNumProcesses(parseInt(e.target.value))}
      />
      <button onClick={generateProcesses}>Generate Processes</button>
      <button onClick={runFIFO}>Run FIFO</button>
      <button onClick={runSJF}>Run SJF</button>

      {fifoResult && <div>{/* Display FIFO result here */}</div>}
      {sjfResult && <div>{/* Display SJF result here */}</div>}

      {sjfResult && (
        <ChartComponent
          data={{
            labels: sjfResult.result.map((p) => `P${p.id}`),
            burstTimes: sjfResult
