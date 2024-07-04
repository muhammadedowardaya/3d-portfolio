'use client';

import FollowCamera from '@/components/FollowCamera';
import HomeInfo from '@/components/HomeInfo';
import { Loader } from '@/components/Loader';
import Bird from '@/models/Bird';
import Island from '@/models/Island';
import Plane from '@/models/Plane';
import Sky from '@/models/Sky';
import { Box, Circle, Line, OrbitControls, Sphere } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Leva, useControls } from 'leva';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Box3, Camera, Group, Mesh, Vector3 } from 'three';

const adjustIslandForScreenSize = () => {
	// const screenPosition: [number, number, number] = [0, -6.5, -43];
	const screenPosition: [number, number, number] = [0, -11, -48];
	const rotation: [number, number, number] = [0.1, 4.7, 0];
	// const rotation: [number, number, number] = [0.1, 8, 0];
	let screenScale: [number, number, number] = [1, 1, 1];

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
	let screenScale: [number, number, number] = [0, 0, 0];

	// if (typeof window !== 'undefined') {
	// 	if (window.innerWidth < 768) {
	// 		screenScale = [1.5, 1.5, 1.5];
	// 		screenPosition = [0, -1.5, 0];
	// 	} else {
	// 		screenScale = [3, 3, 3];
	// 		screenPosition = [0, -4, -4];
	// 	}
	// }

	if (typeof window !== 'undefined') {
		if (window.innerWidth < 768) {
			screenScale = [0.008, 0.008, 0.008];
			screenPosition = [0, -2, 0];
		} else {
			screenScale = [0.01, 0.01, 0.01];
			screenPosition = [0, -1, 0];
		}
	}

	return [screenScale, screenPosition];
};

const OrbitingBox = () => {
    const orbitingCircleRef = useRef<Mesh>(null);
    const boxRef = useRef<Mesh>(null);
    const angleRef = useRef(0);
    const { camera } = useThree();
  
    // Offset untuk kamera relatif terhadap mesh berwarna merah
    const cameraOffset = new Vector3(0, 0, -3); // Adjust this to position camera in front of red box
  
    // Use frame to update position
    useFrame((state, delta) => {
      const speed = 0.5; // kecepatan rotasi
      const radius = 3; // jarak dari lingkaran pusat
  
      // Update sudut rotasi
      angleRef.current += speed * delta;
  
      // Menghitung posisi lingkaran yang mengorbit menggunakan fungsi trigonometri
      const x = radius * Math.cos(angleRef.current);
      const z = radius * Math.sin(angleRef.current);
  
      // Mengatur posisi lingkaran yang mengorbit
      if (orbitingCircleRef.current && boxRef.current) {
        orbitingCircleRef.current.position.set(x, 0, z);
        orbitingCircleRef.current.lookAt(boxRef.current.position);
  
        // Menghitung posisi kamera agar selalu berada pada offset tertentu dari lingkaran yang mengorbit
        const worldPosition = orbitingCircleRef.current.position
          .clone()
          .add(cameraOffset.clone().applyQuaternion(orbitingCircleRef.current.quaternion));
        camera.position.lerp(worldPosition, 0.05);
  
        // Mengatur agar kamera selalu melihat ke lingkaran yang mengorbit
        camera.lookAt(orbitingCircleRef.current.position);
      }
    });
  
    return (
      <>
        {/* Kotak statis di tengah */}
        <Box args={[1, 1, 1]} ref={boxRef}>
          <meshBasicMaterial attach="material" color="blue" />
        </Box>
  
        {/* Kotak yang mengelilingi kotak statis */}
        <Box ref={orbitingCircleRef} args={[0.5, 0.5, 0.5]}>
          <meshBasicMaterial attach="material" color="red" />
        </Box>
      </>
    );
  };

