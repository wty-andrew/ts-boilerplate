import * as THREE from 'three/build/three.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GUI } from 'dat.gui'
import Stats from 'stats.js'

import './assets/styles/main.css'
const foxModel = 'models/Fox/glTF-Binary/Fox.glb'

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let renderer: THREE.WebGLRenderer

let activeAction: THREE.AnimationAction

const gltfLoader = new GLTFLoader()
let mixer: THREE.AnimationMixer

const gui: GUI = new GUI()

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById('canvas')
)

const playAction = (action: THREE.AnimationAction) => {
  if (action !== activeAction) {
    activeAction.fadeOut(1)
    activeAction = action
    activeAction.reset()
    activeAction.fadeIn(1)
    activeAction.play()
  }
}

const init = async () => {
  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  // Camera
  const aspect: number = window.innerWidth / window.innerHeight
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  camera.position.set(6, 2, 10)

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Control
  controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  // Light
  const light = new THREE.PointLight(0xffffff, 2)
  light.position.set(2, 2, 2)
  scene.add(light)

  // dat gui
  const animationsFolder = gui.addFolder('Animations')
  animationsFolder.open()

  // Object
  const gltf = await gltfLoader.loadAsync(foxModel)
  mixer = new THREE.AnimationMixer(gltf.scene)
  const actions = gltf.animations.map((anim) => mixer.clipAction(anim))
  const animations: Record<string, () => void> = actions.reduce(
    (acc, curr) => ({ ...acc, [curr.getClip().name]: () => playAction(curr) }),
    {}
  )
  actions.forEach((action) =>
    animationsFolder.add(animations, action.getClip().name)
  )

  activeAction = actions[0]
  activeAction.play()

  gltf.scene.scale.set(0.05, 0.05, 0.05)
  scene.add(gltf.scene)
}

const clock = new THREE.Clock()
const animate = () => {
  stats.begin()

  const elapsed = clock.getDelta()
  mixer.update(elapsed)

  controls.update()
  renderer.render(scene, camera)

  stats.end()

  requestAnimationFrame(animate)
}

const resize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.onload = async () => {
  await init()
  window.addEventListener('resize', resize)
  animate()
}
