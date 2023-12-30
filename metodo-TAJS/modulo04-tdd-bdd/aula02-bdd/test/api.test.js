import {describe,it,beforeAll,afterAll,jest,expect} from '@jest/globals';
import { server } from '../src/api';
/*
    -Deve cadastrar usuarios e definir categoria onde:
        -Jovens Adultos: 
            - Usuarios de 18 a 25 anos
        -Adultos:
            - Usuarios de 26 a 64 anos
        -Idosos:
            - Usuarios com mais de 65 anos
        -Menor:
            - Estoura um erro
*/


describe('API Users E2E Suite', () => {
    
    function waitForServerStatus(server) {
        return new Promise((resolve, reject) => {
            server.once('error', (err) => reject(err))
            server.once('listening', () => resolve())
        })
    }

    function createUser(data) {
        return fetch(`${_testServerAddress}/users`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async function findUserById(id) {
        const user = await fetch(`${_testServerAddress}/users/${id}`)
        return user.json()
    }

    let _testServer
    let _testServerAddress

    beforeAll(async () => {
        _testServer = server.listen();

        await waitForServerStatus(_testServer)

        const serverInfo = _testServer.address()
        _testServerAddress = `http://localhost:${serverInfo.port}`

    })

    afterAll(done => {
        server.closeAllConnections()
        _testServer.close(done)
    })
    it('should register a new user with young-adult category',async () => {
        const expectedCategory = 'young-adult'
        //Sempre que estiver trabalhando com datas, é importante mockar o tempo
        jest.useFakeTimers({
            now: new Date('2023-11-23T00:00')
        })
        const response = await createUser({
            name: 'John Doe',
            birthDay: '2000-01-01' // 21 anos
        })
        expect(response.status).toBe(201)
        const result = await response.json()
        const user = await findUserById(result.id)
        expect(user.category).toBe(expectedCategory)
    })
    it.todo('should register a new user with adult category')
    it.todo('should register a new user with senior category')
    it('should throw an error when registering a under-age user',async function() {
        const response = await createUser({
            name: 'John Doe',
            birthDay: '2010-01-01' // 11 anos
        })
        expect(response.status).toBe(400)
        const result = await response.json()
        expect(response.statusText).toEqual({message: 'User must be 18 years old or more'})
    })
    
})