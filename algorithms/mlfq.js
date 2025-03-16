// mlfq algo

export function mlfq(processes, queues = 3, timeQuanta = [4, 8, Infinity]) {
    let time = 0;
    let totalWaitTime = 0;
    let totalTurnAroundTime = 0;
    const result = [];
  
    // Create queues with different time quanta
    const queuesArray = Array.from({ length: queues }, (_, i) => ({
      timeQuantum: timeQuanta[i],
      processes: [],
    }));
  
    // Add all processes to the first queue initially
    queuesArray[0].processes = processes.map((process) => ({
      ...process,
      remainingTime: process.burstTime,
      queueLevel: 0,
    }));
  
    while (queuesArray.some((q) => q.processes.length > 0)) {
      for (let i = 0; i < queuesArray.length; i++) {
        const queue = queuesArray[i];
        if (queue.processes.length > 0) {
          const process = queue.processes.shift(); 
  
          const executionTime = Math.min(queue.timeQuantum, process.remainingTime);
          process.remainingTime -= executionTime;
  
          queuesArray.forEach((q) => {
            q.processes.forEach((p) => {
              if (p !== process) {
                p.waitTime = (p.waitTime || 0) + executionTime;
              }
            });
          });
  
          if (process.remainingTime > 0 && i < queuesArray.length - 1) {
            process.queueLevel += 1;
            queuesArray[i + 1].processes.push(process);
          } else if (process.remainingTime === 0) {

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
          break; 
        }
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