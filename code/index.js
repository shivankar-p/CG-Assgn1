import { Scene, Triangle, Quadrilateral, WebGLRenderer, Shader, Pacman, Circle } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import { layout1, layout2, layout3 } from './lib/gridLayout.js';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';


const scrn = 550;
const cell = 50;
const renderer = new WebGLRenderer();
renderer.setSize(scrn, scrn);

document.body.appendChild(renderer.domElement);

const shader = new Shader(
	renderer.glContext(),
	vertexShaderSrc,
	fragmentShaderSrc
);

shader.use();


const layout_arr = [layout1, layout2, layout3];
var layout_in = 0;
var layout = layout_arr[layout_in];

const pacman_pos = [[(10*cell + cell/2 - ((scrn/2)))/(scrn/2), ((scrn/2) - 6*cell - 25)/(scrn/2)], 
                    [(0*cell + cell/2 - ((scrn/2)))/(scrn/2), ((scrn/2) - 0*cell - 25)/(scrn/2)], 
                    [(5*cell + cell/2 - ((scrn/2)))/(scrn/2), ((scrn/2) - 3*cell - 25)/(scrn/2)]];


var pac = new Pacman(
    pacman_pos[layout_in][0],
    pacman_pos[layout_in][1],
    0.05,
    [255 / 255, 255 / 255, 0 / 255, 1]
    );


var scene = new Scene();


//maps grid index to index of primitive in the scene
var map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]





var mode = 1;

//mode 1 - normal
//mode 2 - pickup and drop pacman

//return [false/true, layout[i][j]]
function isvalid(coord)
{
    
    var x = coord[0];
    var y = coord[1];

    //out of grid
    if(x < -1 || y < -1 || x > 1 || y > 1)    return [false, -1, -1];

    //convert to index

    var j = ((x*(scrn/2)) + (scrn/2) - 25)/cell;
    var i = -((y*(scrn/2)) + 25 - (scrn/2))/cell;

    

    i = Math.round(i);
    j = Math.round(j);

    


    if(layout[i][j] != 0)
    {
        //fx = false;
        if(layout[i][j] == 4) return [true, i, j];
        var rad = 0.015;
        if(layout[i][j] == 2 || layout[i][j] == 3) rad = 0.03;
        scene.primitives[map[i][j]] = new Circle(
            (j*cell + 25 - ((scrn/2)))/(scrn/2),
            ((scrn/2) - i*cell - 25)/(scrn/2),
            rad,
            [0 / 255, 255 / 255, 0 / 255, 1]
            );
        pac.transform.scale[0] = 1;
        pac.transform.scale[1] = 1;
        
        return [true, i, j];
    }
    else return [false, -1, -1];
}

var fx = false;

function specialEffects(i, j) {

    if(layout[i][j] == 2) {
        
        fx = true;

        layout[i][j] = 3;
    }
}

function validatemovement(dir) {
    var coord = [pac.transform.translate[0], pac.transform.translate[1]];
    if(dir == "ArrowRight") {
        coord[0] += cell/(scrn/2);
        if(isvalid(coord)[0])  {
            pac.transform.translate[0] += cell/(scrn/2);
            pac.transform.rotationAngle = 0;
            //pac.transform.updateModelTransformMatrix();
            specialEffects(isvalid(coord)[1], isvalid(coord)[2]);
        }
    }
    else if(dir == "ArrowLeft") {
        coord[0] -= cell/(scrn/2);
        if(isvalid(coord)[0])  {
            pac.transform.translate[0] -= cell/(scrn/2);
            pac.transform.rotationAngle = -Math.PI;
            //pac.transform.updateModelTransformMatrix();
            specialEffects(isvalid(coord)[1], isvalid(coord)[2]);
        }
        
    }
    else if(dir == "ArrowUp") {
        coord[1] += cell/(scrn/2);
        if(isvalid(coord)[0])  {
            pac.transform.translate[1] += cell/(scrn/2);
            pac.transform.rotationAngle = Math.PI/2;
            specialEffects(isvalid(coord)[1], isvalid(coord)[2]);
        }
    }
    else if(dir == "ArrowDown"){
        coord[1] -= cell/(scrn/2);
        if(isvalid(coord)[0])  {
            pac.transform.translate[1] -= cell/(scrn/2);
            pac.transform.rotationAngle = -Math.PI/2;
            //pac.transform.updateModelTransformMatrix();
            specialEffects(isvalid(coord)[1], isvalid(coord)[2]);
        }
    }
}


var rot = false;


