/**
 * Modified version of stats.js https://github.com/mrdoob/stats.js
 * cuts out all the functionality of gathering stats and display graphs
 * and provides a simple info display with identical look of stats.js
 *
 * Usage: info.setInfo1('sample text'), info.setInfo2('sample text').
 */

var Info = function () {

	var startTime = Date.now(), prevTime = startTime;
	var ms = 0, msMin = Infinity, msMax = 0;
	var fps = 0, fpsMin = Infinity, fpsMax = 0;
	var frames = 0, mode = 0;

	var container = document.createElement( 'div' );
	container.id = 'stats';
	container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 2 ) }, false );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	var fpsDiv = document.createElement( 'div' );
	fpsDiv.id = 'fps';
	fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
	container.appendChild( fpsDiv );

	var fpsText = document.createElement( 'div' );
	fpsText.id = 'fpsText';
	fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	fpsText.innerHTML = 'Info 1';
	fpsDiv.appendChild( fpsText );

	var msDiv = document.createElement( 'div' );
	msDiv.id = 'ms';
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
	container.appendChild( msDiv );

	var msText = document.createElement( 'div' );
	msText.id = 'msText';
	msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML = 'Info 2';
	msDiv.appendChild( msText );

	var setMode = function ( value ) {

		mode = value;

		switch ( mode ) {

			case 0:
				fpsDiv.style.display = 'block';
				msDiv.style.display = 'none';
				break;
			case 1:
				fpsDiv.style.display = 'none';
				msDiv.style.display = 'block';
				break;
		}

	}

	return {

		REVISION: 1,

		domElement: container,

		setMode: setMode,

		// set
		setAll: function(text) {
			this.setInfo1(text);
			this.setInfo2(text);
		},

		setInfo: function(text) {
			switch ( mode ) {
					case 0:
						this.setInfo1(text);
						break;
					case 1:
						 this.setInfo2(text);
						 break;
			}
		},

		setInfo1: function(text) {
			fpsText.textContent = text;
		},

		setInfo2: function(text) {
			msText.textContent = text;
		},

		// get
		getInfo: function(text) {
			switch ( mode ) {
					case 0:
						return this.getInfo1();
					case 1:
						return this.getInfo2();
			}
		},

		getInfo1: function(text) {
			return fpsText.textContent;
		},

		getInfo2: function(text) {
			return msText.textContent;
		},

		// append
		appendAll: function(text) {
			this.appendInfo1(text);
			this.appendInfo2(text);
		},

		appendInfo: function(text) {
			switch ( mode ) {
					case 0:
						this.appendInfo1(text);
						break;
					case 1:
						this.appendInfo2(text);
						break;
			}
		},

		appendInfo1: function(text) {
			fpsText.textContent += text;
		},

		appendInfo2: function(text) {
			msText.textContent += text;
		},

	}

};