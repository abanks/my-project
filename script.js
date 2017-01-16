(function() {
	var canvasBody, $,
			w = window.innerWidth,
			h = window.innerHeight,
			gui,
			stats = new Stats(),
			tick = 0,
			pi = Math.PI,
			pi2 = pi*2,
			piD2 = pi/2,
			piD3 = pi/3,
			piD6 = pi/6,
			pi2D3 = pi2/3,
			piDeg = pi/180,
			canvasStyles = {
				position: "absolute",
				top: "0px",
				left: "0px",
				"background-color": "#222",
				"z-index": -1
			},
			Mouse = new Vector2(w/2, h/2),
			mousePressed = false,
			opts = {
				bgc: "#222",
				showFPS: false,
				radius: 150,
				maxPoints: 20,
				startAmount: 1,
				minPoints: 1,
				speedLimit: 2,
				addSpeed: 50,
				lineWidth: 5,
				joinStyle: "round"
			},
			Shape = function(X, Y){
				this.pos = new Vector2(X, Y);
				this.points = [];
				this.iDir = true; //increment direction
				this.init();
				this.pointsA = opts.startAmount;
			},
			Point = function(X, Y){
				this.pos = new Vector2(X, Y);
				this.destiny = this.pos.copy();
				this.speed = new Vector2();
				this.acc = new Vector2();
			}
	Shape.prototype.update = function(){
		this.points.map(function(P){
			P.update();
		});
		return this;
	};
	Shape.prototype.addPoint = function(){
		if(this.pointsA < opts.maxPoints){
			this.pointsA++;
			var length = this.points.length;
			for(var i = 0; i < this.pointsA; i++){
				var ang = pi2/this.pointsA*i
				this.points[i].destiny.set(this.pos.x+Math.cos(ang)*opts.radius, this.pos.y+Math.sin(ang)*opts.radius)
			}
			for(var i = this.pointsA; i < length; i++){
				this.points[i].destiny.set(this.pos.x+opts.radius, this.pos.y);
			}
		} else {
			this.iDir = false;
		}
	};
	Shape.prototype.removePoint = function(){
		if(this.pointsA > opts.minPoints){
			this.pointsA--;
			var length = this.points.length,
					pA = this.pointsA;
			for(var i =0; i < pA; i++){
				var ang = pi2/pA*i;
				this.points[i].destiny.set(this.pos.x+Math.cos(ang)*opts.radius, this.pos.y+Math.sin(ang)*opts.radius);
			}
			for(var i = pA; i < length; i++){
				this.points[i].destiny.set(this.pos.x+opts.radius, this.pos.y);
			}
		} else {
			this.iDir = true;
		}
	};
	Shape.prototype.init = function(){
		for(var i = 0; i < opts.maxPoints; i++){
			var ang = pi2/opts.startAmount;
			this.points.push(new Point(this.pos.x+Math.cos(ang*i)*opts.radius,this.pos.y+Math.sin(ang*i)*opts.radius));
		};
	}
	Shape.prototype.render = function(){
		$.beginPath();
		$.moveTo(this.pos.x + this.radius, this.pos.y);
		for(var i = 0; i < this.points.length; i++){
			$.lineTo(this.points[i].pos.x, this.points[i].pos.y);
		}
		
		var gradient = $.createLinearGradient(w/2+opts.radius, h/2+opts.radius, w/2-opts.radius, h/2-opts.radius);
		for(var i = 0; i < this.points.length; i++){
			var length = this.points.length;
			var ang = (pi2/length)*i*180/pi;
			gradient.addColorStop(i/length, "hsl("+ang+", 50%, 50%)");
		}
		$.closePath();
		$.strokeStyle = gradient;
		$.lineWidth = opts.lineWidth;
		$.lineJoin = opts.joinStyle;
		$.stroke();
	}
	 
	Point.prototype.update = function(){
		this.attractTo(this.destiny);
		this.speed.add(this.acc);
		this.pos.add(this.speed);
		this.acc.set(0);
		this.gonnaGetRemoved && this.pos.distanceTo({x: opts.radius+w/2, y:h/2}) < 1 ? shape.points.pop() : undefined;
		return this;
	}
	Point.prototype.attractTo = function(target){
		var tar = target.copy();
		var distance = this.pos.distanceTo(target);
		tar.sub(this.pos);
		tar.limit(distance/2);
		
		var des = tar.sub(this.speed);
		des.limit(2);
		this.acc.add(tar);
	}
	function setup(){
		createCanvas();
		addListeners();
		shape = new Shape(w/2, h/2);
		gui = new dat.GUI();
		gui.close();
		gui.add(opts,"addSpeed", 0, 60, 1);
		gui.add(opts,"lineWidth",0.5, 50,1,0.5);
		gui.add(opts,"joinStyle",["round", "bevel", "miter"]);
		document.body.appendChild(stats.domElement);
		window.requestAnimationFrame(loop);
	}
	function loop(){
		stats.begin();
		drawBg();
		
		tick++;
		tick%opts.addSpeed==0?(shape.iDir?shape.addPoint():shape.removePoint()):undefined
		shape.update().render();
		
		opts.showFPS ? stats.domElement.style["display"] = "block" : stats.domElement.style["display"] = "none";
		window.requestAnimationFrame(loop);
		stats.end();
	}
	function createCanvas() {
		var el = document.createElement("canvas"),
				ctx = el.getContext("2d");
		for (var style in canvasStyles) {
			el.style[style] = canvasStyles[style];
		}
		document.body.appendChild(el);
		canvasBody = el;
		$ = ctx;
		canvasBody.width = w;
		canvasBody.height = h;
		document.body.style["overflow"] = "hidden"
		return [el, ctx];
	}
	function drawBg() {
		$.fillStyle = opts.bgc;
		$.fillRect(0, 0, w, h);
	}
	
	function addListeners(){
		window.addEventListener("resize", resize);
		window.addEventListener("mousemove", mouseMove);
		canvasBody.addEventListener("mousedown", mouseDown);
		canvasBody.addEventListener("mouseup", mouseUp);
		canvasBody.addEventListener("touchmove", touchMove);
		canvasBody.addEventListener("touchstart", touchStart);
		canvasBody.addEventListener("touchend", touchEnd);
	}
	function resize(){
		w = canvasBody.width = window.innerWidth;
		h = canvasBody.height = window.innerHeight;
	}
	function mouseDown(event){
		mousePressed = true;
		Mouse.set(event.pageX, event.pageY);
	}
	function mouseUp(event){
		mousePressed = false;
	}
	function mouseMove(event){
		Mouse.set(event.pageX, event.pageY);
	}
	function touchMove(event){
		var touches = event.changedTouches;
		Mouse.set(touches[0].pageX, touches[0].pageY);
	}
	function touchStart(event){
		e.preventDefault();
		mousePressed = true;
		touchMove(event);
	}
	function touchEnd(event){
		mousePressed = false;
	}
	setup();
})()
