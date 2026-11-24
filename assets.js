/* ==========================================================================
   OK Derby - Canvas Assets Renderer
   ========================================================================== */

const Assets = {
    // Colors
    woodDark: '#5c4033',
    woodLight: '#8b5a2b',
    leafGreen: '#2ecc71',
    leafDark: '#27ae60',
    swampGreen: '#82e0aa',
    swampDeep: '#229954',
    bossMechDark: '#333333',
    bossMechRed: '#ff5252',
    
    drawJeep(ctx, x, y, w, h, wheelRotation = 0, isFlying = false) {
        ctx.save();
        ctx.translate(x, y);
        
        // Body (Tropical Turquoise)
        ctx.fillStyle = '#00cec9';
        ctx.fillRect(w*0.1, h*0.4, w*0.8, h*0.3);
        
        // Wood panel decal on the side
        ctx.fillStyle = '#deaa70';
        ctx.fillRect(w*0.18, h*0.45, w*0.5, h*0.18);
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 1;
        ctx.strokeRect(w*0.18, h*0.45, w*0.5, h*0.18);
        
        // Cabin (Hibiscus Pink)
        ctx.fillStyle = '#ff7675';
        ctx.fillRect(w*0.2, h*0.2, w*0.5, h*0.2);
        
        // Window
        ctx.fillStyle = '#e3f2fd';
        ctx.fillRect(w*0.3, h*0.25, w*0.3, h*0.15);
        
        // Surfboard on roof
        ctx.fillStyle = '#fdcb6e'; // Surfboard yellow
        ctx.beginPath();
        ctx.ellipse(w*0.45, h*0.13, w*0.3, h*0.06, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#d63031'; // Red stripe
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(w*0.15, h*0.13);
        ctx.lineTo(w*0.75, h*0.13);
        ctx.stroke();

        // Hibiscus decal on door
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 5; i++) {
            let angle = (i * Math.PI * 2) / 5;
            ctx.beginPath();
            ctx.arc(w*0.43 + Math.cos(angle)*4, h*0.54 + Math.sin(angle)*4, 2.5, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.fillStyle = '#fdcb6e';
        ctx.beginPath();
        ctx.arc(w*0.43, h*0.54, 1.5, 0, Math.PI*2);
        ctx.fill();

        // Wheels
        ctx.fillStyle = '#2d3436';
        this.drawWheel(ctx, w*0.25, h*0.7, w*0.15, wheelRotation);
        this.drawWheel(ctx, w*0.75, h*0.7, w*0.15, wheelRotation);
        
        if (isFlying) {
            // Draw bird carrying it
            this.drawBird(ctx, w*0.5, -h*0.3, w*0.6, h*0.4, wheelRotation);
            // Flower Lei string instead of rope
            for (let i = 0; i < 6; i++) {
                let ly = -h*0.1 + (h*0.3 / 5) * i;
                let colors = ['#ff7675', '#fdcb6e', '#55efc4', '#a29bfe'];
                ctx.fillStyle = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(w*0.5, ly, 4, 0, Math.PI*2);
                ctx.fill();
            }
        }

        ctx.restore();
    },

    drawSpeeder(ctx, x, y, w, h, hoverOffset = 0, isFlying = false) {
        ctx.save();
        ctx.translate(x, y + Math.sin(hoverOffset) * 3);
        
        // Hull (Koa Wood Board)
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.moveTo(0, h*0.55);
        ctx.lineTo(w*0.2, h*0.35);
        ctx.lineTo(w*0.8, h*0.35);
        ctx.lineTo(w, h*0.55);
        ctx.lineTo(w*0.9, h*0.65);
        ctx.lineTo(w*0.1, h*0.65);
        ctx.fill();

        // Dark stringer (wood stripe) in center
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(0, h*0.48, w, h*0.04);
        
        // Nose accent (teal)
        ctx.fillStyle = '#00cec9';
        ctx.beginPath();
        ctx.moveTo(w*0.8, h*0.35);
        ctx.lineTo(w, h*0.55);
        ctx.lineTo(w*0.9, h*0.65);
        ctx.lineTo(w*0.75, h*0.55);
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#e3f2fd';
        ctx.beginPath();
        ctx.arc(w*0.45, h*0.35, w*0.15, Math.PI, 0);
        ctx.fill();

        // Hibiscus decal on rear
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 5; i++) {
            let angle = (i * Math.PI * 2) / 5;
            ctx.beginPath();
            ctx.arc(w*0.2 + Math.cos(angle)*4, h*0.5 + Math.sin(angle)*4, 2.5, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.fillStyle = '#ff7675';
        ctx.beginPath();
        ctx.arc(w*0.2, h*0.5, 1.5, 0, Math.PI*2);
        ctx.fill();

        if (isFlying) {
            this.drawBird(ctx, w*0.5, -h*0.3, w*0.6, h*0.4, hoverOffset * 5);
            // Flower Lei string instead of rope
            for (let i = 0; i < 6; i++) {
                let ly = -h*0.1 + (h*0.3 / 5) * i;
                let colors = ['#ff7675', '#fdcb6e', '#55efc4', '#a29bfe'];
                ctx.fillStyle = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(w*0.5, ly, 4, 0, Math.PI*2);
                ctx.fill();
            }
        }

        ctx.restore();
    },

    drawTank(ctx, x, y, w, h, treadOffset = 0, isFlying = false) {
        ctx.save();
        ctx.translate(x, y);

        // Treads (stone-textured wheels)
        ctx.fillStyle = '#555';
        ctx.fillRect(0, h*0.6, w, h*0.2);
        ctx.fillStyle = '#777';
        for (let i = 0; i < 6; i++) {
            let tx = (i * w*0.18 - treadOffset * 10) % w;
            if (tx < 0) tx += w;
            ctx.beginPath();
            ctx.arc(tx, h*0.7, 6, 0, Math.PI*2);
            ctx.fill();
        }

        // Body (Bamboo Box / Log Chest)
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(w*0.1, h*0.3, w*0.8, h*0.3);
        
        // Carved Tiki face lines on the body
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 2.5;
        // Grinning teeth lines
        ctx.beginPath();
        ctx.moveTo(w*0.3, h*0.5);
        ctx.lineTo(w*0.7, h*0.5);
        for(let tx = w*0.35; tx <= w*0.65; tx += 8) {
            ctx.moveTo(tx, h*0.46);
            ctx.lineTo(tx, h*0.54);
        }
        ctx.stroke();
        
        // Glowing orange eyes on side of tank
        ctx.fillStyle = '#ff9a44';
        ctx.beginPath();
        ctx.arc(w*0.35, h*0.38, 5, 0, Math.PI*2);
        ctx.arc(w*0.65, h*0.38, 5, 0, Math.PI*2);
        ctx.fill();
        
        // Turret (Bamboo Launcher)
        ctx.fillStyle = '#2ecc71'; // Green bamboo log
        ctx.fillRect(w*0.45, h*0.1, w*0.4, h*0.12);
        ctx.fillStyle = '#27ae60'; // Bamboo joint rings
        ctx.fillRect(w*0.45, h*0.1, w*0.05, h*0.12);
        ctx.fillRect(w*0.65, h*0.1, w*0.05, h*0.12);
        ctx.fillRect(w*0.8, h*0.1, w*0.05, h*0.12);
        
        ctx.fillStyle = '#8b5a2b'; // Wood base of turret
        ctx.beginPath();
        ctx.arc(w*0.5, h*0.3, w*0.2, Math.PI, 0);
        ctx.fill();

        if (isFlying) {
            this.drawBird(ctx, w*0.5, -h*0.3, w*0.6, h*0.4, treadOffset);
            // Flower Lei string instead of rope
            for (let i = 0; i < 6; i++) {
                let ly = -h*0.1 + (h*0.3 / 5) * i;
                let colors = ['#ff7675', '#fdcb6e', '#55efc4', '#a29bfe'];
                ctx.fillStyle = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(w*0.5, ly, 4, 0, Math.PI*2);
                ctx.fill();
            }
        }

        ctx.restore();
    },

    drawSurfboardRescue(ctx, x, y, w, h, vehicleType, wheelRotation = 0, isFlying = false) {
        ctx.save();
        ctx.translate(x, y);

        // Draw Surfboard under the vehicle
        // A surfboard shape from x = -w*0.1 to w*1.1, around y = h*0.65 to h*0.8
        ctx.fillStyle = '#fdcb6e'; // Surfboard yellow
        ctx.strokeStyle = '#d63031'; // Red stripe/border
        ctx.lineWidth = 2.5;
        
        ctx.beginPath();
        // Pointed nose on the right, rounded tail on the left
        ctx.moveTo(-w*0.1, h*0.72);
        ctx.bezierCurveTo(-w*0.1, h*0.65, w*0.4, h*0.65, w*1.1, h*0.72);
        ctx.bezierCurveTo(w*1.15, h*0.73, w*1.15, h*0.77, w*1.1, h*0.78);
        ctx.bezierCurveTo(w*0.4, h*0.85, -w*0.1, h*0.85, -w*0.1, h*0.78);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Red stripe down the middle of the surfboard
        ctx.strokeStyle = '#d63031';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-w*0.1, h*0.75);
        ctx.lineTo(w*1.1, h*0.75);
        ctx.stroke();

        // Draw vehicle body on top (without wheels)
        if (vehicleType === 'jeep') {
            // Body (Tropical Turquoise)
            ctx.fillStyle = '#00cec9';
            ctx.fillRect(w*0.1, h*0.4, w*0.8, h*0.3);
            
            // Wood panel decal on the side
            ctx.fillStyle = '#deaa70';
            ctx.fillRect(w*0.18, h*0.45, w*0.5, h*0.18);
            ctx.strokeStyle = '#8b5a2b';
            ctx.lineWidth = 1;
            ctx.strokeRect(w*0.18, h*0.45, w*0.5, h*0.18);
            
            // Cabin (Hibiscus Pink)
            ctx.fillStyle = '#ff7675';
            ctx.fillRect(w*0.2, h*0.2, w*0.5, h*0.2);
            
            // Window
            ctx.fillStyle = '#e3f2fd';
            ctx.fillRect(w*0.3, h*0.25, w*0.3, h*0.15);

            // Hibiscus decal on door
            ctx.fillStyle = '#fff';
            for (let i = 0; i < 5; i++) {
                let angle = (i * Math.PI * 2) / 5;
                ctx.beginPath();
                ctx.arc(w*0.43 + Math.cos(angle)*4, h*0.54 + Math.sin(angle)*4, 2.5, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.fillStyle = '#fdcb6e';
            ctx.beginPath();
            ctx.arc(w*0.43, h*0.54, 1.5, 0, Math.PI*2);
            ctx.fill();
        } else {
            // speeder body
            // Hull (Koa Wood Board)
            ctx.fillStyle = '#e67e22';
            ctx.beginPath();
            ctx.moveTo(0, h*0.55);
            ctx.lineTo(w*0.2, h*0.35);
            ctx.lineTo(w*0.8, h*0.35);
            ctx.lineTo(w, h*0.55);
            ctx.lineTo(w*0.9, h*0.65);
            ctx.lineTo(w*0.1, h*0.65);
            ctx.fill();

            // Dark stringer (wood stripe) in center
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(0, h*0.48, w, h*0.04);
            
            // Nose accent (teal)
            ctx.fillStyle = '#00cec9';
            ctx.beginPath();
            ctx.moveTo(w*0.8, h*0.35);
            ctx.lineTo(w, h*0.55);
            ctx.lineTo(w*0.9, h*0.65);
            ctx.lineTo(w*0.75, h*0.55);
            ctx.fill();

            // Cockpit
            ctx.fillStyle = '#e3f2fd';
            ctx.beginPath();
            ctx.arc(w*0.45, h*0.35, w*0.15, Math.PI, 0);
            ctx.fill();

            // Hibiscus decal on rear
            ctx.fillStyle = '#fff';
            for (let i = 0; i < 5; i++) {
                let angle = (i * Math.PI * 2) / 5;
                ctx.beginPath();
                ctx.arc(w*0.2 + Math.cos(angle)*4, h*0.5 + Math.sin(angle)*4, 2.5, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.fillStyle = '#ff7675';
            ctx.beginPath();
            ctx.arc(w*0.2, h*0.5, 1.5, 0, Math.PI*2);
            ctx.fill();
        }

        // Draw water/lava splashes at the bottom of the surfboard
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 3; i++) {
            let sx = -w*0.1 + Math.random() * w*1.2;
            let sy = h*0.75 + Math.random() * h*0.1;
            ctx.beginPath();
            ctx.arc(sx, sy, 3 + Math.random()*3, 0, Math.PI*2);
            ctx.fill();
        }

        if (isFlying) {
            this.drawBird(ctx, w*0.5, -h*0.3, w*0.6, h*0.4, wheelRotation);
            // Flower Lei string instead of rope
            for (let i = 0; i < 6; i++) {
                let ly = -h*0.1 + (h*0.3 / 5) * i;
                let colors = ['#ff7675', '#fdcb6e', '#55efc4', '#a29bfe'];
                ctx.fillStyle = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(w*0.5, ly, 4, 0, Math.PI*2);
                ctx.fill();
            }
        }

        ctx.restore();
    },

    drawDuckBoatRescue(ctx, x, y, w, h, treadOffset = 0, isFlying = false) {
        ctx.save();
        ctx.translate(x, y);

        // Draw Duck Boat Hull surrounding the tank body
        // Draw the yellow duck boat body (a large oval/boat shape at the bottom)
        ctx.fillStyle = '#fffa65'; // Duck yellow
        ctx.beginPath();
        // Boat hull base
        ctx.moveTo(-w*0.1, h*0.45);
        ctx.lineTo(w*0.9, h*0.45);
        // Duck tail at the back (left)
        ctx.quadraticCurveTo(-w*0.2, h*0.4, -w*0.15, h*0.75);
        ctx.lineTo(w*0.8, h*0.75);
        // Duck breast/neck at the front (right)
        ctx.quadraticCurveTo(w*1.1, h*0.7, w*1.05, h*0.4);
        ctx.closePath();
        ctx.fill();

        // Draw Duck Head on the right front
        ctx.fillStyle = '#fffa65';
        ctx.beginPath();
        ctx.arc(w*1.05, h*0.32, h*0.18, 0, Math.PI*2);
        ctx.fill();

        // Duck eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(w*1.08, h*0.28, 2.5, 0, Math.PI*2);
        ctx.fill();

        // Duck beak (orange)
        ctx.fillStyle = '#ff9f43';
        ctx.beginPath();
        ctx.moveTo(w*1.18, h*0.28);
        ctx.lineTo(w*1.28, h*0.34);
        ctx.lineTo(w*1.18, h*0.38);
        ctx.closePath();
        ctx.fill();

        // Draw Duck Wing on the side of the hull
        ctx.fillStyle = '#fff200';
        ctx.beginPath();
        ctx.ellipse(w*0.4, h*0.58, w*0.25, h*0.1, -Math.PI*0.05, 0, Math.PI*2);
        ctx.fill();

        // Draw Tank body sitting inside/on top of the duck boat
        // Body (Bamboo Box / Log Chest)
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(w*0.15, h*0.28, w*0.7, h*0.22);
        
        // Carved Tiki face lines on the body
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 2;
        // Grinning teeth lines
        ctx.beginPath();
        ctx.moveTo(w*0.35, h*0.42);
        ctx.lineTo(w*0.65, h*0.42);
        for(let tx = w*0.4; tx <= w*0.6; tx += 6) {
            ctx.moveTo(tx, h*0.39);
            ctx.lineTo(tx, h*0.45);
        }
        ctx.stroke();
        
        // Glowing orange eyes on side of tank
        ctx.fillStyle = '#ff9a44';
        ctx.beginPath();
        ctx.arc(w*0.4, h*0.34, 4, 0, Math.PI*2);
        ctx.arc(w*0.6, h*0.34, 4, 0, Math.PI*2);
        ctx.fill();
        
        // Turret (Bamboo Launcher)
        ctx.fillStyle = '#2ecc71'; // Green bamboo log
        ctx.fillRect(w*0.45, h*0.08, w*0.4, h*0.1);
        ctx.fillStyle = '#27ae60'; // Bamboo joint rings
        ctx.fillRect(w*0.45, h*0.08, w*0.05, h*0.1);
        ctx.fillRect(w*0.65, h*0.08, w*0.05, h*0.1);
        ctx.fillRect(w*0.8, h*0.08, w*0.05, h*0.1);
        
        ctx.fillStyle = '#8b5a2b'; // Wood base of turret
        ctx.beginPath();
        ctx.arc(w*0.5, h*0.28, w*0.18, Math.PI, 0);
        ctx.fill();

        // Draw propeller splash at the back (left)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 3; i++) {
            let px = -w*0.2 + Math.random() * w*0.25;
            let py = h*0.65 + Math.random() * h*0.15;
            ctx.beginPath();
            ctx.arc(px, py, 3 + Math.random()*3, 0, Math.PI*2);
            ctx.fill();
        }

        if (isFlying) {
            this.drawBird(ctx, w*0.5, -h*0.3, w*0.6, h*0.4, treadOffset);
            // Flower Lei string instead of rope
            for (let i = 0; i < 6; i++) {
                let ly = -h*0.1 + (h*0.3 / 5) * i;
                let colors = ['#ff7675', '#fdcb6e', '#55efc4', '#a29bfe'];
                ctx.fillStyle = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(w*0.5, ly, 4, 0, Math.PI*2);
                ctx.fill();
            }
        }

        ctx.restore();
    },

    drawWheel(ctx, cx, cy, r, rot) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#aaa';
        ctx.fillRect(-r*0.8, -r*0.1, r*1.6, r*0.2);
        ctx.fillRect(-r*0.1, -r*0.8, r*0.2, r*1.6);
        ctx.restore();
    },

    drawBird(ctx, x, y, w, h, flapOffset) {
        ctx.save();
        ctx.translate(x, y);
        
        // Body (Bright Scarlet Red)
        ctx.fillStyle = '#ff7675';
        ctx.beginPath();
        ctx.arc(0, 0, w*0.3, 0, Math.PI*2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(w*0.1, -h*0.1, w*0.05, 0, Math.PI*2);
        ctx.fill();

        // Beak (long, curved orange beak)
        ctx.strokeStyle = '#fdcb6e';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(w*0.1, h*0.1, w*0.35, -Math.PI*0.25, Math.PI*0.1);
        ctx.stroke();

        // Wings (black)
        ctx.fillStyle = '#2d3436';
        const wingY = Math.sin(flapOffset) * h*0.4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-w*0.4, wingY);
        ctx.lineTo(-w*0.2, wingY + h*0.2);
        ctx.fill();

        ctx.restore();
    },

    drawWoodPlatform(ctx, x, y, w, h) {
        // Main block
        ctx.fillStyle = this.woodLight;
        ctx.fillRect(x, y, w, h);
        
        // Wood grain / posts
        ctx.strokeStyle = this.woodDark;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.stroke();

        // Vertical posts going down
        ctx.fillStyle = this.woodDark;
        ctx.fillRect(x + w*0.1, y + h, w*0.2, 500); // Posts go deep into swamp
        ctx.fillRect(x + w*0.7, y + h, w*0.2, 500);

        // Draw Tiki carvings on vertical posts
        ctx.fillStyle = '#111';
        let px1 = x + w*0.1;
        let py1 = y + h;
        // Left post face
        ctx.fillRect(px1 + 2, py1 + 10, 2, 2);
        ctx.fillRect(px1 + w*0.2 - 4, py1 + 10, 2, 2);
        ctx.fillRect(px1 + 4, py1 + 18, w*0.2 - 8, 2);
        // Right post face
        let px2 = x + w*0.7;
        let py2 = y + h;
        ctx.fillRect(px2 + 2, py2 + 10, 2, 2);
        ctx.fillRect(px2 + w*0.2 - 4, py2 + 10, 2, 2);
        ctx.fillRect(px2 + 4, py2 + 18, w*0.2 - 8, 2);
    },

    drawElevator(ctx, x, y, w, h) {
        // Main platform
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(x, y, w, h);
        
        // Warning strip
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(x, y, w, 5); 
        
        // Cables going up to sky
        ctx.strokeStyle = '#bdc3c7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + w*0.1, y);
        ctx.lineTo(x + w*0.1, y - 800);
        ctx.moveTo(x + w*0.9, y);
        ctx.lineTo(x + w*0.9, y - 800);
        ctx.stroke();
        
        // Mechanical details
        ctx.fillStyle = '#34495e';
        ctx.beginPath();
        ctx.arc(x + w*0.1, y + h/2, 6, 0, Math.PI*2);
        ctx.arc(x + w*0.9, y + h/2, 6, 0, Math.PI*2);
        ctx.fill();
    },

    drawRamp(ctx, x, y, w, h, direction) {
        // direction 1 = up-right, -1 = up-left
        ctx.fillStyle = '#f1c40f'; // Bright Yellow Slide
        ctx.beginPath();
        if (direction === 1) {
            ctx.moveTo(x, y + h);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
        } else {
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
        }
        ctx.fill();

        // Slide highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (direction === 1) {
            ctx.moveTo(x + 5, y + h - 5);
            ctx.lineTo(x + w - 5, y + 5);
        } else {
            ctx.moveTo(x + 5, y + 5);
            ctx.lineTo(x + w - 5, y + h - 5);
        }
        ctx.stroke();

        // Posts
        ctx.fillStyle = this.woodDark;
        ctx.fillRect(x + w*0.4, y + h, w*0.2, 500);
    },

    drawVine(ctx, x, y, length) {
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        // Draw squiggly vine
        for (let i = 0; i < length; i += 10) {
            let offset = (i % 20 === 0) ? 5 : -5;
            ctx.lineTo(x + offset, y + i);
        }
        ctx.stroke();
        // Leaves
        ctx.fillStyle = '#2ecc71';
        for (let i = 10; i < length; i += 20) {
            ctx.beginPath();
            ctx.arc(x + 5, y + i, 4, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 5, y + i + 10, 4, 0, Math.PI*2);
            ctx.fill();
        }
    },

    drawHazard(ctx, x, y, r, frame, type = 'poop') {
        ctx.save();
        ctx.translate(x, y);
        
        if (type === 'lava') {
            // Molten lava splash / ball
            // Outer fire glow
            ctx.fillStyle = 'rgba(230, 126, 34, 0.45)';
            ctx.beginPath();
            ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Inner molten core (radial gradient)
            let grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
            grad.addColorStop(0, '#ffffff'); // white-hot center
            grad.addColorStop(0.3, '#f1c40f'); // yellow
            grad.addColorStop(0.7, '#e67e22'); // orange-red
            grad.addColorStop(1, '#c0392b'); // dark crust
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();
            
            // Subtle sparks flying off
            ctx.fillStyle = '#fdcb6e';
            ctx.fillRect(Math.sin(frame * 0.5) * r * 0.5, Math.cos(frame * 0.5) * r * 0.5, 2, 2);
        } else {
            // Bird Poop (white droplet)
            ctx.fillStyle = '#ecf0f1'; // white/light grey
            ctx.beginPath();
            // Droplet shape
            ctx.moveTo(0, -r);
            ctx.bezierCurveTo(r, 0, r, r, 0, r);
            ctx.bezierCurveTo(-r, r, -r, 0, 0, -r);
            ctx.fill();
            
            // Inner highlight
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-r*0.2, r*0.2, r*0.3, 0, Math.PI*2);
            ctx.fill();
        }

        ctx.restore();
    },

    drawCoinCollectible(ctx, x, y, r, frame) {
        ctx.save();
        // Hover floating animation
        const hoverY = Math.sin(frame * 0.15) * 4;
        ctx.translate(x, y + hoverY);
        
        // Spin effect by scaling horizontal axis
        const scaleX = Math.abs(Math.sin(frame * 0.1));
        ctx.scale(scaleX, 1);
        
        // Golden radial gradient
        let grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
        grad.addColorStop(0, '#ffeaa7'); // light highlight
        grad.addColorStop(0.7, '#f1c40f'); // gold
        grad.addColorStop(1, '#d35400'); // orange rim
        
        ctx.fillStyle = grad;
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Inner coin details
        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Coin character symbol in center
        ctx.fillStyle = '#d35400';
        ctx.font = `bold ${Math.round(r * 1.0)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);
        
        ctx.restore();
    },

    drawLavaBomb(ctx, x, y, r, frame) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(frame * 0.05); // rotate as it flies
        
        // Draw black basalt rock bomb
        ctx.fillStyle = '#2c3e50';
        ctx.strokeStyle = '#1a252f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Molten glowing cracks on bomb
        ctx.strokeStyle = '#e17055';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-r * 0.6, -r * 0.2);
        ctx.lineTo(r * 0.6, r * 0.2);
        ctx.moveTo(-r * 0.2, r * 0.6);
        ctx.lineTo(r * 0.2, -r * 0.6);
        ctx.stroke();
        
        // Glowing hot core highlights
        ctx.fillStyle = '#fdcb6e';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
        
        // Burning spark fuse
        ctx.strokeStyle = '#7f8c8d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(r * 0.5, -r * 1.5, r * 0.6, -r * 1.2);
        ctx.stroke();
        
        // Burning spark particle
        ctx.fillStyle = (frame % 10 < 5) ? '#f1c40f' : '#e74c3c';
        ctx.beginPath();
        ctx.arc(r * 0.6, -r * 1.2, 3 + Math.sin(frame * 0.5) * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    },

    drawLavaPool(ctx, x, y, w, h, frame) {
        ctx.save();
        
        // Glowing red/orange lava pool base
        let grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, '#ff7675');
        grad.addColorStop(0.5, '#e17055');
        grad.addColorStop(1, '#c0392b');
        
        ctx.fillStyle = grad;
        ctx.strokeStyle = '#fdcb6e'; // glowing border
        ctx.lineWidth = 2.5;
        
        // Draw lava pool dome/capsule shape
        ctx.beginPath();
        ctx.ellipse(x + w/2, y + h/2, w/2, h/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Bubbling animations
        ctx.fillStyle = '#f1c40f'; // yellow bubbles popping
        for (let i = 0; i < 3; i++) {
            let bubbleOffset = (frame * 0.5 + i * 20) % w;
            let bx = x + bubbleOffset;
            if (bx > x + 3 && bx < x + w - 3) {
                let by = y + h/2 + Math.sin(frame * 0.15 + i) * h * 0.2;
                let br = 2 + Math.abs(Math.sin(frame * 0.08 + i)) * 3.5;
                ctx.beginPath();
                ctx.arc(bx, by, br, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    },

    drawOKPipe(ctx, x, y, w, h) {
        // Main Pipe body
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(x + w*0.1, y + 20, w*0.8, h);
        
        // Pipe Rim
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x, y, w, 20);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, 20);
        ctx.strokeRect(x + w*0.1, y + 20, w*0.8, h);

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(x + w*0.2, y + 20, w*0.1, h);
        ctx.fillRect(x + w*0.1, y, w*0.8, 5);

        // "OK" Text
        ctx.fillStyle = '#f1c40f'; // Yellow
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.fillText('OK', x + w/2, y + 50);
        ctx.strokeText('OK', x + w/2, y + 50);
    },

    drawQuestionBlock(ctx, x, y, w, h, isActive) {
        if (!isActive) {
            // Empty block
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);
            // Rivets
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(x+2, y+2, 4, 4);
            ctx.fillRect(x+w-6, y+2, 4, 4);
            ctx.fillRect(x+2, y+h-6, 4, 4);
            ctx.fillRect(x+w-6, y+h-6, 4, 4);
            return;
        }

        // Active Question Block
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x, y, w, h);
        
        // Border
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        // ? Mark
        ctx.fillStyle = '#d35400';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', x + w/2, y + h/2);
        
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w/2, y);
        ctx.lineTo(x, y + h/2);
        ctx.fill();
    },

    drawCoconutBomb(ctx, x, y, r) {
        ctx.save();
        // Brown coconut shell
        ctx.fillStyle = '#5c4033';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.fill();
        
        // Coconut details (fibers / shell circle)
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, r - 2, 0, Math.PI*2);
        ctx.stroke();
        
        // 3 coconut dots/eyes
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(x - r*0.3, y - r*0.1, 1.5, 0, Math.PI*2);
        ctx.arc(x - r*0.1, y - r*0.3, 1.5, 0, Math.PI*2);
        ctx.arc(x - r*0.2, y + r*0.2, 1.5, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    },

    drawFruitBubble(ctx, x, y, r, frame) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(frame * 0.2);
        
        // Pineapple body (yellow oval)
        ctx.fillStyle = '#fdcb6e';
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r*1.3, 0, 0, Math.PI*2);
        ctx.fill();
        
        // Orange hatch grid
        ctx.strokeStyle = '#e17055';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-r*0.6, -r*0.6); ctx.lineTo(r*0.6, r*0.6);
        ctx.moveTo(-r*0.6, r*0.6); ctx.lineTo(r*0.6, -r*0.6);
        ctx.stroke();
        
        // Leafy top (green spiky crown)
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(0, -r*1.2);
        ctx.lineTo(-r*0.4, -r*1.8);
        ctx.lineTo(0, -r*1.4);
        ctx.lineTo(r*0.4, -r*1.8);
        ctx.lineTo(0, -r*1.2);
        ctx.fill();
        
        ctx.restore();
    },

    drawPineappleCollectible(ctx, x, y, r, frame) {
        ctx.save();
        // Gentle hover float
        const hoverY = Math.sin(frame * 0.1) * 4;
        ctx.translate(x, y + hoverY);
        
        // Gold Pineapple Body
        ctx.fillStyle = '#fdcb6e';
        ctx.beginPath();
        ctx.ellipse(0, 0, r*0.8, r*1.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Crosshatch detail
        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-r*0.5, -r*0.5); ctx.lineTo(r*0.5, r*0.5);
        ctx.moveTo(-r*0.5, r*0.5); ctx.lineTo(r*0.5, -r*0.5);
        ctx.stroke();

        // Green leaves crown
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(0, -r*1.0);
        ctx.quadraticCurveTo(-r*0.6, -r*1.8, -r*0.5, -r*1.6);
        ctx.quadraticCurveTo(0, -r*1.1, 0, -r*1.0);
        ctx.quadraticCurveTo(r*0.6, -r*1.8, r*0.5, -r*1.6);
        ctx.quadraticCurveTo(0, -r*1.1, 0, -r*1.0);
        ctx.fill();

        ctx.restore();
    },

    drawCoconutCollectible(ctx, x, y, r, frame) {
        ctx.save();
        // Gentle hover float
        const hoverY = Math.sin(frame * 0.1 + Math.PI) * 4;
        ctx.translate(x, y + hoverY);
        
        // Brown coconut shell
        ctx.fillStyle = '#8b5a2b';
        ctx.beginPath();
        ctx.arc(0, 0, r*0.9, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#5c4033';
        ctx.lineWidth = 2;
        ctx.stroke();

        // White inner flesh showing from a crack
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-r*0.2, -r*0.1, r*0.4, r*0.2, Math.PI/6, 0, Math.PI*2);
        ctx.fill();

        // Three coconut dots/eyes
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(r*0.2, -r*0.2, 1.5, 0, Math.PI*2);
        ctx.arc(r*0.4, 0, 1.5, 0, Math.PI*2);
        ctx.arc(r*0.2, r*0.2, 1.5, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();
    },

    drawSteamVent(ctx, x, y, w, h, activeTimer) {
        ctx.save();
        // Draw rocky mound base
        ctx.fillStyle = '#34495e';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w*0.2, y + h*0.3);
        ctx.lineTo(x + w*0.8, y + h*0.3);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();

        // Draw glowing red cracks inside rock vent
        ctx.strokeStyle = '#ff7675';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x + w*0.2, y + h*0.8);
        ctx.lineTo(x + w*0.3, y + h*0.4);
        ctx.moveTo(x + w*0.7, y + h*0.9);
        ctx.lineTo(x + w*0.6, y + h*0.5);
        ctx.stroke();

        // Glowing center
        ctx.fillStyle = '#e17055';
        ctx.fillRect(x + w*0.35, y + h*0.25, w*0.3, h*0.1);

        // If venting steam, draw steam particles/plume!
        if (activeTimer > 0) {
            ctx.fillStyle = 'rgba(236, 240, 241, 0.7)';
            for (let i = 0; i < 8; i++) {
                let sy = y - activeTimer * 4 - (i * 12);
                let sx = x + w*0.5 + Math.sin(sy * 0.05) * 10;
                let size = 10 + i * 2;
                ctx.beginPath();
                ctx.arc(sx, sy, size, 0, Math.PI*2);
                ctx.fill();
            }
        }
        ctx.restore();
    },

    drawLava(ctx, x, y, w, h, frame) {
        ctx.save();
        // Lava main body (dark orange-red)
        ctx.fillStyle = '#e17055';
        ctx.fillRect(x, y + 20, w, h);

        // Rising bubbles/heat waves
        ctx.fillStyle = '#ff7675';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x, y + 20);
        for (let px = x; px <= x + w; px += 15) {
            let bubble = Math.sin((px + frame * 3) * 0.08) * 8;
            ctx.lineTo(px, y + 20 + bubble);
        }
        ctx.lineTo(x + w, y + h);
        ctx.fill();

        // Lava highlights (glowing yellow)
        ctx.fillStyle = '#fdcb6e';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x, y + 16);
        for (let px = x; px <= x + w; px += 20) {
            let bubble = Math.sin((px + frame * 3.5 + 20) * 0.06) * 4;
            ctx.lineTo(px, y + 16 + bubble);
        }
        ctx.lineTo(x + w, y + h);
        ctx.fill();

        // Fire particle bubbles floating up
        ctx.fillStyle = 'rgba(253, 203, 110, 0.8)';
        for (let i = 0; i < 2; i++) {
            let bx = x + ((frame * 2 + i * 25) % w);
            let by = y + 10 - ((frame + i * 15) % 30);
            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.restore();
    },

    drawMinion(ctx, x, y, w, h, frame, isHit = false, isBossMinion = false) {
        ctx.save();
        ctx.translate(x, y);
        
        // Bounce animation
        const bounce = Math.abs(Math.sin(frame * 0.15)) * h * 0.1;
        
        // Legs
        ctx.strokeStyle = isHit ? '#ffffff' : (isBossMinion ? '#8e44ad' : '#c0392b');
        ctx.lineWidth = 4;
        ctx.beginPath();
        // Left legs
        ctx.moveTo(w*0.2, h - bounce - h*0.3); ctx.lineTo(-w*0.1, h - bounce);
        ctx.moveTo(w*0.4, h - bounce - h*0.3); ctx.lineTo(w*0.2, h - bounce);
        // Right legs
        ctx.moveTo(w*0.8, h - bounce - h*0.3); ctx.lineTo(w*1.1, h - bounce);
        ctx.moveTo(w*0.6, h - bounce - h*0.3); ctx.lineTo(w*0.8, h - bounce);
        ctx.stroke();

        // Crab/Bug body
        ctx.fillStyle = isHit ? '#ffffff' : (isBossMinion ? '#9b59b6' : '#e74c3c');
        ctx.beginPath();
        ctx.ellipse(w/2, h - bounce - h*0.3, w/2, h*0.3, 0, 0, Math.PI*2);
        ctx.fill();
        if (isBossMinion) {
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(w*0.3, h - bounce - h*0.5, w*0.15, 0, Math.PI*2);
        ctx.arc(w*0.7, h - bounce - h*0.5, w*0.15, 0, Math.PI*2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(w*0.3 + Math.sin(frame*0.05)*2, h - bounce - h*0.5, w*0.05, 0, Math.PI*2);
        ctx.arc(w*0.7 + Math.sin(frame*0.05)*2, h - bounce - h*0.5, w*0.05, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();
    },

    drawBoss(ctx, x, y, w, h, frame, isHit, facingRight = true, levelIndex = 2, hp = 15, maxHp = 15) {
        ctx.save();
        ctx.translate(x, y);

        // Draw Boss Health Bar above the boss (before horizontal flip)
        const barW = 120;
        const barH = 10;
        const barX = -barW / 2;
        const barY = -h * 0.58;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);
        const hpRatio = Math.max(0, Math.min(1, hp / maxHp));
        ctx.fillStyle = hpRatio > 0.5 ? '#2ecc71' : (hpRatio > 0.25 ? '#f39c12' : '#ff5252');
        ctx.fillRect(barX, barY, barW * hpRatio, barH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barX - 2, barY - 2, barW + 4, barH + 4);

        if (!facingRight) {
            ctx.scale(-1, 1);
        }
        
        const wobble = Math.sin(frame * 0.1) * h*0.04;

        if (levelIndex === 1) {
            // Stage 1 Boss: Giant Tiki Crab (shifted down slightly so legs rest on ground y + h/2)
            ctx.translate(0, h * 0.1 + wobble);

            // Back Crab shell (red)
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.ellipse(0, h*0.1, w*0.35, h*0.25, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();

            // Legs (crab legs)
            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 6;
            for (let i = 0; i < 3; i++) {
                let angleOffset = (i - 1) * 0.4;
                // Left legs
                ctx.beginPath();
                ctx.moveTo(-w*0.2, h*0.1);
                ctx.quadraticCurveTo(-w*0.5, h*0.1 + angleOffset*20, -w*0.45, h*0.35 + angleOffset*10);
                ctx.stroke();
                // Right legs
                ctx.beginPath();
                ctx.moveTo(w*0.2, h*0.1);
                ctx.quadraticCurveTo(w*0.5, h*0.1 + angleOffset*20, w*0.45, h*0.35 + angleOffset*10);
                ctx.stroke();
            }

            // Snapping Claws
            const clawAngle = Math.sin(frame * 0.2) * 0.3;
            ctx.save();
            ctx.translate(-w*0.3, -h*0.1);
            ctx.rotate(-clawAngle);
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            // Claw pincher
            ctx.beginPath();
            ctx.arc(-10, -10, 10, 0, Math.PI, true);
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.translate(w*0.3, -h*0.1);
            ctx.rotate(clawAngle);
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            // Claw pincher
            ctx.beginPath();
            ctx.arc(10, -10, 10, 0, Math.PI, true);
            ctx.stroke();
            ctx.restore();

            // Front Tiki Shield Mask
            ctx.fillStyle = isHit ? '#fff' : '#8B5A2B'; // Wood brown
            ctx.fillRect(-w*0.22, -h*0.2, w*0.44, h*0.35);
            ctx.strokeStyle = '#3e2723';
            ctx.lineWidth = 4;
            ctx.strokeRect(-w*0.22, -h*0.2, w*0.44, h*0.35);

            // Tiki Carved Face details on mask
            // Glowing yellow eyes
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(-w*0.09, -h*0.05, 10, 0, Math.PI*2);
            ctx.arc(w*0.09, -h*0.05, 10, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            // Angry eyebrows
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-w*0.15, -h*0.12); ctx.lineTo(-w*0.03, -h*0.06);
            ctx.moveTo(w*0.15, -h*0.12); ctx.lineTo(w*0.03, -h*0.06);
            ctx.stroke();

            // Tiki nose
            ctx.fillStyle = '#d35400';
            ctx.fillRect(-6, -h*0.04, 12, 25);
            ctx.strokeRect(-6, -h*0.04, 12, 25);

            // Grinning mouth with teeth
            ctx.fillStyle = '#c0392b';
            ctx.fillRect(-w*0.12, h*0.05, w*0.24, 15);
            ctx.strokeRect(-w*0.12, h*0.05, w*0.24, 15);
            ctx.fillStyle = '#fff';
            // Teeth vertical marks
            for(let tx = -w*0.1; tx <= w*0.1; tx += 8) {
                ctx.fillRect(tx, h*0.05, 4, 15);
            }

            // Hibiscus flower decoration on top of mask
            ctx.fillStyle = '#ff7675';
            for (let i = 0; i < 5; i++) {
                let angle = (i * Math.PI * 2) / 5;
                ctx.beginPath();
                ctx.arc(-w*0.15 + Math.cos(angle)*8, -h*0.22 + Math.sin(angle)*8, 6, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.fillStyle = '#fdcb6e';
            ctx.beginPath();
            ctx.arc(-w*0.15, -h*0.22, 4, 0, Math.PI*2);
            ctx.fill();

            ctx.restore();
            return;
        }

        if (levelIndex === 2) {
            // Stage 2 Boss: Volcanic Tiki Totem Warrior
            ctx.translate(0, wobble);

            // Body (Dark Carved Tree Trunk)
            ctx.fillStyle = isHit ? '#fff' : '#4a2f13';
            ctx.beginPath();
            ctx.ellipse(0, h*0.15, w*0.18, h*0.35, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();

            // Lava glowing cracks on wood body
            if (!isHit) {
                ctx.strokeStyle = '#ff3d00'; // Glowing lava red
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(-w*0.1, h*0.05); ctx.lineTo(-w*0.05, h*0.25);
                ctx.moveTo(w*0.08, h*0.1); ctx.lineTo(w*0.03, h*0.3);
                ctx.moveTo(-w*0.05, h*0.25); ctx.lineTo(w*0.1, h*0.28);
                ctx.stroke();
            }

            // Left Green Cape/Leaf
            ctx.fillStyle = isHit ? '#fff' : '#00b894';
            ctx.beginPath();
            ctx.ellipse(-w*0.18, h*0.15, w*0.12, h*0.25, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();

            // Right Green Cape/Leaf
            ctx.beginPath();
            ctx.ellipse(w*0.18, h*0.15, w*0.12, h*0.25, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();

            // Head (Tiki Face)
            ctx.fillStyle = isHit ? '#fff' : '#4a2f13';
            ctx.beginPath();
            ctx.ellipse(0, -h*0.25, w*0.2, h*0.2, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();

            // Glowing Eyes (Yellow/Red)
            ctx.fillStyle = '#ff9a44';
            ctx.beginPath();
            ctx.arc(-w*0.07, -h*0.27, 8, 0, Math.PI*2);
            ctx.arc(w*0.07, -h*0.27, 8, 0, Math.PI*2);
            ctx.fill();
            // Angry eyebrows
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.moveTo(-w*0.12, -h*0.32); ctx.lineTo(-w*0.02, -h*0.28);
            ctx.moveTo(w*0.12, -h*0.32); ctx.lineTo(w*0.02, -h*0.28);
            ctx.stroke();

            // Mouth (carved smile with teeth)
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.arc(0, -h*0.16, w*0.08, 0, Math.PI);
            ctx.stroke();
            // Teeth vertical marks
            for(let tx = -w*0.05; tx <= w*0.05; tx += 6) {
                ctx.beginPath();
                ctx.moveTo(tx, -h*0.16);
                ctx.lineTo(tx, -h*0.16 + 6);
                ctx.stroke();
            }

            // Green Palm Crown
            ctx.fillStyle = isHit ? '#fff' : '#00b894';
            ctx.beginPath();
            ctx.moveTo(-w*0.15, -h*0.42);
            ctx.lineTo(-w*0.15, -h*0.54);
            ctx.lineTo(-w*0.05, -h*0.47);
            ctx.lineTo(0, -h*0.54);
            ctx.lineTo(w*0.05, -h*0.47);
            ctx.lineTo(w*0.15, -h*0.54);
            ctx.lineTo(w*0.15, -h*0.42);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.restore();
            return;
        }

        if (levelIndex === 3) {
            // Stage 3 Boss: Volcanic Pele Spirit (Fiery Head + Magma Vortex Base)
            ctx.translate(0, h * 0.16 + wobble * 1.2);

            // Swirling Magma Base reaching the ground
            ctx.fillStyle = isHit ? '#fff' : '#d35400';
            ctx.beginPath();
            ctx.ellipse(0, h*0.24, w*0.26, h*0.1, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = isHit ? '#fff' : '#e17055';
            ctx.beginPath();
            ctx.ellipse(0, h*0.14, w*0.22, h*0.12, 0, 0, Math.PI*2);
            ctx.fill();

            // Draw Fire aura particles around body
            ctx.fillStyle = 'rgba(230, 126, 34, 0.4)';
            for (let i = 0; i < 6; i++) {
                let fx = Math.sin(frame*0.2 + i) * w * 0.35;
                let fy = -h*0.15 - (i * 10);
                ctx.beginPath();
                ctx.arc(fx, fy, 25 - i*2, 0, Math.PI*2);
                ctx.fill();
            }

            // Head (Molten Rock/Lava Core)
            ctx.fillStyle = isHit ? '#fff' : '#2c3e50'; // Dark magma rock
            ctx.beginPath();
            ctx.ellipse(0, -h*0.1, w*0.28, h*0.28, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.strokeStyle = '#e67e22'; ctx.lineWidth = 4; ctx.stroke();

            // Lava cracks on Magma head
            if (!isHit) {
                ctx.strokeStyle = '#fdcb6e';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(-w*0.15, -h*0.15); ctx.lineTo(-w*0.05, -h*0.05);
                ctx.moveTo(w*0.15, -h*0.15); ctx.lineTo(w*0.05, -h*0.05);
                ctx.stroke();
            }

            // Flaming Eyes
            ctx.fillStyle = '#ff7675';
            ctx.beginPath();
            ctx.arc(-w*0.1, -h*0.16, 12, 0, Math.PI*2);
            ctx.arc(w*0.1, -h*0.16, 12, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#fdcb6e'; // Inner yellow glow
            ctx.beginPath();
            ctx.arc(-w*0.1, -h*0.16, 6, 0, Math.PI*2);
            ctx.arc(w*0.1, -h*0.16, 6, 0, Math.PI*2);
            ctx.fill();

            // Fire hair / flame crown rising
            ctx.fillStyle = '#e17055';
            ctx.beginPath();
            ctx.moveTo(-w*0.25, -h*0.25);
            ctx.quadraticCurveTo(-w*0.3, -h*0.6, -w*0.15, -h*0.5);
            ctx.quadraticCurveTo(0, -h*0.68, w*0.15, -h*0.5);
            ctx.quadraticCurveTo(w*0.3, -h*0.6, w*0.25, -h*0.25);
            ctx.closePath();
            ctx.fill();

            // Mouth (opening of glowing magma)
            ctx.fillStyle = '#d35400';
            ctx.beginPath();
            ctx.arc(0, -h*0.03, w*0.1, 0, Math.PI);
            ctx.fill();
            ctx.strokeStyle = '#fdcb6e'; ctx.lineWidth = 2.5; ctx.stroke();

            ctx.restore();
            return;
        }

        ctx.restore();
    },

    drawSpear(ctx, x, y, w, h, facingRight) {
        ctx.save();
        ctx.translate(x, y);
        
        // Draw Lava Fireball instead of generic spear
        // Outer fire glow
        ctx.fillStyle = 'rgba(225, 112, 85, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, w*0.7, 0, Math.PI*2);
        ctx.fill();

        // Main lava sphere
        ctx.fillStyle = '#e17055'; // Dark orange
        ctx.beginPath();
        ctx.arc(0, 0, w*0.45, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Hot yellow core
        ctx.fillStyle = '#fdcb6e';
        ctx.beginPath();
        ctx.arc(-w*0.1, -w*0.1, w*0.2, 0, Math.PI*2);
        ctx.fill();

        // Fire trails behind motion
        ctx.fillStyle = '#ff7675';
        ctx.beginPath();
        if (facingRight) {
            ctx.moveTo(-w*0.4, -w*0.2);
            ctx.lineTo(-w*0.9 - Math.random()*w*0.4, 0);
            ctx.lineTo(-w*0.4, w*0.2);
        } else {
            ctx.moveTo(w*0.4, -w*0.2);
            ctx.lineTo(w*0.9 + Math.random()*w*0.4, 0);
            ctx.lineTo(w*0.4, w*0.2);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    },

    drawPineapple(ctx, x, y, w, h, angle = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // Green leaves at the top
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.moveTo(0, -h*0.3);
        ctx.lineTo(-w*0.25, -h*0.7);
        ctx.lineTo(0, -h*0.5);
        ctx.lineTo(w*0.25, -h*0.7);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -h*0.3);
        ctx.lineTo(-w*0.4, -h*0.6);
        ctx.lineTo(-w*0.1, -h*0.45);
        ctx.lineTo(w*0.4, -h*0.6);
        ctx.lineTo(w*0.1, -h*0.45);
        ctx.closePath();
        ctx.fill();
        
        // Pineapple body (oval)
        ctx.fillStyle = '#f1c40f'; // Yellow
        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, w*0.4, h*0.4, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        // Cross-hatch pattern inside body
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 0, w*0.4, h*0.4, 0, 0, Math.PI*2);
        ctx.clip();
        
        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 1.5;
        // Draw lines from top-left to bottom-right
        for (let i = -w; i < w; i += w*0.3) {
            ctx.beginPath();
            ctx.moveTo(i - h*0.4, -h*0.4);
            ctx.lineTo(i + h*0.4, h*0.4);
            ctx.stroke();
        }
        // Draw lines from top-right to bottom-left
        for (let i = -w; i < w; i += w*0.3) {
            ctx.beginPath();
            ctx.moveTo(i + h*0.4, -h*0.4);
            ctx.lineTo(i - h*0.4, h*0.4);
            ctx.stroke();
        }
        ctx.restore();
        
        ctx.restore();
    },
    
    drawCage(ctx, x, y, w, h) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 3;
        
        // Bars
        for(let i=0; i<=5; i++) {
            let bx = -w/2 + (w/5)*i;
            ctx.beginPath();
            ctx.moveTo(bx, -h);
            ctx.lineTo(bx, 0);
            ctx.stroke();
        }
        
        // Top and bottom
        ctx.strokeRect(-w/2, -h, w, h);
        
        // Bird inside
        this.drawBird(ctx, 0, -h/2, w*0.6, h*0.6, 0);
        
        ctx.restore();
    },

    drawTikiSpikes(ctx, x, y, w, h, levelIndex) {
        ctx.save();
        if (levelIndex === 1) {
            // Stage 1: Sea Urchin (Ocean theme)
            const cx = x + w / 2;
            const cy = y + h - 15;
            const r = 12;

            // Draw spikes
            ctx.strokeStyle = '#4a235a';
            ctx.lineWidth = 3;
            const numSpikes = 12;
            for (let i = 0; i < numSpikes; i++) {
                const angle = (i / numSpikes) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(angle) * (r + 8), cy + Math.sin(angle) * (r + 8));
                ctx.stroke();
            }

            // Urchin Body
            ctx.fillStyle = '#6c3483';
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#341f97';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Eyes
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(cx - 4, cy - 2, 2.5, 0, Math.PI * 2);
            ctx.arc(cx + 4, cy - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(cx - 4, cy - 2, 1, 0, Math.PI * 2);
            ctx.arc(cx + 4, cy - 2, 1, 0, Math.PI * 2);
            ctx.fill();
        } else if (levelIndex === 3) {
            // Stage 3: Volcanic Obsidian & Magma Spikes
            const spikeW = w / 3;
            for (let i = 0; i < 3; i++) {
                const sx = x + i * spikeW;
                const sy = y + h;

                // Dark basalt/obsidian spike
                ctx.fillStyle = '#2c3e50';
                ctx.strokeStyle = '#e17055';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(sx + 2, sy);
                ctx.lineTo(sx + spikeW / 2, y + 8);
                ctx.lineTo(sx + spikeW - 2, sy);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Glowing magma tip
                ctx.fillStyle = '#fdcb6e';
                ctx.beginPath();
                ctx.moveTo(sx + spikeW * 0.3, y + 20);
                ctx.lineTo(sx + spikeW / 2, y + 8);
                ctx.lineTo(sx + spikeW * 0.7, y + 20);
                ctx.closePath();
                ctx.fill();
            }
        } else {
            // Stage 2: Bamboo Spikes (Jungle theme)
            ctx.fillStyle = '#27ae60'; // Bamboo green
            ctx.strokeStyle = '#1e8449';
            ctx.lineWidth = 2;

            const spikeW = w / 3;
            for (let i = 0; i < 3; i++) {
                const sx = x + i * spikeW;
                const sy = y + h;

                // Bamboo stem/pointed tip
                ctx.beginPath();
                ctx.moveTo(sx + 3, sy);
                ctx.lineTo(sx + spikeW / 2, y + 10); // pointed top
                ctx.lineTo(sx + spikeW - 3, sy);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Bamboo joints / segments
                ctx.beginPath();
                ctx.moveTo(sx + 5, sy - 12);
                ctx.lineTo(sx + spikeW - 5, sy - 12);
                ctx.moveTo(sx + 6, sy - 24);
                ctx.lineTo(sx + spikeW - 6, sy - 24);
                ctx.stroke();
            }
        }
        ctx.restore();
    },

    drawTikiTotem(ctx, x, y, w, h, hp) {
        ctx.save();
        
        // Base block
        ctx.fillStyle = '#d35400'; // Warm Tiki wood orange-brown
        ctx.fillRect(x, y, w, h);
        
        // Wood border
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        // Tiki Eyes
        ctx.fillStyle = '#f1c40f'; // Yellow eyes
        ctx.beginPath();
        ctx.arc(x + w * 0.3, y + h * 0.35, 7, 0, Math.PI * 2);
        ctx.arc(x + w * 0.7, y + h * 0.35, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Eye Slits
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w * 0.2, y + h * 0.35 - 1, w * 0.2, 2);
        ctx.fillRect(x + w * 0.6, y + h * 0.35 - 1, w * 0.2, 2);

        // Tiki Nose
        ctx.fillStyle = '#e67e22';
        ctx.fillRect(x + w * 0.45, y + h * 0.25, w * 0.1, h * 0.3);
        ctx.strokeRect(x + w * 0.45, y + h * 0.25, w * 0.1, h * 0.3);

        // Tiki Mouth with teeth
        ctx.fillStyle = '#ba4a00';
        ctx.fillRect(x + w * 0.2, y + h * 0.65, w * 0.6, h * 0.2);
        ctx.strokeRect(x + w * 0.2, y + h * 0.65, w * 0.6, h * 0.2);

        // Teeth (lines inside mouth)
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + w * 0.25, y + h * 0.65, 4, h * 0.2);
        ctx.fillRect(x + w * 0.4, y + h * 0.65, 4, h * 0.2);
        ctx.fillRect(x + w * 0.55, y + h * 0.65, 4, h * 0.2);
        ctx.fillRect(x + w * 0.7, y + h * 0.65, 4, h * 0.2);

        // Eyebrows
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 4;
        ctx.beginPath();
        // Left angry brow
        ctx.moveTo(x + w * 0.15, y + h * 0.2);
        ctx.lineTo(x + w * 0.45, y + h * 0.28);
        // Right angry brow
        ctx.moveTo(x + w * 0.85, y + h * 0.2);
        ctx.lineTo(x + w * 0.55, y + h * 0.28);
        ctx.stroke();

        // Cracks if hp is 1
        if (hp === 1) {
            ctx.strokeStyle = '#3e2723';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            // Crack 1
            ctx.moveTo(x + 5, y + 5);
            ctx.lineTo(x + 15, y + 25);
            ctx.lineTo(x + 8, y + 35);
            
            // Crack 2
            ctx.moveTo(x + w - 5, y + h - 5);
            ctx.lineTo(x + w - 20, y + h - 25);
            ctx.lineTo(x + w - 12, y + h - 40);
            
            // Crack 3 (center)
            ctx.moveTo(x + w/2, y + 10);
            ctx.lineTo(x + w/2 - 10, y + h/2);
            
            ctx.stroke();
        }

        ctx.restore();
    },

    drawTikiFireJet(ctx, x, y, w, h, frameCycle, globalFrame) {
        ctx.save();
        
        // Stone color
        ctx.fillStyle = '#7f8c8d';
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 3;

        // Base Statue shape (Stone head sitting on block)
        ctx.beginPath();
        ctx.arc(x + w/2, y + h/2, w/2, Math.PI, 0); // Top dome
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Stone Nose
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(x + w*0.4, y + h*0.4, w*0.2, h*0.35);
        ctx.strokeRect(x + w*0.4, y + h*0.4, w*0.2, h*0.35);

        // Stone Mouth (at the top/center where fire will shoot)
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(x + w/2, y + h*0.3, w*0.15, 0, Math.PI, true);
        ctx.fill();

        let cycle = frameCycle % 180;
        
        if (cycle >= 90 && cycle < 120) {
            // Warning State: Glowing red eyes and small sparks
            ctx.fillStyle = '#e74c3c'; // red eyes
            ctx.beginPath();
            ctx.arc(x + w*0.25, y + h*0.45, 4, 0, Math.PI*2);
            ctx.arc(x + w*0.75, y + h*0.45, 4, 0, Math.PI*2);
            ctx.fill();

            // Rising sparks
            ctx.fillStyle = '#f39c12';
            for (let i = 0; i < 3; i++) {
                let sparkX = x + w/2 + Math.sin(globalFrame * 0.2 + i) * 8;
                let sparkY = y + h*0.2 - (globalFrame % 20) * 0.5 - i*8;
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, 2, 0, Math.PI*2);
                ctx.fill();
            }
        } else if (cycle >= 120 && cycle < 180) {
            // Active State: Glowing yellow/red eyes and huge fire pillar
            ctx.fillStyle = '#f1c40f'; // yellow glowing eyes
            ctx.beginPath();
            ctx.arc(x + w*0.25, y + h*0.45, 4, 0, Math.PI*2);
            ctx.arc(x + w*0.75, y + h*0.45, 4, 0, Math.PI*2);
            ctx.fill();

            // Fire Pillar height and animation offset
            let fireMaxH = 120;
            let flicker = Math.sin(globalFrame * 0.5) * 10;
            let fireH = fireMaxH + flicker;

            // Gradient for fire
            let grad = ctx.createLinearGradient(x + w/2, y, x + w/2, y - fireH);
            grad.addColorStop(0, '#e74c3c'); // dark red at base
            grad.addColorStop(0.4, '#e67e22'); // orange
            grad.addColorStop(0.8, '#f1c40f'); // yellow
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)'); // fade to transparent at tip

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(x + w*0.3, y + h*0.3);
            ctx.quadraticCurveTo(x + w*0.1 + flicker*0.5, y - fireH*0.5, x + w/2, y - fireH);
            ctx.quadraticCurveTo(x + w*0.9 - flicker*0.5, y - fireH*0.5, x + w*0.7, y + h*0.3);
            ctx.closePath();
            ctx.fill();

            // Inner flame core
            let innerH = fireH * 0.6;
            let innerGrad = ctx.createLinearGradient(x + w/2, y, x + w/2, y - innerH);
            innerGrad.addColorStop(0, '#e67e22');
            innerGrad.addColorStop(0.7, '#f1c40f');
            innerGrad.addColorStop(1, '#ffffff');

            ctx.fillStyle = innerGrad;
            ctx.beginPath();
            ctx.moveTo(x + w*0.4, y + h*0.3);
            ctx.quadraticCurveTo(x + w*0.3 + flicker*0.2, y - innerH*0.5, x + w/2, y - innerH);
            ctx.quadraticCurveTo(x + w*0.7 - flicker*0.2, y - innerH*0.5, x + w*0.6, y + h*0.3);
            ctx.closePath();
            ctx.fill();
        } else {
            // Idle State: Closed eyes
            ctx.strokeStyle = '#34495e';
            ctx.lineWidth = 2;
            // Left eye curve
            ctx.beginPath();
            ctx.arc(x + w*0.25, y + h*0.45, 4, 0, Math.PI, false);
            ctx.stroke();
            // Right eye curve
            ctx.beginPath();
            ctx.arc(x + w*0.75, y + h*0.45, 4, 0, Math.PI, false);
            ctx.stroke();
        }

        ctx.restore();
    },

    drawVillainRacer(ctx, x, y, w, h, wheelRotation = 0, frame = 0, difficulty = 'medium', isHovering = false, stunTimer = 0, dropFlash = 0) {
        ctx.save();
        const wobbleY = isHovering ? Math.sin(frame * 0.25) * 3.5 : 0;
        const stunShake = stunTimer > 0 ? Math.sin(frame * 0.9) * 3 : 0;
        ctx.translate(x + stunShake, y + wobbleY);

        const accentColor = difficulty === 'hard' ? '#ff3838' : (difficulty === 'easy' ? '#00cec9' : '#ff9f43');
        const trimColor = difficulty === 'hard' ? '#9b59b6' : (difficulty === 'easy' ? '#e17055' : '#e74c3c');

        // Subtle villain aura on Hard
        if (difficulty === 'hard') {
            ctx.fillStyle = 'rgba(155, 89, 182, 0.22)';
            ctx.beginPath();
            ctx.ellipse(w * 0.5, h * 0.55, w * 0.65, h * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Hover jet flames underneath when gliding over gaps/obstacles
        if (isHovering && stunTimer <= 0) {
            const jetLen = 10 + Math.sin(frame * 0.6) * 5;
            ctx.fillStyle = 'rgba(155, 89, 182, 0.75)';
            ctx.beginPath();
            ctx.moveTo(w * 0.18, h * 0.78);
            ctx.lineTo(w * 0.26, h * 0.78 + jetLen + 5);
            ctx.lineTo(w * 0.34, h * 0.78);
            ctx.moveTo(w * 0.64, h * 0.78);
            ctx.lineTo(w * 0.72, h * 0.78 + jetLen + 5);
            ctx.lineTo(w * 0.80, h * 0.78);
            ctx.fill();

            ctx.fillStyle = '#fdcb6e';
            ctx.beginPath();
            ctx.moveTo(w * 0.22, h * 0.78);
            ctx.lineTo(w * 0.26, h * 0.78 + jetLen * 0.65);
            ctx.lineTo(w * 0.30, h * 0.78);
            ctx.moveTo(w * 0.68, h * 0.78);
            ctx.lineTo(w * 0.72, h * 0.78 + jetLen * 0.65);
            ctx.lineTo(w * 0.76, h * 0.78);
            ctx.fill();
        }

        // Rear turbo exhaust flame
        if (stunTimer <= 0) {
            const flameLen = 14 + Math.random() * 14;
            ctx.fillStyle = trimColor;
            ctx.beginPath();
            ctx.moveTo(w * 0.04, h * 0.48);
            ctx.lineTo(-flameLen, h * 0.56);
            ctx.lineTo(w * 0.04, h * 0.66);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fdcb6e';
            ctx.beginPath();
            ctx.moveTo(w * 0.04, h * 0.52);
            ctx.lineTo(-flameLen * 0.5, h * 0.56);
            ctx.lineTo(w * 0.04, h * 0.62);
            ctx.closePath();
            ctx.fill();
        }

        // Rear drop-chute hatch (glows brightly right when dropping a bomb/trap/goon)
        ctx.fillStyle = dropFlash > 0 ? '#f1c40f' : '#4a235a';
        ctx.fillRect(-w * 0.03, h * 0.42, w * 0.16, h * 0.28);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-w * 0.03, h * 0.42, w * 0.16, h * 0.28);

        // Main dark obsidian chassis (sleek wedge hotrod)
        ctx.fillStyle = '#1e272e';
        ctx.beginPath();
        ctx.moveTo(w * 0.05, h * 0.42);
        ctx.lineTo(w * 0.32, h * 0.34);
        ctx.lineTo(w * 0.78, h * 0.38);
        ctx.lineTo(w * 1.0, h * 0.56);
        ctx.lineTo(w * 0.94, h * 0.74);
        ctx.lineTo(w * 0.08, h * 0.74);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = trimColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Crimson/purple racing flame stripe on chassis
        ctx.fillStyle = trimColor;
        ctx.beginPath();
        ctx.moveTo(w * 0.22, h * 0.50);
        ctx.lineTo(w * 0.78, h * 0.48);
        ctx.lineTo(w * 0.88, h * 0.58);
        ctx.lineTo(w * 0.30, h * 0.62);
        ctx.closePath();
        ctx.fill();

        // Spiked front bumper ram
        ctx.fillStyle = '#b2bec3';
        ctx.beginPath();
        ctx.moveTo(w * 0.96, h * 0.48);
        ctx.lineTo(w * 1.12, h * 0.54);
        ctx.lineTo(w * 0.98, h * 0.60);
        ctx.lineTo(w * 1.10, h * 0.66);
        ctx.lineTo(w * 0.94, h * 0.72);
        ctx.closePath();
        ctx.fill();

        // Cockpit & Mischievous Tiki Bandit Driver
        ctx.fillStyle = '#3d2817'; // Dark carved tiki head
        ctx.fillRect(w * 0.34, h * 0.06, w * 0.28, h * 0.32);
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(w * 0.34, h * 0.06, w * 0.28, h * 0.32);

        // Villain spiked crown / bandana
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(w * 0.32, h * 0.12);
        ctx.lineTo(w * 0.38, -h * 0.06);
        ctx.lineTo(w * 0.46, h * 0.08);
        ctx.lineTo(w * 0.52, -h * 0.08);
        ctx.lineTo(w * 0.58, h * 0.08);
        ctx.lineTo(w * 0.64, -h * 0.04);
        ctx.lineTo(w * 0.64, h * 0.14);
        ctx.closePath();
        ctx.fill();

        // Glowing angry villain eyes
        ctx.fillStyle = stunTimer > 0 ? '#dfe6e9' : '#f1c40f';
        ctx.beginPath();
        ctx.arc(w * 0.44, h * 0.22, 3.5, 0, Math.PI * 2);
        ctx.arc(w * 0.56, h * 0.22, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Slanted brows
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.39, h * 0.16);
        ctx.lineTo(w * 0.47, h * 0.20);
        ctx.moveTo(w * 0.61, h * 0.16);
        ctx.lineTo(w * 0.53, h * 0.20);
        ctx.stroke();

        // Evil grin
        ctx.fillStyle = '#fff';
        ctx.fillRect(w * 0.41, h * 0.29, w * 0.18, 4);

        // Dark spiked wheels
        ctx.fillStyle = '#111';
        this.drawWheel(ctx, w * 0.25, h * 0.76, w * 0.14, wheelRotation);
        this.drawWheel(ctx, w * 0.74, h * 0.76, w * 0.14, wheelRotation);
        // Glowing hubcaps
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(w * 0.25, h * 0.76, 3.5, 0, Math.PI * 2);
        ctx.arc(w * 0.74, h * 0.76, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Stun spin stars above head
        if (stunTimer > 0) {
            for (let i = 0; i < 3; i++) {
                const ang = frame * 0.25 + (i * Math.PI * 2) / 3;
                const sx = w * 0.48 + Math.cos(ang) * 18;
                const sy = -h * 0.18 + Math.sin(ang) * 6;
                ctx.fillStyle = i % 2 === 0 ? '#fdcb6e' : '#ffffff';
                ctx.beginPath();
                ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Floating RIVAL overhead pill badge
        ctx.fillStyle = stunTimer > 0 ? 'rgba(243, 156, 18, 0.9)' : 'rgba(214, 48, 49, 0.88)';
        ctx.fillRect(w * 0.15, -h * 0.46, w * 0.70, 15);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stunTimer > 0 ? 'STUNNED!' : 'RIVAL', w * 0.5, -h * 0.46 + 8);

        ctx.restore();
    },

    drawVillainBomb(ctx, x, y, r, frame, fuseRatio = 1) {
        ctx.save();
        ctx.translate(x, y);

        // Pulsing blast warning ring (pulses faster as fuse gets low)
        const pulseSpeed = fuseRatio < 0.35 ? 0.55 : 0.2;
        const pulse = 0.5 + 0.5 * Math.sin(frame * pulseSpeed);
        const dangerAlpha = 0.15 + (1 - fuseRatio) * 0.3 + pulse * 0.2;
        ctx.strokeStyle = `rgba(255, 71, 87, ${dangerAlpha.toFixed(2)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r * (1.5 + pulse * 0.55), 0, Math.PI * 2);
        ctx.stroke();

        // Dark iron bomb shell (flashes red/white right before exploding)
        const flashRed = fuseRatio < 0.3 && Math.floor(frame / 4) % 2 === 0;
        ctx.fillStyle = flashRed ? '#e74c3c' : '#2d3436';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Top fuse cap
        ctx.fillStyle = '#636e72';
        ctx.fillRect(-r * 0.32, -r - 3, r * 0.64, 5);

        // Angry painted Tiki eyes on bomb
        ctx.fillStyle = flashRed ? '#fff' : '#ff9f43';
        ctx.beginPath();
        ctx.arc(-r * 0.32, -r * 0.1, 2.5, 0, Math.PI * 2);
        ctx.arc(r * 0.32, -r * 0.1, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Zig-zag mouth
        ctx.strokeStyle = flashRed ? '#fff' : '#ff9f43';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-r * 0.4, r * 0.3);
        ctx.lineTo(-r * 0.15, r * 0.15);
        ctx.lineTo(r * 0.15, r * 0.35);
        ctx.lineTo(r * 0.4, r * 0.2);
        ctx.stroke();

        // Sizzling fuse
        ctx.strokeStyle = '#dfe6e9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -r - 3);
        ctx.quadraticCurveTo(r * 0.5, -r * 1.7, r * 0.75, -r * 1.35);
        ctx.stroke();

        // Spark at fuse tip
        ctx.fillStyle = frame % 6 < 3 ? '#f1c40f' : '#ff5252';
        ctx.beginPath();
        ctx.arc(r * 0.75, -r * 1.35, 3.5 + pulse * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    drawVillainTrap(ctx, x, y, w, h, frame, fadeRatio = 1) {
        ctx.save();
        // Blink gently during last 2 seconds before despawning
        if (fadeRatio < 0.2 && Math.floor(frame / 6) % 2 === 0) {
            ctx.globalAlpha = 0.45;
        }

        const baseY = y + h;

        // Metal trap base plate
        ctx.fillStyle = '#2c2c54';
        ctx.strokeStyle = '#9b59b6';
        ctx.lineWidth = 2;
        ctx.fillRect(x + 2, baseY - 8, w - 4, 8);
        ctx.strokeRect(x + 2, baseY - 8, w - 4, 8);

        // Glowing warning core light in center
        ctx.fillStyle = Math.floor(frame / 10) % 2 === 0 ? '#ff3838' : '#fdcb6e';
        ctx.beginPath();
        ctx.arc(x + w / 2, baseY - 4, 3, 0, Math.PI * 2);
        ctx.fill();

        // Jagged metallic/crimson trap teeth spikes
        const numTeeth = 4;
        const toothW = (w - 6) / numTeeth;
        for (let i = 0; i < numTeeth; i++) {
            const tx = x + 3 + i * toothW;
            ctx.fillStyle = '#474787';
            ctx.strokeStyle = '#1e272e';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tx, baseY - 7);
            ctx.lineTo(tx + toothW / 2, y + 6);
            ctx.lineTo(tx + toothW, baseY - 7);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Glowing crimson tip
            ctx.fillStyle = '#ff5252';
            ctx.beginPath();
            ctx.moveTo(tx + toothW * 0.28, y + 14);
            ctx.lineTo(tx + toothW / 2, y + 6);
            ctx.lineTo(tx + toothW * 0.72, y + 14);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    },

    drawVillainMinion(ctx, x, y, w, h, frame, isHit = false, armored = false) {
        ctx.save();
        ctx.translate(x, y);

        const bounce = Math.abs(Math.sin(frame * 0.22)) * h * 0.14;

        // Mechanical/spiky legs
        ctx.strokeStyle = isHit ? '#ffffff' : '#6c5ce7';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(w * 0.22, h - bounce - h * 0.28); ctx.lineTo(0, h - bounce);
        ctx.moveTo(w * 0.42, h - bounce - h * 0.28); ctx.lineTo(w * 0.25, h - bounce);
        ctx.moveTo(w * 0.78, h - bounce - h * 0.28); ctx.lineTo(w, h - bounce);
        ctx.moveTo(w * 0.58, h - bounce - h * 0.28); ctx.lineTo(w * 0.75, h - bounce);
        ctx.stroke();

        // Dark charcoal rival goon shell
        ctx.fillStyle = isHit ? '#ffffff' : '#2d3436';
        ctx.beginPath();
        ctx.ellipse(w / 2, h - bounce - h * 0.36, w * 0.46, h * 0.34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = armored ? '#fdcb6e' : '#ff3838';
        ctx.lineWidth = armored ? 2.5 : 2;
        ctx.stroke();

        // Top mohawk / shell spikes
        ctx.fillStyle = armored ? '#fdcb6e' : '#ff3838';
        for (let i = -1; i <= 1; i++) {
            const sx = w * 0.5 + i * (w * 0.2);
            const sy = h - bounce - h * 0.65;
            ctx.beginPath();
            ctx.moveTo(sx - 4, sy + 5);
            ctx.lineTo(sx, sy - 6);
            ctx.lineTo(sx + 4, sy + 5);
            ctx.closePath();
            ctx.fill();
        }

        // Crimson villain visor / headband
        ctx.fillStyle = '#d63031';
        ctx.fillRect(w * 0.14, h - bounce - h * 0.52, w * 0.72, h * 0.14);

        // Glowing menacing eyes inside visor
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(w * 0.34, h - bounce - h * 0.45, 3.5, 0, Math.PI * 2);
        ctx.arc(w * 0.66, h - bounce - h * 0.45, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
};
