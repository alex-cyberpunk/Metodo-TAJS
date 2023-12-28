import {createServer} from 'node:http';
import {once} from 'node:events';

const server = createServer(async (request, response) => {
    if(request.method !== 'POST'|| request.url !== '/persons'){
        response.writeHead(404);
        response.end();
        return;
    }
    try{
        const data = (await once(request, 'data')).toString();
        console.log('data',data);
        return response.end();
    }
    catch(err){
        response.writeHead(500);
        response.end();
        return;
    }
})

export default server;