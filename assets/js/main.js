;(() => {
  const qs = (s, el = document) => el.querySelector(s)
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s))

  // Footer year
  const yearEl = qs('#year')
  if (yearEl) yearEl.textContent = String(new Date().getFullYear())

  // Make "What we do" innovation CTAs deterministic on mobile and desktop.
  // Some mobile browsers can be inconsistent with complex layered sections;
  // this guarantees a direct page navigation for these links.
  qsa('.whatwedo-link[href*="innovation.html"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (e.defaultPrevented) return
      if (e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const href = a.getAttribute('href')
      if (!href) return

      e.preventDefault()
      window.location.assign(href)
    })
  })

  // Video modal

  const modal = document.querySelector('.modal')
  const openBtn = document.querySelector('[data-open-video]')
  const closeBtns = Array.from(document.querySelectorAll('[data-close-video]'))
  const iframe = modal ? modal.querySelector('iframe') : null
  const baseIframeSrc = iframe ? iframe.getAttribute('src') || '' : ''

  const withAutoplay = (src) => {
    if (!src) return src
    const [url, hash] = src.split('#')
    const hasQuery = url.includes('?')
    const sep = hasQuery ? '&' : '?'
    const out = `${url}${sep}autoplay=1`
    return hash ? `${out}#${hash}` : out
  }

  const openModal = () => {
    if (!modal) return
    if (iframe && baseIframeSrc) {
      iframe.setAttribute('src', withAutoplay(baseIframeSrc))
    }
    modal.hidden = false
    modal.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    if (!modal) return
    modal.hidden = true
    modal.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''

    // Stop playback when modal closes.
    if (iframe) {
      iframe.setAttribute('src', '')
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal)
  closeBtns.forEach((b) => b.addEventListener('click', closeModal))

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal()
  })

  // Cookie prefs placeholder
  const cookieBtn = qs('[data-cookie-prefs]')
  if (cookieBtn) {
    cookieBtn.addEventListener('click', () => {
      alert('Cookie preferences UI not wired yet (static migration scaffold).')
    })
  }
})()

// Quote carousel (simple + reliable)
;(() => {
  const root = document.querySelector('.quote-carousel')
  if (!root) return

  const track = root.querySelector('[data-qc-track]')
  const slides = track
    ? Array.from(track.querySelectorAll('[data-qc-slide]'))
    : []
  const prevBtn = root.querySelector('[data-qc-prev]')
  const nextBtn = root.querySelector('[data-qc-next]')

  if (!track || slides.length < 2 || !prevBtn || !nextBtn) return

  let index = 0

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`
  }

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault()
    index = (index - 1 + slides.length) % slides.length
    render()
  })

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault()
    index = (index + 1) % slides.length
    render()
  })

  render()
})()

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.image-carousel')
  if (!root) return

  const track = root.querySelector('[data-ic-track]')
  const slides = track
    ? Array.from(track.querySelectorAll('[data-ic-slide]'))
    : []
  const prevBtn = root.querySelector('[data-ic-prev]')
  const nextBtn = root.querySelector('[data-ic-next]')

  if (!track || slides.length < 2 || !prevBtn || !nextBtn) {
    // If this triggers, the HTML attributes/classes don't match.
    console.warn('Image carousel: missing elements', {
      track,
      slides: slides.length,
      prevBtn,
      nextBtn,
    })
    return
  }

  let index = 0

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`
  }

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault()
    index = (index - 1 + slides.length) % slides.length
    render()
  })

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault()
    index = (index + 1) % slides.length
    render()
  })

  render()
})

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.topbar')
  if (!header) return

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10)
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

document.addEventListener('DOMContentLoaded', () => {
  const topbar = document.querySelector('.topbar')
  const toggle = document.querySelector('.topbar-toggle')
  const nav = document.querySelector('.topbar-nav')
  if (!topbar || !toggle || !nav) return

  const setMenuOpen = (open) => {
    topbar.classList.toggle('is-menu-open', open)
    nav.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    document.body.classList.toggle('menu-open', open)
  }

  toggle.addEventListener('click', () => {
    setMenuOpen(!nav.classList.contains('is-open'))
  })

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false))
  })

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('is-open')) return
    if (window.innerWidth > 720) return
    if (topbar.contains(event.target)) return
    setMenuOpen(false)
  })

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenuOpen(false)
    }
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720 && nav.classList.contains('is-open')) {
      setMenuOpen(false)
    }
  })
})

