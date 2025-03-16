// round robin algo

export function rr(processes, timeQuantum) {
    let time = 0;
    let totalWaitTime = 0;
    let totalTurnAroundTime = 0;
    const result = [];
  
    // Create a copy of processes to avoid mutating the original array
    const queue = processes.map((process) => ({
      ...process,
      remainingTime: process.burstTime, 
    }));
  
    while (queue.length > 0) {
      const process = queue.shift(); 
  
      const executionTime = Math.min(timeQuantum, process.remainingTime);
      process.remainingTime -= executionTime;
  
      queue.forEach((p) => {
        if (p !== process) {
          p.waitTime = (p.waitTime || 0) + executionTime;
        }
      });
  
      if (process.remainingTime > 0) {
        queue.push(process);
      } else {

        const turnAroundTime = time + executionTime;
        totalWaitTime += process.waitTime || 0;
        totalTurnAroundTime += turnAroundTime;
  
        result.push({
          ...process,
          waitTime: process.waitTime || 0,
          turnAroundTime: turnAroundTime,
        });
      }
  
      time += executionTime;
    }
  

    const avgWaitTime = totalWaitTime / processes.length;
    const avgTurnAroundTime = totalTurnAroundTime / processes.length;
  
    return {
      result,
      avgWaitTime,
      avgTurnAroundTime,
    };
  }