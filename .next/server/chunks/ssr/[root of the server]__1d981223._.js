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
// algorithms/stcf.js
__turbopack_context__.s({
    "stcf": (()=>stcf)
});
function stcf(processes) {
    if (!processes || processes.length === 0) {
        return {
            result: [],
            avgWaitTime: 0,
            avgTurnAroundTime: 0
        };
    }
    let time = 0;
    let totalWaitTime = 0;
    let totalTurnAroundTime = 0;
    const result = [];
    const processQueue = processes.map((process)=>({
            ...process,
            remainingTime: process.burstTime,
            waitTime: 0,
            completed: false
        }));
    while(processQueue.some((p)=>!p.completed)){
        let shortestProcess = null;
        for (const process of processQueue){
            if (!process.completed && process.arrivalTime <= time && (!shortestProcess || process.remainingTime < shortestProcess.remainingTime)) {
                shortestProcess = process;
            }
        }
        if (!shortestProcess) {
            time++;
            continue;
        }
        shortestProcess.remainingTime -= 1;
        time += 1;
        processQueue.forEach((p)=>{
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
                turnAroundTime: turnAroundTime
            });
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
            background: "	#000000",
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
"[externals]/jspdf [external] (jspdf, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("jspdf", () => require("jspdf"));

module.exports = mod;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$rr$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/rr.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$mlfq$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/mlfq.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Chart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Chart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$jspdf__$5b$external$5d$__$28$jspdf$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/jspdf [external] (jspdf, cjs)");
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
;
function Home() {
    const [numProcesses, setNumProcesses] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(3);
    const [timeQuantum, setTimeQuantum] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(2);
    const [processes, setProcesses] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedAlgorithms, setSelectedAlgorithms] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
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
        setResults({});
    };
    const handleAlgorithmChange = (e)=>{
        const algorithm = e.target.value;
        if (selectedAlgorithms.includes(algorithm)) {
            setSelectedAlgorithms(selectedAlgorithms.filter((algo)=>algo !== algorithm));
        } else {
            setSelectedAlgorithms([
                ...selectedAlgorithms,
                algorithm
            ]);
        }
    };
    const runAlgorithms = ()=>{
        if (selectedAlgorithms.length === 0 || processes.length === 0) return;
        setLoading(true);
        setTimeout(()=>{
            const newResults = {};
            selectedAlgorithms.forEach((algorithm)=>{
                switch(algorithm){
                    case 'FIFO':
                        newResults.FIFO = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$fifo$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["fifo"])(processes);
                        break;
                    case 'SJF':
                        newResults.SJF = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$sjf$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["sjf"])(processes);
                        break;
                    case 'STCF':
                        newResults.STCF = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$stcf$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["stcf"])(processes);
                        break;
                    case 'RR':
                        newResults.RR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$rr$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["rr"])(processes, timeQuantum);
                        break;
                    case 'MLFQ':
                        newResults.MLFQ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$mlfq$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["mlfq"])(processes);
                        break;
                    default:
                        break;
                }
            });
            setResults(newResults);
            setLoading(false);
        }, 1000);
    };
    const resetSimulation = ()=>{
        setNumProcesses(3);
        setTimeQuantum(2);
        setProcesses([]);
        setSelectedAlgorithms([]);
        setResults({});
    };
    const downloadPDF = ()=>{
        const doc = new __TURBOPACK__imported__module__$5b$externals$5d2f$jspdf__$5b$external$5d$__$28$jspdf$2c$__cjs$29$__["default"]();
        let yOffset = 7;
        Object.entries(results).forEach(([algorithm, result])=>{
            doc.text(`Algorithm: ${algorithm}`, 7, yOffset);
            yOffset += 7;
            doc.text(`Average Wait Time: ${result.avgWaitTime?.toFixed(2) ?? 'N/A'}`, 7, yOffset);
            yOffset += 7;
            doc.text(`Average Turnaround Time: ${result.avgTurnAroundTime?.toFixed(2) ?? 'N/A'}`, 7, yOffset);
            yOffset += 7;
            result.result.forEach((process)=>{
                doc.text(`Process ${process.id}: Burst Time - ${process.burstTime}, Wait Time - ${process.waitTime}, Turnaround Time - ${process.turnAroundTime}`, 10, yOffset);
                yOffset += 7;
            });
            yOffset += 7;
        });
        doc.save('scheduling_results.pdf');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                children: "CPU Scheduling Algorithms"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: [
                    "1. Enter the number of processes and click ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                        children: "Generate Processes"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 112,
                        columnNumber: 53
                    }, this),
                    "."
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "2. Select the algorithms you want to run."
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: [
                    "3. Click ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                        children: "Run Selected Algorithms"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 114,
                        columnNumber: 19
                    }, this),
                    " to see the results."
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: [
                    "4. After running, click ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                        children: "Reset Simulation"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 115,
                        columnNumber: 34
                    }, this),
                    " to start a new simulation."
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                children: "Number of Processes: "
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                type: "number",
                value: numProcesses,
                onChange: (e)=>setNumProcesses(parseInt(e.target.value))
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: generateProcesses,
                children: "Generate Processes"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            selectedAlgorithms.includes('RR') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        children: "Time Quantum (for RR): "
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "number",
                        value: timeQuantum,
                        onChange: (e)=>setTimeQuantum(parseInt(e.target.value))
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 126,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        children: "Select Algorithms:"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    [
                        'FIFO',
                        'SJF',
                        'STCF',
                        'RR',
                        'MLFQ'
                    ].map((algorithm)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    value: algorithm,
                                    checked: selectedAlgorithms.includes(algorithm),
                                    onChange: handleAlgorithmChange
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.js",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this),
                                algorithm
                            ]
                        }, algorithm, true, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: runAlgorithms,
                disabled: loading || processes.length === 0,
                children: loading ? 'Running...' : 'Run Selected Algorithms'
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: resetSimulation,
                style: {
                    marginLeft: '10px',
                    backgroundColor: 'red',
                    color: 'white'
                },
                children: "Reset Simulation"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: downloadPDF,
                style: {
                    marginLeft: '10px',
                    backgroundColor: 'green',
                    color: 'white'
                },
                children: "Download Results as PDF"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Processing... Please wait."
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 163,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexWrap: 'wrap'
                },
                children: Object.entries(results).map(([algorithm, result])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            margin: '10px',
                            padding: '10px',
                            border: '1px solid #ccc'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                children: algorithm
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                children: [
                                    "Average Wait Time: ",
                                    result.avgWaitTime?.toFixed(2) ?? 'N/A'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 169,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                children: [
                                    "Average Turnaround Time: ",
                                    result.avgTurnAroundTime?.toFixed(2) ?? 'N/A'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 170,
                                columnNumber: 13
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
                                lineNumber: 172,
                                columnNumber: 13
                            }, this)
                        ]
                    }, algorithm, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 165,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__1d981223._.js.map