const Home = () => {
	const [islandConfig, setIslandConfig] = useState(adjustIslandForScreenSize);
	const [planeConfig, setPlaneConfig] = useState(adjustPlaneForScreenSize);
	const [isRotating, setIsRotating] = useState(false);
	const [isStarting, setIsStarting] = useState(false);
	const [playAnimation, setPlayAnimation] = useState(false);
	const [islandRotationValue, setIslandRotationValue] = useState<number>(0);
	const [currentStage, setCurrentStage] = useState<number>(0);

	const planeRef = useRef<Mesh | null>(null);
	const islandRef = useRef<Group | null>(null);

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

	const handleStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsStarting(!isStarting);
	};

	// const { camera } = useControls({
	// 	camera: {
	// 		// 75, window.innerWidth / window.innerHeight, 0.1, 500
	// 		// value: { fov: 75, near: 0.1, far: 1000},
	// 		value: {
	// 			fov: 75,
	// 			near: 0.1,
	// 			far: 1000,
	// 		},
	// 	},
	// });

	// const { valueX, valueY, valueZ } = useControls({
	// 	valueX: {
	// 		value: 0,
	// 	},
	// 	valueY: {
	// 		value: 0,
	// 	},
	// 	valueZ: {
	// 		value: 0,
	// 	},
	// });

	// const { islandX, islandY, islandZ } = useControls({
	// 	islandX: {
	// 		value: 0,
	// 	},
	// 	islandY: {
	// 		value: 0,
	// 	},
	// 	islandZ: {
	// 		value: 0,
	// 	},
	// });

	const handleOnIslandRotating = (isIslandRotating: boolean) => {
		if (isIslandRotating) {
			setPlayAnimation(true);
		} else {
			setPlayAnimation(false);
		}
	};

	const handleGetIslandRotation = (islandRotationValue: number) => {
		setIslandRotationValue(islandRotationValue);
	};

	const handleGetMeshRefIsland = (meshRef: Group) => {
		islandRef.current = meshRef;
	};

	const handleGetPlaneRef = (meshRef: Mesh) => {
		planeRef.current = meshRef;
	};

	return (
		<section className="h-screen w-full relative">
			<Leva />
			{/* <div className="absolute top-28 left-0 right-0 z-10 flex justify-center items-center">
				{currentStage && <HomeInfo currentStage={currentStage} />}
			</div> */}
			<Canvas
				className={`
                
                w-full h-screen bg-transparent`}
				camera={{ near: 0.1, far: 1000 }}
				// camera={camera}
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
					{/* <OrbitingBox /> */}
					<Bird isStarting={isStarting} islandRef={islandRef}/>
					<Sky
						isStarting={isStarting}
						isRotating={isRotating}
						playAnimation={playAnimation}
						getIslandRotation={islandRotationValue}
					/>
					<Island
						planeRef={planeRef}
						getMeshRef={handleGetMeshRefIsland}
						isStarting={isStarting}
						setIsRotating={setIsRotating}
						isRotating={isRotating}
						scale={islandScale}
						rotation={islandRotation}
						// position={[islandX,islandY,islandZ]}
						position={islandPosition}
						onIslandRotating={handleOnIslandRotating}
						getIslandRotation={handleGetIslandRotation}
					/>
					<Plane
						islandRef={islandRef}
						isStarting={isStarting}
						isRotating={isRotating}
						scale={planeScale}
						position={planePosition}
						// position={[Math.PI * valueX, valueY, valueZ]}
						// rotation={[0,20,0]}
						rotation={[0, 0.4, 0]}
						playAnimation={playAnimation}
						getPlaneRef={handleGetPlaneRef}
					/>
				</Suspense>
				{/* <OrbitControls /> */}
			</Canvas>
			<div
				className="cursor-pointer hover:bg-white hover:text-black text-2xl fixed bottom-8 left-[50%] -translate-x-[50%] py-1 px-8 border border-white text-white font-bold"
				id='move-button'
			>
				MOVE
			</div>
		</section>
	);
};

export default Home;
