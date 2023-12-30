import { randomUUID } from 'node:crypto';
import {once} from 'node:events';
import {createServer} from 'node:http';

const usersDB=[];

const getUserCategory = (birthDay) => {
    const today = new Date();
    const birthDate = new Date(birthDay);
    const age = today.getFullYear() - birthDate.getFullYear();
    if(age >= 18 && age <= 25) return 'young-adult';
    if(age >= 26 && age <= 64) return 'adult';
    if(age >= 65) return 'senior';
    if(age<18) throw new Error('User must be 18 years old or more');
}

const server = createServer(async(req, res) => {
    try{
        if(req.url === '/users' && req.method === 'POST') {
            const user = JSON.parse(await once(req,'data'));
            const updatedUser = {
                ...user,
                id: randomUUID(),
                category: getUserCategory(user.birthDay)
            }
            
            usersDB.push(updatedUser)
            res.writeHead(201, 
                {'Content-Type': 'application/json'});
            res.end(JSON.stringify({id:updatedUser.id}));
            return;
        }
        if(req.url.startsWith('/users') && req.method === 'GET') {
            const id = req.url.split('/')[2];
            const user = usersDB.find((user) => user.id === id);
            res.writeHead(200, 
                {'Content-Type': 'application/json'});
            res.end(JSON.stringify(user));
            return;
        }
    }
    catch(err) {
        if(err.message === 'User must be 18 years old or more'){
            res.writeHead(400,{
                'Content-Type': 'application/json'
            });
            }
            return;
        
        res.writeHead(500, 
            {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            message: err.message}));
        return;
    }    
});

export {server};