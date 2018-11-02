var http = require('http');
var url  = require('url');


var server = http.createServer(function(req,res){

    var path = url.parse(req.url,true);
    var pathName = path.pathname; 
    var clearPath = pathName.replace(/^\/+|\/+$/g,'');
    var query = url.query;
    var method = req.method.toLowerCase();
    var buffer  = '';
    var payload = {};
    
    req.on('data',function(chunk){
        buffer += chunk;

    });
    req.on('end',function(){
        try{
            payload = JSON.parse(buffer);
        }catch(e){
            payload = {};    
        }
        
        var handler = typeof(routes[clearPath]) !== 'undefined' ? routes[clearPath] : routes.notFound;
        var data = {
            'query' : query,
            'path' : clearPath,
            'method' : method,
            'payload' : payload
        };

        handler(data,function(statusCode,payload){
                statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
                payload    = typeof(payload) == 'object' ? payload: {};
                res.setHeader('Content-Type','application/json');
                res.writeHead(statusCode);
                payload = JSON.stringify(payload);
                res.end(payload);
        }); 
    });
});

server.listen(3000,function(){
    console.log('Server up on port '+3000);
});

var routes = {};
routes.hello = function(data,callback){
    var payload = data.payload;
    var lg = typeof(payload.lg) !== 'undefined' ? payload.lg : 'en';
    var msg = typeof(ms[lg])!== 'undefined' ? ms[lg]: ms.en;
    callback(200,{"msg":msg});
};
routes.notFound = function(data,callback){
    callback(404,{msj:':( not found '+data.path});
};

var ms = {
    es : 'Hola',
    en : 'Hello',
    it : 'Ciao',
    fr : 'Salut'
};