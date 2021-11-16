
console.log("Script Loaded");
let scene, camera, renderer, canvas, controls;
let geometry, material, carro, points, tangent;
let clock,time;
let dirLight, spotLight,camerahelpshadow;
let dirLightShadowMapViewer, spotLightShadowMapViewer;
let guia;
let valor, speed;
let camera_ref;
let ambmap;
	
const state = {
	shadow: {
		x: 20,
		y: 100,
		z: 50,
		showShadowHelperLines: false
	},
	car: {
		color: '#ffffff',
		opacity: 1,
		speed:100
	},
	cameraType:0
	
};

init();
animate();

function init(){
	initScene();
	initMisc();	
	//initShadowMapViewers()
	initGUI();
	

	
	window.addEventListener("keydown", function (event) {
		if (event.key == "c") {
		  if(camera_ref == 1){
			camera_ref = 0;
			camera.position.set(130, 150, 0);
			camera.lookAt(0,100,0);
		  }      
		  else{
			camera_ref = 1;
		  }      
		  return;
		}
		if (event.key == "d") {
			if(camera_ref == 2){
				camera_ref = 0;
				camera.position.set(130,150,0);
				camera.lookAt(0,100,0);
			}      
			else{
				camera_ref = 2;
			}      
			return;
		  }

	});

}

function initGUI(){
	import('../build/dat.gui.module.js').then(({ GUI }) => {
		console.log("oi")
		guia = new GUI();
				const shadowFolder = guia.addFolder( 'shadowPosition' );
				shadowFolder.open();
				const cameraFolder = guia.addFolder( 'cameraType' );
				cameraFolder.open();
				const carFolder = guia.addFolder( 'car' );
				carFolder.open();
				
				shadowFolder.add( state.shadow, 'x', -100, 100, 2 ).onChange( function () {
					spotLight.position.x = state.shadow.x
				} );
				shadowFolder.add( state.shadow, 'y', 0, 200, 2 ).onChange( function () {
					
					spotLight.position.y = state.shadow.y

				} );
				shadowFolder.add( state.shadow, 'z', -100, 200, 2 ).onChange( function () {
					spotLight.position.z = state.shadow.z
				} );				
				
				shadowFolder.add( state.shadow, 'showShadowHelperLines', false ).onChange( function () {
					if ( state.shadow.showShadowHelperLines ) {
						camerahelpshadow.visible = true;
					} else {
						camerahelpshadow.visible = false;
					}
				} );

				cameraFolder.add( state, 'cameraType', 0, 2, 1 ).onChange( function () {
					if(state.cameraType == 0){
						camera_ref = 0;
						camera.position.set(50, 50, 0);
						camera.lookAt(0,30,0);
					  }      
					  else{
						if(state.cameraType == 1)camera_ref = 1;
						else{
							camera_ref = 2;
							camera.position.set(carro.position.x+20, carro.position.y+10, carro.position.z);
							camera.lookAt(carro.position);
							camera.updateProjectionMatrix();
						}
					  }			
				} );

				carFolder.add( state.car, 'speed', 0, 200, 2 ).onChange( function () {
					speed = state.car.speed
				} );



	  })
	
}

function initScene() {
	scene = new THREE.Scene();
	let worldAxis = new THREE.AxesHelper(100);
	worldAxis.visible = false;
	scene.add(worldAxis);
	camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
	camera.position.set(130,150,0);
	camera.lookAt(0,100,0);
	renderer = new THREE.WebGLRenderer({
	antialias: true
	});
	renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
	canvas = renderer.domElement;
	document.body.appendChild(canvas);

	scene.add( new THREE.AmbientLight( 0x404040 ) );
	//grid();
	envirmap();
	rollercoaster();
	car1();	
	ground();
	lights();

	/*var main2 = new THREE.BoxBufferGeometry(60, 30, 15);
	var geo2 = new THREE.MeshLambertMaterial( { envMap: ambmap } );
	var main = new THREE.Mesh( geo2,main2 );

	scene.add(main);*/

	

}

function initMisc(){
	
	clock = new THREE.Clock();
	time = 0;
	controls = new THREE.OrbitControls(camera, renderer.domElement);	
	camera_ref=0;
	speed = 100;
	camera_ref=0;
	
}

function grid(){

	scene.add(new THREE.GridHelper(100, 40));

}

function ground(){
	geometry = new THREE.BoxGeometry( 400, 0.15, 400 );
	material = new THREE.MeshPhongMaterial( {
		color: 0x42e8eb,//a0adaf,
		shininess: 150,
		specular: 0x111111,
		opacity: 0.5,
		  transparent: true
	} );

	const ground = new THREE.Mesh( geometry, material );
	//ground.scale.multiplyScalar( 10 );
	ground.position.set( -50, -1, -50 );
	ground.castShadow = false;
	ground.receiveShadow = true;
	scene.add( ground );
}

