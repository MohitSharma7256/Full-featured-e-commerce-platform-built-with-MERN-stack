export default function ImageValidator(e) {
    // No files selected
    if (!e.target.files || e.target.files.length === 0) {
        return "Please select at least one image";
    }

    // Check if only ONE file is uploaded
    if (e.target.files.length === 1) {
        const pic = e.target.files[0];

        // Allow only JPEG, PNG, GIF formats
        if (!(['image/jpeg', 'image/png', 'image/gif'].includes(pic.type)))
            return "Invalid image format. Only JPEG, PNG, and GIF are allowed.";

        // Restrict file size to 2MB max
        else if (pic.size > 2 * 1024 * 1024) // 2MB limit
            return "Image is too large. Please upload an image up to 2MB.";

        // No issue → return empty string (means valid)
        else
            return "";
    }
    else {
        // Case: Multiple images uploaded
        let errorMessages = [];

        // Loop through each file one by one
        Array.from(e.target.files).forEach((pic, index) => {

            // Format validation
            if (!(['image/jpeg', 'image/png', 'image/gif'].includes(pic.type)))
                errorMessages.push(`Image ${index + 1}: Invalid format. Only JPEG, PNG, and GIF are allowed.`);

            // Size validation
            else if (pic.size > 2 * 1024 * 1024) // 2MB limit
                errorMessages.push(`Image ${index + 1}: Too large. Max 2MB allowed.`);
        });

        // If there are any errors, join them with line breaks
        // If no errors, return empty string
        return errorMessages.length > 0 ? errorMessages.join("\n") : "";
    }
}