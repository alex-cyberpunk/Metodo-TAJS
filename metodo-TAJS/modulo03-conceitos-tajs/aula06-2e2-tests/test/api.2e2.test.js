import {describe,it,beforeAll,afterAll,jest,expect} from '@jest/globals';

//Para toda vez que da erro no teste, ele não para de rodar
function waitForServerStatus(server) {
    return new Promise((resolve,reject) => {
        server.once('error', (err) => reject(err));
        server.once('listening', resolve);
    })

}

describe('E2E Test Suite', () => {
    describe('E2e Tests for Server in a non-test env', () => {
        it('should start server with PORT 4000', async () => {
            const PORT = 4000
            process.env.NODE_ENV = 'production'
            process.env.PORT = PORT
            jest
                .spyOn(
                    console,
                    console.log.name
                )


            const { default: server } = await import('../src/index.js')
            await waitForServerStatus(server)

            const serverInfo = server.address()
            expect(serverInfo.port).toBe(4000)
            expect(console.log).toHaveBeenCalledWith(
                `server is running at ${serverInfo.address}:${serverInfo.port}`
            )

            return new Promise(resolve => server.close(resolve))
        })
    })

    describe('E2E Test For Server', () => {
        

        let _testServer;
        let _testServerAddress;

        beforeAll(async () => {
            process.env.NODE_ENV = 'test'
            const { default: server } = await import('../src/index.js')
            _testServer = server.listen();

            await waitForServerStatus(_testServer)

            const serverInfo = _testServer.address()
            _testServerAddress = `http://localhost:${serverInfo.port}`

        })

        afterAll(done => _testServer.close(done))
        
        it('should return 404 when POST /persons with wrong url',async () => {
            const response = await fetch(`${_testServerAddress}/unsuported`, {
                method: 'POST'
            });
            expect(response.status).toBe(404);
        
        });
        it('should return 404 and missing file message when body is invalid',async () => {
            const InvalidPerson = {name: 'John Doe'};//missing cpf
            const response = await fetch(`${_testServerAddress}/persons`, {
                method: 'POST',
                body: JSON.stringify(InvalidPerson)
            });
            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.validationError).toBe('cpf is required');
        });

        })
        
    
    
})