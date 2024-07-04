import { useFrame, useThree } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import { Mesh, Vector3 } from 'three';

const FollowCamera = ({
	targetRef,
}: {
	targetRef: MutableRefObject<Mesh | null>;
}) => {
	const { camera } = useThree();

	useFrame(() => {
		if (targetRef.current) {
			// Dapatkan posisi objek target
			const targetPosition = targetRef.current.position;

			// Atur posisi kamera untuk mengikuti objek dengan jarak tertentu
			camera.position.lerp(
				new Vector3(
					targetPosition.x,
					targetPosition.y + 5,
					targetPosition.z + 10
				),
				0.1
			);

			// Atur agar kamera selalu melihat ke objek
			camera.lookAt(targetPosition);
		}
	});

	return null;
};

export default FollowCamera;
