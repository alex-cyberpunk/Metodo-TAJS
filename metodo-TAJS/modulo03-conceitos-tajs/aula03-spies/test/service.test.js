import { describe,it,expect,beforeEach,jest } from '@jest/globals';
import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import Service from '../src/service.js'

describe('Service Test Suite', () => {
    let _service;
    const filename = 'teste.ndjson'
    const MOCKED_HASH_PWD = 'hashed_password'

    describe('#create - spies - mocks', () => {
        beforeEach(() => {
            jest.
                spyOn(
                    crypto,
                    crypto.createHash.name
                )
                .mockReturnValue({
                    update: jest.fn().mockReturnThis(),
                    digest: jest.fn().mockReturnValue(MOCKED_HASH_PWD)
                })
            jest
                .spyOn(
                    fs,
                    fs.appendFile.name)
                .mockResolvedValue()
            
            _service = new Service({filename})
        })
        it('should call appendFile with right params', async () => {
            //AAA - Arrange Act Assert
            const expectedCreatedAt = new Date().toISOString()
            const input = {
                username: 'teste',
                password: 'teste'
            }
            //Arrange
            jest
                .spyOn(
                    Date.prototype, 
                    Date.prototype.toISOString.name
                    )
                .mockReturnValue(expectedCreatedAt)
            
            //Act
            await _service.create(input)
            
            //Assert
            expect(crypto.createHash).toHaveBeenCalledTimes(1)
            expect(crypto.createHash).toHaveBeenCalledWith('sha256')

            const hash = crypto.createHash('sha256')
            expect(hash.update).toHaveBeenCalledWith(input.password)
            expect(hash.digest).toHaveBeenCalledWith('hex')

            const expected= JSON.stringify({
                ...input,
                password: MOCKED_HASH_PWD,
                createAt: expectedCreatedAt
            }).concat('\n')

            expect(fs.appendFile).toHaveBeenCalledWith(
                filename,
                expected
            )
        })
    })
})