function tangente(c1){
	let t1;
	let i=0;
	for(i = 1; i <= 100; i++){
		t1 = c1.getTangent(i/100);
		tangent = tangent.concat(t1);
	}
}

function rollercoaster(){
	console.log("rollercoaster");

	const c1 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 20, 75 ),
		new THREE.Vector3( 0, 20, 25 ),
		new THREE.Vector3( 0, 100, 25 ),
		new THREE.Vector3( 0, 100, 0 )
	);

	//points.add(curve1.getPoint(100));
	var p1 = c1.getPoints(100);		
	
	const c2 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 100, 0 ),
		new THREE.Vector3( 0, 100, -25 ),
		new THREE.Vector3( 0, 37.5, -25 ),
		new THREE.Vector3( 0, 37.5, -50)
	);
	const p2 = c2.getPoints(100);
	points = p1.concat(p2);

	const c3 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 37.5, -50 ),
		new THREE.Vector3( 0, 37.5, -75 ),
		new THREE.Vector3( 0, 55, -75 ),
		new THREE.Vector3( 0, 55, -87.5)
	);
	const p3 = c3.getPoints(100);
	points = points.concat(p3);

	const c4 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 55, -87.5),
		new THREE.Vector3( 0, 55, -100),
		new THREE.Vector3( 0, 37.5, -100 ),
		new THREE.Vector3( 0, 37.5, -112.5)
	);
	const p4 = c4.getPoints(100);
	points = points.concat(p4);

	const c5 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 37.5, -112.5),
		new THREE.Vector3( 0, 37.5, -125),
		new THREE.Vector3( 0, 50, -137.5 ),
		new THREE.Vector3( -15, 62.5, -150)
	);
	const p5 = c5.getPoints(100);
	points = points.concat(p5);	

	const c6 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -15, 62.5, -150),
		new THREE.Vector3( -30, 75, -162.5),
		new THREE.Vector3( -80, 75, -162.5 ),
		new THREE.Vector3( -95, 62.5, -150)
	);
	const p6 = c6.getPoints(100);
	points = points.concat(p6);

	const c7 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -95, 62.5, -150),
		new THREE.Vector3( -110, 50, -137.5),
		new THREE.Vector3( -110, 37.5, -100 ),
		new THREE.Vector3( -110, 37.5, -75)
	);
	const p7 = c7.getPoints(100);
	points = points.concat(p7);

	const c8 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -110, 37.5, -75),
		new THREE.Vector3( -110, 37.5, -50),
		new THREE.Vector3( -110, 62.5, -37.5),
		new THREE.Vector3( -110, 62.5, -25)
	);
	const p8 = c8.getPoints(100);
	points = points.concat(p8);

	const c9 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -110, 62.5, -25),
		new THREE.Vector3( -110, 62.5, -12.5),
		new THREE.Vector3( -110, 37.5, 0 ),
		new THREE.Vector3( -110, 37.5, 37.5)
	);
	const p9 = c9.getPoints(100);
	points = points.concat(p9);

	const c10 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -110, 37.5, 37.5),
		new THREE.Vector3( -110, 37.5, 75),
		new THREE.Vector3( 0, 20, 125 ),
		new THREE.Vector3( 0, 20, 75)
	);
	const p10 = c10.getPoints(100);
	points = points.concat(p10);

	//draw feets
	var feet_material = new THREE.LineDashedMaterial( {
		color: 0x000000,
		linewidth: 20,
		scale: 5,
		dashSize: 3,
		gapSize: 3,
	} );

	for (let i = 0; i < 1000; i = i + 20) {
		cordenada_x = points[i].getComponent(0);
		cordenada_y = points[i].getComponent(1);
		cordenada_z = points[i].getComponent(2);
		var feet_geometry = new THREE.BoxBufferGeometry(1, cordenada_y, 1);
		var newfeet = new THREE.Mesh( feet_geometry, feet_material );
		newfeet.position.x = cordenada_x;
		newfeet.position.y = cordenada_y/2;
		newfeet.position.z = cordenada_z;
		newfeet.scale.set( 0.5, 1, 0.5 );
		newfeet.castShadow = true;
		newfeet.receiveShadow = true;
		scene.add(newfeet);
	}

	//

	geometry = new THREE.BufferGeometry().setFromPoints( points );
	console.log(geometry);
	/*
	material = new THREE.LineBasicMaterial( { 
		color : 0xff0000,
		linewidth: 100 
	
	} );*/
	var tubeGeometry = new THREE.TubeGeometry(
		new THREE.CatmullRomCurve3(points),
		1001,// path segments
		0.5,// THICKNESS
		8, //Roundness of Tube
		false //closed
	  );

	var material = new THREE.LineDashedMaterial( {
		color: 0xff9900,
		linewidth: 20,
		scale: 5,
		dashSize: 3,
		gapSize: 3,
	} );
	//TESTE
	/*
	var radius = .2;
    var segments = 6;

	var circleGeometry = new THREE.CircleGeometry(radius, segments);

	var extrudeSettings = {
		steps: 1000,
		bevelEnabled: false,
		extrudePath: geometry
	};
	
	var shape = new THREE.Shape(circleGeometry.vertices);

	var track_geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

	var track_material = new THREE.MeshLambertMaterial({
		color: 0xb00000,
		wireframe: false
	});

	var curveObject = new THREE.Mesh(track_geometry, track_material);
	*/

	// Create the final object to add to the scene
	const curveObject = new THREE.Line( tubeGeometry, material );
	curveObject.castShadow = true;
	curveObject.receiveShadow = true;	
	scene.add(curveObject);
}

