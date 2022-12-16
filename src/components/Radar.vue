<template>
	<div class="razar">
  <div class="ringbase ring1"></div>
  <div class="ringbase ring2"></div>
  <div class="pulse"></div>
  <div class="pointer">
    <div></div>
  </div>
  <div class="dot pos1"></div>
  <div class="dot pos2"></div>
  <div class="dot pos3"></div>
</div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
	name: "Radar",
	components: {
	},
  });
  </script>

  <style>
body {
  background-color: #333;
  padding: 50px;
}

.razar {
  float:left;
  position:relative;
  width:70px;
  height:70px;
  background-size: 100% 100%;
  border-radius:35px;
  box-shadow:0 1px 1px 0 rgba(0,0,0,0.4), 0 0 4px 1px rgba(0,0,0,0.2), inset 0 1px 1px 0 rgba(255,255,255,0.2), inset 0 2px 4px 1px rgba(255,255,255,0.1);
}

.pulse {
  position:absolute;
  top:0;
  left:0;
  width:70px;
  height:70px;
  border-radius:35px;
  background:#dcf48a;
  animation: pulsating 2s ease-in-out 0 infinite;
  opacity:0.0;
  z-index:5;
}

.ringbase {
  position:absolute;
  top:0;
  left:0;
  width:70px;
  height:70px;
  border-radius:35px;
  opacity:0.0;
  z-index:10;
}

.ring1 {
  box-shadow:0 0 2px 1px #50670c, inset 0 0 2px 1px #50670c;
  animation: ring 2s ease-in-out 0 infinite;
}

.ring2 {
  box-shadow:0 0 1px 0px #313e09, inset 0 0 1px 0px #313e09;
  animation: ring 2s ease-in-out 0.5s infinite;
}

@keyframes pulsating {
  0% {opacity: 0.0;}
  50% {opacity: 0.2;}
  100% {opacity: 0.0;}
}

@keyframes ring {
  0% {transform: scale(0.4, 0.4); opacity: 0.0;}
  50% {opacity: 0.6;}
  100% {transform: scale(1.1, 1.1); opacity: 0.0;}
}


.pointer {
  position: absolute;
  width: 70px;
  top: 35px;
  animation: circling 2s 0s linear infinite running;
  z-index: 20;
}

.pointer div {
  width: 49%;
  border-bottom:2px solid #000000;
}

.dot {
  opacity: 0;
  border: 3px solid #000000;
  border-radius: 100%;
  position:absolute;
  animation: blink 2s ease-in-out infinite running;
  z-index: 25;
}

.dot.pos1 {
  left:10px;
  top:38px;
}

.dot.pos2 {
  left:40px;
  top:18px;
  animation-delay: 0.6s;
}

.dot.pos3 {
  right:18px;
  bottom:4px;
  animation-delay: 1.3s;
}

@keyframes circling {
  0% {transform: rotate(0deg);}
  50% {transform: rotate(180deg);}
  100% {transform: rotate(360deg);}
}

@keyframes blink {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
</style>