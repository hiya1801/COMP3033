// ==========================
// server.js
// ==========================
// Node.js + Connect server that performs math operations
// Handles sample URLs for add, subtract, multiply, and divide
// Includes a friendly welcome page at the root path (/)
// ==========================

const connect = require('connect'); // middleware framework for Node.js
const url = require('url');         // built-in module for parsing query parameters

const app = connect(); // create the Connect application

//welcome page
app.use('/', (req, res, next) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(
        'Hello...,My name is Hiya...!!!\n\n' +
      'Welcome to my Lab 2!\n\n' +
      'Try the sample URLs:\n' +
      'http://localhost:3000/lab2?method=add&x=16&y=4\n' +
      'http://localhost:3000/lab2?method=subtract&x=16&y=4\n' +
      'http://localhost:3000/lab2?method=multiply&x=16&y=4\n' +
      'http://localhost:3000/lab2?method=divide&x=16&y=4\n'
    );
  } else {
    next(); // not root, move to next route
  }
});

// route (math operations)
// handles URLs 
app.use('/lab2', (req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Only GET requests are supported' }));
    return;
  }

  // Parse the query string into an object
  const q = url.parse(req.url, true).query;
  const method = (q.method || '').toLowerCase();
  const x = q.x;
  const y = q.y;

  // Validate required parameters
  if (!method || x === undefined || y === undefined) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing query parameters. Use ?method=&x=&y=' }));
    return;
  }

  // Convert x and y to numbers
  const numX = Number(x);
  const numY = Number(y);

  // Validate numeric input
  if (Number.isNaN(numX) || Number.isNaN(numY)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'x and y must be numeric' }));
    return;
  }

  // Perform requested operation
  let result;
  switch (method) {
    case 'add':
      result = numX + numY;
      break;
    case 'subtract':
      result = numX - numY;
      break;
    case 'multiply':
      result = numX * numY;
      break;
    case 'divide':
      if (numY === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Division by zero' }));
        return;
      }
      result = numX / numY;
      break;
    default:
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Invalid method. Supported: add, subtract, multiply, divide'
      }));
      return;
  }

  // Return the result as a JSON object
  const response = {
    x: String(x),
    y: String(y),
    operation: method,
    result: String(result)
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);