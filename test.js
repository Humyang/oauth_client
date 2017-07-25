const http = require('http');
// const postData = querystring.stringify({
//   'msg': 'Hello World!'
// });

// const options = {
//   hostname: 'www.baidu.com',
//   port: 80,
//   path: '/',
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Content-Length': 0
//   }
// };

// const req = http.request(options, (res) => {
//   // console.log(`STATUS: ${res.statusCode}`);
//   // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
//   res.setEncoding('utf8');
//   res.on('data', (chunk) => {
//     // console.log(`BODY: ${chunk}`);
//   });
//   res.on('end', () => {
//     // console.log('No more data in response.');
//   });
// });

// req.on('error', (e) => {
//   console.error(`problem with request: ${e.message}`);
// });

// req.end();


const body = JSON.stringify({
      'token': '123333'
    });
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/token_verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Content-Length": Buffer.byteLength(body)
      }
    };
    const req = http.request(options, (res) => {
      let data = ''
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        // data = chunk
        console.log(chunk)
      });
      res.on('end', () => {
        // console.log(123)
      });
    });

    req.on('error', (e) => {
      // reject(e.message)
    });
    // let postData = new formData()
    // req.write(postData);
    req.end(body);