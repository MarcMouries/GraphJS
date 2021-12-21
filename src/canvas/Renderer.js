

export class Renderer {

    constructor(ctx) {
        this.ctx = ctx;
    }

    drawGrid(w, h) {

        this.ctx.save()

        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 0, w, h)
        this.ctx.lineWidth = 0.3;
        this.ctx.strokeStyle = 'lightgray'
        this.ctx.fillStyle = 'black'

        for (let i = 1; i < w; i++) {
            this.ctx.beginPath()
            if (i % 10 === 0) {
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, h)
                this.ctx.moveTo(i, 0);
            }
            this.ctx.closePath()
            this.ctx.stroke()
        }

        for (let i = 1; i < h; i++) {
            this.ctx.beginPath()
            if (i % 10 === 0) {
                this.ctx.moveTo(0, i)
                this.ctx.lineTo(w, i)
                this.ctx.moveTo(0, i)
            }
            this.ctx.closePath()
            this.ctx.stroke()
        }


        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = 'gray'

        this.ctx.beginPath()
        for (let i = 50; i < w; i += 10) {
            if (i % 50 === 0) {
                this.ctx.moveTo(i, 0)
                this.ctx.lineTo(i, 30)
                this.ctx.fillText(` ${i}`, i, 30)
            } else {
                this.ctx.moveTo(i, 0)
                this.ctx.lineTo(i, 10)
            }

        }
        this.ctx.closePath()
        this.ctx.stroke()

        this.ctx.beginPath()
        for (let i = 50; i < h; i += 10) {
            if (i % 50 === 0) {
                this.ctx.moveTo(0, i)
                this.ctx.lineTo(30, i)
                this.ctx.fillText(` ${i}`, 30, i)
            } else {
                this.ctx.moveTo(0, i)
                this.ctx.lineTo(10, i)
            }

        }
        this.ctx.closePath()
        this.ctx.stroke()

        this.ctx.restore()
    }
}