var renderer	= new THREE.WebGLRenderer({
    antialias	: true
});
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.domElement.id = "canvas";
document.body.appendChild( renderer.domElement );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

var onRenderFcts= [];
var scene	= new THREE.Scene();
var cameras	= [new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)];

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

var spotLight = new THREE.PointLight(0xFFAA88, 10, 10000000, 15);
scene.add( spotLight );	

var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

onRenderFcts.push(function(){
    var angle	= Date.now()/1000 * Math.PI;
    
})

//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//
//////////////////////////////////////////////////////////////////////////////////
var focus = {planet: 0, moon: 0},
    mouse	= {x : 0, y : 0, scroll : 0},
    listenerDiv = document.getElementById('cheats');

if (listenerDiv === null)
{
    listenerDiv = document;
}

 document.addEventListener('keydown', function(event){
    if (event.keyCode === 68 || event.keyCode === 39)
    {
        focus.planet++;
        focus.moon = 0;
        if (focus.planet === planets.length)
        {
            focus.planet = 0;
        }
        scroll();
    }
    if (event.keyCode === 65 || event.keyCode === 37)
    {
        focus.planet--;
        focus.moon = 0;
        if (focus.planet === -1)
        {
            focus.planet = planets.length - 1;
        }
        scroll();
    }
    /*if (event.keyCode === 87 || event.keyCode === 38)
    {
        focus.moon++;
        if (focus.moon === planets[focus.planet].moons.length + 1)
        {
            focus.moon = 0;
        }
        scroll();
    }
    if (event.keyCode === 83 || event.keyCode === 40)
    {
        focus.moon--;
        if (focus.moon === -1)
        {
            focus.moon = planets[focus.planet].moons.length;
        }
        scroll();
    }*/
    
}, false);

listenerDiv.addEventListener('mousemove', function(event){
    mouse.x	= (event.clientX / window.innerWidth ) - 0.5;
    mouse.y	= (event.clientY / window.innerHeight) - .5 + Math.PI;
}, false);

listenerDiv.addEventListener('mousewheel', function(event){
    mouse.scroll += ((typeof event.wheelDelta != "undefined")?(-event.wheelDelta):event.detail)*(mouse.scroll/7000);
    
    if (focus.moon === 0)
    {
        if (mouse.scroll < planets[focus.planet].radius * 6)
        {
            mouse.scroll = planets[focus.planet].radius * 6;
        }
        else if (mouse.scroll > planets[focus.planet].radius * 50)
        {
            mouse.scroll = planets[focus.planet].radius * 50;
        }
    }
    /*else if (focus.moon !== 0)
    {
        if (mouse.scroll < 3)
        {
            mouse.scroll = 3;
        }
        else if (mouse.scroll > 20)
        {
            mouse.scroll = 20;
        }
    }*/
}, false);

onRenderFcts.push(function(delta, now){
    
    var cameraAngle = Math.PI / 2,
        phi = Math.PI/2 + mouse.y,
        theta = (Math.PI * 2  * mouse.x);
    
    if (focus.moon === 0)
    {
        theta += cameraAngle + planets[focus.planet].spherical.theta;
        
        cameras[0].position.x = planets[focus.planet].cartesian.x + mouse.scroll*Math.cos(theta)*Math.sin(phi);
        cameras[0].position.z = planets[focus.planet].cartesian.y + mouse.scroll*Math.sin(theta)*Math.sin(phi);
        cameras[0].position.y = planets[focus.planet].cartesian.z + mouse.scroll*Math.cos(phi);

        cameras[0].lookAt( new THREE.Vector3(planets[focus.planet].cartesian.x, planets[focus.planet].cartesian.z, planets[focus.planet].cartesian.y) );
    }
    else
    {   
        theta += cameraAngle + Math.atan2(planets[focus.planet].moons[focus.moon - 1].cartesian.y, planets[focus.planet].moons[focus.moon - 1].cartesian.x);
        
        cameras[0].position.x = planets[focus.planet].moons[focus.moon - 1].cartesian.x + mouse.scroll*Math.cos(theta)*Math.sin(phi);
        cameras[0].position.z = planets[focus.planet].moons[focus.moon - 1].cartesian.y + mouse.scroll*Math.sin(theta)*Math.sin(phi);
        cameras[0].position.y = planets[focus.planet].moons[focus.moon - 1].cartesian.z + mouse.scroll*Math.cos(phi);

        cameras[0].lookAt( new THREE.Vector3(planets[focus.planet].moons[focus.moon - 1].cartesian.x, planets[focus.planet].moons[focus.moon - 1].cartesian.z, planets[focus.planet].moons[focus.moon - 1].cartesian.y) );
    }
})

