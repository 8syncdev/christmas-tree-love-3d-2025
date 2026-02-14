
import { imageManifest } from './image_manifest.js';

// ==========================================
// HẠT UI
// ==========================================
export function createUIParticles() {
    const container = document.getElementById('uiParticles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'ui-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (8 + Math.random() * 6) + 's';
        particle.style.background = Math.random() > 0.5 ? 'var(--neon-gold)' : 'var(--neon-blue)';
        container.appendChild(particle);
    }
}

// ==========================================
// TẠO HÌNH ẢNH NHỎ
// ==========================================
export async function createThumbnails(onPhotoClickCallback) {
    const container = document.getElementById('thumbnailsContainer');

    imageManifest.forEach((imgParam, index) => {
        const url = imgParam.path;
        const name = imgParam.name;

        const thumb = document.createElement('div');
        thumb.className = 'thumbnail' + (index === 0 ? ' active' : '');

        // Tạo img element và theo dõi load
        const img = document.createElement('img');
        img.alt = `Ký ức ${index + 1}`;
        img.src = url;

        img.onload = () => {
            // console.log(`[Thumbnail ${index + 1}] loaded`);
            // Gọi callback global để tạo 3D photo nếu cần
            if (window.onPhotoThumbnailLoad) {
                window.onPhotoThumbnailLoad(index, img);
            }
        };

        img.onerror = () => {
            console.error(`[Thumbnail ${index + 1}] FAILED to load: ${url}`);
        };

        thumb.appendChild(img);

        // Pass the index to the callback
        thumb.addEventListener('click', () => {
            if (onPhotoClickCallback) {
                onPhotoClickCallback(index);
            }
        });

        container.appendChild(thumb);
    });
}
