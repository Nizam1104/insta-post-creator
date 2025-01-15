export const textServices = {
  getSelectedText() {
    const selection = window.getSelection();
    return selection.toString();
  },

  getSelectionRange() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  },

  applyStyleToSelection(style) {
    const range = this.getSelectionRange();
    if (!range) return;

    const span = document.createElement('span');
    Object.assign(span.style, style);
    
    range.surroundContents(span);
  }
};