//////////////////////////////////////////////////////////////////////////////////
//		render the scene						//
//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//		loop runner							//
//////////////////////////////////////////////////////////////////////////////////
var lastTimeMsec= null,
    info = null;
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
    
    renderer.render(scene, cameras[0]);
    // Tweet
//    if (~~(Math.random()*5000) === 0) {
//        var tweet = "Sun, you just got #rekt by a factor of " + ~~(Math.random()*5000) + '.';
//        var xmlHttp = new XMLHttpRequest();
//        xmlHttp.onreadystatechange = function() { 
//            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//                callback(xmlHttp.responseText);
//        }
//        xmlHttp.open("GET", 'http://localhost:8081/tweet?message=' + escape(tweet), true); // true for asynchronous 
//        xmlHttp.send(null);
        
//        $.ajax({
//            type: "GET",
//            url: 'http://localhost:8081/tweet?message=' + escape(tweet),
//            jsonp: 'callback',
//            data: 0,
//            contentType: 0,
//            dataType: 'jsonp',
//            async: true,
//            crossDomain: true,
//            success: function (msg) {
////                msg.header("Access-Control-Allow-Origin", "*");
////                callbackResult(msg.d);
//            },
//            error: function (xhr, ajaxOptions, thrownError) {
////                callbackResult(xhr.status + '\r\n' + thrownError + '\r\n' + xhr.responseText);
//                console.log("Tweetin' didn't work!!!");
//            }
//        });
//    }
})


//////////////////////////////////////////////////////////////////////////////////
//		helper functions							//
//////////////////////////////////////////////////////////////////////////////////

function scroll()
{
    if (focus.moon === 0)
    {
        mouse.scroll = planets[focus.planet].radius * 10;
    }
    else
    {
        mouse.scroll = planets[focus.planet].moons[focus.moon].radius * 10;
    }
}

