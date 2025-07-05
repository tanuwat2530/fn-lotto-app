"use client"; // Add this directive at the top of the file
import React from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SignUp = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Scene setup
            const scene = new THREE.Scene();
            
            // Camera setup
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            // Renderer setup
            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                alpha: true, // Make canvas background transparent
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0x9f7aea, 1.5, 100); // Purple light
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);

            const pointLight2 = new THREE.PointLight(0x4299e1, 1, 100); // Blue light
            pointLight2.position.set(-5, -5, -2);
            scene.add(pointLight2);

            // 3D Object (Torus Knot)
            const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.7,
                roughness: 0.2,
            });
            const torusKnot = new THREE.Mesh(geometry, material);
            scene.add(torusKnot);

            // Handle window resize
            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener('resize', handleResize);

            // Mouse interaction variables
            let mouseX = 0, mouseY = 0;
            let targetX = 0, targetY = 0;
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;

            const handleMouseMove = (event) => {
                mouseX = (event.clientX - windowHalfX) / 2;
                mouseY = (event.clientY - windowHalfY) / 2;
            };
            document.addEventListener('mousemove', handleMouseMove);

            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);

                targetX = mouseX * .001;
                targetY = mouseY * .001;

                // Smooth rotation
                torusKnot.rotation.y += 0.005 + targetX;
                torusKnot.rotation.x += 0.005 + targetY;
                
                renderer.render(scene, camera);
            };

            animate();

            // Cleanup on component unmount
            return () => {
                window.removeEventListener('resize', handleResize);
                document.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, []);

    return (
        <div className="bg-gray-900 text-white font-kanit">
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
                        
                        {/* Left Side: 3D Animation Placeholder & Title */}
                        <div className="hidden md:block text-center md:text-left">
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">เข้าร่วมกับเรา</h1>
                            <p className="text-lg text-gray-300">
                                ค้นพบประสบการณ์ใหม่และเชื่อมต่อกับชุมชนของเราได้แล้ววันนี้
                            </p>
                        </div>

                        {/* Right Side: Sign-up Form */}
                        <div className="w-full max-w-md mx-auto md:mx-0">
                            <div className="form-container rounded-2xl p-8 shadow-2xl">
                                <h2 className="text-3xl font-bold mb-6 text-center">สร้างบัญชีใหม่</h2>
                                
                                <form action="#" method="POST">
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">ชื่อผู้ใช้</label>
                                            <input type="text" id="username" name="username"
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                                placeholder="ตัวอย่าง: user123" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">อีเมล หรือ เบอร์โทรศัพท์</label>
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
                                            สมัครสมาชิก
                                        </button>
                                    </div>
                                </form>

                                <p className="mt-6 text-center text-sm text-gray-400">
                                    มีบัญชีอยู่แล้ว?{' '}
                                    <a href="/signin" className="font-medium text-purple-400 hover:text-purple-300">
                                        เข้าสู่ระบบ
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

export default SignUp;