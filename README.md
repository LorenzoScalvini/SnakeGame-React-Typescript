# 🐍 Snake Game

[![React](https://img.shields.io/badge/React-18.2.0-%2361DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-%233178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-%646CFF?logo=vite)](https://vitejs.dev/)
[![CSS3](https://img.shields.io/badge/CSS3-%231572B6?logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

Un classico gioco Snake sviluppato con React, TypeScript e Vite, con supporto per dispositivi desktop e mobile.

![Game Screenshot](https://via.placeholder.com/400x300/333/fff?text=Snake+Game+Screenshot)

## 🚀 Funzionalità

- 🎮 Controlli da tastiera e touch screen
- ⏯️ Sistema di pausa
- 🏆 Registrazione del punteggio massimo
- 📱 Design responsive per mobile
- ⚡ Animazioni fluide
- 🔄 Logica di gioco ottimizzata con React hooks

## 🛠️ Tecnologie utilizzate

- **React 18** - Libreria JavaScript per la costruzione dell'interfaccia utente
- **TypeScript** - Aggiunge tipi statici a JavaScript
- **Vite** - Tooling frontend veloce e moderno
- **CSS3** - Stilizzazione del gioco
- **Hooks** - useState, useEffect, useCallback per la gestione dello stato

## 📋 Come funziona

Il gioco implementa la classica meccanica del Snake:

1. Il serpente si muove in una griglia 20x20
2. Devi raccogliere il cibo per far crescere il serpente
3. Evita di colpire i bordi o il tuo stesso corpo
4. La velocità aumenta progressivamente
5. Ogni cibo raccolto vale 10 punti

### Controlli:

- **Desktop**: Freccie direzionali (↑ ↓ ← →) per muoverti, barra spaziatrice per pausa
- **Mobile**: Pulsanti a schermo o gesti touch (swipe)
