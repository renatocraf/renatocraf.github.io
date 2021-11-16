
console.log("Script Loaded");
let scene, camera, renderer, canvas, controls;
let geometry, material, carro, points;
let clock, time;
let dirLight, spotLight, camerahelpshadow;
let dirLightShadowMapViewer, spotLightShadowMapViewer;
let guia;
let valor, speed;
let camera_ref;
let ambmap;
let gridHelper;

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
		speed: 100
	},
	cameraType: 0,
	gridHelper: false
};

const initial_cam_position = {
	x: 130,
	y: 150,
	z: 20
}

const initial_cam_lookat = {
	x: 0,
	y: 100,
	z: -100
}

init();
animate();

function init() {
	initScene();
	initMisc();
	initGUI();
}

function initGUI() {
	import('../build/dat.gui.module.js').then(({ GUI }) => {
		console.log("oi")
		guia = new GUI();
		const shadowFolder = guia.addFolder('shadowPosition');
		shadowFolder.open();
		const cameraFolder = guia.addFolder('cameraType');
		cameraFolder.open();
		const carFolder = guia.addFolder('car');
		carFolder.open();

		shadowFolder.add(state.shadow, 'x', -1000, 1000, 10).onChange(function () {
			spotLight.position.x = state.shadow.x
		});
		shadowFolder.add(state.shadow, 'y', 100, 600, 2).onChange(function () {

			spotLight.position.y = state.shadow.y

		});
		shadowFolder.add(state.shadow, 'z', -1000, 1000, 2).onChange(function () {
			spotLight.position.z = state.shadow.z
		});
		shadowFolder.add(state.shadow, 'showShadowHelperLines', false).onChange(function () {
			if (state.shadow.showShadowHelperLines) {
				camerahelpshadow.visible = true;
			} else {
				camerahelpshadow.visible = false;
			}
		});
		cameraFolder.add(state, 'cameraType', 0, 2, 1).onChange(function () {
			if (state.cameraType == 0) {
				camera_ref = 0;
				camera.position.set(initial_cam_position.x, initial_cam_position.y, initial_cam_position.z);
				camera.lookAt(initial_cam_lookat.x, initial_cam_lookat.y, initial_cam_lookat.z);
			}
			else {
				if (state.cameraType == 1) camera_ref = 1;
				else {
					camera_ref = 2;
					camera.position.set(carro.position.x + 20, carro.position.y + 10, carro.position.z);
					camera.lookAt(carro.position);
					camera.updateProjectionMatrix();
				}
			}
		});
		carFolder.add(state.car, 'speed', 0, 200, 2).onChange(function () {
			speed = state.car.speed
		});
		guia.add(state, 'gridHelper', false).onChange(function () {
			if (state.gridHelper) {
				gridHelper.visible = true;
			}
			else {
				gridHelper.visible = false;
			}
		});
	})

}

function initScene() {
	scene = new THREE.Scene();
	let worldAxis = new THREE.AxesHelper(100);
	worldAxis.visible = false;
	scene.add(worldAxis);
	camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	canvas = renderer.domElement;
	document.body.appendChild(canvas);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set(initial_cam_position.x, initial_cam_position.y, initial_cam_position.z);
	camera.lookAt(initial_cam_lookat.x, initial_cam_lookat.y, initial_cam_lookat.z);
	controls.update();

	scene.add(new THREE.AmbientLight(0x404040));
	grid();
	envirmap();
	rollercoaster();
	car1();
	ground();
	lights();
}

function initMisc() {

	clock = new THREE.Clock();
	time = 0;
	camera_ref = 0;
	speed = 100;
	camera_ref = 0;

	window.addEventListener("keydown", function (event) {
		if (event.key == "c") {
			if (camera_ref == 1) {
				camera_ref = 0;
				camera.position.set(initial_cam_position.x, initial_cam_position.y, initial_cam_position.z);
				camera.lookAt(initial_cam_lookat.x, initial_cam_lookat.y, initial_cam_lookat.z);
			}
			else {
				camera_ref = 1;
			}
			return;
		}
		if (event.key == "d") {
			if (camera_ref == 2) {
				camera_ref = 0;
				camera.position.set(initial_cam_position.x, initial_cam_position.y, initial_cam_position.z);
				camera.lookAt(initial_cam_lookat.x, initial_cam_lookat.y, initial_cam_lookat.z);
			}
			else {
				camera_ref = 2;
			}
			return;
		}

	});

}

function grid() {
	gridHelper = new THREE.GridHelper(1000, 50);
	scene.add(gridHelper);
	gridHelper.visible = false;
}

