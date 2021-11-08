import * as THREE from 'three'

import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';



			//(FOV, Aspect Ratio, Début distance de rendu, fin)
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			//Renderer
			const renderer = new THREE.WebGLRenderer( { antialias: true } );
			const scene = new THREE.Scene();

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

	bloomComposer.setSize( width, height );
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
			var	SpeedMultiplier = 0.1;
			var SpeedLimit = 0.8;
			var	LeftHit = 0;
			var RightHit = 0;
			var PosDiff = 0;
			var LeftScore = 0;
			var RightScore = 0;

			//Audio ==========================================================

const fftSize = 32;

const audioListener = new THREE.AudioListener();
const audio = new THREE.Audio(audioListener);

const audioLoader = new THREE.AudioLoader();
// Load audio file inside asset folder
// audioLoader.load('sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3', (buffer) => {
	audioLoader.load('sounds/main_song.mp3', (buffer) => {
    audio.setBuffer(buffer);
    audio.setLoop(true);
    audio.play();  // Start playback
});

// About fftSize https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
const analyser = new THREE.AudioAnalyser(audio, fftSize);

// analyser.getFrequencyData() returns array of half size of fftSize.
// ex. if fftSize = 2048, array size will be 1024.
// data includes magnitude of low ~ high frequency.
const data = analyser.getFrequencyData();

var AudioMeshArray_Left = [];
var AudioMeshArray_Right = [];
var AudioMeshArray_outline_Left = [];
var AudioMeshArray_outline_Right = [];
const geometry_audio = new THREE.BoxGeometry(1, 1, 1);
// const material_audio = new THREE.MeshStandardMaterial( { color: 0xffffff } );
const material_audio = new THREE.MeshBasicMaterial( { color: 0x000000 } );

const geometry_audio_outline = new THREE.BoxGeometry(1.2, 1.2, 1.2);
	const material_audio_outline = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
	const material_audio_outline_left = new THREE.MeshBasicMaterial( { color: 0x00c8ff, side: THREE.BackSide } );
	const material_audio_outline_right = new THREE.MeshBasicMaterial( { color: 0xfea022, side: THREE.BackSide } );

for (let i = 0, len = data.length; i < len; i++)
{
	AudioMeshArray_Left.unshift(new THREE.Mesh( geometry_audio, material_audio ));
	AudioMeshArray_Right.unshift(new THREE.Mesh( geometry_audio, material_audio ));
	AudioMeshArray_Left[0].position.x = -i * 1.8 - 1;
	AudioMeshArray_Right[0].position.x = i * 1.8 + 1;
	AudioMeshArray_Left[0].position.z = -22;
	AudioMeshArray_Right[0].position.z = -22;
	AudioMeshArray_Left[0].position.y = -2;
	AudioMeshArray_Right[0].position.y = -2;

	AudioMeshArray_outline_Left.unshift(new THREE.Mesh( geometry_audio_outline, material_audio_outline ));
	AudioMeshArray_outline_Right.unshift(new THREE.Mesh( geometry_audio_outline, material_audio_outline ));
	AudioMeshArray_outline_Left[0].layers.enable( BLOOM_SCENE );
	AudioMeshArray_outline_Right[0].layers.enable( BLOOM_SCENE );
	AudioMeshArray_outline_Left[0].position.x = -i * 1.8 - 1;
	AudioMeshArray_outline_Right[0].position.x = i * 1.8 + 1;
	AudioMeshArray_outline_Left[0].position.z = -22;
	AudioMeshArray_outline_Right[0].position.z = -22;
	AudioMeshArray_outline_Left[0].position.y = -2;
	AudioMeshArray_outline_Right[0].position.y = -2;
	// AudioMeshArray_outline_Left[0].multiplyScalar(1.05);

	scene.add( AudioMeshArray_Left[0], AudioMeshArray_Right[0], AudioMeshArray_outline_Left[0], AudioMeshArray_outline_Right[0]);
}



// for (let i = 0, len = data.length; i < len; i++)
// {
// 	AudioMeshArray[i].position.y = data[i];
// }


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
			var LeftoutlineMaterial= new THREE.MeshBasicMaterial( { color: 0x00c8ff, side: THREE.BackSide } );
			var LeftoutlineMesh = new THREE.Mesh( outline_geometry_bar, LeftoutlineMaterial );
			LeftoutlineMesh.scale.multiplyScalar(1.05);
			LeftoutlineMesh.layers.enable( BLOOM_SCENE );
			scene.add( LeftoutlineMesh );

			var RightoutlineMaterial= new THREE.MeshBasicMaterial( { color: 0xfea022, side: THREE.BackSide } );
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


			//Creation de l'arène
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

			//Grid Helper
			// const gridHelper = new THREE.GridHelper(200, 50);
			// gridHelper.layers.toggle( BLOOM_SCENE );
			// scene.add(gridHelper);

			//La caméra est de base au centre de la scène donc on la décale
			camera.position.z = 25;
			camera.position.y = 40;

			camera.rotation.x = -1;

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
				SpeedMultiplier = 0.1;
				LeftHit = 0;
				RightHit = 0;
			}
			//var	i = 1;
			const material_msh = new THREE.MeshBasicMaterial({
				color: 0xffffff,
				side: THREE.DoubleSide,
				depthWrite: false
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
							SpeedMultiplier += 0.01;
							trainee_msh[0].material.color.setHex(0x00c8ff);
							BalloutlineMesh.material.color.setHex(0x00c8ff);
							BallLight.color.setHex(0x00c8ff);
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
						SpeedMultiplier += 0.01;
						trainee_msh[0].material.color.setHex(0xffea022);
						BalloutlineMesh.material.color.setHex(0xffea022);
						BallLight.color.setHex(0xffea022);
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
					resetParams(0);
				}

				if (ball.position.x >= edge_right.position.x - 1)
				{
					LeftScore += 1;
					resetParams(1);
				}
			}

			function updateAudioVisualizer()
			{
				const data = analyser.getFrequencyData();
				let averageFreq = analyser.getAverageFrequency();
				for (let i = data.length - 1, len = 0; i >= len; i--)
				{
					var calc =  averageFreq / 100 + data[i] / 20;
					var calc_2 = calc / 2;
					AudioMeshArray_Left[i].scale.set(1, calc, 1);
					AudioMeshArray_Left[i].position.y = calc_2;
					AudioMeshArray_Right[i].scale.set(1, calc, 1);
					AudioMeshArray_Right[i].position.y = calc_2;
					AudioMeshArray_outline_Left[i].scale.set(1, calc, 1);
					AudioMeshArray_outline_Left[i].position.y = calc_2;
					AudioMeshArray_outline_Right[i].scale.set(1, calc, 1);
					AudioMeshArray_outline_Right[i].position.y = calc_2;
					
				}
			}

			//La game loop
			const animate = function ()
			{
				requestAnimationFrame( animate );
				moveBall();
				updateAudioVisualizer();
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
				//Lance le rendu de la scene
				// renderer.render( scene, camera );
				
				// renderBloom( true );
				bloomComposer.render();
				// render the entire scene, then render bloom scene on top
				finalComposer.render();
			};

			animate();