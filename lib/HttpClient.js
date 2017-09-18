const https = require('https');
const queryString = require('querystring');


class HttpClient {
  request(options, request, url){
    return new Promise((resolve,reject)=>{
      var postData = "", httpsOptions={};

      //merge some options into httpsOptions
      Object.assign(httpsOptions,{
        hostname: options.hostName,
        path: options.path,
        method: options.method,
        port: options.port,
        headers: options.headers,
        timeout: options.timeout
      });

      if (options.json){
        postData = JSON.stringify(request);
        httpsOptions.headers['Content-Type'] = "application/json";
      }
      else{
        //not json, treated as basic http url encoded
        postData = queryString.stringify(request);
        httpsOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }

      httpsOptions.headers['Content-Length']= Buffer.byteLength(postData);

      if('basicAuth' in options){
        let base64AuthHeader = new Buffer(options.basicAuth.user + ":" + options.basicAuth.password).toString('base64');
        httpsOptions.headers.Authorization = "Basic " + base64AuthHeader;
      }

      var req = https.request(httpsOptions, (result) => {
        var rawResult = [];
        result.setEncoding('utf8');
        result.on('data',(chunk) => {
          rawResult.push(chunk);
        });
        result.on('end',() => {
          rawResult = rawResult.join("");
          const httpResult = {
            rawResponse:rawResult,
            statusCode: result.statusCode,
            postData:postData,
            url:url,
            headers:result.headers,
            originalRequest:request
          };
          resolve(httpResult);
        });
        result.on('error',reject);
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }
}

module.exports = HttpClient;
