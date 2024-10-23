import * as THREE from 'three'; // Import the THREE.js library for 3D rendering
import { Canvas, useFrame } from '@react-three/fiber'; // Import Canvas and useFrame from React Three Fiber
import { useRef, useEffect, useState } from 'react'; // Import necessary hooks from React

// Define the shader material for the Mandelbulb
const MandelbulbShaderMaterial = {
  uniforms: {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3() },
    camPos: { value: new THREE.Vector3(0, 0, 2) },
    tilt: { value: 0 },
    pan: { value: 0 },
    power: { value: 8.0 }, // New uniform for Power
    lightPos: { value: new THREE.Vector3(0, 5, 5) }, // New uniform for light position
    lightColor: { value: new THREE.Color(1, 1, 1) }, // New uniform for light color
  },
  vertexShader: `
    varying vec2 vUv; 
    void main() {
      vUv = uv; 
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float iTime; 
    uniform vec3 iResolution; 
    uniform vec3 camPos; 
    uniform float tilt; 
    uniform float pan; 
    uniform float power; // Added Power uniform
    uniform vec3 lightPos; // Light position
    uniform vec3 lightColor; // Light color
    varying vec2 vUv; 

    const int Iterations = 12; 
    const float Bailout = 2.0; 

    float DE(vec3 pos) {
      vec3 z = pos; 
      float dr = 1.0; 
      float r = 0.0; 
      for (int i = 0; i < Iterations; i++) {
        r = length(z); 
        if (r > Bailout) break; 

        float theta = acos(z.z / r); 
        float phi = atan(z.y, z.x); 
        dr = pow(r, power - 1.0) * power * dr + 1.0; // Use animated Power

        float zr = pow(r, power); 
        theta = theta * power; 
        phi = phi * power; 

        z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
        z += pos; 
      }
      return 0.5 * log(r) * r / dr; 
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;

      // Apply pan and tilt based on the new uniforms
      float adjustedX = uv.x + pan;
      float adjustedY = uv.y + tilt;

      vec3 rayDir = normalize(vec3(adjustedX, adjustedY, -1.0));
      vec3 pos = camPos; 
      float totalDist = 0.0;
      for (int i = 0; i < 128; i++) {
        vec3 currentPos = camPos + rayDir * totalDist;
        float d = DE(currentPos);
        float distanceFromCenter = length(currentPos); 

        vec3 color = vec3(0.5 + 0.5 * sin(distanceFromCenter * 2.0 - iTime), 
                    0.1 + 0.5 * sin(distanceFromCenter * 2.0 + iTime), 
                    0.9 + 0.1 * cos(distanceFromCenter * 2.0));

        if (d < 0.001) { 
          // Calculate normal using the distance estimate
          vec3 normal = normalize(vec3(
            DE(currentPos + vec3(0.001, 0.0, 0.0)) - d,
            DE(currentPos + vec3(0.0, 0.001, 0.0)) - d,
            DE(currentPos + vec3(0.0, 0.0, 0.001)) - d
          ));

          // Light calculation
          vec3 lightDir = normalize(lightPos - currentPos);
          float diff = max(dot(normal, lightDir), 0.0);
        color = color * clamp(diff * lightColor, 0.5, 1.0); // Apply diffuse lighting

          gl_FragColor = vec4(color, 1.0); 
        //   gl_FragAlpha = 0.1;
          return; 
        }
        totalDist += d;
        if (totalDist > 100.0) break;
      }
      gl_FragColor = vec4(0.0);
    }
  `,
};

// Main component to render the Mandelbulb
export function Mandelbulb() {
  const ref = useRef(); // Create a reference for the shader material
  const [positionOffset, setPositionOffset] = useState(new THREE.Vector3(0, 0, 0));
  const [tiltTarget, setTiltTarget] = useState(0);
  const [panTarget, setPanTarget] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [pan, setPan] = useState(0);
  const speed = 0.1; // Movement speed

  // Handle keyboard movement
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w':
          setPositionOffset((prev) => prev.add(new THREE.Vector3(0, 0, -speed))); // Move forward
          break;
        case 's':
          setPositionOffset((prev) => prev.add(new THREE.Vector3(0, 0, speed))); // Move backward
          break;
        case 'a':
          setPositionOffset((prev) => prev.add(new THREE.Vector3(-speed, 0, 0))); // Move left
          break;
        case 'd':
          setPositionOffset((prev) => prev.add(new THREE.Vector3(speed, 0, 0))); // Move right
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  var old_x = 0;
  var old_y = 0;

  // Handle mouse movement for tilt and pan
  useEffect(() => {
    const handleMouseMove = (event) => {
      var x = ((event.clientX / window.innerWidth) * 2 - 1); // Normalize x
      var y = (-(event.clientY / window.innerHeight) * 2 + 1); // Normalize y




      // Update tilt and pan based on mouse position
      setTiltTarget(y * Math.PI / 10); // Adjusting tilt
      setPanTarget(x * Math.PI / 10); // Adjusting pan
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Update the scene on every frame
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime(); // Get the elapsed time

    // Update the camPos uniform in the shader
    const newCamPos = new THREE.Vector3(0, 0, 5); // Base camera position
    ref.current.uniforms.camPos.value.copy(newCamPos.add(positionOffset)); // Adjusted for user input

    var x = 0;
    var y = 0;
    // smooth movement by lerping between current and new values
    if (tilt > tiltTarget) {
      x = THREE.MathUtils.smoothstep(0.0001, tilt, tiltTarget);
    } else {
      x = THREE.MathUtils.smoothstep(0.0001, tiltTarget, tilt);
    }

    if (pan > panTarget) {
      y = THREE.MathUtils.smoothstep(0.0001, panTarget, pan);
    } else {
      y = THREE.MathUtils.smoothstep(0.0001, pan, panTarget);
    }

    setTilt(x); // Adjusting tilt
    setPan(y); // Adjusting pan


    // ref.current.uniforms.tilt.value = x; // Update the tilt uniform
    ref.current.uniforms.pan.value = y; // Update the pan uniform

    // Animate Power parameter over time
    ref.current.uniforms.power.value = 12.0 + 5.0 * Math.sin(elapsedTime / 10.0); // Power oscillates between 0 and 8

    ref.current.uniforms.iTime.value = elapsedTime; // Update the time uniform
    ref.current.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1); // Update resolution uniform

    // Update the light position if desired (for animation)
    ref.current.uniforms.lightPos.value.set(5, 5, 5);
  });

  return (
    <mesh>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial ref={ref} attach="material" args={[MandelbulbShaderMaterial]} />
    </mesh>
  );
}
