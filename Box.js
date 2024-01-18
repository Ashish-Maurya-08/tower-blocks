import { useRef, useState } from "react";
import { GridHelper } from "three";
import { useFrame } from "@react-three/fiber";

export default function Box(props) {
  const { position, scale, color, getPos , setCurrent } = props;
  const [direction, setDirection] = useState(1);
  const { axis } = props;
  const mesh = useRef();
  
  useFrame(()=>{
    if (props.state==="top"){
      if (axis==="x"){
        mesh.current.position.x += direction*0.04
        if (mesh.current.position.x > 1.5 || mesh.current.position.x < -1.5){
          setDirection(direction* -1)
        }
      }
      else if (axis==="z"){
        mesh.current.position.z += direction*0.04
        if (mesh.current.position.z > 1.5 || mesh.current.position.z < -1.5){
          setDirection(direction* -1)
        }
      }
    }
  })


  if (mesh.current && getPos){
    const {x, y, z} = mesh.current.position
    setCurrent([x, y, z])
  }

  return (
    <mesh position={position} scale={scale} ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial color={color} />
    </mesh>
  );
}