//////////////////////////////////////////////////////////////////////////////////
//		solar system							//
//////////////////////////////////////////////////////////////////////////////////
 planets = 
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
            radius: 696300,
            axialTilt: 0,
            orbitalTime: 100000,
            rotationTime: 100000,
            inclination: 0,
            orbitalIrregularity: 0,
            SMA: 0,
            texture: 'sunmap.jpg',
            bump: 'sunmap.jpg',
            specular: 'genericSpecularMap.jpg',
            color: 0xffffff,
            moons: [],
            rings: []
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
            radius: 2440,
            color: 0x9E9E9E,
            axialTilt: .034 * (Math.PI/180),
            orbitalTime: 87.969,
            rotationTime: 58 + (15/24),
            inclination: 6.34*(Math.PI/180),
            orbitalIrregularity: .205630,
            SMA: 57909050,
            texture: 'mercurymap.jpg',
            bump: 'mercurybump.jpg',
            specular: 'genericSpecularMap.jpg',
            color: 0x202020,
            moons: [],
            rings: []
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
            SMA: 108208000,
            texture: 'venusmap.jpg',
            bump: 'venusbump.jpg',
            specular: 'genericSpecularMap.jpg',
            color: 0x202020,
            moons: [],
            rings: []
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
            texture: 'earthmap1k.jpg',
            bump: 'earthbump1k.jpg',
            specular: 'earthspec1k.jpg',
            color: 0x202020,
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
                    orbitalTime: 27.32,
                    inclination: 3.5 * (Math.PI/180),
                    orbitalIrregularity: .0167,
                    SMA: 384399,
                    specular: 'genericSpecularMap.jpg',
                    color: 0x202020,
                    system: 0
                }
            ],
            rings: []
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
            axialTilt: 25.19 * (Math.PI/180),
            orbitalTime: 686.971,
            rotationTime: 1 + (2/3)/24,
            inclination: 1.67 * (Math.PI/180),
            orbitalIrregularity: .0935,
            SMA: 227939100,
            texture: 'mars_1k_color.jpg',
            bump: 'mars_1k_topo.jpg',
            specular: 'genericSpecularMap.jpg',
            color: 0x202020,
            moons: [],
            rings: []
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
            texture: 'jupitermap.jpg',
            bump: 'plutobump2k.jpg',
            specular: 'genericSpecularMap.jpg',
            color: 0x202020,
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
                    specular: 'genericSpecularMap.jpg',
                    color: 0x202020,
                    orbitalTime: 7.1546,
                    inclination: .204 * (Math.PI/180),
                    orbitalIrregularity: .0011,
                    SMA: 1070412,
                    system: 0
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
                    specular: 'genericSpecularMap.jpg',
                    color: 0x202020,
                    orbitalTime: 16.689,
                    inclination: .205 * (Math.PI/180),
                    orbitalIrregularity: .0074,
                    SMA: 1882709,
                    system: 0
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
                    specular: 'genericSpecularMap.jpg',
                    color: 0x202020,
                    orbitalTime: 1.769,
                    inclination: .05 * (Math.PI/180),
                    orbitalIrregularity: .0041,
                    SMA: 421700,
                    system: 0
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
                    specular: 'genericSpecularMap.jpg',
                    color: 0x202020,
                    orbitalTime: 3.5512,
                    inclination: .471 * (Math.PI/180),
                    orbitalIrregularity: .0094,
                    SMA: 671034,
                    system: 0
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
            texture: 'saturnmap.jpg',
            bump: 'plutobump2k.jpg',
            specular: 'genericSpecularMap.jpg',
            color: 0x202020,
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
                    specular: 'genericSpecularMap.jpg',
                    color: 0x202020,
                    orbitalTime: 15.945,
                    inclination: .3485 * (Math.PI/180),
                    orbitalIrregularity: .0288,
                    SMA: 1221930,
                    system: 0
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
            radius: 25362,
            color: 0x9ACBEC,
            axialTilt: 97.77 * (Math.PI/180),
            orbitalTime: 30687.15,
            rotationTime: (17 + (14/60))/24,
            inclination: 1.02 * (Math.PI/180),
            orbitalIrregularity: .04722,
            SMA: 2870671400,
            texture: 'uranusmap.jpg',
            bump: 'plutobump2k.jpg',
            specular: 'genericSpecularMap.jpg',
            color: 0x202020,
            rings:
            [
                {
                    innerRadius: 0,
                    outerRadius: 0,
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
                    radius: 788.4,
                    specular: 'genericSpecularMap.jpg',
                    color: 0x202020,
                    orbitalTime: 8.705,
                    inclination: .340 * (Math.PI/180),
                    orbitalIrregularity: .0011,
                    SMA: 435910,
                    system: 0
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
                    radius: 761.4,
                    specular: 'genericSpecularMap.jpg',
                    color: 0x202020,
                    orbitalTime: 13.463,
                    inclination: .058 * (Math.PI/180),
                    orbitalIrregularity: .0014,
                    SMA: 583520,
                    system: 0
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
            radius: 24622,
            axialTilt: 28.32 * (Math.PI/180),
            orbitalTime: 60190,
            rotationTime: (16 + (6/60))/24,
            inclination: .72 * (Math.PI/180),
            orbitalIrregularity: .00868,
            SMA: 4498542600,
            texture: 'neptunemap.jpg',
            bump: 'plutobump2k.jpg',
            specular: 'genericSpecularMap.jpg',
            color: 0x202020,
            rings:
            [
                {
                    innerRadius: 0,
                    outerRadius: 0,
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
                    radius: 1352.6,
                    specular: 'genericSpecularMap.jpg',
                    color: 0x202020,
                    orbitalTime: 5.877,
                    inclination: 23.135 * (Math.PI/180),
                    orbitalIrregularity: 0,
                    SMA: 354759,
                    system: 0
                }
            ]
        }
    ];

