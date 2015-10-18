$(function() {
	var part_tpl = $('#template').html();
	var case_tpl = $(part_tpl).find('.case').wrap('<p>').parent().html();
	var overlay_tpl = $('#overlay-tpl').html();

	var body = $('body'),
		header = $('.header'),
		story = $('.story'),
		dragcase = false,
		changes = false;

	body.removeClass('nomanagement');

	//*/// sortable

	function sortable() {
		$('.parts.sortable').sortable({
			forcePlaceholderSize: false,
			handle: '.part-handle',
			items: '.part',
			placeholderClass: 'part-placeholder'
		}).bind('sortupdate', function(e, ui) {
			changes = true;
		});
		$('.cases.sortable').sortable({
			forcePlaceholderSize: true,
			connectWith: '.parts',
			handle: '.img',
			items: '.case',
			placeholderClass: 'case-placeholder col'
		}).bind('sortstart', function(e, ui) {
			dragcase = true;
		}).bind('sortstop', function(e, ui) {
			dragcase = false;
		}).bind('sortupdate', function(e, ui) {
			changes = true;
		});
	}
	sortable();

	//*/// drop image

	story.delegate('.case', 'dragenter', function(e){
		$('.overlay').remove();
	});
	story.delegate('.case img', 'dragenter', function(e){
		if(!dragcase) {
			e.stopPropagation();
			e.preventDefault();
			$(this).addClass('dragenter');
		}
	});
	story.delegate('.case img', 'dragleave', function(e){
		if(!dragcase) $(this).removeClass('dragenter');
	});
	story.delegate('.case img', 'dragover', function(e){
		if(!dragcase) {
			e.stopPropagation();
			e.preventDefault();
		}
	});
	story.delegate('.case img', 'drop', function(e){
		if(!dragcase) {
			e.preventDefault();
			var file = e.originalEvent.dataTransfer.files[0];
			var img = $(this);
			img.removeClass('dragenter');

			// not a supported image
			var authorized = ['image/jpeg', 'image/gif', 'image/png'];
			if(file === undefined || authorized.indexOf(file.type) == -1) {
				img.addClass('notimage');
				setTimeout(function () {
					img.removeClass('notimage');
				}, 200);
				return;
			}

			// let's go
			changes = true;
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.addEventListener('loadend', function (e, f) {
				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');
				
				var image = new Image();
				image.src = this.result;
				image.onload = function() {
					var width = this.width,
						height = this.height,
						max = 4000;
					// set pano mode
					if(width > 2 * height)
						img.closest('.case').addClass('ispano');
					// animate
					img.addClass('dropped');
					setTimeout(function () {
						img.removeClass('dropped');
					}, 500);
					// limit size
					if(width > max) {
						width = max;
						height = width * (this.height / this.width);
					}
					if(height > max) {
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
		}
	});
	/* prevent opening file when missing target */
	$(window).on('dragover', function(e){
		e.preventDefault();
	});
	$(window).on('drop', function(e){
		e.preventDefault();
	});
	/* alert before quitting when changes may be lost */
	body.delegate('*[contenteditable]', 'input', function(e){
		changes = true;
	});
	$(window).bind('beforeunload', function(){
		if(changes)
			return 'Any changes to the storyboard will be lost.';
	});

	//*/// add

	story.delegate('.add-part', 'click', function(e){
		$(this).before(part_tpl);
		$('.part:last-of-type').hide().slideDown(200);
		sortable();
		changes = true;
	});
	story.delegate('.add-case', 'click', function(e){
		$(this).before(case_tpl);
		sortable();
		changes = true;
	});

	//*/// case overlay

	story.delegate('.case-img', 'click', function(e){
		$('.overlay').remove();
		$(this).prepend(overlay_tpl);
		e.stopPropagation();
	});
	$(window).on('click', function() {
		$('.overlay').remove();
	});
	story.delegate('.overlay .delete', 'click', function(e){
		var $case = $(this).closest('.case');
		$case.addClass('remove');
		setTimeout(function(){
			$case.remove();
		}, 200);
		changes = true;
	});
	story.delegate('.case *[data-toggle]', 'click', function(e){
		var $this = $(this);
		$this.closest('.case').toggleClass($this.data('toggle'));
		changes = true;
	});

	//*/// part delete

	story.delegate('.part-delete', 'click', function(e){
		var part = $(this).closest('.part');
		togglePart(part);
		part.animate({
			opacity: 0, height: 0
		}, function() {
			part.remove();
			changes = true;
		});
	});

	//*/// shortcuts

	function cleanup() {
		var attrs = [
			'data-sortable-id', 'data-item-sortable-id',
			'role', 'aria-grabbed', 'aria-dropeffect',
			'draggable', 'style'];
		$.each(attrs, function(id, val){
			$('*['+val+']').removeAttr(val);
		});
	}
	$(window).on('keydown', function(event) {
		if (event.ctrlKey || event.metaKey) {
			switch (String.fromCharCode(event.which).toLowerCase()) {
			case 'q':
				cleanup();
				alert('cleaned');
			}
		}
	});
});