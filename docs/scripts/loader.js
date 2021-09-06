function require(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status == 200) {
            callback(xhr.response);
        } else {
            console.log(xhr.statusText);
        }
    }
    xhr.send();
}