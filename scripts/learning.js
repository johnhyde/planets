
var renderer	= new THREE.WebGLRenderer({
    antialias	: true
});
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

renderer.shadowMapEnabled	= true;
renderer.shadowMapType 		= THREE.PCFSoftShadowMap;

var onRenderFcts= [];
var scene	= new THREE.Scene();
var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 5000);

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
var ambient	= new THREE.AmbientLight( 0x444444 );
scene.add( ambient );

var spotLight	= new THREE.SpotLight( 0xFFAA88 );
spotLight.target.position.set( 0, 2, 0 );
spotLight.shadowCameraNear	= 0.01;		
spotLight.castShadow		= true;
spotLight.shadowDarkness	= 0.5;
spotLight.shadowCameraVisible	= true;
// console.dir(spotLight)
// spotLight.shadowMapWidth	= 1024;
// spotLight.shadowMapHeight	= 1024;
scene.add( spotLight );	

onRenderFcts.push(function(){
    var angle	= Date.now()/1000 * Math.PI;
// angle	= Math.PI*2
    spotLight.position.x	= Math.cos(angle*-0.1)*200;
    spotLight.position.y	= 100 + Math.sin(angle*0.5)*200;
    spotLight.position.z	= Math.sin(angle*-0.1)*200;		
})
//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

var geometry	= new THREE.DodecahedronGeometry(5, 5);
var material	= new THREE.MeshPhongMaterial({
    ambient		: 0x444444,
    color		: 0x8844AA,
    shininess	: 300, 
    specular	: 0x33AA33,
    shading		: THREE.SmoothShading
});
var torusKnot	= new THREE.Mesh( geometry, material );
torusKnot.position.y		= 4;
scene.add( torusKnot );

onRenderFcts.push(function(){
    var angle	= Date.now()/1000 * Math.PI;
// angle	= Math.PI*2
    torusKnot.position.x	= Math.cos(angle)*50;
    torusKnot.position.z	= Math.sin(angle*-0.7)*50;	
    torusKnot.position.y    = 15 + Math.cos(angle*.5)*10
})


torusKnot.castShadow    = true;
torusKnot.receiveShadow	= true;


var particleCount = 10000,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.ParticleBasicMaterial({
      size: 5,
      map: THREE.ImageUtils.loadTexture(
        "images/particle.png"
      ),
      blending: THREE.AdditiveBlending,
      transparent: false
    });

var prevPoint = 0;
// now create the individual particles
for (var p = 0; p < particleCount; p++) {

    // create a particle with random
    // position values, -250 -> 250
    var pX = 5*(p%100) - 250,
      pY = 5*Math.floor(p/100) - 250,
      pZ = prevPoint + 10*Math.random()-5,
      particle = new THREE.Vector3(pX, pY, pZ);
    particle.velocity = new THREE.Vector3(0, -10*Math.random(), 0);

    prevPoint = pZ;
    
    // add it to the geometry
    particles.vertices.push(particle);
}

// create the particle system
var particleSystem = new THREE.ParticleSystem(
    particles,
    pMaterial);

// add it to the scene
scene.add(particleSystem);

//////////////////////////////////////////////////////////////////////////////////
//		Ground
//////////////////////////////////////////////////////////////////////////////////

var geometry	= new THREE.CubeGeometry( 50, 5, 50);
var material	= new THREE.MeshPhongMaterial({
    ambient		: 0x444444,
    color		: 0x66aa66,
    shininess	: 150, 
    specular	: 0x888888,
    shading		: THREE.SmoothShading
});
var ground		= new THREE.Mesh( geometry, material );
ground.scale.multiplyScalar(3);
ground.position.y		= -10;
scene.add( ground );

ground.castShadow	 = true;
ground.receiveShadow = true;


//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//
//////////////////////////////////////////////////////////////////////////////////
var mouse	= {x : 0, y : 0, scroll : 500}
document.addEventListener('mousemove', function(event){
    mouse.x	= (event.clientX / window.innerWidth ) - 0.5
    mouse.y	= (event.clientY / window.innerHeight) - 0.5
}, false)
document.addEventListener('mousewheel', function(event){
    mouse.scroll += ((typeof event.wheelDelta != "undefined")?(-event.wheelDelta):event.detail)/10;
    
}, false);
onRenderFcts.push(function(delta, now){
    camera.position.x = -mouse.scroll*Math.sin(mouse.x*((2*Math.PI)));
    camera.position.y = mouse.scroll*Math.sin(mouse.y*((Math.PI)));
    
    camera.position.z = mouse.scroll*Math.cos(mouse.x*((2*Math.PI)))*Math.cos(mouse.y*((Math.PI)));

    camera.lookAt( scene.position );
})


//////////////////////////////////////////////////////////////////////////////////
//		render the scene						//
//////////////////////////////////////////////////////////////////////////////////
onRenderFcts.push(function(){
    renderer.render( scene, camera );		
})

//////////////////////////////////////////////////////////////////////////////////
//		loop runner							//
//////////////////////////////////////////////////////////////////////////////////
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );
    // measure time
    lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
    var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec	= nowMsec
    // call each update function
    onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/1000, nowMsec/1000)
    })
})