/**
 * You can safely leave this first part alone (I think)
 */

// Create the scene that contains everything
const scene = new THREE.Scene();

// Pick the method of visualization (probably keep WebGL)
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


/**
 * Define your winter wonderland here!
 */

const headSphere = new THREE.SphereGeometry(15, 20, 16);
const bodySphere = new THREE.SphereGeometry(25, 20, 16);
const baseSphere = new THREE.SphereGeometry(30, 20, 16);
const hat = new THREE.SphereGeometry(10, 20, 16);

const sphereMaterial = new THREE.MeshBasicMaterial({ color: 'white' });
const hatMaterial = new THREE.MeshBasicMaterial({ color: 'red' });

const headMesh = new THREE.Mesh( headSphere, sphereMaterial );
const bodyMesh = new THREE.Mesh( bodySphere, sphereMaterial );
const baseMesh = new THREE.Mesh( baseSphere, sphereMaterial );
const hatMesh = new THREE.Mesh( hat, hatMaterial );

headMesh.position.set(0, 40, 0);
bodyMesh.position.set(0, 5, 0);
baseMesh.position.set(0, -25, 0);
hatMesh.position.set(0, 50, 1);

scene.add(headMesh, bodyMesh, baseMesh, hatMesh);

// Snow particles

var particleCount = 2000,
	pMaterial = new THREE.PointsMaterial({
		color: 0xFFFFFF,
		size: 4,
		map: THREE.ImageUtils.loadTexture(
			'snowflake.png'
		),
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true
	}),
	particles = new THREE.Geometry;

for (var i = 0; i < particleCount; i++) {
	var pX = Math.random()*500 - 250,
		pY = Math.random()*500 - 250,
		pZ = Math.random()*500 - 250,
		particle = new THREE.Vector3(pX, pY, pZ);
	particle.velocity = {};
	particle.velocity.y = 0;
	particles.vertices.push(particle);
}

var particleSystem = new THREE.Points(particles, pMaterial);

scene.add(particleSystem);

var simulateRain = function(){
	var pCount = particleCount;
	while (pCount--) {
		var particle = particles.vertices[pCount];
		if (particle.y < -200) {
			particle.y = 200;
			particle.velocity.y = 0;
		}

		particle.velocity.y -= Math.random() * .02;

		particle.y += particle.velocity.y;
	}

	particles.verticesNeedUpdate = true;
};


// Set the camera position
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
//controls = new OrbitControls(camera);


scene.add(camera);


function renderFrame() {
    // Do transformations that happen every frame here

	particleSystem.rotation.y += 0.002;
	simulateRain();

    renderer.render(scene, camera);
}


setInterval(() => {
    requestAnimationFrame(renderFrame);
}, 1000 / 27); // 30 FPS
