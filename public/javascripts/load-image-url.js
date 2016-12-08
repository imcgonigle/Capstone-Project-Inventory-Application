(() => {
    document.getElementById("image_url").onchange = () => {
        const files = document.getElementById('image_url').files;
        const file = files[0];
        const user_id = document.getElementById('user_id').value;
        const photo_for = document.getElementById('photo_for').value;
        if (file == null) {
            return alert('No file selected.');
        }
        getSignedRequest(file, user_id, photo_for);
    };
})();

function getSignedRequest(file, user_id, photo_for) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${photo_for}s/${user_id}/${Date.now()}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log(response)
                uploadFile(file, response.signedRequest, response.url);
            } else {
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();
}

function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.getElementById('preview').src = url;
                document.getElementById('complete_url').value = url;
            } else {
                alert('Could not upload file.');
            }
        }
    };
    xhr.send(file);
}