import {describe, expect, jest, test,it} from '@jest/globals'
import Person from '../src/person.js'

describe('#Person Suite', () => {
    describe('#validate', () => {
        it('should throw an error when there is no name', () => {
            //mock e a entrada necessaria para que o teste seja executado
            const mockInvalidPerson = {name: '', cpf: '123.456.789-00'}
            const result =() => Person.validate(mockInvalidPerson)
            expect(result).toThrow(new Error('name is required'))
        })
        it('should throw an error when there is no cpf', () => {
            const mockInvalidCPF = {name: 'John', cpf: ''}
            const result =() => Person.validate(mockInvalidCPF)
            expect(result).toThrow(new Error('cpf is required'))
        })
        it('should return nothing when the person is valid', () => {
            const mockValidPerson = {name: 'John', cpf: '123.456.789-00'}
            const result =() => Person.validate(mockValidPerson)
            expect(result).not.toThrow()
        })
    })
    describe('#format', () => {
        //parte do principio que os dados foram validados
        it('should format the person name and CPF', () => {
            //AAA
    
            //Arrange
            const mockPerson = {name: 'John Doe', cpf: '123.456.789-00'}
    
            //Act
            const result = Person.format(mockPerson)
            
            //Assert
            const expected = {name: 'John', 
                              lastName: 'Doe', 
                              cpf: '12345678900'}
            expect(result).toEqual(expected)
        })
    })

    describe('#save', () => {
            it('should return ok when the person is saved', () => {
            const mockPerson = {name: 'John Doe', cpf: '123.456.789-00'}
            const result = Person.process(mockPerson)
            expect(result).toEqual('ok')
        })
        it('should return an error when the person is not saved', () => {
            const mockPerson = {name: 'John Doe', cpf: '123.456.789-00'}
            const result = Person.process(mockPerson)
            expect(result).toEqual('ok')
        })
    })

    describe('#process', () => {
        //Uma ideia e nao retestar o que ja foi testado
        //checkpoints

        //Mocks sao simulacoes de objetos reais ao testar o comportamento de um objeto

        it('should process a valid person', () => {
            //AAA

            const mockPerson = {
                                name: 'John Doe', 
                                cpf: '123.456.789-00'}
            //Arrange
            jest.spyOn(
                Person, 
                Person.validate.name).mockReturnValue()
            jest.spyOn(
                Person, 
                Person.format.name).mockReturnValue({
                    cpf:'12345678900',
                    name:'John',
                    lastName:'Doe'
                    })
            //Act
            const result = Person.process(mockPerson)                
            //Assert
            expect(result).toEqual('ok')        
        })
        
    })
})
