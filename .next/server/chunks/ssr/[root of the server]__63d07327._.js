module.exports = {

"[externals]/next/dist/compiled/next-server/pages.runtime.dev.js [external] (next/dist/compiled/next-server/pages.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages.runtime.dev.js", () => require("next/dist/compiled/next-server/pages.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/react/jsx-runtime [external] (react/jsx-runtime, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("react/jsx-runtime", () => require("react/jsx-runtime"));

module.exports = mod;
}}),
"[externals]/react [external] (react, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("react", () => require("react"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}}),
"[project]/algorithms/fifo.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
// algorithms/fifo.js
__turbopack_context__.s({
    "fifo": (()=>fifo)
});
function fifo(processes) {
    let time = 0; // Initialize the current time 
    let totalWaitTime = 0; // Initialize the total wait 
    let totalTurnAroundTime = 0; // Initialize the total turnaround
    const result = [];
    for(let i = 0; i < processes.length; i++){
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
}}),
"[project]/algorithms/sjf.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
// algorithms/sjf.js
__turbopack_context__.s({
    "sjf": (()=>sjf)
});
function sjf(processes) {
    // Sort processes by burst time 
    processes.sort((a, b)=>a.burstTime - b.burstTime);
    let time = 0; //  current time to 0
    let totalWaitTime = 0; // Iwait time to 0
    let totalTurnAroundTime = 0; // turnaround time to 0
    // Calculate wait time and turnaround time 
    const result = processes.map((process)=>{
        const wait = time; // 
        const turnAround = time + process.burstTime;
        totalWaitTime += wait;
        totalTurnAroundTime += turnAround;
        time += process.burstTime;
        // Return the process with its wait time and turnaround time
        return {
            ...process,
            waitTime: wait,
            turnAroundTime: turnAround
        };
    });
    // Calculate average wait time and turnaround time
    const avgWaitTime = totalWaitTime / processes.length;
    const avgTurnAroundTime = totalTurnAroundTime / processes.length;
    // Step 4: Return the results
    return {
        result,
        avgWaitTime,
        avgTurnAroundTime
    };
}
}}),
"[project]/algorithms/stcf.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "stcf": (()=>stcf)
});
function stcf(processes) {
    let time = 0;
    let completed = 0;
    let remainingProcesses = processes.map((p)=>({
            ...p,
            remainingTime: p.burstTime
        }));
    let result = [];
    while(completed < processes.length){
        let shortestProcess = remainingProcesses.filter((p)=>p.arrivalTime <= time && p.remainingTime > 0).sort((a, b)=>a.remainingTime - b.remainingTime)[0];
        if (shortestProcess) {
            shortestProcess.remainingTime--;
            result.push({
                process: shortestProcess.id,
                time
            });
            if (shortestProcess.remainingTime === 0) {
                completed++;
            }
        }
        time++;
    }
    return result;
}
}}),
"[project]/algorithms/rr.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
// round robin algo
__turbopack_context__.s({
    "rr": (()=>rr)
});
function rr(processes, timeQuantum) {
    let time = 0;
    let totalWaitTime = 0;
    let totalTurnAroundTime = 0;
    const result = [];
    // Create a copy of processes to avoid mutating the original array
    const queue = processes.map((process)=>({
            ...process,
            remainingTime: process.burstTime
        }));
    while(queue.length > 0){
        const process = queue.shift();
        const executionTime = Math.min(timeQuantum, process.remainingTime);
        process.remainingTime -= executionTime;
        queue.forEach((p)=>{
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
                turnAroundTime: turnAroundTime
            });
        }
        time += executionTime;
    }
    const avgWaitTime = totalWaitTime / processes.length;
    const avgTurnAroundTime = totalTurnAroundTime / processes.length;
    return {
        result,
        avgWaitTime,
        avgTurnAroundTime
    };
}
}}),
"[project]/algorithms/mlfq.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
// mlfq algo
__turbopack_context__.s({
    "mlfq": (()=>mlfq)
});
function mlfq(processes, queues = 3, timeQuanta = [
    4,
    8,
    Infinity
]) {
    let time = 0;
    let totalWaitTime = 0;
    let totalTurnAroundTime = 0;
    const result = [];
    // Create queues with different time quanta
    const queuesArray = Array.from({
        length: queues
    }, (_, i)=>({
            timeQuantum: timeQuanta[i],
            processes: []
        }));
    // Add all processes to the first queue initially
    queuesArray[0].processes = processes.map((process)=>({
            ...process,
            remainingTime: process.burstTime,
            queueLevel: 0
        }));
    while(queuesArray.some((q)=>q.processes.length > 0)){
        for(let i = 0; i < queuesArray.length; i++){
            const queue = queuesArray[i];
            if (queue.processes.length > 0) {
                const process = queue.processes.shift();
                const executionTime = Math.min(queue.timeQuantum, process.remainingTime);
                process.remainingTime -= executionTime;
                queuesArray.forEach((q)=>{
                    q.processes.forEach((p)=>{
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
                        turnAroundTime: turnAroundTime
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
        avgTurnAroundTime
    };
}
}}),
"[externals]/chart.js/auto [external] (chart.js/auto, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("chart.js/auto");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/components/Chart.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// components/Chart.js
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js$2f$auto__$5b$external$5d$__$28$chart$2e$js$2f$auto$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/chart.js/auto [external] (chart.js/auto, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js$2f$auto__$5b$external$5d$__$28$chart$2e$js$2f$auto$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js$2f$auto__$5b$external$5d$__$28$chart$2e$js$2f$auto$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
const ChartComponent = ({ data })=>{
    const chartRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (chartRef.current) {
            new __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js$2f$auto__$5b$external$5d$__$28$chart$2e$js$2f$auto$2c$__esm_import$29$__["Chart"](chartRef.current, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Burst Time',
                            data: data.burstTimes,
                            backgroundColor: 'rgba(89, 134, 134, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Wait Time',
                            data: data.waitTimes,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [
        data
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("canvas", {
        ref: chartRef
    }, void 0, false, {
        fileName: "[project]/components/Chart.js",
        lineNumber: 42,
        columnNumber: 10
    }, this);
};
const __TURBOPACK__default__export__ = ChartComponent;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/Header.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Header)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function Header() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
        style: {
            background: "#007BFF",
            padding: "10px",
            color: "white",
            textAlign: "center"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
            children: "CPU Scheduling Simulator"
        }, void 0, false, {
            fileName: "[project]/components/Header.js",
            lineNumber: 4,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Header.js",
        lineNumber: 3,
        columnNumber: 7
    }, this);
}
}}),
"[project]/pages/index.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$fifo$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/fifo.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$sjf$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/sjf.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$stcf$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/stcf.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$rr$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/rr.js [ssr] (ecmascript)"); // Import Round Robin
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$mlfq$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/mlfq.js [ssr] (ecmascript)"); // Import MLFQ
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Chart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Chart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Chart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Chart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
;
;
;
;
function Home() {
    const [numProcesses, setNumProcesses] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(3);
    const [timeQuantum, setTimeQuantum] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(2); // Add time quantum for RR
    const [processes, setProcesses] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [algorithm, setAlgorithm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Generate random processes
    const generateProcesses = ()=>{
        const generatedProcesses = [];
        for(let i = 0; i < numProcesses; i++){
            generatedProcesses.push({
                id: i + 1,
                burstTime: Math.floor(Math.random() * 10) + 1,
                arrivalTime: Math.floor(Math.random() * 10)
            });
        }
        setProcesses(generatedProcesses);
    };
    // Handle algorithm selection
    const handleAlgorithmChange = (e)=>{
        setAlgorithm(e.target.value);
    };
    // Handle running the selected algorithm
    const handleRunAlgorithm = ()=>{
        if (!algorithm || processes.length === 0) return;
        setLoading(true);
        setTimeout(()=>{
            let algoResult = null;
            switch(algorithm){
                case 'FIFO':
                    algoResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$fifo$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["fifo"])(processes);
                    break;
                case 'SJF':
                    algoResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$sjf$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["sjf"])(processes);
                    break;
                case 'STCF':
                    algoResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$stcf$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["stcf"])(processes);
                    break;
                case 'RR':
                    algoResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$rr$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["rr"])(processes, timeQuantum); // Pass time quantum to RR
                    break;
                case 'MLFQ':
                    algoResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$mlfq$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["mlfq"])(processes); // Run MLFQ
                    break;
                default:
                    break;
            }
            setResult(algoResult);
            setLoading(false);
        }, 1000); // Simulate processing delay
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                children: "CPU Scheduling Algorithms"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                children: "Number of Processes: "
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                type: "number",
                value: numProcesses,
                onChange: (e)=>setNumProcesses(parseInt(e.target.value))
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: generateProcesses,
                children: "Generate Processes"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            algorithm === 'RR' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        children: "Time Quantum (for RR): "
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "number",
                        value: timeQuantum,
                        onChange: (e)=>setTimeQuantum(parseInt(e.target.value))
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 86,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                children: "Select Algorithm:"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                value: algorithm,
                onChange: handleAlgorithmChange,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "Select Algorithm"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                        value: "FIFO",
                        children: "FIFO"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                        value: "SJF",
                        children: "SJF"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                        value: "STCF",
                        children: "STCF"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                        value: "RR",
                        children: "Round Robin (RR)"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                        value: "MLFQ",
                        children: "Multi-Level Feedback Queue (MLFQ)"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: handleRunAlgorithm,
                disabled: loading,
                children: loading ? 'Running...' : 'Run Algorithm'
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Processing... Please wait."
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 113,
                columnNumber: 19
            }, this),
            result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        children: [
                            "Results for ",
                            algorithm
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: [
                            "Average Wait Time: ",
                            result.avgWaitTime.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: [
                            "Average Turnaround Time: ",
                            result.avgTurnAroundTime.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Chart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        data: {
                            labels: result.result.map((p)=>`P${p.id}`),
                            burstTimes: result.result.map((p)=>p.burstTime),
                            waitTimes: result.result.map((p)=>p.waitTime),
                            turnaroundTimes: result.result.map((p)=>p.turnAroundTime)
                        }
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 117,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__63d07327._.js.map