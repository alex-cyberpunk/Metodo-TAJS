import { describe,it,expect,beforeEach,jest } from '@jest/globals';
import fs from 'node:fs/promises'
import Service from '../src/service.js'

describe('Service Test Suite', () => {
    let _service;
    const filename = 'teste.ndjson'
    beforeEach(() => {
        _service = new Service({filename})
    })

    describe('#read', () => {
        it('should return an empty array', async () => {
            
            //Simula o retorno do fs.readFile
            jest.spyOn(
                fs,
                fs.readFile.name).mockResolvedValue('')
            
            const result = await _service.read()                
            expect(result).toEqual([])
        })
        it('should return users without passowrd if files contains users', async () => {
            //Arrange
            const dbData =[
                {
                    username: 'John Doe',
                    password: '123456',
                    createAt: '2021-09-07T23:42:05.000Z'
                },
                {
                    username: 'Jane EAE',
                    password: '35656565',
                    createAt: '2021-09-07T23:42:05.000Z'
                }
            ]

            const fileContents = dbData
                .map(item => JSON.stringify(item).concat('\n')).join('')

            jest.spyOn(
                fs,
                "readFile").mockResolvedValueOnce(fileContents)                    
            //Act
            const result = await _service.read()    
            
            //Assert
            expect(result).toEqual(dbData.map(({password,...rest})=> rest))
        })
    })    
})