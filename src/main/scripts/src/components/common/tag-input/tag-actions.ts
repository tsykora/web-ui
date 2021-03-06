const PRESS_ACTIONS = {
  8: deleteAction,
  37: switchPrevious,
  39: switchNext,
  13: addAction
};

export function getActionToKey(key): () => any {
  return PRESS_ACTIONS.hasOwnProperty(key) ? PRESS_ACTIONS[key] : makeEditable;
}

function deleteAction($event, itemIndex) {
  if (this.inputElement.nativeElement.value === '' && this.editedItemIndex === -1) {
    if (itemIndex === -1) {
      highlightItem.call(this, this.tagElements.last);
    } else if (document.activeElement === this.tagElements.toArray()[itemIndex].nativeElement) {
      let nextElement = itemIndex === 0 ?
        this.tagElements.toArray()[itemIndex + 1] :
        this.tagElements.toArray()[itemIndex - 1];
      this.deleteItem(itemIndex);
      highlightItem.call(this, nextElement);
    }
  }
}

function switchPrevious($event, itemIndex) {
  if (itemIndex > 0) {
    highlightItem.call(this, this.tagElements.toArray()[itemIndex - 1]);
  } else {
    highlightItem.call(this, this.tagElements.last);
  }
}

function switchNext($event, itemIndex) {
  if (itemIndex !== -1 && itemIndex !== this.tagElements.length - 1) {
    highlightItem.call(this, this.tagElements.toArray()[itemIndex + 1]);
  } else {
    highlightItem.call(this, this.tagElements.first);
  }
}

function highlightItem(tagItem) {
  if (tagItem) {
    this.renderer.invokeElementMethod(tagItem.nativeElement, 'focus');
  }
}

function addAction($event, itemIndex = -1) {
  if (itemIndex === -1) {
    this.addItem(this.tagValue, itemIndex);
    this.tagValue = '';
  } else {
    let currentTag = this.tags[itemIndex];
    this.addItem(currentTag, itemIndex);
    this.editedItemIndex = -1;
    highlightItem.call(this, this.tagElements.toArray()[itemIndex]);
  }
  $event.preventDefault();
}

function makeEditable(itemIndex) {
  if (this.editedItemIndex !== itemIndex && this.editedItemIndex !== -1) {
    this.editedItemIndex = itemIndex;
    let selectedItem = this.tagElements.toArray()[itemIndex].nativeElement;
    setCaret(selectedItem);
  }
}

function setCaret(selectedItem) {
  let range = document.createRange();
  range.setStart(selectedItem, 0);
  range.setEnd(selectedItem, 0);
  let sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
