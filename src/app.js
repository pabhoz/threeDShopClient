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

var mouseRayCaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var hoveredList = [];
var hoverList = [];


/**
 * Function to start program running a
 * WebGL Application trouhg ThreeJS
 */
let webGLStart = () => {
    initScene();
    window.onresize = onWindowResize;
    window.onmousemove = onMouseMove;
    lastTime = Date.now();
    animateScene();
};

function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

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
    cameras.default.position.set(400, 400, -400);
    cameras.default.lookAt(new THREE.Vector3(0, 0, 0));

    //CAMERAS
    var tracking = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
    tracking.position.set(1600, 1600, -1600);
    tracking.lookAt(new THREE.Vector3(0, 0, 0));

    var fixed = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
    fixed.position.set(-600, 300, -600);
    fixed.lookAt(new THREE.Vector3(0, 0, 0));

    var tpersona = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
    tpersona.position.set(1600, 1600, -1600);
    tpersona.lookAt(new THREE.Vector3(0, 0, 0));

    var observer = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
    observer.position.set(1600, 1600, -1600);
    observer.lookAt(new THREE.Vector3(0, 0, 0));

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

    let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(400, 400, 40, 40),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    )
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    initObjects();
}

/**
 * Function to add all objects and stuff to scene
 */
function initObjects() {

    items.forEach(element => {
        if (element["properties"] == null) { return false; } //prevenir errores si no existen propiedades
        let properties = {}; //objeto vacío de propiedades
        properties = getProperties(element["properties"]);

        switch (properties["type"]["value"]) {
            case "cube":
                createCube(element, properties);
                break;
            case "sphere":
                createSphere(element, properties);
                break;
        }
    });
}

function createCube(element, properties) {
    let [w, h, d, color] = [ //Definición de múltiples variables para crear el objeto
        getProperty(properties, "width") || 20,
        getProperty(properties, "height") || 20,
        getProperty(properties, "depth") || 20,
        parseInt(getProperty(properties, "color"), ) || 0xffffff,
    ];
    let obj = new THREE.Mesh(
        new THREE.CubeGeometry(w, h, d),
        new THREE.MeshPhongMaterial({ color: color })
    );
    obj.myId = element.id;
    setPosition(obj, getProperty(properties, "posX"), getProperty(properties, "posY"), getProperty(properties, "posZ"));
    hoverList.push(obj);
    console.log(obj)
    scene.add(obj);
}

function createSphere(element, properties) {
    let [radius, ws, hs, color] = [ //Definición de múltiples variables para crear el objeto
        getProperty(properties, "radius") || 10,
        getProperty(properties, "ws") || 10,
        getProperty(properties, "hs") || 10,
        parseInt(getProperty(properties, "color"), ) || 0xffffff,
    ];
    let obj = new THREE.Mesh(
        new THREE.SphereGeometry(radius, ws, hs),
        new THREE.MeshPhongMaterial({ color: color })
    );
    setPosition(obj, getProperty(properties, "posX"), getProperty(properties, "posY"), getProperty(properties, "posZ"));
    hoverList.push(obj);
    scene.add(obj);
}

function getProperty(properties, property) {
    let keys = Object.keys(properties);
    let resultado = keys.find((element) => {
        return element == property;
    });

    return (resultado != undefined) ? properties[property]["value"] : undefined;
}

function getProperties(p){
    let properties = [];
    for (let i = 0; i < p.length; i++) { //ciclo que recorre las propiedades
        const property = p[i]; //constante para un llamado más fácil
        properties[property["name"]] = property; //Asigno al ojeto un atributo con el nombre de la 
    }
    return properties;
}

function setPosition(obj, x, y, z) {
    var [x, y, z] = [x || 0, y || 0, z || 0];
    obj.position.set(x, y, z);
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

    ///// RAYCASTER DEL MOUSE
    // update the picking ray with the camera and mouse position
    mouseRayCaster.setFromCamera(mouse, cameras.default);

    // calculate objects intersecting the picking ray
    var intersects = mouseRayCaster.intersectObjects(hoverList);

    for (var i = 0; i < intersects.length; i++) {

        let isHovered = hoveredList.find((obj) => {
            return obj == intersects[i].object;
        });
        if (!isHovered) {
            hoveredList.push(intersects[i].object);
            intersects[i].object.material.color.set(0xff0000);
        }
    }

    if(intersects.length <= 0){
        hoveredList.forEach(obj => {
            var color = "";
            //console.log(items);
            for (let i = 0; i  < items.length; i++) {
                const element = items[i];
                if(element.id == obj.myId){
                    let p = getProperties(element.properties);
                    color = getProperty(p,"color");
                    obj.material.color.set(parseInt(color));
                }
            }
            
        });
    }

}

function onWindowResize() {
    cameras.current.aspect = window.innerWidth / window.innerHeight;
    cameras.current.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}