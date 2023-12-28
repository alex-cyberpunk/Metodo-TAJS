class Person{
    static validate(person){
        if(!person.name){
            throw new Error('name is required')
        }
        if(!person.cpf){
            throw new Error('cpf is required')
        }
       
    }
    static format(person){
        const [name,...lastName] = person.name.split(' ')
        return {
            cpf: person.cpf.replace(/\D/g,''),
            name,
            lastName: lastName.join(' ')
        }
    }
    static save(person){
        ['cpf','name','lastName'].every(prop => {
            if(!person[prop]){
                throw new Error(`cannot save invalid person ${prop} is required`)
            }
        });
        console.log('saved');
    }
    static process(person){
        this.validate(person);
        const formattedPerson = this.format(person);
        this.save(formattedPerson);
        
        return 'ok';
    }
}

Person.process({name: 'John', 
                cpf: '123.456.789-00'})

export default  Person;