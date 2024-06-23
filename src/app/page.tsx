'use client';

import { Loader } from '@/components/Loader';
import Bird from '@/models/Bird';
import Island from '@/models/Island';
import Plane from '@/models/Plane';
import Sky from '@/models/Sky';
import { Canvas, Euler, Vector3 } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';

const adjustIslandForScreenSize = () => {
	let screenPosition: [number,number,number] = [0, -6.5, -43];
	let rotation: [number,number,number] = [0.1, 4.7, 0];
	let screenScale: [number,number,number] = [1, 1, 1];

	if (typeof window !== 'undefined') {
		if (window.innerWidth < 768) {
			screenScale = [0.9, 0.9, 0.9];
		} else {
			screenScale = [1, 1, 1];
		}
	}

	return [screenScale, screenPosition, rotation];
};
const adjustPlaneForScreenSize = () => {
	let screenPosition: [number, number, number] = [0, 0, 0];
	let	screenScale: [number, number, number] = [0, 0, 0];

	if (typeof window !== 'undefined') {
		if (window.innerWidth < 768) {
			screenScale = [1.5, 1.5, 1.5];
			screenPosition = [0, -1.5, 0];
		} else {
			screenScale = [1, 1, 1];
			screenPosition = [0, -4, -4];
		}
	}

	return [screenScale, screenPosition];
};

const Home = () => {
	const [islandConfig, setIslandConfig] = useState(adjustIslandForScreenSize);
	const [planeConfig, setPlaneConfig] = useState(adjustPlaneForScreenSize);
	const [isRotating, setIsRotating] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIslandConfig(adjustIslandForScreenSize());
			setPlaneConfig(adjustPlaneForScreenSize());
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const [islandScale, islandPosition, islandRotation] = islandConfig;
	const [planeScale, planePosition] = planeConfig;

	return (
		<section className="h-screen w-full relative">
			{/* <div className="absolute top-28 left-0 right-0 z-10 flex justify-center items-center">POPUP</div> */}
			<Canvas
				className={`${
					isRotating ? 'cursor-grabbing' : 'cursor-grab'
				} w-full h-screen bg-transparent`}
				camera={{ near: 0.1, far: 1000 }}
			>
				<Suspense fallback={<Loader />}>
					<directionalLight position={[1, 1, 1]} intensity={2} />
					<ambientLight intensity={0.5} />
					<spotLight />
					<hemisphereLight
						intensity={1}
						groundColor="#000000"
						color="#b1e1ff"
					/>
					<Bird />
					<Sky />
					<Island
						setIsRotating={setIsRotating}
						isRotating={isRotating}
						scale={islandScale}
						rotation={islandRotation}
						position={islandPosition}
					/>
					<Plane
						isRotating={isRotating}
						scale={planeScale}
						position={planePosition}
						rotation={[0, 20, 0]}
					/>
				</Suspense>
			</Canvas>
		</section>
	);
};

export default Home;
