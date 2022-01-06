export function smoothScroll(target) {
    let scrollContainer = target;
    let headerOffset = 30; // headerOffset is the amount to change to account for the width of the header to not cover whatever you are scrolling to.

    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    let targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop - headerOffset;
    } while (target = target.offsetParent);

    scroll = (c, a, b, i) => {
        i++; if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(() => scroll(c, a, b, i), 20);
    }
    // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}