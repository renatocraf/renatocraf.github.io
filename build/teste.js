import * as 
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
camera.position.set(-5, 10, 30);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
var canvas = renderer.domElement;
document.body.appendChild(canvas);

//var controls = new THREE.OrbitControls(camera, renderer.domElement);

scene.add(new THREE.GridHelper(20, 40));
/*
var curve = new THREE.CubicBezierCurve3(
	new THREE.Vector3( -10, 0, 0 ),
	new THREE.Vector3( -5, 15, 2 ),
	new THREE.Vector3( 20, 15, 3 ),
	new THREE.Vector3( 10, 0, 0 )
);

var points = curve.getPoints( 50 );*/
var points = [
  
];

vet0 = new THREE.Vector3( -10, 0, 10 );
vet1 = new THREE.Vector3( -5, 15, 10 );
vet2 = new THREE.Vector3( 20, 15, -5 );
vet3 = new THREE.Vector3( -10, 0, -10 );


let i = 0;
while(i <= 1) {

  var newvet = new THREE.Vector3( 0, 0, 0 );

  var cordx0 = (vet0.getComponent(0))*(Math.pow(1-i, 3));
  var cordy0 = (vet0.getComponent(1))*(Math.pow(1-i, 3));
  var cordz0 = (vet0.getComponent(2))*(Math.pow(1-i, 3));
  var newvet0 = new THREE.Vector3( cordx0, cordy0, cordz0 );

  var cordx1 = (vet1.getComponent(0))*(3*i*(Math.pow(1-i, 2)));
  var cordy1 = (vet1.getComponent(1))*(3*i*(Math.pow(1-i, 2)));
  var cordz1 = (vet1.getComponent(2))*(3*i*(Math.pow(1-i, 2)));
  var newvet1 = new THREE.Vector3( cordx1, cordy1, cordz1 );

  var cordx2 = (vet2.getComponent(0))*(3*i*i*(1-i));
  var cordy2 = (vet2.getComponent(1))*(3*i*i*(1-i));
  var cordz2 = (vet2.getComponent(2))*(3*i*i*(1-i));
  var newvet2 = new THREE.Vector3( cordx2, cordy2, cordz2 );
  
  var cordx3 = (vet3.getComponent(0))*(Math.pow(1-i, 3));
  var cordy3 = (vet3.getComponent(1))*(Math.pow(1-i, 3));
  var cordz3 = (vet3.getComponent(2))*(Math.pow(1-i, 3));
  var newvet3 = new THREE.Vector3( cordx3, cordy3, cordz3 );
  
  newvet = newvet.add(newvet0);
  newvet = newvet.add(newvet1);
  newvet = newvet.add(newvet2);
  newvet = newvet.add(newvet3);
  if (i == 0) {
    console.log(newvet0);

  }
  if (i == 1) {
    console.log(newvet);

  }
  //console.log(newvet);
  points.push(newvet);
  i = i + 0.01;
  //console.log(i);

}
//console.log(points);

var veteste1 = new THREE.Vector3( 1, 1, 1 );
var veteste2 = new THREE.Vector3( 2, 2, 2 );
veteste1 = veteste1.add(veteste2);
//console.log(veteste1);

var geometry = new THREE.BufferGeometry().setFromPoints( points );

var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// Create the final object to add to the scene
var curveObject = new THREE.Line( geometry, material );
scene.add(curveObject);
console.log(geometry);
//Criando carrinho
/*
var object_Car = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1, 2, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);*/
var object_Car = makeCar();
object_Car.scale.set( 0.01, 0.01, 0.01 );
scene.add(object_Car);

//imagem fundo
var imagem = 'nuvens.jpg' 
scene.background = new THREE.TextureLoader().load(imagem);

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
  car.add(main);
  // add cabine
  var cabin = new THREE.Mesh(
    new THREE.BoxBufferGeometry(33, 24, 12),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  );
  cabin.position.x = -6;
  cabin.position.z = 25.5;
  car.add(cabin);
  return car;
}

