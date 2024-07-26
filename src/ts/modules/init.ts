import * as THREE from 'three';
import { Detector } from '../libs/Detector';
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';
import { animate } from './animate';
import { onDocumentMouseMove, onWindowResize, onDocumentTouchMove } from './events.ts';
import cloudImageUrl from '/assets/cloud.png'; 

let container: HTMLDivElement;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let mesh: THREE.Mesh;
let geometry: THREE.BufferGeometry;
let material: THREE.ShaderMaterial;
const start_time = Date.now();
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// 初期の色と夕焼けの色を定義
const initialColors = ["#1e4877", "#4584b4"];
const sunsetColors = ["#ff7e5f", "#feb47b"];
const nightColors = ["#000011", "#000022"];
const morningColors = ["#87cefa", "#f0e68c"];

// 色の遷移を行う関数
const lerpColor = (colorA: string, colorB: string, amount: number) => {
    const [r1, g1, b1] = colorA.match(/\w\w/g)!.map(x => parseInt(x, 16));
    const [r2, g2, b2] = colorB.match(/\w\w/g)!.map(x => parseInt(x, 16));
    const r = Math.round(r1 + (r2 - r1) * amount);
    const g = Math.round(g1 + (g2 - g1) * amount);
    const b = Math.round(b1 + (b2 - b1) * amount);
    return `rgb(${r},${g},${b})`;
};

const updateBackground = (colors: string[]) => {
    // Bg gradient
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const backgroundDataUrl = canvas.toDataURL('image/png');

    container.style.background = `url(${backgroundDataUrl})`;
    container.style.backgroundSize = '32px 100%';
}

const animateTransition = (startColors: string[], endColors: string[], duration: number, callback?: () => void) => {
    const startTime = Date.now();

    const transition = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const amount = Math.min(elapsed / duration, 1); // 0から1までの値を取る

        const currentColors = [
            lerpColor(startColors[0], endColors[0], amount),
            lerpColor(startColors[1], endColors[1], amount)
        ];
        updateBackground(currentColors);

        if (amount < 1) {
            requestAnimationFrame(transition);
        } else if (callback) {
            callback();
        }
    };

    transition();
};

const startColorTransitionLoop = () => {
    const transitionSequence = [
        { startColors: initialColors, endColors: sunsetColors },
        { startColors: sunsetColors, endColors: nightColors },
        { startColors: nightColors, endColors: morningColors },
        { startColors: morningColors, endColors: initialColors }
    ];

    let currentTransitionIndex = 0;

    const executeTransition = () => {
        const { startColors, endColors } = transitionSequence[currentTransitionIndex];
        animateTransition(startColors, endColors, 4000, () => {
            currentTransitionIndex = (currentTransitionIndex + 1) % transitionSequence.length;
            setTimeout(executeTransition, 10000);
        });
    };

    // 最初の10秒間は初期の色のまま
    setTimeout(() => {
        executeTransition();
    }, 10000);
};


const init = () => {
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    container = document.createElement('div');
    document.body.appendChild(container);

    updateBackground(initialColors); // 初期の色で背景を設定

    // 背景色の変更をループで実行
    startColorTransitionLoop();


    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 6000;

    scene = new THREE.Scene();
    geometry = new THREE.BufferGeometry();

    const texture = new THREE.TextureLoader()
    texture.load(cloudImageUrl, (texture) => {
        console.log('Texture loaded', texture);

        texture.flipY = false;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        const fog = new THREE.Fog(0x4584b4, -100, 3000);
        console.log('Fog color:', fog.color);

        material = new THREE.ShaderMaterial({
            uniforms: {
                "map": { value: texture },
                "fogColor": { value: fog.color },
                "fogNear": { value: fog.near },
                "fogFar": { value: fog.far },
            },
            vertexShader,
            fragmentShader,
            depthWrite: false,
            depthTest: false,
            transparent: true
        });

        const planeGeometry = new THREE.PlaneGeometry(64, 64);
        const planes = [];

        for (let i = 0; i < 8000; i++) {
            
            const planeMesh = new THREE.Mesh(planeGeometry, material);
            planeMesh.position.x = Math.random() * 1000 - 500;
            planeMesh.position.y = -Math.random() * Math.random() * 200 - 15;
            planeMesh.position.z = i;
            planeMesh.rotation.z = Math.random() * Math.PI;
            planeMesh.scale.x = planeMesh.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
            planes.push(planeMesh);
        }

        planes.forEach(planeMesh => {
            scene.add(planeMesh);
        });


        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
        window.addEventListener('resize', onWindowResize, false);

        animate();

    }, undefined, (error) => {
        console.error('Error loading texture:', error);
    });
};

export { init, camera, scene, renderer, mesh, geometry, material, start_time, windowHalfX, windowHalfY };