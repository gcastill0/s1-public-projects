To configure a trigger in ExtraHop that captures all protocol-specific data fields and sends them to a webhook using the WebHook method, you need to create a trigger script that checks for different protocol events, collects the relevant data, formats it into JSON, and then sends it via an HTTP POST request to your webhook URL.

Below is a step-by-step example that shows how to configure a trigger to capture data for HTTP, DNS, and SSL/TLS protocols and send this data to a webhook.

### Step 1: Access the ExtraHop Web Interface

1. Log in to the ExtraHop Web UI with an account that has administrative privileges.

### Step 2: Create a New Trigger

1. **Navigate to Triggers:**
   - Go to **Settings** > **Triggers** in the ExtraHop Web UI.

2. **Create a New Trigger:**
   - Click **New Trigger** to create a new trigger.

3. **Configure Trigger Details:**
   - **Name:** Give your trigger a descriptive name, e.g., "Export Protocol-Specific Data to Webhook."
   - **Description:** Optionally, add a description of what the trigger does.
   - **Event:** Choose relevant protocol events you want to monitor. For example, you might select `HTTP_REQUEST`, `DNS_REQUEST`, and `SSL_HANDSHAKE_COMPLETE`.

### Step 3: Write the Trigger Script

Here’s an example trigger script that captures data for HTTP, DNS, and SSL/TLS protocols and sends this data to a webhook in JSON format:

```javascript
// Define the webhook URL where the JSON data will be sent
const webhookUrl = "";
const authToken = "";
let jsonData = {
  http: [],
  dns: [],
  ssl: [],
};

// Check for HTTP protocol-specific event
if (HTTP) {
  var httpData = {
    timestamp: HTTP.time.toISOString(),         // Transaction timestamp in ISO format
    protocol: "HTTP",                           // Protocol name
    client_ip: HTTP.client.ipaddr.toString(),   // Client IP address
    server_ip: HTTP.server.ipaddr.toString(),   // Server IP address
    method: HTTP.method,                        // HTTP method (GET, POST, etc.)
    uri: HTTP.uri,                              // URI accessed
    response_code: HTTP.statusCode,             // HTTP response code
    request_headers: HTTP.requestHeader,        // HTTP request headers
    response_headers: HTTP.responseHeader,      // HTTP response headers
    user_agent: HTTP.userAgent,                 // User agent string
    content_type: HTTP.responseContentType,     // Response content type
  };
  jsonData.http.push(httpData);
}

// Check for DNS protocol-specific event
if (DNS) {
  var dnsData = {
    timestamp: DNS.time.toISOString(),          // Transaction timestamp in ISO format
    protocol: "DNS",                            // Protocol name
    client_ip: DNS.client.ipaddr.toString(),    // Client IP address
    server_ip: DNS.server.ipaddr.toString(),    // Server IP address
    query: DNS.qname,                           // DNS query made by the client
    response: DNS.rname,                        // DNS response provided by the server
    query_type: DNS.qtype,                      // Type of DNS query (e.g., A, AAAA, MX)
    ttl: DNS.ttl,                               // Time-to-live value of the DNS response
  };
  jsonData.http.push(dnsData);
}

// Check for SSL/TLS protocol-specific event
if (SSL) {
  var sslData = {
    timestamp: SSL.time.toISOString(),          // Transaction timestamp in ISO format
    protocol: "SSL/TLS",                        // Protocol name
    client_ip: SSL.client.ipaddr.toString(),    // Client IP address
    server_ip: SSL.server.ipaddr.toString(),    // Server IP address
    version: SSL.version,                       // Version of SSL/TLS used in the connection
    cipher_suite: SSL.cipherSuite,              // Cipher suite negotiated for the SSL/TLS connection
    certificate: {
      issuer: SSL.certIssuer,                   // SSL/TLS certificate issuer
      subject: SSL.certSubject,                 // SSL/TLS certificate subject
      valid_from: SSL.certValidFrom,            // SSL/TLS certificate validity start date
      valid_to: SSL.certValidTo,                // SSL/TLS certificate expiry date
    },
  };
  jsonData.ssl.push(sslData);
}

// Convert the JSON object to a string
var jsonString = JSON.stringify(jsonData);

// Send the combined JSON data to the webhook if any data was collected
if (
  jsonData.http.length > 0 ||
  jsonData.dns.length  > 0 ||
  jsonData.ssl.length  > 0
) {
  // Send the JSON data to the webhook URL using an HTTP POST request
  Remote.HTTP(webhookUrl)
    .method("POST")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer " + authToken) // Include the token in the header
    .body(jsonString)
    .send();
}
```

### Step 4: Save and Assign the Trigger

1. **Save the Trigger:**
   - After entering the script, click **Save** to save your trigger configuration.

2. **Assign the Trigger:**
   - You need to assign the trigger to the relevant devices, protocols, or other criteria where you want it to be active. This is done under **Assignments** within the trigger configuration page.
   - Choose the devices or protocols (e.g., HTTP, DNS, SSL/TLS) that the trigger should monitor.

### Step 5: Test the Trigger

1. **Generate Test Traffic:**
   - To ensure the trigger is working correctly, generate some network traffic for HTTP, DNS, and SSL/TLS protocols that matches the trigger’s criteria.

2. **Check Webhook Destination:**
   - Verify that the webhook endpoint is receiving the JSON data correctly. You can use tools like `RequestBin` to create a temporary endpoint for testing purposes and see the data being sent.

### Step 6: Monitor and Adjust

1. **Monitor Trigger Performance:**
   - Keep an eye on the performance of the trigger in the ExtraHop Web UI to ensure it is capturing and exporting data as expected.
   
2. **Adjust as Needed:**
   - Based on your observations, you may need to adjust the trigger script, filter specific transactions, or modify the JSON structure to meet your needs better.

### Summary:

This example trigger script captures protocol-specific data fields for HTTP, DNS, and SSL/TLS protocols and sends the data to a webhook in JSON format. The script checks for each protocol event, constructs a JSON object with the relevant data, and sends it to the specified webhook URL, including an authorization token for secure access. You can modify the script to include other protocols or customize the fields as needed.