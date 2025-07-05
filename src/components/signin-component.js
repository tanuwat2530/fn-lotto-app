"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// Using a standard <a> tag instead of Next.js Link for compatibility.

/**
 * Login Component
 *
 * This component renders a login page with a 3D animated background.
 * It reuses the visual theme from the sign-up page for a consistent UI.
 * The component must be a client component ("use client") because it uses
 * hooks (useRef, useEffect) to interact with the browser's DOM for the animation.
 */
const Signin = () => {
    // A ref to hold the canvas element for the three.js renderer.
    const canvasRef = useRef(null);

    // useEffect hook to set up and run the three.js animation.
    // The empty dependency array [] ensures this runs only once when the component mounts.
    useEffect(() => {
        // Ensure the code runs only in the browser environment.
        if (typeof window !== 'undefined') {
            // --- Three.js Scene Setup ---

            // 1. Scene
            const scene = new THREE.Scene();

            // 2. Camera
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            // 3. Renderer
            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                alpha: true, // Allows the background to be transparent
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            // 4. Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0x9f7aea, 1.5, 100); // Purple light
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);

            const pointLight2 = new THREE.PointLight(0x4299e1, 1, 100); // Blue light
            pointLight2.position.set(-5, -5, -2);
            scene.add(pointLight2);

            // 5. 3D Object (Torus Knot)
            const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.7,
                roughness: 0.2,
            });
            const torusKnot = new THREE.Mesh(geometry, material);
            scene.add(torusKnot);

            // --- Event Listeners & Animation Loop ---

            // Handle window resize to keep the scene proportional
            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener('resize', handleResize);

            // Variables for mouse interaction
            let mouseX = 0, mouseY = 0;
            let targetX = 0, targetY = 0;
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;

            // Track mouse movement to rotate the object
            const handleMouseMove = (event) => {
                mouseX = (event.clientX - windowHalfX) / 2;
                mouseY = (event.clientY - windowHalfY) / 2;
            };
            document.addEventListener('mousemove', handleMouseMove);

            // The animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                targetX = mouseX * 0.001;
                targetY = mouseY * 0.001;

                // Apply a smooth rotation to the object
                torusKnot.rotation.y += 0.005 + targetX;
                torusKnot.rotation.x += 0.005 + targetY;

                renderer.render(scene, camera);
            };

            animate();

            // Cleanup function to remove event listeners when the component unmounts
            return () => {
                window.removeEventListener('resize', handleResize);
                document.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, []);

    return (
        <div className="bg-gray-900 text-white font-kanit">
            {/* Global styles for the page and form container */}
            <style jsx global>{`
                body {
                    font-family: 'Kanit', sans-serif;
                    overflow: hidden; /* Prevents scrollbars from the canvas */
                }
                #bg-canvas {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                }
                .form-container {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
            `}</style>

            <canvas id="bg-canvas" ref={canvasRef}></canvas>

            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center">

                        {/* Left Side: Welcome Text */}
                        <div className="hidden md:block text-center md:text-left">
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">ยินดีต้อนรับกลับมา</h1>
                            <p className="text-lg text-gray-300">
                                เข้าสู่ระบบเพื่อเชื่อมต่อกับชุมชนของเราอีกครั้ง
                            </p>
                        </div>

                        {/* Right Side: Login Form */}
                        <div className="w-full max-w-md mx-auto md:mx-0">
                            <div className="form-container rounded-2xl p-8 shadow-2xl">
                                <h2 className="text-3xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>

                                <form action="#" method="POST">
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">อีเมล</label>
                                            <input type="email" id="email" name="email"
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                                placeholder="you@example.com" />
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">รหัสผ่าน</label>
                                            <input type="password" id="password" name="password"
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                                placeholder="••••••••" />
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <button type="submit"
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                                            เข้าสู่ระบบ
                                        </button>
                                    </div>
                                </form>

                                <p className="mt-6 text-center text-sm text-gray-400">
                                    ยังไม่มีบัญชี?{' '}
                                    <a href="/signup" className="font-medium text-purple-400 hover:text-purple-300">
                                        สมัครสมาชิก
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
