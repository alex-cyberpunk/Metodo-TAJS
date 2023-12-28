import {it,describe,expect,beforeEach,jest} from '@jest/globals'
import Task from '../src/task.js'
import {setTimeout} from 'node:timers/promises'

describe('Task Test Suite',()=>{
    let _logMock;
    let _task;    
    beforeEach(()=>{
        _logMock = jest.spyOn(
                console,
                console.log.name
        ).mockImplementation();
        
        _task = new Task()
    })

    it.skip('should only run tasks that are due without fake timers (slow)'
    ,async()=>{
        //AAA - Arrange Act Assert
        //Arrange
        const tasks = [
            {
            name:'Task-Will-Run-In-5-secs',
            dueAt: new Date(Date.now()+5000),
            fn: jest.fn()
            },
            {
            name:'Task-Will-Run-In-10-secs',
            dueAt: new Date(Date.now()+10000),
            fn: jest.fn()
            }]
            
            //Act
            _task.save(tasks.at(0))
            _task.save(tasks.at(1))

            _task.run(200)//200ms

            await setTimeout(11000)//11s
            expect(tasks.at(0).fn).toHaveBeenCalled()
            expect(tasks.at(1).fn).not.toHaveBeenCalled()
    },
    //configuração do jest para aumentar o timeout de 15 s
    15000
    )
    it('should only run tasks that are due without fake timers (fast)'
    ,async()=>{
        jest.useFakeTimers()

        //AAA - Arrange Act Assert
        //Arrange
        const tasks = [
            {
            name:'Task-Will-Run-In-5-secs',
            dueAt: new Date(Date.now()+5000),
            fn: jest.fn()
            },
            {
            name:'Task-Will-Run-In-10-secs',
            dueAt: new Date(Date.now()+10000),
            fn: jest.fn()
            }]
            
            //Act
            _task.save(tasks.at(0))
            _task.save(tasks.at(1))

            _task.run(200)//200ms

            jest.advanceTimersByTime(4000)//4s
            
            //ninguem deve ser executado ainda
            expect(tasks.at(0).fn).not.toHaveBeenCalled()
            expect(tasks.at(1).fn).not.toHaveBeenCalled()

            jest.advanceTimersByTime(2000)//2s

            // 4 + 2 = 6s -> task 1 deve ter sido executada
            
            expect(tasks.at(0).fn).toHaveBeenCalled()
            expect(tasks.at(1).fn).not.toHaveBeenCalled()

            jest.advanceTimersByTime(4000)//4s

            // 6 + 4 = 10s -> task 2 deve ter sido executada
            expect(tasks.at(0).fn).toHaveBeenCalled()
            expect(tasks.at(1).fn).toHaveBeenCalled()
    })
})