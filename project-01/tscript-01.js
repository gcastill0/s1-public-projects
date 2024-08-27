// Define the webhook URL where the JSON data will be sent
const webhookUrl = '';
const authToken  = '';

// Check if the event is HTTP_REQUEST to capture transaction data
if (HTTP || HTTPS) {
    // Create a JSON object with all relevant transaction data fields
    var jsonData = {
        "timestamp": (HTTP || HTTPS).time.toISOString(),        // Transaction timestamp in ISO format
        "protocol": HTTP ? "HTTP" : "HTTPS",                    // Determine the protocol
        "client_ip": (HTTP || HTTPS).client.ipaddr.toString(),  // Client IP address
        "server_ip": (HTTP || HTTPS).server.ipaddr.toString(),  // Server IP address
        "method": (HTTP || HTTPS).method,                       // HTTP method (GET, POST, etc.)
        "uri": (HTTP || HTTPS).uri,                             // URI accessed
        "response_code": (HTTP || HTTPS).statusCode,            // HTTP response code
        "duration": (HTTP || HTTPS).roundTripTime,              // Transaction duration
        "request_headers": (HTTP || HTTPS).requestHeader,       // HTTP request headers
        "response_headers": (HTTP || HTTPS).responseHeader,     // HTTP response headers
        "user_agent": (HTTP || HTTPS).userAgent,                // User agent string
        "content_type": (HTTP || HTTPS).responseContentType     // Response content type
    };

    // Convert the JSON object to a string
    var jsonString = JSON.stringify(jsonData);

    // Send the JSON data to the webhook URL using an HTTP POST request
    Remote.HTTP(webhookUrl)
        .method('POST')
        .header('Content-Type', 'application/json')
        .header('Authorization', 'Bearer ' + authToken)  // Include the token in the header
        .body(jsonString)
        .send();
}
