console.log("1. Synchronous Start");

setTimeout(() => {
    console.log("4. setTimeout (Macrotask)");
}, 0);

Promise.resolve().then(() => {
    console.log("3. Promise.resolve (Microtask)");
});

console.log("2. Synchronous End");

function fetchDataWithTimeout(url, timeoutMs) {
    const mockAsyncTask = new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Data fetched successfully from ${url}`);
        }, 2000);
    });

    const timeoutTask = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Request Timeout: Operation took too long"));
        }, timeoutMs);
    });

    return Promise.race([mockAsyncTask, timeoutTask]);
}

async function runTest() {
    try {
        console.log("\nStarting network request with 1-second timeout limit...");
        const result = await fetchDataWithTimeout("https://api.example.com/data", 1000);
        console.log(result);
    } catch (error) {
        console.error("Caught Error:", error.message);
    }
}

runTest();