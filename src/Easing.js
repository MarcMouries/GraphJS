export function easeInOutQuart(time, from, distance, duration) {
    if ((time /= duration / 2) < 1) {
        return (distance / 2) * time * time * time * time + from;
    } else {
        return (-distance / 2) * ((time -= 2) * time * time * time - 2) + from;
    }
}