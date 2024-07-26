import { camera, renderer, windowHalfX, windowHalfY } from './init';

let mouseX = 0, mouseY = 0;

const onDocumentMouseMove = (event: MouseEvent) => {
    mouseX = (event.clientX - windowHalfX) * 0.25;
    mouseY = (event.clientY - windowHalfY) * 0.15;
};

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

// Touch events
const onDocumentTouchMove = (event: TouchEvent) => {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = (event.touches[0].pageX - windowHalfX) * 0.25;
        mouseY = (event.touches[0].pageY - windowHalfY) * 0.15;
    }
};


export { onDocumentMouseMove, onWindowResize, onDocumentTouchMove, mouseX, mouseY };