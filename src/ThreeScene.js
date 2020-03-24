import React, { Component } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { render, extend } from 'react-three-fiber'
import * as dat from 'dat.gui';
 
extend({ CSS3DObject })

let string = '<div>' +
'<h1>This is an H1 Element.</h1>' +
'<span class="large">Hello Three.js cookbook</span>' +
'<textarea> And this is a textarea</textarea>' +
'</div>';

// global variables
let control;

class ThreeScene extends Component{
  componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    this.scene = new THREE.Scene();
    // create a camera, which defines where we're looking at.
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    // create a CSS3DRenderer
    this.renderer = new CSS3DRenderer()
    this.renderer.setSize(width, height)
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = 0;

    // position and point the camera to the center of the scene
    this.camera.position.x = 500;
    this.camera.position.y = 500;
    this.camera.position.z = 500;
    this.camera.lookAt(this.scene.position);

    // add the output of the renderer to the html element
    // document.body.appendChild(renderer.domElement);
    this.mount.appendChild(this.renderer.domElement)

    for (let i = 0; i < 8; i++) {
      let cssElement = createCSS3DObject(string);
      cssElement.position.set(100, 100, 100 + 50 * i);

      cssElement.element.addEventListener('mouseover', (e) => {
        console.log(e.currentTarget)
        e.currentTarget.style.top = '200px'
      }, false)

      cssElement.element.addEventListener('mouseout', (e) => {
        console.log(e.currentTarget)
        e.currentTarget.style.top = '0px'
      }, false)

    
      this.scene.add(cssElement);  
    }

    control = {
			cameraX: 500,
			cameraY: 500,
			cameraZ: 500
    };

    var gui = new dat.GUI();
    gui.add(control, 'cameraX', 0, 1000, 1)
      .onChange(value => {
        this.camera.position.x = value;
      });
    gui.add(control, 'cameraY', 0, 1000, 1)
      .onChange(value => {
        this.camera.position.y = value
      })

    gui.add(control, 'cameraZ', 0, 1000, 1)
      .onChange(value => {
        this.camera.position.z = value
      })

    // addControls(control); 

    this.start()
  }
componentWillUnmount(){
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }
start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }
stop = () => {
    cancelAnimationFrame(this.frameId)
  }
animate = () => {
  //  this.cube.rotation.x += 0.01
  //  this.cube.rotation.y += 0.01
   this.renderScene()
   this.frameId = window.requestAnimationFrame(this.animate)
 }
renderScene = () => {
  this.renderer.render(this.scene, this.camera)
}
render(){
    return(
      <div
        style={{ width: '800px', height: '800px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}


function createCSS3DObject(s) {
  // convert the string to dome elements
  var wrapper = document.createElement('div');
  wrapper.innerHTML = s;
  var div = wrapper.firstChild;

  // set some values on the div to style it, standard CSS
  div.style.width = '375px';
  div.style.height = '375px';
  div.style.opacity = 1;
  div.style['will-change'] = 'all'
  div.style.transition = 'top 0.2s linear'
  div.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();

  // create a CSS3Dobject and return it.
  var object = new CSS3DObject(div);
  return object;
}

export default ThreeScene