//criando rodas
function makeWheel() {
  const geometry = new THREE.CylinderGeometry(6, 6, 5, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  var wheel = new THREE.Mesh(geometry, material);
  wheel.position.z = 6;
  return wheel;
}

var carPositionOnSpline = 0;

function update_Car() {
  object_Car.position.x = points[Math.trunc(time) % 100].getComponent(0);
  object_Car.position.y = points[Math.trunc(time) % 100].getComponent(1);
  object_Car.position.z = points[Math.trunc(time) % 100].getComponent(2);

  var next_point = new THREE.Vector3(points[(Math.trunc(time) % 100)+1].getComponent(0), points[(Math.trunc(time) % 100)+1].getComponent(1), points[(Math.trunc(time) % 100)+1].getComponent(2)); 
  object_Car.rotation.x = Math.PI / 2;
  console.log(next_point);
  console.log("testeeee");
  console.log(object_Car.position);
  object_Car.lookAt( next_point );

  if (camera_no_carrinho == 1) {
    camera.position.set(object_Car.position.x, object_Car.position.y, object_Car.position.z);
    camera.lookAt(next_point.getComponent(0), next_point.getComponent(1), next_point.getComponent(2));
    camera.updateProjectionMatrix();

  }
  //camera.position.set(object_Car.position.x, object_Car.position.y, object_Car.position.z);
  //camera.lookAt(next_point.getComponent(0), next_point.getComponent(1), next_point.getComponent(2));
  
  
}
 



// Ball
/*
const geo = new THREE.SphereGeometry(0.5, 20, 32); // (radius, widthSegments, heightSegments)
const material2 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const sphere = new THREE.Mesh(geo, material2);
scene.add(sphere);
*/



var clock = new THREE.Clock();
var time = 0;
//Carrinho
var speed = 5;

function update_ball() {
  sphere.position.x = points[Math.trunc(speed*time) % 100].getComponent(0);
  sphere.position.y = points[Math.trunc(speed*time) % 100].getComponent(1);
  sphere.position.z = points[Math.trunc(speed*time) % 100].getComponent(2);
}


//mudança camera 
var camera_no_carrinho = 0;
window.addEventListener("keydown", function (event) {
  if (event.key == "c") {
    camera_no_carrinho = 1;
                
    return;
  }
  
});

function mudar_camera() {
  camera.position.set(object_Car.position);
  camera.lookAt(new THREE.Vector3(points[(Math.trunc(time) % 100)+1].getComponent(0), points[(Math.trunc(time) % 100)+1].getComponent(1), points[(Math.trunc(time) % 100)+1].getComponent(2)));
  //camera.updateProjectionMatrix();
}


render();

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
  /*
  if (camera_no_carrinho == 1) {
    mudar_camera();
  }*/
  renderer.render(scene, camera);

  time += clock.getDelta();
  //console.log(time);
  //update_ball();
  update_Car();

  //curve.points[1].y = Math.sin(time) * 2.5;

  //geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));

  //curveObject.geometry.dispose();
  //curveObject.geometry = geometry;


  requestAnimationFrame(render);
}

#################################################################################################################


console.log("Script Loaded");
let scene, camera, renderer, canvas, controls;
let geometry, material, carro, points, tangent;
let clock,time;
let dirLight, spotLight;
let dirLightShadowMapViewer, spotLightShadowMapViewer;
let guia;
	
const state = {
	shadow: {
		blur: 3.5,
		darkness: 1,
		opacity: 1,
	},
	plane: {
		color: '#ffffff',
		opacity: 1,
	},
	showWireframe: false,
};

init();
animate();

function init(){
	console.log("Init");
	initMisc();
	console.log("Misc Loaded");
	initScene();
	
	//initShadowMapViewers()
	//initGUI();
}

