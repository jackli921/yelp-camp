    
        // Example starter JavaScript for disabling form submissions if there are invalid fields
    (function () {
    'use strict'

    bsCustomFileInput.init();
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
        })
    })()
    
    const fileInput = document.getElementById("image");
    if(fileInput){
      fileInput.addEventListener("change", (event) => {
        const selectedFiles = event.target.files;
        const maxFilesAllowed = 3; // Specify your desired maximum limit
  
        if (selectedFiles.length > maxFilesAllowed) {
          event.target.value = ""; // Clear the file input field
          alert(`You can only upload a maximum of ${maxFilesAllowed} files.`);
        }
      });

    }