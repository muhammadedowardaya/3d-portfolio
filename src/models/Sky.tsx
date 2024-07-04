/* eslint-disable react/no-unknown-property */
'use client';

import React, { useEffect, useRef } from 'react';

import { useAnimations, useGLTF } from '@react-three/drei';
import { MeshProps, useFrame } from '@react-three/fiber';
import { MathUtils, Mesh } from 'three';

interface SkyProps extends MeshProps {
	isStarting: boolean;
	isRotating: boolean;
	playAnimation: boolean;
	getIslandRotation: number;
}

const Sky: React.FC<SkyProps> = ({
	isStarting,
	isRotating,
	playAnimation,
	getIslandRotation,
}) => {
	const { scene } = useGLTF('/3d/sky.glb');
	const ref = useRef<Mesh>(null!);

	useEffect(() => {}, [isStarting]);

	useFrame((_, delta) => {
		if (playAnimation) {
			if (isRotating) {
                
				// ref.current.rotation.y += 0.15 * delta;
				// ref.current.rotation.y = -getIslandRotation / 2;
				// Dapatkan rotasi saat ini dan rotasi target
				const currentRotation = ref.current.rotation.y;
				const targetRotation = -getIslandRotation * 50;

                // console.info(MathUtils.lerp(
				// 	currentRotation,
				// 	targetRotation,
				// 	0.05
				// ))

				// Gunakan lerp untuk secara bertahap mengubah rotasi
				ref.current.rotation.y = MathUtils.lerp(
					0,
					targetRotation,
					0.01
				);
			}
		}
	});

	return (
		<mesh position={[0, 0, 0]} rotation={[0,0,0]} ref={ref}>
			<primitive object={scene} />
		</mesh>
	);
};

export default Sky;
