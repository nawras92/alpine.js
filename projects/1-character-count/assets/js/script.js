function initAlpine() {
  return {
    text: '',
    wordCount: 0,
    characterCount: 0,
    showError: false,
    showSuccess: false,
    errorMessage: '',
    successMessage: '',

    // reset data
    resetData() {
      this.showError = false;
      this.errorMessage = '';
      this.showSuccess = false;
      this.successMessage = '';
    },

    // Submit Function
    submitText() {
      this.resetData();
      if (this.characterCount == 0) {
        this.showError = true;
        this.errorMessage = 'Please provide some text';
        return;
      }
      if (this.characterCount > 50) {
        this.showError = true;
        this.errorMessage = 'Character Count exceeds 50 chars';
        return;
      }

      this.showSuccess = true;
      this.successMessage = 'The text has been submitted succesfully!';
    },

    // Count Function
    count() {
      this.characterCount = this.text.length;
      this.wordCount = this.text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    },
  };
}
