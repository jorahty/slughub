let gamestate = {}; // gamestate is dictionary of players


// establish connection to server

// upon recieving update from server, update gamestate


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

    // add new players
    for (let id in gamestate) {
        if (id in meshes) continue;

        let material = new THREE.MeshMatcapMaterial({ color: gamestate[id].color });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = gamestate[id].x;
        mesh.position.y = gamestate[id].y;
        mesh.rotation.z = gamestate[id].rotation;
        scene.add(mesh);

        meshes[id] = {mesh, material, geometry};
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

// configure controls to listen for input
createControls();

// createControls
function createControls() {

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

    document.body.appendChild(rotate);
    document.body.appendChild(translate);
}

// upon user input, send input to server
function input(isDown, isRotate) {

    let status = isDown ? "down" : "up";
    let control = isRotate ? "rotate" : "translate";
    console.log(`${control} is ${status}`);

    // rotating = isDown && isRotate
    // translating = isDown && !isRotate
}