function initGUI(){
	guia = new GUI();
				const shadowFolder = guia.addFolder( 'shadow' );
				shadowFolder.open();
				const planeFolder = guia.addFolder( 'plane' );
				planeFolder.open();

				/*
				shadowFolder.add( state.shadow, 'blur', 0, 15, 0.1 );
				shadowFolder.add( state.shadow, 'darkness', 1, 5, 0.1 ).onChange( function () {

					carro.userData.darkness.value = state.shadow.darkness;

				} );
				shadowFolder.add( state.shadow, 'opacity', 0, 1, 0.01 ).onChange( function () {

					ground.material.opacity = state.shadow.opacity;

				} );*/
				

				/*gui.add( state, 'showWireframe', true ).onChange( function () {

					if ( state.showWireframe ) {

						scene.add( cameraHelper );

					} else {

						scene.remove( cameraHelper );

					}

				} );*/
}

function initScene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
	camera.position.set(8, 13, 25);
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
	//tangent = [];
}

function grid(){

	scene.add(new THREE.GridHelper(100, 40));

}

function ground(){
	geometry = new THREE.BoxGeometry( 10, 0.15, 10 );
	material = new THREE.MeshPhongMaterial( {
		color: 0xa0adaf,
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
	 spotLight.shadow.camera.far = 150;
	 spotLight.shadow.mapSize.width = 1024;
	 spotLight.shadow.mapSize.height = 1024;
	 scene.add( spotLight );

	 scene.add( new THREE.CameraHelper( spotLight.shadow.camera ) );

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
	car.add(main);
	// add cabine
	var cabin = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(33, 24, 12),
	  new THREE.MeshBasicMaterial({ color: 0x0000ff })
	);
	cabin.position.x = -6;
	cabin.position.z = 25.5;
	car.add(cabin);
	car.scale.set( 0.05, 0.05, 0.05 );
	car.rotation.x = -Math.PI / 2;
	car.rotation.z = Math.PI / 2;
	var car2 = new THREE.Group();
	car2.add(car);	
	car2.castShadow = true;
	car2.receiveShadow = true;
	return car2;
  }

//criando rodas
function makeWheel() {
	const geometry = new THREE.CylinderGeometry(6, 6, 5, 32);
	const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
	var wheel = new THREE.Mesh(geometry, material);
	wheel.position.z = 6;
	return wheel;
  }

function update_car() {
	let speed = 150;
	let valor = Math.trunc(time*speed)%1000;
	carro.position.x = points[valor].getComponent(0);
	carro.position.y = points[valor].getComponent(1);
	carro.position.z = points[valor].getComponent(2);

	//let next_point = new THREE.Vector3(points[(Math.trunc(time) % 1000)+1].getComponent(0), points[(Math.trunc(time) % 1000)+1].getComponent(1), points[(Math.trunc(time) % 1000)+1].getComponent(2)); 
	//carro.rotation=( tangent);
	//console.log(tangent[((Math.trunc(time)+1 )% 1000)][0]*Math.PI)
	//carro.rotation.x = tangent[((Math.trunc(time)+1 )% 1000)][0]*Math.PI;
	//carro.rotation.y = tangent[((Math.trunc(time)+1 )% 1000)][1]*Math.PI;
	//carro.rotation.z = tangent[((Math.trunc(time)+1 )% 1000)][2]*Math.PI;
}

function envmap(){
	//envmap
	const geo = new THREE.SphereGeometry( 500, 60, 40 );
	// invert the geometry on the x-axis so that all of the faces point inward
	geo.scale( - 1, 1, 1 );

	const texture = new THREE.TextureLoader().load( 'img/img1.jpg' );
	const mat = new THREE.MeshBasicMaterial( { map: texture } );

	const mesh = new THREE.Mesh( geo, mat );

	scene.add( mesh );
}

function animate() {

	requestAnimationFrame( animate );
	render();
	time += clock.getDelta();
	update_car();

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