import { useGLTF } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';

interface PlaneProps extends MeshProps {
	isRotating: boolean;
}

const Plane: React.FC<PlaneProps> = ({ isRotating, ...props }) => {
	const { scene, animations } = useGLTF('/3d/plane.glb');
	return (
		<mesh {...props}>
			<primitive object={scene} />
		</mesh>
	);
};

export default Plane;
