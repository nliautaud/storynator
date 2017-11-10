// Interface helpers and toggles
// management is enabled by story_files/main.js

var story = document.querySelector('.story'),
  header = document.querySelector('.header');

header.className += ' loading';
story.className += ' loading';

function getTarget (e) {
  e = e || window.event;
  var targ = e.target || e.srcElement;
  if (targ.nodeType == 3) targ = targ.parentNode; // defeat Safari bug
  return targ;
}

// disable management and contenteditable.
// are re-enabled by story_files/main.js
document.body.className = 'nomanagement';
// story.className += ' hidemanagement';
// header.querySelector('.management').classList.add('off');
var editables = document.querySelectorAll('*[contenteditable]');
for (var i = 0; i < editables.length; i++) {
  editables[i].setAttribute("contenteditable", false);
}

// fixed header space
var setHeaderSpace = function() {
  document.body.style.paddingTop = header.offsetHeight + 'px';
};
window.onresize = setHeaderSpace;
window.onload = function (event) {
  setHeaderSpace();
  header.classList.toggle('loading');
  story.classList.toggle('loading');
};
document.ondrop = function (event) {
  setTimeout(function () {
    setHeaderSpace();
  }, 200);
};

// panoramic images height
function siblingNot (el, cl, next) {
  do {
    if(next) el = el.nextElementSibling;
    else el = el.previousElementSibling;
    if(!cl) return el;
  } while(el && el.classList.contains(cl));
  return el;
}
var setPanoHeight = function() {
  var panos = story.querySelectorAll('.ispano');
  for (var i = 0; i < panos.length; i++) {
    var prev = siblingNot(panos[i], 'ispano');
    var next = siblingNot(panos[i], 'ispano', true);
    if(!prev && !next) return;
    if(prev) prev = prev.querySelector('img');
    if(next) next = next.querySelector('img');
    var h;
    if(prev) {
      if(next) h = Math.min(prev.clientHeight, next.clientHeight);
      else h = prev.clientHeight;
    } else h = next.clientHeight;

    panos[i].querySelector('img').style.height = h+'px';
    var img = panos[i].querySelector('img');
  }
  // update height time to time
  setTimeout(function () {
    setPanoHeight();
  }, 200);
};
setPanoHeight();
document.addEventListener('drop', setPanoHeight);

// header options toggle
document.querySelector('.header').onclick = function (e){
  var tgt = getTarget(e);

  // drop-down toggles
  if(tgt.classList.contains('select-btn')) {
    var mode = tgt.dataset.mode,
      bodyclass = document.body.classList,
      selectgrp = tgt.parentNode.parentNode,
      options = tgt.parentNode.childNodes;

    var shown = document.querySelector('.select.show');
    if(shown && shown != selectgrp)
      shown.classList.remove('show');

    selectgrp.classList.toggle('show');
    if(bodyclass.contains(mode)) return;

    for (var i = 0; i < options.length; i++) {
      if(options[i].nodeType !== 1) continue;
      bodyclass.remove(options[i].dataset.mode);
      options[i].classList.remove('selected');
    }
    bodyclass.toggle(mode);
    tgt.classList.add('selected');
    console.log('toggle '+mode);
    return;
  }

  // simple toggles
  if(!tgt.classList.contains('toggle')) return;
  tgt.classList.toggle('off');

  if(!tgt.classList.contains('toggle-scn')) {
    story.classList.toggle(tgt.dataset.toggle);
    return;
  }

  // toggle scenes
  var target = '.closed';
  if(!tgt.classList.contains('off'))
    target = ':not(' + target + ')';
  var scenes = story.querySelectorAll('.scene'+target);
  if(scenes === null) return;
  for (var i = 0; i < scenes.length; i++) {
    scenes[i].classList.toggle('closed');
  }
};
// close drop-down on outside click
document.addEventListener('click', function (e) {
  var shown = document.querySelector('.select.show');
  if(getTarget(e).dataset.mode === undefined && shown)
    shown.classList.remove('show');
});

// fullscreen
function fullscreen (el) {
  if(el.requestFullscreen) el.requestFullscreen();
  else if(el.mozRequestFullScreen) el.mozRequestFullScreen();
  else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if(el.msRequestFullscreen) el.msRequestFullscreen();
}
function exitFullscreen () {
  if(document.exitFullscreen) document.exitFullscreen();
  else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
}
document.querySelector('.toggle-fsc').onclick = function (e){
  if(getTarget(e).classList.contains('off')) exitFullscreen();
  else fullscreen(document.documentElement);
};

// scenes toggles
document.body.addEventListener('click', function(e) {
  var tgt = getTarget(e);
  if(tgt.classList.contains('scene-close')) {
    tgt.parentNode.parentNode.parentNode.classList.toggle('closed');
  }
});