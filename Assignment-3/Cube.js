//---------------------------------------------------------------------------
//
//  --- Cone.js ---
//
//    A simple, encapsulated Cone object
const DefaultNumSides = 8;

//
//  All of the parameters of this function are optional, although, it's
//    possible that the WebGL context (i.e., the "gl" parameter) may not
//    be global, so passing that is a good idea.
//
//  Further, the vertex- and fragment-shader ids assume that the HTML "id" 
//    attributes for the vertex and fragment shaders are named
//
//      Vertex shader:   "Cone-vertex-shader"
//      Fragment shader: "Cone-fragment-shader"
//
function Cube( gl, numSides, vertexShaderId, fragmentShaderId ) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    const vertShdr = vertexShaderId || "Cube-vertex-shader";
    const fragShdr = fragmentShaderId || "Cube-fragment-shader";

    // Initialize the object's shader program from the provided vertex
    //   and fragment shaders.  We make the shader program private to
    //   the object for simplicity's sake.
    // 
    const shaderProgram = initShaders( gl, vertShdr, fragShdr );

    if ( shaderProgram < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }

    // Determine the number of vertices around the base of the cone
    //
    // const n = numSides || DefaultNumSides; // Number of sides 

    // We'll generate the cone's geometry (vertex positions).  The cone's
    //   base will be a one-unit radius circle in the XY plane, centered 
    //   at the origin.  The cone's apex will be located one unit up the
    //   +Z access.  We'll build our positions using that specification,
    //   and some trigonometry.
    //
    // Initialize temporary arrays for the Cone's indices and vertex positions,
    //   storing the position and index for the base's center
    //
    
    positions = {
        values: new Float32Array([
            -0.5, -0.5, 0.5,  // vertex 0
            0.5, -0.5, 0.5, // vertex 1
            -0.5, 0.5, 0.5, // vertex 2
            0.5, 0.5, 0.5, // vertex 3
            0.5, -0.5, -0.5, // vertex 4
            -0.5, -0.5, -0.5, // vertex 5
            -0.5, 0.5, -0.5, // vertex 6
            0.5, 0.5, -0.5 // vertex 7
        ]),
        numComponents : 3
    };
    indices = [ 
        2, 0, 3, 0, 1, 3, // front  
        7, 4, 6, 4, 5, 6, // back 
        6, 5, 2, 5, 0, 2, // left
        3, 1, 7, 1, 4, 7, // right
        6, 2, 7, 2, 3, 7, // top
        0, 5, 1, 5, 4, 1  // bottom 
    ];

    aPosition = new Attribute(gl, shaderProgram, positions.values,
        "aPosition", 3, gl.FLOAT );

    aColor = new Attribute(gl, shaderProgram, positions.values, 
        "aColor", 3, gl.FLOAT);
    indices = new Indices(gl, indices);

    let MV = new Uniform(gl, shaderProgram, "MV");
    let P = new Uniform(gl, shaderProgram, "P");
        
    // Create a render function that can be called from our main application.
    //   In this case, we're using JavaScript's "closure" feature, which
    //   automatically captures variable values that are necessary for this
    //   routine so we can be less particular about variables scopes.  As 
    //   you can see, our "positions", and "indices" variables went out of
    //   scope when the Cone() constructor exited, but their values were
    //   automatically saved so that calls to render() succeed.
    // 
    this.render = function () {
        // Enable our shader program
        gl.useProgram( shaderProgram );

        // Activate our vertex, enabling the vertex attribute we want data
        //   to be read from, and tell WebGL how to decode that data.
        //
        aPosition.enable();

        // Likewise enable our index buffer so we can use it for rendering
        //
        indices.enable();
      
        MV.update(this.MV);
        P.update(this.P); 

        // Since our list of indices contains equal-sized sets of
        //    indices values that we'll use to specify how many
        //    vertices to render, we divide the length of the 
        //    indices buffer by two, and use that as the "count"
        //    parameter for each of our draw calls.
        let count = indices.count / 2;

        // Draw the cone's base.  Since our index buffer contains two
        //   "sets" of indices: one for the top, and one for the base,
        //   we divide the number of indices by two to render each
        //   part separately
        //
        gl.drawElements( gl.TRIANGLES, count, indices.type, 0 );

        // Draw the cone's top.  In this case, we need to let WebGL know
        //   where in the index list we want it to start reading index
        //   values.  The offset value is in bytes, computed using the
        //   "count" value we computed when making the list, and knowing
        //   the size in bytes of an unsigned short type.
        //
        var offset = count;
        gl.drawElements( gl.TRIANGLES, count, indices.type, offset );

        // Finally, reset our rendering state so that other objects we
        //   render don't try to use the Cone's data
        //
        aPosition.disable();
        aColor.disable();
        indices.disable();
    }
};
