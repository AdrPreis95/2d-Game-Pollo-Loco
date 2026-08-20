# El Pollo Loco

2D-Jump-and-Run in **vanilla JavaScript** und **HTML Canvas**. Pepe sammelt Münzen und Salsa-Flaschen, besiegt Hühner per Sprung und den Endboss mit geworfenen Flaschen.

Gebaut als Mini-Projekt, um objektorientiertes JavaScript ohne Framework zu zeigen.

## Spielen

Die Datei `index.html` im Browser öffnen oder lokal serven:

```bash
npx serve .
```

Dann [http://localhost:3000](http://localhost:3000) aufrufen.

## Steuerung

| Taste / Touch | Aktion |
| --- | --- |
| ← → | Laufen |
| Leertaste | Springen |
| F | Flasche werfen |

Auf dem Handy: Querformat und die On-Screen-Buttons.

## Technik

- **OOP:** `DrawableObject` → `MoveableObject` → Figur, Gegner, Endboss
- **Canvas:** Game-Loop mit `requestAnimationFrame`, Kamera, Kollision
- **Audio:** zentraler `SoundManager` (Musik/Effekte, Volume in `localStorage`); Loops stoppen sauber bei Game Over und Restart
- **Mobile:** Touch-Steuerung, Fullscreen, Rotate-Hinweis

## Struktur

```
index.html
js/          Spielstart, Sound, Reset, UI
models/      Spielfiguren, Welt, Kollision
levels/      Level 1
audio/       Soundeffekte
img/         Grafiken
```

Grafiken stammen aus dem Developer-Akademie-Assetpack.
