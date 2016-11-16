var light = new THREE.Color( 0xffffff )
var shadow  = new THREE.Color( 0x303050 )
var fogVar = new THREE.Fog(0xd0e0f0,1,500);

var scene = new THREE.Scene();
scene.fog = fogVar;
scene.background = new THREE.Color(0xd0e0f0);
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var ambLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambLight );

var dirLight = new THREE.DirectionalLight( 0xffffff, 0.5);
dirLight.position.set(0,10,10);
scene.add(dirLight);

var dirLight2 = new THREE.DirectionalLight( 0xaaaaaa, 0.5);
dirLight2.position.set(0,-10,-10);
scene.add(dirLight2);


//create a new base of the building...
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,0.5,0));
var texture = new THREE.Texture( generateTextureCanvas() );
texture.anisotropy = renderer.getMaxAnisotropy();
texture.needsUpdate = true;
var material = new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors, map: texture});
var cube = new THREE.Mesh( geometry, material);
cube.scale.x = Math.random()*Math.random()*Math.random()*Math.random() * 50 +10;
cube.scale.z = cube.scale.x;
cube.scale.y  = (Math.random() * Math.random() * Math.random() * cube.scale.x) * 8 + 8;
//add some color
var value = 1 - Math.random() * Math.random();
var baseColor = new THREE.Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 );
// set topColor/bottom vertexColors as adjustement of baseColor
var topColor  = baseColor.clone().multiply( light );
var bottomColor = baseColor.clone().multiply( shadow );
// set .vertexColors for each face
var geometry  = cube.geometry;
for ( var j = 0, jl = geometry.faces.length; j < jl; j ++ ) {
    if ( j & 1 ) {
        //odd faces
        //geometry.faces[ j ].vertexColors = [bottomColor, bottomColor, topColor ];
        geometry.faces[j].vertexColors = [baseColor, baseColor, baseColor];
    }
    else {
        //even faces
        //geometry.faces[ j ].vertexColors = [topColor , bottomColor, topColor ];
        geometry.faces[j].vertexColors = [baseColor, baseColor, baseColor];
    }
    if( j == 4 || j == 5) { //top
        //geometry.faces[j].vertexColors = [topColor, topColor, topColor];
        geometry.faces[j].vertexColors = [baseColor,baseColor,baseColor];
        geometry.faceVertexUvs[0][j][0].set(0,0);
        geometry.faceVertexUvs[0][j][1].set(0,0);
        geometry.faceVertexUvs[0][j][2].set(0,0);
    }
}

var cMat = new THREE.MeshLambertMaterial({color:baseColor});
var geometry = new THREE.CylinderGeometry(THREE.Math.randFloat(.5,1.5),THREE.Math.randFloat(.5,1.5),1,THREE.Math.randInt(3,12));
geometry.applyMatrix( new THREE.Matrix4().makeTranslation(THREE.Math.randFloat(0,1),0.5,THREE.Math.randFloat(0,1)));
var cyl = new THREE.Mesh(geometry, cMat);
cyl.scale.x = Math.random()*Math.random()*Math.random()*Math.random() * 10 + 10;
cyl.scale.z = cyl.scale.x;
cyl.scale.y  = (Math.random() * Math.random() * Math.random() * cyl.scale.x) * 8 + 8;


//do some ground
var geometry = new THREE.PlaneGeometry( 1, 1, 1,1 );
var material = new THREE.MeshLambertMaterial( {color: bottomColor, side: THREE.FrontSide} );
var plane = new THREE.Mesh( geometry, material );
plane.rotation.x = THREE.Math.degToRad(-90);
plane.scale.x = 100;
plane.scale.y = 100;

scene.add( plane );
scene.add( cube );
scene.add( cyl );

camera.position.z = 50;
camera.position.y = 20;

//orbit controls
controls = new THREE.OrbitControls( camera, renderer.domElement );
//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
//controls.autoRotate = true;

var render = function () {
    requestAnimationFrame( render );
    controls.update();
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};

render();

function generateTextureCanvas(){
		// build a small canvas 32x64 and paint it in white
		var canvas	= document.createElement( 'canvas' );
		canvas.width	= 32;
		canvas.height	= 64;
		var context	= canvas.getContext( '2d' );
		// plain it in white
		context.fillStyle	= '#ffffff';
		context.fillRect( 0, 0, 32, 64 );
		// draw the window rows - with a small noise to simulate light variations in each room
		for( var y = 2; y < 64; y += 2 ){
			for( var x = 0; x < 32; x += 2 ){
				var value	= Math.floor( Math.random() * 64 );
				context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
				context.fillRect( x, y, 2, 1 );
			}
		}

		// build a bigger canvas and copy the small one in it
		// This is a trick to upscale the texture without filtering
		var canvas2	= document.createElement( 'canvas' );
		canvas2.width	= 512;
		canvas2.height	= 1024;
		var context	= canvas2.getContext( '2d' );
		// disable smoothing
		context.imageSmoothingEnabled		= false;
		context.webkitImageSmoothingEnabled	= false;
		context.mozImageSmoothingEnabled	= false;
		// then draw the image
		context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
		// return the just built canvas2
		return canvas2;
}