import { camera, scene, renderer, start_time } from './init';
import { mouseX, mouseY } from './events';

const animate = () => {

    if (!renderer) {
        console.error('Renderer is not initialized');
        return;
    }
        
    requestAnimationFrame(animate);
    const position = ((Date.now() - start_time) * 0.03) % 8000;
    camera.position.x += (mouseX - camera.position.x) * 0.01;
    camera.position.y += (-mouseY - camera.position.y) * 0.01;
    camera.position.z = -position + 8000;
    renderer.render(scene, camera);
};

export { animate };