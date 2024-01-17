// import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import Box from "./Box";
import Camera from "./Camera";

export default function App() {
  const [screenSize, setScreenSize] = useState([0, 0]);
  const [box, setBox] = useState([]);
  const [top, setTop] = useState({});
  const [yaxis, setYaxis] = useState(0);
  const [moveAxis, setMoveAxis] = useState("x");
  const [movingPosition, setMovingPosition] = useState([0, 0, 0]);

  useEffect(() => {
    setBox([
      {
        position: [0, 0, 0],
        scale: [1, 0.3, 1],
        color: "#fff",
      },
    ]);
    setTop({
      position: [0, 0.3, 0],
      scale: [1, 0.3, 1],
      color: "#ff9",
    });
  }, []);

  useEffect(() => {
    if (top.position) {
      setYaxis(top.position[1]);
    }
  }, [top]);

  useEffect(() => {
    const { width, height } = Dimensions.get("window");
    setScreenSize([width, height]);
  }, []);

  function handleClick(e) {
    console.log("click");
    console.log(top.position);
    console.log(movingPosition);
    const currentPosition = movingPosition;
    if (top.scale[0]-Math.abs(currentPosition[0]) > 0 && top.scale[2]-Math.abs(currentPosition[2]) > 0) {
      placeBlock(currentPosition);
      createBlock(currentPosition);
    }
    else{
      console.log(top.scale[0]-Math.abs(currentPosition[0]));
      console.log(top.scale[0],Math.abs(currentPosition[0]));
      console.log(top.scale[2],Math.abs(currentPosition[2]));
      console.log(top.scale[2]-Math.abs(currentPosition[2]));
      console.log("Game Over");
      setTop({});
    }
    setMoveAxis(moveAxis === "x" ? "z" : "x");
  }

  function createBlock(currentPosition) {

    if (moveAxis === "x") {
      const newBlock = {
        position: [top.position[0]+currentPosition[0]/2, top.position[1]+0.3, top.position[2]],
        scale: [top.scale[0]-Math.abs(currentPosition[0]), top.scale[1], top.scale[2]],
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
      setTop(newBlock);
    }
    else if(moveAxis === "z") {
      const newBlock = {
        position: [top.position[0], top.position[1]+0.3, top.position[2]+currentPosition[2]/2],
        scale: [top.scale[0], top.scale[1],top.scale[2]-Math.abs(currentPosition[2])],
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
      setTop(newBlock);
    }
  }


  function placeBlock(currentPosition) {
    if (moveAxis === "z") {
      const newBlock = {
        position: [top.position[0], top.position[1], top.position[2]+currentPosition[2]/2],
        scale: [
          top.scale[0],
          top.scale[1],
          top.scale[2]-Math.abs(currentPosition[2]),
        ],
        color: top.color,
      };
      setBox([...box, newBlock]);
    } 
    else if(moveAxis === "x") {
      const newBlock = {
        position: [(currentPosition[0]/2)+top.position[0], top.position[1], top.position[2]],
        scale: [
          top.scale[0]-Math.abs(currentPosition[0]),
          top.scale[1],
          top.scale[2],
        ],
        color: top.color,
      };
      setBox([...box, newBlock]);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={handleClick}>
          <Text style={styles.Button}>Start</Text>
        </Pressable>
      </View>
      <Canvas
        orthographic
        camera={{ zoom: 80, position: [0, 0, 5], near: -1000, far: 1000 }}
      >
        <Camera aspect={screenSize[0] / screenSize[1]} yaxis={yaxis} />
        <ambientLight />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        {box.map((b) => (
          <Box
            position={b.position}
            scale={b.scale}
            color={b.color}
            onClick={handleClick}
          />
        ))}
        {top.position && (
          <Box
            position={top.position}
            scale={top.scale}
            color={top.color}
            axis={moveAxis}
            state="top"
            setPos={setMovingPosition}
          />
        )}
      </Canvas>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  Button: {
    color: "#000",
    fontSize: 25,
    fontWeight: "bold",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: "#000",
    borderWidth: 2,
  },
});
