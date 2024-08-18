function updateFileList() {
    const input = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const files = input.files;
    if (files.length === 0) {
        fileList.textContent = 'No files chosen';
    } else {
        fileList.textContent = '';
        for (let i = 0; i < files.length; i++) {
            fileList.textContent += files[i].name + (i < files.length - 1 ? ', ' : '');
        }
    }
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const input = document.getElementById('fileInput');
    const files = input.files;

    if (files.length === 0) {
        alert('No files chosen');
        return;
    }

    let promises = [];
    for (let i = 0; i < files.length; i++) {
        promises.push(new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function() {
                    doc.addImage(img, 'JPEG', 10, 10, img.width / 4, img.height / 4);
                    if (i < files.length - 1) {
                        doc.addPage();
                    }
                    resolve();
                };
            };
            reader.onerror = function(event) {
                reject('Error reading file: ' + event.target.error.code);
            };
            reader.readAsDataURL(files[i]);
        }));
    }

    Promise.all(promises).then(() => {
        doc.save('converted.pdf');
    }).catch(error => {
        alert(error);
    });
}

