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

    items.forEach(element => {
        if(element["properties"] == null){ return false; } //prevenir errores si no existen propiedades
        let properties = {}; //objeto vacío de propiedades
        for (let i = 0; i < element["properties"].length; i++) { //ciclo que recorre las propiedades
            const property = element["properties"][i]; //constante para un llamado más fácil
            properties[property["name"]] = property; //Asigno al ojeto un atributo con el nombre de la propiedad
        }
        
        let [w,h,d,color] = [ //Definición de múltiples variables para crear el objeto
            properties["width"]["value"],
            properties["height"]["value"],
            properties["depth"]["value"],
            parseInt(properties["color"]["value"]),
        ];

        scene.add( //Adición del objeto a la escena
            new THREE.Mesh(
                new THREE.CubeGeometry(w,h,d),
                new THREE.MeshPhongMaterial( {color:color, wireframe: true})
            )
        );
    });
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