#Storynator

A simple storyboard editor, with drag and drop and direct text editing.

[![Demo](chrome-frame.png)][demo]

[demo]: https://cdn.rawgit.com/nliautaud/storynator/3c37a0fd0632993a08788bb65b5efcdfe40e8864/story.html

Storynator is a self-contained program and editable document which aims to write and layout a simple storyboard with the speed of light, to display it and browse it on a dynamic way, to simplify small edits and to stimulate big changes and structural experiments, while being as shareable as a simple PDF.

- Add scenes and frames, drop images files
- Write things directly
- Reorder scenes and shots by drag & drop
- See how everything is numbered automaticaly
- Open your document on any device, choose what element to display
- Send your storyboard to somebody or synchronize and edit it with your team
- Change the layout & design if you want. That's just HTML and CSS. 

### Getting started

Open the [demo][demo] and start editing. Everything take place on your browser, and on your browser only, even when using the demo link : no single action (including loading images) is recorded, uploaded trough internet, nor stored anywhere.

When you're ready to save your changes, juste save the page on your computer (like just ``Ctrl+S`` or ``Cmd+S``). That saved file is autonomus, and may be opened from your computer, edited, and saved, again.

### Adding elements

In edit mode, you'll see some hollow blocs with dashed borders. They're new scenes and new frames waiting to be created. Start to edit them, and they will instantly became fresh new elements. Start to write some text, drag them to somewhere you'd like a new one, or just drop some images onto the hollow frames.

If you want to quickly add a bunch of empty frames, you may use the buttons next to the scene header. One append them at the end, and the other insert them at the begining (so you don't have to scroll to the bottom for that).

To delete a scene, use the button next to its header.

By clicking on a frame you'll reveal an overlay with options (you can select multiple frames with the ``shift`` key) :
- ``✕`` delete the selected frames
- ``--`` link the selected frames to the previous shot
- ``⇔`` toggle the selected frames width limitation (see [images](#images))

By default, each frame of the storyboard define a distinct shot. By linking a frame to its predecessor trough the frame options you define that it's still the same shot, and thus define a shot illustrated by several frames. The shots will be numbered accordingly, and may be displayed differently.

### Loading images

Drop image files onto a frame to load them. You may drop a single file to load or overwrite a single image, or drop a bunch of files to create new frames.

The image files must be in ``jpg``,``png`` or ``gif`` format. Once reduced to a proper size, they are directly included into the storyboard file.

By default, the frames width are set to be nicely layout in regular columns. When an image is especially larger than the others, for a traveling shot for example, that limitation may be inapropriated. By disabling that limitation trough the frames options, the image will mimic the height of its surrounding frames. That option is automaticaly enabled when a dropped image is at least two times larger than tall.

### Writing

The texts are directly editables.

Depending on your browser you may use the usual keyboard shortcuts to undo/redo text changes (ex. ``ctrl+z`` or ``⌘+z``) and apply formatting like bold, italic or underline (ex. ``ctrl+b`` or ``⌘+b``).

### Moving things

Drag & drop things by grabbing the images or the handle next to the scenes titles. You can move frames between scenes too.

You can only move the frames one by one, but moving the first one of a shot will move the other ones as well. The relations between frames will be taken into account when moving them around :
- moving a frame into an existing shot insert it as expected.
- extracting a frame from a shot by moving it further do not break the shot.
- moving a frame before the first one of its own shot will keep it in the shot.

### Display options

- *Open/close all* : toggle all the scenes.
- *Texts* : show / hide parts and frames texts.
- *Numbers* : show / hide parts and frames numbers.
- *Overview* : display frames two times smaller.
- *Edit/View* : toggle editing or viewing mode.

The parts may be folded or opened by clicking on the arrow next to their title.

### Sharing & copying

All you've got is composed of a .html file and a directory :

```
story.html
story_files/
```
The storyboard itself is self-contained in the single html file. That mean that it may be distributed, copied, sent by mail or synchronised trough Dropbox, BitSync, or shared on its own in any other way.

The sibling directory contain only the system files that allow to edit the storyboard content. Thus, a shared storyboard may be editable depending on whether you choose to include this directory or not. Note that its name rely on the browser and OS implementations, so different browsers and OS may have different behaviors and may use a slightly different name. 

A solitary storyboard file, without its sibling directory, will look like the view mode (without the edit button).

### Updating

The view/edit button is also an import/export tool which allow to copy the content of a storyboard file into another, and may be used as an easy update process.

- Open the last version by using the [demo][demo] link in a window, and your existing storyboard in another window.
- Drag the edit button of your existing storyboard onto the edit button of the empty one.
- Save the new version filled with your content onto your existing storyboard, and open your local storyboard.

[![Update process](update.gif)][demo]
