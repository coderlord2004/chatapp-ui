'use client'

import { useEffect, useRef } from 'react';

const UniverseCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();

        const stars: Star[] = [];
        const shootingStars: ShootingStar[] = [];
        const planets: Planet[] = [];

        class Star {
            x: number;
            y: number;
            size: number;
            blinkSpeed: number;
            opacity: number;
            increasing: boolean;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5;
                this.blinkSpeed = Math.random() * 0.05;
                this.opacity = Math.random();
                this.increasing = Math.random() > 0.5;
            }

            update() {
                if (this.increasing) {
                    this.opacity += this.blinkSpeed;
                    if (this.opacity >= 1) {
                        this.increasing = false;
                    }
                } else {
                    this.opacity -= this.blinkSpeed;
                    if (this.opacity <= 0.3) {
                        this.increasing = true;
                    }
                }
            }

            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx!.fill();
            }
        }

        class ShootingStar {
            x!: number;
            y!: number;
            speed!: number;
            size!: number;
            angle!: number;
            timeToLive!: number;
            alive!: boolean;
            trailLength: number;

            constructor() {
                this.trailLength = Math.random() * 50 + 50;
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.speed = Math.random() * 10 + 5;
                this.size = Math.random() * 2 + 1;
                this.angle = Math.random() * Math.PI / 4 + Math.PI / 8;
                this.timeToLive = Math.random() * 100 + 100;
                this.alive = true;
            }

            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                this.timeToLive--;

                if (this.timeToLive <= 0 ||
                    this.x > canvas.width ||
                    this.y > canvas.height) {
                    this.alive = false;
                }
            }

            draw() {
                if (!ctx) return;

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(
                    this.x - Math.cos(this.angle) * this.trailLength,
                    this.y - Math.sin(this.angle) * this.trailLength
                );
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.timeToLive / 100})`;
                ctx.lineWidth = this.size;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
            }
        }

        class Planet {
            x: number;
            y: number;
            size: number;
            color: string;
            speed: number;
            angle: number;
            distance: number;
            hasRing: boolean;
            ringSize: number;
            name: string;

            constructor() {
                this.size = Math.random() * 15 + 10;
                this.color = this.getRandomColor();
                this.speed = Math.random() * 0.002 + 0.001;
                this.angle = Math.random() * Math.PI * 2;
                this.distance = Math.random() * (Math.min(canvas.width, canvas.height) / 3) + 100;
                this.x = canvas.width / 2 + Math.cos(this.angle) * this.distance;
                this.y = canvas.height / 2 + Math.sin(this.angle) * this.distance;
                this.hasRing = Math.random() > 0.7;
                this.ringSize = this.size * 1.8;
                this.name = this.getPlanetName();
            }

            getRandomColor() {
                const colors = [
                    '#4682B4',
                    '#9370DB',
                    '#20B2AA',
                    '#FF6347',
                    '#FFD700',
                    '#CD5C5C',
                    '#32CD32',
                    '#BA55D3'
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            getPlanetName() {
                const names = ['Sao Thổ', 'Sao Mộc', 'Sao Hỏa', 'Sao Kim', 'Sao Thủy', 'Sao Thiên Vương', 'Sao Hải Vương'];
                return names[Math.floor(Math.random() * names.length)];
            }

            update() {
                this.angle += this.speed;
                this.x = canvas.width / 2 + Math.cos(this.angle) * this.distance;
                this.y = canvas.height / 2 + Math.sin(this.angle) * this.distance;
            }

            draw() {
                if (!ctx) return;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                if (this.hasRing) {
                    ctx.beginPath();
                    ctx.ellipse(
                        this.x,
                        this.y,
                        this.ringSize,
                        this.ringSize * 0.3,
                        this.angle,
                        0,
                        Math.PI * 2
                    );
                    ctx.strokeStyle = 'rgba(210, 180, 140, 0.7)';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }

                ctx.font = '10px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(this.name, this.x, this.y + this.size + 15);
            }
        }

        for (let i = 0; i < 500; i++) {
            stars.push(new Star());
        }

        const planetCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < planetCount; i++) {
            planets.push(new Planet());
        }

        let animationFrameId: number;

        const animate = () => {
            if (!ctx) return;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.update();
                star.draw();
            });

            if (Math.random() < 0.02 && shootingStars.length < 3) {
                shootingStars.push(new ShootingStar());
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                shootingStars[i].update();
                shootingStars[i].draw();

                if (!shootingStars[i].alive) {
                    shootingStars.splice(i, 1);
                }
            }

            planets.forEach(planet => {
                planet.update();
                planet.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            resizeCanvas();
            stars.forEach(star => {
                star.x = Math.random() * canvas.width;
                star.y = Math.random() * canvas.height;
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 hidden dark:block"
        />
    );
};

export default UniverseCanvas;