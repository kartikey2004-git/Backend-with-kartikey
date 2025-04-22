// Inheritance: Extending a Class

// One of the most powerful features of classes is inheritance

//  With inheritance, you can create a new class that is based on an existing class.

// The new class inherits all the properties and methods of the parent class.

// matlab nayi class jo banegi usme saari properties and saare methods honge parent class ke



class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hello, my name is ${this.name} and I’m ${this.age} years old.`);
  }
}




class Student extends Person {
  constructor(name,age,course) {
    super(name,age) // Call the parent class constructor
    this.course = course
  }

  introduce() {
    console.log(`I’m studying ${this.course}.`);
  }
}

const student = new Student("Bob", 22, "Computer Science");


student.greet(); // Inherited from Person class

student.introduce(); // Specific to Student class


