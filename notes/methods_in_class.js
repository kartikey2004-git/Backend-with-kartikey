// Methods in a Class :: Methods are functions defined inside a class, which define the behavior of the object.


// These methods can operate on the object’s data (properties) and perform actions.

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(
      `Hello, my name is ${this.name} and I’m ${this.age} years old.`
    );
  }
}

const person = new Person("Alice", 25);
person.greet();
console.log(person.name);

// greet() is a method that uses the object's properties (name and age) to produce a message.
