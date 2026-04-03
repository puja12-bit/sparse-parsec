export class PedestrianManager {
    constructor() {
        this.peds = [];
        this.spawnTimer = 0;
        this.spawnInterval = 3000;
    }

    spawnPedestrian() {
        // Spawn on left (0) or right (600)
        const side = Math.random() > 0.5 ? 'left' : 'right';
        const x = side === 'left' ? 20 : 580;
        
        // Spawn ahead of player
        const y = -50 - Math.random() * 200;
        
        const speedX = side === 'left' ? (0.5 + Math.random()) : -(0.5 + Math.random());
        
        this.peds.push({
            x, y,
            width: 10, height: 10,
            speedX,
            color: Math.random() > 0.5 ? '#ff00ff' : '#00ffcc',
            state: 'waiting', // waiting, crossing
            waitTime: Math.random() * 1000
        });
    }

    update(playerSpeed, dt) {
        this.spawnTimer += dt;
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnPedestrian();
            this.spawnInterval = 2000 + Math.random() * 3000;
        }

        for (let i = this.peds.length - 1; i >= 0; i--) {
            let p = this.peds[i];
            
            p.y += playerSpeed * (dt/16);

            if (p.state === 'waiting') {
                p.waitTime -= dt;
                if (p.waitTime <= 0) p.state = 'crossing';
            } else if (p.state === 'crossing') {
                p.x += p.speedX * (dt/16);
            }

            // Remove if off screen top/bottom or crossed fully
            if (p.y > 900 || p.x < -20 || p.x > 620) {
                this.peds.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        for (let p of this.peds) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    getPedestrians() {
        return this.peds;
    }
}
