var total = 0;
var avg = 0;
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (var i=0; i<arr.length; ++i) {
    total += arr[i];
    avg = (avg*i + arr[i])/(i+1);
}
console.log(total/arr.length, avg);