import { useRef, useState } from "react";
import { GridHelper } from "three";
import { useFrame } from "@react-three/fiber";

export default function Box(props) {
  const { position, scale, color, wireframe } = props;
  const [direction, setDirection] = useState(1);
  const { axis } = props;

  const mesh = useRef();

  if (props.state === "top") {
    useFrame(() => {
      if (axis === "x") {
        mesh.current.position.x += 0.01 * direction;
        props.setPos([mesh.current.position.x, mesh.current.position.y, mesh.current.position.z]);
        if (mesh.current.position.x > 2 || mesh.current.position.x < -2) {
          setDirection(direction * -1);
        }
      }

      if (axis === "z") {
        mesh.current.position.z += 0.02 * direction;
        props.setPos([mesh.current.position.x, mesh.current.position.y, mesh.current.position.z]);
        if (mesh.current.position.z > 2 || mesh.current.position.z < -2) {
          setDirection(direction * -1);
        }
      }
    });
  }

  return (
    <mesh position={position} scale={scale} ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial color={color} wireframe={wireframe} />
    </mesh>
  );
}
