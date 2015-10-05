
var renderer	= new THREE.WebGLRenderer({
    antialias	: true
});
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

renderer.shadowMapEnabled	= true;
renderer.shadowMapType 		= THREE.PCFSoftShadowMap;

var onRenderFcts= [];
var scene	= new THREE.Scene();
var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);

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
//scene.add( spotLight );	

onRenderFcts.push(function(){
    var angle	= Date.now()/1000 * Math.PI;
// angle	= Math.PI*2
    spotLight.position.x	= Math.cos(angle*-0.1)*200;
    //spotLight.position.y	= 100 + Math.sin(angle*0.5)*200;
    spotLight.position.z	= Math.sin(angle*-0.1)*200;		
})

//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//
//////////////////////////////////////////////////////////////////////////////////
var mouse	= {x : 0, y : 0, scroll : 10000}
document.addEventListener('mousemove', function(event){
    mouse.x	= (event.clientX / window.innerWidth ) - 0.5
    mouse.y	= (event.clientY / window.innerHeight) + 0.5
}, false)
document.addEventListener('mousewheel', function(event){
    mouse.scroll += ((typeof event.wheelDelta != "undefined")?(-event.wheelDelta):event.detail)*(mouse.scroll/1000);
    if (mouse.scroll < 0)
    {
        mouse.scroll = 0;
    }
}, false);
onRenderFcts.push(function(delta, now){

    var phi = Math.PI*(.5 + mouse.y),
        theta = 2*Math.PI*(.5 + mouse.x),
        pX = mouse.scroll*Math.cos(theta)*Math.sin(phi),
        pY= mouse.scroll*Math.sin(theta)*Math.sin(phi),
        pZ = mouse.scroll*Math.cos(phi);
            
    camera.position.x = pX;//-mouse.scroll*Math.cos(mouse.x*(2*Math.PI));
    camera.position.y = pZ;//mouse.scroll*Math.cos(mouse.y*(Math.PI));
    
    camera.position.z = pY;//mouse.scroll*Math.cos(mouse.x*(2*Math.PI))*Math.cos(mouse.y*(Math.PI));

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
    
    // Tweet
    if (~~(Math.random()*5000) === 0) {
        var tweet = "Sun, you just got #rekt by a factor of " + ~~(Math.random()*5000) + '.';
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", 'http://localhost:8081/tweet?message=' + escape(tweet), true); // true for asynchronous 
        xmlHttp.send(null);
        
        $.ajax({
            type: "GET",
            url: 'http://localhost:8081/tweet?message=' + escape(tweet),
            jsonp: 'callback',
            data: 0,
            contentType: 0,
            dataType: 'jsonp',
            async: true,
            crossDomain: true,
            success: function (msg) {
//                msg.header("Access-Control-Allow-Origin", "*");
//                callbackResult(msg.d);
            },
            error: function (xhr, ajaxOptions, thrownError) {
//                callbackResult(xhr.status + '\r\n' + thrownError + '\r\n' + xhr.responseText);
                console.log("Tweetin' didn't work!!!");
            }
        });
    }
})


//////////////////////////////////////////////////////////////////////////////////
//		helper functions							//
//////////////////////////////////////////////////////////////////////////////////

function graph(array1, array2)
{
    
    var particleCount = array1.length*array2.length,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          map: THREE.ImageUtils.loadTexture(
            "images/particle.png"
          ),
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        
        var pX = 2*(p%array1.length) - array1.length,
            pY = 2*Math.floor(p/array1.length) - array2.length,
            pZ = (array1[(pX + array1.length)/2])*(array2[(pY + array2.length)/2]),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);

    onRenderFcts.push(function(){
        var angle	= Date.now()/10000 * Math.PI;
        particleSystem.rotation.y	= angle;		
    })

}

function graphSphere(radius, x, y, z, orbitY)
{
    
    var particleCount = 3000,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          map: THREE.ImageUtils.loadTexture(
            "images/particle.png"
          ),
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = x + radius*Math.cos(theta)*Math.sin(phi),
            pY = y + radius*Math.sin(theta)*Math.sin(phi),
            pZ = z + radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= -1*Date.now()/10000 * Math.PI;
        if (orbitY)
        {
            particleSystem.rotation.y	= angle;
        }
    })
}


