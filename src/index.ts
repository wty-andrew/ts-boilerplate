import * as THREE from 'three/build/three.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import Stats from 'stats.js'

import './assets/styles/main.css'

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let renderer: THREE.WebGLRenderer
let cube: THREE.Mesh

const gui: dat.GUI = new dat.GUI()

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById('canvas')
)

const init = () => {
  // Scene
  scene = new THREE.Scene()

  // Camera
  const aspect: number = window.innerWidth / window.innerHeight
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  camera.position.set(2, 2, 2)

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Control
  controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  // Axes helper
  const axesHelper: THREE.AxesHelper = new THREE.AxesHelper()
  scene.add(axesHelper)

  // Object
  const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1)
  const material: THREE.MeshNormalMaterial = new THREE.MeshNormalMaterial()
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  // dat gui
  gui.add(material, 'wireframe').name('Wireframe')
}

const animate = () => {
  stats.begin()

  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)

  stats.end()
}

const resize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

init()
window.addEventListener('resize', resize)
animate()
