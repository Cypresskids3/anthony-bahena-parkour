import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'

const objects = []; //array ~ list
let raycaster; //raygun

let moveFoward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now(); //current time
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let camera, scene, controls, renderer;

init();
animate();
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 350);


    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });
    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveFoward = true;
                break;

            case 'KeyD':
                moveRight = true;
                break;

            case 'KeyS':
                moveBackward = true;
                break;

            case 'KeyA':
                moveLeft = true;
                break;
            case 'Space':
                if (canJump === true) velocity.y += 260;
                canJump = false;
                break;
        }

    }

    const onKeyUp = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveFoward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyS':
                moveBackward = false;
                break;
            case 'KeyD':
                moveRight = false;
                break;

        }
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    const PlaneGeometry = new THREE.PlaneGeometry(150, 150, 64, 64);
    const planematerial = new THREE.MeshLambertMaterial({ color: 0x5B9AD9 });
    const plane = new THREE.Mesh(PlaneGeometry, planematerial);
    plane.rotateX(-1.57);
    scene.add(plane);
    objects.push(plane);

    const light = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(light);

   const flagGeometry = new THREE.BoxGeometry(3,3,8);
   const flagMaterial = new THREE.MeshLambertMaterial({color: 0xFF2B05});
   const flag = new THREE.Mesh(flagGeometry, flagMaterial);
   scene.add(flag);
   objects.push(flag);
   flag.position.x = 50;
   flag.position.z = 60;
   flag.position.y = 16;

   const cubeGeometry = new THREE.BoxGeometry(2,15,2);
   const cubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
   const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
   scene.add(cube);
   objects.push(cube);
   cube.position.x = 50;
   cube.position.z = 62;
   cube.position.y = 9;

   const cube1Geometry = new THREE.BoxGeometry(7,7,7);
   const cube1 = new THREE.Mesh(cube1Geometry, cubeMaterial);
   scene.add(cube1);
   objects.push(cube1);
   cube1.position.x = 50;
   cube1.position.z = 40;
   cube1.position.y = 20; 

   const cube2 = new THREE.Mesh(cube1Geometry, cubeMaterial);
   scene.add(cube2);
   objects.push(cube2);
   cube2.position.set(50,30, 15);

   const cube3 = new THREE.Mesh(cube1Geometry, cubeMaterial);
   scene.add(cube3);
   objects.push(cube3);
   cube3.position.set(50, 45, -10);

   const cube4 = new THREE.Mesh(cube1Geometry, cubeMaterial);
   scene.add(cube4);
   objects.push(cube4);
   cube4.position.set(50, 60, -35);

   const cube5 = new THREE.Mesh(cube1Geometry, cubeMaterial);
   scene.add(cube5);
   objects.push(cube5);
   cube5.position.set(50, 70, -60);

   const cube6 = new THREE.Mesh(cube1Geometry, cubeMaterial);
   scene.add(cube6);
   objects.push(cube6);
   cube6.position.set(25, 85, -60);

   const StartGeometry = new THREE.BoxGeometry(20,3,20);
   const StartMaterial = new THREE.MeshLambertMaterial({color: 0x00852F});
   const start = new THREE.Mesh(StartGeometry, StartMaterial);
   scene.add(start);
   objects.push(start);
   

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onwindowResize);

    console.log(objects);
}

function onwindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}





function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();

    if (controls.isLocked === true) {

        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 1;

        const intersections = raycaster.intersectObjects(objects, false);
        console.log(intersections);
        const onObject = intersections.length > 0;
        console.log(onObject)
        const delta = (time - prevTime)/1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta;

        direction.z = Number(moveFoward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveFoward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        if (onObject === true) {
            console.log("ON")
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        controls.getObject().position.y += (velocity.y * delta);

        if (controls.getObject().position.y < -1) {
            velocity.y = 0;
            controls.getObject().position.y = 0;
            canJump = true;
        }

    }
    prevTime = time;
    renderer.render(scene, camera);
}

