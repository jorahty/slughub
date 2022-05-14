let gamestate = {}; // gamestate is dictionary of players


// establish connection to server

let myid = 'a'; // temporary ███████

// upon recieving update from server, update gamestate

// ███████
// allow user to modify gamestate (temporary)
let add = document.getElementById('add').onclick = () => {
    let id = document.querySelector('input').value;
    gamestate[id] = {
        color: Math.random() * 0xffffff,
        x: -3 + Math.random() * 6,
        y: -3 + Math.random() * 6,
        rotation: Math.random() * 2 * Math.PI
    };
};
let remove = document.getElementById('remove').onclick = () => {
    let id = document.querySelector('input').value;
    delete gamestate[id];
};


// create scene
let scene = new THREE.Scene();

// create camera
let camera = new THREE.PerspectiveCamera();
camera.position.z = 10;

// create renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(400, 400);
document.body.appendChild(renderer.domElement);

// define player geometry
let geometry = new THREE.ConeGeometry(0.5);

// define background
var loader = new THREE.TextureLoader();
var bg_geometry = new THREE.PlaneGeometry(15, 15);
var bg_material = new THREE.MeshBasicMaterial({ map: loader.load('bg.jpg') });
var bg = new THREE.Mesh(bg_geometry, bg_material);
scene.add(bg);

// continuously render the scene from the camera
let meshes = {}; // need to keep track of meshes in scene
animate();

// animate
function animate() {
    requestAnimationFrame(animate);

    update(); // before each render, update the scene based on gamestate

    renderer.render(scene, camera);
};


// update scene based on gamestate
function update() {

    for (let id in gamestate) { // for each player

        // add player if not already in scene
        if (id in meshes == false) {
            let material = new THREE.MeshMatcapMaterial({ color: gamestate[id].color });
            let mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // record meshes in scene
            meshes[id] = {mesh, material, geometry};
        }

        // focus camera if player has myid
        if (id == myid) {
            camera.position.x = gamestate[id].x;
            camera.position.y = gamestate[id].y;
        }

        // update player position & rotation
        meshes[id].mesh.position.x = gamestate[id].x;
        meshes[id].mesh.position.y = gamestate[id].y;
        meshes[id].mesh.rotation.z = gamestate[id].rotation;
    }

    // remove abscent players
    for (let id in meshes) {
        if (id in gamestate) continue;
        meshes[id].material.dispose();
        meshes[id].geometry.dispose();
        scene.remove(meshes[id].mesh);
        renderer.renderLists.dispose();
        delete meshes[id];
    }
}

// temporary ███████
let rotating = false;
let translating = false;

// configure controls to listen for input
createControls();

// createControls
function createControls() {

    // create buttons
    let rotate = document.createElement('button');
    let translate = document.createElement('button');
    rotate.innerText = 'rotate';
    translate.innerText = 'translate';

    // listen for rotate input
    rotate.addEventListener('mousedown', () => { input(true, true) } )
    rotate.addEventListener('mouseup', () => { input(false, true) } )
    
    // listen for translate input
    translate.addEventListener('mousedown', () => { input(true, false) } )
    translate.addEventListener('mouseup', () => { input(false, false) } )

    // append buttons to dom
    document.body.appendChild(rotate);
    document.body.appendChild(translate);
}

// upon user input, send input to server
function input(isDown, isRotate) {

    // confirm in console
    let status = isDown ? "down" : "up";
    let control = isRotate ? "rotate" : "translate";
    console.log(`${control} is ${status}`);

    // temporary ███████
    // instead of sending input to server,
    // toggle global variables
    rotating = isDown && isRotate
    translating = isDown && !isRotate
}


// ███████
// temporary (this will eventually happen on server)
// step/simulate the gamestate forward in time (based on input)

setInterval(tick, 1000 / 4);

function tick() {

    let me = gamestate[myid];

    if (!me) return;

    // move if controls are active
    if (rotating) me.rotation += 0.3;
    if (translating) {
        me.x -= 0.3 * Math.sin(me.rotation);
        me.y += 0.3 * Math.cos(me.rotation);
    }
}