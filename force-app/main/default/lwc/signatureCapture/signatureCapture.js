import { LightningElement } from 'lwc';

export default class SignatureCapture extends LightningElement {
    signatureData = ''; // Holds the signature data in base64 format
    isSignatureVisible = false; // Controls the visibility of the signature slide
    showModal = false; // Controls the visibility of the modal

    renderedCallback() {
        if (!this.canvas) {
            this.canvas = this.template.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.ctx.strokeStyle = "#000000";
            this.ctx.lineWidth = 2;
            this.isDrawing = false;

            this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
            this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
            this.canvas.addEventListener('mousemove', this.draw.bind(this));
        }
    }

    startDrawing(event) {
        this.isDrawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(event.offsetX, event.offsetY);
    }

    stopDrawing() {
        this.isDrawing = false;
        this.signatureData = this.canvas.toDataURL(); // Save the signature as base64 data
        this.isSignatureVisible = true; // Show the signature slide
    }

    draw(event) {
        if (!this.isDrawing) return;
        this.ctx.lineTo(event.offsetX, event.offsetY);
        this.ctx.stroke();
    }

    handleClear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
        this.signatureData = ''; // Reset the signature data
        this.isSignatureVisible = false; // Hide the signature slide
    }

    handleComplete() {
        this.showModal = true; // Show the modal popup
    }

    handleModalClose() {
        this.showModal = false; // Close the modal popup
    }

    handleYesClick() {
        this.downloadPDF(); // Convert and download the PDF
        this.showModal = false; // Close the modal popup
    }

    handleNoClick() {
        this.showModal = false; // Close the modal popup
    }

    downloadPDF() {
        // Logic to convert the signature to a PDF and download it
        const doc = new jsPDF();
        doc.text('Signature Document', 10, 10);
        doc.addImage(this.signatureData, 'PNG', 15, 40, 180, 80); // Adjust the size and position as needed
        doc.save('SignatureDocument.pdf');
    }

    get hasSignature() {
        return this.signatureData !== ''; // Check if there's a signature present
    }

    get signatureClass() {
        return this.isSignatureVisible ? 'slide-in' : 'hidden';
    }
}
