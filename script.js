// Basic setup
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,2,5);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10,20,10);
scene.add(light);

// Controls
let controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());
scene.add(controls.getObject());

// Player
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let canJump = false;
const gravity = -0.02;
const speed = 0.1;
const jumpPower = 0.4;

// Key controls
let keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

// Platforms
let platforms = [];
let blockSize = 2;
let platformCount = 50;

for(let i=0;i<platformCount;i++){
  let geo = new THREE.BoxGeometry(blockSize,0.5,blockSize);
  let mat = new THREE.MeshPhongMaterial({color:0x8B4513});
  let cube = new THREE.Mesh(geo, mat);
  cube.position.set(Math.random()*10-5, i*3, Math.random()*10-5);
  scene.add(cube);
  platforms.push(cube);
}

// Collision helper
function checkCollision(){
  canJump = false;
  let playerBox = new THREE.Box3().setFromCenterAndSize(
    controls.getObject().position, new THREE.Vector3(1,2,1)
  );

  platforms.forEach(p => {
    let box = new THREE.Box3().setFromObject(p);
    if(playerBox.intersectsBox(box)){
      if(velocity.y < 0){
        velocity.y = 0;
        canJump = true;
      }
    }
  });
}

// Animate
let heightDisplay = document.getElementById('info');

function animate(){
  requestAnimationFrame(animate);

  // Movement
  direction.set(0,0,0);
  if(keys['KeyW']) direction.z -= 1;
  if(keys['KeyS']) direction.z += 1;
  if(keys['KeyA']) direction.x -= 1;
  if(keys['KeyD']) direction.x += 1;
  direction.normalize();

  velocity.x = direction.x * speed;
  velocity.z = direction.z * speed;

  velocity.y += gravity;
  controls.getObject().position.add(velocity);

  checkCollision();

  // Jump
  if(keys['Space'] && canJump){
    velocity.y = jumpPower;
    canJump = false;
  }

  // Update height display
  heightDisplay.textContent = "Height: " + Math.floor(controls.getObject().position.y);

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