document.addEventListener('DOMContentLoaded', async () => {
  const cards = Array.from(document.querySelectorAll('.our-team-card'))
  const modal = document.querySelector('#team-modal')
  if (!cards.length || !modal) return

  const imageEl = modal.querySelector('#team-modal-image')
  const nameEl = modal.querySelector('#team-modal-name')
  const roleEl = modal.querySelector('#team-modal-role')
  const copyEl = modal.querySelector('#team-modal-copy')
  const closeEls = Array.from(modal.querySelectorAll('[data-team-modal-close]'))
  const teamRoot = document.querySelector('.our-team-main')
  const declaredJsonPath =
    (teamRoot && teamRoot.dataset.teamJson) || 'data/team.json'
  const TEAM_DATA_URL = new URL(
    declaredJsonPath,
    window.location.href,
  ).toString()
  const normalizeId = (value) =>
    String(value || '')
      .trim()
      .toLowerCase()
  const isHttpLike =
    window.location.protocol === 'http:' ||
    window.location.protocol === 'https:'

  const profilesById = new Map()

  const parsePeopleIntoMap = (data) => {
    const people = Array.isArray(data && data.people) ? data.people : []
    people.forEach((person) => {
      const id = normalizeId(person && person.id)
      if (!id) return
      profilesById.set(id, person)
    })
  }

  const loadJsonWithXhr = (url) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return
        const okStatus =
          (xhr.status >= 200 && xhr.status < 300) ||
          (xhr.status === 0 && xhr.responseText)
        if (!okStatus) {
          reject(new Error(`XHR ${xhr.status}`))
          return
        }
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch (err) {
          reject(err)
        }
      }
      xhr.onerror = () => reject(new Error('XHR network error'))
      xhr.send()
    })

  try {
    if (isHttpLike) {
      const response = await fetch(TEAM_DATA_URL, { cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      parsePeopleIntoMap(data)
    } else {
      const data = await loadJsonWithXhr(declaredJsonPath)
      parsePeopleIntoMap(data)
    }
  } catch (error) {
    console.error(`Failed to load team data from ${TEAM_DATA_URL}`, error)
  }

  if (profilesById.size === 0) {
    console.error(`Team data map is empty from ${TEAM_DATA_URL}.`)
  }

  cards.forEach((card) => {
    const id = normalizeId(card.dataset.personId)
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0')
    if (!card.hasAttribute('role')) card.setAttribute('role', 'button')
    if (!card.hasAttribute('aria-label')) {
      const name = card.querySelector('.our-team-name')
      if (name)
        card.setAttribute(
          'aria-label',
          `Open profile for ${name.textContent.trim()}`,
        )
    }
    if (id && !profilesById.has(id)) {
      console.warn(`No team JSON entry found for card id: ${id}`)
    }
  })

  let lastFocused = null

  const closeModal = () => {
    modal.hidden = true
    modal.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
    if (lastFocused) lastFocused.focus()
  }

  const openModal = (card) => {
    const id = normalizeId(card.dataset.personId)
    const profile = profilesById.get(id) || {
      name: card.querySelector('.our-team-name')?.textContent?.trim() || '',
      role: card.querySelector('.our-team-role')?.textContent?.trim() || '',
      image: card.querySelector('.our-team-photo')?.getAttribute('src') || '',
      bio: [
        'Profile text unavailable from JSON on this environment.',
        `ID: ${id || '(missing)'}`,
        `URL: ${TEAM_DATA_URL}`,
      ],
    }

    lastFocused = card
    imageEl.src = profile.image || ''
    imageEl.alt = profile.name || ''
    nameEl.textContent = profile.name || ''
    roleEl.textContent = profile.role || ''
    copyEl.innerHTML = ''

    const paragraphs = Array.isArray(profile.bio) ? profile.bio : []
    paragraphs.forEach((text) => {
      const p = document.createElement('p')
      p.textContent = text
      copyEl.appendChild(p)
    })

    modal.hidden = false
    modal.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openModal(card))
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      openModal(card)
    })
  })

  closeEls.forEach((el) => el.addEventListener('click', closeModal))

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal()
  })
})

