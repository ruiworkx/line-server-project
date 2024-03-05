# System Documentation

## How It Works
Having the base file, the system operates by preprocessing it to create an index of byte offsets for each line. This index allows for efficient, constant-time access to any line in the file by seeking directly to the byte offset where the line starts. 
The server, built with Nodejs and Express, listens for incoming GET requests on the /lines/:lineIndex endpoint. After receiving a request, it calculates the start and end offsets for the requested line using the pre-built index and streams the line directly from the file to the client, without loading it into memory. 
This approach minimizes memory usage and allows the system to handle large files and multiple simultaneous requests.

## Performance

### With Large Files

The system should perform well with files of all sizes, including up to 100 GB. The preprocessing step, which creates an index of byte offsets, ensures that accessing any line in the file is an O(1) operation, independent of the file size. Since lines are streamed directly to the client and not loaded entirely into memory, the system's memory footprint remains low, even with large files. 
However, the initial preprocessing time and the size of the index will grow with the file size, which could impact startup times for very large files.

### With Many Users

Nodejs non-blocking I/O model allows the system to handle multiple simultaneous requests efficiently, making it well-suited for high concurrency levels. For small numbers of users (e.g., 100 to 10,000), the system should maintain good performance without significant latency. However, as the number of concurrent users reaches very high levels (1000000), performance may be impacted by factors such as network bandwidth, disk I/O limitations, and the Node.js event loop's ability to handle incoming requests. 
Performance optimizations, such as implementing caching mechanisms or using a load balancer to distribute requests across multiple instances of the service, could help scale the system to support higher loads.

## Resources Consulted

Nodejs Documentation: For understanding Nodejs filesystem and stream APIs.
Stack Overflow: To check different solutions for specific operations
Chatgpt to learn some concepts and give me alternatives

## Third-party Libraries and Tools

Nodejs: Chosen because it's Javascript, which is a language I'm more confortable with, and for its efficient handling of I/O-bound tasks and its suitability for building network applications that require handling multiple simultaneous connections.
Express: Selected for setting up rest apis quickly. It's widely used in the Node.js community, well-documented, and supported.

## Time Spent

Maybe I took a bit more time (about 3/4hours maybe), since it's been a while I worked in backend, and never worked with express. 

## Self-Critique

I think the system is scalable and efficient, but there could be areas to improve:
- Prerpocessing part: although it was necessary for efficiency, it introduced an extra cost in time and storage for the index. Maybe this could be optimized (lazy loading?)
- Maybe higher user loads could strain the system. Implementing a horizontal scaling strategy could help.
- I also could've tested it with bigger file sizes (but didn't have much space available at the time)
- Probably there are more and better ways to implement this, and even though I'm not a backedn developer, it was a great opportunity to learn and apply. Enjoyed doing the challenge.

# How I tested it:

- ran npm install (which is in build.sh also)
- I created a script file-generator, that duplicates the contents of the file 6mbfile.txt a 100 times (ending in a 600mb file) by running node ./file-generator.js, a largerfile.txt was created.
- I ran: run.sh largerfile.txt, which preprocesses the file first, creating an index file largerfile.index.json, and after that it starts the API.
- to test it i ran: curl.exe http://localhost:3000/lines/167 for example
