// The three.js scene: the 3D world where you put objects
console.log('hi')
const scene = new THREE.Scene();

// The camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);


// A cube we are going to animate
const cube = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(1, 1, 1),
  // The material: the appearance (color, texture) of the object
  material: new THREE.MeshBasicMaterial({ color: 0x3c7fff })
};

// The mesh: the geometry and material combined, and something we can directly add into the scene (I had to put this line outside of the object literal, so that I could use the geometry and material properties)
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);

// Add the cube into the scene
scene.add(cube.mesh);

// Make the camera further from the cube so we can see it better
camera.position.z = 5;

function render() {
  // Render the scene and the camera
  renderer.render(scene, camera);

  // Rotate the cube every frame
  cube.mesh.rotation.x += 0.005;
  cube.mesh.rotation.y -= 0.01;

  // Make it call the render() function about every 1/60 second
  requestAnimationFrame(render);
}

render();

const material = new THREE.MeshBasicMaterial({ color: 0x3c7fff })
const loader = new STLLoader();
loader.load(
    'bunny.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
render();