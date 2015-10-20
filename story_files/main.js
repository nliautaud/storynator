$(function() {
	var part_tpl = $('#template').html();
	var case_tpl = $(part_tpl).find('.case').wrap('<p>').parent().html();
	var overlay_tpl = $('#overlay-tpl').html();

	var body = $('body'),
		header = $('.header'),
		story = $('.story'),
		dragcase = false,
		changes = false,
		linkedCases = null;

	// activate management and contenteditable
	body.removeClass('nomanagement');
	$('*[contenteditable]').attr('contenteditable', true);

	function setChanged() {
		if(!changes) body.addClass('changed');
		changes = true;
	}

	//*/// sortable

	Sortable.create(document.querySelector('.parts'), {
		animation: 200,
		draggable: '.part',
		handle: '.part-handle',
		ghostClass: 'dragged',
	});
	var sortableParts = [];
	function initCasesSort() {
		// destroy old ones
		for (var i = 0; i < sortableParts.length; i++) {
			sortableParts[i].destroy();
		}
		sortableParts.length = 0;
		// make new ones
		[].forEach.call(document.querySelectorAll('.cases'), function (el) {
			sortableParts.push(Sortable.create(el, {
				group: 'cases',
				draggable: '.case',
				handle: '.case-img',
				chosenClass: 'dragged',
				ghostClass: 'dragged',
				animation: 0,
				onStart: function (evt) {
					dragcase = true;
					tagSiblingsOf($(evt.item));
				},
				onEnd: function (evt) {
					dragcase = false;
					manageMoves($(evt.item));
				},
				onSort: function (evt) {
					setChanged();
				}
			}));
		});
	}

	function tagSiblingsOf(item) {
		// tag the cases which are in the same shot
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
		// - cases moved in their shot,
		// - cases moved in/out a shot,
		// - all a shot moved at once.
		var linked = $('.linked'),
			next = item.next(),
			prev = item.prev(),
			prevIsMyShot = prev.hasClass('linked'),
			nextIsMyShot = next.hasClass('linked'),
			nextHaveSameshot = next.hasClass('sameshot'),
			haveSameshot = item.hasClass('sameshot');
		// was in a shot
		if(linked.length != 0) {
			// moved at the head of its shot
			if(nextIsMyShot && !prevIsMyShot) {
				item.removeClass('sameshot');
				next.addClass('sameshot');
				console.log('moved first of its shot');
			}
			// was the first : others follow the chosen one
			else if(!prevIsMyShot && !haveSameshot) {
				$('.linked.before').detach().insertBefore(item);
				$('.linked.after').detach().insertAfter(item);
				console.log('follow me !');
			}
			// moved outside of its shot
			else if(!prevIsMyShot && !nextIsMyShot) {
				item.removeClass('sameshot');
				console.log('bye bye');
			}
			linked.removeClass('linked before after');
		}
		// is inserted in a shot
		if(nextHaveSameshot) {
			item.addClass('sameshot');
			console.log('moved in a shot');
		}
	}

	initCasesSort();

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
			var img = $(this),
				tcase = img.parents('.case');
			img.removeClass('dragenter');

			// not a supported image
			var authorized = ['image/jpeg', 'image/gif', 'image/png'];
			if(file === undefined || authorized.indexOf(file.type) == -1) {
				tcase.addClass('notimage');
				setTimeout(function () {
					tcase.removeClass('notimage');
				}, 200);
				return;
			}

			// let's go
			setChanged();
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
						tcase.addClass('ispano');
					// animate
					tcase.addClass('dropped');
					setTimeout(function () {
						tcase.removeClass('dropped');
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
		setChanged();
	});
	$(window).bind('beforeunload', function(){
		if(changes) return 'Any changes to the storyboard will be lost.';
	});

	//*/// add

	story.delegate('.add-part', 'click', function(e){
		$(part_tpl).appendTo('.parts').hide().slideDown(200);
		initCasesSort();
		setChanged();
	});
	story.delegate('.add-case-before', 'click', function(e){
		$(this).closest('.part').find('.cases').prepend(case_tpl);
		setChanged();
	});
	story.delegate('.add-case', 'click', function(e){
		$(this).closest('.part').find('.cases').append(case_tpl);
		setChanged();
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
		setChanged();
	});
	story.delegate('.case *[data-toggle]', 'click', function(e){
		var $this = $(this);
		$this.closest('.case').toggleClass($this.data('toggle'));
		setChanged();
	});

	//*/// part delete

	story.delegate('.part-delete', 'click', function(e){
		var part = $(this).closest('.part');
		part.addClass('hidemanagement')
			.animate({
				opacity: 0, height: 0
			}, function() {
				part.remove();
				setChanged();
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