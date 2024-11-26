export default function AuthPut(
    url: string,
    data: any,
    errorHandler: (errorMessage?: string) => void,
    accessToken: any,
    responseHandler?: (responseData?: any) => void
) {
    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            // Handle both JSON and non-JSON responses
            if (!response.ok) {
                if (response.headers.get("content-type")?.includes("application/json")) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.error || "An error occurred");
                    });
                } else {
                    return response.text().then((text) => {
                        throw new Error(text || "An unexpected error occurred");
                    });
                }
            }
            return response.json(); // Parse successful JSON responses
        })
        .then((data) => {
            if (responseHandler) {
                responseHandler(data); // Pass the parsed JSON data to the response handler
            }
        })
        .catch((error) => {
            console.error("Request failed:", error);
            errorHandler(error.message || "An unexpected error occurred");
        });
}
