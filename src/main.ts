const CLEAR = "\x1B[2J\x1B[1;1H";

interface Unbounded {
    readonly _type: 'unbounded';
}

interface Bounded {
    readonly _type: 'bounded';
    readonly bound: number;
    readonly delims: readonly [string, string];
}

class Progress<T, B extends Unbounded | Bounded> implements Iterator<T> {
    private index = 0;
    private done = false;

    constructor(
        protected readonly iterator: Iterator<T>,
        protected readonly bound: B
    ) {}

    next(): IteratorResult<T> {
        if (this.done) {
            return { done: true, value: undefined };
        }

        // Clear screen and display progress
        console.log(CLEAR);
        this.displayProgress();

        const result = this.iterator.next();

        if (result.done) {
            this.done = true;
            return { done: true, value: undefined };
        }

        this.index++;
        return { done: false, value: result.value };
    }

    private displayProgress(): void {
        if (this.bound._type === 'unbounded') {
            console.log("*".repeat(this.index));
        } else {
            const bounded = this.bound as Bounded;
            const progress = "*".repeat(this.index);
            const remaining = " ".repeat(Math.max(0, bounded.bound - this.index));
            console.log(`${bounded.delims[0]}${progress}${remaining}${bounded.delims[1]}`);
        }
    }

    [Symbol.iterator](): Iterator<T> {
        return this;
    }
}

class UnboundedProgress<T> extends Progress<T, Unbounded> {
    constructor(iterator: Iterator<T>) {
        super(iterator, { _type: 'unbounded' });
    }

    withBound(length: number): BoundedProgress<T> {
        return new BoundedProgress(this.iterator, length, ['[', ']']);
    }
}

class BoundedProgress<T> extends Progress<T, Bounded> {
    constructor(
        iterator: Iterator<T>,
        bound: number,
        delims: readonly [string, string] = ['[', ']']
    ) {
        super(iterator, { _type: 'bounded', bound, delims });
    }

    withDelims(delims: readonly [string, string]): BoundedProgress<T> {
        return new BoundedProgress(this.iterator, this.bound.bound, delims);
    }
}

interface ProgressIteratorExt<T> extends Iterator<T> {
    progress(): UnboundedProgress<T>;
}

function createProgressIterator<T>(iterator: Iterator<T>): ProgressIteratorExt<T> {
    const progressIterator = Object.assign(iterator, {
        progress(): UnboundedProgress<T> {
            return new UnboundedProgress(iterator);
        }
    });
    return progressIterator;
}

function arrayProgress<T>(array: readonly T[]): ProgressIteratorExt<T> {
    return createProgressIterator(array[Symbol.iterator]());
}

function* infiniteSequence(): Generator<number> {
    let i = 0;
    while (true) {
        yield i++;
    }
}

function expensiveCalculation(_n: number): void {
    // Simulate work with a blocking operation
    const start = Date.now();
    while (Date.now() - start < 1000) {};
}

function main(): void {
    const brkts: readonly [string, string] = ['<', '>'];

    const v: readonly number[] = [1, 2, 3];

    for (const n of arrayProgress(v).progress().withBound(v.length).withDelims(brkts)) {
        expensiveCalculation(n);
    }

    //for (const n of createProgressIterator(infiniteSequence()).progress()) {
    //    expensiveCalculation(n);
    //}
}

main();

export {
    Progress,
    UnboundedProgress,
    BoundedProgress,
    createProgressIterator,
    arrayProgress,
    infiniteSequence,
    expensiveCalculation,
    main
};

//if (require.main === module) {
//  main();
//}
