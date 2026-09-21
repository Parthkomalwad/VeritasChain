/**
 * Detects file type based on file extension
 * @param {string} fileName - The name of the file
 * @returns {string} - The MIME type of the file
 */
export const getFileTypeFromName = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    // Images
    if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "tiff"].includes(extension)) {
        return "image/" + extension;
    }

    // Videos
    if (["mp4", "webm", "ogg", "mov", "avi", "wmv", "flv", "mkv"].includes(extension)) {
        return "video/" + extension;
    }

    // Audio
    if (["mp3", "wav", "ogg", "aac", "flac", "m4a"].includes(extension)) {
        return "audio/" + extension;
    }

    // Documents
    if (extension === "pdf") return "application/pdf";
    if (["doc", "docx"].includes(extension))
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (["xls", "xlsx"].includes(extension))
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (["ppt", "pptx"].includes(extension))
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation";

    // Code
    if (["json", "js", "ts", "jsx", "tsx", "html", "css", "xml"].includes(extension))
        return "application/code";

    // Archives
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension))
        return "application/archive";

    // Text
    if (["txt", "md", "csv"].includes(extension))
        return "text/plain";

    // Default
    return "application/octet-stream";
};

/**
 * Formats file size in a human-readable format
 * @param {number} bytes - The file size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};