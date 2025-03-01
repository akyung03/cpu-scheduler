// algorithms/fifo.js

export function fifo(processes) {
    let time = 0; // Initialize the current time 
    let totalWaitTime = 0; // Initialize the total wait 
    let totalTurnAroundTime = 0; // Initialize the total turnaround
  
    
    const result = [];
  
   
    for (let i = 0; i < processes.length; i++) {
      const process = processes[i]; 
  
      const waitTime = time; 
      const turnAroundTime = time + process.burstTime; // Turnaround time is wait time + burst time
  
  
      totalWaitTime += waitTime;
      totalTurnAroundTime += turnAroundTime;
  
      // Update the current time by adding the burst time of the current process
      time += process.burstTime;
  
      // Add the process details to the result array
      result.push({
        ...process, 
        waitTime: waitTime, 
        turnAroundTime: turnAroundTime 
      });
    }
  
    // Calculate the average wait time and average turnaround time
    const avgWaitTime = totalWaitTime / processes.length;
    const avgTurnAroundTime = totalTurnAroundTime / processes.length;
  
    // Return the results including the detailed process info and averages
    return {
      result, 
      avgWaitTime, 
      avgTurnAroundTime 
    };
  }