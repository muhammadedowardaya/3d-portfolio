import { useGLTF } from "@react-three/drei";

const Sky = () => {
    const {scene} = useGLTF('/3d/sky.glb');
    return (
        <mesh>
            <primitive object={scene} />
        </mesh>
    )
}

export default Sky;