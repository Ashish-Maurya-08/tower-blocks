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
  const [status, setStatus] = useState("ready");
  const [randomOff, setRandomOff] = useState(Math.floor(Math.random() * 100));

  // Use Effects
  
  // Initial Render
  useEffect(() => {
    restart();
  }, []);

  useEffect(() => {
    restart();
    if (status==="end"){
      setStatus("ready");
    }
  },[status] );


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
        setStatus("end");
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
        scale: [1, 0.2, 1],
        color: "white"
      },
    ]);
    if (status==="start"){
      let colorOffset=getColorOffset();
      setTop({
        position: [0, 0.2, 0],
        scale: [1, 0.2, 1],
        color: `rgb(${colorOffset})`,
      });
    }
    else{
      setTop({});
    }
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

  // Get Color Offset

  function getColorOffset(){
    let Offset=box.length+randomOff;
    var r = Math.round(Math.sin(0.3 * Offset) * 55 + 200);
    var g = Math.round(Math.sin(0.3 * Offset + 2) * 55 + 200);
    var b = Math.round(Math.sin(0.3 * Offset + 4) * 55 + 200);
    let colorOffset = [r, g, b]
    return colorOffset;
  } 


  // Handle Click

  function handleClick(e) {
    if (status==="ready"){
      setStatus("start")
    }
    else if (status==="start"){
      setGetPos(true);
    }
  }

  // Create new block

  function createBlock(overLap) {
    let newColor=getColorOffset();
    console.log(newColor);

    let newBlock={
      position: [top.position[0], top.position[1]+0.2, top.position[2]],
      scale: [top.scale[0], top.scale[1], top.scale[2]],
      color: `rgb(${newColor})`,
    }

    if (moveAxis==='x'){
      newBlock.position[0] =newBlock.position[0]-(overLap/2);
      newBlock.scale[0] = newBlock.scale[0]-Math.abs(overLap);
    }
    else if(moveAxis==='z'){
      newBlock.position[2] =newBlock.position[2]-(overLap/2);
      newBlock.scale[2] = newBlock.scale[2]-Math.abs(overLap);
    }

    setTop(newBlock);
  }


  // Place new block

  function placeBlock(overLap) {

    let newBlock={
      position: [top.position[0], top.position[1], top.position[2]],
      scale: [top.scale[0], top.scale[1], top.scale[2]],
      color: top.color,
    }

    if (moveAxis === "z") {
      newBlock.position[2] =newBlock.position[2]-(overLap/2);
      newBlock.scale[2] = newBlock.scale[2]-Math.abs(overLap);
    }
    else if(moveAxis === "x") {
      newBlock.position[0] = newBlock.position[0]-(overLap/2);
      newBlock.scale[0] = newBlock.scale[0]-Math.abs(overLap);
    }

    setBox([...box, newBlock]);
  }

  return (
    <>
    {/* UI Upper half */}


      <View style={styles.container}>
          {/* <Text style={styles.Button}>Tower Block</Text> */}
      {
        status==="start" && 
      <Text style={styles.score}>{box.length-1}</Text>
      }
      {
        status==="ready" &&
        <Pressable
          style={styles.Button}
          onPress={()=>{
            setStatus("start")
            restart()
          }}
        >
          <Text style={{color:"#fff", fontSize:20, fontWeight:"bold"}}>Start</Text>
        </Pressable>
      }
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
        <directionalLight position={[0, 100, 5]} intensity={1} />
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
    height: "40%",
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
  score:{
    color:"#fff",
    fontSize: 50,
    fontWeight: "bold",
  }
});
