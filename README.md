#Storynator

A simple storyboard editor, with drag and drop and direct text editing.

[![Demo](http://nliautaud.fr/chrome-frame.png)][demo]

[demo]: https://cdn.rawgit.com/nliautaud/storynator/43d107de37e9a6b14bf026b384fd493c216c858e/story.html

### Getting started

Open the [demo][demo] and start editing.

When you're ready to save your changes, juste save the page (like just ``Ctrl+S`` or ``Cmd+S``).

Open your local storyboard, edit-it and save it again. Overwrite the old one if you want.

Do it again.

```
story.html
story_files/
```
The storyboard itself is self-contained in the html file and may be distributed, copied, sent by mail or synchronised trough Dropbox, BitSync, or shared on its own in any other way. 

The sibling directory contain only the system files that allow to edit the storyboard content. Thus, a shared storyboard may be editable depending on whether you choose to include this directory or not. Note that its name rely on the browser and OS implementations, so different browsers and OS may have different behaviors and may use a slightly different name. 

### Display options

- *Manage* : show / hide management buttons and indicators.
- *Texts* : show / hide parts and cases texts.
- *Numbers* : show / hide parts and cases numbers.
- *Overview* : display cases two times smaller.

The parts may be folded or opened by clicking on the arrow next to their title.

### Editing

The texts are directly editables. Depending on your browser you may use the usual keyboard shortcuts to undo changes and apply formatting, like **bold**, *italic* or _underline_.

Drop image files to replace old ones.

Drag & drop to reorder. You can reorder parts by using the handle next to their title (folding them first may help for that).

Click on a case to show more options :
- Define the case as a the same shot than the previous one.
- Disable/enable the case width limitation.
- Delete the case.
