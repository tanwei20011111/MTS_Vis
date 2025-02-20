function asc_sort(arr){
	return arr.sort((a,b) => a-b);
}

function dsc_sort(arr){
	return arr.sort((a,b) => b-a);
}

function intersection(arr1, arr2){
	return arr1.filter(x => arr2.includes(x));
}

function joint_intersection(arr_of_arr){
	let result = arr_of_arr[0];
	arr_of_arr.forEach(arr => {
		result = this.intersection(arr, result);
	});
	return result;
}


function minMax2DArr(arr){
	let flat = [];
	for (let i=0; i<arr.length; i++){
		flat = flat.concat(arr[i]);
	}
	let min = Math.min(...flat);
	let max = Math.max(...flat);
	return {'min': min, 'max': max};
}



export{
	minMax2DArr,
}