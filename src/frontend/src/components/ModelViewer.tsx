import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function ModelViewer() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // 🔥 limpa antes de tudo (anti-StrictMode)
    mountRef.current.replaceChildren()

    const scene = new THREE.Scene()

    const width = mountRef.current.clientWidth || 1024
    const height = mountRef.current.clientHeight || 600

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)

    mountRef.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.minDistance = 10
    controls.maxDistance = 20

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(500, 500, 500)
    scene.add(light)

    const loader = new GLTFLoader()

    let model: THREE.Object3D | null = null

    loader.load('/Kombi.glb', (gltf) => {
      model = gltf.scene
      scene.add(model)

      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3()).length()
      const center = box.getCenter(new THREE.Vector3())

      controls.target.copy(center)
      camera.position.copy(center)
      camera.position.z += size * 0.8

      controls.update()
    })

    camera.position.set(0, 1, 5)

    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)

      controls.dispose()

      if (model) {
        scene.remove(model)
      }

      scene.clear()

      renderer.dispose()

      mountRef.current?.replaceChildren()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  )
}
