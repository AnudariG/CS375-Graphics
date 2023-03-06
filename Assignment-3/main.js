const init = () => {
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);

    const vertexShader = initShaders(
        gl, "Cube-vertex-shader", "Cube-fragment-shader");
    gl.useProgram(vertexShader);

    // create a cube
    cube = new Cube(gl);

    const aspect = canvas.width / canvas.height;
    const fov = 60;
    const zNear = 2;
    const zFar = 8;
    P = perspective(fov, aspect, zNear, zFar);

    // set up model-view matrix
    const eye = vec3(0.0, 0.0, 3.0);
    const at = vec3(0.0, 0.0, 0.0);
    const up = vec3(0.0, 1.0, 0.0);
    MV = lookAt(eye, at, up);

    render();

    // specify that the init() function should be called 
    // when the page is completely loaded
    window.onload = init;
}

let time = 0;

const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    time += 1

    cube.P = P;
    cube.MV = mult(MV, mult(rotateX(time), rotateY(time)));
    
    cube.render();
    requestAnimationFrame(render);
}

window.onload = init;