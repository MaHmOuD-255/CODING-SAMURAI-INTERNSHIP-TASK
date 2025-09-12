// Create icons from Lucide
lucide.createIcons();
// ###########################################################################

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
menuBtn?.addEventListener('click', () => mobileNav.classList.toggle('hidden'));
// rotation animation
menuBtn?.addEventListener('click', () => {
    menuBtn.classList.toggle('rotate-90');
    menuBtn.classList.toggle('duration-300');
});
// return the icon to original position when menu is closed by clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.add('hidden');
        menuBtn.classList.remove('rotate-90');
        menuBtn.classList.remove('duration-300');
    }
});


// ###########################################################################

// Tools marquee animation
    // GSAP animation for marquee effect
const marquee = gsap.fromTo(".tools-track", 
        { x: "100%" }, 
        { 
            x: "-100%",    
            duration: 25,  
            repeat: -1,    
            ease: "linear"
        }
    );
    // Pause on hover over images
    const imgs = document.querySelectorAll(".tools-track img");

    imgs.forEach(img => {
        img.addEventListener("mouseenter", () => {
        marquee.pause(); // Pause animation
        });
        img.addEventListener("mouseleave", () => {
        marquee.resume(); // Resume animation
        });
    });
// ###########################################################################


// dark mode toggle
        // Night mode toggle logic
        const darkModeToggle = document.getElementById('darkModeToggle');
        const darkModeIcon = document.getElementById('darkModeIcon');
        const root = document.documentElement;
        // Helper: set dark mode
        function setDarkMode(on) {
            if (on) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            if (darkModeIcon) {
                    darkModeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path>';

            }
            } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            if (darkModeIcon) {
                darkModeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z"></path>';

            }
            }
        }
        // On page load or when changing themes

        (function() {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            } else {
            setDarkMode(false);
            }
        })();
        // Toggle on click
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
            const isDark = root.classList.contains('dark');
            setDarkMode(!isDark);
            });
        }
// ###########################################################################

// skills section
    document.addEventListener("DOMContentLoaded", () => {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const skillCards = document.querySelectorAll(".skill-card");
    const progresses = document.querySelectorAll(".progress");
    const percentages = [80, 70, 60, 90, 75, 85, 70, 65, 95, 50, 80, 60]; 
    const skillsSection = document.querySelector("#skills");

    // ========= Filtering =========
    filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-filter");
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove("active"));

        // Add active class to clicked button
        btn.classList.add("active");

        //  Filter skill cards
        skillCards.forEach(card => {
        if (category === "all" || card.classList.contains(category)) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
        });
    });
    });



    // ========= Certificate Modal =========
    const modal = document.getElementById("certModal");
    const modalImg = document.getElementById("certImage");
    const closeModal = document.getElementById("closeModal");
    const openBtns = document.querySelectorAll(".open-cert");

    // Open Modal with animation
    openBtns.forEach(btn => {
        btn.addEventListener("click", () => {
        const certSrc = btn.getAttribute("data-cert");
        modalImg.src = certSrc;
        modal.classList.remove("hidden");

        gsap.fromTo("#certImage",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
        );
        });
    });

    // Close Modal with animation
    const closeHandler = () => {
        gsap.to("#certImage", {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => modal.classList.add("hidden")
        });
    };

    closeModal.addEventListener("click", closeHandler);

    // Close when clicking outside content
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeHandler();
    });
    });

// ###########################################################################

// Back to Top Button
    const backToTopBtn = document.getElementById("backToTop");
    // Show/hide button on scroll
    window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
        backToTopBtn.classList.remove("hide", "hidden");
    } else {
        backToTopBtn.classList.add("hide");
        setTimeout(() => {
        if (backToTopBtn.classList.contains("hide")) {
            backToTopBtn.classList.add("hidden");
        }
        }, 300); 
    }
    });
    // Scroll to top on click
    backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    });


// ###########################################################################
// Project filtering functionality
        const filterButtons = document.querySelectorAll('.filter-btn2');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-cat');
                    
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        // Show card with animation
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.classList.add('show');
                        }, 100);
                    } else {
                        // Hide card with animation
                        card.classList.remove('show');
                        card.classList.add('hidden');
                    }
                });
            });
        });
        
        // Intersection Observer for reveal animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe all reveal elements
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
        
        // Add smooth scrolling for any internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Add hover effects for better interactivity
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
// ##############################################################################
    // Set current year in footer
    document.addEventListener('DOMContentLoaded', function() {
        var yearSpan = document.getElementById('footerYear');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    });
// ##############################################################################
