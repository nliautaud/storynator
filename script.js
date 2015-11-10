// Choose branch based on query string, and load raw md
var branch = 'master',
	query = window.location.search;
if (query) branch = query.replace('?', '');

// load README.md
$.ajax({
	url: "https://rawgit.com/nliautaud/storynator/"+branch+"/README.md",
	dataType: 'text',
	success: function(data) {
 
		// convert md to html and hierarchicalize headers
		var converter = new showdown.Converter(),
			html	  = converter.makeHtml(data);
		html = hierarchicalize(html, true);

		// load content
		$('#wrapper').html(html).promise().done(function(){
			$(this).parent().removeClass('loading');

			// toc
			$('<div id="toc"></div>')
				.insertBefore('.hgroup.gettingstarted')
				.toc({
					'selectors': 'h1,h2,h3',
					'container': '.storynator',
					'smoothScrolling': true,
					'prefix': 'toc',
					'highlightOnScroll': true,
					'highlightOffset': 600,
				})
				.sticky({topSpacing:0});
		});

	}
});

// play with title
$('#title')
	.attr('contentEditable', true)
	.keydown(function(event){
		if(event.keyCode == 13) {
			event.preventDefault();
			return false;
		}
	}).on('input', function (e) {
		$(this).css('display', 'inline');
	}).on('keypress', function (e) {
		return ($(this).text().length <= 10);
	});

/**
 * Transform HTML using flat headers (ex. markdown output)
 * into a hierarchically nested HTML structure.
 *
 * @param {string} the flat input
 * @param {boolean} encapsulate the direct headers content
 * @return {string} the nested output
 */
function hierarchicalize (html, hcontent) {
	var tags = ['h1','h2','h3','h4','h5','h6'],
		getNext = function (el, arr) {
			return el.nextAll(arr.join(',')).first().get(0);
		};
	$('<div>')
		.html(html) // input
		.find(tags.join(','))
			.addClass('header')
			.end()
		.find('.header')
			.removeAttr('class')
			.each(function (i, header) {
				var is = $(this),
					tag = header.tagName.toLowerCase(),
					lvl = parseInt(tag[1]),
					next = getNext(is, tags),
					nextup = getNext(is, tags.slice(0, lvl)),
					cl = ' ' + header.id,
					opening = '<div class="hgroup '+tag+cl+'">',
					close = next ? '</div>' : '</div></div>';
				if(hcontent)
					opening += '<div class="hcontent hc'+lvl+cl+'">';
				html = html.replace(header.outerHTML, opening + header.outerHTML);
				// close hcontent before next header
				if(hcontent && next)
					html = html.replace(next.outerHTML, close + next.outerHTML);
				// close header before next higher header
				if(!nextup) html += close;
				else html = html.replace(nextup.outerHTML, close + nextup.outerHTML);
			});
	return html;
}