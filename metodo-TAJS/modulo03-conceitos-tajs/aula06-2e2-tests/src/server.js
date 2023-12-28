import {createServer} from 'node:http';
import {once} from 'node:events';
import Person from './person.js';
import { error } from 'node:console';

const server = createServer(async (request, response) => {
    if(request.method !== 'POST'|| request.url !== '/persons'){
        response.writeHead(404);
        response.end();
        return;
    }
    try{
        const data = (await once(request, 'data')).toString();
        const result = Person.process(JSON.parse(data));
        return response.end(JSON.stringify({result}));
    }
    catch(err){
        if(err.message.includes('required')){
            response.writeHead(400);
            response.write(
                JSON.stringify({validationError: err.message})
            )
            response.end();
            return;
        }
        console.log('err',err);
        response.writeHead(500);
        response.end();
        return;
    }
})

export default server;