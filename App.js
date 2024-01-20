import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import Box from "./Box";
import Camera from "./Camera";



export default function App() {

  // States

  const [screenSize, setScreenSize] = useState([0, 0]);
  const [box, setBox] = useState([]);
  const [top, setTop] = useState({});
  const [yaxis, setYaxis] = useState(0);
  const [moveAxis, setMoveAxis] = useState("x");
  const [movingPosition, setMovingPosition] = useState([]);
  const [getPos, setGetPos] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Use Effects
  
  // Initial Render
  useEffect(() => {
    restart();
  }, []);


  // Update Camera Position

  useEffect(() => {
    if (top.position) {
      setYaxis(top.position[1]);
    }
  }, [top]);
  
  // Get Screen Size

  useEffect(() => {
    const { width, height } = Dimensions.get("window");
    setScreenSize([width, height]);
  }, []);


  // Get Moving Position

  useEffect(() => {
    if (getPos){
      setGetPos(false);
    }
  }, [getPos]);


  // Check if block is placed

  useEffect(() => {
    const overLap = getOverLap();
    if (movingPosition.length > 0){
      if ((moveAxis==='x' && top.scale[0]-Math.abs(overLap) > 0) || (moveAxis==='z' && top.scale[2]-Math.abs(overLap) > 0)) {
        placeBlock(overLap);
        setPlaced(true);
      }
      else{
        alert("Game Over\nScore: "+(box.length-1)+"\n\nClick OK to restart");
        restart();
        return;
      }

    }
  }
  , [movingPosition]);



  // Create new block

  useEffect(() => {
    if (placed){
      const overLap = getOverLap();
      createBlock(overLap);
      setMoveAxis(moveAxis === "x" ? "z" : "x");
      setPlaced(false);
    }

  }
  , [placed]);


  // Functions

  // Restart Game

  function restart() {
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
    setMoveAxis("x");
  } 

  // Set Moving Position

  function setCurrent(position){
    setMovingPosition(position);
  }

  // Get Overlap

  function getOverLap(){
    if (movingPosition.length > 0){
      if (moveAxis==='x'){
        return top.position[0]-movingPosition[0];
      }
      else{
        return top.position[2]-movingPosition[2];
      }
    }
  }


  // Handle Click

  function handleClick(e) {
    setGetPos(true);
  }

  // Create new block

  function createBlock(overLap) {

    if (moveAxis === "x") {
      const newBlock = {
        position: [top.position[0]-(overLap/2), top.position[1]+0.3, top.position[2]],
        scale: [top.scale[0]-Math.abs(overLap), top.scale[1], top.scale[2]],
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
      setTop(newBlock);
    }
    else if(moveAxis === "z") {
      const newBlock = {
        position: [top.position[0], top.position[1]+0.3,top.position[2]-(overLap/2)],
        scale: [top.scale[0], top.scale[1],top.scale[2]-Math.abs(overLap)],
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
      setTop(newBlock);
    }
  }


  // Place new block

  function placeBlock(overLap) {
    if (moveAxis === "z") {
      const newBlock = {
        position: [top.position[0], top.position[1],top.position[2]-(overLap/2)],
        scale: [
          top.scale[0],
          top.scale[1],
          top.scale[2]-Math.abs(overLap),
        ],
        color: top.color,
      };
      setBox([...box, newBlock]);
    } 
    else if(moveAxis === "x") {
      const newBlock = {
        position: [top.position[0]-(overLap/2), top.position[1], top.position[2]],
        scale: [
          top.scale[0]-Math.abs(overLap),
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
    {/* UI Upper half */}


      <View style={styles.container}>
          <Text style={styles.Button}>Tower Block</Text>
      <Text style={{color:"#fff", fontSize:20, fontWeight:"bold", position:"absolute", top:10, left:10}}>Score: {box.length-1}</Text>
      </View>


      {/* UI Lower half */}

      <Canvas
        orthographic
        camera={{ zoom: 100, position: [0, 0, 5], near: -1000, far: 1000 }}
        style={styles.canvas}
        onTouchStart={handleClick}
        onPointerDown={handleClick}
      >
        <Camera aspect={screenSize[0]/screenSize[1]} yaxis={yaxis} />
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
            setCurrent={setCurrent}
            getPos={getPos}
          />
        )}
      </Canvas>
      <StatusBar style="light" />
    </>
  );
}



// Styles

const styles = StyleSheet.create({
  container: {
    flex: 0.3,
    flexDirection: "row",
    backgroundColor: "#25292e",
    alignItems:"center",
    justifyContent: "center",
  },
  
  Button: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
  },
  canvas: {
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
});
