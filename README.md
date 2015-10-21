#Storynator

A simple storyboard editor, with drag and drop and direct text editing.

[![Demo](chrome-frame.png)][demo]

[demo]: https://cdn.rawgit.com/nliautaud/storynator/10eff57ba96b0d17892b719988596c8227e9deed/story.html

### Features

- Drop images files.
- Direct text editing. Don't need to open Photoshop to edit a description or copy some text.
- Reorder things by drag & drop. Just move that shot before this one.
- Automatic numbering. Don't correct every shot numbers when you add an image.
- Responsive & dynamic layout. That's not your daddy PDF.
- Sharing & collaborating made easy. Send the file. Or synchronise things.
- Change the layout & design if you want. That's just HTML and CSS. 

### Getting started

Open the [demo][demo] and start editing.

When you're ready to save your changes, juste save the page (like just ``Ctrl+S`` or ``Cmd+S``). 

Downloaded, you can do it again : open-it, edit-it and save-it (overwrite the old one if you want). You can share it too.

```
story.html
story_files/
```
The storyboard is self-contained in the single html file. So it may be just distributed, copied, sent by mail or synchronised trough Dropbox, BitSync, or shared on its own in any other way. 

The sibling directory contain only the system files that allow to edit the storyboard content. Thus, a shared storyboard may be editable depending on whether you choose to include this directory or not. Note that its name rely on the browser and OS implementations, so different browsers and OS may have different behaviors and may use a slightly different name. 

### Display options

- *Texts* : show / hide parts and cases texts.
- *Numbers* : show / hide parts and cases numbers.
- *Overview* : display cases two times smaller.
- *Edit/View* : toggle editing or viewing mode.

The parts may be folded or opened by clicking on the arrow next to their title.

### Editing

The texts are directly editables. Depending on your browser you may use the usual keyboard shortcuts to undo/redo text changes (ex. ``ctrl+z`` or ``⌘+z``) and apply formatting like bold, italic or underline (ex. ``ctrl+b`` or ``⌘+b``).

Click on the cases to show more options :
- Define the case as part of the same shot than the previous case (see [shots](#shots))
- Disable/enable the case width limitation (see [images](#images))
- Delete the case

### Loading images

Just drop image files to load them into the cases.

They must be in ``jpg``,``png`` or ``gif`` format. They are reduced to a proper size and directly included into the storyboard file.

The cases width are limited by default to be nicely layout in regular columns. When a dropped image is at least to times larger than tall, that limit is disabled. That behavior may be then manually controlled trough the case options. 

### Reorder cases and parts

Drag & drop things.

Parts have a handle next to their title. It may be useful to fold them before moving them around.

### Shots

By default, each case define a distinct shot.

By using the associated option of the case overlay, you can define that a case is part of the same shot than the previous one, and so define a shot illustrated by several cases. These relations are then displayed and numbered in a different manner.

Some behaviors helps to maintain such relations when moving cases around :
- you can move all the cases of a shot by moving the first one
- you can move a case to the head of its own shot by moving it before the first one
- you can insert a case into an existing shot by moving it between the first and the last one
- you can extract a case of a shot by moving it a little further

### Update

The edit/view button is also an import/export tool which allow to copy the content of a storyboard file into another, and may be used as an easy update process.

Open the fresh new version of the [demo][demo] in a window, your storyboard in another one, and drag the edit button of your storyboard onto the edit button of the empty one.

[![Update process](update.gif)][demo]