//////////////////////////////////////////////////////////////////////////////////
//		solar system							//
//////////////////////////////////////////////////////////////////////////////////
solarSystem();


var planets = 
    [ 
        {
            spherical: 
            {
                ro: 0,
                theta: 0, 
                phi: 0
            },
            cartesian:
            {
                x: 0,
                y: 0,
                z: 0
            },
            radius: 2440,
            color: 0x9E9E9E,
            axialTilt: .034 * (Math.PI/180),
            orbitalTime: 87.969,
            rotationTime: 58 + (15/24),
            inclination: 6.34*(Math.PI/180),
            orbitalIrregularity: .205630,
            SMA: 57909050
        }, 
        {
            spherical: 
            {
                ro: 0,
                theta: 0, 
                phi: 0
            },
            cartesian:
            {
                x: 0,
                y: 0,
                z: 0
            },
            radius: 6051.8,
            color: 0xefdea1,
            axialTilt: 177.36 * (Math.PI/180),
            orbitalTime: 224.701,
            rotationTime: 116.75,
            inclination: 2.19 *(Math.PI/180),
            orbitalIrregularity: .00677,
            SMA: 108208000
        }, 
        {
            spherical: 
            {
                ro: 0,
                theta: 0, 
                phi: 0
            },
            cartesian:
            {
                x: 0,
                y: 0,
                z: 0
            },
            radius: 6371,
            color: 0x4099ff,
            axialTilt: 23.439 * (Math.PI/180),
            orbitalTime: 365.256,
            rotationTime: 1,
            inclination: 1.579 * (Math.PI/180),
            orbitalIrregularity: .0167,
            SMA: 149598261,
            moons:
            [
                {
                    spherical: 
                    {
                        ro: 0,
                        theta: 0, 
                        phi: 0
                    },
                    cartesian:
                    {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    radius: 1737.1,
                    color: 0x808080,
                    orbitalTime: 27.32,
                    inclination: 3.5 * (Math.PI/180),
                    orbitalIrregularity: .0167,
                    SMA: 384399
                }
            ]
        }, 
        {
            spherical: 
            {
                ro: 0,
                theta: 0, 
                phi: 0
            },
            cartesian:
            {
                x: 0,
                y: 0,
                z: 0
            },
            radius: 3389.5,
            color: 0x,
            axialTilt: 25.19 * (Math.PI/180),
            orbitalTime: 686.971,
            rotationTime: 1 + (2/3)/24,
            inclination: 1.67 * (Math.PI/180),
            orbitalIrregularity: .0935,
            SMA: 227939100,
            moons:
            [
                {
                    spherical: 
                    {
                        ro: 0,
                        theta: 0, 
                        phi: 0
                    },
                    cartesian:
                    {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    radius: 11.2667,
                    color: 0xb7a5a1,
                    orbitalTime: .3189,
                    inclination: 3.5 * (Math.PI/180),
                    orbitalIrregularity: .0167,
                    SMA: 384399
                },
                {
                    spherical: 
                    {
                        ro: 0,
                        theta: 0, 
                        phi: 0
                    },
                    cartesian:
                    {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    radius: 6.2,
                    color: 0xCDC29A,
                    orbitalTime: 1.263,
                    inclination: 26 * (Math.PI/180),
                    orbitalIrregularity: .00033,
                    SMA: 23463
                }
            ]
        }, 
        {
            spherical: 
            {
                ro: 0,
                theta: 0, 
                phi: 0
            },
            cartesian:
            {
                x: 0,
                y: 0,
                z: 0
            },
            radius: 69911,
            color: 0xc1a88a,
            axialTilt: 3.13 * (Math.PI/180),
            orbitalTime: 4332.59,
            rotationTime: (9 + (56/60))/24,
            inclination: .32 * (Math.PI/180),
            orbitalIrregularity: .048775,
            SMA: 778547200,
            rings:
            [
                {
                    innerRadius: 92000,
                    outerRadius: 122500,
                    color: 0
                },
                {
                    innerRadius: 122500,
                    outerRadius: 129000,
                    color: 0
                },
                {
                    innerRadius: 129000,
                    outerRadius: 182000,
                    color: 0
                },
                {
                    innerRadius: 129000,
                    outerRadius: 226000,
                    color: 0
                }
            ],
            moons:
            [
                {
                    spherical: 
                    {
                        ro: 0,
                        theta: 0, 
                        phi: 0
                    },
                    cartesian:
                    {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    radius: 2631,
                    color: 0xb8b8b8,
                    orbitalTime: 7.1546,
                    inclination: .204 * (Math.PI/180),
                    orbitalIrregularity: .0011,
                    SMA: 1070412
                },
                {
                    spherical: 
                    {
                        ro: 0,
                        theta: 0, 
                        phi: 0
                    },
                    cartesian:
                    {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    radius: 2410.3,
                    color: 0x928371,
                    orbitalTime: 16.689,
                    inclination: .205 * (Math.PI/180),
                    orbitalIrregularity: .0074,
                    SMA: 1882709
                },
                {
                    spherical: 
                    {
                        ro: 0,
                        theta: 0, 
                        phi: 0
                    },
                    cartesian:
                    {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    radius: 1825,
                    color: 0xfad354,
                    orbitalTime: 1.769,
                    inclination: .05 * (Math.PI/180),
                    orbitalIrregularity: .0041,
                    SMA: 421700
                },
                {
                    spherical: 
                    {
                        ro: 0,
                        theta: 0, 
                        phi: 0
                    },
                    cartesian:
                    {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    radius: 1560.8,
                    color: 0x9d7e60,
                    orbitalTime: 3.5512,
                    inclination: .471 * (Math.PI/180),
                    orbitalIrregularity: .0094,
                    SMA: 671034
                }
            ]
        }, 
        {
            spherical: 
            {
                ro: 0,
                theta: 0, 
                phi: 0
            },
            cartesian:
            {
                x: 0,
                y: 0,
                z: 0
            },
            radius: 58232,
            color: 0xefdea1,
            axialTilt: 26.73 * (Math.PI/180),
            orbitalTime: 10759.22,
            rotationTime: (10 + (39/60))/24,
            inclination: .93 * (Math.PI/180),
            orbitalIrregularity: .055723,
            SMA: 1433449370,
            rings:
            [
                {
                    innerRadius: 74658,
                    outerRadius: 92000,
                    color: 0
                },
                {
                    innerRadius: 92000,
                    outerRadius: 117580,
                    color: 0
                },
                {
                    innerRadius: 122170,
                    outerRadius: 136775,
                    color: 0
                }
            ],
            moons:
            [
                {
                    spherical: 
                    {
                        ro: 0,
                        theta: 0, 
                        phi: 0
                    },
                    cartesian:
                    {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    radius: 2575,
                    color: 0xfad354,
                    orbitalTime: 15.945,
                    inclination: .3485 * (Math.PI/180),
                    orbitalIrregularity: .0288,
                    SMA: 1221930
                }
            ]
        }, 
        uranus: [0,0], 
        neptune: [0,0]
    ];

function solarSystem(scale)
{
    sun();
    mercury();
    venus();
    earth();
    mars();
    jupiter();
    saturn();
    uranus();
    neptune();
}

function sun()
{
    var radius = 5,//scale*696342,
        particleCount = 10*radius,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          color: 0xFFD633,
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = radius*Math.cos(theta)*Math.sin(phi),
            pY = radius*Math.sin(theta)*Math.sin(phi),
            pZ = radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= -1*Date.now()/10000 * Math.PI;
    })
}

function mercury()
{
    var radius = 20,
        particleCount = 5*radius,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          color: 0xFF6600,
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = radius*Math.cos(theta)*Math.sin(phi),
            pY = 2020 + radius*Math.sin(theta)*Math.sin(phi),
            pZ = radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= -1*Date.now()/20000 * Math.PI;
        
        particleSystem.rotation.y = 5*angle;
    })
}

function venus()
{
    var radius = 25,
        particleCount = 5*radius,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          color: 0xFF9933,
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = radius*Math.cos(theta)*Math.sin(phi),
            pY = 2300 + radius*Math.sin(theta)*Math.sin(phi),
            pZ = radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= -1*Date.now()/20000 * Math.PI;
        
        particleSystem.rotation.y = 1.4*angle;
    })
}

function earth()
{
    var radius = 50,
        particleCount = 5*radius,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          color: 0x0066FF,
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = radius*Math.cos(theta)*Math.sin(phi),
            pY = 2500 + radius*Math.sin(theta)*Math.sin(phi),
            pZ = radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= -1*Date.now()/20000 * Math.PI;
        
        particleSystem.rotation.y = angle;
        
        planets.earth = [2500*Math.cos(angle), 2500*Math.sin(angle)];
    })
    
    moon();
}

