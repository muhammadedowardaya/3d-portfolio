'use client';

export default function Scene() {
	return (
		<mesh>
            <directionalLight />
            <ambientLight />
            <pointLight />
            <spotLight />
            <hemisphereLight />
			<boxGeometry />
			<meshBasicMaterial color="red" />
		</mesh>
	);
}
