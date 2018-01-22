function setProgress(progressBar, amount) {
  progressBar.textContent = `${amount}%`
  progressBar.style = `width: ${amount}%;`
}

window.addEventListener('load', function() {
  const uploadButton = document.getElementById('uploadButton')
  const uploadInput = document.getElementById('uploadInput')
  const progressBar = document.getElementById('progressBar')

  uploadButton.onclick = function() {
    uploadInput.click()
    setProgress(progressBar, 0);
  }

  uploadInput.onchange = function() {
    let files = this.files
    // Return back from this function if no files were selected
    if (!files.length > 0) {return;}

    // Create a FormData object which will be sent as the data payload in the AJAX request
    let formData = new FormData();
    // loop through all the selected files and add them to the formData object
    Array.from(files).forEach(file => formData.append('files', file, file.name))
    // Read more about FormData here: https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects

    // Send data (files) to the server
    let xhr = new XMLHttpRequest();
    xhr.open('post', '/upload')
    xhr.send(formData)
    // read more about AJAX here: https://www.w3schools.com/js/js_ajax_intro.asp

    // Listen on 'progress'
    xhr.addEventListener('progress', function (evt) {

      if (evt.lengthComputable) {
        // calculate the percentage of completed upload
        let percentComplete = Math.round(100 * evt.loaded / evt.total);

        setProgress(progressBar, percentComplete);

        if (percentComplete === 100) {
          progressBar.textContent = "Done"
        }
      }
    }, false);

    // You can also listen on:
    // 'onloadstart': The fetch starts
    // 'onprogress': 	Data transfer is going on
    // 'onabort':  	  The fetch operation was aborted
    // 'onerror':  	  The fetch failed
    // 'onload': 	    The fetch succeeded
    // 'ontimeout':  	The fetch operation didn't complete by the timeout the author specified
    // 'onloadend':  	The fetch operation completed(either success or failure)
    // Source: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload

    // Listen 'onerror' to handle upload failure (e.g., display a message to the user or try again or ...etc)
    // You can use xhr.abort() to cancel the upload task

  }

})

// https://www.script-tutorials.com/pure-html5-file-upload/