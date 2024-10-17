<!-- src/routes/game/+page.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let gameActive = false;
	let showRestartButton = false;
	let OST: HTMLAudioElement;

	const encouragingMessages = [
		'Believe in yourself! Your journey matters.',
		'Every setback is a setup for a comeback!',
		'Your potential is limitless!',
		'Dream big, stay strong!',
		"You're capable of amazing things!",
		'Never give up on your dreams!',
		"Your story isn't over yet!",
		'Rise and shine, try again!'
	];

	const ship = {
		x: 0,
		y: 0,
		width: 30,
		height: 30,
		lives: 3,
		lastShot: 0,
		shootDelay: 200 // Decreased from 250 to 200 for faster shooting
	};

	let shipProjectiles: any[] = [];
	let possibleEnemies: any[] = [];
	let textEnemies: any[] = [];
	let gameTime = 0;
	let lastEnemySpawn = 0;

	const keys: Record<string, boolean> = {
		ArrowLeft: false,
		ArrowRight: false,
		ArrowUp: false,
		ArrowDown: false,
		Space: false
	};

	function initGame() {


		if (!canvas || !ctx) return;

		// if the ost is already playing, don't play it again
		if (OST.currentTime > 0) {
			return;
		} else {
			OST.play().catch((e) => console.log('Audio play failed:', e));
		}

		ship.x = canvas.width / 2 - ship.width / 2;
		ship.y = canvas.height - ship.height - 10;
		ship.lives = 3;
		shipProjectiles = [];
		textEnemies = [];
		gameTime = 0;
		lastEnemySpawn = 0;
		gameActive = true;
		showRestartButton = false;


		requestAnimationFrame(gameLoop);
	}

	function restartGame() {
		OST.pause();
		OST.currentTime = 0;
		initGame();
	}



	function isOverlapping(newEnemy: any, existingEnemies: any[]) {
		return existingEnemies.some((enemy) => {
			const horizontalOverlap =
				newEnemy.x < enemy.x + enemy.width + 50 && newEnemy.x + newEnemy.width + 50 > enemy.x;
			const verticalOverlap = Math.abs(newEnemy.targetY - enemy.targetY) < enemy.height + 30;
			return horizontalOverlap && verticalOverlap;
		});
	}

	function spawnEnemy() {
		if (gameTime - lastEnemySpawn < 3000 || textEnemies.length >= 4) return;

		const spawnTwo = Math.random() < 0.3 && textEnemies.length === 0;
		const availableTexts = possibleEnemies.filter(
			(text) => !textEnemies.some((enemy) => enemy.text === text)
		);

		if (availableTexts.length === 0) return;

		const createEnemy = () => {
			const text = availableTexts[Math.floor(Math.random() * availableTexts.length)];
			const potentialEnemy = {
				x: 100 + Math.random() * (canvas.width - 300),
				y: -30,
				targetY: 50 + Math.random() * 150,
				width: 100,
				height: 30,
				text: text,
				health: 5,
				lastShot: gameTime,
				projectiles: []
			};

			let attempts = 0;
			while (isOverlapping(potentialEnemy, textEnemies) && attempts < 10) {
				potentialEnemy.x = 100 + Math.random() * (canvas.width - 300);
				potentialEnemy.targetY = 50 + Math.random() * 150;
				attempts++;
			}

			return potentialEnemy;
		};

		textEnemies.push(createEnemy());
		if (spawnTwo) {
			textEnemies.push(createEnemy());
		}

		lastEnemySpawn = gameTime;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.code in keys) {
			e.preventDefault();
			keys[e.code] = true;
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.code in keys) {
			e.preventDefault();

			keys[e.code] = false;
		}
	}

	function drawTriangleShip(x: number, y: number, width: number, height: number) {
		ctx.beginPath();
		ctx.moveTo(x + width / 2, y);
		ctx.lineTo(x + width, y + height);
		ctx.lineTo(x, y + height);
		ctx.closePath();
		ctx.fillStyle = 'white';
		ctx.fill();
	}

	function moveShip() {
		const speed = 5;
		if (keys.ArrowLeft && ship.x > 0) ship.x -= speed;
		if (keys.ArrowRight && ship.x < canvas.width - ship.width) ship.x += speed;
		if (keys.ArrowUp && ship.y > 0) ship.y -= speed;
		if (keys.ArrowDown && ship.y < canvas.height - ship.height) ship.y += speed;
	}

	function shoot() {
		if (keys.Space && gameTime - ship.lastShot >= ship.shootDelay) {

			// Shoot multiple bullets
			const bulletSpread = [0]; // Three bullets with spread
			bulletSpread.forEach((spread) => {
				shipProjectiles.push({
					x: ship.x + ship.width / 2,
					y: ship.y,
					width: 15, // Bigger bullets
					height: 25, // Bigger bullets
					active: true,
					spreadX: spread / 10
				});
			});

			ship.lastShot = gameTime;
		}
	}

	function updateProjectiles() {
		shipProjectiles = shipProjectiles.filter((p) => {
			p.y -= 4;
			p.x += p.spreadX; // Apply spread movement
			return p.y > 0 && p.active;
		});

		textEnemies.forEach((enemy) => {
			if (enemy.y < enemy.targetY) {
				enemy.y += 2;
			}

			enemy.projectiles = enemy.projectiles.filter((p: { angle: number; x: number; y: number; active: any; }) => {
				const speed = 1.2;
				const radius = 60;
				p.angle = (p.angle || 0) + 0.05;
				p.x += Math.cos(p.angle) * radius * 0.05;
				p.y += speed;

				return p.y < canvas.height && p.active && p.x > 0 && p.x < canvas.width;
			});

			if (gameTime - enemy.lastShot > 700) {
				enemy.projectiles.push({
					x: enemy.x + enemy.width / 2,
					y: enemy.y + enemy.height,
					width: 30,
					height: 30,
					active: true,
					angle: Math.random() * Math.PI * 2
				});
				enemy.lastShot = gameTime;
			}
		});
	}

	function checkCollisions() {
		shipProjectiles.forEach((projectile) => {
			textEnemies.forEach((enemy) => {
				if (
					projectile.x < enemy.x + enemy.width &&
					projectile.x + projectile.width > enemy.x &&
					projectile.y < enemy.y + enemy.height &&
					projectile.y + projectile.height > enemy.y
				) {
					enemy.health--;
					projectile.active = false;

				}
			});
		});

		textEnemies.forEach((enemy) => {
			enemy.projectiles.forEach((projectile: { x: number; width: any; y: number; height: any; active: boolean; }) => {
				if (
					projectile.x < ship.x + ship.width &&
					projectile.x + projectile.width > ship.x &&
					projectile.y < ship.y + ship.height &&
					projectile.y + projectile.height > ship.y
				) {
					ship.lives--;
					projectile.active = false;
				}
			});
		});

		textEnemies = textEnemies.filter((enemy) => enemy.health > 0);

		// If the enemy projectiles are hit by the ship projectiles, remove them
		textEnemies.forEach((enemy) => {
			enemy.projectiles = enemy.projectiles.filter((p: { x: number; y: number; width: number; height: number; active: boolean; }) => {
				const hit = shipProjectiles.some((sp) => {
					return p.x < sp.x + sp.width && p.x + p.width > sp.x && p.y < sp.y + sp.height && p.y + p.height > sp.y;
				});

				if (hit) {
					p.active = false;
				}

				return p.active;
			});
		});
	}

	function drawGame() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		drawTriangleShip(ship.x, ship.y, ship.width, ship.height);

		ctx.fillStyle = '#00ff00';
		shipProjectiles.forEach((p) => {
			ctx.fillRect(p.x - p.width / 2, p.y, p.width, p.height);
		});

		textEnemies.forEach((enemy) => {
			ctx.fillStyle = 'white';
			ctx.font = '20px Arial';
			ctx.fillText(enemy.text, enemy.x, enemy.y + 20);

			for (let i = 0; i < enemy.health; i++) {
				ctx.fillRect(enemy.x + i * 15, enemy.y - 10, 10, 5);
			}

			ctx.fillStyle = 'red';
			enemy.projectiles.forEach((p: { x: number; y: number; width: number; }) => {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.width / 2, 0, Math.PI * 2);
				ctx.fill();
			});
		});

		ctx.fillStyle = 'white';
		ctx.font = '20px Arial';
		ctx.fillText(`Lives: ${ship.lives}`, 10, canvas.height - 10);
	}

	async function showEncouragingMessages() {
		const numMessages = 1;

		for (let i = 0; i < numMessages; i++) {
			const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
			const x = Math.random() * (canvas.width - 200);
			const y = Math.random() * (canvas.height - 100);
			ctx.font = `${20 + Math.random() * 20}px Arial`;
			ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 70%)`;
			ctx.fillText(message, x, y);
		}
	}

	function endGame(message: string) {
		gameActive = false;
		showRestartButton = true;

		function animateEndGame() {
			if (!gameActive) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// Draw end game message
				ctx.fillStyle = 'white';
				ctx.font = '40px Arial';
				ctx.fillText(message, canvas.width / 2 - 100, canvas.height / 2);

				// Show 1 message per second
				showEncouragingMessages();

				requestAnimationFrame(animateEndGame);

				

			}
		}

		animateEndGame();

	}

	function gameLoop(timestamp: number) {
		if (!gameActive) return;

		gameTime = timestamp;
		spawnEnemy();
		moveShip();
		shoot();
		updateProjectiles();
		checkCollisions();
		drawGame();

		if (ship.lives <= 0) {
			endGame('Game Over!');
			return;
		} else if (textEnemies.length === 0 && possibleEnemies.length === 0) {
			endGame('You Win!');
			return;
		}

		requestAnimationFrame(gameLoop);
	}

	onMount(async () => {
		const response = await fetch('/api/files');
		if (response.ok) {
			possibleEnemies = await response.json();
		}
		canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d')!;
		canvas.width = 800;
		canvas.height = 600;

		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeyDown);
			window.addEventListener('keyup', handleKeyUp);
		}

		// Initialize OST
		OST = new Audio('/sounds/wotw.mp3');
		OST.volume = 0.8;

		// simulate a click to  avoid
		// Audio play failed: NotAllowedError: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD
		document.body.click();

		initGame();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		}
	});
</script>

<div class="game-container">
	<canvas id="gameCanvas" />
	{#if showRestartButton}
		<button on:click={restartGame}>Restart</button>
	{/if}
</div>

<style>
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	canvas {
		background-color: black;
		border: 2px solid white;
	}

	button {
		padding: 10px 20px;
		font-size: 18px;
		background-color: #dcd9c8;
		color: black;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #b0aa8a;
	}
</style>