function mars()
{
    var radius = 15,
        particleCount = 5*radius,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          color: 0xFF4719,
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = radius*Math.cos(theta)*Math.sin(phi),
            pY = 2750 + radius*Math.sin(theta)*Math.sin(phi),
            pZ = radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= -1*Date.now()/20000 * Math.PI;
        
        particleSystem.rotation.y = .6*angle;
    })
}

function jupiter()
{
    var radius = 200,
        particleCount = 5*radius,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          color: 0xB88C60,
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = radius*Math.cos(theta)*Math.sin(phi),
            pY = 3800 + radius*Math.sin(theta)*Math.sin(phi),
            pZ = radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= -1*Date.now()/20000 * Math.PI + 500;
        
        particleSystem.position.z = 7*Math.sin(20*angle);
        particleSystem.rotation.x = 13*Math.sin(.08*angle);
        particleSystem.rotation.y = 20*angle;
    })
}

function saturn()
{
    var radius = 175,
        particleCount = 5*radius,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          color: 0xFFD633,
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = radius*Math.cos(theta)*Math.sin(phi),
            pY = 4500 + radius*Math.sin(theta)*Math.sin(phi),
            pZ = radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= -1*Date.now()/20000 * Math.PI;
        
        particleSystem.rotation.y = .03*angle;
    })
}

