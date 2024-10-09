# Lab 05: Mini Problems

!!! abstract "Learning Objectives"

    Students should
    
    - be able to organize program into packages
    - be able to create and use nested classes


!!! info "Initializing"

    To get the files, run the following command from your PE node.
    We recommend creating a new directory called `mini` to store all your lab mini problems.

    ```bash
    lab5@pe111:~/mini$ cp -r ~cs2030s/mini/lab5/ .
    ```

    The files will only be available on Wednesday, 9 October 2024.


!!! warning "Lab 04 Extension"
    Parts of this problem is an extension to mini problems of Lab 04.  The solution to the mini problems of Lab 4 can be found in the accompanying directory.

    In Ex 5, you will need to copy your solution instead of having the accompanying solution.


## Mini Problem 1

We have created an immutable point in Lab 04, the partial code is shown below.
While it may not fully solve Lab 04, it is sufficient for our purpose.

```java title="Point.java"
public final class Point {
  private final int x;
  private final int y;
  private static Point ORIGIN = new Point(0, 0);

  private Point(int x, int y) {
    this.x = x;
    this.y = y;
  }

  public static Point of(int x, int y) {
    if (x == 0 && y == 0) {
      return Point.ORIGIN;
    }
    return new Point(x, y);
  }

  public Point moveTo(int x, int y) {
    return new Point(x, y);
  }

  @Override
  public String toString() {
    return "(" + this.x + "," + this.y + ")";
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj instanceof Point) {
      Point pt = (Point) obj;
      return this.x == pt.x && this.y == pt.y;
    }
    return false;
  }
}
```

### Task 1: Packaging

We will now create a package called `shapes`.
To do this, follow the steps below.
Please revise the bash commands to do this.

1. Create a directory called `shapes`.
2. Copy `Point.java` into `shapes`.
3. Add the line `package shapes;` at the top of `Point.java`.
    - All classes in the package `shapes` must begin with `package shapes;`.
4. Add the line `import shapes.Point;` at the top of `Task1.java`.
    - Note that you should **NOT** use `import shapes.*;`.  Instead, you should import the needed classes individually to avoid namespace polution.

At the end, you should see something like the following directory structure.
The base directory is called `mini1`.
All directory ends with `/` as part of their names.

```
mini1/
├── shapes/
│   └── Point.java
├── Task1.java
└── Task2.java
```

Now we can check if this works.
We will test with `Task1.java` only.

1. Compile `Task1.java` with `javac Task1.java`.
    - Notice that `Point.java` inside the directory `shapes` will also be compiled.
2. Run `Task1.java` with `java Task1`.
    - You should get all **ok**.


### Task 2: Adding Shapes

Given points, we can now create shapes.
We have created `Circle` before, so let us recreate it inside the `shapes` package.
Remember that all classes in the package `shapes` must begin with `package shapes;`.

Before we specify the requirement for `Circle`, we first remove the keyword `public` from the constructor of class `Point`.
This will prevent us from creating a point directly from outside of the package.
That is because beside the `public` and `private` modifier, we have the following modifiers.
Without any modifier, the class `Point` can only be used by code in the same class or in the same package.

| Modifier | Class | Package | Subclass | Others |
|---|---|---|---|---|
| `public`      | Y | Y | Y | Y |
| `protected`   | Y | Y | Y | N |
| _no modifier_ | Y | Y | N | N |
| `private`     | Y | N | N | N |


**Circle.java** &nbsp;&nbsp;&nbsp;&nbsp; Now we can create `Circle` inside the package `shapes`.
Design your class in the following way.

- It is a `public` class with two `private` fields.  The first field is a `Point` indicating the center point of the circle.  The second field is the radius of the circle as `int`.
- It has a `public` constructor that accepts two parameters.  The first parameter is the center point and the second parameter is the radius of the circle.
- The `public` method `toString` prints the circle as `Circle @ <center> with radius <radius>`.  `<center>` is the string representation of its center point and `<radius>` is the string representation of its radius.
- The `protected` method `getRadius` returns the radius of the circle.
- Add the method `public void moveTo(int x, int y)` in the class `Circle` to move the center point of the circle.  However, instead of invoking `Point::moveTo`, try creating `new Point(x, y)` directly in the `Circle` class.

You can check your implementation with `Task2.java`.


