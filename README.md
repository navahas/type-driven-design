# Type-Driven vs. Function-Driven Design in Rust
- [*reference*](#reference)
This repository explores two distinct approaches to designing software in Rust:
Type-Driven Design and Function-Driven Design. It uses a simple example of a
progress indicator for iterators to highlight the differences and benefits of
each paradigm.

## Overview
The core idea is to add a simple visual progress bar (using `*` characters) to
a loop that performs an "expensive calculation." 

- `src/type_driven.rs`: This file showcases a type-driven approach. It defines
a new struct Progress<Iter> that wraps an iterator and implements the Iterator
trait itself. This allows for a fluent API where you can call .progress()
directly on any iterator, making the progress functionality an intrinsic part
of the type system.

```rust
// Example usage from src/type_driven.rs
// .progress() is now a method on iterators
fn main() {
    let v: Vec<i32> = vec![1, 2, 3];
    for n in v.iter().progress() {
        expensive_calculation(n);
    }
}
```

- `src/function_driven.rs`: This file demonstrates a function-driven approach.
It provides a standalone generic function progress that takes an iterator and a
closure (the "expensive calculation") as arguments. The progress logic is
encapsulated within this function, which then iterates and calls the provided
closure.

```rust
// Example usage from src/function_driven.rs
// progress is a standalone function
fn main() {
    let v = vec![1, 2, 3];
    progress(v.into_iter(), expensive_calculation);
}
```


### Reference
The concepts explored in this repository are part of the video ["Type-Driven API
Design in Rust" by Will Richton](https://www.youtube.com/watch?v=bnnacleqg6k)
from Strange Loop Conference. For a deeper dive into this topic, consider
his [online resource](https://willcrichton.net/rust-api-type-patterns/).
