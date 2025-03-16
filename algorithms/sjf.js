// algorithms/sjf.js

export function sjf(processes) {
    // Sort processes by burst time 
    processes.sort((a, b) => a.burstTime - b.burstTime);
  
    let time = 0; //  current time to 0
    let totalWaitTime = 0; // Iwait time to 0
    let totalTurnAroundTime = 0; // turnaround time to 0
  
    // Calculate wait time and turnaround time 
    const result = processes.map((process) => {
      const wait = time; // 
      const turnAround = time + process.burstTime; 
  
    
      totalWaitTime += wait;
      totalTurnAroundTime += turnAround;
  
      time += process.burstTime;
  
      // Return the process with its wait time and turnaround time
      return {
        ...process,
        waitTime: wait, 
        turnAroundTime: turnAround, 
      };
    });
  
    // Calculate average wait time and turnaround time
    const avgWaitTime = totalWaitTime / processes.length;
    const avgTurnAroundTime = totalTurnAroundTime / processes.length;
  
    // Step 4: Return the results
    return {
      result, 
      avgWaitTime, 
      avgTurnAroundTime, 
    };
  }