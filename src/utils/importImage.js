const importImage = (path) => new URL(path, import.meta.url).href;

export default importImage;
