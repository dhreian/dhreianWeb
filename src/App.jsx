import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BeatStore from './components/BeatStore';
import Services from './components/Services';
import Plugins from './components/Plugins';
import WebTools from './components/WebTools';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { SECTION_ROUTES, SHOW_BEATS } from './data/site';

const normalizePath = (pathname) => {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
};

const getSectionIdFromPath = (pathname) => SECTION_ROUTES[normalizePath(pathname)];

const scrollToSection = (sectionId) => {
  if (!sectionId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

function getSpotifyDeepLink(urlStr) {
  try {
    const url = new URL(urlStr);
    const parts = url.pathname.split('/').filter(Boolean);
    const typeIdx = parts.findIndex(p => ['track', 'album', 'artist', 'playlist'].includes(p));
    if (typeIdx !== -1 && parts[typeIdx + 1]) {
      return `spotify:${parts[typeIdx]}:${parts[typeIdx + 1]}`;
    }
  } catch {
    return null;
  }
  return null;
}

function getYouTubeDeepLink(urlStr) {
  try {
    const url = new URL(urlStr);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (url.hostname.includes('youtu.be')) {
      const videoId = url.pathname.split('/').filter(Boolean)[0];
      if (videoId) {
        if (isIOS) {
          return `youtube://www.youtube.com/watch?v=${videoId}`;
        } else {
          return `intent://www.youtube.com/watch?v=${videoId}#Intent;package=com.google.android.youtube;scheme=https;end`;
        }
      }
    }

    const videoId = url.searchParams.get('v');
    if (videoId) {
      if (isIOS) {
        return `youtube://www.youtube.com/watch?v=${videoId}`;
      } else {
        return `intent://www.youtube.com/watch?v=${videoId}#Intent;package=com.google.android.youtube;scheme=https;end`;
      }
    }

    if (url.hostname.includes('youtube.com')) {
      const cleanUrl = urlStr.replace('https://', '');
      if (isIOS) {
        return `youtube://${cleanUrl}`;
      } else {
        return `intent://${cleanUrl}#Intent;package=com.google.android.youtube;scheme=https;end`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function getAppleMusicDeepLink(urlStr) {
  try {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isIOS) {
      if (urlStr.startsWith('https://')) {
        return urlStr.replace('https://', 'music://');
      }
    } else {
      const cleanUrl = urlStr.replace('https://', '');
      return `intent://${cleanUrl}#Intent;package=com.apple.android.music;scheme=https;end`;
    }
  } catch {
    return null;
  }
  return null;
}

function getInstagramDeepLink(urlStr) {
  try {
    const url = new URL(urlStr);
    const username = url.pathname.split('/').filter(Boolean)[0];
    if (username && username !== 'p' && username !== 'reels') {
      return `instagram://user?username=${username}`;
    }
  } catch {
    return null;
  }
  return null;
}

function getTikTokDeepLink(urlStr) {
  try {
    const url = new URL(urlStr);
    const parts = url.pathname.split('/').filter(Boolean);
    let username = parts[0];
    if (username) {
      if (!username.startsWith('@')) {
        username = '@' + username;
      }
      return `tiktok://user/profile/${username}`;
    }
  } catch {
    return null;
  }
  return null;
}

function getXDeepLink(urlStr) {
  try {
    const url = new URL(urlStr);
    const username = url.pathname.split('/').filter(Boolean)[0];
    if (username && username !== 'home' && username !== 'explore') {
      return `twitter://user?screen_name=${username}`;
    }
  } catch {
    return null;
  }
  return null;
}

export default function App() {
  useEffect(() => {
    const syncScrollToPath = () => {
      const sectionId = getSectionIdFromPath(window.location.pathname);
      window.requestAnimationFrame(() => scrollToSection(sectionId));
    };

    syncScrollToPath();
    window.addEventListener('popstate', syncScrollToPath);
    return () => window.removeEventListener('popstate', syncScrollToPath);
  }, []);

  useEffect(() => {
    const handleInternalRouteClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      const sectionId = getSectionIdFromPath(url.pathname);
      if (sectionId === undefined) return;

      e.preventDefault();
      const nextPath = `${normalizePath(url.pathname)}${url.search}`;
      const currentPath = `${normalizePath(window.location.pathname)}${window.location.search}`;
      if (nextPath !== currentPath) {
        window.history.pushState(null, '', nextPath);
      }
      window.dispatchEvent(new Event('dhreian:navigation'));
      scrollToSection(sectionId);
    };

    document.addEventListener('click', handleInternalRouteClick);
    return () => document.removeEventListener('click', handleInternalRouteClick);
  }, []);

  useEffect(() => {
    const handleDeepLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('/') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (!isMobile) return;

      let deepLink = null;

      if (href.includes('spotify.com')) {
        deepLink = getSpotifyDeepLink(href);
      } else if (href.includes('youtube.com') || href.includes('youtu.be')) {
        deepLink = getYouTubeDeepLink(href);
      } else if (href.includes('music.apple.com')) {
        deepLink = getAppleMusicDeepLink(href);
      } else if (href.includes('instagram.com')) {
        deepLink = getInstagramDeepLink(href);
      } else if (href.includes('tiktok.com')) {
        deepLink = getTikTokDeepLink(href);
      } else if (href.includes('x.com') || href.includes('twitter.com')) {
        deepLink = getXDeepLink(href);
      }

      if (deepLink) {
        e.preventDefault();
        const start = Date.now();
        window.location.href = deepLink;

        setTimeout(() => {
          if (Date.now() - start < 1500) {
            window.location.href = href;
          }
        }, 1000);
      }
    };

    document.addEventListener('click', handleDeepLinkClick);
    return () => {
      document.removeEventListener('click', handleDeepLinkClick);
    };
  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-body overflow-x-hidden selection:bg-purple-500/40 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        {SHOW_BEATS && <BeatStore />}
        <Services />
        <Plugins />
        <WebTools />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

