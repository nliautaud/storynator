var $ = require('jquery');
var Sortable = require('sortablejs');
var SVG = require('svgjs');
require('svg.draw.js');

$(function() {
  var scene_tpl = $('#template').html();
  var frame_tpl = $(scene_tpl).find('.frame').wrap('<p>').parent().html();
  var overlay_tpl = $('#overlay-tpl').html();

  var body = $('body'),
    header = $('.header'),
    story = $('.story'),
    isDragging = false,
    haveChanged = false,
    isExport = false,
    linkedFrames = null,
    sortableParts = [],
    shift_pressed = false;

  // activate management and contenteditable
  body.removeClass('nomanagement');
  $('*[contenteditable]').attr('contenteditable', true);

  // compatibility
  $('.col').removeClass('col');


  //*/// edit button hovering

  $('.btn-edit')
    .on('mouseenter', function (event) {
      $(this).addClass('hover');
    }).on('mouseleave', function (event) {
      $(this).removeClass('hover');
    }).on('click', function (event) {
      $(this).removeClass('hover');
    });




  //  ██ ███    ███ ██████   ██████  ██████  ████████
  //  ██ ████  ████ ██   ██ ██    ██ ██   ██    ██
  //  ██ ██ ████ ██ ██████  ██    ██ ██████     ██
  //  ██ ██  ██  ██ ██      ██    ██ ██   ██    ██
  //  ██ ██      ██ ██       ██████  ██   ██    ██
  //*///

  $(document)
    .on('dragstart', function (event) {
      isDragging = true;
    }).on('dragover', function (event) {
      if(!isDragging) $('.btn-edit').addClass('import');
    }).on('dragleave', function (event) {
      if(!isDragging) $('.btn-edit').removeClass('import');
    }).on('drop', function(event){
      if(isDragging) return;
      $('.btn-edit').removeClass('import');
      var files = event.originalEvent.dataTransfer.files;
      if(files.length) {
        var opt = {shift: event.shiftKey, name: files[0].name};
        switch (files[0].type) {
          case 'text/css' :
            loadFile(files[0], cssCallback, opt);
            event.preventDefault();
            return false;
          case 'text/html' :
            loadFile(files[0], htmlCallback, opt);
            event.preventDefault();
            return false;
        }
      }
    });
  function loadFile (file, callback, opt) {
    $('.btn-edit').addClass('loading');
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
      callback(e.target.result, opt);
    };
  }
  function cssCallback (css, opt) {
    var split = opt.name.split('.');
    if(split.length !== 3) {
      console.log('no namespace found on :', opt.name);
      return;
    }
    name = split[1];
    target = '#storynator_' + split[0];
    if(opt.shift) css = $(target).html() + css;
    replaceContent(target, css);
    console.log('import', split[0], name);
  }
  function htmlCallback (html, opt) {
    var imported = $('<div>').html(html),
      story = imported.find('.scenes').first();
    if(!opt.shift) content = story.html();
    else {
      story.find('.shadow').remove();
      content = $('.scenes').html() + story.html();
    }
    replaceContent('.scenes', content, function () {
      var title = imported.find('.header-title').first().html();
      setTitle(title);
      initFramesSort();
      console.log('import story "'+title+'" ('+opt.name+')');
    });
  }
  function replaceContent (sel, content, callback) {
    $(sel).first()
      .html(content)
      .promise().done(function () {
        setTimeout(function () {
          $('.btn-edit').removeClass('loading');
        }, 500);
        if(callback) callback();
        setChanged();
      });
  }




  //   ██████ ██   ██  █████  ███    ██  ██████  ███████ ███████
  //  ██      ██   ██ ██   ██ ████   ██ ██       ██      ██
  //  ██      ███████ ███████ ██ ██  ██ ██   ███ █████   ███████
  //  ██      ██   ██ ██   ██ ██  ██ ██ ██    ██ ██           ██
  //   ██████ ██   ██ ██   ██ ██   ████  ██████  ███████ ███████
  //*///

  function setSaved() {
    if(!haveChanged) return;
    body.removeClass('changed');
    haveChanged = false;
    setTitle();
    console.log('(file probably saved)');
  }
  function setChanged() {
    if(haveChanged) return;
    body.addClass('changed');
    haveChanged = true;
    setTitle();
    console.log('(content have changed)');
  }
  function getTitle () {
    return $('.header-title').text() || 'Untitled';
  }
  function setTitle (title) {
    if(typeof title === 'string') {
      $('.header-title').text(title);
    } else title = getTitle();
    var prefix = haveChanged ? '(not saved) ' : '';
    document.title = prefix + title;
  }
  body.delegate('*[contenteditable]', 'input', setChanged);
  $('.header-title').on('input', setTitle);

  $(window).bind('beforeunload', function(){
    if(haveChanged)
      return 'Any changes to the storyboard will be lost.';
  });





  //  ██████  ██████   █████  ██     ██ ██ ███    ██  ██████
  //  ██   ██ ██   ██ ██   ██ ██     ██ ██ ████   ██ ██
  //  ██   ██ ██████  ███████ ██  █  ██ ██ ██ ██  ██ ██   ███
  //  ██   ██ ██   ██ ██   ██ ██ ███ ██ ██ ██  ██ ██ ██    ██
  //  ██████  ██   ██ ██   ██  ███ ███  ██ ██   ████  ██████
    //*///

  var isDrawing;
  var svg;
  var tool;
  const getTool = () => {
    return {
      type: 'pen',
      stroke: 'red',
      'stroke-width': 1,
      'fill': 'none',
    };
  }

  function setupDrawing(frame) {
    // get existing svg or create new one
    let el = frame.find('svg')[0] || frame.find('.frame-svg')[0]
    svg = SVG(el);
    // set svg viewbox
    let rect = el.getBoundingClientRect();
    svg.viewbox(0, 0, rect.width, rect.height);
  }
  function startDrawing(event) {
    event.preventDefault();
    isDrawing = true;
    startStroke(event);
    console.log('start drawing');
  }
  function startStroke(event) {
    if (!isDrawing) return;

    tool = getTool();

    let polyline = svg.polyline().attr(tool).draw(event);
    // remove small circles
    polyline.remember("_paintHandler").drawCircles = function () { };

    plotDrawing(event);
    console.log('start stroke');
  }
  function plotDrawing(event) {
    if (!isDrawing) return;
    if (tool.type === 'pen') {
      svg.last().draw('point', event);
    }
  }
  function stopStroke(event) {
    if (!isDrawing) return;
    svg.last().draw('stop', event);
    console.log('stop stroke');
  }
  function stopDrawing(event) {
    if (!isDrawing) return;
    if (tool.type === 'pen') {
      stopStroke(event);
    } else svg.last().draw(event);
    isDrawing = false;
    console.log('stop drawing');
  }
  function clearDrawing(event) {
    $(this).closest('.frame').find('svg').remove();
    console.log('clear drawing');
  }
  function undoLastStroke() {
    var last = svg.last();
    if (!last) return;
    last.remove();
    console.log('undo last stroke');
  }

  // management
  body.delegate('.btn-clear', 'click', clearDrawing);
  body.delegate('.btn-draw', 'click', function (event) {
    event.preventDefault();
    setupDrawing($(this).closest('.frame'));
    unselectFrames();
    return false;
  });
  body.on('mousedown', function (event) {
    var curr_drawn = $('.is-drawable'),
    curr_svg = curr_drawn.find('svg')[0];
    if(!curr_drawn.length || event.target.closest('svg') === curr_svg) return;
    $('.is-drawable').removeClass('is-drawable');
  });

  // drawing
  body.delegate('svg', 'mousedown', startDrawing);
  body.delegate('svg', 'mouseenter', startStroke);
  body.delegate('svg', 'mousemove', plotDrawing)
  body.delegate('svg', 'mouseleave', stopStroke)
  body.on('mouseup', stopDrawing)





  //  ██ ███    ███  ██████      ██████  ██████   ██████  ██████
  //  ██ ████  ████ ██           ██   ██ ██   ██ ██    ██ ██   ██
  //  ██ ██ ████ ██ ██   ███     ██   ██ ██████  ██    ██ ██████
  //  ██ ██  ██  ██ ██    ██     ██   ██ ██   ██ ██    ██ ██
  //  ██ ██      ██  ██████      ██████  ██   ██  ██████  ██
  //*///

  story.delegate('.frame', 'dragenter', unselectFrames);
  story.delegate('.frame-img', 'dragenter', function(e){
    if(!isDragging) {
      e.stopPropagation();
      e.preventDefault();
      $(this).addClass('dragenter');
    }
  });
  story.delegate('.frame-img', 'dragleave', function(e){
    if(!isDragging) $(this).removeClass('dragenter');
  });
  story.delegate('.frame-img', 'dragover', function(e){
    if(!isDragging) {
      e.stopPropagation();
      e.preventDefault();
    }
  });
  story.delegate('.frame-img', 'drop', function(event){
    if(isDragging) return;
    event.preventDefault();
    var frame_img = $(this);
    function getTarget (frame) {
      if(event.shiftKey) return getDrawnImage(frame);
      return frame.find('.frame-img-loaded');
    }
    var files = event.originalEvent.dataTransfer.files,
      target = getTarget(frame_img),
      frame, newframe;
    frame_img.removeClass('dragenter');

    for (var i = 0; i < files.length; i++){
      var load = loadImage(files[i], target);
      if(!load) continue;
      frame = newframe = target.closest('.frame');
      if(frame.hasClass('shadow'))
        newframe = revealFrame(target);
      else if(i < files.length -1 ) {
        newframe = newFrame();
        frame.after(newframe);
      }
      target = getTarget(newframe);
    }
    return false;
  });

  function loadImage (file, img) {
    var frame = img.parents('.frame');

    // not a supported image
    var authorized = ['image/jpeg', 'image/gif', 'image/png'];
    if(file === undefined || authorized.indexOf(file.type) == -1) {
      frame.addClass('notimage');
      setTimeout(function () {
        frame.removeClass('notimage');
      }, 200);
      console.log('dropped file is not an image');
      return false;
    }
    // let's go
    console.log('load', file.name);
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('loadend', function (e, f) {
      var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        image = new Image();
      image.src = this.result;
      image.onload = function() {
        var width = this.width,
          height = this.height,
          max = 4000;
        // set pano mode
        if(width > 2 * height) {
          frame.addClass('ispano');
          console.log('enable pano mode');
        }
        // animate
        frame.addClass('dropped');
        setTimeout(function () {
          frame.removeClass('dropped');
        }, 500);
        // limit size
        if(width > max) {
          console.log('resize width', width);
          width = max;
          height = width * (this.height / this.width);
        }
        if(height > max) {
          console.log('resize height', height);
          height = max;
          width = height * (this.width / this.height);
        }
        canvas.width = width;
        canvas.height = height;
        context.scale(width / this.width, height / this.height);
        context.drawImage(this, 0, 0);
        img.attr('src', canvas.toDataURL(file.type, 0.25));
      };
    }, false);
    return true;
  }

  $(window).on('dragover', function(e){
    e.preventDefault();
  });
  $(window).on('drop', function(event){
    event.preventDefault();
  });





  //   █████  ██████  ██████
  //  ██   ██ ██   ██ ██   ██
  //  ███████ ██   ██ ██   ██
  //  ██   ██ ██   ██ ██   ██
  //  ██   ██ ██████  ██████
  //*///

  $('.scene:not(.shadow)').each(function () {
    revealScene($(this));
  });
  addShadowScene();

  story.delegate('.scene.shadow .scene-header *[contenteditable]', 'input', function(e){
    revealScene($(this));
  });
  story.delegate('.add-frame-before', 'click', function(e){
    $(this).closest('.scene').find('.frames').prepend(newFrame());
    setChanged();
    console.log('prepend a frame');
  });
  story.delegate('.add-frame', 'click', function(e){
    var shadow = $(this).closest('.scene').find('.frame.shadow');
    revealFrame(shadow);
  });
  body.delegate('.frame.shadow *[contenteditable]', 'input', function(e){
    revealFrame($(this));
  });
  function delShadows () {
    $('.shadow').remove();
  }
  function newShadowFrame () {
    return $(frame_tpl);
  }
  function newFrame () {
    return unShadow(newShadowFrame());
  }
  function newShadowScene () {
    return $(scene_tpl);
  }
  function newScene () {
    return unShadow(newShadowScene());
  }
  function isShadow (el) {
    return el.hasClass('shadow') || el.parents('.shadow').length !== 0;
  }
  function unShadow (el) {
    return el.removeClass('shadow management');
  }
  function addShadowScene () {
    // add a new shadow scene if needed
    var shadowscene = story.find('.scene.shadow');
    if(shadowscene.length === 0) {
      shadowscene = newShadowScene();
      story.find('.scenes').append(shadowscene);
      initFramesSort();
      console.log('add a new shadow scene');
    }
    return shadowscene;
  }
  function revealScene (scene) {
    if(!scene.hasClass('scene'))
      scene = scene.closest('.scene');
    if(isShadow(scene)) {
      unShadow(scene);
      console.log('reveal a scene');
      setChanged();
    }
    // add a new shadow frame if needed
    var shadowframe = scene.find('.shadow');
    if(shadowframe.length === 0) {
      scene.find('.frames').append(newShadowFrame());
      console.log('add a new shadow frame');
    }
    return addShadowScene();
  }
  function revealFrame (frame) {
    if(!frame.hasClass('frame'))
      frame = frame.closest('.frame');
    if(isShadow(frame)) {
      unShadow(frame);
      console.log('reveal a frame');
      setChanged();
    }
    revealScene(frame);
    return frame.parent().find('.shadow');
  }





  //  ███████ ███████ ██      ███████  ██████ ████████
  //  ██      ██      ██      ██      ██         ██
  //  ███████ █████   ██      █████   ██         ██
  //       ██ ██      ██      ██      ██         ██
  //  ███████ ███████ ███████ ███████  ██████    ██
  //*///

  function selectFrame (frame) {
    frame.prepend(overlay_tpl);
  }
  function unselectFrames(el){
    if(!(el instanceof $)) el = story;
    el.find('.overlay').remove();
  }
  function getSelectedFrames(){
    return $('.overlay').parents('.frame');
  }
  function deleteFrames(frames){
    if(!(frames instanceof $))
      frames = getSelectedFrames();
    frames.addClass('remove');
    setTimeout(function(){
      frames.remove();
    }, 200);
    setChanged();
  }
  function duplicateFrames(frames){
    if(!(frames instanceof $))
      frames = getSelectedFrames();
    frames.each(function(){
      var newFrame = $(this).clone().insertAfter($(this));
      unselectFrames(newFrame);
      if(newFrame.next().hasClass('sameshot'))
        newFrame.addClass('sameshot');
    });
    setChanged();
  }
  $(window).on('click', function(event) {
    var target = $(event.target);
    if(target.is('.btn')) return;
    if(target.is('.overlay')) {
      var overlays = $('.overlay');
      if(overlays.length == 1 || event.shiftKey) {
        target.remove();
      } else overlays.not(target).remove();
      return;
    }
    if(!event.shiftKey) unselectFrames();
    if(target.is('img')){
      revealFrame(target.parent());
      selectFrame(target.parent());
    }
  });
  story.delegate('.frame *[data-toggle]', 'click', function(e){
    $('.overlay').parents('.frame')
      .toggleClass($(this).data('toggle'))
      .find('img')
        .removeAttr('style');
    setChanged();
  });
  story.delegate('.overlay .btn-delete', 'click', deleteFrames);
  story.delegate('.overlay .btn-duplicate', 'click', duplicateFrames);



  //*/// part delete

  story.delegate('.scene-delete', 'click', function(e){
    var part = $(this).closest('.scene');
    part.addClass('hidemanagement')
      .animate({
        opacity: 0, height: 0
      }, function() {
        part.remove();
        setChanged();
      });
  });





  //  ███████  ██████  ██████  ████████  █████  ██████  ██      ███████
  //  ██      ██    ██ ██   ██    ██    ██   ██ ██   ██ ██      ██
  //  ███████ ██    ██ ██████     ██    ███████ ██████  ██      █████
  //       ██ ██    ██ ██   ██    ██    ██   ██ ██   ██ ██      ██
  //  ███████  ██████  ██   ██    ██    ██   ██ ██████  ███████ ███████
  //*///

  Sortable.create(document.querySelector('.scenes'), {
    animation: 100,
    draggable: '.scene',
    handle: '.scene-handle',
    ghostClass: 'dragged',
    onStart: function (evt) {
      isDragging = true;
      $('.scene').addClass('closed-tmp');
    },
    onEnd: function (evt) {
      isDragging = false;
      $('.scene').removeClass('closed-tmp');
    },
    onSort: function (evt) {
      setChanged();
      // moved shadow, or after shadow
      var item = $(evt.item);
      if(item.hasClass('shadow')) revealScene(item);
      if(item.prev().hasClass('shadow')) revealScene(item.prev());
    }
  });
  function initFramesSort() {
    // destroy old ones
    for (var i = 0; i < sortableParts.length; i++) {
      sortableParts[i].destroy();
    }
    sortableParts.length = 0;
    // make new ones
    $('.frames').each(function (el) {
      sortableParts.push(Sortable.create($(this).get(0), {
        group: 'frames',
        draggable: '.frame',
        handle: '.frame-img',
        chosenClass: 'dragged',
        ghostClass: 'dragged',
        animation: 150,
        onStart: function (evt) {
          isDragging = true;
          tagSiblingsOf($(evt.item));
          unselectFrames();
        },
        onEnd: function (evt) {
          isDragging = false;
          manageMoves($(evt.item));
          revealScene($(evt.from));
          revealFrame($(evt.item));
        },
        onSort: function (evt) {
          setChanged();
        },
        // allow downloading images by dragging frames outside browser
        setData: function (dataTransfer, el) {
          var filename = new Date().getTime();
          // svg with shift
          if(shift_pressed) {
            var svgElement = $(el).find('svg')[0];
            if (!svgElement) return;
            dataTransfer.setData(
              'DownloadURL',
              `text/html:${filename}.svg:data:image/svg+xml;utf8,${svgElement.outerHTML}`
            );
            return;
          }
          // main image without
          var b64 = $(el).find('.frame-img-loaded').attr('src'),
              ext = b64.match(/^data:image\/([a-z]+)/)[1];
          dataTransfer.setData(
            'DownloadURL',
            `text/html:${filename}.${ext}:${b64}`
          );
        }
      }));
    });
  }

  function tagSiblingsOf(item) {
    // tag the frames which are in the same shot
    // that the given item (cf. manageMoves)
    item.nextUntil(':not(.sameshot)')
      .addClass('linked after');
    if(item.hasClass('sameshot')) {
      item.prevUntil(':not(.sameshot)')
        .andSelf().prev()
        .addClass('linked before');
    }
  }
  function manageMoves(item) {
    // manage global behaviors of :
    // - frames moved in their shot,
    // - frames moved in/out a shot,
    // - all a shot moved at once.
    // - shadow frame moved
    // - frame moved after the shadow
    var linked = $('.linked'),
      next = item.next(),
      prev = item.prev(),
      prevIsMyShot = prev.hasClass('linked'),
      nextIsMyShot = next.hasClass('linked'),
      nextHaveSameshot = next.hasClass('sameshot'),
      haveSameshot = item.hasClass('sameshot');

    // moved shadow, or after shadow
    if(item.hasClass('shadow')) revealFrame(item);
    if(prev.hasClass('shadow')) revealFrame(prev);

    // item was in a shot
    if(linked.length !== 0) {
      // moved at the head of its shot
      if(nextIsMyShot && !prevIsMyShot) {
        item.removeClass('sameshot');
        next.addClass('sameshot');
        console.log('frame moved 1st of its shot');
      }
      // was the first : others follow the chosen one
      else if(!prevIsMyShot && !haveSameshot) {
        $('.linked.before').detach().insertBefore(item);
        $('.linked.after').detach().insertAfter(item);
        console.log('shot moved (linked follows)');
      }
      // moved outside of its shot
      else if(!prevIsMyShot && !nextIsMyShot) {
        item.removeClass('sameshot');
        console.log('frame extracted of a shot');
      }
      linked.removeClass('linked before after');
    }
    // is inserted in a shot
    if(nextHaveSameshot) {
      item.addClass('sameshot');
      console.log('frame inserted in a shot');
    }
  }
  initFramesSort();





  //  ███████ ██   ██  ██████  ██████  ████████  ██████ ██    ██ ████████ ███████
  //  ██      ██   ██ ██    ██ ██   ██    ██    ██      ██    ██    ██    ██
  //  ███████ ███████ ██    ██ ██████     ██    ██      ██    ██    ██    ███████
  //       ██ ██   ██ ██    ██ ██   ██    ██    ██      ██    ██    ██         ██
  //  ███████ ██   ██  ██████  ██   ██    ██     ██████  ██████     ██    ███████
  //*///

  function cleanup(el) {
    var list = [
      'data-sortable-id', 'data-item-sortable-id',
      'role', 'aria-grabbed', 'aria-dropeffect', 'draggable'],
      selectall = '*[' + list.join('], *[') + ']',
      attrs = list.join(' ');
    el = el || $(selectall);
    el.removeAttr(attrs);
    $('p,span').removeAttr('style');
  }
  // shift pressed detection outside of events (like dragging outside browser)
  $(document).on('keyup keydown blur drop', function(event){
    shift_pressed = event.shiftKey || false;
  });
  // keyboard shortcuts
  $(window).on('keydown', function(event) {
    var key = String.fromCharCode(event.which).toLowerCase();
    switch (key) {
      case '.': // suppr
        event.preventDefault();
        deleteFrames();
        return false;
    }
    // ctrl
    if (!event.ctrlKey && !event.metaKey) return;
    switch (key) {
      case 'd':
        event.preventDefault();
        duplicateFrames();
        return false;
      case 's':
        cleanup();
        setSaved();
        break;
      case 'z':
        undoLastStroke();
        break;
    }
  });
});