solarSystem(planets, .0001);

function solarSystem(planets, scale)
{
    for (var i = 0; i < planets.length; i++)
    {
        planet(planets[i], scale, i === 0);
    }
    spotLight.distance = planets[planets.length - 1].SMA * 40;
    mouse.scroll = planets[focus.planet].radius * 10;
}

function planet(planet, scale)
{
    planet.radius = planet.radius * scale;
    planet.SMA = planet.SMA * scale / 50;
    
    var particles = new THREE.DodecahedronGeometry(planet.radius, 3),
        pMaterial = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('images/planets/' + planet.texture),
            shading: THREE.SmoothShading,
            bumpMap: THREE.ImageUtils.loadTexture('images/planets/' + planet.bump),
            bumpScale: scale * 50,
            specularMap: THREE.ImageUtils.loadTexture('images/planets/' + planet.specular),
            color: planet.color
        });

    // create the particle system
    var particleSystem = new THREE.Mesh(
        particles,
        pMaterial);
    
    // add it to the scene
    //particleSystem.castShadow = true;
    //particleSystem.receiveShadow = true;
    scene.add(particleSystem);

    for (var j = 0; j < planet.moons.length; j++)
    {
        planet.moons[j].radius = planet.moons[j].radius * scale;
        planet.moons[j].SMA = planet.moons[j].SMA * scale;

        var moonParticles = new THREE.DodecahedronGeometry(planet.moons[j].radius, 3),
        moonMaterial = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('images/planets/mad_moon.png'),
            shading: THREE.SmoothShading,
            bumpMap: THREE.ImageUtils.loadTexture('images/planets/mad_moon_bump.png'),
            bumpScale: .1,
            specularMap: THREE.ImageUtils.loadTexture('images/planets/genericSpecularMap.jpg'),
            color: planet.moons[j].color
        });

        var moonSystem = new THREE.Mesh(moonParticles, moonMaterial);
        
        // add it to the scene
        planet.moons[j].system = moonSystem;
        scene.add(moonSystem);
    }
    onRenderFcts.splice(0, 0, function(){
        var angle	= Date.now()/(1000) * (2*Math.PI);
        
        planet.spherical.theta = angle/planet.orbitalTime;
        planet.spherical.phi = Math.PI/2 - Math.sin(planet.spherical.theta) * planet.inclination;
        
        particleSystem.position.x = planet.cartesian.x = planet.SMA;//*Math.cos(planet.spherical.theta)*Math.sin(planet.spherical.phi);
        particleSystem.position.z = planet.cartesian.y = planet.SMA*Math.sin(planet.spherical.theta)*Math.sin(planet.spherical.phi);
        particleSystem.position.y = planet.cartesian.z = planet.SMA*Math.cos(planet.spherical.phi);
        
        particleSystem.rotation.x = planet.axialTilt;
        particleSystem.rotation.y = planet.spherical.theta + angle/planet.rotationTime;
        
        for (var i = 0; i < planet.moons.length; i++)
        {
            planet.moons[i].spherical.theta = angle/planet.moons[i].orbitalTime;
            planet.moons[i].spherical.phi = Math.PI/2 - Math.sin(planet.moons[i].spherical.theta) * planet.moons[i].inclination + planet.axialTilt*Math.sin(planet.moons[i].spherical.theta);

            planet.moons[i].system.position.x = planet.moons[i].cartesian.x = planet.cartesian.x + planet.moons[i].SMA*Math.cos(planet.moons[i].spherical.theta)*Math.sin(planet.moons[i].spherical.phi);
            planet.moons[i].system.position.z = planet.moons[i].cartesian.y = planet.cartesian.y + planet.moons[i].SMA*Math.sin(planet.moons[i].spherical.theta)*Math.sin(planet.moons[i].spherical.phi);
            planet.moons[i].system.position.y = planet.moons[i].cartesian.z = planet.cartesian.z + planet.moons[i].SMA*Math.cos(planet.moons[i].spherical.phi);
        }
    })
}