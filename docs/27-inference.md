# Unit 27: Type Inference

!!! abstract "Learning Objectives"

    Students should

    - be familiar how Java infers missing type arguments.

## Motivation

We have seen in the past units the importance of types in preventing run-time errors.  Utilizing types properly can help programmers catch type mismatch errors that could have caused a program to fail during run-time, possibly after it is released and shipped.

By including type information everywhere in the code, we make the code explicit in communicating the intention of the programmers to the readers.  Although it makes the code more verbose and cluttered -- it is a small price to pay for ensuring the type correctness of the code and reducing the likelihood of bugs as the code complexity increases.

Java, however, allows the programmer to skip some of the type annotations and try to infer the type argument of a generic method and a generic type, through the _type inference_ process.  The _basic_ idea of type inference is simple:

> Java will looking among the matching types that would lead to successful type checks, and pick the most specific ones.

There are _deviations_ to the "most specific" ones but that is because Java will only infer based on the type that is available in the type constraints.  Remember, when Java is performing compilation, it somewhat guarantees that the compiled code (_i.e., the JVM bytecode_) can be used regardless of what classes are going to be added in the future.

Inferring the type allows you to write less code.  This is especially useful if the type that is used is horribly long.  Here is an example of a possibly horribly long generic type.

```java
Map<String, Map<String, Map<String, String>>> map;
```

That is only variable declaration.  We will have to copy the type to instantiate the `Map`.

## Diamond Operator

One example of type inference is the diamond operator `<>` when we insantiate a generic type using the `new` operator:

```Java
Pair<String, Integer> p = new Pair<>();
```

Java can infer that `p` should be an instance of `Pair<String, Integer>` since the compile-time type of `p` is `Pair<String, Integer>`.  The line above is equivalent to:

```Java
Pair<String,Integer> p = new Pair<String,Integer>();
```

So now, we can immediately see how this is useful for our `Map`.  We can simply type

```java
map = new Map<>();
```

and voila, we do not have to copy the entire type.  It should be noted that there is a slight drawback to this.  We have to be careful in typing the type during the declaration of the variable `map`.  If there is a mistake there, Java type inference cannot help you.  On the other hand, if you spelled out the type in two places, it is like having to "confirm your password".

## Argument Typing

We have been invoking 

```Java title="Seq v0.7"
class A {
  public static <S> boolean contains(Seq<? extends S> seq, S obj) {
    for (int i = 0; i < seq.getLength(); i++) {
      S curr = seq.get(i);
      if (curr.equals(obj)) {
        return true;
      }
    }
    return false;
  }
}
```

by explicitly passing in the type argument `Shape` (_also called **type witness** in the context of type inference_).

```Java
     A.<Shape>contains(circleSeq, shape);
```

We could remove the type argument `<Shape>` so that we can call `contains` just like a non-generic method:

```Java
     A.contains(circleSeq, shape);
```

and Java could still infer that `S` should be `Shape`.  The type inference process looks for all possible types that match (_that are known from type constraints_).  In this example, the type of the two parameters must match.  Let's consider each individually first:

- An object of type `Shape` is passed as an argument to the parameter `obj` (_i.e., the second parameter_).  So `S` might be `Shape` or, if widening type conversion has occurred, one of the other supertypes of `Shape`. Therefore, we can say that `Shape <: S <: Object`.
    - For obvious reason, we put the type upper-bound at `Object` because `Object` has no supertype.
- A `Seq<Circle>` has been passed into `Seq<? extends S>`.  Because Java _generic is_ **invariant** and wild card works by **substitution**, the only possible type for `?` is `Circle`.
    - We start with `? extends S` and we replace `?` with `Circle`, so this gives us `Circle extends S`.
    - In other words, we have `Circle <: S <: Object`.

Solving for these two constraints on `S`, we get the following:

```
Shape <: S <: Object 
```
 
We therefore know that `S` could be `Shape` or one of its supertypes: `GetAreable` and `Object`.   We choose the lower bound, so `S` is inferred to be `Shape`.

Type inferencing can have unexpected consequences.  Let's consider an [older version of `contains` that we wrote](23-generics.md):

```Java title="contains v0.4"
class A {
  public static <T> boolean contains(T[] array, T obj) {
    for (T curr : array) {
      if (curr.equals(obj)) {
        return true;
      }
    }
    return false;
  }
}
```

Recall that we want to prevent nonsensical calls where we are searching for an integer in an array of strings.

