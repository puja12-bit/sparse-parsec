export class Input {
    constructor() {
        this.keys = {
            ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
            w: false, a: false, s: false, d: false,
            q: false, e: false
        };
        
        this.indicators = { left: false, right: false };
        this.indicatorTimer = 0;

        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
            if (e.key === 'q' || e.key === 'Q') this.toggleIndicator('left');
            if (e.key === 'e' || e.key === 'E') this.toggleIndicator('right');
        });

        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
    }

    toggleIndicator(dir) {
        if (dir === 'left') {
            this.indicators.left = !this.indicators.left;
            this.indicators.right = false;
        } else if (dir === 'right') {
            this.indicators.right = !this.indicators.right;
            this.indicators.left = false;
        }

        // Update HUD visually
        const lHud = document.getElementById('ind-left');
        const rHud = document.getElementById('ind-right');
        if (lHud && rHud) {
            lHud.className = 'indicator-hud' + (this.indicators.left ? ' active' : '');
            rHud.className = 'indicator-hud' + (this.indicators.right ? ' active' : '');
        }
    }

    get isAccelerating() { return this.keys.ArrowUp || this.keys.w; }
    get isBraking() { return this.keys.ArrowDown || this.keys.s; }
    get steerDir() {
        if (this.keys.ArrowLeft || this.keys.a) return -1;
        if (this.keys.ArrowRight || this.keys.d) return 1;
        return 0;
    }
}
