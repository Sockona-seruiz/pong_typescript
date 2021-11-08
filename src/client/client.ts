import * as THREE from 'three'

import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper';



			//(FOV, Aspect Ratio, Début distance de rendu, fin)
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			//Renderer
			const renderer = new THREE.WebGLRenderer( { antialias: true } );
			const scene = new THREE.Scene();
			scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

//===================================================================================================================================================
const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

const params = {
	exposure: 1,
	bloomStrength: 2,
	bloomThreshold: 0,
	bloomRadius: 0,
	scene: "Scene with Glow"
};

const darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
const materials = {};

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild( renderer.domElement );

// const controls = new OrbitControls( camera, renderer.domElement );
// controls.maxPolarAngle = Math.PI * 0.5;
// controls.minDistance = 1;
// controls.maxDistance = 100;
// controls.addEventListener( 'change', render );

// scene.add( new THREE.AmbientLight( 0x404040 ) );

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

const finalPass = new ShaderPass(
	new THREE.ShaderMaterial( {
		uniforms: {
			baseTexture: { value: null },
			bloomTexture: { value: bloomComposer.renderTarget2.texture }
		},
		vertexShader:`			varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,
		fragmentShader:`			uniform sampler2D baseTexture;
		uniform sampler2D bloomTexture;
		varying vec2 vUv;
		void main() {
			gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
		}`,
		// vertexShader: document.getElementById( 'vertexshader' ).textContent,
		// fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		defines: {}
	} ), "baseTexture"
);
finalPass.needsSwap = true;
const width = window.innerWidth;
const height = window.innerHeight;
bloomComposer.setSize( width / 2 , height / 2);

const finalComposer = new EffectComposer( renderer );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );

const mouse = new THREE.Vector2();

window.onresize = function () {

	const width = window.innerWidth;
	const height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );

	bloomComposer.setSize( width / 2, height / 2);
	finalComposer.setSize( width, height );

	// render();

};

//=======================================================================================================================================================

			var Ball_pos_x = 0;
			var Ball_pos_z = 0;
			var	Left_bar_pos_x = 0;
			var	Left_bar_pos_z = 0;
			var Right_bar_pos_x = 0;
			var Right_bar_pos_z = 0;

			var BallAngle = Math.PI;
			var M_PI = Math.PI;
			var M_2PI = 2 * Math.PI;
			var M_PI_2 = Math.PI / 2;
			var M_3PI_2 = 3 * (Math.PI / 2);
			var	SpeedMultiplier = 0.4;
			var SpeedLimit = 1.4;
			var	LeftHit = 0;
			var RightHit = 0;
			var PosDiff = 0;
			var LeftScore = 0;
			var RightScore = 0;
			
			var Leftcol = 0x0ae0ff;
			var Rightcol = 0xff13a5;
			var Floorcol = 0x8108ff;
			var UnerFloor = 0x8108ff;
			
			var Barcol = 0xffffff;
			// var Barcol = 0xff8a14;

			//Audio ==========================================================


var audiolist = [];
// audiolist.unshift("sounds/far-cry-3-blood-dragon-ost-power-core-track-07.mp3");
// audiolist.unshift('sounds/dryskill-burnout-dubstep-synthwave.mp3');
// audiolist.unshift('sounds/far-cry-3-blood-dragon-ost-omega-force-track-16.mp3');
// audiolist.unshift('sounds/far-cry-3-blood-dragon-ost-sloans-assault-track-10.mp3');
// audiolist.unshift('sounds/legend-of-zelda-theme-but-its-synthwave.mp3');
// audiolist.unshift('sounds/mdk-press-start-free-download.mp3');
audiolist.unshift('sounds/main_song.mp3');
// audiolist.unshift('sounds/miami-nights-1984-accelerated.mp3');
// audiolist.unshift('sounds/powercyan-plutocracy-ephixa-remix-synthwave-dubstep.mp3');
// audiolist.unshift('sounds/skrillex-bangarang-feat-sirah-official-music-video.mp3');
// audiolist.unshift('sounds/skrillex-first-of-the-year-equinox.mp3');
// audiolist.unshift('sounds/waterflame-blast-processing.mp3');
// audiolist.unshift('sounds/dirty-androids-midnight-lady.mp3');
// audiolist.unshift('sounds/dirty-androids-midnight-lady.mp3');
// audiolist.unshift('sounds/dirty-androids-midnight-lady.mp3');
// audiolist.unshift('sounds/dirty-androids-midnight-lady.mp3');
// audiolist.unshift('sounds/dirty-androids-midnight-lady.mp3');
// audiolist.unshift('sounds/dirty-androids-midnight-lady.mp3');
// audiolist.unshift('sounds/dirty-androids-midnight-lady.mp3');
// audiolist.unshift('sounds/dirty-androids-midnight-lady.mp3');

const fftSize = 32;

const audioListener = new THREE.AudioListener();
const audio = new THREE.Audio(audioListener);

const audioLoader = new THREE.AudioLoader();
// Load audio file inside asset folder
// audioLoader.load('sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3', (buffer) => {
	audioLoader.load(audiolist[Math.floor(Math.random() * audiolist.length)], (buffer) => {
	// audioLoader.load('sounds/legend-of-zelda-theme-but-its-synthwave.mp3', (buffer) => {
    audio.setBuffer(buffer);
    audio.setLoop(true);
    audio.play();  // Start playback
});

// About fftSize https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
const analyser = new THREE.AudioAnalyser(audio, fftSize);

// analyser.getFrequencyData() returns array of half size of fftSize.
// ex. if fftSize = 2048, array size will be 1024.
// data includes magnitude of low ~ high frequency.
var data = analyser.getFrequencyData();
var averageFreq = analyser.getAverageFrequency();

var AudioMeshArray_Left = [];
var AudioMeshArray_Right = [];
var AudioMeshArray_outline_Left = [];
var AudioMeshArray_outline_Right = [];
const geometry_audio = new THREE.BoxGeometry(1, 1, 1);
// const material_audio = new THREE.MeshStandardMaterial( { color: 0xffffff } );
const material_audio = new THREE.MeshBasicMaterial( { color: 0x000000 } );

const geometry_audio_outline = new THREE.BoxGeometry(1.2, 1.2, 1.2);
	const material_audio_outline = new THREE.MeshBasicMaterial( { color: Barcol, side: THREE.BackSide } );
	const material_audio_outline_left = new THREE.MeshBasicMaterial( { color: Leftcol, side: THREE.BackSide } );
	const material_audio_outline_right = new THREE.MeshBasicMaterial( { color: Rightcol, side: THREE.BackSide } );

	var leftbar_loader = new THREE.TextureLoader();
	var leftbar_texture = leftbar_loader.load( 'textures/gradient_blue_pink.png' );

	var rightbar_loader = new THREE.TextureLoader();
	var rightbar_texture = rightbar_loader.load( 'textures/gradient_pink_blue.png' );

	const leftmaterial_audio_outline_test = new THREE.MeshPhongMaterial({
		side: THREE.BackSide,
		wireframe: false,
		emissive : 0xffffff,
		emissiveIntensity : 0.5,
		emissiveMap : leftbar_texture
    });

	const rightmaterial_audio_outline_test = new THREE.MeshPhongMaterial({
		side: THREE.BackSide,
		wireframe: false,
		emissive : 0xffffff,
		emissiveIntensity : 0.5,
		emissiveMap : rightbar_texture
    });

for (let i = 0, len = data.length; i < len; i++)
{
	AudioMeshArray_Left.unshift(new THREE.Mesh( geometry_audio, material_audio ));
	AudioMeshArray_Right.unshift(new THREE.Mesh( geometry_audio, material_audio ));
	AudioMeshArray_Left[0].position.z = i * 2.65 - 20;
	AudioMeshArray_Right[0].position.z = i * 2.65 - 20;
	AudioMeshArray_Left[0].position.x = -32;
	AudioMeshArray_Right[0].position.x = 32;
	AudioMeshArray_Left[0].position.y = -2;
	AudioMeshArray_Right[0].position.y = -2;

	AudioMeshArray_outline_Left.unshift(new THREE.Mesh( geometry_audio_outline, leftmaterial_audio_outline_test ));
	AudioMeshArray_outline_Right.unshift(new THREE.Mesh( geometry_audio_outline, leftmaterial_audio_outline_test ));
	AudioMeshArray_outline_Left[0].layers.enable( BLOOM_SCENE );
	AudioMeshArray_outline_Right[0].layers.enable( BLOOM_SCENE );
	AudioMeshArray_outline_Left[0].position.z = i * 2.65 - 20;
	AudioMeshArray_outline_Right[0].position.z = i * 2.65 - 20;
	AudioMeshArray_outline_Left[0].position.x = -32;
	AudioMeshArray_outline_Right[0].position.x = 32;
	AudioMeshArray_outline_Left[0].position.y = -2;
	AudioMeshArray_outline_Right[0].position.y = -2;
	// AudioMeshArray_outline_Left[0].multiplyScalar(1.05);

	scene.add( AudioMeshArray_Left[0], AudioMeshArray_Right[0], AudioMeshArray_outline_Left[0], AudioMeshArray_outline_Right[0]);
}

//Sun=========================================================================

	var SunMesh;

		var gltfloader = new GLTFLoader().setPath( 'models/' );

		gltfloader.load( 'SunFull.gltf', function ( gltf ) {
		gltf.scene.traverse( function ( child ) {
			if(child instanceof THREE.Mesh) {
			child.material.emissiveIntensity = 0.3;
			child.position.set(0, 11, -24);
			}
		} );
		SunMesh = gltf.scene;
		scene.add( gltf.scene );
		} );
		// gltfloader.load( 'SunMidBot.gltf', function ( gltf ) {
		// gltf.scene.traverse( function ( child ) {
		// 	if ( child.isMesh ) {
		// 	child.material.emissiveIntensity = 0.3;
		// 	child.position.set(0, 11, -24);
		// 	}
		// } );
		// SunMesh[1] = gltf.scene;
		// scene.add( gltf.scene );
		// } );
		// gltfloader.load( 'SunMidTop.gltf', function ( gltf ) {
		// gltf.scene.traverse( function ( child ) {
		// 	if ( child.isMesh ) {
		// 	child.material.emissiveIntensity = 0.3;
		// 	child.position.set(0, 11, -24);
		// 	}
		// } );
		// SunMesh[2] = gltf.scene;
		// scene.add( gltf.scene );
		// } );
		// gltfloader.load( 'SunTop.gltf', function ( gltf ) {
		// gltf.scene.traverse( function ( child ) {
		// 	if ( child.isMesh ) {
		// 	child.material.emissiveIntensity = 0.3;
		// 	child.position.set(0, 11, -24);
		// 	}
		// } );
		// SunMesh[3] = gltf.scene;
		// scene.add( gltf.scene );
		// } );

		// if (SunMesh)
		// {
		//  	SunMesh.position.set(-20, 11, -23);
		// 	SunMesh.material.emissiveIntensity = 1;
		// }
// var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
// 	model.traverse((o) => {
//   if (o.isMesh) o.position.x = -20;
// });


//Plane =========================================================================


var planeGeometry = new THREE.PlaneGeometry(600, 300, 40, 20);
	var planeMaterial = new THREE.MeshPhongMaterial({
		// color: 0x6904ce,
		color: Floorcol,
		side: THREE.DoubleSide,
		wireframe: true,
		emissive : Floorcol,
		emissiveIntensity : 2.5,
		// specular : 0xffffff,
		// shininess : 10
	});
	var UnderplaneGeometry = new THREE.PlaneGeometry(700, 350, 2, 2);

	// const texture = new THREE.TextureLoader().load( 'textures/gradient.jpg' );

	// texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	// texture.repeat.set( 10000, 10000 );
	// texture.anisotropy = 16;
	// texture.encoding = THREE.sRGBEncoding;


    var loader = new THREE.TextureLoader();
    var texture = loader.load( 'textures/gradient_blue_pink.png' );

	var UnderplaneMaterial = new THREE.MeshPhongMaterial({
		side: THREE.DoubleSide,
		wireframe: false,
		emissive : Floorcol,
		emissiveIntensity : 0.085,
		emissiveMap : texture
    });

    
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    var Underplane = new THREE.Mesh(UnderplaneGeometry, UnderplaneMaterial);
	// plane.rotation.x = -0.5 * Math.PI;
	plane.rotation.x += M_PI_2;
	Underplane.rotation.x += M_PI_2;
	plane.position.set(0, -10, -100);
	Underplane.position.set(0, -18, -100);
	// plane.layers.enable( BLOOM_SCENE );
	scene.add(plane, Underplane);

	function modulate(val, minVal, maxVal, outMin, outMax) {
	var fr = fractionate(val, minVal, maxVal);
	var delta = outMax - outMin;
	return outMin + (fr * delta);
	}

	function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

	// var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    // scene.add(ambientLight);

//Score==========================================================================


const x = 0, y = 0;

const rightrithcrystal = [];

const crystalshape = new THREE.Shape();

crystalshape.moveTo( x + 5, y );
crystalshape.lineTo(x + 5 - 0.5, y - 0.5);
crystalshape.lineTo(x + 0.5, y - 0.5);
crystalshape.lineTo(0, 0);

const ONcrystalmaterialleft = new THREE.MeshBasicMaterial( { color: 0x42e7ff } );
const ONcrystalmaterialright = new THREE.MeshBasicMaterial( { color: 0xff5ec3 } );
const OFFcrystalmaterial = new THREE.MeshBasicMaterial( { color: 0x040404 } );

const crystalgeometry = new THREE.ShapeGeometry( crystalshape );
const crystalmeshTop = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
crystalmeshTop.position.set(0, 19.5, 10);
rightrithcrystal.unshift(crystalmeshTop);

const crystalmeshTopLeft = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
crystalmeshTopLeft.rotation.z = M_PI_2;
crystalmeshTopLeft.position.set(0, 14, 10);
rightrithcrystal.unshift(crystalmeshTopLeft);

const crystalmeshTopRight = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
crystalmeshTopRight.rotation.z = -M_PI_2;
crystalmeshTopRight.position.set(5, 19, 10);
rightrithcrystal.unshift(crystalmeshTopRight);

const crystalmeshBotLeft = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
crystalmeshBotLeft.rotation.z = M_PI_2;
crystalmeshBotLeft.position.set(0, 8, 10);
rightrithcrystal.unshift(crystalmeshBotLeft);

const crystalmeshBotRight = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
crystalmeshBotRight.rotation.z = - M_PI_2;
crystalmeshBotRight.position.set(5, 13, 10);
rightrithcrystal.unshift(crystalmeshBotRight);

const crystalmeshBot = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
crystalmeshBot.rotation.z = M_PI;
crystalmeshBot.position.set(5, 7.5, 10);
rightrithcrystal.unshift(crystalmeshBot);

const midcrystalshape = new THREE.Shape();

midcrystalshape.moveTo( x - 0.5, y - 0.5);
midcrystalshape.lineTo(x, y);
midcrystalshape.lineTo(x + 4, y);
midcrystalshape.lineTo(x + 4.5, y - 0.5);
midcrystalshape.lineTo(x + 4, y - 1);
midcrystalshape.lineTo(x, y - 1);

const midcrystalgeometry = new THREE.ShapeGeometry( midcrystalshape );
const crystalmeshMid = new THREE.Mesh( midcrystalgeometry, OFFcrystalmaterial ) ;
crystalmeshMid.position.set(0.5, 14, 10);
rightrithcrystal.unshift(crystalmeshMid);

var drawfct = [];

drawfct[0] = function draw0(crystaltab, left)
{
	let ONcrystalmaterial;
	if (left == true)
		ONcrystalmaterial = ONcrystalmaterialleft;
	else
		ONcrystalmaterial = ONcrystalmaterialright;
	crystaltab[0].material = OFFcrystalmaterial;
	crystaltab[1].material = ONcrystalmaterial;
	crystaltab[2].material = ONcrystalmaterial;
	crystaltab[3].material = ONcrystalmaterial;
	crystaltab[4].material = ONcrystalmaterial;
	crystaltab[5].material = ONcrystalmaterial;
	crystaltab[6].material = ONcrystalmaterial;
}

drawfct[1] = function draw1(crystaltab, left)
{
	let ONcrystalmaterial;
	if (left == true)
		ONcrystalmaterial = ONcrystalmaterialleft;
	else
		ONcrystalmaterial = ONcrystalmaterialright;
	crystaltab[0].material = OFFcrystalmaterial;
	crystaltab[1].material = OFFcrystalmaterial;
	crystaltab[2].material = ONcrystalmaterial;
	crystaltab[3].material = OFFcrystalmaterial;
	crystaltab[4].material = ONcrystalmaterial;
	crystaltab[5].material = OFFcrystalmaterial;
	crystaltab[6].material = OFFcrystalmaterial;
}

drawfct[2] = function draw2(crystaltab, left)
{
	let ONcrystalmaterial;
	if (left == true)
		ONcrystalmaterial = ONcrystalmaterialleft;
	else
		ONcrystalmaterial = ONcrystalmaterialright;
	crystaltab[0].material = ONcrystalmaterial;
	crystaltab[1].material = ONcrystalmaterial;
	crystaltab[2].material = OFFcrystalmaterial;
	crystaltab[3].material = ONcrystalmaterial;
	crystaltab[4].material = ONcrystalmaterial;
	crystaltab[5].material = OFFcrystalmaterial;
	crystaltab[6].material = ONcrystalmaterial;
}

drawfct[3] = function draw3(crystaltab, left)
{
	let ONcrystalmaterial;
	if (left == true)
		ONcrystalmaterial = ONcrystalmaterialleft;
	else
		ONcrystalmaterial = ONcrystalmaterialright;
	crystaltab[0].material = ONcrystalmaterial;
	crystaltab[1].material = ONcrystalmaterial;
	crystaltab[2].material = ONcrystalmaterial;
	crystaltab[3].material = OFFcrystalmaterial;
	crystaltab[4].material = ONcrystalmaterial;
	crystaltab[5].material = OFFcrystalmaterial;
	crystaltab[6].material = ONcrystalmaterial;
}

drawfct[4] = function draw4(crystaltab, left)
{
	let ONcrystalmaterial;
	if (left == true)
		ONcrystalmaterial = ONcrystalmaterialleft;
	else
		ONcrystalmaterial = ONcrystalmaterialright;
	crystaltab[0].material = ONcrystalmaterial;
	crystaltab[1].material = OFFcrystalmaterial;
	crystaltab[2].material = ONcrystalmaterial;
	crystaltab[3].material = OFFcrystalmaterial;
	crystaltab[4].material = ONcrystalmaterial;
	crystaltab[5].material = ONcrystalmaterial;
	crystaltab[6].material = OFFcrystalmaterial;
}

drawfct[5] = function draw5(crystaltab, left)
{
	let ONcrystalmaterial;
	if (left == true)
		ONcrystalmaterial = ONcrystalmaterialleft;
	else
		ONcrystalmaterial = ONcrystalmaterialright;
	crystaltab[0].material = ONcrystalmaterial;
	crystaltab[1].material = ONcrystalmaterial;
	crystaltab[2].material = ONcrystalmaterial;
	crystaltab[3].material = OFFcrystalmaterial;
	crystaltab[4].material = OFFcrystalmaterial;
	crystaltab[5].material = ONcrystalmaterial;
	crystaltab[6].material = ONcrystalmaterial;
}

drawfct[6] = function draw6(crystaltab, left)
{
	let ONcrystalmaterial;
	if (left == true)
		ONcrystalmaterial = ONcrystalmaterialleft;
	else
		ONcrystalmaterial = ONcrystalmaterialright;
	crystaltab[0].material = ONcrystalmaterial;
	crystaltab[1].material = ONcrystalmaterial;
	crystaltab[2].material = ONcrystalmaterial;
	crystaltab[3].material = ONcrystalmaterial;
	crystaltab[4].material = OFFcrystalmaterial;
	crystaltab[5].material = ONcrystalmaterial;
	crystaltab[6].material = ONcrystalmaterial;
}

drawfct[7] = function draw7(crystaltab, left)
{
	let ONcrystalmaterial;
	if (left == true)
		ONcrystalmaterial = ONcrystalmaterialleft;
	else
		ONcrystalmaterial = ONcrystalmaterialright;
	crystaltab[0].material = OFFcrystalmaterial;
	crystaltab[1].material = OFFcrystalmaterial;
	crystaltab[2].material = ONcrystalmaterial;
	crystaltab[3].material = OFFcrystalmaterial;
	crystaltab[4].material = ONcrystalmaterial;
	crystaltab[5].material = OFFcrystalmaterial;
	crystaltab[6].material = ONcrystalmaterial;
}

drawfct[8] = function draw8(crystaltab, left)
{
	let ONcrystalmaterial;
	if (left == true)
		ONcrystalmaterial = ONcrystalmaterialleft;
	else
		ONcrystalmaterial = ONcrystalmaterialright;
	crystaltab[0].material = ONcrystalmaterial;
	crystaltab[1].material = ONcrystalmaterial;
	crystaltab[2].material = ONcrystalmaterial;
	crystaltab[3].material = ONcrystalmaterial;
	crystaltab[4].material = ONcrystalmaterial;
	crystaltab[5].material = ONcrystalmaterial;
	crystaltab[6].material = ONcrystalmaterial;
}

drawfct[9] = function draw9(crystaltab, left)
{
	let ONcrystalmaterial;
	if (left == true)
		ONcrystalmaterial = ONcrystalmaterialleft;
	else
		ONcrystalmaterial = ONcrystalmaterialright;
	crystaltab[0].material = ONcrystalmaterial;
	crystaltab[1].material = ONcrystalmaterial;
	crystaltab[2].material = ONcrystalmaterial;
	crystaltab[3].material = OFFcrystalmaterial;
	crystaltab[4].material = ONcrystalmaterial;
	crystaltab[5].material = ONcrystalmaterial;
	crystaltab[6].material = ONcrystalmaterial;
}

function updateScore(leftscore, rightscore)
{
	if (leftscore > 99)
		leftscore = 99;
	if (rightscore > 99)
		rightscore = 99;
	let lscoreunite = leftscore % 10;
	let rscoreunite = rightscore % 10;


	let lscoredizaine = (leftscore - lscoreunite) / 10;
	let rscoredizaine = (rightscore - rscoreunite) / 10;

	// console.log(lscoredizaine );

	
	drawfct[lscoredizaine](leftleftcrystal, true);
	drawfct[lscoreunite](leftrightcrystal, true);
	drawfct[rscoredizaine](rightleftcrystal, false);
	drawfct[rscoreunite](rightrithcrystal, false);
}

var leftleftcrystal = [];
var leftrightcrystal = [];
var rightleftcrystal = [];

for (let i = 0; i < rightrithcrystal.length; i++)
{
	rightrithcrystal[i].position.x -= 2.5;
	leftleftcrystal[i] = rightrithcrystal[i].clone(rightrithcrystal[i], true);
	leftrightcrystal[i] = rightrithcrystal[i].clone(rightrithcrystal[i], true);
	rightleftcrystal[i] = rightrithcrystal[i].clone(rightrithcrystal[i], true);
	leftleftcrystal[i].position.x -= 26.5;
	leftrightcrystal[i].position.x -= 16.5;
	rightleftcrystal[i].position.x += 16.5;
	rightrithcrystal[i].position.x += 26.5;

	leftleftcrystal[i].position.z -= 30;
	leftrightcrystal[i].position.z -= 30;
	rightleftcrystal[i].position.z -= 30;
	rightrithcrystal[i].position.z -= 30;

	scene.add( leftleftcrystal[i], leftrightcrystal[i], rightleftcrystal[i], rightrithcrystal[i]);
}

updateScore(0, 0);

// drawfct[4](leftleftcrystal, true);
// drawfct[7](leftrightcrystal, true);
// drawfct[8](rightleftcrystal, false);
// drawfct[6](rightrithcrystal, false);

//PARTICLES ======================================================================

// const particlesData = [];
// let container;
// 			let positions, colors;
// 			let particles;
// 			let pointCloud;
// 			let particlePositions;
// 			let linesMesh;

// 			const maxParticleCount = 1000;
// 			let particleCount = 500;
// 			const r = 200;
// 			const rHalf = r / 2;


// const effectController = {
// 				showDots: true,
// 				showLines: true,
// 				minDistance: 20,
// 				limitConnections: false,
// 				maxConnections: 20,
// 				particleCount: 500
// 			};

// 			const group = new THREE.Group();
// 				scene.add( group );

// 			// container = document.getElementById( 'container' );

// 			const helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( r + 180 , 1, r + 50 ) ) );
// 				helper.material.color.setHex( 0xff0000 );
// 				helper.material.blending = THREE.AdditiveBlending;
// 				helper.material.transparent = true;
// 				group.add( helper );

// 				const segments = maxParticleCount * maxParticleCount;

// 				positions = new Float32Array( segments * 3 );
// 				colors = new Float32Array( segments * 3 );

// 				const pMaterial = new THREE.PointsMaterial( {
// 					color: 0xFFFFFF,
// 					size: 3,
// 					blending: THREE.AdditiveBlending,
// 					transparent: true,
// 					sizeAttenuation: false
// 				} );

// 				particles = new THREE.BufferGeometry();
// 				particlePositions = new Float32Array( maxParticleCount * 3 );

// 				for ( let i = 0; i < maxParticleCount; i ++ ) {

// 					const x = Math.random() * (r + 180) - (r + 180) / 2;
// 					const y = Math.random() * 1 - 1 / 2;
// 					const z = Math.random() * (r + 50) - (r + 50) / 2;

// 					particlePositions[ i * 3 ] = x;
// 					particlePositions[ i * 3 + 1 ] = y;
// 					particlePositions[ i * 3 + 2 ] = z;

// 					// add it to the geometry
// 					particlesData.push( {
// 						velocity: new THREE.Vector3( - 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2 ),
// 						numConnections: 0
// 					} );

// 				}

// 				particles.setDrawRange( 0, particleCount );
// 				particles.setAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setUsage( THREE.DynamicDrawUsage ) );

// 				// create the particle system
// 				pointCloud = new THREE.Points( particles, pMaterial );
// 				group.add( pointCloud );

// 				const geometry = new THREE.BufferGeometry();

// 				geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
// 				geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );

// 				geometry.computeBoundingSphere();

// 				geometry.setDrawRange( 0, 0 );

// 				const material = new THREE.LineBasicMaterial( {
// 					vertexColors: true,
// 					blending: THREE.AdditiveBlending,
// 					transparent: true
// 				} );

// 				linesMesh = new THREE.LineSegments( geometry, material );
// 				group.add( linesMesh );


			//On crée la géométrie
			const geometry_bar = new THREE.BoxGeometry(1, 1, 8);
			//Selection du material

			//Material FLAT qui ne réagit pas à la lumière :
			//const material_bar_left = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false } );
			//Matérial Dynamique qui y réagit :
			const material_bar_left = new THREE.MeshStandardMaterial( { color: 0xffffff } );
			//On crée la mesh en utiliant la géométrie et le mat
			const bar_left = new THREE.Mesh( geometry_bar, material_bar_left );


			//Material FLAT qui ne réagit pas à la lumière :
			//const material_bar_right = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false } );
			//Matérial Dynamique qui y réagit :
			const material_bar_right = new THREE.MeshStandardMaterial( { color: 0xffffff } );
			//On crée la mesh en utiliant la géométrie et le mat
			const bar_right = new THREE.Mesh( geometry_bar, material_bar_right );
			//On l'ajoute à la scène


			const outline_geometry_bar = new THREE.BoxGeometry(1.2, 1.2, 8.2);
			var LeftoutlineMaterial= new THREE.MeshBasicMaterial( { color: Leftcol, side: THREE.BackSide } );
			var LeftoutlineMesh = new THREE.Mesh( outline_geometry_bar, LeftoutlineMaterial );
			LeftoutlineMesh.scale.multiplyScalar(1.05);
			LeftoutlineMesh.layers.enable( BLOOM_SCENE );
			scene.add( LeftoutlineMesh );

			var RightoutlineMaterial= new THREE.MeshBasicMaterial( { color: Rightcol, side: THREE.BackSide } );
			var RightoutlineMesh = new THREE.Mesh( outline_geometry_bar, RightoutlineMaterial );
			RightoutlineMesh.scale.multiplyScalar(1.05);
			RightoutlineMesh.layers.enable( BLOOM_SCENE );
			scene.add( RightoutlineMesh );

			Left_bar_pos_x = -25;
			bar_left.position.x = Left_bar_pos_x ;
			LeftoutlineMesh.position.x = bar_left.position.x;

			Right_bar_pos_x = 25;
			bar_right.position.x = Right_bar_pos_x;
			RightoutlineMesh.position.x = bar_right.position.x;
			scene.add( bar_left, bar_right, LeftoutlineMesh, RightoutlineMesh);


			//Arena =============================================================
			const geometry_edge_top = new THREE.BoxGeometry(60, 1, 1);
			const geometry_edge_side = new THREE.BoxGeometry(1, 1, 41);

			const material_edge = new THREE.MeshStandardMaterial( { color: 0xffffff } );
			
			const edge_top = new THREE.Mesh( geometry_edge_top, material_edge );
			const edge_bot = new THREE.Mesh( geometry_edge_top, material_edge );

			const edge_left = new THREE.Mesh( geometry_edge_side, material_edge );
			const edge_right = new THREE.Mesh( geometry_edge_side, material_edge );

			edge_top.position.z = -20;
			edge_bot.position.z = 20;
			edge_left.position.x = -30;
			edge_right.position.x = 30;
			scene.add( edge_top, edge_bot, edge_left, edge_right );

			var EdgeTopoutlineMaterial= new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
			const outline_geometry_edge_top = new THREE.BoxGeometry(61, 1.5, 1.5);
			var EdgeTopoutlineMesh = new THREE.Mesh( outline_geometry_edge_top, EdgeTopoutlineMaterial );
			EdgeTopoutlineMesh.position.z = edge_top.position.z;

			var EdgeBotoutlineMesh = new THREE.Mesh( outline_geometry_edge_top, EdgeTopoutlineMaterial );
			EdgeBotoutlineMesh.position.z = edge_bot.position.z;
			EdgeBotoutlineMesh.position.y -= 1

			var EdgeSideoutlineMaterial= new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
			const outline_geometry_edge_side = new THREE.BoxGeometry(1.5, 1.5, 41.5);
			var EdgeLeftoutlineMesh = new THREE.Mesh( outline_geometry_edge_side, EdgeSideoutlineMaterial );
			EdgeLeftoutlineMesh.position.x = edge_left.position.x;

			var EdgeRightoutlineMesh = new THREE.Mesh( outline_geometry_edge_side, EdgeSideoutlineMaterial );
			EdgeRightoutlineMesh.position.x = edge_right.position.x;	

			EdgeTopoutlineMesh.layers.enable( BLOOM_SCENE );
			EdgeBotoutlineMesh.layers.enable( BLOOM_SCENE );
			EdgeLeftoutlineMesh.layers.enable( BLOOM_SCENE );
			EdgeRightoutlineMesh.layers.enable( BLOOM_SCENE );
			scene.add( EdgeTopoutlineMesh, EdgeBotoutlineMesh, EdgeLeftoutlineMesh, EdgeRightoutlineMesh );

			var arena_floor_geo = new THREE.PlaneGeometry(61, 40, 2, 2);
	var arena_floor_Material = new THREE.MeshBasicMaterial({
		// color: 0x6904ce,
		color: 0x000000,
		// side: THREE.DoubleSide,
		transparent: true,
		opacity: 0.8,
		wireframe: false
    });
    
	var arena_floor = new THREE.Mesh(arena_floor_geo, arena_floor_Material);
    // plane.rotation.x = -0.5 * Math.PI;
	arena_floor.rotation.x -= M_PI_2;
	arena_floor.position.set(0, -1, 0);
	scene.add(arena_floor);

			//Ball
			const geometry_ball = new THREE.BoxGeometry(1, 1, 1);
			const ball_m = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false} );
			const ball = new THREE.Mesh( geometry_ball, ball_m );

			var BalloutlineMaterial= new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
			var BalloutlineMesh = new THREE.Mesh( geometry_ball, BalloutlineMaterial );
			BalloutlineMesh.position.x = ball.position.x;
			BalloutlineMesh.position.y = ball.position.y;
			BalloutlineMesh.position.z = ball.position.z;
			BalloutlineMesh.scale.multiplyScalar(1.2);

			scene.add (ball, BalloutlineMesh);
			//ball.layers.enable( BLOOM_SCENE );
			BalloutlineMesh.layers.enable( BLOOM_SCENE );



			var history_depth = 30;
			var pos_history_x = [0,0];
			var pos_history_z = [0,0];

			var trainee;
			var	trainee_geo;
			var	trainee_msh = [];

			// Point Light
			// const pointLight = new THREE.PointLight(0xffffff, 2, 50);
			// // // //On change sa position en x, y, et z
			// pointLight.position.set(0, 10, 0);

			//BallLight
			const BallLight = new THREE.PointLight(0xffffff, 5, 10);
			BallLight.intensity = (0.5);
			// //On change sa position en x, y, et z
			BallLight.position.set(0, 4, 0);

			scene.add(BallLight);

			// //Grid Helper
			// const gridHelper = new THREE.GridHelper(200, 50);
			// gridHelper.position.y -= 5;
			// // gridHelper.layers.toggle( BLOOM_SCENE );
			// scene.add(gridHelper);

			//La caméra est de base au centre de la scène donc on la décale
			camera.position.z = 28;
			camera.position.y = 38;

			camera.rotation.x = -0.86;

//Keys
			let UpArrow = false;
			let DownArrow = false;
			let Wkey = false;
			let Skey = false;


const onKeyDown = function ( event )
{
	switch ( event.code )
	{
		case 'KeyW':
			Wkey = true;
			break;
		case 'KeyS':
			Skey = true;
			break;

		case 'ArrowUp':
			UpArrow = true;
			break;
		case 'ArrowDown':
			DownArrow = true;
			break;
	}
};

const onKeyUp = function ( event )
{
	switch ( event.code )
	{
		case 'KeyW':
			Wkey = false;
			break;
		case 'KeyS':
			Skey = false;
			break;

		case 'ArrowUp':
			UpArrow = false;
			break;
		case 'ArrowDown':
			DownArrow = false;
			break;
	}
};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );



			function resetParams(x)
			{
				ball.position.x = 0;
				ball.position.z = 0;
				BalloutlineMesh.position.x = 0;
				BalloutlineMesh.position.z = 0;
				trainee_msh[0].material.color.setHex(0xffffff);
				BalloutlineMesh.material.color.setHex(0xffffff);
				BallLight.color.setHex(0xffffff);
				pos_history_x.unshift(0);
				pos_history_z.unshift(0);
				pos_history_x.pop();
				pos_history_z.pop();
				bar_left.position.x = Left_bar_pos_x;
				bar_left.position.z = 0;
				LeftoutlineMesh.position.x = bar_left.position.x;
				LeftoutlineMesh.position.z = bar_left.position.z;
				bar_right.position.x = Right_bar_pos_x;
				bar_right.position.z = 0;
				RightoutlineMesh.position.x = bar_right.position.x;
				RightoutlineMesh.position.z = bar_right.position.z;
				if (x == 0)
					BallAngle = Math.PI;
				else
					BallAngle = M_2PI;
				SpeedMultiplier = 0.4;
				LeftHit = 0;
				RightHit = 0;
			}
			//var	i = 1;
			const material_msh = new THREE.MeshBasicMaterial({
				color: 0xffffff,
				side: THREE.DoubleSide,
				// depthWrite: false
			});
			//====================================MOVE BALL==========================================
			//Faire plusieurs mesh et dessiner des carrés entre les points de l'historique
			//15 de profondeur = 14 carrés
			var old_trainee_pos_x = 0;
			var old_trainee_pos_z = 0;
			function moveBall()
			{
				pos_history_x.unshift(ball.position.x);
				pos_history_z.unshift(ball.position.z);
				pos_history_x.pop();
				pos_history_z.pop();

				if (trainee_msh[history_depth] != null)
				{
					scene.remove(trainee_msh[history_depth]);
					trainee_msh.pop();
				}
				trainee = new THREE.Shape();
				

				trainee.moveTo(pos_history_x[0], pos_history_z[0] - 0.5);
					
				trainee.lineTo(pos_history_x[1], pos_history_z[1] - 0.5);
				trainee.lineTo(pos_history_x[1], pos_history_z[1] + 0.5);
				trainee.lineTo(pos_history_x[0], pos_history_z[0] + 0.5);

				old_trainee_pos_x = pos_history_x[0 + 1];
				old_trainee_pos_z = pos_history_z[0 + 1] + 0.25;
				trainee_geo = new THREE.ShapeGeometry(trainee);
				trainee_msh.unshift (new THREE.Mesh(trainee_geo, material_msh));
				trainee_msh[0].rotation.x += M_PI_2;
				trainee_msh[0].layers.enable( BLOOM_SCENE );
				scene.add(trainee_msh[0]);

				
				ball.position.x += Math.cos(BallAngle) * SpeedMultiplier;
				ball.position.z += (Math.sin(BallAngle) * -1) * SpeedMultiplier;
				BalloutlineMesh.position.x = ball.position.x;
				BalloutlineMesh.position.z = ball.position.z;
				BallLight.position.x = ball.position.x;
				BallLight.position.z = ball.position.z;
				//  Est dans la barre de gauche en X                 (est dans la barre en Y)
				//Une barre fait 8 de hauteur
				if (ball.position.x >= bar_left.position.x - 1 && ball.position.x <= bar_left.position.x + 1 && (ball.position.z - 0.5 <= bar_left.position.z + 4 && ball.position.z + 0.5 >= bar_left.position.z - 4))
				{
					if (LeftHit == 0)
					{
						LeftHit = 1;
						PosDiff = ball.position.z - bar_left.position.z;
						BallAngle = Math.PI - BallAngle - (PosDiff / 30);
						if (BallAngle > M_2PI)
							BallAngle -= M_2PI;
						else if (BallAngle < 0)
							BallAngle += M_2PI;
						if (SpeedMultiplier < SpeedLimit)
							SpeedMultiplier += 0.02;
							trainee_msh[0].material.color.setHex(Leftcol);
							BalloutlineMesh.material.color.setHex(Leftcol);
							BallLight.color.setHex(Leftcol);
					}
					RightHit = 0;
				}

				if (ball.position.x >= bar_right.position.x - 1 && ball.position.x <= bar_right.position.x + 1 && (ball.position.z - 0.5 <= bar_right.position.z + 4 && ball.position.z + 0.5 >= bar_right.position.z - 4))
				{
					if (RightHit == 0)
					{
					RightHit = 1;
					PosDiff = ball.position.z - bar_right.position.z;
					BallAngle = Math.PI - BallAngle + (PosDiff/30);
					if (BallAngle > M_2PI)
						BallAngle -= M_2PI;
					else if (BallAngle < 0)
						BallAngle += M_2PI;
					if (SpeedMultiplier < SpeedLimit)
						SpeedMultiplier += 0.02;
						trainee_msh[0].material.color.setHex(Rightcol);
						BalloutlineMesh.material.color.setHex(Rightcol);
						BallLight.color.setHex(Rightcol);
					}
					LeftHit = 0;
				}

				if (ball.position.z <= edge_top.position.z + 1 || ball.position.z >= edge_bot.position.z - 1)
				{
					BallAngle = M_2PI - BallAngle;
					if (BallAngle > M_2PI)
						BallAngle -= M_2PI;
					else if (BallAngle < 0)
						BallAngle += M_2PI;
				}

				if (ball.position.x <= edge_left.position.x + 1)
				{
					RightScore += 1;
					updateScore(LeftScore, RightScore);
					resetParams(0);
				}

				if (ball.position.x >= edge_right.position.x - 1)
				{
					LeftScore += 1;
					updateScore(LeftScore, RightScore);
					resetParams(1);
				}
			}

			function updateAudioVisualizer()
			{
				let j = 0;
				for (let i = data.length - 1, len = 0; i >= len; i--)
				{
					var calc =  averageFreq / 120 + data[j] / 40;
					var calc_2 = calc / 2;
					AudioMeshArray_Left[i].scale.set(1, calc, 1);
					AudioMeshArray_Left[i].position.y = calc_2;
					AudioMeshArray_Right[i].scale.set(1, calc, 1);
					AudioMeshArray_Right[i].position.y = calc_2;
					AudioMeshArray_outline_Left[i].scale.set(1, calc, 1);
					AudioMeshArray_outline_Left[i].position.y = calc_2;
					AudioMeshArray_outline_Right[i].scale.set(1, calc, 1);
					AudioMeshArray_outline_Right[i].position.y = calc_2;
					j++;
					
				}
			}

		// 	var	point_pos = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4,
		// 0.3, 0.2, 0.1, 0, -0.1, -0.2, -0.3, -0.4, -0.5, -0.6, -0.7, -0.8, -0.9, -1, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4,
		// -0.3, -0.2, -0.1];
		// 	const	point_pos_len = 39;
		// 	var		point_pos_index = 0;
		// 	for ( let i = 0; i < 10; i ++ ) {
		// 		point_pos.unshift(i / 10);
		// 	}
			var plane_seed = [];
		for(let i = 0; i < plane.geometry.attributes.position.count; i++){
			plane_seed.unshift(Math.random() * (1 + 1) - 1);
		}

		// var Sunloaded = false;
		var IncreaseBrightness = true;
		// var BrightnessTable = [];
		// var Brightnesspointer = 0;
		// var j = 0.3;

		// for (let i = 0; i <= 50; i++)
		// {
		// 	BrightnessTable[i] = j * i;
		// }
		// for (let i = 50; i < 0; i--)
		// {
		// 	BrightnessTable[50 + i] = i;
		// }
		
		function moveSun()
		{
		if (SunMesh)
		{
			SunMesh.traverse( function ( child ) {
				if ( child.isMesh )
				{
					if (IncreaseBrightness == true)
					{
						child.material.emissiveIntensity += 0.002;
						if (child.material.emissiveIntensity >= 0.75)
							IncreaseBrightness = false;
					}
					else
					{
						child.material.emissiveIntensity -= 0.002;
						if (child.material.emissiveIntensity <= 0.25)
							IncreaseBrightness = true;
					
					}
			}
		} );
	}
			// if (Sunloaded == false)
			// {
			// 	if (SunMesh[0])
			// 	{
		 	// 		if (SunMesh[1])
			// 		{
			// 			 if (SunMesh[2])
			// 			{
			// 				 if (SunMesh[3])
			// 				{
			// 					 Sunloaded = true;
			// 				}
			// 			}
			// 		}
			// 	}
			// }
			// else
			// {
			// 	for (let i = 0; i <= 3; i++)
			// 	{
			// 		SunMesh[i].traverse( function ( child ) {
			// 				if ( child.isMesh )
			// 				{
			// 					// child.material.emissiveIntensity = BrightnessTable[Brightnesspointer];
			// 					if (IncreaseBrightness == true)
			// 					{
			// 						child.material.emissiveIntensity += 0.002;
			// 						if (child.material.emissiveIntensity >= 0.75 && i == 3)
			// 							IncreaseBrightness = false;
			// 					}
			// 					else
			// 					{
			// 						child.material.emissiveIntensity -= 0.002;
			// 						if (child.material.emissiveIntensity <= 0.25 && i == 3)
			// 							IncreaseBrightness = true;
			// 					}

			// 				}
			// 		} );
			// 	}
			// }
		}
	
function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}
			//La game loop
			const animate = function ()
			{
				requestAnimationFrame( animate );
				moveBall();
				data = analyser.getFrequencyData();
				averageFreq = analyser.getAverageFrequency();
				var lowerHalfArray = data.slice(0, (data.length/4) - 1);
				var lowerAvg = avg(lowerHalfArray);
				var lowerAvgFr = lowerAvg / lowerHalfArray.length;
				var lowerMidArray = data.slice((data.length/4) - 1, (2 * data.length/4) - 1);
				var lowerMidAvg = avg(lowerMidArray);
				var lowerMidAvgFr = lowerMidAvg / lowerMidArray.length;
				var upperMidArray = data.slice((2 * data.length/4) - 1, (3 * data.length/4) - 1);
				var upperMidAvg = avg(upperMidArray);
				var upperMidAvgFr = upperMidAvg / upperMidArray.length;
      			var upperHalfArray = data.slice( (3 * data.length/4) - 1, data.length - 1);
				var upperAvg = avg(upperHalfArray);
				var upperAvgFr = upperAvg / upperHalfArray.length;
				updateAudioVisualizer();
				moveSun();


				var vertices = plane.geometry.attributes.position.array;
				//Lower Average = les basses (aka les traits du centre)
				for(let i = 0; i < plane.geometry.attributes.position.count; i++){
  					// vertices[ i * 3 + 0 ] += 0 - Math.random() * (2);
  					// vertices[ i * 3 + 1 ] += 0 - Math.random() * (2);
					//vertices[ i * 3 + 2 ] = ((upperAvg / 120) + (upperMidAvg / 110) + (lowerMidAvg / 100) + (lowerAvg / 90)) * plane_seed[i];
					(vertices as any)[ i * 3 + 2 ] = ((upperAvgFr / 10) + (- upperMidAvgFr / 16) + (- lowerMidAvgFr / 14) + (lowerAvgFr / 12)) * plane_seed[i];
				}
				plane.geometry.attributes.position.needsUpdate = true;
				(plane.geometry as any).verticesNeedUpdate = true;
				(plane.geometry as any).normalsNeedUpdate = true;


				plane.geometry.computeVertexNormals();

				// if (Sunloaded == true)
				// {
				// 	SunMesh[3].scale.set(1 + (lowerAvgFr / 1500),1 + (lowerAvgFr / 1500),1 + (lowerAvgFr / 1500));
				// 	SunMesh[2].scale.set(1 + (lowerMidAvgFr / 1000),1 + (lowerMidAvgFr / 1000),1 + (lowerMidAvgFr / 1000));
				// 	SunMesh[1].scale.set(1 + (upperMidAvgFr / 1000),1 + (upperMidAvgFr / 1000),1 + (upperMidAvgFr / 1000));
				// 	SunMesh[0].scale.set(1 + (upperAvgFr / 1000),1 + (upperAvgFr / 1000),1 + (upperAvgFr / 1000));			
				// 	// upperAvgFr
				// 	// upperMidAvgFr
				// 	// lowerMidAvgFr
				// 	// lowerAvgFr	
				// }
				
				if (UpArrow == true)
				{
					if (bar_right.position.z - 4 > edge_top.position.z + 0.5)
					{
    			    	bar_right.position.z -= 0.5;
						RightoutlineMesh.position.z = bar_right.position.z;
					}
				}
				if (Wkey == true)
				{
					if (bar_left.position.z - 4 > edge_top.position.z + 0.5)
					{
    			    	bar_left.position.z -= 0.5;
						LeftoutlineMesh.position.z = bar_left.position.z;
					}
				}
				if (DownArrow == true)
				{
					if (bar_right.position.z + 4 < edge_bot.position.z - 0.5)
    			    {
						bar_right.position.z += 0.5;
						RightoutlineMesh.position.z = bar_right.position.z;
					}
				}
				if (Skey == true)
				{
					if (bar_left.position.z + 4 < edge_bot.position.z - 0.5)
					{
						bar_left.position.z += 0.5;
						LeftoutlineMesh.position.z = bar_left.position.z;
					}
				}
				bloomComposer.render();
				finalComposer.render();
			};

			animate();