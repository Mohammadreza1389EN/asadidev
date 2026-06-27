function downloadFile(filename) {
    const link = document.createElement('a');

    link.href = '../../files/' + filename; 
    link.download = filename; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.querySelector('.download');
    
    if (downloadBtn) {
        const filename = "tfUI.zip"; 
        
        downloadBtn.addEventListener('click', () => {
            downloadFile(filename);
        });
    }
});