export class TrafficManager {
    constructor() {
        this.vehicles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2000; // ms
        
        // Traffic lane definitions
        this.lanes = [
            { x: 150, dir: 1 },  // Left lane, slower
            { x: 250, dir: 1 },  // MIddle lane
            { x: 350, dir: 1 },  // Middle lane
            { x: 450, dir: 1 }   // Right lane, fast
        ];
    }

    spawnVehicle() {
        const lane = this.lanes[Math.floor(Math.random() * this.lanes.length)];
        // Determine type of vehicle
        const rand = Math.random();
        let type, width, height, speed, color, behavior;
        
        if (rand < 0.2) {
            type = 'cycle';
            width = 10; height = 30; speed = 1.5; color = '#888';
            behavior = 'steady';
        } else if (rand < 0.5) {
            type = 'bike';
            width = 15; height = 40; speed = 3.5; color = '#f00';
            behavior = Math.random() > 0.5 ? 'weaver' : 'steady';
        } else if (rand < 0.8) {
            type = 'car';
            width = 30; height = 60; speed = 2.5; color = '#00aaff';
            behavior = 'steady';
        } else {
            type = 'auto'; // Auto-rickshaw
            width = 25; height = 45; speed = 2.0; color = '#ffcc00';
            behavior = 'erratic';
        }

        // Add some random speed offset
        speed += (Math.random() * 0.5 - 0.25);

        // Spawn far ahead (negative Y relative to canvas, or just top)
        this.vehicles.push({
            x: lane.x - width/2,
            y: -100,
            width, height, speed, color, type, behavior,
            targetLaneX: lane.x - width/2,
            weaveTimer: 0
        });
    }

    update(playerSpeed, dt) {
        this.spawnTimer += dt;
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnVehicle();
            // Randomize interval slightly
            this.spawnInterval = 1000 + Math.random() * 2000;
        }

        for (let i = this.vehicles.length - 1; i >= 0; i--) {
            let v = this.vehicles[i];
            
            // Move relative to player speed (if player is faster, traffic moves down)
            // if traffic speed > player, traffic moves up (negative y relative)
            v.y += (playerSpeed - v.speed) * (dt/16);

            // Behaviors
            if (v.behavior === 'erratic') {
                v.weaveTimer += dt;
                if (v.weaveTimer > 2000) {
                    v.weaveTimer = 0;
                    if (Math.random() > 0.5) {
                        v.targetLaneX = this.lanes[Math.floor(Math.random() * this.lanes.length)].x - v.width/2;
                    }
                }
            } else if (v.behavior === 'weaver') {
                v.weaveTimer += dt;
                if (v.weaveTimer > 1000) {
                    v.weaveTimer = 0;
                    v.targetLaneX += (Math.random() > 0.5 ? 20 : -20);
                }
            }

            // Move laterally
            v.x += (v.targetLaneX - v.x) * 0.05;

            // Remove if off screen
            if (v.y > 900) {
                this.vehicles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        for (let v of this.vehicles) {
            ctx.fillStyle = v.color;
            ctx.fillRect(v.x, v.y, v.width, v.height);
            
            // Some detail based on type
            if (v.type === 'car') {
                ctx.fillStyle = '#111';
                ctx.fillRect(v.x + 2, v.y + 10, v.width - 4, 15);
            } else if (v.type === 'auto') {
                // black canopy top
                ctx.fillStyle = '#222';
                ctx.fillRect(v.x, v.y + 10, v.width, v.height - 10);
            }
        }
    }

    getVehicles() {
        return this.vehicles;
    }
}
