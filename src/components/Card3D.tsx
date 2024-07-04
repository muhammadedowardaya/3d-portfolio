import React, { forwardRef } from 'react';
import { Canvas, MeshProps, extend } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';

// Extend Three.js objects to be available in the JSX syntax
extend({ OrbitControls, Html });
interface Card3DProps extends MeshProps {
	title: string;
	description: string;
	link: string;
    isShow?:boolean;
}

const Card3D = forwardRef<Mesh, Card3DProps>(
	({ position, title, description, link, isShow, ...props }, ref) => (
		<mesh ref={ref} position={position} {...props}>
			{/* <boxGeometry args={[8, 2, 0.1]} /> */}
			{/* <meshStandardMaterial color="lightgray" /> */}
			<Html transform occlude position={[0, 0, 0.1]}>
				<div className={`p-4 bg-white shadow-lg rounded-lg hover:shadow-neon-yellow transition-all duration-100 ${isShow ? 'scale-100' : 'scale-0'}`}>
					<img
						src="/path-to-your-image.jpg"
						alt="Image"
						className="w-full h-32 object-cover rounded-md"
					/>
					<h2 className="mt-4 text-xl font-bold">{title}</h2>
					<p className="mt-2 text-sm text-gray-600">{description}</p>
					<a
						href={link}
						className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md"
					>
						Link
					</a>
				</div>
			</Html>
		</mesh>
	)
);

export default Card3D;
