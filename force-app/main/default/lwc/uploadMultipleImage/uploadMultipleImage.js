import { LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class UploadMultipleImage extends LightningElement {
    openModal = true;
    showFilePreview = false;
    isImagePreview = false;
    fileSrc;
    acceptedFormats = [".jpg", ".png", ".jpeg", ".pjpeg", ".webp", ".pdf"];
    @track fileDataList = [];

    openfileUpload(event) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(",")[1];
                const fileData = {
                    id: this.fileDataList.length + 1,
                    filename: file.name,
                    base64: base64,
                    recordId: this.recordId
                };
                this.fileDataList = [...this.fileDataList, fileData];
            };
            reader.readAsDataURL(file);
        }
    }

    handleRemove(event) {
        this.showFilePreview = false;
        const fileId = event.target.dataset.id;
        this.fileDataList = this.fileDataList.filter((file) => file.id !== parseInt(fileId));
    }

    handlePreviewFile(event) {
        const fileId = event.target.dataset.id;
        const file = this.fileDataList.find((file) => file.id === parseInt(fileId));
        if (file) {
            const fileName = file.filename;
            const extensionType = fileName.split(".").pop().toLowerCase();
            const base64 = file.base64;

            if (['jpg', 'jpeg', 'png', 'pjpeg', 'webp'].includes(extensionType)) {
                this.fileSrc = `data:image/${extensionType};base64,${base64}`;
                this.isImagePreview = true;
            } else if (extensionType === 'pdf') {
                this.fileSrc = `data:application/pdf;base64,${base64}`;
                this.isImagePreview = false;
            }
            this.showFilePreview = true;
        }
    }

    onClearPreview() {
        this.showFilePreview = false;
    }

    onSubmitRecentPhoto() {
        // Handle the files which are stored in this.fileDataList for further processing.
        this.showToast('Success', 'Files submitted successfully!', 'success');
    }

    handleModalClose() {
        this.openModal = false;
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(evt);
    }
}