document.addEventListener('DOMContentLoaded', async () => {
  const newsRoot = document.querySelector('.news-page-main')
  const grid = document.querySelector('[data-news-grid]')
  if (!newsRoot || !grid) return

  const declaredJsonPath =
    newsRoot.dataset.newsJson || 'data/news-resources.json'
  const jsonUrl = new URL(declaredJsonPath, window.location.href).toString()
  const siteRootUrl = new URL('../', jsonUrl).toString()
  const isHttpLike =
    window.location.protocol === 'http:' || window.location.protocol === 'https:'

  const loadJsonWithXhr = (url) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return
        const okStatus =
          (xhr.status >= 200 && xhr.status < 300) ||
          (xhr.status === 0 && xhr.responseText)
        if (!okStatus) return reject(new Error(`XHR ${xhr.status}`))
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch (err) {
          reject(err)
        }
      }
      xhr.onerror = () => reject(new Error('XHR network error'))
      xhr.send()
    })

  const readNewsData = async () => {
    if (isHttpLike) {
      const response = await fetch(jsonUrl, { cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.json()
    }
    return loadJsonWithXhr(declaredJsonPath)
  }

  const createNewsCard = (item) => {
    const article = document.createElement('article')
    article.className = 'news-card'
    if (item.id) article.dataset.newsId = String(item.id)

    const top = document.createElement('div')
    top.className = 'news-card-top'

    const title = document.createElement('h2')
    title.className = 'news-card-title'
    title.textContent = String(item.title || '')
    top.appendChild(title)

    const bottom = document.createElement('div')
    bottom.className = 'news-card-bottom'

    const date = document.createElement('p')
    date.className = 'news-card-date'
    date.textContent = String(item.date || '')

    const copy = document.createElement('p')
    copy.className = 'news-card-copy'
    copy.textContent = String(item.description || '')

    const btn = document.createElement('a')
    btn.className = 'news-card-btn'
    const rawHref = String(item.anchorLink || '#')
    btn.href =
      rawHref === '#' || /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(rawHref)
        ? rawHref
        : new URL(rawHref, siteRootUrl).toString()
    btn.textContent = 'Read the article'

    bottom.append(date, copy, btn)
    article.append(top, bottom)
    return article
  }

  try {
    const data = await readNewsData()
    const items = Array.isArray(data && data.items) ? data.items : []
    grid.innerHTML = ''
    items.forEach((item) => grid.appendChild(createNewsCard(item)))
  } catch (error) {
    console.error(`Failed to render news cards from ${jsonUrl}`, error)
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const articleRoot = document.querySelector('.article-page-main')
  if (!articleRoot) return

  const articleId = String(articleRoot.dataset.newsId || '').trim()
  const declaredJsonPath =
    articleRoot.dataset.newsJson || 'data/news-resources.json'
  if (!articleId) return

  const titleEl = articleRoot.querySelector('[data-article-title]')
  const dateEl = articleRoot.querySelector('[data-article-date]')
  const relatedCarousel = articleRoot.querySelector('[data-article-related-carousel]')
  const relatedViewport = articleRoot.querySelector('.article-related-viewport')
  const relatedTrack = articleRoot.querySelector('[data-article-related-track]')
  const relatedDots = articleRoot.querySelector('[data-article-related-dots]')
  const jsonUrl = new URL(declaredJsonPath, window.location.href).toString()
  const siteRootUrl = new URL('../', jsonUrl).toString()
  const isHttpLike =
    window.location.protocol === 'http:' || window.location.protocol === 'https:'

  const loadJsonWithXhr = (url) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return
        const okStatus =
          (xhr.status >= 200 && xhr.status < 300) ||
          (xhr.status === 0 && xhr.responseText)
        if (!okStatus) return reject(new Error(`XHR ${xhr.status}`))
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch (err) {
          reject(err)
        }
      }
      xhr.onerror = () => reject(new Error('XHR network error'))
      xhr.send()
    })

  const createRelatedCard = (item) => {
    const article = document.createElement('article')
    article.className = 'news-card'
    if (item.id) article.dataset.newsId = String(item.id)

    const top = document.createElement('div')
    top.className = 'news-card-top'
    const title = document.createElement('h2')
    title.className = 'news-card-title'
    title.textContent = String(item.title || '')
    top.appendChild(title)

    const bottom = document.createElement('div')
    bottom.className = 'news-card-bottom'
    const date = document.createElement('p')
    date.className = 'news-card-date'
    date.textContent = String(item.date || '')
    const copy = document.createElement('p')
    copy.className = 'news-card-copy'
    copy.textContent = String(item.description || '')
    const btn = document.createElement('a')
    btn.className = 'news-card-btn'
    const rawHref = String(item.anchorLink || '#')
    btn.href =
      rawHref === '#' || /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(rawHref)
        ? rawHref
        : new URL(rawHref, siteRootUrl).toString()
    btn.textContent = 'Read the article'

    bottom.append(date, copy, btn)
    article.append(top, bottom)
    return article
  }

  const mountRelatedCarousel = (items) => {
    if (!relatedCarousel || !relatedTrack || !relatedDots) return
    relatedTrack.innerHTML = ''
    relatedDots.innerHTML = ''

    if (!items.length) {
      relatedCarousel.style.display = 'none'
      return
    }

    relatedCarousel.style.display = ''
    const cardsPerPage = window.matchMedia('(max-width: 980px)').matches ? 1 : 3
    const pages = []
    for (let i = 0; i < items.length; i += cardsPerPage) {
      pages.push(items.slice(i, i + cardsPerPage))
    }

    pages.forEach((pageItems, pageIndex) => {
      const slide = document.createElement('div')
      slide.className = 'article-related-slide'

      const grid = document.createElement('div')
      grid.className = 'news-grid'
      pageItems.forEach((item) => grid.appendChild(createRelatedCard(item)))
      slide.appendChild(grid)
      relatedTrack.appendChild(slide)

      const dot = document.createElement('button')
      dot.type = 'button'
      dot.className = `article-related-dot${pageIndex === 0 ? ' is-active' : ''}`
      dot.setAttribute('aria-label', `Related articles page ${pageIndex + 1}`)
      dot.addEventListener('click', () => goToPage(pageIndex))
      relatedDots.appendChild(dot)
    })

    let currentPage = 0
    const dots = Array.from(relatedDots.querySelectorAll('.article-related-dot'))

    function goToPage(index) {
      currentPage = Math.max(0, Math.min(index, pages.length - 1))
      relatedTrack.style.transform = `translateX(-${currentPage * 100}%)`
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentPage))
    }

    if (relatedViewport && pages.length > 1) {
      let startX = 0
      let startY = 0
      let deltaX = 0
      let deltaY = 0
      let tracking = false
      let isHorizontal = false

      const SWIPE_THRESHOLD = 48
      const AXIS_LOCK_THRESHOLD = 10

      relatedViewport.addEventListener(
        'touchstart',
        (e) => {
          if (!e.touches || e.touches.length !== 1) return
          const touch = e.touches[0]
          startX = touch.clientX
          startY = touch.clientY
          deltaX = 0
          deltaY = 0
          tracking = true
          isHorizontal = false
        },
        { passive: true }
      )

      relatedViewport.addEventListener(
        'touchmove',
        (e) => {
          if (!tracking || !e.touches || e.touches.length !== 1) return
          const touch = e.touches[0]
          deltaX = touch.clientX - startX
          deltaY = touch.clientY - startY

          if (!isHorizontal) {
            const absX = Math.abs(deltaX)
            const absY = Math.abs(deltaY)
            if (absX < AXIS_LOCK_THRESHOLD && absY < AXIS_LOCK_THRESHOLD) return
            isHorizontal = absX > absY
          }

          if (isHorizontal) {
            // Prevent page scrolling while swiping the carousel horizontally.
            e.preventDefault()
          }
        },
        { passive: false }
      )

      relatedViewport.addEventListener('touchend', () => {
        if (!tracking) return
        tracking = false

        if (!isHorizontal || Math.abs(deltaX) < SWIPE_THRESHOLD) return
        if (deltaX < 0) {
          goToPage(currentPage + 1)
        } else {
          goToPage(currentPage - 1)
        }
      })

      relatedViewport.addEventListener('touchcancel', () => {
        tracking = false
        isHorizontal = false
      })
    }

    goToPage(0)
  }

  try {
    const data = isHttpLike
      ? await (async () => {
          const response = await fetch(jsonUrl, { cache: 'no-store' })
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return response.json()
        })()
      : await loadJsonWithXhr(declaredJsonPath)

    const items = Array.isArray(data && data.items) ? data.items : []
    const item = items.find((entry) => String(entry && entry.id) === articleId)
    if (!item) {
      console.warn(`Article metadata not found for id "${articleId}" in ${jsonUrl}`)
      return
    }

    if (titleEl && item.title) titleEl.textContent = String(item.title)
    if (dateEl && item.date) dateEl.textContent = String(item.date)
    if (item.title) document.title = `Aspeya | ${String(item.title)}`

    const relatedItems = items.filter((entry) => {
      if (!entry || String(entry.id || '') === articleId) return false
      return true
    })
    mountRelatedCarousel(relatedItems)
  } catch (error) {
    console.error(`Failed to load article metadata from ${jsonUrl}`, error)
  }
})
