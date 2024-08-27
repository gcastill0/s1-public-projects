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
