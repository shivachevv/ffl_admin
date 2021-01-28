export default function (data) {
    function refractArr(arr, start, end) {
        return arr.slice(1)
            .map((x, i) => {
                return {
                    [i]: x.slice(2,5)
                }
            })
            .slice(start, end)
            .reduce(function (result, item) {
                let key = Object.keys(item)[0];
                result[key - start + 1] = item[key];
                return result;
            }, {})
    }
    return refractArr(data, 44, 64)
}