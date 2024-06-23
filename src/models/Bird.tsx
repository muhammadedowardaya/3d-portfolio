import { useGLTF } from "@react-three/drei";

const Bird = () => {
    const {scene,animations} = useGLTF('/3d/bird.glb');
    return (
        <mesh>
            <primitive object={scene} />
        </mesh>
    )
}

export default Bird;