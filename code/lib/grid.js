import {Transform} from './transform.js';

export class Grid
{
	constructor(x, y, layout) 
	{
		var vert = [];

        for(var i = 135; i <= 405; i += 1)
        {
            //if(i >=45 && i <= 135) continue;
            var theta = i * Math.PI/180;

            var v1 = [r*Math.sin(theta), r*Math.cos(theta), 0];
            var v2 = [cx, cy, 0];

            vert.push(v1[0], v1[1], v1[2]);
            vert.push(v2[0], v2[1], v2[2]);
        }

        this.vertexPositions = new Float32Array(vert);

		this.type = "pacman";
		this.color = color;
		this.transform = new Transform();
	}
}