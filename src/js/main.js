
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { createThumbnails, createUIParticles } from './ui.js';
import { imageManifest } from './image_manifest.js';

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    camera: {
        fov: 60,
        near: 0.1,
        far: 2000,
        posX: 0, posY: 10, posZ: 45 // Further back to see whole tree
    },
    bloom: {
        strength: 0.6,
        radius: 0.5,
        threshold: 0.2
    }
};

// Global variables
let scene, camera, renderer, composer, controls;
let photoGroup = new THREE.Group();
let starMesh;

// ==========================================
// LOADING MANAGER
// ==========================================
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const progress = Math.round((itemsLoaded / itemsTotal) * 100);
    const progressEl = document.getElementById('progress');
    if (progressEl) progressEl.innerText = progress + '%';
    // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

loadingManager.onLoad = function () {
    // console.log('Loading complete!');
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden-loader');
    }

    // Animate camera entry?
    // camera.position.z = 100;
    // gsap.to(camera.position, { z: 45, duration: 2 });
};

// ==========================================
// 3D OBJECT CREATION
// ==========================================
function createSceneObjects() {
    // 1. Photos
    imageManifest.forEach((imgItem, index) => {
        textureLoader.load(imgItem.path, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;

            // Aspect Ratio Estimation (since we don't have DOM img natural dims yet, assume 4:3 or read texture image)
            // texture.image.width available after load
            const aspect = texture.image.width / texture.image.height;
            const height = 4; // Bigger photos
            const width = height * aspect;

            // Geometry
            const geometry = new THREE.PlaneGeometry(width, height);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(geometry, material);

            // Gold Border
            const borderGeo = new THREE.EdgesGeometry(geometry);
            const borderMat = new THREE.LineBasicMaterial({ color: 0xffeb3b, linewidth: 2 });
            const border = new THREE.LineSegments(borderGeo, borderMat);
            mesh.add(border);

            // SPIRAL POSITIONING (Christmas Tree)
            // Bottom-up: index 0 at bottom
            const t = index / imageManifest.length; // 0 to 1

            // Height: -20 to +20
            const y = (t * 50) - 20;

            // Radius: Cone shape (Wide bottom, narrow top)
            // Bottom (t=0) radius 15, Top (t=1) radius 2
            const r = 18 * (1 - t) + 2;

            // Angle: 5 turns total
            const angle = index * 0.8; // Radians

            mesh.position.set(
                Math.cos(angle) * r,
                y,
                Math.sin(angle) * r
            );

            mesh.lookAt(0, y, 0); // Look at center pole
            mesh.rotateY(Math.PI); // Flip outward so image is correct

            // Tilt slightly up
            mesh.rotateX(-0.1);

            mesh.userData = { id: index };
            photoGroup.add(mesh);
        });
    });
    scene.add(photoGroup);

    // 2. Center Pole (Light beam)
    const poleGeo = new THREE.CylinderGeometry(0.2, 0.5, 60, 16);
    const poleMat = new THREE.MeshBasicMaterial({
        color: 0xffeb3b,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 5;
    scene.add(pole);

    // Top Star
    const topStarGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const topStarMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const topStar = new THREE.Mesh(topStarGeo, topStarMat);
    topStar.position.y = 32;
    scene.add(topStar);

    // 3. Stars / Snow
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1500;
    const posArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 200; // Wide spread
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({
        size: 0.3,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    starMesh = new THREE.Points(starGeo, starMat);
    scene.add(starMesh);
}

// ==========================================
// INIT
// ==========================================
function init() {
    // Scene
    scene = new THREE.Scene();
    // No fog or very light fog to see colors
    scene.fog = new THREE.FogExp2(0x1a0b2e, 0.008);

    // Camera
    camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, window.innerWidth / window.innerHeight, CONFIG.camera.near, CONFIG.camera.far);
    camera.position.set(CONFIG.camera.posX, CONFIG.camera.posY, CONFIG.camera.posZ);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Composer (Bloom)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = CONFIG.bloom.threshold;
    bloomPass.strength = CONFIG.bloom.strength;
    bloomPass.radius = CONFIG.bloom.radius;

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Bright ambient
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffd700, 1);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Objects
    createSceneObjects();

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.zoomSpeed = 0.5;

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Rotate stars
        if (starMesh) starMesh.rotation.y = time * 0.02;

        controls.update();
        composer.render();
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Start
init();
createUIParticles();
createThumbnails(); // Just for side viewing
