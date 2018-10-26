# bobchat-platform
The platform for Bobchat

## System Architecture

This system is built as a Microservice Oriented Architecture (MSOA). Each service is comprised of 

#### Internal Communication
Services communicate internally via [NATS](https://nats.io/) and [protobuffers](https://developers.google.com/protocol-buffers/). Each service subscribes to message topics they are interested in processing. Before publishing a message, the service encodes the request body as a protobuffer. Protobuffers are extremely lightweight (smaller than JSON and XML) and perfect for transporting messages between services. When a service publishes a message, NATS routes the message to the correct processor. The recieving service then processes the message and reports back to the requesting service the results of processing the request. This is an asynchronous [request/response pattern](https://en.wikipedia.org/wiki/Request%E2%80%93response) implemented via [publish/subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) mechanisms. This implentation allows all services to provide the durability of the request/repsonse paradigm while also allowing the flexibility to drop down to the publish/subscribe layer for activities that require it (such as broadcasting via [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), [HTTP Server Push](https://en.wikipedia.org/wiki/HTTP/2_Server_Push), etc) with minimal changes to the system and without special casing.

#### External Communication
Services communicate externally via GraphQL. This is the client application's entrypoint into the system. GraphQL solves several common problems with REST API's including overfetching and underfetching, the N+1 problem, and also provides a declarative type system which simplifies   GraphQL will run as a service in the system. When a request is received, GraphQL will attempt to resolve the request based on a set of rules that define the availabe queries and by which service they can be resolved. This involves dispatching a request to the specified service, modifying the results to match the requested format, and sending the results back to the client. An external broadcasting system will likely be implemented to provide realtime updates to live data.

#### Networking

#### Persistence

#### Scaling


## System Operation

#### Google Cloud Services
#### Docker
[Docker](https://www.docker.com/) is the industry standard in software application containerization technology. At its core, it is lightweight virtualization technology. A Docker container encapsulates a single application and its dependencies providing seperation from the operating and file systems. A container can be run nearly anywhere without having to worry about the underlying system archictecture. Docker is easy to use, has a very active community, is contributed to by some of the largest technology companies in the world, and has first-class orchestration support via Kubernetes. Each of the services in this system will run inside its own Docker container. When changes are made to a service, the service will be containerized, and uploaded to Google Cloud Registry for storage. When a container has been thoroughly tested, it will be deployed to Kubernetes via Helm. Each version of the container is kept longterm as an artifact, allowing us to rollback to specific versions of each service if nessecary. 

#### Kubernetes
[Kubernetes](https://kubernetes.io/) is production-grade container orchestration. Kuberentes facilitates the networking of multiple computers into a computer cluster, allowing us to run many of computers in parallel. Kubernetes defines a set of usable abstractions to make scaling software applications veritcaly and horizontally in the cloud easy. Kubernetes and Docker work hand in hand. Docker abstracts the runtime environment of the application and Kubernetes abstracts the physical compute power and networking protocols required to run the Docker container. Each service in the system will use Kubernetes appilication, networking, and storage abstractions to run and communicate with other parts of the system.

#### Helm
[Helm](https://helm.sh/) is the Kubernetes package manager. Helm facilitates the packaging of application components into Helm Charts, which can be deployed to Kubernetes with a single command. A Helm Chart contains everything Kubernetes needs to run a single service, including information on the Docker container to run, how it should be run, and what other services are relied on. Each service will have its own Helm Chart, and because Helm Charts are composable, it is possible to deploy our entire system with a single command.


## Security

#### Internal Security
TLS Certificates to connect to NATS server.
#### External Security
JWT Tokens, Possibly OIDC in the future


## Monitoring
Monitoring is a multifacted problem spanning system architecture, development, and operations and is paramount in any hyperscale system. You are truly only as good as your monitoring apparatus. Good monitoring tools allow developers and operators to gauge how the system is performing and debug issues in real time.  This systems implements several monitoring tools that provide both granular and broad views of how the system is performing. In some cases, we measure the same metrics more than once to make absolutely sure the system is performing as expected.

#### Distributed Tracing with Jaeger
Tracing allows developers to track a request all the way through the system from start to finish and measure how each subcomponent of the system behaves. Distributed architectures add the complexity of tracing requests between processes boundaries. To solve this, we use [Jaeger](https://www.jaegertracing.io/). Jaeger facilitates transaction monitoring, the measurement of several types of latency, and the tracking of requests between services, all in realtime. Jaeger comes with a monitoring UI to easily interpret the gathered data. The Jaeger backend will run as a service in our system and aggregate the information gathered by other services. Each service will implement Jaeger tracing protocols via the Jaeger client, which simply means that when services make or receive requests, they will include context information that will be reported to the Jaeger backend. 

#### Application Metrics with Prometheus and Grafana
In addition to tracing, it is important to have insight into the amount of stress your system is placing on the hardware it is running on. [Prometheus](https://prometheus.io/) allows us to collect metrics on CPU usage, memory utilization and BLANK on a per container basis to ensure our hardware is application is performing correctly. [Grafana](https://grafana.com/) is a time-series visualation tool that works with prometheus to make the gathered metrics easy to interpret. 

#### Distributed logging with ELK
ElasticSearch, Logstash, and Kibana make up the ELK stack, a solution to distributed log aggregration, storage, and search.


## Analytics

#### Segment
[Segment](https://segment.com/) is analytics gathering platform that allows the tracking of customer actions and transportion of data to around 50 different analysis tools. Segment allows us to track a customers journey through our application, from first page load to checkout and everything in between. The promoters we work with will likely have a prefered method of analyzing customer data, and using Segment allows us to transport their users data to whichever platform they specify. We will also want to analyze user data, and Segment allows us to pick, choose, and change our analysis platform without having to worry about changing how we track user in the application. Segment does all the nessecary transformations before transporting data to an analysis tool. Segement is a granular user analytics tool.

#### Google Analytics
[Google Analytics](https://analytics.google.com/analytics)(GA) facilites the tracking of many important metrics and provides a high level view of how our application is being used. Promoters may also want to upload their own GA tracking code to track how their advertisments are performing and this is something we will support.

#### Facebook Pixel






## Web Client

#### Injected Checkout Widget
## Mobile Client
