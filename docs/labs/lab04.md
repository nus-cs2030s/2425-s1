# Lab 04: Mini Problems

!!! abstract "Learning Objectives"

    Students should
    
    - be able to create immutable class.
    - be able to create factory method.
    - be able to work with generics.


!!! info "Initializing"

    To get the files, run the following command from your PE node.
    We recommend creating a new directory called `mini` to store all your lab mini problems.

    ```bash
    lab4@pe111:~/mini$ cp -r ~cs2030s/mini/lab4/ .
    ```

    The files will only be available on Wednesday, 18 September 2024.


!!! warning "New Lab Problem"
    This problem is a new problem and no longer an extension of Lab 03.

## Mini Problem 1

In this problem, we are going to create an _immutable_ class.  An _immutable object_ refers to an object whose state cannot be modified after it is created ([Wikipedia](https://en.wikipedia.org/wiki/Immutable_object)).  You will learn more about immutability during lecture, but to motivate you for the time being, immutability makes it easy to reason about our code.  Less changes == less bugs!

```java title="Point.java"
public class Point {
  private int x;
  private int y;

  public Point(int x, int y) {
    this.x = x;
    this.y = y;
  }

  public void moveTo(int x, int y) {
    this.x = x;
    this.y = y;
  }

  @Override
  public String toString() {
    return "(" + this.x + "," + this.y + ")";
  }
}
```

### Task 1: Immutable Point

Recap the `Point` class that we have above.
It is possible to _mutate_ the variables by invoking the `moveTo` method.

```title="Mutable Point"
jshell> Point p = new Point(1, 1);
p ==> (1,1)
jshell> p.moveTo(2,2);
jshell> p
p ==> (2,2)
```

Make the class `Point` immutable by making the following changes:

- Modify `void moveTo(int, int)` to return a new `Point` instead of mutating the current point.
- If you are moving the point to the same coordinate as the current coordinate, return the current instance.

Your code should pass the following check.

```title="Immutable Point"
jshell> Point p = new Point(1, 1);
p ==> (1,1)
jshell> Point p2 = new Point(1, 1);
p2 ==> (1,1)
jshell> p == p2
$.. ==> false
jshell> p.moveTo(2, 2)
$.. ==> (2,2)
jshell> Point p3 = p2.moveTo(1, 1)
p3 ==> (1,1)
jshell> p3 == p2
$.. ==> true
jshell> p3 == p
$.. ==> false
```

### Task 2: Factory Method

Now that we have an _immutable_ point, we may find it weird that `p` and `p2` above are not identical (_i.e.,_ `p == p2` returns `false`) even when they are the same coordinates.
On the other hand, `p2` and `p3` are identical (_i.e.,_ `p2 == p3` returns `true`).
We want to do something similar but only for a special point called origin at (0, 0).

We will do this by implementing a _factory method_.
A factory method is a _static_ method that can be invoked to create an instance instead of exposing the constructor directly.
This has several advantages that we will explore here.

Make the following changes to the `Point` class to implement factory method with several advantages.

- Make `Point` class behave in the following way:

    ```title="Factory v1"
    jshell> new Point(1, 1)
    |  Error:
    |  Point(int,int) has private access in Point
    |  new Point(1, 1)
    |  ^-------------^
    jshell> Point p = Point.of(1, 1)
    p ==> (1,1)
    jshell> p.moveTo(2, 2)
    $.. ==> (2,2)
    ```

- Modify `Point` class such that it returns the same instance if we are creating the origin point (_i.e.,_ point at (0, 0)).  This is only possible because of the use of factory method.  Ensure that you pass the following test.

    ```
    jshell> Point p1 = Point.of(0, 0)
    p1 ==> (0,0)
    jshell> Point p2 = Point.of(0, 0)
    p2 ==> (0,0)
    jshell> p1 == p2
    $.. ==> true
    jshell> p1 = Point.of(1, 1)
    p1 ==> (1,1)
    jshell> p2 = Point.of(1, 1)
    p2 ==> (1,1)
    jshell> p1 == p2
    $.. ==> false
    ```

- Finally, we want our point to have only non-negative coordinates.  If any of the inputs are negative, return `null`.  Again, this is only possible with factory methods.

    ```
    jshell> Point p = Point.of(-1, 0)
    p ==> null
    jshell> Point p = Point.of(0, -2)
    p ==> null
    jshell> Point p = Point.of(3, -2)
    p ==> null
    jshell> Point p = Point.of(1, 3)
    p ==> (1,3)
    ```


## Mini Problem 2

In this problem, we are going to implement _generic_ class.  In particular, we will expand on the implementation of generic pair.

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
  public String toString() {
    return "(" + this.first + "," + this.second + ")";
  }
}
```
    
### Task 1: Comparing Pair

We say that two pairs `p1` and `p2` are equal if both of the followings are true:

- `p1.first` is equal to `p2.first` according to their `equal` method.
- `p1.second` is equal to `p2.second` according to their `equal` method.

However, you will notice that in some cases, you may get run-time errors.  Try to figure out why and make sure that you pass the following test case by overriding the `boolean equals(Object)` method.

```
jshell> Pair<String, Integer> p1 = new Pair<>("CS2030S", 100)
p1 ==> (CS2030S,100)
jshell> Pair<String, Number> p2 = new Pair<>("CS2030S", 100)
p2 ==> (CS2030S,100)
jshell> p1.equals(p2)
$.. ==> true
jshell> p1.equals(new Pair<>("CS2030S", 100))
$.. ==> true
jshell> p1.equals(new Pair<>("CS2030S", null))
$.. ==> false
jshell> p1.equals(new Pair<>(null, null))
$.. ==> false
jshell> p2 = new Pair<>(null, null)
p2 ==> (null,null)
jshell> p2.equals(new Pair<>(null, null))
$.. ==> false
```
Also, you need to ensure that your code has no warnings when compiled with the following command

```bash
lab4@pe111:~/mini$ javac Pair.java -Xlint:unchecked -Xlint:rawtypes
```

### Task 2: Swapping Elements

Since a pair has two fields `first` and `second`, we may be able to _swap_ with another pair.
The swap is done in the following way when `p1.swap(p2)` is invoked:

- We assign `p2.first` into `p1.first`.
- We assign `p1.second` into `p2.second`.

We need to make sure that the method is the _most flexible_ with the _minimum number of type parameter_ it can be.
For that, we assume that we have the following three classes with the following subtyping relationship: `C` <: `B` <: `A`.

```java
class A {}
class B extends A {}
class C extends B {}
```

We need to at least pass the following test.

```
jshell> Pair<B, B> p1 = new Pair<>(new B(), new B())
p1 ==> (B@6767c1fc,B@29ee9faa)
jshell> Pair<C, A> p2 = new Pair<>(new C(), new A())
p2 ==> (C@cc285f4,A@55f3ddb1)
jshell> p1.swap(p2)      // no error
jshell> p2.swap(p1)      // error
|  Error:
jshell> p2.swap(p2)      // no error
jshell> p1.swap(p1)      // no error
jshell> p1.<B,B>swap(p2) // no error
jshell> p1.<B>swap(p2)   // no error
```