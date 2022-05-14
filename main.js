let gamestate = {}; // gamestate is dictionary of players


// establish connection to server

// upon recieving update from server, update gamestate


// allow user to modify gamestate (temporary)
let add = document.getElementById('add').onclick = () => {
    let id = document.querySelector('input').value;
    gamestate[id] = {
        x: -3 + Math.random() * 6,
        y: -3 + Math.random() * 6,
        color: Math.random() * 0xffffff
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

// configure input controls

// upon user input, send input to server

