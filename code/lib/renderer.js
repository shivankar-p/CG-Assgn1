export class WebGLRenderer 
{
	constructor() 
	{
		this.domElement = document.createElement("canvas");
		this.gl =
			this.domElement.getContext("webgl",{preserveDrawingBuffer: true}) ||
			this.domElement.getContext("experimental-webgl");

		if (!this.gl) throw new Error("WebGL is not supported");

		this.setSize(50, 50);
		this.clear(1.0, 1.0, 1.0, 1.0);
	}


	setSize(width, height) 
	{
		this.domElement.width = width;
		this.domElement.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

	clear(r, g, b, a) 
	{
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	setAnimationLoop(animation) 
	{
		function renderLoop() {
			animation();
			window.requestAnimationFrame(renderLoop);
		}

		renderLoop();
	}

	// render function executes all the time
	// can be thought of as the main game loop
	// @param {scene} - Scene to render
	// @param {shader} - Shader to use
	// for each primitive in the scene, updates the transform matrix and renders the primitve
	render(scene, shader) 
	{
		scene.primitives.forEach(function (primitive) {
			primitive.transform.updateModelTransformMatrix();

			shader.bindArrayBuffer(
				shader.vertexAttributesBuffer,
				primitive.vertexPositions
			);

			shader.fillAttributeData(
				"aPosition",
				primitive.vertexPositions,
				3,
				3 * primitive.vertexPositions.BYTES_PER_ELEMENT,
				0
			);

			shader.setUniform4f("uColor", primitive.color);
			shader.setUniformMatrix4fv("uModelTransformMatrix", primitive.transform.modelTransformMatrix);

			// Draw
			shader.drawArrays(primitive.vertexPositions.length / 3);
		});
	}


	glContext() 
	{
		return this.gl;
	}

	getCanvas() 
	{
		return this.domElement;
	}


	// gets mouse click reduced to the form of clip space
	// uses the mouseEvent target attribute to calculate the mouse position in clip space of webGL canvas
	mouseToClipCoord(x, y) 
	{
		// TO DO 

		//converting to range -1, 1
		x = x / this.domElement.width;
		y = y / this.domElement.height;

		x = 2*x-1;
		y = 2*y-1;

		y = -y;

		return [x, y];
	}	
}
