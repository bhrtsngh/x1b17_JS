
//1 1 2 3 5 8 23 21 34 55 ..
//Input 10 --> Output 55
let fiboArray = [], c=0;
function fibonacciWithRecursion(index){
    if(index<3) return 1;
    return fibonacciWithRecursion(index-1)+fibonacciWithRecursion(index-2);
}

//1 1 2 3 5 8 23 21 34 55 89 144 ....
//p c n                    (Starting state) #p=prev,c=curr,n=next
//  p c n                  (First Iteration)
function fibonacciWithoutRecursion(length){
    let prev = 1,curr = 1,fiboList = [prev,curr];
    for(let i=0;i<length;i++){
        const next = prev + curr;
        prev = curr;
        curr = next;
        fiboList.push(curr);
    }
    return fiboList;
}

//console.log(fibonacciWithoutRecursion(10));
console.log(fibonacciWithRecursion(10));