function lights(){
	 // Lights

	 spotLight = new THREE.SpotLight( 0xffffff );
	 spotLight.name = 'Spot Light';
	 spotLight.angle = Math.PI / 5;
	 spotLight.penumbra = 0.3;
	 spotLight.position.set( 150, 250, 20 );
	 spotLight.castShadow = true;
	 spotLight.shadow.camera.near = 8;
	 spotLight.shadow.camera.far = 700;
	 spotLight.shadow.mapSize.width = 1024;
	 spotLight.shadow.mapSize.height = 1024;
	 scene.add( spotLight );
	 camerahelpshadow =new THREE.CameraHelper( spotLight.shadow.camera )
	 camerahelpshadow.visible = false;
	 scene.add( camerahelpshadow );
		
	 dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	 dirLight.name = 'Dir. Light';
	 dirLight.position.set( 200, 500, 200 );
	 dirLight.castShadow = true;
	 dirLight.shadow.camera.near = 1;
	 dirLight.shadow.camera.far = 100;
	 dirLight.shadow.camera.right = 15;
	 dirLight.shadow.camera.left = - 10;
	 dirLight.shadow.camera.top	= 15;
	 dirLight.shadow.camera.bottom = - 15;
	 dirLight.shadow.mapSize.width = 2048;
	 dirLight.shadow.mapSize.height = 2048;
	 //scene.add( dirLight );
	 //scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

}

function initShadowMapViewers() {

	dirLightShadowMapViewer = new ShadowMapViewer( dirLight );
	spotLightShadowMapViewer = new ShadowMapViewer( spotLight );
	resizeShadowMapViewers();
	}

function resizeShadowMapViewers() {

	const size = window.innerWidth * 0.15;

	dirLightShadowMapViewer.position.x = 10;
	dirLightShadowMapViewer.position.y = 10;
	dirLightShadowMapViewer.size.width = size;
	dirLightShadowMapViewer.size.height = size;
	dirLightShadowMapViewer.update(); //Required when setting position or size directly

	spotLightShadowMapViewer.size.set( size, size );
	spotLightShadowMapViewer.position.set( size + 20, 10 );
	// spotLightShadowMapViewer.update();	//NOT required because .set updates automatically

}

function car1(){
	// Ball
	/*geometry = new THREE.SphereGeometry(2, 20, 32); // (radius, widthSegments, heightSegments)
	material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	carro = new THREE.Mesh(geometry, material);*/
	carro = makeCar();
	carro.castShadow = true;
	carro.receiveShadow = true;
	scene.add(carro);

	

}

