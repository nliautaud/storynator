A simple local html5 storyboard editor, with drag and drop and direct text editing.

[Demo][demo]

[demo]: https://cdn.rawgit.com/nliautaud/storynator/82b4ccce43b37ee3e66cd422af3799d3e81d78c2/story.html

### Installation

Open the [demo][demo] and save the page.

### Managing cases and parts

Add and delete parts and cases by using the buttons shown with the option *Manage*.

Drag & drop to reorder things. Use the handle for to drag the parts (folding them first may help for that).

Whithout the management mode, you can still edit texts and manage cases.

Click on a case to show more options.
- Delete the case.
- Disable/enable the case width limitation.
- Define the case as a the same shot than the previous one, or as a cut.

### Text editing

The texts are directly editables.

Depending on your browser, you may apply **bold**, *italic* and _underline_ with the usual keyboard shortcuts, and use undo/redo shortcut.

### Images

You can apply an image by dropping a file onto it. The image files _**must**_ be on the ``story_files/`` directory and dropped from there.

### Display options

- *Texts* : show / hide parts and cases texts.
- *Numbers* : show / hide parts and cases numbering.
- *Big images* : switch between two sizes of cases.

The parts may be folded or opened with the button at the top or by clicking on the arrow next to their title.

### Saving & sharing

Save the page. Like just ''Ctrl+S'' or ''Cmd+S''. Overwrite the old one if you want.

The project files (system files and storyboard images) are contained on a sibling directory (``story_files/`` by default). This directory name rely on the browser and OS implementations, so different browsers and OS may have different behaviors.

A project is self-contained. You can move it, copy it, send it trough mail, synchronize it trough Dropbox, BitSync or any other way. Just remember to include the project files in the sibling directory.

