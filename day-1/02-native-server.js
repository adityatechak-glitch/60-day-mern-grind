const http = require('http');

const PORT = 3000;

// In-memory data store for testing
const tasks = [
    { id: 1, title: 'Master JavaScript Event Loop', completed: true },
    { id: 2, title: 'Build Native Node Server', completed: false }
];

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const method = req.method;

    console.log(`[${new Date().toISOString()}] ${method} request received for ${pathname}`);

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // ROUTE 1: GET /api/tasks
    if (pathname === '/api/tasks' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: tasks }));
        return;
    }

    // ROUTE 2: POST /api/tasks (Creating a new task)
    if (pathname === '/api/tasks' && method === 'POST') {
        let body = '';

        // Collect incoming data chunks
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // When all data has been received
        req.on('end', () => {
            try {
                const parsedData = JSON.parse(body);

                if (!parsedData.title) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Task title is required' }));
                    return;
                }

                const newTask = {
                    id: tasks.length + 1,
                    title: parsedData.title,
                    completed: false
                };

                tasks.push(newTask);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Task created', data: newTask }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
            }
        });
        return;
    }

    // ROUTE 404: Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Route not found' }));
});

server.listen(PORT, () => {
    console.log(`Native HTTP server running at http://localhost:${PORT}`);
});