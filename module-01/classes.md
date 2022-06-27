# Classes


### Object Orientated Programming in Javascript

So far we have looked at how we can create objects in JavaScript, and add methods and properties to those objects.  It's time we turn our attention to Object Oriented Programming.

When we talk about Object Oriented Programming, we're describing a way of organizing code to mirror real world problems and data structures in our applications.  In essence, we are using code to "model" the world around us.

In many languages we use **classes** when talking about OOP. With the introduction of ES6 (ECMA2015), we now have [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) in  Javascript, and so we'll be making use of these. 



## What is a class?

In ES6 Javascript, a class is like a special kind of function. It lets us represent data in a way that models many real world things:

```javascript
class Duck {
  constructor(name) {
  	this.name = name
  }
}
```

The convention is to use title casing e.g. `MyAmazingClass` for classes, rather than the usual camel casing we use for functions (and pretty much everything else) e.g. `myGloriousFunction`

#### What about the `new` operator?

The [`new`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) operator in Javascript creates a new instance of an object or class. By instance, we mean we've created a new object using the class we just defined. 

This allows to create multiple classes with different arguments passed through.

In practice:

```javascript
const scrooge = new Duck('Scrooge Mcduck')
const donald = new Duck('Donald Duck')
```

We now have two *instances* of the class Duck, `scrooge` and `donald`.

To be sure `scrooge` is in fact a `Duck`, we can:

```javascript
scrooge instanceof Duck
// true
```

You can think of classes as like 'blueprints', or 'factories' that create multiple things of the same type, but with different values. If we used objects to model our data, we would need to do this instead:

```
const scroogeObj = {
	name: 'Scrooge Mcduck'
}

const donald = {
	name: 'Donald Duck'
}

```
So being able to say what properties we want _without yet defining the values yet_ makes classes super useful for us.


## Multiple arguments

What about if we wanted to instantiate our ducks with an occupation as well? We can update our class like so:

```javascript
class Duck {
  constructor(name, occupation) {
  	this.name = name
  	this.occupation = occupation
  }
}
```

Now we need to pass in a second argument when we instantiate a new `Duck`.

```javascript
const scrooge = new Duck('Scrooge Mcduck', 'Business owner')
```

## Methods

Classes can also have methods, just like objects. Methods are functions that belongs to the class and can do things with the class data. Every instance of a class you make will have access to this method.

Example:

```javascript
class Duck {
  constructor(name, occupation) {
  	this.name = name
  	this.occupation = occupation
  }
  quack() {
  	console.log('Quack. I\'m a savvy business duck.')
  }
}

const scrooge = new Duck('Scrooge Mcduck', 'Business owner')
scrooge.quack();

```
> Remember, we add our methods in the class definition, not inside our constructor function!


## Extending classes 

One of the more powerful features of classes is that they can extend each other. This makes our code more clean and modular.

Let's say we want to introduce a new class, a Dog, that wants to protest against the wealthy ducks:

```javascript
class Dog {
  constructor(name) {
  	this.name = name
  }
  protest() {
  	console.log('I\'m a Dog! My voice counts!')
  }
}

const goofy = new Dog('Goofy')
goofy.protest()

```

But the ducks aren't happy with this. They also want their voices to be heard--so lets give them a protest method too.

```
class Duck {
  constructor(name, occupation) {
  	this.name = name
  	this.occupation = occupation
  }
  quack() {
  	console.log('Quack. I\'m a savvy business duck.')
  }
  protest() {
  	console.log('I\'m a Duck! My voice counts!')
  }
}
```

The only problem with this is, that the same method is now duplicated across our classes. And if want to add a new `class` called `Mouse`, we'll have to give them the `protest` method too...

What can be done about this, so that all animals can have their voices heard and have representation?

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }

  protest() {
  	console.log(`I'm a {this.constructor.name}! My voice counts!`)
  }
}

class Duck extends Animal {
  constructor(name, occupation) {
  	super(name)
  	this.occupation = occupation
  }
  quack() {
  	console.log('Quack. I\'m a savvy business duck.')
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name)
    this.occupation = occupation
  }
}

class Mouse extends Animal {
  constructor(name) {
    super(name)
  }
}



const goofy = new Dog('Goofy', 'Plumber')
console.log(goofy.name)
// Goofy
goofy.protest()
// I'm a Dog! My voice counts!
console.log(goofy.occupation)
// Plumber

const scrooge = new Duck('Scrooge Mcduck', 'Business owner')
console.log(scrooge.name)
// Scrooge Mcduck
scrooge.protest()
// I'm a Duck! My voice counts!
scrooge.quack()
// Quack. I'm a savvy business duck.'
console.log(scrooge.occupation)
// Business owner

const mickey = new Mouse('Mickey Mouse')
console.log(mickey.name)
// Mickey Mouse
mickey.protest()
// I'm a Mouse! My voice counts!


```

So what's going on here?

We've just created what's known as a _class heirarchy_.

Animals are our most generic type, and we can use the `extends` keyword to say that our `Dog` and `Duck` classes should inherit all of the properties and methods from our `Animal`, before adding their own properties and methods that apply specifically to dogs or to ducks. 

**So in this case**:

- Ducks inherit the `name` property, and the `protest` method from Animal. And then in addition, they add their own `occupation` property, plus their own `quack` method.
- Ducks inherit the `name` property, and the `protest` method from Animal, just like Ducks. In addition, they add their own `occupation` property.
- Finally the Mouse inherits the `name` property, and the `protest` method from Animal, and adds no new properties and methods of its own.



We've also used *super* in the constructors for `Mouse`, `Dog` and `Duck`. *super()* **calls the constructor** of the class we've extended--so in our case, _super_ is going to call the `Animal` constructor __with any arguments we want to pass through to it__. So in our case, `Mouse`, `Dog` and `Duck` don't want to set the `name` property themselves, they want to use the class they're extending, `Animal`, to do that for us. So we pass through the name with _super(name)_.



Finally, we've generalised the protest method with `this.constructor.name` to refer to the name of the class, `Dog`, `Duck`, `Mouse`, or `Animal`, depending on which type we're actually using. That way we keep the functionality we had before, and this will work fine no matter how many times we extend `Animal` with specific animals--we should always be logging out the right type.


## Closure - (5 mins)

Object oriented programming is a really powerful programming pattern that you'll see a lot in the real world--because its such a useful way of modelling the real world (we humans do it constantly!). Classes are like blueprints for us to create our own types of data, to solve different kinds of problems. They have a definition, and are instantiated, so that we can have _many different instances_ of the same class. They can also have methods, which allow our classes to become these interactive, dynamic abstractions that are super flexible.


## Further reading
- [MDN Documentation on ES6 Classes] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)