const originData = [4, 9, 0, 3, 2, 5, 1, 7, 6, 8];

// 冒泡排序
const bubbleSort = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let num = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = num;
      }
    }
  }
  return arr;
};

console.log(bubbleSort(originData));

// 快速排序
const quickSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  let quickIndex = Math.floor(arr.lenth / 2);
  let md = arr.splice(quickIndex, 1)[0];
  let left = [];
  let right = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > md) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return quickSort(right).concat([md], quickSort(left));
};

console.log(quickSort(originData));
