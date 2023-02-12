const init = () => {
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    
    // clear your canvas (r,g,b,alpha) range: 0.0-1.0
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // create a cone with 20 sides
    cone = new Cone(gl, 100);
    render();

    // specify that the init() function should be called 
    // when the page is completely loaded
    window.onload = init;
}

const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    cone.render();
}

window.onload = init;