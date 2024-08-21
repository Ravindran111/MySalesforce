import { LightningElement, track } from 'lwc';

export default class SignatureComponent extends LightningElement {
    @track name = '';
    @track showModal = false;

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handlePrePopulate() {
        if (this.name) {
            this.showModal = true;
            this.renderSignature();
        }
    }

    closeModal() {
        this.showModal = false;
    }

    renderSignature() {
        const canvas = this.template.querySelector('.signature-canvas');
        const context = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 400; // Adjust width as needed
        canvas.height = 100; // Adjust height as needed

        // Set font and text properties
        context.font = '36px "Gochi Hand", cursive'; // Use your preferred handwriting font
        context.fillStyle = '#000'; // Font color
        context.textAlign = 'center'; // Align text to the center
        context.textBaseline = 'middle'; // Align text vertically in the middle

        // Clear the canvas clear
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the text
        context.fillText(this.name, canvas.width / 2, canvas.height / 2);
    }
}
