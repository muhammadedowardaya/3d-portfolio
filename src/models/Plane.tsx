import React, { useEffect, useRef, useState } from 'react';

import { Html, Text3D, useAnimations, useGLTF } from '@react-three/drei';
import { MeshProps, useFrame, useThree } from '@react-three/fiber';

import {
	Group,
	LoopRepeat,
	Material,
	MathUtils,
	Mesh,
	Quaternion,
	Vector3,
} from 'three';
import { useControls } from 'leva';
import { ForwardRefComponent } from '@react-three/drei/helpers/ts-utils';
import { HtmlProps } from '@react-three/drei/web/Html';
import Card3D from '@/components/Card3D';
interface PlaneProps extends MeshProps {
	isRotating: boolean;
	isStarting: boolean;
	playAnimation: boolean;
	islandRef: React.RefObject<Group>;
	getPlaneRef: (ref: Mesh) => void;
}

const Plane: React.FC<PlaneProps> = ({
	isRotating,
	playAnimation,
	islandRef,
	getPlaneRef,
	...props
}) => {
	const ref = useRef<Mesh>(null!);
	const angleRef = useRef(0);
	const { scene, animations } = useGLTF('/3d/helicopter.glb');
	const { actions, mixer } = useAnimations(animations, ref);

	const [isShow, setIsShow] = useState(false);
	const [isTextHover, setIsTextHover] = useState(false);
	const [currentStage, setCurrentStage] = useState(0);

	const { camera } = useThree();
	// const cameraOffset = new Vector3(cameraX, cameraY, cameraZ);

	const stageRefs = useRef<Group[]>(Array(5).fill(''));

	const stages = 5;
	const radius = 30;
	const stageDistance = (Math.PI * 2 * radius) / stages; // Distance between stages

	const { rotationX, rotationY, rotationZ } = useControls({
		rotationX: {
			value: 0,
		},
		rotationY: {
			value: 0,
		},
		rotationZ: {
			value: 0,
		},
	});

	useEffect(() => {
		if (islandRef.current) {
			for (let i = 0; i < stages; i++) {
				const angle = (i / stages) * Math.PI * 2;
				const x = islandRef.current.position.x + radius * Math.cos(angle);
				const z = islandRef.current.position.z + radius * Math.sin(angle);
				const position = new Vector3(x, 0, z);
				if (!stageRefs.current[i]) {
					const stageGroup = new Group();
					stageGroup.position.copy(position);
					stageRefs.current[i] = stageGroup;
				} else {
					stageRefs.current[i]?.position.copy(position);
				}
			}
		}
	}, [islandRef.current]);

	useEffect(() => {
		if (ref.current) {
			getPlaneRef(ref.current);

			if (islandRef.current) {
				// Menggunakan lookAt untuk mengatur orientasi umum
				ref.current.lookAt(islandRef.current.position);
			}
			// Menambahkan rotasi tambahan pada sumbu x menggunakan quaternion
			const additionalRotation = new Quaternion();
			additionalRotation.setFromAxisAngle(
				new Vector3(0, 1, 0),
				MathUtils.degToRad(-45)
			); // Rotasi 45 derajat
			ref.current.quaternion.multiplyQuaternions(
				ref.current.quaternion,
				additionalRotation
			);

			const cameraOffset = new Vector3(0, 3, -10);

			// Menghitung posisi kamera agar selalu berada pada offset tertentu dari lingkaran yang mengorbit
			const worldPosition = ref.current.position
				.clone()
				.add(cameraOffset.clone().applyQuaternion(ref.current.quaternion));
			camera.position.lerp(worldPosition, 0.05);
		}
	}, [ref.current]);

	useEffect(() => {
		if (!ref.current) return;
		if (actions) {
			const action = actions['rotor|object.029Action.001'];
			if (action) {
				action.reset().setLoop(LoopRepeat, Infinity).play();
				action.time = 4;
			}
		}
	}, [actions, mixer]);

	const getDistanceTo = (number: number) => {
		return camera.position.distanceTo(stageRefs.current[number].position);
	};

	useFrame(({ clock }, delta) => {
		// Update stage positions and orientations
		if (islandRef.current) {
			for (let i = 0; i < stages; i++) {
				const angle = (i / stages) * Math.PI * 2 + angleRef.current;
				const x = islandRef.current.position.x + radius * Math.cos(angle);
				const z = islandRef.current.position.z + radius * Math.sin(angle);
				const position = new Vector3(x, 6, z);
				stageRefs.current[i]?.position.lerp(position, 0.1);
				stageRefs.current[i]?.lookAt(islandRef.current.position);

				// if(stageRefs.current[i]){
				//     if(camera.position.distanceTo(stageRefs.current[i].position) < 40 && camera.position.distanceTo(stageRefs.current[0].position) > 20 ){
				//         setIsShow(true);
				//     }else{
				//         setIsShow(false);
				//     }
				// }

				// switch(true){
				//     case
				// }
			}
		}

		if (actions) {
			const action = actions['rotor|object.029Action.001'];
			if (action) {
				if (Math.ceil(action.time) >= 7) {
					action.time = 4;
				}

				if (isRotating) {
					action.setEffectiveTimeScale(10);
				} else {
					action.setEffectiveTimeScale(2);
				}
			}

			if (getDistanceTo(0) < 50 && getDistanceTo(0) > 20) {
				setCurrentStage(1);
			} else if (getDistanceTo(1) < 50 && getDistanceTo(1) > 20) {
				setCurrentStage(2);
			} else if (getDistanceTo(2) < 50 && getDistanceTo(2) > 20) {
				setCurrentStage(3);
			} else if (getDistanceTo(3) < 50 && getDistanceTo(3) > 20) {
				setCurrentStage(4);
			} else if (getDistanceTo(4) < 50 && getDistanceTo(4) > 20) {
				setCurrentStage(5);
			}

			if (isRotating) {
				// Mengatur posisi lingkaran yang mengorbit
				if (ref.current && islandRef.current) {
					const speed = 0.5; // kecepatan rotasi
					const radius = 40; // jarak dari lingkaran pusat

					// Update sudut rotasi
					angleRef.current += speed * delta;

					// Menghitung posisi lingkaran yang mengorbit menggunakan fungsi trigonometri
					const x =
						islandRef.current.position.x + radius * Math.cos(angleRef.current);
					const z =
						islandRef.current.position.z + radius * Math.sin(angleRef.current);

					ref.current.position.lerp(new Vector3(-x, 0, z), 0.1);

					// Menggunakan lookAt untuk mengatur orientasi umum
					ref.current.lookAt(islandRef.current.position);

					// Menambahkan rotasi tambahan pada sumbu x menggunakan quaternion
					const additionalRotation = new Quaternion();
					additionalRotation.setFromAxisAngle(
						new Vector3(0, 1, 0),
						MathUtils.degToRad(-45)
					); // Rotasi 45 derajat

					ref.current.quaternion.multiplyQuaternions(
						ref.current.quaternion,
						additionalRotation
					);

					const cameraOffset = new Vector3(-6, 3, -15);

					// Menghitung posisi kamera agar selalu berada pada offset tertentu dari lingkaran yang mengorbit
					const worldPosition = ref.current.position
						.clone()
						.add(cameraOffset.clone().applyQuaternion(ref.current.quaternion));
					camera.position.lerp(worldPosition, 0.05);

					// // Mengatur agar kamera selalu melihat ke lingkaran yang mengorbit
					// camera.lookAt(ref.current.position);
				}
			} else {
				if (islandRef.current) {
					// Menggunakan lookAt untuk mengatur orientasi umum
					ref.current.lookAt(islandRef.current.position);
				}
				// Menambahkan rotasi tambahan pada sumbu x menggunakan quaternion
				const additionalRotation = new Quaternion();
				additionalRotation.setFromAxisAngle(
					new Vector3(0, 1, 0),
					MathUtils.degToRad(-45)
				); // Rotasi 45 derajat
				ref.current.quaternion.multiplyQuaternions(
					ref.current.quaternion,
					additionalRotation
				);

				const cameraOffset = new Vector3(0, 3, -10);

				// Menghitung posisi kamera agar selalu berada pada offset tertentu dari lingkaran yang mengorbit
				const worldPosition = ref.current.position
					.clone()
					.add(cameraOffset.clone().applyQuaternion(ref.current.quaternion));
				camera.position.lerp(worldPosition, 0.05);
				// Mengatur agar kamera selalu melihat ke lingkaran yang mengorbit

				ref.current.position.y = 0.5 * Math.sin(clock.getElapsedTime() * 1);
			}
			camera.lookAt(ref.current.position.x, 6, ref.current.position.z);
		}

		// if (islandRef.current && ref.current) {
		// 	ref.current.position.y = 0.5 * Math.sin(clock.getElapsedTime() * 1);
		// }
	});

	const renderContent: Record<number, React.ReactNode> = {
		1: (
			<Html>
				<h1 className="sm:text-xl sm:leading-snug text-center py-4 px-8 text-white mx-5">
					Hi, I am <span className="font-semibold">Muhammad Edo Wardaya</span>
				</h1>
			</Html>
		),
		2: (
			<Html>
				<h1 className="sm:text-xl sm:leading-snug text-center py-4 px-8 text-white mx-5">
					Project
				</h1>
			</Html>
		),
		3: (
			<Html>
				<h1 className="sm:text-xl sm:leading-snug text-center py-4 px-8 text-white mx-5">
					Project
				</h1>
			</Html>
		),
		4: (
			<Html>
				<h1 className="sm:text-xl sm:leading-snug text-center py-4 px-8 text-white mx-5">
					Project
				</h1>
			</Html>
		),
		5: (
			<Html>
				<h1 className="sm:text-xl sm:leading-snug text-center py-4 px-8 text-white mx-5">
					Project
				</h1>
			</Html>
		),
	};

	const InfoBox = ({
		text,
		link,
		btnText,
	}: {
		text: string;
		link: string;
		btnText: string;
	}) => {
		<div className="info-box">{text}</div>;
	};

	return (
		<>
			<mesh {...props} ref={ref}>
				<primitive object={scene} />
			</mesh>
			{stageRefs.current.map((stage, index: number) => (
				<group
					key={index}
					ref={(el) => {
						if (el) stageRefs.current[index] = el;
					}}
					onPointerEnter={() => setIsTextHover(true)}
					onPointerLeave={() => setIsTextHover(false)}
				>
					<Card3D
						isShow={index + 1 === currentStage ? true : false}
						// isShow={true}
						// rotation={[rotationX, rotationY, rotationZ]}
						position={[8, 0, -6]}
						rotation={[-0.49, 2, 0]}
						title={`Judul ke ${index + 1}`}
						description="Ini adalah contoh dari deskripsi kartu"
						link="#"
					/>
				</group>
			))}
		</>
	);
};

export default Plane;

// ref.current.rotation.y = MathUtils.degToRad(rotationY);
// ref.current.rotation.z = MathUtils.degToRad(rotationZ);
// ref.current.rotation.x = MathUtils.degToRad(rotationX);
// camera.position.x = cameraX;
// camera.position.y = cameraY;
// camera.position.z = cameraZ;

{
	/* <Text3D
						font="/fonts/Bebas_Neue_Regular.json"
						size={3}
						height={0.01}
						// rotation={[rotationX, rotationY, rotationZ]}
						curveSegments={12}
						bevelEnabled
						bevelThickness={0.2}
						// bevelThickness={0.1}
						bevelSize={0.05}
						bevelOffset={0}
						bevelSegments={5}
						
						rotation={[-0.52, -4, 0]}
					>
						Project ke {index + 1}
						<meshStandardMaterial
							attach="material"
							color={`${isTextHover ? '#A7E6FF' : '#F4CE14'}`}
						/>
					</Text3D> */
}