function ground() {
	geometry = new THREE.BoxGeometry(1000, 0.15, 1000);
	material = new THREE.MeshPhongMaterial({
		color: 0x42e8eb,
		shininess: 150,
		specular: 0x111111,
		opacity: 0.5,
		transparent: true
	});

	const ground = new THREE.Mesh(geometry, material);
	ground.position.set(-50, -1, -50);
	ground.castShadow = false;
	ground.receiveShadow = true;
	scene.add(ground);
}

function rollercoaster() {
	const c1 = new THREE.CubicBezierCurve3(
		new THREE.Vector3(0, 20, 75),
		new THREE.Vector3(0, 20, 25),
		new THREE.Vector3(0, 100, 25),
		new THREE.Vector3(0, 100, 0)
	);
	var p1 = c1.getPoints(100);

	const c2 = new THREE.CubicBezierCurve3(
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, -25),
		new THREE.Vector3(0, 37.5, -25),
		new THREE.Vector3(0, 37.5, -50)
	);
	const p2 = c2.getPoints(100);
	points = p1.concat(p2);

	const c3 = new THREE.CubicBezierCurve3(
		new THREE.Vector3(0, 37.5, -50),
		new THREE.Vector3(0, 37.5, -75),
		new THREE.Vector3(0, 55, -75),
		new THREE.Vector3(0, 55, -87.5)
	);
	const p3 = c3.getPoints(100);
	points = points.concat(p3);

	const c4 = new THREE.CubicBezierCurve3(
		new THREE.Vector3(0, 55, -87.5),
		new THREE.Vector3(0, 55, -100),
		new THREE.Vector3(0, 37.5, -100),
		new THREE.Vector3(0, 37.5, -112.5)
	);
	const p4 = c4.getPoints(100);
	points = points.concat(p4);

	const c5 = new THREE.CubicBezierCurve3(
		new THREE.Vector3(0, 37.5, -112.5),
		new THREE.Vector3(0, 37.5, -125),
		new THREE.Vector3(0, 50, -137.5),
		new THREE.Vector3(-15, 62.5, -150)
	);
	const p5 = c5.getPoints(100);
	points = points.concat(p5);

	const c6 = new THREE.CubicBezierCurve3(
		new THREE.Vector3(-15, 62.5, -150),
		new THREE.Vector3(-30, 75, -162.5),
		new THREE.Vector3(-80, 75, -162.5),
		new THREE.Vector3(-95, 62.5, -150)
	);
	const p6 = c6.getPoints(100);
	points = points.concat(p6);

	const c7 = new THREE.CubicBezierCurve3(
		new THREE.Vector3(-95, 62.5, -150),
		new THREE.Vector3(-110, 50, -137.5),
		new THREE.Vector3(-110, 37.5, -100),
		new THREE.Vector3(-110, 37.5, -75)
	);
	const p7 = c7.getPoints(100);
	points = points.concat(p7);

	const c8 = new THREE.CubicBezierCurve3(
		new THREE.Vector3(-110, 37.5, -75),
		new THREE.Vector3(-110, 37.5, -50),
		new THREE.Vector3(-110, 62.5, -37.5),
		new THREE.Vector3(-110, 62.5, -25)
	);
	const p8 = c8.getPoints(100);
	points = points.concat(p8);

	const c9 = new THREE.CubicBezierCurve3(
		new THREE.Vector3(-110, 62.5, -25),
		new THREE.Vector3(-110, 62.5, -12.5),
		new THREE.Vector3(-110, 37.5, 0),
		new THREE.Vector3(-110, 37.5, 37.5)
	);
	const p9 = c9.getPoints(100);
	points = points.concat(p9);

	const c10 = new THREE.CubicBezierCurve3(
		new THREE.Vector3(-110, 37.5, 37.5),
		new THREE.Vector3(-110, 37.5, 75),
		new THREE.Vector3(0, 20, 125),
		new THREE.Vector3(0, 20, 75)
	);
	const p10 = c10.getPoints(100);
	points = points.concat(p10);

	//draw feets
	var feet_material = new THREE.LineDashedMaterial({
		color: 0x000000,
		linewidth: 20,
		scale: 5,
		dashSize: 3,
		gapSize: 3,
	});

	for (let i = 0; i < 1000; i = i + 20) {
		cordenada_x = points[i].getComponent(0);
		cordenada_y = points[i].getComponent(1);
		cordenada_z = points[i].getComponent(2);
		var feet_geometry = new THREE.BoxBufferGeometry(1, cordenada_y, 1);
		var newfeet = new THREE.Mesh(feet_geometry, feet_material);
		newfeet.position.x = cordenada_x;
		newfeet.position.y = cordenada_y / 2;
		newfeet.position.z = cordenada_z;
		newfeet.scale.set(0.5, 1, 0.5);
		newfeet.castShadow = true;
		newfeet.receiveShadow = true;
		scene.add(newfeet);
	}

	//

	geometry = new THREE.BufferGeometry().setFromPoints(points);
	var tubeGeometry = new THREE.TubeGeometry(
		new THREE.CatmullRomCurve3(points),
		1001,// path segments
		0.5,// THICKNESS
		8, //Roundness of Tube
		false //closed
	);
	var material = new THREE.LineDashedMaterial({
		color: 0xff9900,
		linewidth: 20,
		scale: 5,
		dashSize: 3,
		gapSize: 3,
	});

	// Create the final object to add to the scene
	const curveObject = new THREE.Line(tubeGeometry, material);
	curveObject.castShadow = true;
	curveObject.receiveShadow = true;
	scene.add(curveObject);
}

