import {Transform} from './transform.js';

export class Circle
{
	constructor(cx, cy, r, color) 
	{
		var vert = [];
        //vert.push(cx, cy);
        for(var i = 0; i <= 360; i += 1)
        {
            //if(i >=45 && i <= 135) continue;
            var theta = i * Math.PI/180;

            var v1 = [r*Math.sin(theta), r*Math.cos(theta), 0];
            var v2 = [0, 0, 0];

            vert.push(v1[0], v1[1], v1[2]);
            vert.push(v2[0], v2[1], v2[2]);
        }

        this.vertexPositions = new Float32Array(vert);

		this.type = "circle";
		this.color = color;
		this.transform = new Transform(cx, cy, 0);
	}
}