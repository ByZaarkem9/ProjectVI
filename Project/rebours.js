
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // COMPTE À REBOURS GTA VI
    // ==========================================
    
const RELEASE_DATE = new Date("2026-11-19T00:00:00+01:00");
const releaseTimestamp = RELEASE_DATE.getTime();

    const elements = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds")
    };

    const countdown = document.getElementById("countdown");
    const subtitle = document.querySelector(".hero-subtitle");

    let previousValues = {};
    let countdownTimeout = null;

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    function animateNumber(element, value, key) {
        if (!element) return;

        const formattedValue =
            key === "days" ? String(value) : pad(value);

        if (previousValues[key] === formattedValue) return;

        previousValues[key] = formattedValue;
        element.textContent = formattedValue;

        element.classList.remove("number-tick");
        void element.offsetWidth;
        element.classList.add("number-tick");
    }

    function updateCountdown() {
        const difference = releaseTimestamp - Date.now();

        if (difference <= 0) {
            Object.values(elements).forEach(element => {
                if (element) element.textContent = "00";
            });

            if (countdown) {
                countdown.classList.add("countdown-finished");
            }

            if (subtitle) {
                subtitle.textContent = "GTA VI EST DISPONIBLE";
            }

            document.title = "GTA VI est disponible !";
            return false;
        }

        const totalSeconds = Math.floor(difference / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        animateNumber(elements.days, days, "days");
        animateNumber(elements.hours, hours, "hours");
        animateNumber(elements.minutes, minutes, "minutes");
        animateNumber(elements.seconds, seconds, "seconds");

        return true;
    }

    function scheduleCountdown() {
        if (!updateCountdown()) return;

        const delay = 1000 - (Date.now() % 1000);
        countdownTimeout = setTimeout(scheduleCountdown, delay);
    }

    scheduleCountdown();

    // ==========================================
    // MENU MOBILE
    // ==========================================

    const mobileMenuButton = document.getElementById(
        "mobile-menu-button"
    );

    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-links .nav-link");

    if (mobileMenuButton && navbar) {
        mobileMenuButton.addEventListener("click", () => {
            const isOpen = navbar.classList.toggle("menu-open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                isOpen ? "Fermer le menu" : "Ouvrir le menu"
            );

            mobileMenuButton.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navbar.classList.remove("menu-open");
                mobileMenuButton.setAttribute("aria-expanded", "false");
                mobileMenuButton.setAttribute(
                    "aria-label",
                    "Ouvrir le menu"
                );
                mobileMenuButton.textContent = "☰";
            });
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                navbar.classList.remove("menu-open");
                mobileMenuButton.setAttribute("aria-expanded", "false");
                mobileMenuButton.setAttribute(
                    "aria-label",
                    "Ouvrir le menu"
                );
                mobileMenuButton.textContent = "☰";
            }
        });
    }

    // ==========================================
    // LECTEURS VIDÉO DES TRAILERS
    // ==========================================

    const videoSources = {
        trailer1: "videos/Trailer1.mp4",
        trailer2: "videos/Trailer2.mp4",
        trailer3: "videos/LaunchTrailer.mp4"
    };

    const trailerButtons = document.querySelectorAll(
        ".trailer-thumbnail[data-video]"
    );

    const trailerCards = document.querySelectorAll(".trailer-card");
    const carouselDots = document.querySelectorAll(".carousel-dot");

    function activateDot(index) {
        carouselDots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === index;

            dot.classList.toggle("active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    function closeCardPlayer(card, restoreButton = true) {
        if (!card) return;

        const player = card.querySelector(".trailer-player");
        const button = card.querySelector(".trailer-thumbnail");

        if (player) {
            const video = player.querySelector("video");

            if (video) {
                video.pause();
                video.removeAttribute("src");
                video.load();
            }

            player.remove();
        }

        if (button && restoreButton) {
            button.hidden = false;
        }
    }

    function closeAllPlayers(exceptCard = null) {
        trailerCards.forEach(card => {
            if (card !== exceptCard) {
                closeCardPlayer(card);
            }
        });
    }

    function openPlayer(button) {
        const card = button.closest(".trailer-card");
        const videoId = button.dataset.video;
        const videoSource = videoSources[videoId];

        if (!card || !videoSource) {
            console.error("Carte ou vidéo introuvable :", videoId);
            return;
        }

        // Si ce lecteur existe déjà, on relance la vidéo.
        const existingPlayer = card.querySelector(".trailer-player");

        if (existingPlayer) {
            const existingVideo = existingPlayer.querySelector("video");

            if (existingVideo) {
                existingVideo.play().catch(error => {
                    console.error("Impossible de lancer la vidéo :", error);
                });
            }

            return;
        }

        // Ferme les autres lecteurs avant d'en ouvrir un nouveau.
        closeAllPlayers(card);

        // Création du bloc vidéo.
        const player = document.createElement("div");
        player.className = "trailer-player";

        const video = document.createElement("video");
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.preload = "auto";
        video.setAttribute("aria-label", "Lecture du trailer GTA VI");

        // Chemin relatif au fichier HTML.
        video.src = new URL(videoSource, document.baseURI).href;

        // Bouton pour fermer le lecteur.
        const closeButton = document.createElement("button");
        closeButton.className = "inline-video-close";
        closeButton.type = "button";
        closeButton.textContent = "✕";
        closeButton.setAttribute("aria-label", "Fermer la vidéo");

        closeButton.addEventListener("click", () => {
            closeCardPlayer(card);
            button.focus();
        });

        // Message si le navigateur ne peut pas lire la vidéo.
        const errorMessage = document.createElement("p");
        errorMessage.className = "video-load-error";
        errorMessage.hidden = true;
        errorMessage.textContent =
            "Impossible de charger la vidéo. Vérifie le fichier et son chemin.";

        video.addEventListener("error", () => {
            console.error(
                "Erreur vidéo :",
                video.currentSrc,
                video.error
            );
            errorMessage.hidden = false;
        });

        player.append(video, closeButton, errorMessage);

        // Insère le lecteur dans la carte cliquée.
        button.hidden = true;
        card.appendChild(player);

        // Lance la lecture et affiche les erreurs éventuelles.
        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(error => {
                console.warn("Lecture automatique refusée ou impossible :", error);

                // Les commandes restent disponibles pour démarrer la lecture.
                if (video.error) {
                    errorMessage.hidden = false;
                }
            });
        }

        const index = Array.from(trailerCards).indexOf(card);

        if (index !== -1) {
            activateDot(index);
        }
    }

    // Clic sur les trois miniatures.
    trailerButtons.forEach(button => {
        button.addEventListener("click", () => {
            openPlayer(button);
        });
    });

    // Les indicateurs sélectionnent le trailer correspondant.
    carouselDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            const button = trailerCards[index]?.querySelector(
                ".trailer-thumbnail"
            );

            if (button) {
                openPlayer(button);
            }
        });
    });

    // Fermer les lecteurs avec la touche Échap.
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            trailerCards.forEach(card => closeCardPlayer(card));
        }
    });
});
