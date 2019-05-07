/**
 * GLOBAL VARS
 */
lastTime = Date.now();
cameras = {
    default: null,
    current: null
};
canvas = {
    element: null,
    container: null
}
labels = {}
cameraControl = null;
scene = null;
renderer = null


/**
 * Function to start program running a
 * WebGL Application trouhg ThreeJS
 */
let webGLStart = () => {
    initScene();
    window.onresize = onWindowResize;
    lastTime = Date.now();
    animateScene();
};

/**
 * Here we can setup all our scene noobsters
 */
function initScene() {
    //Selecting DOM Elements, the canvas and the parent element.
    canvas.container = document.querySelector("#app");
    canvas.element = canvas.container.querySelector("#appCanvas");

    /**
     * SETTING UP CORE THREEJS APP ELEMENTS (Scene, Cameras, Renderer)
     * */
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ canvas: canvas.element });
    renderer.setSize(canvas.container.clientWidth, canvas.container.clientHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvas.container.appendChild(renderer.domElement);

    //positioning cameras
    cameras.default = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 10000);
    cameras.default.position.set(1600,1600,-1600);
    cameras.default.lookAt(new THREE.Vector3(0, 0, 0));

    //CAMERAS
    var tracking = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
	tracking.position.set(1600,1600,-1600);
	tracking.lookAt(new THREE.Vector3(0,0,0));

	var fixed = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
	fixed.position.set(-600,300,-600);
	fixed.lookAt(new THREE.Vector3(0,0,0));

	var tpersona = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
	tpersona.position.set(1600,1600,-1600);
	tpersona.lookAt(new THREE.Vector3(0,0,0));

	var observer = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
	observer.position.set(1600,1600,-1600);
	observer.lookAt(new THREE.Vector3(0,0,0));

	cameras.tracking = tracking;
	cameras.fixed = fixed;
	cameras.tpersona = tpersona;
    cameras.observer = observer;
    //Setting up current default camera as current camera
    cameras.current = cameras.default;
    
    //Camera control Plugin
    cameraControl = new THREE.OrbitControls(cameras.current, renderer.domElement);

    lAmbiente = new THREE.AmbientLight(0xb5b5b5);
    scene.add(lAmbiente);

    //FPS monitor
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = stats.domElement.style.left = '10px';
	stats.domElement.style.zIndex = '100';
	document.body.appendChild(stats.domElement);

    initObjects();
}

/**
 * Function to add all objects and stuff to scene
 */
function initObjects(){
   for (let i = 0; i < items.length; i++) {
    
        let properties = [];

        for (let j = 0; j < items[i].properties.length; j++) {
            properties[items[i].properties[j]["name"]] =items[i].properties[j];
        }
        console.log(properties)
        let [w,h,d] = [
            properties["width"]["value"],
            properties["height"]["value"],
            properties["depth"]["value"]
        ];

        var e = new THREE.Mesh(
            new THREE.CubeGeometry(w,h,d),
            new THREE.MeshPhongMaterial( {color:0x6a6a6a})
        );

        scene.add(e);

    }
}

/**
 * Function to render application over
 * and over.
 */
function animateScene() {
    requestAnimationFrame(animateScene);
    renderer.render(scene, cameras.current);
    updateScene();
}

/**
 * Function to evaluate logic over and
 * over again.
 */
function updateScene() {
    lastTime = Date.now();

    //Updating camera view by control inputs
    cameraControl.update();
    //Updating FPS monitor
    stats.update();

}

function onWindowResize() {
    cameras.current.aspect = window.innerWidth / window.innerHeight;
    cameras.current.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}