export function stcf(processes) {
    let time = 0;
    let completed = 0;
    let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    let result = [];
  
    while (completed < processes.length) {
      let shortestProcess = remainingProcesses
        .filter(p => p.arrivalTime <= time && p.remainingTime > 0)
        .sort((a, b) => a.remainingTime - b.remainingTime)[0];
  
      if (shortestProcess) {
        shortestProcess.remainingTime--;
        result.push({ process: shortestProcess.id, time });
  
        if (shortestProcess.remainingTime === 0) {
          completed++;
        }
      }
      time++;
    }
  
    return result;
  }
  