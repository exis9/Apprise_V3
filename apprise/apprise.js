var __apr_bkeyd = 1,
	_g_aprs_ms = 0;

function chkAprsTimer() {
	if (!Date.now) Date.now = function now() {
		return new Date().getTime();
	}
	if (_g_aprs_ms + 200 > Date.now()) return 0;
	_g_aprs_ms = Date.now();
	return 1;
}
function resetAppriseTimer() { _g_aprs_ms = 0; }
function appriseStopKeydown() {
	__apr_bkeyd = 0;
}

function appriseStartKeydown() {
	__apr_bkeyd = 1;
}

function appriseReposition() {
	var el = $('.appriseOuter');
	if (el.length) {
		var w = $(document).width(),
			h = $(window).height();
		if ($(window).width() < 820)
			$('.appriseOuter').css('top', $(window).height() / 15 + 'px').css('left', $(window).width() / 8 + 'px')
		else
			el.css({
				top: '100px',
				left: ($(window).width() - $('.appriseOuter').width()) / 2 + $(window).scrollLeft() + 'px'
			});
		$('.appriseOverlay').css({
			width: w + 'px',
			height: h + 'px'
		});
	}
}

function appriseNoReturnKeyClosing(s, as, c) {
	apprise(s, as, c, false)
}

function apprise(string, args, callback, isReturnKeyClosingEnable) {
	if (!chkAprsTimer()) return false;
	appriseStartKeydown();
	var default_args = {
		'confirm': false,
		'verify': false,
		'password': false,
		'input': false,
		'animate': false,
		'textOk': 'Ok',
		'textCancel': 'Cancel',
		'textYes': 'Yes',
		'textNo': 'No'
	}
	if (args) {
		for (var index in default_args) {
			if (typeof args[index] == 'undefined') args[index] = default_args[index];
		}
	}
	var aHeight = $(document).height();
	var aWidth = $(document).width();
	$('body').append('<div class="appriseOverlay" id="aOverlay"></div>');
	$(window).resize(function () {
		appriseReposition();
	});
	$('.appriseOverlay').click(function () {
		$('.appriseOuter').fadeOut(400, function () {
			$('.appriseOverlay').remove();
			$('.appriseOuter').remove();
		});
	});
	$('.appriseOverlay').css('height', aHeight).css('width', aWidth).fadeIn(100);
	$('body').append('<div class="appriseOuter"></div>');
	$('.appriseOuter').append('<div class="appriseInner"></div>');
	$('.appriseInner').append(string);
	appriseReposition();
	if (args) {
		if (args['animate']) {
			var aniSpeed = args['animate'];
			if (isNaN(aniSpeed)) {
				aniSpeed = 400;
			}
			var m = 100;
			if ($(window).width() < 820) m = $(window).height() / 15;
			$('.appriseOuter').css('top', '-200px').show().animate({
				top: m + 'px'
			}, aniSpeed);
		} else {
			if ($(window).height() < 400) {
				$('.appriseOuter').css('top', '10px').fadeIn(200);
			} else {
				$('.appriseOuter').css('top', '100px').fadeIn(200);
			}
		}
	} else {
		if ($(window).height() < 400) {
			$('.appriseOuter').css('top', '10px').fadeIn(200);
		} else {
			$('.appriseOuter').css('top', '100px').fadeIn(200);
		}
	}
	if (args) {
		var ptxt = '';
		if (args['input']) {
			if (typeof (args['input']) == 'string')
				ptxt = args['input'];
			$('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" value="' + ptxt + '"></div>');
			$('.aTextbox').focus();
		} else if (args['password']) {
			if (typeof (args['password']) == 'string')
				ptxt = args['password'];
			$('.appriseInner').append(
				'<div class="aInput" style="white-space:nowrap;"><input id="idApprise_pass" type="text" class="aTextbox" t="aTextbox" value="' + ptxt + '">' +
				'<label style="margin-left:8px;font-size:13px"><input type="checkbox" onclick="if( $(this).is(\':checked\') ){$(\'#idApprise_pass\').attr(\'type\',\'password\');} else {$(\'#idApprise_pass\').attr(\'type\',\'text\');}" style="margin-right:3px">非表示?</label>'
				+ '</div>');
			$('.aTextbox').focus();
		}
	}
	$('.appriseInner').append('<div class="aButtons"></div>');
	if (args) {
		if (args['confirm'] || args['input'] || args['password']) {
			$('.aButtons').append('<button value="ok">' + args['textOk'] + '</button>');
			$('.aButtons').append('<button value="cancel">' + args['textCancel'] + '</button>');
		} else if (args['verify']) {
			$('.aButtons').append('<button value="ok">' + args['textYes'] + '</button>');
			$('.aButtons').append('<button value="cancel">' + args['textNo'] + '</button>');
		} else {
			$('.aButtons').append('<button value="ok">' + args['textOk'] + '</button>');
		}
	} else {
		$('.aButtons').append('<button value="ok">Ok</button>');
	}
	$(document).off('keydown');
	$(document).keydown(function (e) {
		if (!__apr_bkeyd) return;
		if ($('.appriseOverlay').is(':visible')) {
			if (e.keyCode == 13 && isReturnKeyClosingEnable !== false) {
				if (!chkAprsTimer()) return false;
				$(':focus').blur();
				$('.aButtons > button[value="ok"]').click();
			}
			if (e.keyCode == 27) {
				$('.aButtons > button[value="cancel"]').click();
			}
		}
	});
	var aText = $('.aTextbox').val();
	if (!aText) {
		aText = false;
	}
	$('.aTextbox').keyup(function () {
		aText = $(this).val();
	});
	$('.aButtons > button').click(function () {
		if (isReturnKeyClosingEnable !== false) {
			$('.appriseOverlay').remove();
			$('.appriseOuter').remove();
		}
		if (callback) {
			var wButton = $(this).attr('value');
			if (wButton == 'ok') {
				if (args) {
					if (args['input'] || args['password']) {
						callback(aText);
					} else {
						callback(true);
					}
				} else {
					callback(true);
				}
			} else if (wButton == 'cancel') {
				callback(false);
			}
		}
	});
}