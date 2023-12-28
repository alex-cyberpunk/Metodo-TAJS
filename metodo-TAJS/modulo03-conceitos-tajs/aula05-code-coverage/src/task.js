export default class Task{
    #tasks = new Set()
    save({name, dueAt,fn}){
       console.log(
        `Task ${name} saved and will run at ${dueAt.toLocaleString()}`
        ) 
    this.#tasks.add({name, dueAt, fn})
    }
    
    run (everyMs){
        const intervalId = setInterval(()=>{
            const now = Date.now()

            if(!this.#tasks.size===0){
                console.log('task finished')
                clearInterval(intervalId)
                return;
            }
             
            for(const task of this.#tasks){
                if(now >= task.dueAt.getTime()){
                    task.fn()
                    this.#tasks.delete(task)
                }
            }
            if(!this.#tasks.size){
                clearInterval(intervalId)
            }
        },everyMs)
    }

}