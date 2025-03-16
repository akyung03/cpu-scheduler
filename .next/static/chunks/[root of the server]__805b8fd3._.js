(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/[root of the server]__805b8fd3._.js", {

"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s({
    "connect": (()=>connect),
    "setHooks": (()=>setHooks),
    "subscribeToUpdate": (()=>subscribeToUpdate)
});
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case "turbopack-connected":
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn("[Fast Refresh] performing full reload\n\n" + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + "You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n" + "Consider migrating the non-React component export to a separate file and importing it into both files.\n\n" + "It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n" + "Fast Refresh requires at least one parent function component in your React tree.");
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error("A separate HMR handler was already registered");
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: "turbopack-subscribe",
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: "turbopack-unsubscribe",
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: "ChunkListUpdate",
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted" || updateA.type === "deleted" && updateB.type === "added") {
        return undefined;
    }
    if (updateA.type === "partial") {
        invariant(updateA.instruction, "Partial updates are unsupported");
    }
    if (updateB.type === "partial") {
        invariant(updateB.instruction, "Partial updates are unsupported");
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: "EcmascriptMergedUpdate",
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted") {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === "deleted" && updateB.type === "added") {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: "partial",
            added,
            deleted
        };
    }
    if (updateA.type === "partial" && updateB.type === "partial") {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: "partial",
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === "added" && updateB.type === "partial") {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: "added",
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === "partial" && updateB.type === "deleted") {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: "deleted",
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    "bug",
    "error",
    "fatal"
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    "bug",
    "fatal",
    "error",
    "warning",
    "info",
    "log"
];
const CATEGORY_ORDER = [
    "parse",
    "resolve",
    "code generation",
    "rendering",
    "typescript",
    "other"
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case "issues":
            break;
        case "partial":
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === "notFound") {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}}),
"[project]/algorithms/fifo.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/algorithms/sjf.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/algorithms/stcf.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/algorithms/rr.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/algorithms/mlfq.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Chart.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// components/Chart.js
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$auto$2f$auto$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/auto/auto.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/dist/chart.js [client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
;
;
const ChartComponent = ({ data })=>{
    _s();
    const chartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartComponent.useEffect": ()=>{
            if (chartRef.current) {
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"](chartRef.current, {
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
        }
    }["ChartComponent.useEffect"], [
        data
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: chartRef
    }, void 0, false, {
        fileName: "[project]/components/Chart.js",
        lineNumber: 42,
        columnNumber: 10
    }, this);
};
_s(ChartComponent, "X+1SfQQ6xefXNU27aQW843M7cTw=");
_c = ChartComponent;
const __TURBOPACK__default__export__ = ChartComponent;
var _c;
__turbopack_context__.k.register(_c, "ChartComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Header.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Header)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function Header() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        style: {
            background: "	#000000",
            padding: "10px",
            color: "white",
            textAlign: "center"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/pages/index.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$fifo$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/fifo.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$sjf$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/sjf.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$stcf$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/stcf.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$rr$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/rr.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$mlfq$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/algorithms/mlfq.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Chart.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    _s();
    const [numProcesses, setNumProcesses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(3);
    const [timeQuantum, setTimeQuantum] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(2);
    const [processes, setProcesses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedAlgorithms, setSelectedAlgorithms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
                        newResults.FIFO = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$fifo$2e$js__$5b$client$5d$__$28$ecmascript$29$__["fifo"])(processes);
                        break;
                    case 'SJF':
                        newResults.SJF = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$sjf$2e$js__$5b$client$5d$__$28$ecmascript$29$__["sjf"])(processes);
                        break;
                    case 'STCF':
                        newResults.STCF = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$stcf$2e$js__$5b$client$5d$__$28$ecmascript$29$__["stcf"])(processes);
                        break;
                    case 'RR':
                        newResults.RR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$rr$2e$js__$5b$client$5d$__$28$ecmascript$29$__["rr"])(processes, timeQuantum);
                        break;
                    case 'MLFQ':
                        newResults.MLFQ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$algorithms$2f$mlfq$2e$js__$5b$client$5d$__$28$ecmascript$29$__["mlfq"])(processes);
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
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"]();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: "CPU Scheduling Algorithms"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "1. Enter the number of processes and click ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "2. Select the algorithms you want to run."
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "3. Click ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "4. After running, click ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                children: "Number of Processes: "
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "number",
                value: numProcesses,
                onChange: (e)=>setNumProcesses(parseInt(e.target.value))
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: generateProcesses,
                children: "Generate Processes"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            selectedAlgorithms.includes('RR') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: "Time Quantum (for RR): "
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
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
                    ].map((algorithm)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: runAlgorithms,
                disabled: loading || processes.length === 0,
                children: loading ? 'Running...' : 'Run Selected Algorithms'
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Processing... Please wait."
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 163,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexWrap: 'wrap'
                },
                children: Object.entries(results).map(([algorithm, result])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            margin: '10px',
                            padding: '10px',
                            border: '1px solid #ccc'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: algorithm
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Average Wait Time: ",
                                    result.avgWaitTime?.toFixed(2) ?? 'N/A'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 169,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Average Turnaround Time: ",
                                    result.avgTurnAroundTime?.toFixed(2) ?? 'N/A'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
_s(Home, "yiFTkQBRSXwGJDkZZFLywmAG3+Y=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/index.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}}),
"[project]/pages/index (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, m: module } = __turbopack_context__;
{
__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__805b8fd3._.js.map