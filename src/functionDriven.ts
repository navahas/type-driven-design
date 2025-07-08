const CLEAR = "\x1B[2J\x1B[1;1H";

function progress<T>(iter: Iterable<T>, f: (item: T) => void): void {
    let i = 1;
    for (const n of iter) {
        console.log(`${CLEAR}${"*".repeat(i)}`);
        i++;
        f(n);
    }
}

function expensiveCalculation(_n: number): void {
    // Simulate work with a blocking operation
    const start = Date.now();
    while (Date.now() - start < 1000) {
        // Busy wait for 1 second
    }
}

function main(): void {
    const v = [1, 2, 3];
    progress(v, expensiveCalculation);

    const b = "a b".split('').map(c => c.charCodeAt(0));
    progress(b, expensiveCalculation);
}


main();

export { 
    progress, 
    expensiveCalculation,
    main
};
