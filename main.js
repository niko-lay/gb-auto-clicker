const http = require('http');
const fs = require('fs');
const path = require('path');

var opts =  {host: 'www.gearbest.com',
              port: 80,
              path: '/m-promotion-active-263.html',
              method: 'POST',
              headers: {
                        'User-Agent': 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:50.0) Gecko/20100101 Firefox/50.0',
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': 'http://www.gearbest.com/m-promotion-active-263.html',
                        'Cookie': 'SET YOUR VALUE HERE'
                        }
            };

 var postData = function (inData, cb){

    var  requester = http.request(opts, function(res){
        var data = '';
           if (res.statusCode !== 200) {
              return cb('server fail', null);
           }

           res.setEncoding('utf8');

           res.on('data', function (chunk) {
               data += chunk;
           });
           res.on('end', function () {
               cb(null, data);
        });
    });

    requester.on('error', function(err){
        console.warn('Error in request' + err);
    });

    requester.setHeader('Content-Length', inData.length);

    requester.write(inData);
    requester.end();
 };

var count = 123; // initial value

var appDir = path.dirname(require.main.filename);
try {
    var configParams = JSON.parse (fs.readFileSync(appDir + '/data/conf.json'));
    count = configParams.count;
    console.log(`Using initial 'count' value: ${count}`);
}catch(e){
    console.warn(`Some error happens. Using hardcoded initial 'count' value: ${count}`);
}


var timerId = setTimeout(function tick() {
    var r = Math.random() * 3 + 4 ;
    count++;

    var data = `fack_type=${count}&site_type=2&is_share_code=16`;
    postData(data, function(err, res){
        console.log(new Date().toISOString() + '  ' + res);
    });


    timerId = setTimeout(tick, r * 1000);
}, 2000);

process.on('SIGINT', () => {
    clearTimeout(timerId);
    console.log(`Exitig... Count value is: ${count}`);
    var conf = {'count': count};
    fs.writeFileSync(appDir + '/data/conf.json',JSON.stringify(conf));

    process.exit(0);
});