function makeCar() {
	var car = new THREE.Group();
	//add rodas
	var wheel = makeWheel();
	//positions = [[-18, 18], [-18, -18], [18, 18], [18, -18]];
	positions = [[0,0]];
	for (var i = 0; i < positions.length; i++) {
	  x = positions[i][0]
	  y = positions[i][1]
	  m = wheel.clone()
	  m.position.x = x
	  m.position.y = y
	  car.add(m)
	}

	const geometry = new THREE.BoxBufferGeometry(60, 30, 15);
	mainMaterial = new THREE.MeshLambertMaterial( { 
		//color:0xff0000,
		envMap: ambmap,
		metalness: 0.5,
		roughness: 0.5 
	} );
	/*new THREE.MeshStandardMaterial( {
		metalness: params.roughness,
		roughness: params.metalness,
		envMapIntensity: 1.0
	} );*/
	mainMesh = new THREE.Mesh( geometry, mainMaterial );
	mainMesh.position.z = 12;
	mainMesh.castShadow = true;
	mainMesh.receiveShadow = true;
	car.add( mainMesh );


	//add parte principal
	/*var main = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(60, 30, 15),
	  new THREE.MeshStandardMaterial( {
		color: 0xff0000,
		metalness: 1,   // between 0 and 1
		//roughness: 0.5, // between 0 and 1
		envMap: ambmap
	} )
		new THREE.MeshPhongMaterial( {
			color: 0xff0000,
			shininess: 150,
			specular: 0x222222,
			envmap: ambmap
		} )
	);*/
	
/*
	main.position.z = 12;
	main.castShadow = true;
	main.receiveShadow = true;*/
	//car.add(main);
	// add cabine
	var glass = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(3, 24, 16),
	  new THREE.MeshBasicMaterial({ 
		  color: 0x0000ff,
		  opacity: 0.8,
		  transparent: true

		})
	);
	glass.position.x = 20;
	glass.position.z = 23.5;
	glass.rotation.y = -Math.PI / 4;
	glass.castShadow = true;
	glass.receiveShadow = true;
	car.add(glass);

	var cabin = new THREE.Mesh(
		new THREE.BoxBufferGeometry(1, 24, 45),
		new THREE.MeshBasicMaterial({ 
			color: 0x000000  
		  })
	  );
	  cabin.position.x = -1;
	  cabin.position.z = 19.5;
	  cabin.rotation.y = -Math.PI / 2;
	  cabin.castShadow = true;
	  cabin.receiveShadow = true;
	  car.add(cabin);

	car.scale.set( 0.1, 0.1, 0.1 );
	//car.scale.set( 1, 1, 1 );
	car.rotation.x = -Math.PI / 2;
	car.rotation.z = -Math.PI / 2;
	var car2 = new THREE.Group();
	car2.add(car);	
	car2.castShadow = true;
	car2.receiveShadow = true;
	var axes = new THREE.AxesHelper( 5 );
	//car2 = car2.add(axes);
	return car2;
  }

//criando rodas
function makeWheel() {
	const geometry = new THREE.CylinderGeometry(6, 6, 40, 32);
	const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
	var cabin = new THREE.Mesh(
		new THREE.BoxGeometry(12, 40, 6),
		new THREE.MeshBasicMaterial({ 
			color: 0x000000 
		  })
	  );
	  cabin.position.z= 3;
	var wheel = new THREE.Mesh(geometry, material);
	wheel.add(cabin);
	//wheel.position.z = 6;
	wheel.rotation.z = Math.PI / 2;
	wheel.castShadow = true;
	wheel.receiveShadow = true;
	return wheel;
  }

function update_car() {
	valor = Math.trunc(time*speed)%1000;
	carro.position.x = points[valor].getComponent(0);
	carro.position.y = points[valor].getComponent(1);
	carro.position.z = points[valor].getComponent(2);

	carro.lookAt(points[valor+1]);

	//camera_no_carrinho = 1;
	if (camera_ref == 1) {
		camera.position.set(points[valor+8].x, points[valor+8].y+2, points[valor+8].z);
		camera.lookAt(points[valor+11].x, points[valor+11].y+2, points[valor+11].z);
		camera.updateProjectionMatrix();
	
	}
	if (camera_ref == 2) {
		camera.position.set(carro.position.x+20, carro.position.y+10, carro.position.z);
		camera.lookAt(carro.position);
		camera.updateProjectionMatrix();

	}

	/*let oldDir = new THREE.Vector3();
    let newDir = new THREE.Vector3();

	
	carro.getWorldDirection(oldDir);
	
    newDir.subVectors(points[valor+1], carro.position).normalize();
	//console.log(newDir);
    const theta = Math.acos(newDir.dot(oldDir));

    const axis = new THREE.Vector3().crossVectors(oldDir, newDir).normalize();

    carro.rotateOnWorldAxis(axis, theta);*/

}

function envirmap(){
	//envmap
	const geo = new THREE.SphereGeometry( 500, 60, 40 );
	// invert the geometry on the x-axis so that all of the faces point inward
	geo.scale( - 1, 1, 1 );

	ambmap = new THREE.TextureLoader().load( "./img/img1.jpg" );
	ambmap.mapping = THREE.EquirectangularReflectionMapping;
	ambmap.encoding = THREE.sRGBEncoding;
	const mat = new THREE.MeshBasicMaterial( { map: ambmap } );

	const mesh = new THREE.Mesh( geo, mat );

	//scene.add( mesh );
	scene.background = ambmap;

}

function animate() {

	requestAnimationFrame( animate );
	render();
	time += clock.getDelta();
	update_car();
	update_camera();

}

function resize(renderer) {
  const canvas = renderer.domElement;
  const width = window.innerWidth/2;
  const height = window.innerHeight/1.5;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function render() {
  if (resize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
  //console.log(time);

  //curve.points[1].y = Math.sin(time) * 2.5;

  //geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));

  //curveObject.geometry.dispose();
  //curveObject.geometry = geometry;
}