import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()

/**
 * Axes Helper
 */
 const axesHelper = new THREE.AxesHelper(2)
 scene.add(axesHelper)

/**
 * Environment map
 */
 const debugObject = {}

 const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {

    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
 
    }
)

 const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

//  const environmentMap = cubeTextureLoader.load([
//     '/textures/environmentMaps/0/px.jpg',
//     '/textures/environmentMaps/0/nx.jpg',
//     '/textures/environmentMaps/0/py.jpg',
//     '/textures/environmentMaps/0/ny.jpg',
//     '/textures/environmentMaps/0/pz.jpg',
//     '/textures/environmentMaps/0/nz.jpg'
// ])

// environmentMap.encoding = THREE.sRGBEncoding

// scene.background = environmentMap
// scene.environment = environmentMap

// debugObject.envMapIntensity = 5

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

/**
 * Update all materials
 */
 const updateAllMaterials = () =>
 {
     scene.traverse((child) =>
     {
         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
         {
             child.material.envMap = environmentMap
             child.material.envMapIntensity = debugObject.envMapIntensity
             child.material.needsUpdate = true
             child.castShadow = true
             child.receiveShadow = true
         }
     })
 }

gltfLoader.load(
    // '/models/CediaTrophy/CEDIA AWARD 02.gltf',
    // '/models/CediaTrophy/CEDIA AWARD 03.gltf',
    // '/models/CediaTrophy/CEDIA AWARD 04.gltf',
    '/models/CediaTrophy/CEDIA AWARD 05.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(0.005, 0.005, 0.005)
        console.log(gltf.scene)
        scene.add(gltf.scene)

        // Animation
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
        action.play()
        updateAllMaterials()

    }
)


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = - 2

const backwall = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
    )
    backwall.receiveShadow = true
    // backwall.rotation.x = - Math.PI * 0.5
    backwall.position.z = - 5
// scene.add(floor)
// scene.add(backwall)

/**
 * Lights
 */
//  const directionalLight = new THREE.DirectionalLight('#ffffff', 300)
//  directionalLight.castShadow = true
//  directionalLight.shadow.camera.far = 15
//  directionalLight.shadow.mapSize.set(1024, 1024)
//  directionalLight.shadow.normalBias = 0.05
//  directionalLight.position.set(-1, 5, 3)
//  scene.add(directionalLight)
//  directionalLight.castShadow = true
 
//  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
//  scene.add(directionalLightHelper)

//  const directionalLight2 = new THREE.DirectionalLight('#ffffff', 300)
//  directionalLight2.castShadow = true
//  directionalLight2.shadow.camera.far = 15
//  directionalLight2.shadow.mapSize.set(1024, 1024)
//  directionalLight2.shadow.normalBias = 0.05
//  directionalLight2.position.set(3, 5, -1)
//  scene.add(directionalLight2)
//  directionalLight2.castShadow = true
 
//  const directionalLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 0.2)
//  scene.add(directionalLightHelper2)


 // Rect area light
// const rectAreaLight = new THREE.RectAreaLight(0xffffff, 200, 3, 3)
// rectAreaLight.position.set(- 1.5, 0, 1.5)
// rectAreaLight.lookAt(new THREE.Vector3())
// rectAreaLight.castShadow = true
// scene.add(rectAreaLight)

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaLightHelper)

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 200, 20, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 3, 6)
scene.add(spotLight)
spotLight.castShadow = true

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const spotLight2 = new THREE.SpotLight(0xffffff, 200, 20, Math.PI * 0.1, 0.25, 1)
spotLight2.position.set(6, 3, 0)
scene.add(spotLight2)
spotLight2.castShadow = true

const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2)
scene.add(spotLightHelper2)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()