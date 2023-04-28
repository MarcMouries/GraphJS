export class Animation {
    static easeInOutQuart(time, from, distance, duration) {
        if ((time /= duration / 2) < 1) {
            return (distance / 2) * time * time * time * time + from;
        } else {
            return (-distance / 2) * ((time -= 2) * time * time * time - 2) + from;
        }
    }

    static animateElement(element, origPoint, destPoint, duration) {
        let startTime = null;
        let requestId;

        let animation = function (currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }
            let runtime = currentTime - startTime;

            let x = Animation.easeInOutQuart(
                runtime,
                origPoint.x,
                destPoint.x - origPoint.x,
                duration
            );
            let y = Animation.easeInOutQuart(
                runtime,
                origPoint.y,
                destPoint.y - origPoint.y,
                duration
            );

            element.style.transform = `translate(${x}px, ${y}px)`;

            if (runtime < duration) {
                requestId = requestAnimationFrame(animation);
            }
        };

        requestId = requestAnimationFrame(animation);

        setTimeout(() => {
            cancelAnimationFrame(requestId);
        }, duration);
    }
}