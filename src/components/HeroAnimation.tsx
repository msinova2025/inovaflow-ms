import { useRef, useEffect } from "react";

export const HeroAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Cube class
    class Cube {
      x: number;
      y: number;
      z: number;
      size: number;
      rotationX: number;
      rotationY: number;
      rotationZ: number;
      speedX: number;
      speedY: number;
      speedZ: number;

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 500 - 250;
        this.size = Math.random() * 8 + 5;
        this.rotationX = Math.random() * Math.PI * 2;
        this.rotationY = Math.random() * Math.PI * 2;
        this.rotationZ = Math.random() * Math.PI * 2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.speedZ = (Math.random() - 0.5) * 0.005;
      }

      update(canvas: HTMLCanvasElement, mouseX: number, mouseY: number) {
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }

        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        this.z += this.speedZ;

        // Update rotation
        this.rotationX += 0.005;
        this.rotationY += 0.005;
        this.rotationZ += 0.005;

        // Wrap around edges
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
        if (this.z < -250) this.z = 250;
        if (this.z > 250) this.z = -250;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const scale = 200 / (200 + this.z);
        const x = this.x;
        const y = this.y;
        const size = this.size * scale;

        ctx.save();
        ctx.translate(x, y);
        
        // Calculate opacity based on z-position (further = more transparent)
        const opacity = Math.max(0.01, 0.05 * (1 - (this.z + 250) / 500));

        // Draw cube faces with 3D rotation effect
        const cos = Math.cos(this.rotationY);
        const sin = Math.sin(this.rotationY);

        // Front face
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 1.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(-size / 2, -size / 2, size, size);
        ctx.fill();
        ctx.stroke();

        // Right face (darker)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
        ctx.beginPath();
        ctx.moveTo(size / 2, -size / 2);
        ctx.lineTo(size / 2 + size * 0.3 * cos, -size / 2 - size * 0.3 * sin);
        ctx.lineTo(size / 2 + size * 0.3 * cos, size / 2 - size * 0.3 * sin);
        ctx.lineTo(size / 2, size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top face (lighter)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.beginPath();
        ctx.moveTo(-size / 2, -size / 2);
        ctx.lineTo(-size / 2 + size * 0.3 * cos, -size / 2 - size * 0.3 * sin);
        ctx.lineTo(size / 2 + size * 0.3 * cos, -size / 2 - size * 0.3 * sin);
        ctx.lineTo(size / 2, -size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }
    }

    // Create cubes
    const cubes: Cube[] = [];
    for (let i = 0; i < 12; i++) {
      cubes.push(new Cube(canvas));
    }

    // Mouse tracking
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sort cubes by z-index
      cubes.sort((a, b) => a.z - b.z);

      cubes.forEach((cube) => {
        cube.update(canvas, mouseX, mouseY);
        cube.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    let animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 1 }}
    />
  );
};
