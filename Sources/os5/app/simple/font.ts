/// --------------------------------------------------------------------------------
// Module to use OpenDyslexic font
// --------------------------------------------------------------------------------

export type folder = "chars" | "chars-aod";

/**
 * Print text with images
 * @param text to print
 * @param images to display chars
 */
export function print(text: string, images: ImageElement[], imagesFolder: folder = "chars"): void {
    const max = text.length;
    for (let i = 0; i < images.length; i++) {
        if (i >= max) {
            images[i].style.display = "none";
        } else {
            images[i].style.display = "inline";
            images[i].href = getImage(text, i, imagesFolder);
        }
    }
}

/**
 * Return image url fo a given char
 * @param char 
 */
export function getImage(char: string, index: number = 0, imagesFolder: folder = "chars"): string {
    return `${imagesFolder}/${char.charCodeAt(index)}.png`;
}