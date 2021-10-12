'use strict';

var __apr_bkeyd = 1,
	//_g_aprs_ms = 0,
	_g_f_tg = 0;

function killApprise(){
	$('.appriseOverlay').remove()
	$('.appriseOuter').remove()
}
/*function chkAprsTimer() {
	if (!Date.now) Date.now = function now() {
		return new Date().getTime();
	}
	if (_g_aprs_ms + 800 > Date.now()) return 0;
	_g_aprs_ms = Date.now();
	return 1;
}*/
function resetAppriseTimer(){_g_aprs_ms = 0;}
function appriseStopKeydown(){__apr_bkeyd = 0;}
function appriseStartKeydown(){__apr_bkeyd = 1;}
function appriseNoKeyClose(s, as, c) {
	apprise(s, as, c, false)
}

function apprise(str, args, callback, isKeyCloseEnable=true) {
	killApprise()
	appriseStartKeydown();
	let default_args = {
		'confirm': false,
		'verify': false,
		'password': false,
		'input': false,
		'animate': false,
		'textOk': 'Ok',
		'textCancel': 'Cancel',
		'textYes': 'Yes',
		'textNo': 'No',
		'backgroundClose': true,
		'keyClose': true,
		'passHideText': 'hide?',
	}
	if (!args) 
		args = default_args
	
	for (let index in default_args)
	{
		if (typeof args[index] == 'undefined')
			args[index] = default_args[index];
	}
	if ( isKeyCloseEnable )
		isKeyCloseEnable = args['keyClose']
	
	$('body').append('<div class="appriseOverlay" id="aOverlay"></div>');
	
	if ( args['backgroundClose'] )
	{
		$('.appriseOverlay').off()
		$('.appriseOverlay').on('click', function () {
			$('.appriseOuter').fadeOut(400, function () {
				killApprise()
			});
		});
	}
	$('.appriseOverlay').fadeIn(100);
	$('body').append('<div class="appriseOuter" tabindex="0"><div class="appriseInner">'+str+'</div><div class="aButtons"></div></div>');
	
	// animate
	if (args['animate']){
		let aniSpeed = args['animate']
		if (isNaN(aniSpeed))
			aniSpeed = 400
		
		$('.appriseOuter').css('top', '-200px').show().animate({
			top: '40%'
		}, aniSpeed)
	} else {
		$('.appriseOuter').fadeIn(200)
	}
	_g_f_tg = 0
	
	// input or password
	let ptxt = '';
	if (args['input']) {
		if (typeof (args['input']) == 'string')
			ptxt = args['input'];
		$('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" value="' + ptxt + '"></div>');
		
		_g_f_tg = 1
	} else if (args['password']) {
		if (typeof (args['password']) == 'string')
			ptxt = args['password'];
		$('.appriseInner').append(
			'<div class="aInput" style="white-space:nowrap;"><input id="idApprise_pass" type="text" class="aTextbox" t="aTextbox" value="' + ptxt + '">' +
				'<label style="margin-left:8px;font-size:13px;vertical-align:middle;">'+
					'<input type="checkbox" onclick="if( $(this).is(\':checked\') ){$(\'#idApprise_pass\').attr(\'type\',\'password\');} else {$(\'#idApprise_pass\').attr(\'type\',\'text\');}" style="vertical-align:middle;margin-right:3px"><span style="vertical-align:middle;">'+
					args['passHideText']+
				'</span></label>'+
			'</div>');
		_g_f_tg = 1
	}
	setTimeout(()=>{
		if ( _g_f_tg )
			$('.aTextbox:eq(0)').trigger('focus');
		else
			$('.appriseOuter:eq(0)').trigger('focus')
	},5)
	
	if (args['confirm'] || args['input'] || args['password']) {
		$('.aButtons').append('<button value="ok">' + args['textOk'] + '</button>');
		$('.aButtons').append('<button value="cancel">' + args['textCancel'] + '</button>');
	} else if (args['verify']) {
		$('.aButtons').append('<button value="ok">' + args['textYes'] + '</button>');
		$('.aButtons').append('<button value="cancel">' + args['textNo'] + '</button>');
	} else {
		$('.aButtons').append('<button value="ok">' + args['textOk'] + '</button>');
	}

	document.querySelector('.appriseOuter').addEventListener('keyup', e => {
		e.stopPropagation()
		if (!__apr_bkeyd) return
		if ( $('.appriseOverlay').is(':visible') )
		{
			if ( isKeyCloseEnable !== false )
			{
				let tg = e.target.tagName.toLowerCase()
				if (e.keyCode == 13 ) {
					$(':focus').trigger('blur');
					$('.aButtons > button[value="ok"]').trigger('click')
					console.log('eee')
				}

				if (e.keyCode == 27) {
					if ( tg == 'input' || tg =='textarea' )
						return
					if ( $('.aButtons > button[value="cancel"]').length )
						$('.aButtons > button[value="cancel"]').trigger('click')
					else
						$('.aButtons > button[value="ok"]').trigger('click')
				}
			}
		}
	})
	
	let aText = $('.aTextbox').val();
	if (!aText)
		aText = false;
	
	$('.aTextbox').off()
	$('.aTextbox').on('keyup', function () {
		aText = $(this).val();
	});
	$('.aButtons > button').on('click', function () {
		if (isKeyCloseEnable !== false)
			killApprise()
		
		if (callback) {
			let wButton = $(this).attr('value');
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