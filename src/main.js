import './style.css'
import { gsap } from 'gsap'

// Set current year in footer
const yearSpan = document.getElementById('year')
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString()
}

// Mobile Navigation
const navToggle = document.getElementById('navToggle')
const navMenu = document.getElementById('navMenu')
const navLinks = document.querySelectorAll('.nav__link')

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('nav__links--open')
    
    if (isOpen) {
      navMenu.classList.remove('nav__links--open')
      navToggle.setAttribute('aria-expanded', 'false')
    } else {
      navMenu.classList.add('nav__links--open')
      navToggle.setAttribute('aria-expanded', 'true')
    }
  })
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('nav__links--open')
      navToggle.setAttribute('aria-expanded', 'false')
    })
  })
  
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('nav__links--open')
      navToggle.setAttribute('aria-expanded', 'false')
    }
  })
  
  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      navToggle.click()
    }
  })
}

// Photo Gallery Animation
const schoolPhotos = [
  {
    src: "/images/chamabondo-school-visit.jpg",
    alt: "Learners and visitors outside the school building",
    objectPositionLarge: "50% 45%",
    objectPositionSmall: "50% 45%"
  },
  {
    src: "/images/chamabondo-cultural-activities.jpg",
    alt: "Learners taking part in a cultural activity",
    objectPositionLarge: "50% 40%",
    objectPositionSmall: "50% 40%"
  },
  {
    src: "/images/chamabondo-learners.jpg",
    alt: "A group of learners together outdoors",
    objectPositionLarge: "50% 50%",
    objectPositionSmall: "50% 50%"
  }
]

function initPhotoGallery() {
  const photoImageLarge = document.getElementById('photoImageLarge')
  const photoImageSmall = document.getElementById('photoImageSmall')
  
  if (!photoImageLarge || !photoImageSmall) {
    return
  }
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  let photoIndex = 0
  let intervalId = null
  
  function setPhoto(img, photo, isLarge) {
    img.src = photo.src
    img.alt = photo.alt
    img.style.objectPosition = isLarge ? photo.objectPositionLarge : photo.objectPositionSmall
    img.style.objectFit = 'cover'
  }
  
  function initializeGallery() {
    const largePhoto = schoolPhotos[photoIndex]
    const smallPhoto = schoolPhotos[(photoIndex + 1) % schoolPhotos.length]
    setPhoto(photoImageLarge, largePhoto, true)
    setPhoto(photoImageSmall, smallPhoto, false)
  }
  
  function animateGallery() {
    if (prefersReducedMotion) {
      photoIndex = (photoIndex + 1) % schoolPhotos.length
      initializeGallery()
      return
    }
    
    const currentLargeIndex = photoIndex
    const currentSmallIndex = (photoIndex + 1) % schoolPhotos.length
    const nextLargeIndex = currentSmallIndex
    const nextSmallIndex = (currentSmallIndex + 1) % schoolPhotos.length
    
    const currentLargePhoto = schoolPhotos[currentLargeIndex]
    const currentSmallPhoto = schoolPhotos[currentSmallIndex]
    const nextLargePhoto = schoolPhotos[nextLargeIndex]
    const nextSmallPhoto = schoolPhotos[nextSmallIndex]
    
    const tl = gsap.timeline()
    
    tl.to([photoImageLarge, photoImageSmall], {
      opacity: 0.5,
      duration: 0.28,
      ease: 'power2.inOut'
    }, 0)
    
    .call(() => {
      // Move current large to small card with small-card crop
      photoImageSmall.src = currentLargePhoto.src
      photoImageSmall.alt = currentLargePhoto.alt
      photoImageSmall.style.objectPosition = currentLargePhoto.objectPositionSmall
      
      // Move next photo to large card with large-card crop
      photoImageLarge.src = nextLargePhoto.src
      photoImageLarge.alt = nextLargePhoto.alt
      photoImageLarge.style.objectPosition = nextLargePhoto.objectPositionLarge
    }, null, 0.28)
    
    .to([photoImageLarge, photoImageSmall], {
      opacity: 1,
      duration: 0.38,
      ease: 'power2.out'
    }, 0.28)
    
    photoIndex = nextLargeIndex
  }
  
  function startAnimation() {
    if (intervalId) {
      clearInterval(intervalId)
    }
    
    initializeGallery()
    
    if (prefersReducedMotion) {
      intervalId = setInterval(() => {
        if (document.hidden) return
        photoIndex = (photoIndex + 1) % schoolPhotos.length
        initializeGallery()
      }, 5200)
      return
    }
    
    intervalId = setInterval(() => {
      if (document.hidden) return
      animateGallery()
    }, 5200)
  }
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    } else if (!intervalId) {
      startAnimation()
    }
  })
  
  startAnimation()
}

// Hero Text Entrance Animation
function initHeroTextAnimation() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  const eyebrow = document.querySelector('.hero__eyebrow')
  const location = document.querySelector('.hero__location')
  const title = document.querySelector('.hero__title')
  const description = document.querySelector('.hero__description')
  const actions = document.querySelector('.hero__actions')
  const photoGallery = document.querySelector('.photo-gallery')
  
  if (prefersReducedMotion) {
    [eyebrow, location, title, description, actions, photoGallery].forEach(el => {
      if (el) {
        el.style.opacity = '1'
        el.style.transform = 'none'
      }
    })
    return
  }
  
  // Set initial states
  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 16 })
  if (location) gsap.set(location, { opacity: 0, y: 14 })
  if (title) gsap.set(title, { opacity: 0, y: 20 })
  if (description) gsap.set(description, { opacity: 0, y: 16 })
  if (actions) gsap.set(actions, { opacity: 0, y: 16 })
  if (photoGallery) gsap.set(photoGallery, { opacity: 0, y: 18 })
  
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  
  if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, 0.05)
  if (location) tl.to(location, { opacity: 1, y: 0, duration: 0.5 }, 0.12)
  if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
  if (description) tl.to(description, { opacity: 1, y: 0, duration: 0.5 }, 0.32)
  if (actions) tl.to(actions, { opacity: 1, y: 0, duration: 0.5 }, 0.42)
  if (photoGallery) tl.to(photoGallery, { opacity: 1, y: 0, duration: 0.6 }, 0.28)
}

function initAll() {
  initPhotoGallery()
  initHeroTextAnimation()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll)
} else {
  initAll()
}
