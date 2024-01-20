import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export default function Camera(props) {
    const { camera } = useThree();
    let d=20;
    camera.left = -d*props.aspect;
    camera.right = d*props.aspect;
    camera.top = d;
    camera.bottom = -d;
    camera.position.y = 1+props.yaxis;
  
    useEffect (() => {
      camera.position.set(1,1,1);
      camera.lookAt(0,0,0);
    }, []);
  
  }
   