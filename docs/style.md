# CS2030/S Java Style Guide

## Why Coding Style is Important

One of the goals of CS2030/S is to move you away from the mindset that you are writing code that you will discard after it is done (_e.g., in CS1101S missions_) and you are writing code that no one else will read except you and your tutor.  CS2030/S prepares you to work in a software engineering teams in many ways. One of the ways is to enforce a consistent coding style.

If everyone on the team follows the same style, the intend of the programmer can become clear (_e.g., is this a class or a field?_), the code is more readable and less bug prone (_e.g., see the [Apple `goto fail` bug](https://www.wired.com/2014/02/gotofail/) for an example of buggy program due to style_).  Empirical studies support this:

!!! quote
    "It is not merely a matter of aesthetics that programs should be written in a particular style. Rather there is a psychological basis for writing programs in a conventional manner: programmers have strong expectations that other programmers will follow these discourse rules. If the rules are violated, then the utility afforded by the expectations that programmers have built up over time is effectively nullified. The results from the experiments with novice and advanced student programmers and with professional programmers described in this paper provide clear support for these claims."

    Elliot Soloway and Kate Ehrlich. "Empirical studies of programming knowledge." IEEE Transactions on Software Engineering 5 (1984): 595-609.

Many major companies enforce coding styles, and some have published them.  For CS2030, we base our (_simplified_) coding style on [Google's Java Coding Style](https://google.github.io/styleguide/javaguide.html).  You should bookmark the link because you need to come back to it again and again.

## CS2030/S Coding Style

!!! note "For CS2030S"

    When marked with [☻], these options are already included in the `~/.vimrc` file if you follow the [Vim setup guide](vim/setup.md). In fact, we recommend you follow the [Vim setup guide](vim/setup.md) instead and don't manually manage your own version of your `~/.vimrc` file.

    Most other source code editors have similar configuration.  

### Spacing and Indentation

1. No tabs.  Use only whitespace.  [☻]

    !!! info "VIM Setting"
        For `vim` users, you can add the following line in your `~/.vimrc` file:
        
        ```
        set expandtab
        ```
        
        So that when you press ++tab++ it is expanded to whitespace. 

2. Block indentation is exactly two spaces. [☻]

    ```Java
    if (x == 0) { 
      x++;
      for (i = 0; i < x; i++) {
        x += i;
      }
    }
    ```

    !!! info "VIM Setting"
        For `vim` users, in `~/.vimrc`, add the following:
        
        ```
        set tabstop=2
        set shiftwidth=2
        set autoindent
        set smartindent
        " For Java: enabling this includes Java-specific indentation settings that handles annotations like @Override
        filetype plugin indent on
        ```

        To help you with indentation.

3. Each line is limited to 80 characters in length.  You can break a long
    line into multiple lines to enhance readability, this is called _line wrapping_.  When you do so, each continuation line is indented at least 4 spaces from the original line.

    !!! success "Good Example"

        ```Java
        void foo(double a, double b, double c, double d
            double e, double f) {
          if ((a > b) && (b > c) && (c > d) && (d > e) &&
            (e > f)) {
          }
        }
        ```
        
        Note the 4 spaces indentation at line 2 and line 4.

    !!! failure "Bad Example"
    
        ```Java
        void foo(double a, double b, double c, double d double e, double f, double g, double h, double i) {
          if ((a > b) && (b > c) && (c > d) && (d > e) && (e > f)) {
          }
        }
        ```

        In the example above, we have over 80 characters in line 1.
    
        ```Java
        void foo(double a, double b, double c, double d
          double e, double f) {
            if ((a > b) && (b > c) && (c > d) && (d > e) &&
              (e > f)) {
            }
        }
        ```
    
        ```Java
        void foo(double a, double b, double c, double d
        double e, double f) {
          if ((a > b) && (b > c) && (c > d) && (d > e) &&
          (e > f)) {
          }
        }
        ```

        In the example above, we omitted the 4 spaces indentation for the continuation line.

    !!! note "80 vs 100"
        While we prefer lines to be limited to 80, we are OK if the length is up to 100.  Any longer, however, will be frowned upon.

4. Indent comments at the same level as the surrounding code.  For multiple comments, align `*` with the previous line.

    !!! success "Good Example"

        ```Java
        /*
         * Good style
         */
        ```

        ```Java
        /**
         * Good style for JavaDoc
         */
        ```

    !!! failure "Bad Example"

        ```Java
        /*
        * Not a good style
        */
        ```

        ```Java
        /**
        * Not a good style for JavaDoc
        */
        ```

        ```Java
        /**
          * Also not a good style for JavaDoc
          */
        ```

5. White space should separate Java keywords from parenthesis and braces, and be added on both sides of binary operators (_`+`, `-`, `/`, etc_) as well as `:` in enhanced for-loop.  Space should also appears before and after `//` comments

    !!! success "Good Example"

        ```Java
        if (x == 0) { 
          x++; // to make sure x is at least one.
          for (i = 0; i < x; i++) {
            x += i;
          }
        }
        ```

    !!! failure "Bad Example"

        ```Java
        if(x==0){ 
          x++;//to make sure x is at least one.
          for(i=0;i<x;i++){
            x+=i;
          }
        }
        ```


### Classes

1. Each file contains exactly one top-level (_i.e., non-nested_) class.

2. Each top-level class resides in a source file of its own.

3. When a class has overladed methods (_e.g., multiple constructors or methods of the same name_), they appear sequentially with no other code in between.


### Braces

1. Braces are always used (_even if the body is empty or contains a single statement_).

2. Use "[Egyptian brackets](https://en.wikipedia.org/wiki/Indentation_style#K&R_style)": 

    - Opening brace have no line break before; but has line break after
    - Closing brace has a line break before; and has a line break after (_except when there is `else` or comma following a closing brace_).

    !!! success "Good Example"
        ```Java
        if (x == 0) {
          x++;
        } 
        ```

    !!! failure "Bad Example"
        ```Java
        if (x == 0) { x++; }
        ```
        ```Java
        if (x == 0) // Allman style (do not use)
        {
          x++;
        }
        ```
        ```Java
        if (x == 0) // Pico style (do not use)
        {
          x++; }
        ```


### Lines

1. Exactly one blank line after `import` statements.

2. Each statement is followed by a line break, no matter how short the statement is.

    !!! success "Good Example"
    
        ```Java
        x++; 
        i++;
        ```

    !!! failure "Bad Example"

        ```Java
        x++; i++;
        ```

3. There should be a blank line between constructors, methods, nested classes and static initializers.  Blank lines can be used between fields to create logical groupings.


### Declarations, Identifiers, and Keywords

1. One variable per declaration.  

    !!! success "Good Example"

        ```Java
        int x;
        int y;
        ```

    !!! failure "Bad Example"

        ```Java
        int x, y;
        ```

2. No C-style array declaration

    !!! success "Good Example"

        ```Java
        String[] args;
        ```

    !!! failure "Bad Example"

        ```Java
        String args[];
        ```

3. Class modifier appears in the following order:

    ```Java
    public protected private abstract default static final transient volatile synchronized native strictfp
    ```

    !!! success "Good Example"
    
        ```Java
        public static void main(String[] args)
        ```

    !!! failure "Bad Example"
    
        ```Java
        static public void main(String[] args)
        ```

4. Class names are writte in `UpperCamelCase`, method names and field names in `lowerCamelCase`, constant names in `ALL_CAPS_SNAKE_CASE`.  Type parameters in single capital letter.

5. Static fields and methods must be accessed with class name.


### Statements and Annotations

1. Switch statement always include a `default` case.

2. One annotation per line.

3. Always use `@Override`.

    ```Java
    @Override
    public boolean equals(Object o) {
        :
    }
    ```

4. Caught exceptions should not be ignored.

5. Avoid `import` using wildcards `*`.  Always import the specific class you need.

    !!! success "Good Example"
        ```java
        import java.util.ArrayList;
        import java.util.List;
        ```

    !!! failure "Bad Example"
        ```java
        import java.util.*;
        ```

5. `import` statement should be in alphabetical order.

    !!! success "Good Example"
        ```java
        import java.util.ArrayList;
        import java.util.List;
        ```

    !!! failure "Bad Example"
        ```java
        import java.util.List;
        import java.util.ArrayList;
        ```

## Using `checkstyle`

To automatically check for style violation, we use a tool call [`checkstyle`](http://checkstyle.org).

To run, 

```
java -jar ~cs2030s/bin/checkstyle.jar -c ~cs2030s/bin/cs2030_checks.xml *.java 
```

The exercises and assessments may have different stylecheck configurations.  See the corresponding instructions in the exercises/assessment papers.

Hint: put the command into a `bash` script so that you do not need to type such a long string all the time.
