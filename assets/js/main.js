document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll("[data-aos]");
    const counters = document.querySelectorAll("[data-counter]");

    if (!animatedElements.length && !counters.length) {
        return;
    }

    const formatCounterValue = (value, format) => {
        if (format === "compact") {
            if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
            }

            if (value >= 1000) {
                return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
            }
        }

        return new Intl.NumberFormat("en-US").format(Math.round(value));
    };

    const animateCounter = element => {
        if (element.dataset.counted === "true") {
            return;
        }

        element.dataset.counted = "true";

        const target = Number(element.dataset.counter || "0");
        const duration = Number(element.dataset.counterDuration || "1400");
        const suffix = element.dataset.counterSuffix || "";
        const format = element.dataset.counterFormat || "";
        const startTime = performance.now();

        const tick = time => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = target * eased;

            element.textContent = `${formatCounterValue(currentValue, format)}${suffix}`;

            if (progress < 1) {
                window.requestAnimationFrame(tick);
            }
        };

        window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) {
                    continue;
                }

                const delay = Number(entry.target.getAttribute("data-aos-delay") || 0);

                window.setTimeout(() => {
                    entry.target.classList.add("is-visible");
                }, delay);

                currentObserver.unobserve(entry.target);
            }
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -10% 0px",
        },
    );

    animatedElements.forEach(element => observer.observe(element));

    if (counters.length) {
        const counterObserver = new IntersectionObserver(
            (entries, currentObserver) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) {
                        continue;
                    }

                    animateCounter(entry.target);
                    currentObserver.unobserve(entry.target);
                }
            },
            {
                threshold: 0.45,
                rootMargin: "0px 0px -10% 0px",
            },
        );

        counters.forEach(element => counterObserver.observe(element));
    }
});
