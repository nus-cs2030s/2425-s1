# Lab 01: Mini Problems

!!! abstract "Learning Objectives"

    Students should
    
    - be able to translate an imperative/procedural code into an object-oriented code.
    - be able to write simple Java program and use JShell for testing and prototyping.


!!! info "Initializing"

    To get the files, run the following command from your PE node.
    We recommend creating a new directory called `mini` to store all your lab mini problems.

    ```bash
    lab1@pe111:~/mini$ cp -r ~cs2030s/mini/lab1/ .
    ```

## Mini Problem 1

Alice wants to invest in several companies.
She decides to create a list of her portfolio and track her progress.
There are three kinds of companies she can invest in.
The information needed for the companies differ depending on the kind of companies.

- MNC: Only the name and the valuation.
- Startup: Besides the name and the valuation, we also need to know the number of years for the valuation to double.  We call the number of years as X.
- SME: Besides the name and the valuation, we also need to know the amount to increase each year.

Depending on the kind of company, the valuation may increase or decrease as follows.

- MNC: The valuation will always be the same.
- Startup: The valuation will double after every X number of years where X is the number stored as above.
- SME: The valuation will always increase by a fixed amount each year.

Alice wants to keep track of the valuation of the companies in her portfolio for a given number of years.
At the end, she wants to print the latest valuations.

- MNC: The format will be `[name]: $valuation`.
- Startup: `<name>: $valuation`
- SME: The format will be `(name): $valuation`.


```title="Sample Input"
3 5
1 Goggle 1000
3 Bong 50 5
2 QuackQuackGo 20 3
```

```title="Sample Output"
[Goggle]: $1000
(Bong): $75
<QuackQuackGo>: $40
```


### Potential Changes

As designs are intricately related to potential changes, you should think about the following potential changes.

- We may want to add different kinds of companies.
- We may want to change the behavior of each kind of companies independently of one another.


### Running and Testing

First, you need to enter the directory `mini1` using the following command.

```bash
alice@pe111:~/mini/lab1$ cd mini1
alice@pe111:~/mini/lab1/mini1$
```

Then you need to compile it:

```bash
alice@pe111:~/mini/lab1/mini1$ javac Mini1.java
```

You can run the following command to test a input file individually.

```bash
alice@pe111:~/mini/lab1/mini1$ java Mini1 < inputs/Mini1.1.in
```

Alternatively, you can also run the test script.

```bash
alice@pe111:~/mini/lab1/mini1$ ./test.sh Mini1
```



## Mini Problem 2

Bob -- a startup founder -- wants to design a simple payroll system for his company.
The main goal is simple: _he wants to know how much money he needs to prepare to pay her employees each month_.
On top of that, he mentioned a few other requirements as listed below.

- Each employee should have a unique consecutive ID, starting from 0.
- There are three types of employees: managers, full-time, and interns.
    - Managers and full-time employees are paid monthly while interns are paid hourly.
    - Full-time employees and interns can be paid overtime.  This is simply the overtime hours * overtime rate.

Since not all information are useful, the constructor need not receive all information.
But you are guaranteed that there will be no other kinds of employees besides those listed above.

Initially Alice was tasked to handle this project.
However, since her timeline is very tight, he rushed this project and the resulting code does not adhere to basic OOP principles.
Alice asked for your help to refactor her code and make it more readable and extendable.
Help Alice improve the quality of the code of this payroll system!


### Potential Changes

As designs are intricately related to potential changes, you should think about the following potential changes.

- We may want to add different kinds of employees.
- We may want to change the behavior of each kind of employees independently of one another.


### Running and Testing

First, you need to enter the directory `mini2` using the following command.

```bash
alice@pe111:~/mini/lab1$ cd mini2
alice@pe111:~/mini/lab1/mini2$
```

You will find `Employee.java` and `Payroll.java` but there is no `main` method in any of these files.
We will be using JShell to run and test our program.
To load the files using JShell, we can either (i) pass the Java file as an argument to JShell or (ii) open the files interactively inside JShell using `/open`.

```bash title="Option (i)"
alice@pe111:~/mini/lab1/mini2$ jshell Employee.java Payroll.java
|  Welcome to JShell -- Version 21.0.4
|  For an introduction type: /help intro
jshell>
```

```bash title="Option (ii)"
alice@pe111:~/mini/lab1/mini2$ jshell 
|  Welcome to JShell -- Version 21.0.4
|  For an introduction type: /help intro
jshell> /open Employee.java
jshell> /open Payroll.java
```

If you made any changes to your code, you can also reload them using the `/open` command (_i.e., option (ii)_).
This will update the class definition to the latest definition in your JShell session.

To test your program, you may create objects and invoke their methods.
The following is a sample run in a script called `Sample.jsh`.

```title="Sample.jsh"
/open Employee.java
/open Payroll.java

Employee manager = new Employee(1, 10000);
Employee fulltime = new Employee(2, 5000, 5, 100);
Employee intern = new Employee(3, 40, 50, 160, 25);
Payroll pr = new Payroll();

pr.register(manager);
pr.register(fulltime);
pr.register(intern);

// pr
// pr.getTotalSalary()
```

You can load this script using the following command:

```
alice@pe111:~/mini/lab1/mini2$ jshell Employee.java Payroll.java Sample.jsh
|  Welcome to JShell -- Version 17.0.8.1
|  For an introduction type: /help intro

jshell> pr
pr ==> Manager0 FullTime1 Intern2

jshell> pr.getTotalSalary()
$14 ==> 21925
```