// import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View , Dimensions, Pressable } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import Box from './Box';
import Camera from './Camera';
import { GridHelper } from 'three';

export default function App() {

  const [screenSize, setScreenSize] = useState([0,0]);
  const [box, setBox] = useState([]);
  const [top, setTop] = useState({})
  const [yaxis, setYaxis] = useState(0);
  const [moveAxis, setMoveAxis] = useState("x");

  useEffect(() => {
    setBox([{
      position: [0, 0, 0],
      scale: [1, 0.3, 1],
      color: '#fff',
      axis: 'x',
      state:"bottom"
    }]);
    setTop({
      position: [0, 0.3, 0],
      scale: [1, 0.3, 1],
      color: '#ff9',
      axis: 'x',
      state:"top"
    });
  }
  , []);

  useEffect(() => {
    if (top.position){
    setYaxis(top.position[1]);
    }
  }
  , [top]);

  console.log(box);


  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    setScreenSize([width, height]);
  }
  , []);

  function handleClick(e) {
    changeState();
    placeBlock();
    createBlock();

    setMoveAxis(moveAxis === "x" ? "z" : "x");

  }

  function changeState(){
    setBox((box) => box.map((b) => {
      if (b.state === "top") {
        return {
          ...b,
          state: "bottom"
        }
      }
      else{
        console.log(b.state);
      }
      return b; 
    }
    ));
  }

  function createBlock(){
    const newBlock = {
      position: [top.position[0], top.position[1]+0.3, top.position[2]],
      scale: [ top.scale[0], top.scale[1], top.scale[2] ],
      color:`#${Math.floor(Math.random() * 16777215).toString(16)}`
    }
    setTop(newBlock);
  }

  function placeBlock(){
    setBox([...box, top])
  }



  return (
    <>
    <View style={styles.container}>
    <Pressable onPress={handleClick}>
      <Text style={styles.Button}>Start</Text>
    </Pressable>
    </View>
      <Canvas orthographic camera={{zoom:80,position:[0,0,5],near:-1000,far:1000}} >
        <Camera aspect={screenSize[0]/screenSize[1]} yaxis={yaxis}/> 
        <ambientLight />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        {
          box.map((b) => (
            <Box position={b.position} scale={b.scale} color={b.color} onClick={handleClick}/>
          ))
        } 
        {
          top.position && <Box position={top.position} scale={top.scale} color={top.color} axis={moveAxis} state="top" />
        }
      </Canvas>
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 0.5, 
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  Button: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#000',
    borderWidth: 2,
  },
});
