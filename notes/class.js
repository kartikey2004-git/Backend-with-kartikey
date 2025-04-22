// To define a class in JavaScript, we use the class keyword:


class Person {
  constructor(name,age) {
    this.name = name; // 'this' refers to the current instance
    this.age = age;
  }
}




// name and age are parameters passed when an object is created from the Person class.



// 2. Constructor Method

// Every class can have a special method called constructor. 


// This method is automatically called when a new object (instance) is created from the class. It's used to initialize the object's properties.



const person1 = new Person("Alice",23)
const person2 = new Person("Bob", 30);


// Each time we use new Person(...), a new instance of the Person class is created, with its own name and age.



