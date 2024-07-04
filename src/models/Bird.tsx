import { useAnimations, useGLTF } from '@react-three/drei';
import { MeshProps, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { useEffect, useRef, useState } from 'react';
import {
	Group,
	MathUtils,
	Mesh,
	Quaternion,
	Vector3,
	Vector3Like,
} from 'three';

interface BirdProps extends MeshProps {
	isStarting: boolean;
	islandRef: React.RefObject<Group>;
}

const Bird: React.FC<BirdProps> = ({ isStarting, islandRef }) => {
	const ref = useRef<Mesh>(null!);
	const { scene, animations } = useGLTF('/3d/phoenix_bird.glb');
	const { actions } = useAnimations(animations, ref);
	const angleRef = useRef(0);

	// const { rotationX, rotationY, rotationZ } = useControls({
	// 	rotationX: {
	// 		value: 0,
	// 	},
	// 	rotationY: {
	// 		value: 0,
	// 	},
	// 	rotationZ: {
	// 		value: 0,
	// 	},
	// });

	// const cameraOffset = new Vector3(cameraX, cameraY, cameraZ);
	const cameraOffset = new Vector3(0, 10, -3);

	const [isMoving, setIsMoving] = useState(true);

	useEffect(() => {
		actions['Take 001']?.play();
	}, []);

	// useEffect(() => {
	// 	// Membuat quaternion untuk setiap sumbu
	// 	const rotationXQuat = new Quaternion();
	// 	const rotationYQuat = new Quaternion();
	// 	const rotationZQuat = new Quaternion();

	// 	rotationXQuat.setFromAxisAngle(
	// 		new Vector3(1, 0, 0),
	// 		MathUtils.degToRad(rotationX)
	// 	); // Rotasi pada sumbu X
	// 	rotationYQuat.setFromAxisAngle(
	// 		new Vector3(0, 1, 0),
	// 		MathUtils.degToRad(rotationY)
	// 	); // Rotasi pada sumbu Y
	// 	rotationZQuat.setFromAxisAngle(
	// 		new Vector3(0, 0, 1),
	// 		MathUtils.degToRad(rotationZ)
	// 	); // Rotasi pada sumbu Z

	// 	// Menggabungkan quaternion
	// 	const additionalRotation = new Quaternion();
	// 	additionalRotation.multiplyQuaternions(rotationXQuat, rotationYQuat);
	// 	additionalRotation.multiplyQuaternions(additionalRotation, rotationZQuat);

	// 	// Mengaplikasikan rotasi tambahan ke quaternion objek
	// 	ref.current.quaternion.premultiply(additionalRotation); // premultiply ensures the order of rotation
	// }, [rotationX,rotationY,rotationZ]);

	useFrame(({ scene, camera, clock }, delta) => {
		// ref.current.position.y = Math.sin(clock.elapsedTime) * 0.2 + 2;

		// if(ref.current.position.x > camera.position.x + 10){
		//     ref.current.rotation.y = Math.PI;
		// }else if(ref.current.position.x < camera.position.x - 10){
		//     ref.current.rotation.y = 0;
		// }

		// if(ref.current.rotation.y === 0){
		//     ref.current.position.x += 0.01;
		//     ref.current.position.z -= 0.01;
		// }else{
		//     ref.current.position.x -= 0.01;
		//     ref.current.position.z += 0.01;
		// }

		// ---------------------
		if (islandRef.current) {
			const speed = 0.3; // kecepatan rotasi
			const radius = 20; // jarak dari lingkaran pusat

			// Update sudut rotasi
			angleRef.current += speed * delta;

			// Menghitung posisi lingkaran yang mengorbit menggunakan fungsi trigonometri
			const x =
				islandRef.current.position.x + radius * Math.cos(angleRef.current);
			const z =
				islandRef.current.position.z + radius * Math.sin(angleRef.current);

			ref.current.position.lerp(new Vector3(-x, 4, z), 0.1);

			// Menggunakan lookAt untuk mengatur orientasi umum
			ref.current.lookAt(islandRef.current.position);

			// Menambahkan rotasi tambahan pada sumbu x menggunakan quaternion
			const additionalRotation = new Quaternion();
			additionalRotation.setFromAxisAngle(
				new Vector3(0, 1, 0),
				MathUtils.degToRad(-195)
			); // Rotasi 45 derajat

			ref.current.quaternion.multiplyQuaternions(
				ref.current.quaternion,
				additionalRotation
			);

			// // Menghitung posisi kamera agar selalu berada pada offset tertentu dari lingkaran yang mengorbit
			// const worldPosition = ref.current.position
			// 	.clone()
			// 	.add(cameraOffset.clone().applyQuaternion(ref.current.quaternion));
			// camera.position.lerp(worldPosition, 0.05);

			// // Mengatur agar kamera selalu melihat ke lingkaran yang mengorbit
			// camera.lookAt(ref.current.position);
		}

		// if (isStarting) {
		// 	if (isMoving) {
		// 		// scene.position.set(0, 0, 25);
		//         ref.current.rotation.y = MathUtils.radToDeg(-0.3);
		// 		scene.rotation.y = MathUtils.radToDeg(0.6);
		// 		scene.rotation.x = MathUtils.radToDeg(0);
		//         // ref.current.rotation.y = MathUtils.radToDeg(-0.3);
		//         // ref.current.rotation.x = MathUtils.radToDeg(-0.3);
		// 		// const targetPosition = new THREE.Vector3(0, 0, -20);
		// 		// const targetRotation = new THREE.Euler(0, 0, 0);
		// 		// // Dapatkan posisi saat ini
		// 		// const currentPosition = ref.current.position;

		// 		// // Hitung pergerakan baru
		// 		// const direction = scene.position
		// 		// 	.clone()
		// 		// 	.sub(currentPosition)
		// 		// 	.normalize();
		// 		// const distance = currentPosition.distanceTo(targetPosition);

		// 		// // Periksa apakah sudah mencapai tujuan
		// 		// if (distance < 0.1) {
		// 		// 	setIsMoving(false);
		// 		// } else {
		// 		// 	// Lakukan pergerakan dengan kecepatan tertentu
		// 		// 	ref.current.position.add(direction.multiplyScalar(delta));
		// 		// }

		// 		// Update camera to follow the mesh with an offset
		// 		const cameraOffset = new THREE.Vector3(0, 5, -10);
		// 		const newCameraPosition = ref.current.position
		// 			.clone()
		// 			.add(cameraOffset);
		// 		camera.position.lerp(newCameraPosition, 0.1);
		// 		camera.lookAt(ref.current.position);

		// 		// Update mesh rotation
		// 		// const currentRotation = ref.current.rotation;
		// 		// const rotationDifferenceX = Math.abs(
		// 		// 	currentRotation.x - targetRotation.x
		// 		// );
		// 		// const rotationDifferenceY = Math.abs(
		// 		// 	currentRotation.y - targetRotation.y
		// 		// );
		// 		// const rotationDifferenceZ = Math.abs(
		// 		// 	currentRotation.z - targetRotation.z
		// 		// );
		// 		// const tolerance = 0.01; // tolerance value

		// 		// if (rotationDifferenceX > tolerance) {
		// 		// 	currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
		// 		// }
		// 		// if (rotationDifferenceY > tolerance) {
		// 		// 	currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;
		// 		// }
		// 		// if (rotationDifferenceZ > tolerance) {
		// 		// 	currentRotation.z += (targetRotation.z - currentRotation.z) * 0.1;
		// 		// }
		// 	}
		// } else {
		// 	// animasi awal
		// 	scene.position.set(0, 0, -5);
		// 	scene.rotation.x = MathUtils.degToRad(0);
		// 	ref.current.scale.set(0.03, 0.03, 0.03);
		// 	ref.current.position.set(0, -8, 2);
		// ref.current.rotation.x = MathUtils.radToDeg(0.001);
		// 	ref.current.rotation.y = MathUtils.radToDeg(-0.3);
		// }
	});

	return (
		<mesh
			ref={ref}
			scale={[0.003, 0.003, 0.003]}
			position={[-5, 2, -1]}
			rotation={[0, 0, 0]}
		>
			<primitive object={scene} />
		</mesh>
	);
};

export default Bird;