**MyCircle.java** &nbsp;&nbsp;&nbsp;&nbsp; Now we can create `ColoredCircle` **outside** the package `shapes`.
Design your class in the following way.

- It is a `public` class extending `Circle` with no fields.
- It has a `public` constructor that accepts one parameters: the radius of the circle.  The center point is always at (0, 0).
- It has a single `public` method `isSmallerThan(int radius)` to compare the radius with the input parameter `radius`.  The method returns true if the radius is strictly smaller than `radius`.

You can check your implementation with `Task3.java`.



## Mini Problem 2

We have created a generic pair in Lab 04, the partial code is shown below.
While it may not fully solve Lab 04, it is sufficient for our purpose.
Although we are not extending pair, you may use it as an inspiration.

```java title="Pair.java"
public class Pair<S, T> {
  private S first;
  private T second;

  public Pair(S first, T second) {
    this.first = first;
    this.second = second;
  }

  public S getFirst() {
    return this.first;
  }

  public T getSecond() {
    return this.second;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true; // optional, for efficiency
    }
    if (obj instanceof Pair<?, ?>) {
      Pair<?, ?> pair = (Pair<?, ?>) obj;
      
      if (this.first == null && this.second == null) {
        return pair.first == null && pair.second == null;
      }
      if (this.first == null) {
        return pair.first == null && this.second.equals(pair.second);
      }
      if (this.second == null) {
        return this.first.equals(pair.first); && pair.second == null;
      }

      return this.first.equals(pair.first)
          && this.second.equals(pair.second);
    }
    return false;
  }

  @Override
  public String toString() {
    return "(" + this.first + "," + this.second + ")";
  }
}
```

### Task 1: Abstract Boolean Condition

We will now create a new class that is an abstraction of an boolean condition.
We call this class `Bool<T>`.
Your current task is to implement the abstract class `Bool<T>` with the following specification.

- It is a generic _abstract_ class with one type parameter `T`.
- It has a single `private` field of type `T`.
- It has a `private` constructor that accepts a value of type `T`.
- It has a single concrete method `T getVal()` that returns the field of type `T`.
- It has two `public` `abstract` methods.
    - `Bool<T> doThen(T val)`.
    - `Bool<T> doElse(T val)`.

This class will have a factory method based on the second task below.

### Task 2: Nested Class

We will now create two static nested classes.

**True** &nbsp;&nbsp;&nbsp;&nbsp; The class `True<T>` extends `Bool<T>`.
It overrides the two abstract methods as follows.

- `Bool<T> doThen(T val)`: returns a new instance of `True<T>` such that the `protected` field of type `T` inherited from `Bool<T>` is set to the given value `val`.
- `Bool<T> doElse(T val)`: returns itself without change.

**False** &nbsp;&nbsp;&nbsp;&nbsp; The class `False<T>` extends `Bool<T>`.
It overrides the two abstract methods as follows.

- `Bool<T> doThen(T val)`: returns itself without change.
- `Bool<T> doElse(T val)`: returns a new instance of `False<T>` such that the `protected` field of type `T` inherited from `Bool<T>` is set to the given value `val`.


**Factory Method** &nbsp;&nbsp;&nbsp;&nbsp; Implement the factory method `test(boolean cond)` that takes in a boolean condition and returns `Bool<T>` such that

- if `cond` is `true`, it returns a new `True<T>` with initial value of `null`.
- if `cond` is `false`, it returns a new `False<T>` with initial value of `null`.

See the sample usage below.

```
jshell> Bool.<Integer>test(true).doThen(1).doElse(2).getVal()
$.. ==> 1
jshell> Bool.<Integer>test(false).doThen(1).doElse(2).getVal()
$.. ==> 2

jshell> Bool.<Integer>test(true).getVal()
$.. ==> null
jshell> Bool.<Integer>test(false).getVal()
$.. ==> null

jshell> Bool.<Integer>test(true).doThen(1).doThen(2).getVal()
$.. ==> 2
jshell> Bool.<Integer>test(false).doElse(2).doElse(1).getVal()
$.. ==> 1

jshell> Bool.<Integer>test(true).doElse(1).doElse(2).getVal()
$.. ==> null
jshell> Bool.<Integer>test(false).doThen(2).doThen(1).getVal()
$.. ==> null
```

> Look Ma, no if-then-else statement!

You can check your implementation with `Task1.java`.