function lights() {
	// Lights
	spotLight = new THREE.SpotLight(0xffffff);
	spotLight.name = 'Spot Light';
	spotLight.angle = Math.PI / 5;
	spotLight.penumbra = 0.3;
	spotLight.position.set(150, 500, 20);
	spotLight.castShadow = true;
	spotLight.shadow.camera.near = 8;
	spotLight.shadow.camera.far = 1000;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	scene.add(spotLight);
	camerahelpshadow = new THREE.CameraHelper(spotLight.shadow.camera)
	camerahelpshadow.visible = false;
	scene.add(camerahelpshadow);

}

function car1() {
	carro = makeCar();
	carro.castShadow = true;
	carro.receiveShadow = true;
	scene.add(carro);
}

function makeCar() {
	var car = new THREE.Group();
	var wheel = makeWheel();
	positions = [[0, 0]];
	for (var i = 0; i < positions.length; i++) {
		x = positions[i][0]
		y = positions[i][1]
		m = wheel.clone()
		m.position.x = x
		m.position.y = y
		car.add(m)
	}
	const geometry = new THREE.BoxBufferGeometry(60, 30, 15);
	mainMaterial = new THREE.MeshLambertMaterial({
		envMap: ambmap,
		metalness: 0.5,
		roughness: 0.5
	});
	mainMesh = new THREE.Mesh(geometry, mainMaterial);
	mainMesh.position.z = 12;
	mainMesh.castShadow = true;
	mainMesh.receiveShadow = true;
	car.add(mainMesh);
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


	//arrumando posicao e escala em relaçao a figura
	car.scale.set(0.1, 0.1, 0.1);
	car.rotation.x = -Math.PI / 2;
	car.rotation.z = -Math.PI / 2;

	var car2 = new THREE.Group();
	car2.add(car);
	car2.castShadow = true;
	car2.receiveShadow = true;
	var axes = new THREE.AxesHelper(5);
	//car2 = car2.add(axes);
	return car2;
}

function makeWheel() {
	const geometry = new THREE.CylinderGeometry(6, 6, 40, 32);
	const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
	var cabin = new THREE.Mesh(
		new THREE.BoxGeometry(12, 40, 6),
		new THREE.MeshBasicMaterial({
			color: 0x000000
		})
	);
	cabin.position.z = 3;
	var wheel = new THREE.Mesh(geometry, material);
	wheel.add(cabin);
	wheel.rotation.z = Math.PI / 2;
	wheel.castShadow = true;
	wheel.receiveShadow = true;
	return wheel;
}

function update_car() {
	valor = Math.trunc(time * speed) % 1000;
	carro.position.x = points[valor].getComponent(0);
	carro.position.y = points[valor].getComponent(1);
	carro.position.z = points[valor].getComponent(2);
	carro.lookAt(points[valor + 1]);
}

function update_camera() {
	if (camera_ref == 0) {
		controls.update();
	}
	if (camera_ref == 1) {
		camera.position.set(points[valor + 8].x, points[valor + 8].y + 2, points[valor + 8].z);
		camera.lookAt(points[valor + 11].x, points[valor + 11].y + 2, points[valor + 11].z);
		camera.updateProjectionMatrix();

	}
	if (camera_ref == 2) {
		camera.position.set(carro.position.x + 20, carro.position.y + 10, carro.position.z);
		camera.lookAt(carro.position);
		camera.updateProjectionMatrix();

	}

}

function envirmap() {
	//envmap
	const geo = new THREE.SphereGeometry(500, 60, 40);
	// invert the geometry on the x-axis so that all of the faces point inward
	geo.scale(- 1, 1, 1);
	ambmap = new THREE.TextureLoader().load("./img/img1.jpg");
	ambmap.mapping = THREE.EquirectangularReflectionMapping;
	ambmap.encoding = THREE.sRGBEncoding;
	scene.background = ambmap;
}

function animate() {
	requestAnimationFrame(animate);
	render();
	time += clock.getDelta();
	update_car();
	update_camera();
}

function resize(renderer) {
	const canvas = renderer.domElement;
	const width = window.innerWidth / 2;
	const height = window.innerHeight / 1.5;
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
}