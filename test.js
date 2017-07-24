const http = require('http');
// const postData = querystring.stringify({
//   'msg': 'Hello World!'
// });

const options = {
  hostname: 'www.baidu.com',
  port: 80,
  path: '/',
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': 0
  }
};

const req = http.request(options, (res) => {
  // console.log(`STATUS: ${res.statusCode}`);
  // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    // console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    // console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();