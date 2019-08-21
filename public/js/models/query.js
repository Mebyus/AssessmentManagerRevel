export function encodeQueryData(data) {
    const encodedArray = [];
    for (let d in data) {
        encodedArray.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));        
    }
    return encodedArray.join('&');
}