```Java
String[] strArray = new String[] { "hello", "world" };
A.<String>contains(strArray, 123); // type mismatch error
```

But, if we write:

```Java
A.contains(strArray, 123); // ok!  (huh?)
```

The code compiles!  Let's go through the type inferencing steps to understand what happened.  Again, we have two parameters:

- `strArray` has the type `String[]` and is passed to `T[]`.  So `T` must be `String` or its superclass `Object` (_i.e._ `String <: T <: Object`).  The latter is possible since Java array is covariant.
- `123` is passed as type `T`.  Since `123` is a primitive `int` and `T` is a reference type, we auto-box `int` into the wrapper class `Integer`.  So the value is treated as `Integer` and, therefore, `T` must be either `Integer`,  or its superclasses `Number`, and `Object` (i.e. `Integer <: T <: Object`). 

Solving for these two constraints:

```
Object <: T <: Object
```

Therefore `T` can only have the type `Object`, so Java infers `T` to be `Object`.  But why is the type lower-bound also `Object` and not one of `String` or `Integer`?  This is because `String` and `Integer` has no other common supertype[^1] besides `Object`.

[^1]: The reality is more complicated.  Both `String` and `Integer` are subtype of `Comparable<T>` for their respective `T`.  So the deduced type is closer to `Object & Comparable`.  Such complications do not occur if we create our own classes.  In most cases, we will consider only the "obvious" supertype and ignore `Comparable` (or any type after `&`).

The code above is equivalent to:

```Java
A.<Object>contains(strSeq, 123);
```

And our `contains` v0.4 is actually quite fragile and does not work as intended.  We were bitten by the fact that the Java array is covariant, yet again.

## Target Typing

The example above performs type inferencing on the parameters of the generic methods.  Type inferencing can involve the type of the expression as well.  This is known as _target typing_.  Take the following upgraded version of `findLargest`:

```Java title="findLargest v0.6"
public static <T extends GetAreable> T findLargest(Seq<? extends T> seq) {
  double maxArea = 0;
  T maxObj = null;
  for (int i = 0; i < seq.getLength(); i++) {
    T curr = seq.get(i);
    double area = curr.getArea();
    if (area > maxArea) {
      maxArea = area;
      maxObj = curr;
    }
  }
  return maxObj;
}
```

and we call

```java
Shape o = A.findLargest(new Seq<Circle>(0));
```

We have a few more constraints to check:

- Due to target typing, the return type of `T` must be a subtype of `Shape` (_i.e._ `T <: Shape`)
- Due to the bound of the type parameter (_i.e.,_ `<T extends GetAreable>`), `T` must be a subtype of `GetAreable` (_i.e._ `T <: GetAreable`)
- Due to argument typing, `Seq<Circle>` must be a subtype of `Seq<? extends T>`, so `?` is `Circle` because Java generic is **invariant**.  This means, `T` must be the supertype of `Circle` (_i.e.,_ `Circle <: T <: Object`).

Solving for all three of these constraints:

```
Circle <: T <: Shape
```

The lower bound is `Circle`, so the call above is equivalent to:

```java
Shape o = A.<Circle>findLargest(new Seq<Circle>(0));
```

## Further Type Inference Examples

We now return to our `Circle` and `ColoredCircle` classes and the `GetAreable` interface. Recall that `Circle` implements `GetAreable` and `ColoredCircle` inherits from `Circle`.

### Example 1

Consider the following method signature of a generic method `foo`:

```java
public <T extends Circle> T foo(Seq<? extends T> seq)
```

Then we consider the following code excerpt:

```java
ColoredCircle c = foo(new Seq<GetAreable>());
```

What does the java compiler infer `T` to be? Lets look at all of the constraints on `T`.

- __Argument Typing:__ `Seq<GetAreable>` is passed into `Seq<? extends T>`.
    - `?` must be `GetAreable`, so we have `GetAreable extends T`.
    - _Type Constraint:_ `GetAreable <: T <: Object`.
- __Target Typing:__ `T` is assigned to `ColoredCircle`.
    - `T` must be a subtype of `ColoredCircle`.
    - _Type Constraint:_ `T <: ColoredCircle`.
- __Type Parameter:__ `<T extends Circle>`
    - _Type Constraint:_ `T <: Circle`.

!!! note "Type Constraints"
    - `GetAreable <: T <: Object`
    - `T <: ColoredCircle`
    - `T <: Circle`