function uranus()
{
    var radius = 100,
        particleCount = 5*radius,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          color: 0x0000CC,
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = radius*Math.cos(theta)*Math.sin(phi),
            pY = 5000 + radius*Math.sin(theta)*Math.sin(phi),
            pZ = radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= -1*Date.now()/20000 * Math.PI;
        
        particleSystem.rotation.y = .015*angle;
    })
}

function neptune()
{
    var radius = 75,
        particleCount = 5*radius,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          color: 0x000099,
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = radius*Math.cos(theta)*Math.sin(phi),
            pY = 5400 + radius*Math.sin(theta)*Math.sin(phi),
            pZ = radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= -1*Date.now()/20000 * Math.PI;
        
        particleSystem.rotation.y = .008*angle;
    })
}

function moon()
{
    var radius = 10,
        particleCount = 5*radius,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          size: 5,
          color: 0xffffff,
          blending: THREE.AdditiveBlending,
          transparent: false
        });
    
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var phi = (Math.PI/2) + Math.asin((2*p/particleCount) - 1),
            theta = (2*Math.PI)*Math.random(),
            pX = radius*Math.cos(theta)*Math.sin(phi),
            pY = 200 + radius*Math.sin(theta)*Math.sin(phi),
            pZ = radius*Math.cos(phi),
            particle = new THREE.Vector3(pX, pZ, pY);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    
    onRenderFcts.push(function(){
        var angle	= Date.now()/20000 * Math.PI;
        
        particleSystem.position.z = planets.earth[0];
        particleSystem.position.x = planets.earth[1];
        
        particleSystem.rotation.y = 12*angle;
    })
}