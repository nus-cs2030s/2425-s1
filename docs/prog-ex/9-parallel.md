# Ex 9: Parallel Universe

!!! abstract "Basic Information"
    - __Deadline:__ 21 November 2024, Thursday, 23:59 SGT
    - __Difficulty:__ ★★★★★★

!!! info "Prerequisite"
    - Caught up to [Unit 40](../40-forkjoin.md) of Lecture Notes.
    - Familiar with [CS2030S Java style guide](../style.md).

---

## Tasks

!!! warning "Speedup"
    While we do not worry about efficiency, we want to have a reasonable speedup.
    Testing on PE node, we manage to get at least 250% speedup.
    Try to get at least 250% speedup on PE node.
    Otherwise, penalty  may be given.

### Task 1: Matrix Multiplication

Matrix multiplication is a fundamental operation with many applications in physics, engineering, mathematics, and computer science.
Given a matrix $A_{n \times m}$ of $n$ rows and $m$ columns together with a matrix $B_{m \times p}$ of $m$ rows and $p$ columns, the matrix product $C_{n \times p}$ is also written as $A \times B$ is a matrix such that each element $c_{i,j}$ is given by the following formula:

<center>$c_{i,j} = \displaystyle{\sum^{m}_{k=1} (a_{i,k} \cdot b_{k,j})}$</center>

Here we use the $\cdot$ in $(a_{i,k} \cdot b_{k,j})$ to mean numerical multiplication and not matrix multiplication.

Our interest is only _square_ matrix.
We also want to parallelize the multiplication.
There is a famour divide-and-conquer algorithm for matrix multiplication.
The way we can do this is by _partitioning_ the matrix into 4 quadrants.

For instance, we can partition a matrix $A$ into 4 quadrants called $A_{1,1}$, $A_{1,2}$, $A_{2,1}$, and $A_{2,2}$.
Each of these are quadrants can be thought of as a smaller matrix.
We can do the same for matrix $B$.

$$A = \begin{vmatrix}
A_{1,1} & A_{1,2} \\
A_{2,1} & A_{2,2}
\end{vmatrix} \ \ \ \ \ \ B = \begin{vmatrix}
B_{1,1} & B_{1,2} \\
B_{2,1} & B_{2,2}
\end{vmatrix}$$

We can now construct a matrix $C = A \times B$ that are also broken up into 4 quadrants as follows. 

$$C = \begin{vmatrix}
C_{1,1} & C_{1,2} \\
C_{2,1} & C_{2,2}
\end{vmatrix} = \begin{vmatrix}
A_{1,1} & A_{1,2} \\
A_{2,1} & A_{2,2}
\end{vmatrix} \times \begin{vmatrix}
B_{1,1} & B_{1,2} \\
B_{2,1} & B_{2,2}
\end{vmatrix} = \begin{vmatrix}
(A_{1,1} \times B_{1,1}) + (A_{1,2} \times B_{2,1}) & (A_{1,1} \times B_{1,2}) + (A_{1,2} \times B_{2,2}) \\
(A_{2,1} \times B_{1,1}) + (A_{2,2} \times B_{2,1}) & (A_{2,1} \times B_{1,2}) + (A_{2,2} \times B_{2,2})
\end{vmatrix}$$

And here is the recursion, $(A_{1,1} \times B_{1,1})$ is matrix multiplications.
Similarly, the $+$ in $(A_{1,1} \times B_{1,1}) + (A_{1,2} \times B_{2,1})$ is matrix addition.
We have given you the code for recursive and non-recursive matrix multiplication.
You may choose to study them to understand what they are doing, but you may choose to simply convert them by following the technique from the problem set.
Additionally, we have provided a simple `Matrix` class.
Just for this exercise, you do not have to worry about OOP design.

What you need to do here is to implement the divide-and-conquer algorithm using `RecursiveTask<Matrix>`.
For simplicity, we will be using only square matrix with size of $2^{n}$ for $n$ up to 11.
You do not have to worry how we will run with such large numbers, just make sure you do not create unnecessary data.

The method you need to modify is the `MatrixMultiplication::compute()` method.
Currently, it is only doing recursive matrix multiplication.
As a starting point, you should copy the implementation of recursive matrix multiplication into `MatrixMultiplication::compute()`.
Change all recursive call into a call to `MatrixMultiplication::compute()` appropriately before converting them to `fork()` and `join()`.

At some point, non-recursive multiplication will be faster.
But you need to determine the threshold size for which non-recursive multiplication is better than even parallel multiplication.
This is encoded in the static field `FORK_THRESHOLD`.
As `FORK_THRESHOLD` depends on the operating system and processor architecture used, we will test the run on PE node.
So ensure that you get a good parallelism on PE node.

```title="test.sh"
javac -Xlint:rawtypes -Xlint:unchecked *.java
bash test.sh Ex9a
$ java -jar ~cs2030s/bin/checkstyle.jar -c ex9_style.xml Parallel.java
```



### Task 2: Parallel Encode

Consider a sequence of element

```
[A A A B B A A A A C A A A A]
```

Here, `A`, `B`, and `C` can be any type.
We can encode the sequence into something more compact by recording the number of consecutive _equal_ element together with the element.
We say that two elements `x` and `y` are equal if `x.equals(y)` returns `true`.

Givne this, the sequence above can be split into several consecutive segment.
The consecutive segment can then be encoded into encoded segment which is a pair.

| Consecutive Segment | Encoded Segment |
|---|---|
| `A A A` | `(A, 3)` |
| `B B` | `(B, 2)` |
| `A A A A` | `(A, 4)` |
| `C` | `(C, 1)` |
| `A A A A` | `(A, 4)` |

Each element is now a pair.
So the run-length encoding is

```
[(A, 3), (B, 2), (A, 4), (C, 1), (A, 4)]
```

What you need to do here is to use parallel stream to solve this problem using `reduce`.
For simplicity, you need not write fully in **functional-style**.
In particular, you may use blocks `() -> { .. }` as your lambda expression.
However, you must satisfy the following restrictions.

!!! warning "Restrictions"
    - You must only have a single statement in `Streaming::reduce`.  This statement should be a `return stream.reduce(...)` statement.
    - You are not allowed to add additional `import`.
    - The `stream` must remain parallel at the end (i.e., you cannot invoke `sequential`).


```title="test.sh"
javac -Xlint:rawtypes -Xlint:unchecked *.java
bash test.sh Ex9b
$ java -jar ~cs2030s/bin/checkstyle.jar -c ex9_style.xml Streaming.java
```


## Following CS2030S Style Guide

You should make sure your code follows the [given Java style guide](../style.md).

## Further Deductions

Additional deductions may be given for other issues or errors in your code.  {++These deductions may now be unbounded, up to 5 marks++}.  This include _but not limited to_

- run-time error.
- failure to follow instructions.
- improper designs (_e.g.,_ not following good OOP practice).
- not comenting `@SuppressWarnings`.
- misuse of `@SuppressWarnings` (_e.g.,_ not necessary, not in smallest scope, _etc_).
