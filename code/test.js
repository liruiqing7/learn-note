// function twoNumAdd(nums, target) {
//   let map = new Map();
//   for (let i = 0; i < nums.length; i++) {
//     let num = nums[i];
//     if(){

//     }
//   }
//   return [];
// }

const nums = [8, 4, 3, 5, 3, 2],
  target = 8;

// console.log(twoNumAdd(nums, target));

function twoNumAdd2(arr, target) {
  if (Array.isArray(arr)) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (arr[i] + arr[j] == target && i != j) {
          return [arr[i], arr[j]];
        }
      }
    }
  } else {
    return [];
  }
}

console.log(twoNumAdd2(nums, target));