We can see that there no solution to our contraints, `T` can not be both a subtype of `ColoredCircle` and a supertype of `GetAreable` and therefore the Java compiler can not find a type `T`. The Java compiler will throw an error stating the inference variable `T` has incompatible bounds.

### Example 2

Lets consider another example using the following method signature of a generic method `bar`:

```java
public <T extends Circle> T bar(Seq<? super T> seq)
```

Then we consider the following code excerpt:

```java
GetAreable c = bar(new Seq<Circle>());
```

What does the java compiler infer `T` to be? Again, lets look at all of the constraints on `T`.

- __Argument Typing:__ `Array<Circle>` is passed into `Array<? super T>`.
    - `?` must be `Circle`, so we have `Circle super T`.
    - _Type Constraint:_ `T <: Circle`.
- __Target Typing:__ `T` is assigned to `GetAreable`.
    - `T` must be a subtype of `GetAreable `.
    - _Type Constraint:_ `T <: GetAreable `.
- __Type Parameter:__ `<T extends Circle>`
    - _Type Constraint:_ `T <: Circle`.

!!! note "Type Constraints"
    - `T <: GetAreable `
    - `T <: Circle`

Solving for these two constraints, we can simplify it to:

```
T <: Circle
```

Whilst `ColoredCircle` is also a subtype of `Circle` it is not included in the type constraint and therefore the compiler does not consider this class during type inference.  Indeed, the compiler cannot be aware[^2] of all subtypes of `Circle` and there could be more than one subtype. Therefore `T` can only have the type `Circle`, so Java infers `T` to be `Circle`. 

[^2]: Due to evolving specifications of software, at the time of compilation, a subtype may not have even been conceived of or written yet!

!!! warning "Multiple `?`"
    Recap that we should treat each wildcard `?` separately.  In other words, each `?` should be treated as potentially different type.  An easy way to remember this is to put a number for each `?`.

    So the first `?` you see should be renamed into `?1`.  This is similar to how Java treated this internally by renaming it into `CAP#1`.  In the end, the different `?` may be the same type, but at the start you should treat them separately.

    Also, please remember that the focus of the type inference is to ___infer the type parameter___ and not to infer each `?`.  So please focus on the type parameter and not the wildcards.

    Of course, from our discussion, we simply replace the wildcards with a type because there has to be an explicit usage of it for us to infer.  But if there is no usage at all (_e.g., the method with type parameter is not even invoked_), then `?` can be anything.  This may lead to a potential issue where the code may initially compile but after the usage is added, it no longer compiles.

## Rules for Type Inference

We now summarize the steps for type inference.  First, we figure out all of the type constraints and then we solve these constraints. If no type can satisfy all the constraints, we know that Java will fail to compile.

So where do these type constraints come from?

1. __Argument Typing:__ Type of argument is passed to parameter.
2. __Target Typing:__ Return type is passed to variable.
3. __Type Parameter:__ The declared type, especially for bounded type parameter.

Once you have collected all the type constraints, you can start resolving the type constraints.  If in resolving the type constraints for a given type parameter `T` we are left with:

- `Type1 <: T <: Type2`, then `T` is inferred as `Type1`.
- `Type1 <: T`[^3], then `T` is inferred as `Type1`.
    - _Alternatively,_ consider the constraint as `Type1 <: T <: Object`.
- `T <: Type2`, then `T` is inferred as `Type2`.
    - _Alternatively,_ consider the constraint as `Type2 <: T <: Type2`.

[^3]: Note that `T <: Object` is implicit here. We can see that this case could also be written as `Type1 <: T <: Object`, and would therefore also be explained by the previous case (`Type1 <: T <: Type2`).

where `Type1` and `Type2` are arbitrary types.

!!! danger "No Usage Typing"
    The type constraints come strictly from the three parts above.  How the type is used is irrelevant for inference.  This may lead to a failure in type inference although there is actually a type that can be used.  Consider the same example from above

    ```java
    public <T extends Circle> T bar(Array<? super T> array)
    ```

    Now consider the following code snippet where `getColor` is a method available in `ColoredCircle` but not `Circle`.

    ```java
    bar(new Array<Circle>()).getColor();
    ```

    Remember that the type inference procedure above inferred the `T` is `Circle`.  But `Circle` has no method `getColor`.  So this will end in a compilation error.  However, also note that if the inference was `T` is `ColoredCircle`, the compilation should have been successful.  This shows that the type inference does not take into account how the type is going to be used.