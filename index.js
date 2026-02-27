document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById("image-track");
    const images = document.querySelectorAll(".image");
    
    let startX = 0;
    let isDragging = false;
    const DRAG_THRESHOLD = 10;

    
    const handleOnDown = e => {
        track.dataset.mouseDownAt = e.clientX;
        startX = e.clientX;
        isDragging = false
    };

    const handleOnUp = () => {
        track.dataset.mouseDownAt = "0";  
        track.dataset.prevPercentage = track.dataset.percentage;
    };

    const handleOnMove = e => {
        if (track.dataset.mouseDownAt === "0") return;
        
        if (Math.abs(e.clientX - startX) > DRAG_THRESHOLD) {
            isDragging = true;
        }

        const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
              maxDelta = window.innerWidth / 2;
        
        const percentage = (mouseDelta / maxDelta) * -100,
              nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
              nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
        
        track.dataset.percentage = nextPercentage;
        track.style.transform = `translate(${nextPercentage}%, -50%)`;
        
        for (const image of track.getElementsByClassName("image")) {
            image.style.objectPosition = `${100 + nextPercentage}% center`;
        }
    };

    
    images.forEach((img, index) => {
        img.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = false;
        });

        img.addEventListener('mousemove', (e) => {
            if (Math.abs(e.clientX - startX) > DRAG_THRESHOLD) {
                isDragging = true;
            }
        });

        img.addEventListener('mouseup', (e) => {
            if (!isDragging) {
                e.stopPropagation();
                window.location.href = 'profile.html';
            }
        });

        img.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        img.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = false;
        }, { passive: true });

        img.addEventListener('touchmove', (e) => {
            if (Math.abs(e.touches[0].clientX - startX) > DRAG_THRESHOLD) {
                isDragging = true;
            }
        }, { passive: true });

        img.addEventListener('touchend', (e) => {
            if (!isDragging) {
                e.stopPropagation();
                window.location.href = 'profile.html';
            }
        });
    });

    
    window.addEventListener('mousedown', (e) => {
        if (!e.target.classList.contains('image')) {
            handleOnDown(e);
        }
    });
    
    window.addEventListener('touchstart', (e) => {
        if (!e.target.classList.contains('image')) {
            handleOnDown(e.touches[0]);
        }
    }, { passive: true });
    
    window.onmouseup = (e) => handleOnUp(e);
    window.ontouchend = (e) => handleOnUp(e.touches?.[0] || e);
    window.onmousemove = (e) => handleOnMove(e);
    window.ontouchmove = (e) => handleOnMove(e.touches?.[0] || e);
});