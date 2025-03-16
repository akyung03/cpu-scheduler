// algorithms/stcf.js

export function stcf(processes) {
  if (!processes || processes.length === 0) {
    return {
      result: [],
      avgWaitTime: 0,
      avgTurnAroundTime: 0,
    };
  }

  let time = 0;
  let totalWaitTime = 0;
  let totalTurnAroundTime = 0;
  const result = [];

  
  const processQueue = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
    waitTime: 0,
    completed: false,
  }));

  while (processQueue.some((p) => !p.completed)) {
  
    let shortestProcess = null;
    for (const process of processQueue) {
      if (
        !process.completed &&
        process.arrivalTime <= time &&
        (!shortestProcess || process.remainingTime < shortestProcess.remainingTime)
      ) {
        shortestProcess = process;
      }
    }

    if (!shortestProcess) {
      time++;
      continue;
    }

   
    shortestProcess.remainingTime -= 1;
    time += 1;

    
    processQueue.forEach((p) => {
      if (p !== shortestProcess && !p.completed && p.arrivalTime <= time) {
        p.waitTime += 1;
      }
    });


    if (shortestProcess.remainingTime === 0) {
      shortestProcess.completed = true;
      const turnAroundTime = time - shortestProcess.arrivalTime;
      totalWaitTime += shortestProcess.waitTime;
      totalTurnAroundTime += turnAroundTime;

      result.push({
        ...shortestProcess,
        waitTime: shortestProcess.waitTime,
        turnAroundTime: turnAroundTime,
      });
    }
  }

 
  const avgWaitTime = totalWaitTime / processes.length;
  const avgTurnAroundTime = totalTurnAroundTime / processes.length;

  return {
    result,
    avgWaitTime,
    avgTurnAroundTime,
  };
}