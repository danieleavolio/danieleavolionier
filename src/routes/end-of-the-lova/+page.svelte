<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { onMount, onDestroy } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	type GameState = 'prestart' | 'playing' | 'gameover' | 'victory';
	let gameState: GameState = 'prestart';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let OST: HTMLAudioElement;
	let audioCtx: AudioContext | null = null;
	let animFrameId: number;

	// Stats & HUD
	let score = 0;
	let combo = 1;
	let comboTimer = 0;
	let totalFilesCount = 0;
	let remainingFilesCount = 0;
	let soundEnabled = true;

	const encouragingMessages = [
		'Dall’Italia: "Non mollare Daniele, siamo con te!"',
		'From Tokyo: "A future is not given to you. It is something you must take for yourself."',
		'From Berlin: "Never surrender! Keep fighting!"',
		'From New York: "You are capable of amazing things!"',
		'From Seoul: "We believe in you. Pod fire ready!"',
		'From London: "Your story is not over yet!"',
		'[ POD 042 ]: Auxiliary combat protocol engaged.',
		'[ POD 153 ]: Continuous tactical assistance confirmed.'
	];

	// Ship (Player)
	const ship = {
		x: 450,
		y: 550,
		targetX: 450,
		targetY: 550,
		width: 32,
		height: 36,
		lives: 3,
		invulnerableTimer: 0,
		lastShot: 0,
		shootDelay: 170,
		tilt: 0
	};

	interface Projectile {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		color: string;
		active: boolean;
		isPlayer: boolean;
	}

	interface Enemy {
		id: number;
		x: number;
		y: number;
		targetY: number;
		width: number;
		height: number;
		text: string;
		health: number;
		maxHealth: number;
		lastShot: number;
		shootDelay: number;
		hitFlash: number;
		floatOffset: number;
	}

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		color: string;
		alpha: number;
		decay: number;
		type: 'spark' | 'ring' | 'smoke' | 'text';
		text?: string;
	}

	interface FloatingMessage {
		id: number;
		text: string;
		x: number;
		y: number;
		vy: number;
		alpha: number;
		color: string;
	}

	let shipProjectiles: Projectile[] = [];
	let enemyProjectiles: Projectile[] = [];
	let textEnemies: Enemy[] = [];
	let particles: Particle[] = [];
	let floatingMessages: FloatingMessage[] = [];
	let possibleEnemies: string[] = [];

	let gameTime = 0;
	let lastEnemySpawn = 0;
	let cameraShake = 0;
	let nextEnemyId = 1;
	let nextMessageId = 1;

	// Controls
	const keys: Record<string, boolean> = {
		ArrowLeft: false,
		ArrowRight: false,
		ArrowUp: false,
		ArrowDown: false,
		KeyA: false,
		KeyD: false,
		KeyW: false,
		KeyS: false,
		Space: false
	};

	let mouseX = 450;
	let mouseY = 550;
	let isMouseDown = false;
	let useMouseControl = false;

	// 3D Background Grid & Cyber Starfield
	interface Star {
		x: number;
		y: number;
		z: number;
	}
	const stars: Star[] = Array.from({ length: 70 }, () => ({
		x: (Math.random() - 0.5) * 1000,
		y: (Math.random() - 0.5) * 700,
		z: Math.random() * 800 + 100
	}));
	let gridOffset = 0;

	// Web Audio Synthesizer (SFX)
	function initAudio() {
		try {
			const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
			if (AudioContextClass && !audioCtx) {
				audioCtx = new AudioContextClass();
			}
			if (audioCtx && audioCtx.state === 'suspended') {
				audioCtx.resume();
			}
		} catch (e) {
			console.warn('AudioContext not available:', e);
		}
	}

	function playSound(type: 'laser' | 'hit' | 'explosion' | 'damage' | 'victory') {
		if (!soundEnabled || !audioCtx) return;
		try {
			const now = audioCtx.currentTime;
			const osc = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			osc.connect(gain);
			gain.connect(audioCtx.destination);

			if (type === 'laser') {
				osc.type = 'sawtooth';
				osc.frequency.setValueAtTime(880, now);
				osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
				gain.gain.setValueAtTime(0.12, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
				osc.start(now);
				osc.stop(now + 0.08);
			} else if (type === 'hit') {
				osc.type = 'triangle';
				osc.frequency.setValueAtTime(1200, now);
				osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
				gain.gain.setValueAtTime(0.15, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
				osc.start(now);
				osc.stop(now + 0.05);
			} else if (type === 'explosion') {
				osc.type = 'square';
				osc.frequency.setValueAtTime(160, now);
				osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
				gain.gain.setValueAtTime(0.25, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
				osc.start(now);
				osc.stop(now + 0.35);
			} else if (type === 'damage') {
				osc.type = 'sawtooth';
				osc.frequency.setValueAtTime(120, now);
				osc.frequency.linearRampToValueAtTime(60, now + 0.25);
				gain.gain.setValueAtTime(0.3, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
				osc.start(now);
				osc.stop(now + 0.25);
			} else if (type === 'victory') {
				[440, 554, 659, 880].forEach((freq, i) => {
					const noteOsc = audioCtx!.createOscillator();
					const noteGain = audioCtx!.createGain();
					noteOsc.connect(noteGain);
					noteGain.connect(audioCtx!.destination);
					noteOsc.type = 'sine';
					noteOsc.frequency.setValueAtTime(freq, now + i * 0.1);
					noteGain.gain.setValueAtTime(0.15, now + i * 0.1);
					noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
					noteOsc.start(now + i * 0.1);
					noteOsc.stop(now + i * 0.1 + 0.35);
				});
			}
		} catch (e) {
			console.warn('Error playing SFX:', e);
		}
	}

	function spawnExplosion(x: number, y: number, color = '#cd674d', count = 30) {
		cameraShake = Math.max(cameraShake, 6);
		// Shockwave ring
		particles.push({
			x,
			y,
			vx: 0,
			vy: 0,
			radius: 8,
			color,
			alpha: 1,
			decay: 0.04,
			type: 'ring'
		});

		// Debris sparks
		for (let i = 0; i < count; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 5 + 1.5;
			particles.push({
				x,
				y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				radius: Math.random() * 3 + 1,
				color: Math.random() > 0.4 ? color : '#ece7d5',
				alpha: 1,
				decay: Math.random() * 0.03 + 0.015,
				type: 'spark'
			});
		}
	}

	function spawnDamageText(x: number, y: number, text: string, color = '#cd674d') {
		particles.push({
			x,
			y,
			vx: (Math.random() - 0.5) * 1.5,
			vy: -2,
			radius: 0,
			color,
			alpha: 1,
			decay: 0.025,
			type: 'text',
			text
		});
	}

	function spawnEncouragingMessage() {
		const msg = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
		floatingMessages.push({
			id: nextMessageId++,
			text: msg,
			x: Math.random() * (canvas.width - 320) + 40,
			y: canvas.height - 40,
			vy: -(Math.random() * 0.6 + 0.5),
			alpha: 1,
			color: '#e1d8aa'
		});
	}

	function triggerStart() {
		initAudio();
		if (OST) {
			OST.play().catch((err) => console.log('Audio autoplay prevented:', err));
		}
		startGame();
	}

	function startGame() {
		if (!canvas || !ctx) return;

		// Initialize enemy pool
		const filePool =
			data?.files && data.files.length > 0
				? [...data.files]
				: [
						'Author.svelte',
						'app.css',
						'lib/types.ts',
						'lib/utils.ts',
						'posts/recensione-nier-automata.md',
						'posts/outer-wilds.md',
						'progetti/portfolio.md'
					];
		possibleEnemies = filePool;
		totalFilesCount = filePool.length;
		remainingFilesCount = filePool.length;

		ship.x = canvas.width / 2;
		ship.y = canvas.height - 90;
		ship.targetX = ship.x;
		ship.targetY = ship.y;
		ship.lives = 3;
		ship.invulnerableTimer = 0;
		ship.tilt = 0;

		shipProjectiles = [];
		enemyProjectiles = [];
		textEnemies = [];
		particles = [];
		floatingMessages = [];

		score = 0;
		combo = 1;
		comboTimer = 0;
		gameTime = 0;
		lastEnemySpawn = 0;
		cameraShake = 0;

		gameState = 'playing';

		// Spawn initial encouraging message
		spawnEncouragingMessage();

		cancelAnimationFrame(animFrameId);
		animFrameId = requestAnimationFrame(gameLoop);
	}

	function restartGame() {
		if (OST) {
			OST.currentTime = 0;
			OST.play().catch((e) => console.log(e));
		}
		startGame();
	}

	function spawnEnemy() {
		if (gameTime - lastEnemySpawn < 2500 || textEnemies.length >= 4) return;
		if (possibleEnemies.length === 0) return;

		const idx = Math.floor(Math.random() * possibleEnemies.length);
		const fileName = possibleEnemies.splice(idx, 1)[0];
		remainingFilesCount = possibleEnemies.length;

		// Calculate size based on name length
		ctx.font = 'bold 14px "JetBrains Mono", monospace';
		const textWidth = Math.max(120, ctx.measureText(fileName).width + 30);

		const padding = 60;
		const spawnX = Math.random() * (canvas.width - textWidth - padding * 2) + padding;
		const targetY = Math.random() * 160 + 50;

		textEnemies.push({
			id: nextEnemyId++,
			x: spawnX,
			y: -40,
			targetY,
			width: textWidth,
			height: 34,
			text: fileName,
			health: 6,
			maxHealth: 6,
			lastShot: gameTime + Math.random() * 1000,
			shootDelay: Math.random() * 1200 + 1400,
			hitFlash: 0,
			floatOffset: Math.random() * Math.PI * 2
		});

		lastEnemySpawn = gameTime;

		// Random chance of triggering an inspiring message
		if (Math.random() < 0.35 && floatingMessages.length < 3) {
			spawnEncouragingMessage();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.code in keys) {
			e.preventDefault();
			keys[e.code] = true;
			useMouseControl = false;
		}
		if (e.code === 'KeyR' && (gameState === 'gameover' || gameState === 'victory')) {
			restartGame();
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.code in keys) {
			e.preventDefault();
			keys[e.code] = false;
		}
	}

	function handleMouseMove(e: MouseEvent) {
		if (gameState !== 'playing') return;
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		mouseX = (e.clientX - rect.left) * scaleX;
		mouseY = (e.clientY - rect.top) * scaleY;
		useMouseControl = true;
	}

	function handleMouseDown(e: MouseEvent) {
		if (e.button === 0) {
			isMouseDown = true;
			useMouseControl = true;
		}
	}

	function handleMouseUp(e: MouseEvent) {
		if (e.button === 0) {
			isMouseDown = false;
		}
	}

	function updatePlayer() {
		const speed = 7;
		let vx = 0;
		let vy = 0;

		if (useMouseControl) {
			const dx = mouseX - ship.x;
			const dy = mouseY - ship.y;
			ship.x += dx * 0.15;
			ship.y += dy * 0.15;
			vx = dx * 0.15;
		} else {
			if (keys.ArrowLeft || keys.KeyA) vx -= speed;
			if (keys.ArrowRight || keys.KeyD) vx += speed;
			if (keys.ArrowUp || keys.KeyW) vy -= speed;
			if (keys.ArrowDown || keys.KeyS) vy += speed;

			ship.x += vx;
			ship.y += vy;
		}

		// Clamp to canvas borders
		const halfW = ship.width / 2;
		ship.x = Math.max(halfW + 10, Math.min(canvas.width - halfW - 10, ship.x));
		ship.y = Math.max(50, Math.min(canvas.height - 30, ship.y));

		// Smooth banking tilt
		ship.tilt += (vx * 0.08 - ship.tilt) * 0.2;

		if (ship.invulnerableTimer > 0) {
			ship.invulnerableTimer--;
		}

		// Thruster plasma particles
		if (Math.random() < 0.8) {
			particles.push({
				x: ship.x + (Math.random() - 0.5) * 10,
				y: ship.y + ship.height / 2 + 4,
				vx: (Math.random() - 0.5) * 1.5,
				vy: Math.random() * 3 + 3,
				radius: Math.random() * 2.5 + 1.2,
				color: Math.random() > 0.4 ? '#ece7d5' : '#cd674d',
				alpha: 0.9,
				decay: 0.06,
				type: 'spark'
			});
		}

		// Player shooting
		const wantsToShoot = keys.Space || isMouseDown;
		if (wantsToShoot && gameTime - ship.lastShot >= ship.shootDelay) {
			ship.lastShot = gameTime;
			playSound('laser');

			// Dual Pod lasers
			shipProjectiles.push(
				{
					x: ship.x - 10,
					y: ship.y - 12,
					vx: 0,
					vy: -14,
					radius: 3,
					color: '#ece7d5',
					active: true,
					isPlayer: true
				},
				{
					x: ship.x + 10,
					y: ship.y - 12,
					vx: 0,
					vy: -14,
					radius: 3,
					color: '#ece7d5',
					active: true,
					isPlayer: true
				}
			);
		}
	}

	function updateEnemies() {
		textEnemies.forEach((enemy) => {
			if (enemy.y < enemy.targetY) {
				enemy.y += 2.5;
			} else {
				// Gentle floating oscillation
				enemy.y = enemy.targetY + Math.sin(gameTime * 0.003 + enemy.floatOffset) * 6;
			}

			if (enemy.hitFlash > 0) enemy.hitFlash--;

			// Enemy firing bullets
			if (gameTime - enemy.lastShot >= enemy.shootDelay && enemy.y >= enemy.targetY - 10) {
				enemy.lastShot = gameTime;
				const angleToPlayer = Math.atan2(ship.y - enemy.y, ship.x - enemy.x);
				const bulletSpeed = 3.2;

				// Aimed orb + side orbs
				enemyProjectiles.push({
					x: enemy.x + enemy.width / 2,
					y: enemy.y + enemy.height,
					vx: Math.cos(angleToPlayer) * bulletSpeed,
					vy: Math.sin(angleToPlayer) * bulletSpeed,
					radius: 8,
					color: '#cd674d',
					active: true,
					isPlayer: false
				});

				if (Math.random() < 0.4) {
					enemyProjectiles.push({
						x: enemy.x + enemy.width / 2,
						y: enemy.y + enemy.height,
						vx: Math.cos(angleToPlayer + 0.35) * bulletSpeed,
						vy: Math.sin(angleToPlayer + 0.35) * bulletSpeed,
						radius: 7,
						color: '#cd674d',
						active: true,
						isPlayer: false
					});
					enemyProjectiles.push({
						x: enemy.x + enemy.width / 2,
						y: enemy.y + enemy.height,
						vx: Math.cos(angleToPlayer - 0.35) * bulletSpeed,
						vy: Math.sin(angleToPlayer - 0.35) * bulletSpeed,
						radius: 7,
						color: '#cd674d',
						active: true,
						isPlayer: false
					});
				}
			}
		});
	}

	function updateProjectiles() {
		// Player projectiles
		shipProjectiles.forEach((p) => {
			p.x += p.vx;
			p.y += p.vy;
			if (p.y < -20) p.active = false;
		});
		shipProjectiles = shipProjectiles.filter((p) => p.active);

		// Enemy projectiles
		enemyProjectiles.forEach((p) => {
			p.x += p.vx;
			p.y += p.vy;
			if (p.x < -20 || p.x > canvas.width + 20 || p.y > canvas.height + 20) {
				p.active = false;
			}
		});
		enemyProjectiles = enemyProjectiles.filter((p) => p.active);
	}

	function checkCollisions() {
		// 1. Player projectiles vs Enemy data monoliths
		shipProjectiles.forEach((proj) => {
			textEnemies.forEach((enemy) => {
				if (
					proj.x >= enemy.x &&
					proj.x <= enemy.x + enemy.width &&
					proj.y >= enemy.y &&
					proj.y <= enemy.y + enemy.height
				) {
					proj.active = false;
					enemy.health--;
					enemy.hitFlash = 3;
					playSound('hit');

					// Sparks on impact
					for (let i = 0; i < 4; i++) {
						particles.push({
							x: proj.x,
							y: proj.y,
							vx: (Math.random() - 0.5) * 4,
							vy: (Math.random() - 0.5) * 4,
							radius: Math.random() * 2 + 1,
							color: '#ece7d5',
							alpha: 1,
							decay: 0.08,
							type: 'spark'
						});
					}

					if (enemy.health <= 0) {
						// Destroy enemy
						playSound('explosion');
						spawnExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#cd674d', 40);
						spawnDamageText(enemy.x + enemy.width / 2, enemy.y, `+${100 * combo}`, '#e1d8aa');

						score += 100 * combo;
						comboTimer = 180;
						combo = Math.min(10, combo + 1);
					}
				}
			});
		});

		textEnemies = textEnemies.filter((e) => e.health > 0);

		// 2. Player projectiles vs Enemy projectiles (NieR mechanic: you can shoot down bullets!)
		shipProjectiles.forEach((sp) => {
			enemyProjectiles.forEach((ep) => {
				const dist = Math.hypot(sp.x - ep.x, sp.y - ep.y);
				if (dist < sp.radius + ep.radius + 4) {
					sp.active = false;
					ep.active = false;
					score += 10;
					for (let i = 0; i < 3; i++) {
						particles.push({
							x: ep.x,
							y: ep.y,
							vx: (Math.random() - 0.5) * 3,
							vy: (Math.random() - 0.5) * 3,
							radius: 2,
							color: '#cd674d',
							alpha: 1,
							decay: 0.09,
							type: 'spark'
						});
					}
				}
			});
		});

		// 3. Enemy projectiles vs Player Ship
		if (ship.invulnerableTimer === 0) {
			enemyProjectiles.forEach((ep) => {
				const dist = Math.hypot(ship.x - ep.x, ship.y - ep.y);
				if (dist < ep.radius + 12) {
					ep.active = false;
					ship.lives--;
					ship.invulnerableTimer = 90; // ~1.5s invulnerability
					combo = 1;
					playSound('damage');
					spawnExplosion(ship.x, ship.y, '#cd674d', 25);

					if (ship.lives <= 0) {
						gameState = 'gameover';
					}
				}
			});
		}

		// Combo timer decrement
		if (comboTimer > 0) {
			comboTimer--;
			if (comboTimer === 0) combo = 1;
		}

		// Victory check: all enemies and queue cleared
		if (possibleEnemies.length === 0 && textEnemies.length === 0 && gameState === 'playing') {
			gameState = 'victory';
			playSound('victory');
			spawnExplosion(canvas.width / 2, canvas.height / 2, '#ece7d5', 80);
		}
	}

	function updateParticles() {
		particles.forEach((p) => {
			p.x += p.vx;
			p.y += p.vy;
			p.alpha -= p.decay;

			if (p.type === 'ring') {
				p.radius += 2.5;
			}
		});
		particles = particles.filter((p) => p.alpha > 0);

		// Floating encouragement messages
		floatingMessages.forEach((msg) => {
			msg.y += msg.vy;
			if (msg.y < 100) msg.alpha -= 0.015;
		});
		floatingMessages = floatingMessages.filter((msg) => msg.alpha > 0);
	}

	// Canvas Rendering Pipeline
	function drawBackground() {
		// Deep NieR cyber dark gradient
		const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
		grad.addColorStop(0, '#1c1b17');
		grad.addColorStop(1, '#2c2a23');
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// 3D Perspective Grid
		gridOffset = (gridOffset + 1.2) % 40;
		ctx.save();
		ctx.strokeStyle = 'rgba(200, 194, 170, 0.12)';
		ctx.lineWidth = 1;

		const horizon = 120;
		const fov = 350;

		// Horizontal depth lines
		for (let z = 50; z < 700; z += 35) {
			const dynamicZ = ((z + gridOffset) % 650) + 50;
			const y = horizon + (fov / dynamicZ) * 60;
			if (y < canvas.height) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(canvas.width, y);
				ctx.stroke();
			}
		}

		// Perspective vanishing lines
		const vanishingX = canvas.width / 2;
		for (let x = -canvas.width; x <= canvas.width * 2; x += 60) {
			ctx.beginPath();
			ctx.moveTo(vanishingX, horizon);
			ctx.lineTo(x, canvas.height);
			ctx.stroke();
		}
		ctx.restore();

		// Floating 3D Starfield / Data motes
		ctx.save();
		stars.forEach((star) => {
			star.z -= 1.5;
			if (star.z <= 10) {
				star.z = 800;
				star.x = (Math.random() - 0.5) * 1000;
				star.y = (Math.random() - 0.5) * 700;
			}
			const screenX = canvas.width / 2 + (star.x / star.z) * 400;
			const screenY = canvas.height / 2 + (star.y / star.z) * 400;
			const size = Math.max(0.5, (1 - star.z / 800) * 2.5);
			const alpha = Math.max(0.1, (1 - star.z / 800) * 0.6);

			if (screenX >= 0 && screenX <= canvas.width && screenY >= 0 && screenY <= canvas.height) {
				ctx.fillStyle = `rgba(236, 231, 213, ${alpha})`;
				ctx.beginPath();
				ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
				ctx.fill();
			}
		});
		ctx.restore();

		// Subtle scanlines overlay
		ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
		for (let y = 0; y < canvas.height; y += 4) {
			ctx.fillRect(0, y, canvas.width, 1.5);
		}
	}

	function drawShip() {
		// If invulnerable, flicker
		if (ship.invulnerableTimer > 0 && Math.floor(ship.invulnerableTimer / 4) % 2 === 0) {
			return;
		}

		ctx.save();
		ctx.translate(ship.x, ship.y);
		ctx.rotate(ship.tilt);

		// Outer glowing chevron
		ctx.shadowBlur = 12;
		ctx.shadowColor = '#ece7d5';
		ctx.strokeStyle = '#ece7d5';
		ctx.lineWidth = 2.5;

		ctx.beginPath();
		ctx.moveTo(0, -ship.height / 2);
		ctx.lineTo(ship.width / 2, ship.height / 2);
		ctx.lineTo(0, ship.height / 2 - 8);
		ctx.lineTo(-ship.width / 2, ship.height / 2);
		ctx.closePath();
		ctx.fillStyle = 'rgba(77, 73, 62, 0.85)';
		ctx.fill();
		ctx.stroke();

		// Inner energy core
		ctx.fillStyle = '#ffffff';
		ctx.beginPath();
		ctx.moveTo(0, -ship.height / 4);
		ctx.lineTo(ship.width / 4, ship.height / 4);
		ctx.lineTo(0, ship.height / 4 - 3);
		ctx.lineTo(-ship.width / 4, ship.height / 4);
		ctx.closePath();
		ctx.fill();

		// Invulnerability shield sphere
		if (ship.invulnerableTimer > 0) {
			ctx.beginPath();
			ctx.arc(0, 0, ship.width + 6, 0, Math.PI * 2);
			ctx.strokeStyle = `rgba(205, 103, 77, ${Math.sin(gameTime * 0.02) * 0.4 + 0.6})`;
			ctx.lineWidth = 2;
			ctx.setLineDash([6, 4]);
			ctx.stroke();
			ctx.setLineDash([]);
		}

		ctx.restore();
	}

	function drawProjectiles() {
		// Player laser beams
		ctx.save();
		ctx.shadowBlur = 10;
		ctx.shadowColor = '#ece7d5';
		ctx.fillStyle = '#ffffff';
		shipProjectiles.forEach((p) => {
			ctx.fillRect(p.x - 2, p.y - 12, 4, 18);
		});
		ctx.restore();

		// Enemy NieR energy orbs
		enemyProjectiles.forEach((p) => {
			ctx.save();
			// Outer energy ring
			ctx.shadowBlur = 12;
			ctx.shadowColor = p.color;
			const orbGrad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, p.radius);
			orbGrad.addColorStop(0, '#ffffff');
			orbGrad.addColorStop(0.4, p.color);
			orbGrad.addColorStop(1, 'rgba(61, 59, 52, 0.9)');

			ctx.fillStyle = orbGrad;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
			ctx.fill();

			ctx.strokeStyle = '#ffffff';
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.restore();
		});
	}

	function drawEnemies() {
		textEnemies.forEach((enemy) => {
			ctx.save();
			ctx.translate(enemy.x, enemy.y);

			// Holographic glass card
			ctx.fillStyle = enemy.hitFlash > 0 ? 'rgba(236, 231, 213, 0.9)' : 'rgba(61, 59, 52, 0.85)';
			ctx.strokeStyle = enemy.hitFlash > 0 ? '#cd674d' : '#4d493e';
			ctx.lineWidth = 1.5;

			// NieR corner notched box
			ctx.beginPath();
			ctx.rect(0, 0, enemy.width, enemy.height);
			ctx.fill();
			ctx.stroke();

			// Corner accents
			ctx.fillStyle = '#cd674d';
			ctx.fillRect(0, 0, 4, 4);
			ctx.fillRect(enemy.width - 4, 0, 4, 4);
			ctx.fillRect(0, enemy.height - 4, 4, 4);
			ctx.fillRect(enemy.width - 4, enemy.height - 4, 4, 4);

			// Health bar on top
			const hpPercent = enemy.health / enemy.maxHealth;
			ctx.fillStyle = 'rgba(77, 73, 62, 0.5)';
			ctx.fillRect(2, -8, enemy.width - 4, 4);
			ctx.fillStyle = hpPercent > 0.4 ? '#e1d8aa' : '#cd674d';
			ctx.fillRect(2, -8, (enemy.width - 4) * hpPercent, 4);

			// Filename text
			ctx.font = '12px "JetBrains Mono", monospace';
			ctx.fillStyle = enemy.hitFlash > 0 ? '#3d3b34' : '#ece7d5';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(enemy.text, enemy.width / 2, enemy.height / 2 + 1);

			ctx.restore();
		});
	}

	function drawParticles() {
		particles.forEach((p) => {
			ctx.save();
			ctx.globalAlpha = Math.max(0, p.alpha);

			if (p.type === 'spark') {
				ctx.fillStyle = p.color;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx.fill();
			} else if (p.type === 'ring') {
				ctx.strokeStyle = p.color;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx.stroke();
			} else if (p.type === 'text' && p.text) {
				ctx.font = 'bold 15px "JetBrains Mono", monospace';
				ctx.fillStyle = p.color;
				ctx.textAlign = 'center';
				ctx.fillText(p.text, p.x, p.y);
			}
			ctx.restore();
		});

		// Floating Ending E messages
		floatingMessages.forEach((msg) => {
			ctx.save();
			ctx.globalAlpha = Math.max(0, msg.alpha);
			ctx.font = '13px "JetBrains Mono", monospace';
			ctx.fillStyle = msg.color;
			ctx.shadowBlur = 8;
			ctx.shadowColor = msg.color;
			ctx.fillText(msg.text, msg.x, msg.y);
			ctx.restore();
		});
	}

	function drawHUD() {
		ctx.save();
		// Top HUD Bar
		ctx.font = '12px "JetBrains Mono", monospace';
		ctx.fillStyle = '#ece7d5';

		// Score & Combo
		ctx.textAlign = 'left';
		ctx.fillText(`PUNTEGGIO: ${score.toLocaleString()}`, 20, 30);
		if (combo > 1) {
			ctx.fillStyle = '#cd674d';
			ctx.font = 'bold 13px "JetBrains Mono", monospace';
			ctx.fillText(`COMBO x${combo}`, 20, 50);
		}

		// Files Remaining
		ctx.font = '12px "JetBrains Mono", monospace';
		ctx.fillStyle = '#ece7d5';
		ctx.textAlign = 'right';
		ctx.fillText(
			`MODULI DA SALVARE: ${remainingFilesCount} / ${totalFilesCount}`,
			canvas.width - 20,
			30
		);

		// Lives (Pod Assist Icons)
		ctx.textAlign = 'left';
		ctx.fillText('UNITA POD // VITE:', 20, canvas.height - 25);
		for (let i = 0; i < 3; i++) {
			ctx.save();
			ctx.translate(170 + i * 28, canvas.height - 30);
			if (i < ship.lives) {
				ctx.fillStyle = '#cd674d';
				ctx.beginPath();
				ctx.moveTo(0, -9);
				ctx.lineTo(8, 7);
				ctx.lineTo(-8, 7);
				ctx.closePath();
				ctx.fill();
			} else {
				ctx.strokeStyle = 'rgba(77, 73, 62, 0.6)';
				ctx.lineWidth = 1.5;
				ctx.beginPath();
				ctx.moveTo(0, -9);
				ctx.lineTo(8, 7);
				ctx.lineTo(-8, 7);
				ctx.closePath();
				ctx.stroke();
			}
			ctx.restore();
		}
		ctx.restore();
	}

	function gameLoop(timestamp: number) {
		if (gameState !== 'playing') {
			drawOverlayScreen();
			return;
		}

		gameTime = timestamp;

		// Update logic
		spawnEnemy();
		updatePlayer();
		updateEnemies();
		updateProjectiles();
		checkCollisions();
		updateParticles();

		// Screen Shake
		ctx.save();
		if (cameraShake > 0) {
			const shakeX = (Math.random() - 0.5) * cameraShake;
			const shakeY = (Math.random() - 0.5) * cameraShake;
			ctx.translate(shakeX, shakeY);
			cameraShake *= 0.9;
			if (cameraShake < 0.3) cameraShake = 0;
		}

		// Render Pipeline
		drawBackground();
		drawProjectiles();
		drawShip();
		drawEnemies();
		drawParticles();
		drawHUD();

		ctx.restore();

		animFrameId = requestAnimationFrame(gameLoop);
	}

	function drawOverlayScreen() {
		// Render ambient background even in menu
		drawBackground();
		drawParticles();

		if (gameState === 'gameover') {
			ctx.save();
			ctx.fillStyle = 'rgba(46, 45, 39, 0.85)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.textAlign = 'center';
			ctx.font = 'bold 36px "JetBrains Mono", monospace';
			ctx.fillStyle = '#cd674d';
			ctx.shadowBlur = 15;
			ctx.shadowColor = '#cd674d';
			ctx.fillText('SEGNALE PERSO // GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

			ctx.font = '16px "JetBrains Mono", monospace';
			ctx.fillStyle = '#ece7d5';
			ctx.shadowBlur = 0;
			ctx.fillText(
				'I dati non sono ancora stati cancellati. Vuoi rinunciare?',
				canvas.width / 2,
				canvas.height / 2 + 10
			);
			ctx.fillText(`Punteggio Finale: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
			ctx.restore();
		} else if (gameState === 'victory') {
			ctx.save();
			ctx.fillStyle = 'rgba(46, 45, 39, 0.85)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.textAlign = 'center';
			ctx.font = 'bold 38px "JetBrains Mono", monospace';
			ctx.fillStyle = '#e1d8aa';
			ctx.shadowBlur = 15;
			ctx.shadowColor = '#e1d8aa';
			ctx.fillText('MISSIONE COMPIUTA // YOU WIN!', canvas.width / 2, canvas.height / 2 - 40);

			ctx.font = '16px "JetBrains Mono", monospace';
			ctx.fillStyle = '#ece7d5';
			ctx.shadowBlur = 0;
			ctx.fillText(
				'Tutti i dati e i file di sistema sono stati salvati con successo.',
				canvas.width / 2,
				canvas.height / 2 + 10
			);
			ctx.fillText(`Punteggio Finale: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
			ctx.restore();
		}
	}

	onMount(() => {
		canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d')!;
		canvas.width = 900;
		canvas.height = 650;

		// Audio track setup
		OST = new Audio('/sounds/wotw.mp3');
		OST.volume = 0.75;
		OST.loop = true;

		// Pre-render ambient background
		drawBackground();

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		}
		if (OST) {
			OST.pause();
			OST.currentTime = 0;
		}
		if (audioCtx) {
			audioCtx.close().catch(() => {});
		}
		cancelAnimationFrame(animFrameId);
	});
</script>

<Seo
	title="End of the Lova // Minigame NieR"
	description="Salva i file di sistema nel minigioco di hacking in stile NieR:Automata"
/>

<div class="game-wrapper">
	<div class="terminal-header">
		<span class="system-tag">[ SYSTEM: POD 042 // HACKING PROTOCOL ]</span>
		<div class="status-indicators">
			<span class="indicator-dot"></span>
			<span>OST: Weight of the World</span>
		</div>
	</div>

	<div class="canvas-container">
		<canvas
			id="gameCanvas"
			on:mousemove={handleMouseMove}
			on:mousedown={handleMouseDown}
			on:mouseup={handleMouseUp}
		></canvas>

		<!-- Pre-start Mission Briefing Overlay -->
		{#if gameState === 'prestart'}
			<div class="mission-modal">
				<div class="modal-inner">
					<div class="briefing-header">
						<span class="badge">[ MISSION INITIALIZATION ]</span>
						<h1>END OF THE LOVA</h1>
						<p class="subtitle">DATA SALVAGE PROTOCOL // ENDING E</p>
					</div>

					<div class="briefing-body">
						<p>
							I file del progetto sono sotto attacco. Pilota il cursore di hacking per intercettare
							ed eliminare le minacce prima che i moduli vengano compromessi.
						</p>

						<div class="controls-card">
							<div class="control-row">
								<span class="key-badge">W A S D</span> o <span class="key-badge">← ↑ → ↓</span>
								<span class="action-desc">Movimento Nave Hacking</span>
							</div>
							<div class="control-row">
								<span class="key-badge">SPAZIO</span> o <span class="key-badge">CLICK MOUSE</span>
								<span class="action-desc">Fuoco Laser Pod</span>
							</div>
							<div class="control-row">
								<span class="key-badge">NOTA</span>
								<span class="action-desc">I tuoi laser possono abbattere i proiettili nemici!</span>
							</div>
						</div>
					</div>

					<button class="btn-start" on:click={triggerStart}>
						<span class="bracket">[</span> INIZIA MISSIONE // START <span class="bracket">]</span>
					</button>
				</div>
			</div>
		{/if}

		<!-- Game Over & Victory interactive button overlay -->
		{#if gameState === 'gameover' || gameState === 'victory'}
			<div class="endgame-controls">
				<button class="btn-restart" on:click={restartGame}>
					<span class="bracket">[</span> RIGUADAGNA IL FUTURO // RESTART
					<span class="bracket">]</span>
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.game-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 1.5rem auto;
		max-width: 950px;
		width: 100%;
	}

	.terminal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 900px;
		padding: 0.6rem 1rem;
		background: var(--automataBgRGBA);
		border: 1px solid var(--automataColor);
		border-bottom: none;
		box-sizing: border-box;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--automataColor);
		letter-spacing: 0.1rem;
	}

	.status-indicators {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
	}

	.indicator-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--automataRed);
		box-shadow: 0 0 8px var(--automataRed);
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	.canvas-container {
		position: relative;
		width: 100%;
		max-width: 900px;
		box-shadow: 6px 6px 0 rgba(77, 73, 62, 0.4);
		border: 1px solid var(--automataColor);
		overflow: hidden;
		background: #1c1b17;
	}

	canvas {
		display: block;
		width: 100%;
		height: auto;
		background-color: #1c1b17;
		cursor: crosshair;
	}

	/* Mission Start Briefing Modal */
	.mission-modal {
		position: absolute;
		inset: 0;
		background: rgba(28, 27, 23, 0.88);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: 1.5rem;
	}

	.modal-inner {
		max-width: 540px;
		width: 100%;
		background: var(--automataBg);
		border: 1px solid var(--automataColor);
		box-shadow: 8px 8px 0 rgba(77, 73, 62, 0.6);
		padding: 2rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.briefing-header {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		border-bottom: 1px solid var(--automataColor);
		padding-bottom: 0.8rem;
	}

	.badge {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.15rem;
		color: var(--automataWhite);
		background: var(--automataRed);
		padding: 0.2rem 0.5rem;
		width: fit-content;
	}

	h1 {
		font-size: 1.6rem;
		font-weight: 700;
		letter-spacing: 0.2rem;
		color: var(--automataColor);
		margin: 0.3rem 0 0 0;
	}

	.subtitle {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--automataColor);
		opacity: 0.75;
		margin: 0;
		letter-spacing: 0.1rem;
	}

	.briefing-body p {
		font-size: 0.95rem;
		color: var(--automataColor);
		line-height: 1.6;
		margin: 0 0 1rem 0;
	}

	.controls-card {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		background: var(--automataBgRGBA);
		border: 1px solid var(--automataColor);
		padding: 1rem;
		margin-bottom: 0.5rem;
	}

	.control-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--automataColor);
	}

	.key-badge {
		background: var(--automataColor);
		color: var(--automataBg);
		padding: 0.2rem 0.5rem;
		font-weight: 700;
		font-size: 0.8rem;
	}

	.action-desc {
		font-size: 0.85rem;
		opacity: 0.9;
	}

	.btn-start,
	.btn-restart {
		font-family: var(--font-mono);
		font-size: 0.95rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.25rem;
		padding: 0.85rem 1.5rem;
		background: var(--automataColor);
		color: var(--automataBg);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		box-shadow: none;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		text-align: center;
	}

	.btn-start:hover,
	.btn-restart:hover {
		background: var(--automataRed);
		border-color: var(--automataRed);
		color: var(--automataWhite);
		transform: translateY(-2px);
		box-shadow: 4px 4px 0 rgba(77, 73, 62, 0.4);
	}

	.bracket {
		color: var(--automataRed);
	}

	.endgame-controls {
		position: absolute;
		bottom: 15%;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		z-index: 100;
	}
</style>