document.addEventListener("keydown", event => {

    //console.log(event);
    //blocking events during scale animation
    if(fx) {
        return;
    }

    //mode switch
    if(event.key == 'm') {
        if(mode == 1) {
            mode = 2;
        }
        else mode = 1;
        //console.log(pac.transform.translate)
        return;
    }

    if(mode == 2) return;

    validatemovement(event.key);

    if(event.key == "(")
    {
        //console.log(pac.transform.rotationAngle);
        pac.transform.rotationAngle += Math.PI/4;    
    }

    if(event.key == ")")
    {
        //console.log(pac.transform.rotationAngle);
        pac.transform.rotationAngle -= Math.PI/4;
        
    }

    if(event.key == "[")
    {

        scene.getPrimitives().forEach(element => {
            // element.transform.rotatecw();
            vec3.set(element.transform.translate, element.transform.translate[1], -element.transform.translate[0], 0);
        });
        pac.transform.rotationAngle -= Math.PI/2;
        
    }

    if(event.key == "]")
    {


        scene.getPrimitives().forEach(element => {
            // element.transform.rotatecw();
            vec3.set(element.transform.translate, -element.transform.translate[1], element.transform.translate[0], 0);
        });

        pac.transform.rotationAngle += Math.PI/2;
    }

    if(event.key == "c")
    {

        scene = new Scene();
        for(var i = 0; i < map.length; i += 1) {
            for(var j = 0; j < map[0].length; j += 1) {
                map[i][j] = 0;
            }
        }
        layout_in = (layout_in + 1) % 3;
        layout = layout_arr[layout_in];
        rendergrid();
        pac = new Pacman(
            pacman_pos[layout_in][0],
            pacman_pos[layout_in][1],
            0.05,
            [255 / 255, 255 / 255, 0 / 255, 1]
            );
        scene.add(pac);
        
    }

    //console.log(pac.transform.translate)


})


document.addEventListener("click", (event) => {

    if(mode == 1) return;

    var x = event.clientX;
    var y = event.clientY;

    
    var i = Math.floor((y)/cell);
    var j = Math.floor((x)/cell);

    if(i > 10 || j > 10) return





    if(layout[i][j] == 0)   return;
    pac.transform.translate[0] = (j*cell + 25 - ((scrn/2)))/(scrn/2);
    pac.transform.translate[1] = ((scrn/2) - i*cell - 25)/(scrn/2);

    pac.transform.scale[0] = 1;
    pac.transform.scale[1] = 1;

    

});

const ghost_colors = [[1, 0, 0 , 1], [0, 1, 1, 1], [1, 0.753, 0.796, 1], [255 / 255, 165 / 255, 0 / 255, 1]]
var cnt = 0;

function rendergrid() {
    for(var i = 0; i < layout.length; i += 1){
        for(var j = 0; j < layout[0].length; j += 1) {
            var color = [255 / 255, 165 / 255, 0 / 255, 1];
            if(layout[i][j] == 1 || layout[i][j] == 2)
            {
                var rad = 0.015;
                if(layout[i][j] == 2) rad = 0.03;
                map[i][j] = scene.getPrimitives().length;
                scene.add(new Circle(
                    (j*cell + 25 - ((scrn/2)))/(scrn/2),
                    ((scrn/2) - i*cell - 25)/(scrn/2),
                    rad,
                    color
                    ));
            }
            else if(layout[i][j] == 4) {

                //console.log(i, j);
                color = ghost_colors[cnt];
                scene.add(new Triangle(
                    (j * cell - (scrn/2) + 25) /(scrn/2),
                    ((scrn/2) - i * cell - 25)/(scrn/2),
                    color
                ));

                cnt = (cnt + 1)%4;
            }
            else
            {
                scene.add(new Quadrilateral(
                    [(j*cell - (scrn/2))/(scrn/2), ((scrn/2)-i*cell)/(scrn/2)],
                    [((j+1)*cell - (scrn/2))/(scrn/2), ((scrn/2) - i*cell)/(scrn/2)],
                    [((j+1)*cell-(scrn/2))/(scrn/2), ((scrn/2) - (i+1)*cell)/(scrn/2)],
                    [(j*cell - (scrn/2))/(scrn/2), ((scrn/2)- (i+1)*cell)/(scrn/2)],
                    [255 / 255, 0 / 255, 0 / 255, 0.75]
                ))
            }
        }
    }
}

rendergrid();
scene.add(pac);



renderer.setAnimationLoop(animation);


//Draw loop
function animation() 
{
    if(fx && pac.transform.scale[0] < 1.5) {
        pac.transform.scale[0] += 0.001;
        pac.transform.scale[1] += 0.001;
        pac.transform.updateModelTransformMatrix();
    }
    else fx = false;
    
	renderer.clear(0, 0, 0, 1);
	renderer.render(scene, shader);
}
