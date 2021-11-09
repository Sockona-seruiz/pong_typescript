import * as THREE from 'three'

function sleep(ms)	{
	return new Promise(resolve => setTimeout(resolve, ms));
	}

async function setFirework_pos(scene, fireworks, firework_geo, firework_m, size, x, y, z, elevation)
{
	var positions = fireworks.geometry.attributes.position.array;

	var x, y, z;
	var	currentIndex = 0;

	for (let j = 0; j < elevation; j++)
	{
		for ( let i = 0; i < size * 3; i ++ ) 
		{
			positions[ currentIndex++ ] = x;

			if (currentIndex == 1 && j > 1)
				positions[ currentIndex++ ] = y - 2;
			else if (currentIndex == 4 && j > 3)
				positions[ currentIndex++ ] = y - 4;
			else
				positions[ currentIndex++ ] = y;

			positions[ currentIndex++ ] = z;
		}
		y += 1;
		currentIndex = 0;
		fireworks.geometry.attributes.position.needsUpdate = true;
		await sleep(20 + j);
	}
	y -= 1;
	await sleep(20);
	positions[1] = y;
	positions[4] = y - 2;
	fireworks.geometry.attributes.position.needsUpdate = true;
	// await sleep(40 + elevation);
	positions[4] = y;
	fireworks.geometry.attributes.position.needsUpdate = true;

	let velocity_x = [];
	let velocity_y = [];
	let velocity_z = [];
	
	for ( let i = 0; i < size; i ++ ) 
	{
		velocity_x.unshift(Math.random() * (1 + 1) - 1);
		velocity_y.unshift(Math.random() * (1 + 1) - 1);
		velocity_z.unshift(Math.random() * (1 + 1) - 1);
	}
	var index = 0;
	currentIndex = 0;
	for (let j = 0; j < 100; j++)
	{
		for ( let i = 0; i < size * 3; i ++ ) 
		{
			positions[ currentIndex++ ] += velocity_x[index];
			positions[ currentIndex++ ] += velocity_y[index];
			positions[ currentIndex++ ] += velocity_z[index];
			index++;
			velocity_y[index] -= 0.03;
		}
		index = 0;
		currentIndex = 0;
		fireworks.geometry.attributes.position.needsUpdate = true;
		await sleep(25);
	}

	scene.remove( fireworks );
	firework_geo.dispose();
	firework_m.dispose();

}

export function launchFirework(scene, x, y, z, elevation, size, fireworks_color)
{
	// const firework_v = [];

	// firework_v.push(x, y, z);
	const firework_geo = new THREE.BufferGeometry();
	var firework_pos = new Float32Array( size * 3 );
	firework_geo.setAttribute( 'position', new THREE.BufferAttribute( firework_pos, 3 ) );
	const firework_m = new THREE.PointsMaterial( { color: fireworks_color } );

	const fireworks = new THREE.Points( firework_geo, firework_m );

	scene.add(fireworks);
	setFirework_pos(scene, fireworks, firework_geo, firework_m, size, x, y, z, elevation);


	// while (fireworks[0].position.x < x + 20)
	// 	fireworks[0].position.x += 0.05;
}