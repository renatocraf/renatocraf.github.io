
console.log("Script Loaded");
let scene, camera, renderer, canvas, controls;
let geometry, material, carro, points, tangent;
let clock,time;
let dirLight, spotLight,camerahelpshadow;
let dirLightShadowMapViewer, spotLightShadowMapViewer;
let guia;
let valor, speed;
let camera_ref;
	
const state = {
	shadow: {
		x: 20,
		y: 100,
		z: 50,
		showShadowHelperLines: false
	},
	plane: {
		color: '#ffffff',
		opacity: 1,
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
			camera.position.set(50, 50, 0);
			camera.lookAt(0,30,0);
		  }      
		  else{
			camera_ref = 1;
		  }      
		  return;
		}
		if (event.key == "d") {
			if(camera_ref == 2){
				camera_ref = 0;
				camera.position.set(50, 50, 0);
				camera.lookAt(0,30,0);
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
	  })
	
}

function initScene() {
	scene = new THREE.Scene();
	let worldAxis = new THREE.AxesHelper(100);
	worldAxis.visible = false;
	scene.add(worldAxis);
	camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
	camera.position.set(50, 50, 0);
	camera.lookAt(0,30,0);
	renderer = new THREE.WebGLRenderer({
	antialias: true
	});
	renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
	canvas = renderer.domElement;
	document.body.appendChild(canvas);

	//scene.add( new THREE.AmbientLight( 0x404040 ) );
	//grid();
	rollercoaster();
	car1();
	envmap();
	ground();
	lights();

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
	geometry = new THREE.BoxGeometry( 10, 0.15, 10 );
	material = new THREE.MeshPhongMaterial( {
		color: 0x42e8eb,//a0adaf,
		shininess: 150,
		specular: 0x111111
	} );

	const ground = new THREE.Mesh( geometry, material );
	ground.scale.multiplyScalar( 10 );
	ground.position.set( -10, -1, -5 );
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
		/*
	var curve = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -10, 0, 0 ),
		new THREE.Vector3( -5, 15, 2 ),
		new THREE.Vector3( 20, 15, 3 ),
		new THREE.Vector3( 10, 0, 0 )
	);

	var points = curve.getPoints( 50 );*/
	
	
	const c1 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 5, 15 ),
		new THREE.Vector3( 0, 5, 5 ),
		new THREE.Vector3( 0, 20, 5 ),
		new THREE.Vector3( 0, 20, 0 )
	);

	//points.add(curve1.getPoint(100));
	var p1 = c1.getPoints(100);		
	
	const c2 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 20, 0 ),
		new THREE.Vector3( 0, 20, -5 ),
		new THREE.Vector3( 0, 7.5, -5 ),
		new THREE.Vector3( 0, 7.5, -10)
	);
	const p2 = c2.getPoints(100);
	let t2 = c2.getTangent(100);
	points = p1.concat(p2);

	const c3 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 7.5, -10 ),
		new THREE.Vector3( 0, 7.5, -12.5 ),
		new THREE.Vector3( 0, 11, -12.5 ),
		new THREE.Vector3( 0, 11, -15)
	);
	const p3 = c3.getPoints(100);
	let t3 = c3.getTangent(100);
	points = points.concat(p3);

	const c4 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 11, -15),
		new THREE.Vector3( 0, 11, -17.5),
		new THREE.Vector3( 0, 7.5, -17.5 ),
		new THREE.Vector3( 0, 7.5, -20)
	);
	const p4 = c4.getPoints(100);
	let t4 = c4.getTangent(100);
	points = points.concat(p4);

	const c5 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 7.5, -20),
		new THREE.Vector3( 0, 7.5, -22.5),
		new THREE.Vector3( 0, 10, -25 ),
		new THREE.Vector3( -3, 12.5, -27.5)
	);
	const p5 = c5.getPoints(100);
	let t5 = c5.getTangent(100);
	points = points.concat(p5);	

	const c6 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -3, 12.5, -27.5),
		new THREE.Vector3( -6, 15, -30),
		new THREE.Vector3( -16, 15, -30 ),
		new THREE.Vector3( -19, 12.5, -27.5)
	);
	const p6 = c6.getPoints(100);
	let t6 = c6.getTangent(100);
	points = points.concat(p6);

	const c7 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -19, 12.5, -27.5),
		new THREE.Vector3( -22, 10, -25),
		new THREE.Vector3( -22, 7.5, -17.5 ),
		new THREE.Vector3( -22, 7.5, -12.5)
	);
	const p7 = c7.getPoints(100);
	let t7 = c7.getTangent(100);
	points = points.concat(p7);

	const c8 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -22, 7.5, -12.5),
		new THREE.Vector3( -22, 7.5, -7.5),
		new THREE.Vector3( -22, 12.5, -5 ),
		new THREE.Vector3( -22, 12.5, -2.5)
	);
	const p8 = c8.getPoints(100);
	let t8 = c8.getTangent(100);
	points = points.concat(p8);

	const c9 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -22, 12.5, -2.5),
		new THREE.Vector3( -22, 12.5, 0),
		new THREE.Vector3( -22, 7.5, 2.5 ),
		new THREE.Vector3( -22, 7.5, 10)
	);
	const p9 = c9.getPoints(100);
	let t9 = c9.getTangent(100);
	points = points.concat(p9);

	const c10 = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -22, 7.5, 10),
		new THREE.Vector3( -22, 7.5, 17.5),
		new THREE.Vector3( 0, 5, 25 ),
		new THREE.Vector3( 0, 5, 15)
	);
	const p10 = c10.getPoints(100);
	let t10 = c10.getTangent(100);
	points = points.concat(p10);

	tangent = [];
	tangente(c1);
	tangente(c2);
	tangente(c3);
	tangente(c4);
	tangente(c5);
	tangente(c6);
	tangente(c7);
	tangente(c8);
	tangente(c9);
	tangente(c10);

	console.log(tangent);
	console.log(points);
	geometry = new THREE.BufferGeometry().setFromPoints( points );

	material = new THREE.LineBasicMaterial( { 
		color : 0xff0000,
		linewidth: 100 
	
	} );

	// Create the final object to add to the scene
	const curveObject = new THREE.Line( geometry, material );
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
	 spotLight.position.set( 20, 100, 50 );
	 spotLight.castShadow = true;
	 spotLight.shadow.camera.near = 8;
	 spotLight.shadow.camera.far = 300;
	 spotLight.shadow.mapSize.width = 1024;
	 spotLight.shadow.mapSize.height = 1024;
	 scene.add( spotLight );
	 camerahelpshadow =new THREE.CameraHelper( spotLight.shadow.camera )
	 camerahelpshadow.visible = false;
	 scene.add( camerahelpshadow );
		
	 dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	 dirLight.name = 'Dir. Light';
	 dirLight.position.set( 20, 50, 20 );
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
	positions = [[-18, 18], [-18, -18], [18, 18], [18, -18]];
	for (var i = 0; i < positions.length; i++) {
	  x = positions[i][0]
	  y = positions[i][1]
	  m = wheel.clone()
	  m.position.x = x
	  m.position.y = y
	  car.add(m)
	}
	//add parte principal
	var main = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(60, 30, 15),
	  new THREE.MeshBasicMaterial({ color: 0xff0000 })
	);
	main.position.z = 12;
	main.castShadow = true;
	main.receiveShadow = true;
	car.add(main);
	// add cabine
	var cabin = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(33, 24, 12),
	  new THREE.MeshBasicMaterial({ color: 0x0000ff })
	);
	cabin.position.x = -6;
	cabin.position.z = 25.5;
	cabin.castShadow = true;
	cabin.receiveShadow = true;
	car.add(cabin);
	car.scale.set( 0.05, 0.05, 0.05 );
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
	const geometry = new THREE.CylinderGeometry(6, 6, 5, 32);
	const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
	var wheel = new THREE.Mesh(geometry, material);
	wheel.position.z = 6;
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
		camera.position.set(carro.position.x, carro.position.y, carro.position.z);
		camera.lookAt(points[valor+1].x, points[valor+1].y, points[valor+1].z);
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

function envmap(){
	//envmap
	const geo = new THREE.SphereGeometry( 500, 60, 40 );
	// invert the geometry on the x-axis so that all of the faces point inward
	geo.scale( - 1, 1, 1 );

	const texture = new THREE.TextureLoader().load( "./img/img1.jpg" );
	const mat = new THREE.MeshBasicMaterial( { map: texture } );

	const mesh = new THREE.Mesh( geo, mat );

	scene.add( mesh );
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